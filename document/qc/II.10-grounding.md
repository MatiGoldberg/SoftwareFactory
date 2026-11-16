# II.10 grounding review

Section: `document/sections/II.10.md`. Checked against 01-conventions.md, references.md and the source notes for GOOG1, GOOG2, GOOG5, MS1, MS3, MS4, MS5, MS27, SPOT1, SPOT2, AIE2 and AIE5.

All 12 codes map to the right source IDs. All three quotes are verbatim: "perhaps no more than a dozen", "Canarying is effectively an A/B testing process.", "Some defects will reach production." and "Quick iterations with online A/B experiments are key". The numbers check out: 30 days, 5 minutes, 1/24/72 h, 2.5M+ and >20 PII types. No "(summary)" items are used. Both talks (AIE2, AIE5) are described as conference talks. There are no em-dashes or en-dashes. The template headings are present and in order. Rung names are exact. The stated ceiling is Act on approval (L2), and the one L3 row is marked "Future proposal". Role names match between the chart and the table. REQ areas (PRD, OBS, CFG, GOV, SEC) are all on the conventions list. Cross-references to V.1, D1, II.2, II.9 and II.12 are used, and the kit items are written as "(template: proposed)". Prose length is about 900 words, which is within 700 to 1,000.

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Gates, Exposure ramp and SLO check bullets | Three claims rest only on grade-C notes (MS1, MS3): "code ships dark ... [MS1]", "Every flag change is itself a deployment [MS3]", and "Azure's health model adds usage metrics [MS3]". The text does not say the sources are weak. | med | Say so in words, for example "Microsoft Learn guidance states ..." or "Azure's Well-Architected guidance (a docs page) says ...". |
| Real-world reference, Gandalf paragraph | "Gandalf's batch layer sets the latent-fault window" reads as if Gandalf sets a window for flags. Gandalf's 30-day batch is for rollouts. Applying it to a flag ramp is our synthesis, and REQ-OBS-02 already labels it that way. | med | Reword: "Gandalf's batch layer is the model for the latent-fault window" and add "**Recommendation:** reuse its 30 days as the default after full exposure." |
| Real-world reference, Gandalf paragraph | "a window of about one hour around each deployment". The note says "±1h around each node deployment", which is a two-hour span. | low | Write "±1 hour around each node deployment [MS4]". |
| Real-world reference, Gandalf paragraph | It does not explain what Gandalf is. It only points to II.9, but the template asks for an explainer the reader can use without that. | low | Add one clause: "Gandalf, Azure's global deployment watchdog, ..." |
| Gates, Exposure ramp; SLO check; Real-world reference | Microsoft-first is broken. GOOG5 comes before MS1/MS27 in the ramp bullet and before MS3 in the SLO bullet, and Google's chapter is placed before Gandalf. | low | Put MS1/MS27 first in the ramp bullet and MS3 first in the SLO bullet, or give Gandalf first in Real-world reference. |
| Gates, Experiments bullet | The GOOG1 quote is about Google's internal AI developer tools, not product features. That caveat appears only in Open gaps, so in the body the quote sits next to product experiments and could mislead. | low | Add inline: "(about its internal AI developer tools, not product features)". |
| Gates, SLO check / REQ-OBS-01 | "A breach turns the flag off" is cited to GOOG5 and MS3. MS3 says halt on alert, and GOOG5 does not mention turning off a flag, so mapping a breach to a flag-off is synthesis. | low | Add "Recommendation:" before "A breach turns the flag off", and add "Recommendation" to the REQ-OBS-01 Source cell. |
| REQ-CFG-02 | "auto-merge only after a clean Act on approval record" is our promotion rule, but the row cites only SPOT1, SPOT2 and GOOG2. | low | Append "; Recommendation" to the Source cell. |
| First flowchart | The "Experiments" gate is described in the bullets but has no node in the chart. This is minor drift between the chart and its notes. | low | Either add an "Experiment readout" node next to the acceptance check, or fold the bullet into "Acceptance check". |

## Verdict

**PASS WITH FIXES**. 0 high, 2 med and 7 low. The grounding is sound: no fabricated numbers, quotes or codes. The fixes are labelling and wording.
