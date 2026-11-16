# II.1 Intake and ideation: reader-judge review

Reader: a busy Microsoft engineering leader. Bar: approved II.9 and II.2. Prose length about 905 words (in range).

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity (deterministic vs agent, rungs) | 3 | The one-line recommendation states the core well, but the Linking agent's L3 "merges exact duplicates" collides with "dedupe keys stay deterministic" and "never closes an item", and several L1/L2 rows differ only by a click. |
| 2 | Reading flow | 4 | Follows the template cleanly; the Shopify/MS15/Anthropic quote paragraph interrupts the move from recommendation to chart. |
| 3 | References explained before use | 3 | Microsoft Digital is used in the gates (MS28) before it is defined in Real-world reference; Linear is never said to be an issue tracker; "Spotify's chief architect" has no context. |
| 4 | Detail and length | 3 | Within budget, but the lead Microsoft reference (story-to-task breakdown, 100+ tasks in 3 minutes) is a planning number, not an intake one; the "Other references" paragraph and the PII bullet/REQ-SEC-02 overlap II.2. |
| 5 | Message | 3 | The Purpose framing ("intake decides what the factory spends review capacity on") is good but never returned to; the takeaway (agents do the reading toil, humans own priority) lands only via the Shopify quote. |
| 6 | Diagrams | 5 | Both validate OK (13.9px and 16px text, under 700px tall), uncluttered, orange agents plus legend consistent with II.9/II.2, placed where they help. |

## Concrete edits

1. **Linking agent, L3 row (contradiction).** "Adds "related" links and merges exact duplicates, then notifies; any owner can undo" with guardrail "Only links and merges, both reversible; never closes an item". If a duplicate is "exact", the deterministic key dedupe already merged it; and a merge effectively closes the duplicate. Replace with: "Adds "related" links and proposes merges of near-duplicates the keys missed; links are added at once and notified, merges wait for an owner click" and guardrail "Links only; any owner can undo; merges stay at Act on approval (L2)". Align REQ-PRD-04 to: "...agent-suggested duplicates are merged only after owner approval and remain reversible."
2. **Microsoft Digital defined too late.** In the "Classify and route" gate, change "At Microsoft Digital, "Every area path..."" to "At Microsoft Digital (Microsoft's internal IT organization), "Every area path..."" and drop the parenthetical from the Real-world reference paragraph.
3. **Lead reference measures the wrong thing.** "The only number published is that breaking stories into 100+ tasks went from an hour or more to "less than three minutes" [MS14]." This is task decomposition (II.3/II.5), not intake. Replace with: "Microsoft publishes no intake-specific number for these tools [MS14]." or move the number to II.5. Also the AI Work Item Assistant "enforces structure ... acceptance criteria" already appears in II.2's Other references; keep it in one place.
4. **Linear not explained.** "**Linear's triage agent** is described in one conference talk:" -> "**Linear's triage agent** (Linear is a commercial issue tracker) is described in one conference talk:". Since Linear is the only reference that does exactly this stage's job, consider making it the first reference and saying so.
5. **Unexplained / bare authority.** Purpose: "as Spotify's chief architect put it [SPOT2]" -> "as Spotify put it in a 2026 talk [SPOT2]", or cut the attribution; the reader does not need the title.
6. **Cut non-essential quote.** Delete "Anthropic's advice to treat Claude Code "as a thought partner rather than a code generator" [AN1] fits the brief agent." It adds no mechanism. Also consider cutting the MS15 sentence; the Shopify line carries the point.
7. **Trim "Other references".** Keep RCACopilot (measured classification baseline). Cut "Uber's context graph links design docs, Jira and incidents, according to one talk [AIE2]" (already used in II.2 REQ-CTX-01) and fold the SRE Agent memory sentence into an Enterprise complication or Open gap (it is already an open gap).
8. **Rungs that differ only by a click.** Brief agent L2 "Attaches the brief to the item after owner approval" with evidence "As above, over a long sample" adds nothing over L1. Delete the row. Clustering L1 "Owner submits it" vs L2 "Files the record after one owner click" is a thin distinction; either merge into one row or state what L2 saves (for example, "batch-files all themes above a signal-count threshold after one click").
9. **Starting rung.** "Start at Advise (L0)." conflicts with the Brief agent's lowest row being Prepare (L1). Replace with "Start clustering and linking at Advise (L0) and the brief agent at Prepare (L1)."
10. **Convention violations on kit items.** Table cell "(template: [GAP])" -> "(template: proposed)". Open gaps "Proposed kit item: an intake record and opportunity brief template (D9)." -> "...template (template: proposed; see kit-proposals.md)". Conventions forbid self-numbering D9+.
11. **Overlap with II.2 on PII.** Enterprise bullet "Customer data in feedback. One talk reports Uber's gateway redacts more than 20 PII types before model calls [AIE2]." duplicates II.2. Replace with "Customer data in feedback. Redact PII before any model call, as for interview transcripts (see II.2)." and shorten REQ-SEC-02 to the permissions-inheritance half plus "PII redaction as REQ-SEC-01".
12. **Missing essential: the incident-to-requirement loop.** The skeleton's main source for II.1 is AIE-UBER-SDLC, and Part VII step 1 is "an incident pattern becomes a feature request". The section never shows that loop concretely. Add one sentence under Real-world reference (from AIE2, labelled as one talk) on how Uber turns incident/production signals into work, or a [GAP] if the note does not support it.
13. **Land the message.** Add one closing sentence to the "What to agentify" opener tying back to Purpose, for example: "**Recommendation:** measure the intake agents by what they save owners in triage time, not by items filed; more items means more review load." This answers the review-capacity framing set up in Purpose and echoes the AIE12 warning.
14. **Process chart, minor.** Owner triage "accept or reject" omits "reassign", which the gate bullet lists. Change the node to "Owner triage:<br/>accept, reject, reassign" (still short enough).
15. **REQ-GOV-02 source.** MS15 (accountability with people) does not support rate limits or a ledger; change Source to "AIE12; Recommendation".

## Verdict

**READY AFTER EDITS.** Edits 1, 3 and 2 matter most; the rest are trims.
