# Reader judge: Part 0 (front matter)

Reviewer: reader judge, reading as a busy Microsoft engineering leader opening the document cold. Bar: II.9 and II.2 (owner-approved). Validator run on 2026-11-16: both blocks OK, no WARN (block 1: 672x660 shown, 15.1px text; block 2: 672x698 shown, 14.1px text).

Word counts (prose, charts excluded): 0.1 = 390, 0.2 = 344, 0.3 = 126, 0.4 = 255, 0.5 = 724, Open gaps = 85. Total about 1,925 words, against a skeleton target of "~1 page" plus chart and primer. The excess is almost all in 0.5 and the 0.4 "How to read it" paragraph.

## Scores (1 to 5)

| Criterion | Score | Reason |
|---|---|---|
| 1. Executive summary stands alone | 4 | Thesis, five requirements, first three steps and "done" all fit in under a page; but it uses rung names (Prepare, Act on approval) and "nine steps" without defining them, and never states the one decision a leader must make. |
| 2. Flow and orientation | 4 | Summary, reading map, scope, chart, primer is the right order; 0.2's table is the best orientation device in the document. Minor: 0.4's closing paragraph re-lists Part III. |
| 3. Primer | 3 | Clear and well chosen at the top (SDP/Gandalf, CCA, AI review, Entra Agent ID, SRE Agent, Honk, DRS, Minions), but 724 words is not "two minutes", it repeats Part II numbers, and it misses DORA and AKS Fleet Manager, both cited across several Parts. |
| 4. Length and repetition | 3 | About 30% over what a reader needs: primer statistics duplicate II.9/II.5/II.12, and the Act, then notify class list appears in the chart, its legend, the 0.4 paragraph, 0.3 and Part III. |
| 5. Diagrams | 3 | Both charts are readable at 672px and the spine is good (every stage a visible box, gate on line two). The "overlay" is not an overlay: twelve orange boxes joined by invisible links (`~~~`), with no flow and no white core, so it reads as a table drawn as a chart rather than as agents attached to the spine as in II.9 and II.2. |

## Diagram findings

- **Spine (block 1).** Good. Each Part II stage is a box, labelled with its stage ID, grouped in four rows; text 15.1px. The II.11 to II.1 feedback loop is only in prose; I tested adding `R2 -. "repair items" .-> P1` and Mermaid widens the chart to 1,236px (8.7px text), so leaving the loop in the caption is the right call.
- **Overlay (block 2).** Same grid, so the eye can match boxes, which is the strength. Weaknesses: no arrows, so it does not read as the same flow; every node is orange, so the "deterministic core" the caption talks about is invisible; it is labelled "overlay" but overlays nothing. Consistency with II.9/II.2: same `classDef agent` colours and a one-line legend, so it passes the convention check; it fails the spirit (II.9 and II.2 show orange agents next to white gates).
- **One chart or two.** I built and validated a merged single chart (12 stage nodes, three lines each: stage, gate, highest agent rung, orange border on white): it reads well but renders 715px tall (WARN, 15px over), and it needs L-numbers instead of plain rung names to fit, which breaks the vocabulary rule. Conclusion: keep two charts, but make the second one visibly the same flow (edit 9). With real arrows instead of `~~~` the overlay still passes (672x698, 14.1px; tested).

## Concrete edits

1. **0.1, add a one-line ladder definition after the thesis paragraph** so the summary stands alone. Insert as a new paragraph after "...against a human-only baseline (see III.1, III.2).":
   "**The rungs, in one line:** Advise (agent suggests), Prepare (agent drafts, human runs), Act on approval (human clicks or merges, then it runs), Act, then notify (pre-approved reversible actions, humans review afterwards), Autonomous within budget (future)."
   Reason: Step 0, Step 1 and "done" all use rung names a cold reader has not met.

2. **0.1, add the leader's decision.** After the "first three steps" bullets, add:
   "**The decision for you now:** name a sponsor and one pilot service, fund Step 0, and set lead time and change failure rate, not PR counts, as the targets."
   Reason: the summary says what the factory is but not what the reader should do on Monday.

3. **0.1, "done" paragraph.** Replace "All nine steps have exited on ledger evidence" with "All nine roadmap steps (Steps 0 to 8, see III.4) have exited on ledger evidence". Reason: the summary shows only three steps; "nine" arrives unexplained.

4. **0.1, requirement 2.** Replace "acceptance criteria are failing checks before code exists, and agents cannot weaken tests" with "acceptance criteria become automated checks before any code is written, and agents cannot weaken or delete them". Reason: "failing checks" is test-first jargon that a leader will stumble on.

5. **0.2, citations paragraph.** Delete "(A- and B+ mark near-boundary cases)". Reason: specialist detail; the reference table explains itself.

6. **0.4, first caption.** Replace "Every box is deterministic or human; the second line names the gate that decides it." with "Every box is deterministic or human; its second line names the gate that decides it." (minor), and keep "Repair items from II.11 and new signals feed back into II.1." as is (the edge cannot be drawn without breaking width; tested).

7. **0.4, "How to read it" paragraph (about 150 words).** Replace the whole paragraph with:
   "**How to read it.** Work flows through the spine in the first chart, and no orange box replaces a gate: agents feed the spine and read its outputs. Act, then notify applies today only to reversible or mechanical classes (Part III lists them); feature code, tests, validation and rollout plans stop at Act on approval, and Autonomous within budget is a future proposal everywhere. The service catalog (see V.1) and the trust ledger (see III.2) sit under every box."
   Reason: the current text re-lists every L3 class by stage, which Part III and each Part II table already do, and says "white spine" although the spine renders lavender and the overlay has no spine at all.

8. **0.4, legend under chart 2.** Replace "Orange boxes are agents; * means only for the narrow classes named below, with everything else in that stage at Act on approval or lower." with "Orange boxes are each stage's agents, their highest rung today and what still decides; * means only for narrow, reversible classes (see III.1), with the rest of that stage at Act on approval or lower." Reason: after edit 7 the classes are no longer "named below".

9. **0.4, chart 2: make it read as the same flow.** Replace every `~~~` with `-->` (the six in-row links and `PLAN ~~~ BUILD`, `BUILD ~~~ SHIP`, `SHIP ~~~ RUN`). Tested: still passes (672x698, 14.1px). Reason: with invisible links the overlay looks like a 12-cell table; with arrows it reads as the agent layer of the same PDLC. Also replace the lead-in "The second chart overlays the agents on the same grid." with "The second chart is the same grid seen from the agent layer." Reason: it does not literally overlay anything.

10. **0.3, last bullet vs 0.4.** Keep "Not a promise of autonomy" in 0.3; after edit 7, 0.4 no longer repeats it. No change to 0.3.

11. **0.5, cut statistics that Part II repeats; keep one number per system at most.** Specific cuts:
    - Gandalf: delete "; over 18 months it reached 92.4% precision and 100% recall on the data plane [MS5]" (repeated verbatim in II.9).
    - CCA: replace "in ten months in dotnet/runtime, 535 of 878 PRs merged, with success rising from 41.7% to about 71% [MS8]" with "in dotnet/runtime about 71% of its PRs now merge [MS8]".
    - Google: delete "Google's large-scale change process supplies the authorization and sharding rules [GOOG6]."
    - Spotify: delete ", and its lineage found the consumers of about 1,800 pipelines before a migration [SPOT5]".
    - Meta DRS: delete "Release engineers gate the top-scoring diffs, from the top 5% on weekends to the top 50% in red periods [META3]." (II.8 detail).
    Reason: the primer's job is "what is it", not evidence; together these save about 120 words.

12. **0.5, delete "Azure's breaking-change review" bullet.** It is used only in II.4, whose Real-world reference already explains it. Saves about 30 words.

13. **0.5, collapse the six one-line minor references into one "Also cited" paragraph.** Replace the bullets for Anthropic's harnesses, OpenAI's harness engineering, Amazon, Uber's uReview, Duolingo and Shopify and mabl with:
    "**Also cited:** Anthropic's harness posts (separate the agent that writes from the one that grades) [AN3]; OpenAI's Codex harness (a short AGENTS.md as 'a map') [OAI1]; Amazon's wave deployments with automatic rollback and two-phase changes [AWS1, AWS3]; Uber's uReview AI reviewer [UBER1]; Duolingo's agent test backfill, one conference talk [AIE6]; Shopify's rule that a human reviews every merge [SHOP1]; and mabl, a test vendor whose AI review blocks but cannot approve (vendor-reported) [MABL1]."
    Reason: six bullets with statistics for systems cited once or twice; the sections that use them explain them. Saves about 100 words.

14. **0.5, add the two missing systems** (each is cited in four or more sections):
    - "**AKS Fleet Manager** sequences Kubernetes upgrades across many AKS clusters in stages, with approval gates [MS21] (II.9, IV.3)."
    - "**DORA**, Google's DevOps Research and Assessment program, supplies the delivery metrics this document measures by (lead time, change failure rate) and finds AI amplifies existing team strengths and weaknesses [GOOG3, GOOG4]."
    Reason: the summary's "done" test uses DORA metrics without naming them; Fleet appears in II.9, IV, V.2 and VII.

15. **0.5, heading.** After edits 11 to 14 the primer is about 450 words, which makes "in two minutes" honest. If the writer keeps more, rename to "Real-world systems in brief".

## Verdict

**READY AFTER EDITS.** The executive summary and the spine chart already meet the bar. Edits 1, 2, 7, 9 and 11 to 14 are needed so the summary stands alone, the overlay reads as part of one picture, and the primer is short and complete. Expected result: Part 0 drops from about 1,925 to about 1,550 words with no loss of substance.
