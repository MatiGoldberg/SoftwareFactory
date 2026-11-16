#!/usr/bin/env node
// Builds the assembled document into one PDF.
//
//   npm run build            (or: make build)
//
// Steps:
//   1. Assemble document/sections/*.md in document order (see ORDER below,
//      which follows document/00-skeleton.md and the published Claude Doc).
//   2. Render every document/diagrams/*.excalidraw to SVG (published/diagrams/).
//   3. Convert the Markdown to HTML; Mermaid blocks are rendered by Mermaid,
//      Excalidraw figures are placed at the spots listed in FIGURES.
//   4. Print to PDF with headless Chromium: published/<OUT_NAME>.pdf
//
// Everything runs locally from node_modules; no network access is needed.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = path.join(ROOT, 'document');
const OUT = path.join(ROOT, 'published');
const OUT_NAME = 'agentic-pdlc';
const TITLE = 'The Agentic PDLC: building a software factory around a high-scale service';

// ---------------------------------------------------------------------------
// Document order. `file` is relative to document/. `demote` pushes every
// heading down one level (for sections that sit under a Part heading).
// `before` inserts Markdown ahead of the file (Part headings and intros).
// ---------------------------------------------------------------------------
const PDLC_STAGES = Array.from({ length: 12 }, (_, i) => `sections/II.${i + 1}.md`);
const ORDER = [
  { file: 'sections/0.md' },
  { file: 'sections/I.md' },
  ...PDLC_STAGES.map((file, i) => ({
    file,
    demote: true,
    before: i === 0
      ? '## Part II: The PDLC reference model\n\nEach stage zooms into one box of the uber chart in 0.4 and follows the same template: Purpose, the ideal deterministic process, the real-world reference it leans on, what to agentify and how far, enterprise complications, and requirements. Open gaps for every stage are collected in Appendix C.\n'
      : '',
  })),
  { file: 'sections/III.md' },
  { file: 'sections/IV.md' },
  {
    file: 'sections/V.1.md',
    demote: true,
    before: '## Part V: Factory reference architecture\n\nV.1 defines the service catalog that every stage relies on; V.2 covers the other components a factory needs and how they fit.\n',
  },
  { file: 'sections/V.2.md', demote: true },
  { file: 'sections/VI.md' },
  { file: 'sections/VII.md' },
  { file: 'sections/A-glossary.md' },
  { file: 'references.md', retitle: '## Appendix B: References' },
  { file: 'sections/C-gaps.md' },
  // Appendix D: the kit's intro, then D1, then D2 to D11.
  { file: 'sections/D-kit.md', insertBeforeHeading: { heading: 'D2 ', file: 'sections/D1-prd-template.md', demote: true } },
  { file: 'sections/E-requirements.md' },
];

// Per-section "Open gaps" lists are folded into Appendix C, so they are
// dropped from the sections (as in the Claude Doc).
const STRIP_HEADINGS = ['Open gaps'];

// Excalidraw figures: placed at the end of the subsection whose heading
// starts with `after`, inside the section file `in`.
const FIGURES = [
  { diagram: '00-uber-chart', in: 'sections/0.md', after: '0.4 The uber chart', caption: 'The uber chart: the deterministic spine and the agent layer' },
  { diagram: 'II.2-grilling-loop', in: 'sections/II.2.md', after: 'What to agentify', caption: 'II.2 Requirements: the grilling loop' },
  { diagram: 'II.9-safe-deployment', in: 'sections/II.9.md', after: 'What to agentify', caption: 'II.9 Deploy: rings, bake and automatic halt' },
  { diagram: 'III-trust-ladder', in: 'sections/III.md', after: 'III.4 The roadmap', caption: 'III: the autonomy ladder and the roadmap' },
  { diagram: 'V.1-service-catalog', in: 'sections/V.1.md', after: 'The reverse dependency graph', caption: 'V.1 The service catalog and its reverse dependency graph' },
  { diagram: 'V.2-reference-architecture', in: 'sections/V.2.md', after: 'Component map', caption: 'V.2 Component map' },
];

// ---------------------------------------------------------------------------
// Markdown helpers (all fence-aware, so headings inside code blocks such as
// the AGENTS.md template are left alone).
// ---------------------------------------------------------------------------
function scan(lines) {
  // Returns [{line, idx, heading: {level, text} | null}]
  let fence = null;
  return lines.map((line, idx) => {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      return { line, idx, heading: null };
    }
    if (fence) return { line, idx, heading: null };
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    return { line, idx, heading: h ? { level: h[1].length, text: h[2].trim() } : null };
  });
}

function demote(md) {
  return scan(md.split('\n')).map(r => (r.heading ? '#' + r.line : r.line)).join('\n');
}

function stripSections(md, names) {
  const rows = scan(md.split('\n'));
  const out = [];
  let skipLevel = 0;
  for (const r of rows) {
    if (r.heading) {
      if (skipLevel && r.heading.level <= skipLevel) skipLevel = 0;
      if (!skipLevel && names.some(n => r.heading.text.startsWith(n))) { skipLevel = r.heading.level; continue; }
    }
    if (!skipLevel) out.push(r.line);
  }
  return out.join('\n');
}

// Insert `block` just before the first heading (at or above the matched
// heading's level) that follows the heading starting with `after`.
function insertAfterSubsection(md, after, block) {
  const rows = scan(md.split('\n'));
  const start = rows.find(r => r.heading && r.heading.text.startsWith(after));
  if (!start) throw new Error(`Figure anchor not found: "${after}"`);
  const end = rows.find(r => r.idx > start.idx && r.heading && r.heading.level <= start.heading.level);
  const lines = md.split('\n');
  const at = end ? end.idx : lines.length;
  lines.splice(at, 0, '', block, '');
  return lines.join('\n');
}

function insertBeforeHeading(md, headingPrefix, block) {
  const rows = scan(md.split('\n'));
  const hit = rows.find(r => r.heading && r.heading.text.startsWith(headingPrefix));
  if (!hit) throw new Error(`Heading not found: "${headingPrefix}"`);
  const lines = md.split('\n');
  lines.splice(hit.idx, 0, block, '');
  return lines.join('\n');
}

function read(rel) {
  return fs.readFileSync(path.join(DOC, rel), 'utf8').replace(/\r\n/g, '\n');
}

// ---------------------------------------------------------------------------
// 1. Assemble
// ---------------------------------------------------------------------------
function assemble() {
  const parts = [];
  for (const item of ORDER) {
    let md = read(item.file);
    for (const fig of FIGURES.filter(f => f.in === item.file)) {
      md = insertAfterSubsection(md, fig.after,
        `<figure class="excalidraw" data-diagram="${fig.diagram}"><img src="diagrams/${fig.diagram}.svg" alt="${fig.caption}"><figcaption>Figure: ${fig.caption}</figcaption></figure>`);
    }
    if (item.insertBeforeHeading) {
      const sub = item.insertBeforeHeading;
      let inner = read(sub.file);
      if (sub.demote) inner = demote(inner);
      md = insertBeforeHeading(md, sub.heading, inner);
    }
    if (item.retitle) md = md.replace(/^#{1,6} .*$/m, item.retitle);
    md = stripSections(md, STRIP_HEADINGS);
    if (item.demote) md = demote(md);
    parts.push((item.before ? item.before + '\n' : '') + md.trim() + '\n');
  }
  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Static server over the repo root, so the browser can load node_modules,
// fonts and the generated files without network access.
// ---------------------------------------------------------------------------
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.css': 'text/css', '.json': 'application/json', '.map': 'application/json' };
function serve() {
  const server = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
function slug(s) { return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function toHtml(md, meta) {
  const toc = [];
  const used = new Set();
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    if (lang === 'mermaid') return `<div class="mermaid-wrap"><pre class="mermaid">${escapeHtml(text)}</pre></div>`;
    return `<pre><code>${escapeHtml(text)}</code></pre>`;
  };
  renderer.heading = function ({ tokens, depth, text }) {
    const inner = this.parser.parseInline(tokens);
    let id = slug(text); while (used.has(id)) id += '-x'; used.add(id);
    if (depth === 2 || depth === 3) toc.push({ depth, id, inner });
    return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
  };
  const body = marked.parse(md, { renderer, gfm: true });
  const tocHtml = toc.map(t => `<li class="toc-${t.depth}"><a href="#${t.id}">${t.inner}</a></li>`).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${TITLE}</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  html { font-size: 10.5pt; }
  body { font-family: "Segoe UI", "Helvetica Neue", Arial, "Liberation Sans", sans-serif; color: #1b1b1b; line-height: 1.45; margin: 0; }
  .cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .cover h1 { font-size: 28pt; line-height: 1.15; margin: 0 0 12mm; }
  .cover .meta { color: #555; font-size: 11pt; }
  nav.toc { page-break-after: always; }
  nav.toc ul { list-style: none; padding: 0; columns: 1; }
  nav.toc li.toc-2 { font-weight: 600; margin-top: 6px; }
  nav.toc li.toc-3 { margin-left: 16px; font-size: 9.5pt; }
  nav.toc a { color: inherit; text-decoration: none; }
  h2 { font-size: 18pt; margin: 0 0 10px; padding-top: 4px; border-bottom: 2px solid #2b5797; page-break-before: always; }
  h3 { font-size: 13.5pt; margin: 18px 0 6px; color: #2b5797; page-break-after: avoid; }
  h4 { font-size: 11.5pt; margin: 14px 0 4px; page-break-after: avoid; }
  h5, h6 { font-size: 10.5pt; margin: 10px 0 4px; }
  /* Part II and V: their first stage heading follows the Part heading on the same page */
  h2 + p + h3 { page-break-before: auto; }
  p, li { orphans: 3; widows: 3; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 8.8pt; page-break-inside: auto; }
  tr { page-break-inside: avoid; }
  th, td { border: 1px solid #c8c8c8; padding: 3px 5px; vertical-align: top; text-align: left; }
  th { background: #eef2f8; }
  td { overflow-wrap: anywhere; }
  code { font-family: "Cascadia Code", Consolas, "Liberation Mono", monospace; font-size: 0.88em; background: #f3f3f3; padding: 0 2px; }
  pre { background: #f6f6f6; border: 1px solid #e2e2e2; padding: 6px 8px; font-size: 8pt; white-space: pre-wrap; overflow-wrap: anywhere; }
  pre code { background: none; padding: 0; font-size: inherit; }
  a { color: #2b5797; }
  .mermaid-wrap { page-break-inside: avoid; margin: 10px 0; text-align: center; }
  pre.mermaid { background: none; border: none; padding: 0; font-size: 10pt; white-space: pre; }
  pre.mermaid svg { max-width: 100% !important; height: auto; max-height: 235mm; }
  figure.excalidraw { page-break-inside: avoid; margin: 12px 0; text-align: center; }
  figure.excalidraw img { max-width: 100%; max-height: 225mm; }
  figcaption { font-size: 9pt; color: #555; margin-top: 4px; font-style: italic; }
</style></head>
<body>
<section class="cover"><h1>${TITLE}</h1>
<div class="meta">Built ${meta.date} from commit ${meta.commit}<br>Source: github.com/MatiGoldberg/SoftwareFactory</div></section>
<nav class="toc"><h1 style="font-size:18pt">Contents</h1><ul>${tocHtml}</ul></nav>
<main>
${body}
</main>
</body></html>`;
}

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function gitMeta() {
  const date = new Date().toISOString().slice(0, 10);
  let commit = 'uncommitted';
  try {
    commit = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
    if (execSync('git status --porcelain -- document', { cwd: ROOT }).toString().trim()) commit += ' (with local edits)';
  } catch { /* not a git checkout */ }
  return { date, commit };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  fs.mkdirSync(path.join(OUT, 'diagrams'), { recursive: true });
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const launch = { headless: true };
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(launch);
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => {
      // Excalidraw falls back from a web worker to the main thread for font subsetting; harmless.
      if (m.type() === 'error' && !m.text().includes('Failed to use workers for subsetting')) errors.push(m.text());
    });

    // 2. Excalidraw -> SVG
    await page.goto(`${base}/package.json`);
    const diagrams = fs.readdirSync(path.join(DOC, 'diagrams')).filter(f => f.endsWith('.excalidraw')).sort();
    for (const f of diagrams) {
      const scene = JSON.parse(fs.readFileSync(path.join(DOC, 'diagrams', f), 'utf8'));
      const svg = await page.evaluate(async ({ scene, base }) => {
        window.EXCALIDRAW_ASSET_PATH = base + '/node_modules/@excalidraw/utils/dist/prod/';
        const ex = await import(base + '/node_modules/@excalidraw/utils/dist/prod/index.js');
        const el = await ex.exportScene({
          type: 'svg',
          data: {
            elements: scene.elements.filter(e => !e.isDeleted),
            appState: { ...(scene.appState || {}), viewBackgroundColor: '#ffffff' },
            files: scene.files || {},
          },
          config: { canvasBackgroundColor: '#ffffff', padding: 16, theme: 'light' },
        });
        return el.outerHTML;
      }, { scene, base });
      fs.writeFileSync(path.join(OUT, 'diagrams', f.replace(/\.excalidraw$/, '.svg')), svg);
      console.log(`diagram  ${f} -> published/diagrams/${f.replace(/\.excalidraw$/, '.svg')}`);
    }
    for (const fig of FIGURES) {
      if (!fs.existsSync(path.join(OUT, 'diagrams', fig.diagram + '.svg'))) throw new Error(`Missing diagram for figure: ${fig.diagram}`);
    }

    // 1 + 3. Assemble and convert
    const md = assemble();
    fs.writeFileSync(path.join(OUT, `${OUT_NAME}.md`), md);
    const html = toHtml(md, gitMeta());
    const htmlPath = path.join(OUT, `${OUT_NAME}.html`);
    fs.writeFileSync(htmlPath, html);

    // Render Mermaid in the page, then print.
    await page.goto(`${base}/published/${OUT_NAME}.html`, { waitUntil: 'load' });
    const mermaidResult = await page.evaluate(async (base) => {
      const { default: mermaid } = await import(base + '/node_modules/mermaid/dist/mermaid.esm.min.mjs');
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose', flowchart: { htmlLabels: true, useMaxWidth: true } });
      const nodes = [...document.querySelectorAll('pre.mermaid')];
      const failed = [];
      for (const [i, n] of nodes.entries()) {
        try { await mermaid.run({ nodes: [n] }); } catch (e) { failed.push(`#${i + 1}: ${e.message || e}`); }
      }
      await Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
      const brokenImages = [...document.images].filter(img => !img.naturalWidth).map(img => img.getAttribute('src'));
      return { total: nodes.length, rendered: document.querySelectorAll('pre.mermaid svg').length, failed, brokenImages };
    }, base);
    console.log(`mermaid  ${mermaidResult.rendered}/${mermaidResult.total} blocks rendered`);
    if (mermaidResult.failed.length) throw new Error('Mermaid failures:\n' + mermaidResult.failed.join('\n'));
    if (mermaidResult.brokenImages.length) throw new Error('Images failed to load: ' + mermaidResult.brokenImages.join(', '));

    await page.emulateMedia({ media: 'print' });
    const pdfPath = path.join(OUT, `${OUT_NAME}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-size:8px;color:#777;width:100%;padding:0 16mm;display:flex;justify-content:space-between;"><span>${TITLE.split(':')[0]}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
      outline: true,
      tagged: true,
    });
    console.log(`pdf      published/${OUT_NAME}.pdf (${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(1)} MB)`);
    if (errors.length) console.warn('browser messages:\n  ' + errors.join('\n  '));
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(e => { console.error(e.message || e); process.exit(1); });
