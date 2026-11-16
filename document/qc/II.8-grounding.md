# QC grounding review: II.8 Integration and merge

Reviewed against 01-conventions.md, references.md and the notes for AIE3, AIE10, AIE12, MS27, MS19, AWS1, GOOG6, GOOG7, META2, META3, GH2, MABL1, SPOT7, UBER2.

Summary of checks:
- Codes: every code maps to the right source ID (AIE3 = AIE-UBER-MERGE, META2 = META-DRS, META3 = META-RELEASE-RISK, GOOG6 = GOOG-LSC, MS27 = MS-HOW-MSFT-DEVOPS, and so on). No invented codes.
- Numbers: all exact (44%, 30 min to 3 to 4 h, ~300 lands/h, 5,000+ devs, ~27,000 PRs/week, 60,000 tests in <5 min, 200+ PRs/day, 10,000+ changes, 5/10/50% zones, 18.7/27.9/84.6%, 1.40/1.52/1.05x, 10 to 20% LSCs, 3 h TAP train, 79 repos, 11% agent PRs).
- Quotes: all verbatim (AIE3, AIE12, AIE10, META2, GOOG6 Rosie, MABL1; MS19 is an exact substring of the note's quote).
- Template headings present and in order; rung names exact; REQ areas MRG, REPO, SEC are on the conventions list; no em-dashes or en-dashes; both Mermaid blocks validate OK with no WARN; prose about 1,000 words (top of range). V.1, IV.1, IV.7, II.9, II.12 and D6/D7 cross-references used correctly; provenance schema proposed as "(template: proposed)".

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Requirements, REQ-MRG-01, Source column | Cites MS27 for combined-state merge-queue testing, but MS27 only describes PR build policies and post-merge acceptance tests; the section itself says no Microsoft source describes a combined-state queue. The citation implies support that does not exist. | med | Change source to "AIE3; Recommendation", or move MS27 to the rationale as "baseline PR policies". |
| Ideal process, "Signed artifact" bullet (MS19) | MS19 (MS-SFI) is grade C but is presented as plain fact with no weak-source wording. | med | Add wording such as "Microsoft's SFI overview page (a high-level summary) states ..." or note it is an overview rather than an engineering description. |
| Purpose, AIE3 and AIE12 claims | Uber numbers and the merge-bottleneck quote are first used in Purpose without saying they come from conference talks; the "one conference talk" label appears only later under Real-world reference. AIE12 is only identified as "a talk titled", not as a single vendor (Vorflux) talk. | low | In Purpose write "one conference talk by Uber engineers reports ..." and "a Vorflux conference talk". |
| Ideal process, "Risk tier" bullet | "A model scores each change; the tier sets how strict later gates are" is synthesis with no citation and no "Recommendation:" label, presented in the ideal process as if established. | low | Cite META3 for gating by risk tier, or mark the tier-to-strictness mapping as a Recommendation (it is REQ-MRG-04). |
| Real-world reference, LSC paragraph, last sentence | "Agent fleet changes (see II.12) need this throttle." is our synthesis in a reference paragraph, unlabelled. | low | Prefix with "Recommendation:" or move it to REQ-MRG-06 rationale. |
| Real-world reference | Covers three systems (SubmitQueue, DRS, Google LSC) in about 13 sentences; convention asks for a 3 to 5 sentence explainer of one or two systems. SubmitQueue and Rosie/TAP are also used as evidence in the ideal-process section before they are explained. | low | Trim to SubmitQueue and DRS; move LSC detail into REQ-MRG-06 or a single sentence; or move the reference section's explainers ahead of their first use. |
| What to agentify, GH2 sentence | GH2 is grade C; labelled "(vendor marketing)", which is acceptable. Note GitHub is the Microsoft-first option here and is named before others; fine. | low | None required; optionally say "vendor-reported" to match the convention's wording. |
| Enterprise complications, "DRS was trained on past diffs [META3]" | Supported in substance (internal diffs, chronological split), but the training-set details in the note are "(summary)". The section does not quote them, so it is fine. | low | None required. |
| Length | Prose is about 1,000 words, at the top of the 700 to 1,000 range. | low | Trimming the reference section (above) brings it inside the range comfortably. |

## Verdict

PASS WITH FIXES. High 0, medium 2, low 7. All numbers, quotes and code mappings check out; fixes are citation precision (REQ-MRG-01), weak-source labelling (MS19, talks in Purpose) and two unlabelled synthesis sentences.
