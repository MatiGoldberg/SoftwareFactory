# QC: Part I grounding review

Reviewed: `document/sections/I.md` against `01-conventions.md`, `references.md` and the source notes in `sources/*.md`. Reviewer did not edit the section.

## Summary of checks

- **(a) Note support, numbers, quotes.** Every number checked matches its note: MS6 (>90%, >600K/month, 10 to 20%), MS8 (41.7% to ~71%; 3/535 vs 33/4,251; 80.0% and 64.0%), AN3 (20 min/$9 vs 6 h/$200), OAI1 (~1M lines, five months), MS28 (900+ services, 3,800 repos), ABNB1 (~3.5K files, six weeks, 1.5 years), AIE6 (11% to 72%), AIE3 (+44%, 30 min to 3 to 4 h), SPOT4 (~25%), SPOT5 (~1,800 pipelines), MABL1 (~40% to <5%), META2 (10,000+), MS5 (92.4/100, 94.9/99.8), GOOG3 (~5,000, 90%, 24%). All quotes are verbatim substrings of the notes (GOOG2, SPOT2, AN3, OAI1 x2, SPOT4, MS7, AIE6, AIE4, META2, MS5, AWS1, GOOG5, GOOG3, SHOP1, MS8, SPOT2).
- **(b) Code mapping.** All codes map to the intended sources (spot-checked every code in the text and the table, including SPOT3/4/5/7, AIE2/3/4/6/11, MS7/10/15/28, GOOG2 to GOOG7).
- **(c) Synthesis labelling.** No synthesis is presented as a company's practice. The "So for an existing service:" lines are prescriptive but unlabelled (see row 9).
- **(d) "(summary)" items.** The only one used (MS8: instructions and environment setup raised success) is softened with "reportedly". No other summary-only figure is cited.
- **(e) Weak sources.** Talks (AIE3, AIE4, AIE6, AIE11), the SPOT7 InfoQ report, MABL1 (vendor-reported), MS10 in lesson 6 and SHOP1 in lesson 3 are labelled. Several grade C claims elsewhere are not (row 1).
- **(f) I.2 ratings.** Strong rows (II.5, II.6, II.9, II.12, Org adoption) and thin rows (II.1, II.2, II.3, II.10, III) are justified by the notes. Three rows do not fit the section's own definitions (rows 2, 3, 4).
- **Rung names.** No rung is named; "one rung at a time" is fine. No conflict with the ladder.
- **Em-dashes.** None found.
- **Cross-references.** All targets exist (II.1 to II.12, III.1, III.2, III.4, IV.2, IV.3, IV.4, IV.8, V.1, V.2, VI.1, VI.2, VI.4; templates D2, D3, D6, D7). The service catalog is referenced via V.1, not re-explained. Microsoft-first ordering holds in all eight lessons.

## Issues

| # | Location | Issue | Severity | Fix |
|---|---|---|---|---|
| 1 | I.1 lessons 4, 5, 6 (caveat), 8 | Claims resting only on grade C sources are not described as weak. Lesson 4: "Microsoft Digital started with low-risk tasks ... found toil reduction drove adoption" [MS15, grade C, no numbers]. Lesson 5: "Azure SRE Agent's preview showed the most effective agents were grounded in the team's own context" [MS10, grade C product announcement]. Lesson 8: "Microsoft Digital ... moved its measures" [MS15] and "Shopify estimates about 20% productivity ... reversion rate roughly flat" [SHOP1, grade C interview; the note calls it a "humble estimate"]. Lesson 6 caveat: "Shopify does not yet let AI check in code automatically" [SHOP1]. | med | Add short labels in words: "Microsoft Digital's Inside Track account says ...", "the GA announcement says ...", "in an interview, Shopify's head of engineering estimates about 20% ...". |
| 2 | I.2, row II.7 Testing | Rated Moderate, but by the section's own definition ("several companies with numbers" = strong) it qualifies for Strong: META1 is grade A with measured acceptance (73%), ABNB1 has numbers (3.5K files, 97%), AIE6 has numbers (11% to 72%). AWS3 (rollback and upgrade-downgrade testing) is not a test-generation source and fits II.4 better. "No Microsoft source" is too strong: MS8 reports tests are 65.7% of CCA-added lines, and GH1 describes a human-only contract-test space. | med | Either rate Strong (with "one is a talk") or state why Moderate (for example "no post-merge defect data; one source is a talk"). Replace AWS3 with GH1 or MS8. Reword the gap to "No Microsoft test-generation outcome data". |
| 3 | I.2, rows V.1 Service catalog and IV.4 Agent identity | Both are rated Moderate, but the notes contain no measured outcomes for either (lesson 5's own caveat says "no source measures catalog accuracy or its effect on agent outcomes"; IV.4 sources are all product docs and BeyondProd design, no outcomes). The definitions say thin = "practice or guidance with no measured outcomes", and moderate = "one or two companies", which overlap. | med | Make the definitions exclusive (for example: thin = no measured outcomes, whatever the number of companies; moderate = measured outcomes from one or two companies or mostly talks). Then rate V.1 and IV.4 Thin, or write "Moderate (practice only, no outcomes)" with that qualifier defined. |
| 4 | I.2, row II.11 Incidents | Rated Moderate, yet MS11 is grade A measured production data (RCA accuracy up to 0.766 on a year of incidents) and MS9 gives production numbers (35,000+ incidents; 3 min vs 40.5 h). Under the stated definition this could read as Strong for investigation. | low | Split or qualify: "Strong for RCA and investigation (MS11, MS9); thin for autonomous mitigation". |
| 5 | I.2, row II.1 Intake | Microsoft-first: no Microsoft source is listed although MS14 (ADO AI Work Item Assistant, story breakdown from an hour+ to "less than three minutes") is the Microsoft intake reference. Thin rating remains justified (one before/after anecdote). | low | Add MS14 first in Main sources. |
| 6 | I.1 lesson 4 | "Anthropic's engineers ... can fully delegate only 0 to 20% of their work" [AN4]. The note says "Most can 'fully delegate' only 0–20%". | low | Insert "most": "most can fully delegate only 0 to 20%". |
| 7 | I.1 lesson 5 | "mabl reports context-drift failures falling from about 40% to under 5% with a cross-repo coordination graph" attributes the drop to the graph; the note lists the figure among self-reported numbers for the whole four-layer system. | low | "after building its cross-repo base and coordination graph (vendor-reported)" or drop the causal "with". |
| 8 | I.1 lesson 7 caveat | "rings bound blast radius but do not catch a change that is green but wrong" is an uncited analytic claim. | low | Prefix "Recommendation:"-style framing ("Our reading:") or cite SPOT4 for the green-but-wrong failure mode. |
| 9 | I.1, all eight "So for an existing service:" lines | Prescriptive synthesis is not prefixed "Recommendation:" as the conventions require. The skeleton asks for a "so what" line, and none is presented as company practice, so this is a labelling issue only. | low | Rename to "Recommendation for an existing service:" or add one sentence under the I.1 intro saying these lines are the document's own recommendations. |
| 10 | Open gaps, bullet 5 | Says lessons 5, 6 and 8 lean on talks, an interview and vendor reports. Lessons 1 (AIE3), 3 (SHOP1, AIE2) and 4 (AIE6) do too. | low | "Lessons 1, 3, 4, 5, 6 and 8 lean partly on ..." and list AIE2, AIE3, AIE6. |
| 11 | I.2 overall | The skeleton asks for lessons against companies with grades and diagram D1 (heat map of stage x company). The section gives stage x rating with no company columns and no diagram. | low | Confirm with the owner that the stage table replaces D1, or add a compact company-per-stage heat map. |

## Counts

- High: 0
- Medium: 3
- Low: 8

## Verdict

**PASS WITH FIXES.** Numbers, quotes and code mappings are clean, and synthesis is never presented as company practice. Fix the weak-source labels (row 1) and make the I.2 ratings match the section's own definitions (rows 2 and 3); the rest are small edits.
