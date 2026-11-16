# III grounding QC

Section: `document/sections/III.md`. Reviewed against `01-conventions.md`, `references.md`, the Part III brief in `00-skeleton.md`, and the cited source notes (files 02, 03, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14). Part III is a synthesis part, not a PDLC stage, so the Part II heading template does not apply. Requirement-ID clashes were ignored, as instructed.

## What checks out

- All 28 codes map to the right source IDs (AIE4, AIE5, AIE6, AIE8, AN3, AN4, GOOG2, GOOG3, GOOG4, MABL1, META3, MS5, MS6, MS8, MS10, MS12, MS15, MS16, MS18, MS22, MS23, MS24, SHOP1, SPOT2, SPOT4, SPOT7, STRIPE1, UBER1).
- The numbers match the notes. MS8: 67.9% vs 87.1%, 41.7% rising to about 71%, 80.0% vs 64.0% by size, 0.6% vs 0.8% revert and "not statistically meaningful". UBER1: 75% useful, 65% vs 51% addressed. GOOG3: 90%, 24% and 30%. SPOT4: about 25% vetoes. SHOP1: $250 per person per day. AIE6: over 700 PRs, each human-approved. GOOG2: about 50% time saved. STRIPE1: two CI rounds. MS16: about 24 h token cache.
- The quotes are verbatim: AIE4 (both), MS10 "within defined guardrails" and "Teams can choose how autonomous the agent should be", AN3 "reliably skew positive" and the harness-assumption quote, SHOP1 check-in quote, SPOT4 judge-evals quote, MS8 ownership quote, MS18 borrowed-identity quote (a substring), GOOG3 "mirror and a multiplier", GOOG2 bottleneck quote, SPOT2 "76% more PRs to review" (a substring).
- No "(summary)" item from a note is used. The MS8 task-class rates, which the note marks "(summary, unverified)", are correctly left out.
- Weak sources are mostly flagged: AIE4, AIE5 and AIE8 say "one conference talk", mabl says "vendor-reported" and gives its size, and SHOP1 says "an interview" at its third use. The open gaps state that the ladder rests on a talk plus a product announcement.
- Rung names are exact throughout. The PR rule is applied correctly: an opened PR plus a human merge is L2, and drafts the owner submits are L1. The blocking rule is applied correctly: a blocking label is L3 and a gate action. The ceiling (L3 only for reversible or mechanical classes, L4 a future proposal) matches the Part II ceilings in II.5, II.7, II.8, II.9, II.10, II.11 and II.12. The Step 6 rungs match II.8 and II.9.
- Gaps use [GAP] (kill switch, closed-loop metric) and are repeated under Open gaps.
- REQ areas are all GOV, which is on the conventions list. Each requirement is MUST or SHOULD.
- There are no em-dashes and no en-dashes. Both Mermaid blocks pass the validator with no WARN (text 16.0px and 14.1px).
- Cross-references are used rather than re-explained: V.1 (catalog), D1, D3, D4, D6, D7, D8, IV.4 (token flows), Part VI (timeline), and II.x throughout.

## Issues

| Location | Issue | Severity | Fix |
|---|---|---|---|
| III.4 table, Step 7 Controls: "production mitigations human until promoted [AIE4]" | This inverts the source. The AIE4 note says "Production mitigations stay human" and gives no promotion path for them. II.11 handles this correctly: "Meta keeps production mitigations human [AIE4], so this ceiling is our proposal". As written here, our L3 proposal is presented as Meta's practice. | high | Write "production mitigations stay human until promoted (our proposal; Meta keeps them human [AIE4])", or move the citation onto "Meta keeps production mitigations human" and leave the promotion clause uncited. |
| III.2 "Promotion evidence", first sentence ("An action moves up one rung when, over a sample its owner judges long enough, it matches a human baseline...") | This is our synthesis, stated as fact. The "Recommendation:" label comes only at the end of the paragraph, and the company citations in the middle (UBER1, SHOP1, AIE5, MS15) make the promotion rule read as published practice. The Open gaps admit that "the ledger thresholds are ours". | med | Start the paragraph with "**Recommendation:** an action moves up one rung when...", and keep the citations as supporting evidence for each metric. |
| III.3 first paragraph: "This follows Microsoft practice: every Copilot Coding Agent PR ... [MS8]; Microsoft's AI reviewer never commits a fix itself ... [MS6]" | The cited facts are accurate. But "follows Microsoft practice" implies Microsoft has the requester-is-author and different-owner-approves rule, which neither note states. | med | Write "This is consistent with Microsoft practice", or "This extends what Microsoft does:". |
| III.3 "Audit." paragraph, and the "Fits ..." sentences in the three modes | These are design statements we wrote (the ledger record joins identity, sponsor, requester, approver and token mode; OBO fits developer work; app-only fits pipeline agents). They are not labelled. The OBO and app-only mapping comes from the notes' Relevance lines, not from Microsoft's text. | low | Add "**Recommendation:**" before the Audit sentence, and start the mode mapping with "We map...". |
| III.1 first paragraph | Microsoft-first rule: Meta (AIE4) comes before the Azure SRE Agent (MS10), although the notes contain a Microsoft option. | low | Open with the Azure SRE Agent's autonomy setting [MS10], then give Meta's per-action rule [AIE4] as the sharper statement. |
| III.1, MS10 sentence | MS10 is grade C (a GA announcement; the note says "Vendor figures"), and the claim rests only on it. The Open gaps call it a product announcement, but the body text does not. | low | Write "Microsoft's GA announcement for Azure SRE Agent says teams move...". |
| III.1 recommendation paragraph (SHOP1 quote) and III.2 promotion paragraph ("Revert rate is also Shopify's health signal [SHOP1]") | SHOP1 is grade C (an investor interview). It is labelled only at its third use, in III.4. | low | At first use, write "Shopify's head of engineering said in an interview...". |
| III.2 promotion paragraph, MS15 ("Microsoft Digital moved from usage to flow, rework and recovery times") | Grade C (Inside Track), with no in-words signal. The note also lists "incident" times alongside flow, rework and recovery. | low | Write "Microsoft Digital's Inside Track post reports a move from usage to flow, rework, incident and recovery times [MS15]". |
| III.4 table, Step 1 Controls ("Duolingo: over 700 test PRs merged, each human-approved [AIE6]") | This claim rests only on a talk, which is not said. | low | Write "Duolingo (conference talk): ...". |
| III.3 Entra paragraphs (MS12, MS22, MS23, MS24) and the III.2 kill-switch paragraph (MS16, MS24) | These are grade C product documentation, used for product behaviour (the right use). The reader gets no signal that this is documented design rather than measured practice. | low | Add "per Microsoft Learn" once, at the start of the Entra Agent ID paragraph. |
| III.4 table, Step 6 Controls: "risk thresholds set by policy owners [META3]" | The META3 note says release engineers gate diffs by top-X% risk zones. "Policy owners" is our term and is not in the note. | low | Write "risk-zone thresholds set by release engineering [META3]". |
| Requirements, REQ-GOV-02 Source column: "AN3, MABL1, GOOG2" | GOOG2 ("Humans review the LLM-generated code the same way as any other code") does not support "no agent approves its own output". AN3 and MABL1 do. | low | Drop GOOG2, or keep it only for the human-review point. |
| Requirements, REQ-GOV-06 and REQ-GOV-07 Source column | Both contain our synthesis: a kill switch that does not wait for token expiry, and LLM judges measured against human labels before they block. The Source column omits "Recommendation", unlike GOV-01, 03, 04, 05, 09 and 10. | low | Add "; Recommendation" to both. |
| Requirements, REQ-GOV-08 and REQ-GOV-11 | The areas are valid, but IDN (identity) and COST (cost) are the closer areas on the conventions list. | low | Optionally renumber to REQ-IDN-01 and REQ-COST-01. Assembly renumbers anyway. |
| III.4 table, Step 2 ("commits a fix on the author's click") vs III.3 ("Microsoft's AI reviewer never commits a fix itself") | The rung (L2) is right. But the two phrasings read as a contradiction: the MS6 note says suggested fixes are "never auto-committed; author clicks to apply". | low | In Step 2, write "applies a proposed fix when the author clicks". |
| III.1 recommendation paragraph, list of L3 places | II.1's L3 rung ("Adds 'related' links at once, then notifies") is missing from the list of places Part II reaches L3. | low | Add "related-item links at intake (II.1)" to the list. |
| III.2 (brief coverage) | The skeleton's III.2 brief names META-DRS thresholds as an input. The section does not use META2. This is not a grounding error. | low | Optionally add one clause on Meta's Diff Risk Score as a threshold-based gate, citing [META2], if its note supports it. Otherwise leave as is. |

## Counts

- High: 1
- Med: 2
- Low: 14

## Verdict

**PASS WITH FIXES.** Citations, numbers and quotes are accurate, and the codes map correctly. The one high issue is a single table cell that turns Meta's "production mitigations stay human" into "human until promoted". The two med issues are synthesis that reads as company practice (the promotion rule, and "follows Microsoft practice"). All three are one-line fixes.
