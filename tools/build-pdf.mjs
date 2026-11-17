#!/usr/bin/env node
// Builds the assembled document into one versioned PDF.
//
//   make build [DIAGRAMS=excalidraw|mermaid]
//   node tools/build-pdf.mjs [--diagrams excalidraw|mermaid] [--help]
//
// Steps (each is traced on the console):
//   1. Check inputs                 5. Render HTML, fonts and Mermaid diagrams
//   2. Start headless Chromium      6. Print PDF (two passes, for contents page numbers)
//   3. Render Excalidraw figures    7. Add running headers, page numbers and metadata
//   4. Assemble sections (ORDER)    8. Copy the PDF to its stable "latest" name
//
// Look and feel: assets/theme.css, assets/logo.svg, assets/fonts/ (see README).
//
// Each run writes to its own folder, published/builds/<date>_<time>_<commit>_<mode>/,
// so earlier builds are never overwritten.
// Everything runs locally from node_modules; no network access is needed.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright';
import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = path.join(ROOT, 'document');
const OUT = path.join(ROOT, 'published');
const OUT_NAME = 'agentic-pdlc';
const TITLE = 'The Agentic PDLC: building a software factory around a high-scale service';
const SHORT_TITLE = TITLE.split(':')[0];

// Look and feel. The theme (colours, fonts, headings, tables, callouts) is
// assets/theme.css; the cover logo is assets/logo.svg (a logo.png there is used
// instead when no logo.svg exists). Fonts are bundled in assets/fonts/.
const ASSETS = path.join(ROOT, 'assets');
const THEME = path.join(ASSETS, 'theme.css');
const LOGO = ['logo.svg', 'logo.png'].map(f => path.join(ASSETS, f)).find(f => fs.existsSync(f)) || path.join(ASSETS, 'logo.svg');
// Header and footer text is drawn onto the printed PDF with these (TrueType, so they can be subset).
const STAMP_FONTS = { regular: 'Inter-Regular.ttf', semibold: 'Inter-SemiBold.ttf', bold: 'Inter-Bold.ttf' };

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

// ---------------------------------------------------------------------------
// Command line. Strict: anything not listed here stops the build with usage.
// ---------------------------------------------------------------------------
// Diagram source. Twelve diagrams exist twice: as a Mermaid block in a section
// and as a hand-drawn Excalidraw panel. The mode picks one version of each:
//   excalidraw (default)  Excalidraw where a version exists; Mermaid for the rest
//   mermaid               every diagram from its Mermaid block; no Excalidraw
const MODES = ['excalidraw', 'mermaid'];

const BANNER = String.raw`
   +------------------------------------------------------+
   |   [spec] --> [code] --> [verify] --> [ship]  ==> PDF |
   |        S O F T W A R E   F A C T O R Y   build       |
   +------------------------------------------------------+`;

const USAGE = `Usage: node tools/build-pdf.mjs [options]
       make build [DIAGRAMS=excalidraw|mermaid]

Builds the assembled document into a versioned PDF under published/builds/.

Options:
  -d, --diagrams <mode>   Diagram source, one of: ${MODES.join(', ')}
                          excalidraw (default): Excalidraw figures where they
                            exist, Mermaid for diagrams that only exist in Mermaid
                          mermaid: every diagram from its Mermaid block
  -h, --help              Show this help and exit

Environment:
  DIAGRAMS                Same as --diagrams, used when the option is not given
  CHROMIUM_PATH           Use this Chromium instead of Playwright's

Output (never overwritten; a new folder per run):
  published/builds/<date>_<time>_<commit>_<mode>/${'agentic-pdlc'}_<date>_<time>_<mode>.pdf
  plus the assembled .md, .html and diagram SVGs in the same folder.
  The newest build of each mode is also copied to a stable name:
  published/agentic-pdlc.pdf (excalidraw) and published/agentic-pdlc-mermaid.pdf.`;

class UsageError extends Error {}

function parseArgs(argv) {
  const opts = { help: false, diagrams: null };
  const known = ['--diagrams', '-d', '--help', '-h'];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') { opts.help = true; continue; }
    let name = arg, value;
    const eq = arg.indexOf('=');
    if (arg.startsWith('--') && eq > 0) { name = arg.slice(0, eq); value = arg.slice(eq + 1); }
    if (name === '--diagrams' || name === '-d') {
      if (value === undefined) {
        value = argv[++i];
        if (value === undefined || value.startsWith('-')) throw new UsageError(`${name} needs a value: one of ${MODES.join(', ')}`);
      }
      if (opts.diagrams !== null) throw new UsageError(`${name} given more than once`);
      if (!MODES.includes(value)) throw new UsageError(`unknown diagram mode "${value}" for ${name}; use one of: ${MODES.join(', ')}`);
      opts.diagrams = value;
      continue;
    }
    const near = known.find(k => k.toLowerCase() === name.toLowerCase());
    if (near) throw new UsageError(`unknown option "${name}"; options are case-sensitive, did you mean "${near}"?`);
    if (arg.startsWith('-')) throw new UsageError(`unknown option "${arg}"`);
    throw new UsageError(`unexpected argument "${arg}"; this script takes no positional arguments`);
  }
  // `npm run build --diagrams=x` (without the extra --) hands the flag to npm, not to us.
  for (const k of Object.keys(process.env)) {
    if (/^npm_config_(diagrams|d)$/i.test(k)) throw new UsageError(`npm swallowed "--${k.slice(11)}"; put "--" before script options: npm run build -- --diagrams=${process.env[k] === 'true' ? '<mode>' : process.env[k]}`);
  }
  if (opts.diagrams === null && process.env.DIAGRAMS !== undefined && process.env.DIAGRAMS !== '') {
    const env = process.env.DIAGRAMS;
    if (!MODES.includes(env)) throw new UsageError(`unknown diagram mode "${env}" in the DIAGRAMS environment variable; use one of: ${MODES.join(', ')}`);
    opts.diagrams = env;
  }
  opts.diagrams ??= 'excalidraw';
  return opts;
}

// Step tracer: "[2/7] Render Excalidraw ... done (1.2s)"
function tracer(total) {
  let n = 0;
  return async (title, fn) => {
    n++;
    const t0 = Date.now();
    console.log(`\n[${n}/${total}] ${title}`);
    const result = await fn(msg => console.log(`      ${msg}`));
    console.log(`      done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    return result;
  };
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

// Callout boxes. Markdown convention: a blockquote whose first paragraph starts
// with one of these bold labels, e.g. "> **Takeaway:** text". Other blockquotes
// render as plain quotes.
const CALLOUTS = {
  Takeaway: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1.3 1.7 1.4 2.5h5.2c.1-.8.6-1.7 1.4-2.5A6 6 0 0 0 12 3z"/></svg>',
  Note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  Tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>',
  Warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
};
const CALLOUT_RE = new RegExp(`^<p><strong>(${Object.keys(CALLOUTS).join('|')}):</strong>\\s*`);

// "Part II: The PDLC reference model" -> label + title (Part and appendix openers)
function splitPart(text) {
  const m = text.match(/^((?:Part|Appendix)\s+[0-9IVX]+|Appendix\s+[A-Z])\s*:\s*(.+)$/);
  return m ? { lbl: m[1], title: m[2] } : { lbl: '', title: text };
}
// "II.2 Requirements" / "0.1 Executive summary" / "D3 AGENTS.md template" -> number + title
function splitNumber(html) {
  const m = html.match(/^((?:[0-9]+|[IVX]+)(?:\.[0-9]+)+|[A-Z][0-9]{1,2})\s+(.+)$/s);
  return m ? { num: m[1], rest: m[2] } : { num: '', rest: html };
}
const plain = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function toHtml(md, meta, mode) {
  const toc = [];
  const used = new Set();
  const counts = Object.fromEntries(Object.keys(CALLOUTS).map(k => [k, 0]));
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    if (lang === 'mermaid') return `<div class="mermaid-wrap"><pre class="mermaid">${escapeHtml(text)}</pre></div>`;
    return `<pre><code>${escapeHtml(text)}</code></pre>`;
  };
  renderer.blockquote = function ({ tokens }) {
    const inner = this.parser.parse(tokens);
    const m = inner.match(CALLOUT_RE);
    if (!m) return `<blockquote>${inner}</blockquote>\n`;
    counts[m[1]]++;
    return `<aside class="callout ${m[1].toLowerCase()}"><div class="callout-title">${CALLOUTS[m[1]]}${m[1]}</div>${inner.replace(CALLOUT_RE, '<p>')}</aside>\n`;
  };
  renderer.heading = function ({ tokens, depth, text }) {
    const inner = this.parser.parseInline(tokens);
    let id = slug(text); while (used.has(id)) id += '-x'; used.add(id);
    let html = inner, cls = '', data = '';
    if (depth === 2) {
      const { lbl, title } = splitPart(plain(inner));
      if (lbl) html = `<span class="lbl">${lbl}<span class="sep">: </span></span>${escapeHtml(title)}`;
      data = ` data-lbl="${escapeAttr(lbl)}" data-title="${escapeAttr(title)}"`;
      toc.push({ depth, id, lbl, inner: lbl ? escapeHtml(title) : inner });
    } else if (depth === 3) {
      const { num, rest } = splitNumber(inner);
      if (num) html = `<span class="num">${num}</span>${rest}`;
      if (/^(II|V)\.\d+$/.test(num)) cls = ' class="stage"';
      data = ` data-title="${escapeAttr(plain(inner))}"`;
      toc.push({ depth, id, num, inner: num ? rest : inner });
    }
    return `<h${depth} id="${id}"${cls}${data}>${html}</h${depth}>\n`;
  };
  const body = marked.parse(md, { renderer, gfm: true })
    // "Figure: caption" -> styled label
    .replace(/<figcaption>Figure:\s*/g, '<figcaption><b>Figure</b>');
  const tocHtml = toc.map(t => {
    const lead = t.depth === 2 ? (t.lbl ? `<span class="lbl">${t.lbl}</span>` : '') : (t.num ? `<span class="num">${t.num}</span>` : '');
    return `<li class="toc-${t.depth}"><a href="#${t.id}"><span class="t">${lead}${t.inner}</span><span class="dots"></span><span class="pg" data-for="${t.id}">000</span></a></li>`;
  }).join('\n');
  const css = fs.readFileSync(THEME, 'utf8');
  const [main, ...sub] = TITLE.split(':');
  const subtitle = sub.join(':').trim();
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${TITLE}</title>
<style>
${css}
</style></head>
<body>
<section class="cover">
  <div class="band">
    <div class="kicker">Software Factory</div>
    <h1>${escapeHtml(main)}<span class="sub">${escapeHtml(subtitle.charAt(0).toUpperCase() + subtitle.slice(1))}</span></h1>
  </div>
  <div class="art"><img src="/${path.relative(ROOT, LOGO).split(path.sep).join('/')}" alt="logo"></div>
  <div class="meta">
    <div class="brand">SOFTWARE<span>FACTORY</span></div>
    <div class="build">Built ${meta.date} from commit <code>${escapeHtml(meta.commit)}</code><br>Diagrams: ${mode}<br>github.com/MatiGoldberg/SoftwareFactory</div>
  </div>
</section>
<nav class="toc"><h1>Contents</h1><ul>${tocHtml}</ul></nav>
<main>
${body}
</main>
</body></html>`;
  return { html, callouts: counts };
}

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

// Mermaid colours follow the theme: deep blue nodes and lines, orange for agents
// (the sections' own classDef colours still apply). Font size stays Mermaid's
// default 16px, the size tools/validate.js checks readability against.
const MERMAID_THEME = {
  fontFamily: 'Inter, sans-serif', fontSize: '16px',
  primaryColor: '#EAF0F8', primaryBorderColor: '#1F4E8C', primaryTextColor: '#0B2D5B',
  secondaryColor: '#FDF1E6', secondaryBorderColor: '#E8710A', tertiaryColor: '#F5F8FC', tertiaryBorderColor: '#B8C7DC',
  lineColor: '#3D5F8C', textColor: '#1D2633', mainBkg: '#EAF0F8', nodeBorder: '#1F4E8C',
  clusterBkg: '#F5F8FC', clusterBorder: '#B8C7DC', titleColor: '#0B2D5B', edgeLabelBackground: '#FFFFFF',
  actorBkg: '#EAF0F8', actorBorder: '#1F4E8C', noteBkgColor: '#FDF1E6', noteBorderColor: '#E8710A',
};
// A diagram moves to a landscape page when that prints it at least this many times larger.
const LANDSCAPE_GAIN = 1.25;

// Reads Chromium's PDF bookmarks (one per heading, in document order) and
// returns the 0-based page each heading landed on. Strict: the bookmarks must
// match the HTML headings one for one.
async function headingPages(bytes, headings) {
  const doc = await PDFDocument.load(bytes);
  const pageIndex = new Map(doc.getPages().map((p, i) => [p.ref.toString(), i]));
  const marks = [];
  const walk = node => {
    for (let it = node.lookup(PDFName.of('First')); it instanceof PDFDict; it = it.lookup(PDFName.of('Next'))) {
      let dest = it.lookup(PDFName.of('Dest'));
      if (!dest) dest = it.lookup(PDFName.of('A'))?.lookup(PDFName.of('D'));
      const ref = dest instanceof PDFArray ? dest.get(0) : null;
      marks.push({ title: it.lookup(PDFName.of('Title'))?.decodeText() ?? '', page: ref instanceof PDFRef ? pageIndex.get(ref.toString()) : undefined });
      walk(it);
    }
  };
  const outline = doc.catalog.lookup(PDFName.of('Outlines'));
  if (outline instanceof PDFDict) walk(outline);
  if (marks.length !== headings.length) throw new Error(`PDF has ${marks.length} bookmarks for ${headings.length} headings; cannot place running headers`);
  const norm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ''); // bookmarks carry rendered text (case, hidden separators)
  return headings.map((h, i) => {
    if (norm(marks[i].title) !== norm(h.text)) throw new Error(`bookmark ${i + 1} is "${marks[i].title}", expected heading "${h.text.trim()}"`);
    if (marks[i].page === undefined) throw new Error(`bookmark "${marks[i].title}" points at no page`);
    return { ...h, page: marks[i].page };
  });
}

// Running header (Part on the left, section on the right, hairline below) and
// footer (short title, page number) on every page but the cover. Part and
// appendix opening pages get only the page number.
function stampPages(doc, layout, font) {
  const MM = 72 / 25.4;
  const NAVY = rgb(0x0B / 255, 0x2D / 255, 0x5B / 255), ORANGE = rgb(0xE8 / 255, 0x71 / 255, 0x0A / 255);
  const MUTED = rgb(0x5B / 255, 0x67 / 255, 0x78 / 255), RULE = rgb(0xD5 / 255, 0xDC / 255, 0xE6 / 255);
  const h2s = layout.filter(h => h.tag === 'H2'), h3s = layout.filter(h => h.tag === 'H3');
  const openers = new Set(h2s.map(h => h.page));
  const firstBody = h2s.length ? h2s[0].page : Infinity;
  const fit = (text, f, size, max) => {
    if (f.widthOfTextAtSize(text, size) <= max) return text;
    while (text.length > 1 && f.widthOfTextAtSize(text + '…', size) > max) text = text.slice(0, -1);
    return text.trimEnd() + '…';
  };
  let headers = 0, numbers = 0;
  doc.getPages().forEach((pg, i) => {
    if (i === 0) return; // cover
    const { width, height } = pg.getSize();
    const x0 = 20 * MM, x1 = width - 20 * MM;
    // Footer: short title left, page number right with a small orange tick
    const num = String(i + 1), ns = 8.5;
    const nw = font.bold.widthOfTextAtSize(num, ns);
    pg.drawText(num, { x: x1 - nw, y: 11 * MM, size: ns, font: font.bold, color: NAVY });
    pg.drawRectangle({ x: x1 - nw - 3.2 * MM, y: 11 * MM + 0.2 * MM, width: 2 * MM, height: 2.2 * MM, color: ORANGE });
    pg.drawText(SHORT_TITLE, { x: x0, y: 11 * MM, size: 7.5, font: font.regular, color: MUTED });
    numbers++;
    if (openers.has(i)) return;
    // Header
    let lbl = '', left, right = '';
    if (i < firstBody) left = 'Contents';
    else {
      const ch = h2s.filter(h => h.page <= i).pop();
      lbl = ch.lbl ? ch.lbl.toUpperCase() : '';
      left = ch.title;
      const sec = h3s.find(h => h.page === i && h.idx > ch.idx) || h3s.filter(h => h.page < i && h.idx > ch.idx).pop();
      right = sec ? sec.title : '';
    }
    const y = height - 13 * MM, size = 7.5;
    let x = x0;
    if (lbl) {
      pg.drawText(lbl, { x, y, size, font: font.bold, color: ORANGE });
      x += font.bold.widthOfTextAtSize(lbl + '   ', size);
    }
    const leftMax = (x1 - x0) * 0.5 - (x - x0);
    const leftText = fit(left, font.semibold, size, leftMax);
    pg.drawText(leftText, { x, y, size, font: font.semibold, color: NAVY });
    if (right) {
      const rightMax = (x1 - x0) - (x - x0) - font.semibold.widthOfTextAtSize(leftText, size) - 8 * MM;
      const rt = fit(right, font.regular, size, rightMax);
      pg.drawText(rt, { x: x1 - font.regular.widthOfTextAtSize(rt, size), y, size, font: font.regular, color: MUTED });
    }
    pg.drawLine({ start: { x: x0, y: y - 2.4 * MM }, end: { x: x1, y: y - 2.4 * MM }, thickness: 0.5, color: RULE });
    headers++;
  });
  return { headers, numbers };
}

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
function stamp() {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}
const rel = p => path.relative(ROOT, p);

async function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    console.error(`error: ${e.message}\n\n${USAGE}`);
    process.exit(2);
  }
  if (opts.help) { console.log(BANNER + '\n\n' + USAGE); return; }

  const mode = opts.diagrams;
  const meta = gitMeta();
  const shortCommit = meta.commit.split(' ')[0];
  const when = stamp();
  // Claim a fresh folder atomically, so two runs in the same second never share one.
  fs.mkdirSync(path.join(OUT, 'builds'), { recursive: true });
  let buildDir;
  for (let k = 1; !buildDir; k++) {
    const candidate = path.join(OUT, 'builds', `${when}_${shortCommit}_${mode}${k > 1 ? '-' + k : ''}`);
    try { fs.mkdirSync(candidate); buildDir = candidate; failedBuildDir = candidate; } catch (e) { if (e.code !== 'EEXIST') throw e; }
  }
  const baseName = `${OUT_NAME}_${path.basename(buildDir).replace(`_${shortCommit}`, '')}`;

  console.log(BANNER);
  console.log(`\n   diagrams: ${mode}   commit: ${meta.commit}   output: ${rel(buildDir)}/`);

  const step = tracer(8);
  const errors = [];
  let server, browser, page, base, md, pdfPath, pdfBytes, layout;

  await step('Check inputs', async log => {
    const files = ORDER.flatMap(o => [o.file, o.insertBeforeHeading?.file].filter(Boolean));
    const missing = files.filter(f => !fs.existsSync(path.join(DOC, f)));
    if (mode === 'excalidraw') {
      for (const d of new Set(FIGURES.map(f => f.diagram))) {
        if (!fs.existsSync(path.join(DOC, 'diagrams', d + '.excalidraw'))) missing.push(`diagrams/${d}.excalidraw`);
      }
    }
    const assets = [THEME, LOGO, ...Object.values(STAMP_FONTS).map(f => path.join(ASSETS, 'fonts', f))];
    if (fs.existsSync(THEME)) {
      for (const m of fs.readFileSync(THEME, 'utf8').matchAll(/url\("?\/([^")]+)"?\)/g)) assets.push(path.join(ROOT, m[1]));
    }
    missing.push(...[...new Set(assets)].filter(f => !fs.existsSync(f)).map(f => '../' + rel(f)));
    if (missing.length) { throw new Error('missing input files:\n  ' + missing.map(m => path.normalize('document/' + m)).join('\n  ')); }
    for (const dep of ['marked', 'mermaid', '@excalidraw/utils', 'playwright', 'pdf-lib', '@pdf-lib/fontkit']) {
      if (!fs.existsSync(path.join(ROOT, 'node_modules', dep))) throw new Error(`missing npm package ${dep}; run "npm install" (or "make install")`);
    }
    log(`${files.length} section files, ${mode === 'excalidraw' ? new Set(FIGURES.map(f => f.diagram)).size + ' Excalidraw files' : 'no Excalidraw (mermaid mode)'}`);
    log(`theme ${rel(THEME)}, logo ${rel(LOGO)}, ${new Set(assets).size - 2} font files`);
  });

  try {
    await step('Start headless Chromium', async log => {
      server = await serve();
      base = `http://127.0.0.1:${server.address().port}`;
      const launch = { headless: true };
      if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
      try { browser = await chromium.launch(launch); } catch (e) {
        throw new Error(`could not start Chromium (${e.message.split('\n')[0]}); run "npx playwright install chromium" or set CHROMIUM_PATH`);
      }
      page = await browser.newPage();
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => {
        // Excalidraw falls back from a web worker to the main thread for font subsetting; harmless.
        if (m.type() === 'error' && !m.text().includes('Failed to use workers for subsetting')) errors.push(m.text());
      });
      log(`Chromium ${browser.version()}, local file server on ${base}`);
    });

    await step(mode === 'excalidraw' ? 'Render Excalidraw figures' : 'Render Excalidraw figures (skipped in mermaid mode)', async log => {
      if (mode !== 'excalidraw') { log('Mermaid is used for every diagram'); return; }
      fs.mkdirSync(path.join(buildDir, 'diagrams'), { recursive: true });
      await page.goto(`${base}/package.json`);
      for (const fig of FIGURES) {
        const scene = JSON.parse(fs.readFileSync(path.join(DOC, 'diagrams', fig.diagram + '.excalidraw'), 'utf8'));
        const p = { xMin: -Infinity, xMax: Infinity, yMin: -Infinity, yMax: Infinity, ...(fig.panel || {}) };
        const inPanel = e => {
          const cx = e.x + (e.width || 0) / 2, cy = e.y + (e.height || 0) / 2;
          return cx >= p.xMin && cx < p.xMax && cy >= p.yMin && cy < p.yMax;
        };
        const elements = scene.elements.filter(e => !e.isDeleted && inPanel(e));
        if (!elements.length) throw new Error(`panel of ${fig.id} is empty; check its FIGURES panel box`);
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
        fs.writeFileSync(path.join(buildDir, 'diagrams', fig.id + '.svg'), svg);
        log(`${(fig.diagram + '.excalidraw' + (fig.panel ? ' (panel)' : '')).padEnd(46)} -> diagrams/${fig.id}.svg`);
      }
    });

    await step('Assemble sections', async log => {
      md = assemble(mode);
      fs.writeFileSync(path.join(buildDir, `${baseName}.md`), md);
      const words = md.replace(/```[\s\S]*?```/g, '').split(/\s+/).length;
      log(`${ORDER.length} parts, ~${Math.round(words / 1000)}k words -> ${baseName}.md`);
    });

    await step('Render HTML, fonts and Mermaid diagrams', async log => {
      const { html, callouts } = toHtml(md, meta, mode);
      fs.writeFileSync(path.join(buildDir, `${baseName}.html`), html);
      await page.goto(`${base}/${rel(buildDir).split(path.sep).join('/')}/${baseName}.html`, { waitUntil: 'load' });
      const r = await page.evaluate(async ({ base, themeVariables, ratio }) => {
        // Load every bundled font face before Mermaid measures any text.
        const fontErrors = [];
        await Promise.all([...document.fonts].map(f => f.load().catch(() => fontErrors.push(`${f.family} ${f.weight} ${f.style}`))));
        await document.fonts.ready;
        const { default: mermaid } = await import(base + '/node_modules/mermaid/dist/mermaid.esm.min.mjs');
        mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables, securityLevel: 'loose', flowchart: { htmlLabels: true, useMaxWidth: true } });
        const nodes = [...document.querySelectorAll('pre.mermaid')];
        const failed = [];
        for (const [i, n] of nodes.entries()) {
          try { await mermaid.run({ nodes: [n] }); } catch (e) { failed.push(`#${i + 1}: ${e.message || e}`); }
        }
        await Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
        const brokenImages = [...document.images].filter(img => !img.naturalWidth).map(img => img.getAttribute('src'));
        // Landscape: a diagram gets its own landscape page when that prints it
        // at least `ratio` times larger than the portrait column would.
        const PX = 96 / 25.4;
        const portrait = { w: 170 * PX, h: 225 * PX }, land = { w: 257 * PX, h: 152 * PX };
        const landscape = [];
        for (const el of document.querySelectorAll('main .mermaid-wrap, main figure.excalidraw')) {
          const svg = el.querySelector('svg'), img = el.querySelector('img');
          let w, h;
          if (svg) { const vb = svg.viewBox.baseVal; w = vb.width; h = vb.height; } else if (img) { w = img.naturalWidth; h = img.naturalHeight; }
          if (!w || !h) continue;
          const sp = Math.min(1, portrait.w / w, portrait.h / h), sl = Math.min(1, land.w / w, land.h / h);
          if (sl >= sp * ratio) {
            el.classList.add('landscape');
            const sec = [...document.querySelectorAll('main h2, main h3')].filter(hd => hd.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING).pop();
            landscape.push(`${(sec?.dataset.title || sec?.textContent || '').replace(/\s+/g, ' ').slice(0, 40)} (${Math.round(w)}x${Math.round(h)}, ${Math.round(sl / sp * 100)}% larger)`);
          }
        }
        return {
          total: nodes.length, rendered: document.querySelectorAll('pre.mermaid svg').length,
          figures: document.querySelectorAll('figure.excalidraw img').length, failed, brokenImages, fontErrors,
          fonts: [...document.fonts].filter(f => f.status === 'loaded').length, landscape,
        };
      }, { base, themeVariables: MERMAID_THEME, ratio: LANDSCAPE_GAIN });
      if (r.fontErrors.length) throw new Error('fonts failed to load: ' + r.fontErrors.join(', '));
      if (r.failed.length) throw new Error('Mermaid failures:\n  ' + r.failed.join('\n  '));
      if (r.brokenImages.length) throw new Error('images failed to load: ' + r.brokenImages.join(', '));
      if (r.rendered !== r.total) throw new Error(`only ${r.rendered} of ${r.total} Mermaid blocks rendered`);
      log(`${r.fonts} font faces loaded`);
      log(`${r.rendered} Mermaid diagrams + ${r.figures} Excalidraw figures = ${r.rendered + r.figures} diagrams`);
      log(`${r.landscape.length} on landscape pages${r.landscape.length ? ':' : ''}`);
      for (const l of r.landscape) log(`  - ${l}`);
      log(`callouts: ${Object.entries(callouts).map(([k, v]) => `${v} ${k}`).join(', ')}`);
    });

    await step('Print PDF (two passes: layout, then contents page numbers)', async log => {
      await page.emulateMedia({ media: 'print' });
      const opts = { preferCSSPageSize: true, printBackground: true, outline: true, tagged: true };
      const headings = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h, idx) => ({
        idx, tag: h.tagName, id: h.id, text: h.textContent, lbl: h.dataset.lbl || '', title: h.dataset.title || h.textContent.trim(),
      })));
      const pass1 = await page.pdf(opts);
      const first = await headingPages(pass1, headings);
      await page.evaluate(pages => {
        for (const el of document.querySelectorAll('.pg[data-for]')) el.textContent = pages[el.dataset.for];
      }, Object.fromEntries(first.map(h => [h.id, h.page + 1])));
      const pass2 = await page.pdf(opts);
      layout = await headingPages(pass2, headings);
      const moved = layout.filter((h, i) => h.page !== first[i].page);
      if (moved.length) throw new Error(`filling in the contents page numbers moved ${moved.length} headings, e.g. "${moved[0].title}"`);
      pdfBytes = pass2;
      log(`${headings.length} headings placed; contents page numbers filled in, layout unchanged`);
    });

    await step('Add running headers, page numbers and metadata', async log => {
      pdfPath = path.join(buildDir, `${baseName}.pdf`);
      const doc = await PDFDocument.load(pdfBytes);
      doc.registerFontkit(fontkit);
      const font = {};
      for (const [k, f] of Object.entries(STAMP_FONTS)) font[k] = await doc.embedFont(fs.readFileSync(path.join(ASSETS, 'fonts', f)), { subset: true });
      const stamped = stampPages(doc, layout, font);
      doc.setTitle(TITLE, { showInWindowTitleBar: true });
      doc.setSubject(`Built ${meta.date} from commit ${meta.commit}; diagrams: ${mode}`);
      doc.setCreator('tools/build-pdf.mjs (github.com/MatiGoldberg/SoftwareFactory)');
      fs.writeFileSync(pdfPath, await doc.save());
      const n = doc.getPageCount();
      const land = doc.getPages().filter(p => p.getWidth() > p.getHeight()).length;
      log(`${stamped.headers} running headers, ${stamped.numbers} page numbers (cover unnumbered, Part openers without header)`);
      log(`${n} pages (${land} landscape), ${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(1)} MB -> ${rel(pdfPath)}`);
    });
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }

  await step('Publish latest copy', async log => {
    const latest = path.join(OUT, mode === 'excalidraw' ? `${OUT_NAME}.pdf` : `${OUT_NAME}-${mode}.pdf`);
    fs.copyFileSync(pdfPath, latest);
    log(`${rel(latest)} now points at this build`);
  });

  failedBuildDir = null;
  if (errors.length) console.warn('\nbrowser messages:\n  ' + errors.join('\n  '));
  console.log(`\n   OK  ${rel(pdfPath)}\n`);
}

// A failed run removes its half-written folder so builds/ only holds finished builds.
let failedBuildDir = null;
main().catch(e => {
  if (failedBuildDir) fs.rmSync(failedBuildDir, { recursive: true, force: true });
  console.error(`\nerror: ${e.message || e}`);
  process.exit(1);
});
