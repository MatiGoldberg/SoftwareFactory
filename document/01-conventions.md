# Writer and reviewer conventions (shared by every section)

Document: **The Agentic PDLC: building a software factory around a high-scale service**. It is a single document. The reader is a Microsoft engineering leader who wants to move an existing high-scale service into a software factory safely. The goal is quality and safety, not PR volume.

## Grounding rules
- Use only the source notes in `/mnt/project-files/software-factory-research/sources/*.md`, indexed in `SOURCES.md`. Do not browse the web and do not cite from memory.
- Every factual claim about a company carries a citation in the form of a **short reference code** from `document/references.md`, for example `[MS4]` (Microsoft reference 4, which is MS-GANDALF-BLOG). Several codes go in one bracket: `[MS5, AWS1]`. Look up the code for each source ID in references.md, and never invent one. Numbers must match the note exactly. Quotes must be verbatim from the note.
- If a note marks a claim "(summary)", say "reportedly" or keep the claim soft.
- Do not put evidence grades inline; they are in the references table. When a claim rests only on a weak source (grade C or a talk), say so in words, for example "one conference talk reports".
- Recommendations that are our own synthesis, not something a company published, start with **Recommendation:** or sit in a requirements table. Never present synthesis as a company's practice.
- Where evidence is missing, write `[GAP: what is missing]`. Do not fill the gap with plausible text.
- Vendor claims (Atlassian, mabl and similar) are labelled "vendor-reported".

## Microsoft first
- For every mechanism, name the Microsoft or GitHub option first if the notes contain one (for example SDP/Gandalf, Entra Agent ID, AKS Fleet, ADO release flow, Spec Kit, Copilot coding agent, AI code review, Azure SRE Agent). Then give the other frontier references.

## Shared vocabulary (use exactly)
- **Autonomy levels.** These are assigned per action, not per agent. Always use the plain name; the L-number may follow in brackets.
  - **Advise (L0):** the agent investigates, explains and suggests. A human decides and acts.
  - **Prepare (L1):** the agent prepares the exact action (a PR, a rollback command, a flag change, a plan). A human reviews it and runs it.
  - **Act on approval (L2):** the agent carries out the action after an explicit human approval, such as one click or a PR merge.
  - **Act, then notify (L3):** the agent carries out pre-approved, reversible actions automatically within guardrails, then notifies humans, who review afterwards. Examples: halt a rollout, roll back to the last known good (LKG) release, turn off a feature flag, auto-merge a change that passed every gate.
  - **Autonomous within budget (L4):** the agent also takes non-routine actions inside a scoped budget, with automatic rollback and full audit. One example is opening and shipping a fix-forward through the normal pipeline.
- **Deterministic core, agentic edges.** The pipeline itself (build, gates, ring promotion, merge queue) stays deterministic and policy-driven. Agents work around it: they write the inputs (specs, code, tests, rollout plans), interpret the outputs (investigation, triage) and take bounded mitigations. Say plainly which parts stay deterministic.
- **Trust ledger:** the per-action record of outcomes used to promote or demote an action: success rate, revert rate, escaped defects, human override rate, and cost per accepted change.
- **Verifier:** any automated check an agent's output must pass, such as build, tests, lint, contract diff, mutation score, or an LLM judge.
- **Context layer:** AGENTS.md or CLAUDE.md files, the service catalog (Service Tree-style), the dependency graph, and runbooks.
- **Requirement IDs:** `REQ-<AREA>-NN`. Areas: CTX (context), VER (verification), REV (review), MRG (merge), DEP (deploy), OBS (observability/ops), IDN (identity/auth), REPO (multi-repo), API (contracts), PIPE (pipelines/clusters), OWN (ownership), CFG (config), SEC (security/compliance), GOV (trust/governance), COST (cost/capacity), PRD (requirements and PRDs). Each requirement is marked MUST or SHOULD.
- **Stage IDs** II.1 to II.12, as in 00-skeleton.md. Cross-reference other sections like this: "see II.9".

## Style
- Plain, direct English. Short paragraphs. Bullets for mechanisms, tables for comparisons and requirements.
- No hype. No em-dashes; use commas, colons or parentheses instead.
- **Each stage section in Part II uses these headings, in this order:**
  1. **Purpose** (2 to 3 sentences).
  2. **The ideal deterministic process**: a valid Mermaid flowchart of the process with no agents, followed by a few lines on the gates in it.
  3. **Real-world reference**: a short explainer (3 to 5 sentences) of the one or two published systems this stage leans on most, written so the reader knows what each one is before it is used as evidence. Example: "Gandalf is Azure's ...".
  4. **What to agentify, and how far**: a second Mermaid flowchart (or the same chart with agent touchpoints marked), then a table of each agent role with its rungs (Advise → Autonomous within budget), the guardrail for each rung, and the evidence needed for promotion.
  5. **Enterprise complications**: bullets only.
  6. **Requirements**: a table.
  7. **Open gaps**. There is no per-section source list: the whole document shares one reference table at the end (`document/references.md`).
  Inputs, outputs, gates and metrics go inside the flowchart and its notes. Do not give them separate sections.
- **Concision.** A Part II stage is 700 to 1,000 words of prose, not counting tables and diagrams. Every sentence must earn its place: no restating the purpose, no listing ring orders twice, no hedging filler. One strong example beats three weak ones. Detail that only specialists need goes into a requirement row or is cut.
- **Diagrams.** Use real Mermaid code blocks (```mermaid), using `flowchart TD` or `flowchart LR`. Keep labels short; put any label containing punctuation in double quotes, for example `A["Canary (EUAP)"]`. Avoid parentheses, slashes and `&` in unquoted labels. Before finishing, every Mermaid block **must** pass the validator:
  `node /tmp/claude-0/-home-user/2189683f-6889-5771-8b9c-41633a228239/scratchpad/mm/validate.js <your file>`
- **Diagram readability (owner feedback).** Diagrams render in a 672px-wide column. The validator also measures each diagram and prints WARN when the text would shrink below about 12.5px (the chart is too wide) or when the chart is taller than about 700px. Treat WARN as a failure. What works:
  - `flowchart TD` with at most about 8 ranks.
  - A horizontal row of steps inside a `subgraph` with `direction LR`, for example the rings.
  - Rounded nodes `(["..."])` instead of diamonds for decisions, because diamonds balloon in size.
  - Labels of 2 to 4 words, using `<br/>` for a second line.
  - Agent nodes marked with `classDef agent fill:#fde7c8,stroke:#d9822b,color:#111` and `:::agent`, plus a one-line legend under the chart.
  - Avoid a long `flowchart LR` chain of more than 4 nodes, and avoid subgraphs linked across both directions, which Mermaid lays out very wide.
  - Run with `PNG_DIR=<dir>` to save a preview PNG of what the reader sees, and look at it.
  The validator renders each block in a headless browser and prints OK or the parse error. Fix any errors and re-run it until every block prints OK.
- Target length: as given in the brief. Stay within ±20%.

## Output
- Write to `/mnt/project-files/software-factory-research/document/sections/<ID>.md`, for example `II.9.md`.
- End the file with a `### Open gaps` list.
- `/mnt/project-files` is a network mount. Write the file once, then re-read it about 10 seconds later to confirm the write landed.

## Cross-references added 2026-11-15
- **Service catalog:** a dedicated section, V.1, defines it: what it stores, the reverse dependency graph, and how it stays up to date. Wherever a section relies on owners, dependencies, pipelines or contracts, write "from the service catalog (see V.1)" and do not re-explain it.
- **Implementation kit (Appendix D):** D1 PRD template, D2 catalog schema, D3 AGENTS.md template, D4 spec/constitution template, D5 rollout plan as data, D6 agent action policy, D7 trust-ledger record and promotion review, D8 readiness checklist. Reference the relevant item, for example "(template: D3)", rather than inlining long templates in a section. If your section needs an artifact that isn't on this list, propose it under Open gaps.
- **Requirement numbering:** number requirements within your own section (REQ-DEP-01 and so on). The assembly step renumbers them across the whole document, so a clash with another section is fine.
- **New kit items:** proposed additions to Appendix D are collected in `document/kit-proposals.md`. Do not number them D9 and up yourself; write "(template: proposed)".
- **Rung consistency (a common reviewer finding).** No agent ever approves its own output. At "Act, then notify" (L3), the agent's action lands because the deterministic gates pass, not because the agent decided. Keep these consistent:
  - **Ceilings.** If you state a "realistic ceiling" for today, the table must not exceed it. Mark any higher rung as a future proposal.
  - **Labels.** Name each rung by what the agent actually does. Running a check and commenting is Advise. Blocking a change is a deterministic gate action, not an approval.
  - **Roles.** Use the same agent role names in the chart and in the table.
- **PR rule (fixed 2026-11-15).** When an agent opens a PR or change request that a human merges, that is **Act on approval (L2)**: the merge is the approval and the system then executes it. **Prepare (L1)** means the agent produces a draft, such as a suggestion, a draft PR or a command, that a human edits or adopts and then submits as their own.
- **Blocking rule.** When an agent's finding blocks a merge through a deterministic policy, that is "Act, then notify" (L3). It is reversible by human override, and it is never an approval.
