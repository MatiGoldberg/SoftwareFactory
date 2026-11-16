# QC grounding review: II.1 Intake and ideation

Reviewer scope: every cited claim checked against the source notes in `sources/*.md` via `references.md`; template, rung names, REQ areas, em-dashes and cross-references checked against `01-conventions.md`. Mermaid validator run: both blocks OK, no WARN (block 1 shown at 13.9px text, block 2 at 16.0px). Prose is about 905 words (within 700 to 1,000).

## Claim check summary

All 14 codes map to the right source (SPOT2, MS28, MS14, AIE11, MS11, AIE2, MS10, SHOP1, MS15, AN1, AIE12, SPOT5, ATL1, MS8). Quotes checked verbatim: MS28 "Every area path in Azure DevOps has a team and associated set of repositories", MS14 "less than three minutes", SHOP1 "You shouldn't abdicate the thinking." / "You should abdicate the toil.", AN1 "as a thought partner rather than a code generator", AIE12 "fix every alert". Numbers exact: 100+ tasks, 0.766, more than 20 PII types. No "(summary)" items from the notes are used. Talks (AIE2, AIE11, AIE12) are described as talks in the text; ATL1 is labelled vendor-reported.

## Issues

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Requirements table: REQ-OWN-02, REQ-SEC-02, REQ-GOV-02, REQ-CTX-02 | IDs collide with different requirements already in II.3, II.4 and II.5 (REQ-OWN-02 in II.3 and II.4; REQ-SEC-02 in II.4; REQ-GOV-02 and REQ-CTX-02 in II.3 and II.5). The document is consolidated into one REQ table, so IDs must be unique. This is doc-wide (II.2 to II.6 also collide on OWN-01, REV-01, VER-01, API-01, IDN-01). | med | Renumber II.1's rows to free numbers per area (or let the coordinator assign a doc-wide numbering pass); keep II.1's REQ-PRD-04/05 if II.2 uses PRD-01 to 03. |
| Real-world reference, para 1 (MS14) | The section's main Microsoft reference rests on a grade C Inside Track post, and its one number ("less than three minutes") is self-reported, but the text does not say so. | med | Add, e.g., "Microsoft Digital reports in an Inside Track post that..." or "a self-reported figure". |
| Real-world reference, para 1: "The only number published is..." | Inaccurate: the note also gives 15,000 active users; what it lacks is other before/after data. | low | "The only before/after figure published is..." |
| What to agentify, para 2 (MS15, SHOP1, AN1) and Other references (MS10) | Claims rest only on grade C sources (Inside Track, investor interview, Anthropic anecdote article, product GA post) without saying so in words. SHOP1 and AN1 are attributed quotes, so impact is small; MS15 and MS10 are practice claims. | low | Light touch: "Microsoft Digital describes using AI for..." [MS15]; "the GA announcement says SRE Agent keeps a memory..." [MS10]. |
| What to agentify, para 2: "Choosing what to build is the thinking; reading a thousand feedback rows is the toil." | Our application of the Shopify quote, placed directly after it; could read as Shopify's own framing. | low | Prefix with "Applied to intake:" or fold into the Recommendation line. |
| Enterprise complications: "the same metadata should create compliance intake items" and "Triage should mark such items." | Normative synthesis following a cited company practice, not labelled Recommendation. | low | Start each with "Recommendation:" or move into a REQ row. |
| Other references (MS11): "a measured baseline for LLM classification of incident text" | RCACopilot classifies using automatically collected runtime diagnostics, not incident text alone. | low | "...for LLM classification of incidents" or "of incidents with collected diagnostics". |
| REQ-GOV-02 source column: MS15 | MS15 says accountability stays with people; it does not support per-service rate limits or trust-ledger recording. | low | Replace MS15 with "Recommendation" (keep AIE12). |
| REQ-PRD-04 source column: AIE11 | AIE11 shows an agent that dedups; it does not support deterministic-key dedupe. Already paired with "Recommendation", so acceptable. | low | Optional: order as "Recommendation; AIE11 (agent dedupe)". |
| Other references: "Azure SRE Agent (see II.9)" | SRE Agent's primary home in the skeleton is II.11 (monitoring and incidents); II.9 only mentions it. | low | "see II.11" (or "see II.9, II.11"). |
| Agent table, Brief agent "(template: [GAP])"; REQ-PRD-04 "from one template" | Open gaps proposes D9 for the intake record and brief template, but the table and REQ do not point to it. | low | Use "(template: proposed D9)" in both places. |
| Agent table, Linking agent | Jumps from Advise (L0) to Act, then notify (L3) with no Prepare or Act on approval rung. Allowed (rungs are per action), but the promotion path is unstated. | low | Optional: one clause noting merges go straight to L3 because they are reversible and undoable by any owner. |

Checks passed: headings present and in template order (Purpose, The ideal deterministic process, Real-world reference, What to agentify and how far, Enterprise complications, Requirements, Open gaps); rung names exact (Advise (L0), Prepare (L1), Act on approval (L2), Act, then notify (L3), Autonomous within budget (L4)); REQ areas PRD, OWN, SEC, GOV, CTX all on the conventions list; no em-dashes or en-dashes; service catalog cross-referenced to V.1 rather than re-explained; Microsoft option named first in Real-world reference and Shared backlog; [GAP] tags used where evidence is missing; agent rungs explicitly labelled as synthesis.

## Verdict

**PASS WITH FIXES.** Grounding is accurate: no misquoted, mis-numbered or mis-mapped citations. Fix the REQ-ID collisions (doc-wide) and say that MS14 is a self-reported Inside Track post; the rest are low-severity wording fixes.

Counts: high 0, med 2, low 10.
