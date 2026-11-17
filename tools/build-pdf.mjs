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
//      Excalidraw panels replace their Mermaid twins (see DIAGRAMS / FIGURES).
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

// Diagram source. Several diagrams exist twice: as a Mermaid block in a
// section and as a hand-drawn Excalidraw file. DIAGRAMS picks which version
// goes into the PDF, so each diagram appears exactly once:
//   excalidraw (default)  Excalidraw where a version exists; Mermaid for the rest
//   mermaid               every diagram from its Mermaid block; no Excalidraw
// Set it with `make build DIAGRAMS=mermaid`, `npm run build -- --diagrams=mermaid`
// or the DIAGRAMS environment variable.
const MODES = ['excalidraw', 'mermaid'];
function diagramMode() {
  const arg = process.argv.find(a => a.startsWith('--diagrams='));
  const mode = (arg ? arg.split('=')[1] : process.env.DIAGRAMS || 'excalidraw').trim().toLowerCase();
  const resolved = mode === 'auto' || mode === '' ? 'excalidraw' : mode;
  if (!MODES.includes(resolved)) throw new Error(`Unknown diagram mode "${mode}". Use one of: ${MODES.join(', ')}`);
  return resolved;
}

// Excalidraw panels and the Mermaid blocks they stand in for. `mermaid` lists
// 1-based positions of ```mermaid blocks in the section file `in`; in
// excalidraw mode the figure takes the place of the first listed block and the
// others are dropped. `panel` crops one panel out of a multi-panel .excalidraw
// file: elements whose centre lies inside the box are kept.
const FIGURES = [
  { diagram: '00-uber-chart', in: 'sections/0.md', mermaid: [1, 2], caption: 'The uber chart: the deterministic spine with each stage’s agents and rungs' },
  { diagram: 'II.2-grilling-loop', id: 'II.2-deterministic', in: 'sections/II.2.md', mermaid: [1], panel: { xMax: 950 }, caption: 'II.2 Requirements: deterministic flow' },
  { diagram: 'II.2-grilling-loop', id: 'II.2-agentified', in: 'sections/II.2.md', mermaid: [2], panel: { xMin: 950 }, caption: 'II.2 Requirements: with the grilling agent' },
  { diagram: 'II.9-safe-deployment', id: 'II.9-deterministic', in: 'sections/II.9.md', mermaid: [1], panel: { xMax: 1050 }, caption: 'II.9 Deploy: deterministic ring flow' },
  { diagram: 'II.9-safe-deployment', id: 'II.9-agentified', in: 'sections/II.9.md', mermaid: [2], panel: { xMin: 1050 }, caption: 'II.9 Deploy: agentified' },
  { diagram: 'III-trust-ladder', id: 'III-ladder', in: 'sections/III.md', mermaid: [1], panel: { yMax: 700 }, caption: 'III.1 The autonomy ladder' },
  { diagram: 'III-trust-ladder', id: 'III-roadmap', in: 'sections/III.md', mermaid: [2], panel: { yMin: 700 }, caption: 'III.4 The roadmap' },
  { diagram: 'V.1-service-catalog', id: 'V.1-model', in: 'sections/V.1.md', mermaid: [1], panel: { xMax: 1050, yMax: 700 }, caption: 'V.1 Catalog model' },
  { diagram: 'V.1-service-catalog', id: 'V.1-reverse-lookup', in: 'sections/V.1.md', mermaid: [2], panel: { xMin: 1050, yMax: 700 }, caption: 'V.1 Reverse-dependency lookup' },
  { diagram: 'V.1-service-catalog', id: 'V.1-upkeep', in: 'sections/V.1.md', mermaid: [3], panel: { yMin: 700 }, caption: 'V.1 Catalog upkeep with agents' },
  { diagram: 'V.2-reference-architecture', in: 'sections/V.2.md', mermaid: [1], caption: 'V.2 Component map' },
].map(f => ({ ...f, id: f.id || f.diagram }));

// Replace (or keep) the Mermaid blocks of one section file according to mode.
function applyDiagramMode(md, file, mode) {
  const figs = FIGURES.filter(f => f.in === file);
  if (!figs.length || mode === 'mermaid') return md;
  const lines = md.split('\n');
  const out = [];
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*```mermaid\s*$/.test(lines[i])) { out.push(lines[i]); continue; }
    n++;
    let j = i + 1;
    while (j < lines.length && !/^\s*```\s*$/.test(lines[j])) j++;
    const fig = figs.find(f => f.mermaid.includes(n));
    if (!fig) { out.push(...lines.slice(i, j + 1)); }
    else if (fig.mermaid[0] === n) {
      out.push(`<figure class="excalidraw" data-diagram="${fig.id}"><img src="diagrams/${fig.id}.svg" alt="${fig.caption}"><figcaption>Figure: ${fig.caption}</figcaption></figure>`);
    }
    i = j;
  }
  for (const f of figs) {
    if (Math.max(...f.mermaid) > n) throw new Error(`${file} has ${n} Mermaid blocks; FIGURES entry ${f.id} expects block ${Math.max(...f.mermaid)}`);
  }
  return out.join('\n');
}

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
function assemble(mode) {
  const parts = [];
  for (const item of ORDER) {
    let md = read(item.file);
    md = applyDiagramMode(md, item.file, mode);
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
  fs.mkdirSync(OUT, { recursive: true });
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

    // 2. Excalidraw -> SVG, one file per figure (panel), only in excalidraw mode.
    const mode = diagramMode();
    console.log(`mode     DIAGRAMS=${mode}`);
    fs.rmSync(path.join(OUT, 'diagrams'), { recursive: true, force: true });
    if (mode === 'excalidraw') {
      fs.mkdirSync(path.join(OUT, 'diagrams'), { recursive: true });
      await page.goto(`${base}/package.json`);
      for (const fig of FIGURES) {
        const scene = JSON.parse(fs.readFileSync(path.join(DOC, 'diagrams', fig.diagram + '.excalidraw'), 'utf8'));
        const p = { xMin: -Infinity, xMax: Infinity, yMin: -Infinity, yMax: Infinity, ...(fig.panel || {}) };
        const inPanel = e => {
          const cx = e.x + (e.width || 0) / 2, cy = e.y + (e.height || 0) / 2;
          return cx >= p.xMin && cx < p.xMax && cy >= p.yMin && cy < p.yMax;
        };
        const elements = scene.elements.filter(e => !e.isDeleted && inPanel(e));
        if (!elements.length) throw new Error(`Panel of ${fig.id} is empty; check its FIGURES panel box`);
        const svg = await page.evaluate(async ({ elements, scene, base }) => {
          window.EXCALIDRAW_ASSET_PATH = base + '/node_modules/@excalidraw/utils/dist/prod/';
          const ex = await import(base + '/node_modules/@excalidraw/utils/dist/prod/index.js');
          const el = await ex.exportScene({
            type: 'svg',
            data: { elements, appState: { ...(scene.appState || {}), viewBackgroundColor: '#ffffff' }, files: scene.files || {} },
            config: { canvasBackgroundColor: '#ffffff', padding: 16, theme: 'light' },
          });
          return el.outerHTML;
        }, { elements, scene, base });
        fs.writeFileSync(path.join(OUT, 'diagrams', fig.id + '.svg'), svg);
        console.log(`diagram  ${fig.diagram}.excalidraw${fig.panel ? ' (panel)' : ''} -> published/diagrams/${fig.id}.svg`);
      }
    }

    // 1 + 3. Assemble and convert
    const md = assemble(mode);
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
    const figures = (md.match(/<figure class="excalidraw"/g) || []).length;
    console.log(`mermaid  ${mermaidResult.rendered}/${mermaidResult.total} blocks rendered; excalidraw figures: ${figures}`);
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
