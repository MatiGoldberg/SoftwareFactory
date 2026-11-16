# VI reader-judge review

Section: `document/sections/VI.md` (Part VI, Transformation plan for an existing service).
Reader: a busy Microsoft engineering leader who has to run this plan for one service.
Length: 2,436 words in total, 1,952 of them outside the mermaid block and tables. The target is 1,500 to 1,900, so about 550 words need to go.
Diagram: the validator prints OK (653x680, 16px text). No WARN, though the chart is close to the 700px height limit.

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity (what stays deterministic, what each rung does) | 3 | Rungs are named per step and the "L3*" footnote is good. But the phase labels contradict III.4. Steps 5 to 8 are lumped into one open-ended "Day 180+" bucket, so the leader cannot tell what happens when. |
| 2 | Reading flow | 3 | Readiness, then pilot, then phases, then measurement, operating model and risks is the right order. VI.4 and VI.5 drift into a survey of evidence, citing companies in series where the reader wants instructions. |
| 3 | References explained before use | 3 | "eight pillars", "as Airbnb did" (before the Airbnb case appears), uReview, 1ES, "replay agreement", "useful and addressed rate", "grilling agent", Spec Kit and the "human-owned test area [GH1]" are used without a gloss. |
| 4 | Detail and length | 2 | About 25% over target. Much of the excess restates III.4 or III.2: the same quotes, the same exit criteria and the same review-bottleneck and cost evidence. Two things a leader needs are missing: what to do when an exit criterion fails, and a phase-review cadence. |
| 5 | Message | 3 | The takeaway, "gate on exit criteria, not dates, and measure DORA plus the ledger, not PR volume", is there but diluted. "Faster and faster" is never turned into a quarterly target or trajectory. |
| 6 | Diagram | 2 | Readable, but it largely duplicates the III.4 phase chart. Its subgraph names ("Phase A to B", "Phase B to C") contradict III.4's phase definitions. It has no agent or legend convention, and it gives Steps 5 to 8 a single box. |

## Contradictions with III.md

1. **Phase membership.** In III.4, Phase A is Steps 0 to 3, Phase B is Steps 4 and 5, and Phase C is Steps 6 to 8. VI's chart puts Step 3 in "Phase A to B" and Step 5 in "Phase B to C". The VI.3 heading "Days 0-30 ... (Phase A begins)" is fine, but the subgraph names are not.
2. **Phase gates.** III.4 gates each phase on "ledger evidence" and requires the full ledger before Phase C. VI's edge labels are single metrics: "no test reverts" lets the plan pass Step 2's review criterion without checking it, and "class reverts at baseline" leaves out the Step 4 clarification-rate criterion.
3. **Step 6 exit criterion.** III.4 gives "Plans accepted unchanged; low revert rate". VI says "plans accepted unchanged" only, while claiming to be "As in III.4".
4. **Step 2 rung.** VI says review "starts at Advise (L0)", which is consistent with III.1, where Advise is the AI reviewer. But VI never names the rung for the click-to-apply fix, which III.4 sets at Act on approval (L2). Add it so the two sections match.

No contradiction on "agent never approves": VI.5 keeps auto-merge to classes promoted to Act, then notify, consistent with REQ-GOV-09.

## Repetition of III.4 and III.2 (cut or replace with a cross-reference)

- VI.1 opening: "AI is a 'mirror and a multiplier' ... [GOOG3], and gaps humans tolerate ... [AIE8]" is almost word for word from III.4 paragraph 2.
- VI.3 per-phase "Deliverables" and "Exit criteria" restate the III.4 table rows: the Stripe two-round CI cap, "Act on approval (L2)" per step, the test-only diff check, the class and risk check, and the exit metrics. The last bucket even says "As in III.4".
- VI.4: the Booking.com "hours saved" bullet [AIE5] and the Microsoft Digital "usage to flow" bullet [MS15] repeat III.2's promotion-evidence paragraph.
- VI.5 Review capacity: the Shopify quote "not yet at the place where we allow AI to check in code automatically" is already in III.1. GOOG2 and SPOT2 as the review bottleneck are already in III.4's closing "Two warnings" paragraph.
- VI.5 On-call: "Meta keeps them human [AIE4]" appears in III.1, in III.4 Step 7, and again here.
- VI.6 risk rows "Review overload (76% ... [SPOT2])" and "Cost growth ($250 per person per day [SHOP1])" repeat III.4's closing paragraph and VI.5.
- VI.6 "Model or harness change regresses" repeats III.2 and REQ-GOV-07 verbatim in substance.
- The dotnet/runtime numbers in VI.3, Step 5 (67.9% against 87.1%, 41.7% to 71%) are already in II.5, and III.2 uses them too.

## Numbered edits

1. **Fix the chart's phase names to match III.4.** Rename `B["Phase A to B"]` to `B["Phase A ends, Phase B starts"]`, or better, split it by step. Change the edge labels to the real gates: `A -- "D8 passed; Steps 1-2 exit met" --> B` and `B -- "Steps 3-4 exit met" --> C`. Reason: as written, the chart contradicts III.4's phase definitions and gates.
2. **Split "Day 180 and after" into two buckets with dates**, for example "Days 180-270: Step 5, bounded features" and "Days 270-365: Steps 6 to 8, production loop", each with its own team, exit criteria and watch list. Reason: a leader cannot run an open-ended bucket of four steps, and this is the part of the plan that delivers "faster features".
3. **Delete the VI.1 opening sentence** "AI is a 'mirror and a multiplier' ... (one conference talk) [AIE8]." Replace it with: "Step 0 starts by measuring the service against the readiness checklist (template: D8; rationale in III.4)." Saves about 40 words of duplication.
4. **Cut the restated exit criteria in VI.3.** Replace each "Exit criteria" bullet with "Exit criteria: Steps N–M in III.4", plus only what is VI-specific (the sample window, who signs). Delete "As in III.4: ... (Step 7)." in the final bucket. Saves about 120 words and removes the Step 6 drift.
5. **Shorten the Step 5 deliverable.** Replace "Set expectations from dotnet/runtime: in the first ten months ... about 71% recently [MS8]." with "Expect a lower success rate than human PRs at first, rising with tuning (dotnet/runtime data in II.5)." Saves about 50 words.
6. **VI.4: cut the Booking.com, Microsoft Digital and adoption (EXT1) bullets**, keeping Shopify and Spotify, and add "see III.2". The EXT1 adoption-curve bullet supports neither recommendation. Saves about 110 words.
7. **VI.5 Review capacity:** cut "Google [GOOG2] and Spotify [SPOT2] both hit review as the limit." and the Shopify quote, replacing them with "(evidence in III.4)". **On-call:** cut "Meta keeps them human [AIE4] (one conference talk)." Saves about 60 words.
8. **VI.5 Ownership:** cut the four-company evidence list (Shopify six engineers, Uber tiger team, 1ES, embedded case) down to one line: "Shopify runs its proxy with about six engineers [SHOP1]." It is the only sizing data point a leader can use for headcount. "1ES" and "tiger team" are otherwise unexplained.
9. **VI.6:** delete the rows "Review overload", "Model or harness change regresses" and "Vanity metrics". All three are covered in VI.4, VI.5 and III.2. Keep the service-specific rows.
10. **Gloss or drop unexplained references:**
    - "gaps listed against the eight pillars": say what the pillars are in five words, or drop the phrase.
    - "If a test-framework migration is pending, include it, as Airbnb did.": move this after the Airbnb bullet, or write "(see Airbnb below)".
    - "Uber rolled out uReview team by team": write "Uber's AI reviewer, uReview, ...".
    - "replay agreement": write "agreement with humans on replayed past incidents (see III.2)".
    - "useful and addressed rate": add "(see II.6)" on first use.
    - "grilling agent ... Spec Kit [MS13]": add "(see II.2, II.3)".
    - "human-owned test area [GH1]": say what it is in four words.
11. **Add a "when a step misses its exit criterion" rule** of about 30 words, for example: "Recommendation: if a step misses its exit criterion at the planned date, hold the step, fix the verifier or the class allow-list, and re-review at the next phase review; never skip ahead." This is what makes the "calendar is a target" line operable.
12. **Make "faster and faster" concrete.** In VI.4, add one line: "Recommendation: report lead time for changes and change failure rate quarterly against the Step 0 baseline; the plan is working when lead time falls each quarter while change failure rate holds." This is the owner's stated goal, and the section should close on it.
13. **Promote the proposed phase review record** from Open gaps into VI.3 as a single sentence: "Each phase ends in a phase review chaired by the sponsor (template: proposed)." This gives the leader a governance cadence.
14. **Day 0–30 realism.** Add: "If the service has no rings with an automatic halt yet, Step 0 takes as long as that work takes; no agent change merges before it." Reason: 30 days for rings, gateway, Entra Agent IDs, D6 and D7 is not credible for many services, and the section's own gate rule implies this sentence.
15. **Open gaps:** delete the DORA bullet ("The source notes do not define the four DORA delivery metrics ..."). VI.4 defines them inline and [GOOG4] is DORA, so the gap reads as a contradiction.

## Diagram

- It renders cleanly at column width (16px text, 680px tall), but it sits close to the height limit.
- It does not follow the II.9 and II.2 convention of orange agent nodes plus a legend. That is acceptable for a timeline, but then the "L2, L3*" rung labels should be explained in a one-line legend under the chart, not a three-line paragraph.
- It overlaps the III.4 chart. Consider replacing it with a compact timeline table (Days | Steps | Highest rung | Gate) and dropping the mermaid block. That would also save height.

## Verdict

**READY AFTER EDITS.** The structure is right and a leader could start Step 0 from it. Before approval, fix the III.4 phase contradiction (edits 1 to 2), cut about 550 words of repetition of III.4 and III.2 (edits 3 to 9), and add the miss rule and the quarterly "faster" target (edits 11 to 12).
