# Software Factory

Research and drafts for **"The Agentic PDLC: building a software factory around a high-scale service"**: how to agentify the product development lifecycle of an existing, high-scale enterprise service safely, grounded in published evidence (Microsoft first).

The assembled document lives as a Claude Doc; this repo holds its sources, section drafts, review reports, diagrams and tooling.

## Layout

| Path | What it holds |
|---|---|
| `SOURCES.md` | Index of every source read, with IDs and evidence grades (A/B/C). |
| `sources/` | One structured note per source cluster (summary, mechanisms, numbers, quotes, PDLC stages). |
| `document/00-skeleton.md` | The approved outline: every part and section, its brief, sources and planned diagrams. |
| `document/01-conventions.md` | Writing and QC rules, including review feedback folded in. |
| `document/sections/` | Section drafts: `0` front matter, `I` lessons, `II.1`–`II.12` PDLC stages, `III` trust model, `IV` enterprise complexity, `V.1`–`V.2` service catalog and reference architecture, `VI`, `VII`, and appendices `A` (glossary), `C` (gaps), `D`/`D1` (implementation kit, PRD template), `E` (requirements). |
| `document/diagrams/` | Main diagrams as `.excalidraw` files (open at [excalidraw.com](https://excalidraw.com) or the VS Code extension). |
| `document/qc/` | Per-section review reports: `*-grounding.md` (claims checked against sources) and `*-reader-judge.md` (readability review), plus the cross-document consistency report. |
| `document/references.md`, `references.json` | Reference registry mapping short codes (e.g. `MS4`) to sources. |
| `document/*-todo.md`, `kit-proposals.md`, `req-renumber-map.md` | Working notes from assembly. |
| `tools/` | `build_refs.py` (builds the reference registry), `to_codes.py` (rewrites source IDs to short codes), `validate.js` (renders Mermaid blocks headlessly and checks readability). |

Note: the tools use absolute paths from the original workspace (`/mnt/project-files/software-factory-research`); adjust the root path to run them from a clone.
