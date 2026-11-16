# II.8 Integration and merge: reader-judge report

Reader: a busy Microsoft engineering leader who wants the ideal deterministic merge process and to know which parts to agentify.
Inputs read: 01-conventions.md (including the rung-consistency rules), 00-skeleton.md, the approved II.9 and II.2, II.8.md, and both diagram previews. Cross-checked II.6, II.7 and II.12 for overlap.
Measured: about 1,000 words of prose without tables and diagrams, at the top of the 700 to 1,000 range. Validator: both blocks OK, no WARN (block 1 is 672x564 with 12.7px text; block 2 is 672x552 with 14.7px text).

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity (deterministic core, rungs) | 4 | The one-line recommendation and "the risk model is a gate, not an agent" make the core plain. Two rows blur roles: the conflict agent also reverts culprits, and the "explanation" agent writes code at L1. |
| 2 | Reading flow | 3 | The Purpose drifts into a second talk's remedy that is never used again. The gates list relies on TAP, BeyondProd and the release train before they are introduced, and the agentify paragraph mixes evidence for both agents. |
| 3 | References explained before use | 3 | SubmitQueue and DRS are explained well. "Rosie", "TAP train", "BeyondProd", "Agent Merge" and "sponsor" are used bare, and the gate bullets cite Google's test train before the Real-world reference. |
| 4 | Detail and length | 3 | At the word ceiling. The section has three reference systems where one or two are wanted, a signed-artifact bullet with three companies, dense DRS capture-rate arithmetic, and an LSC paragraph that duplicates II.12 and II.6. |
| 5 | Message | 4 | The takeaway lands: as agents add PR volume, merge becomes the constraint, so the queue, the risk model and verified main stay deterministic, and agents only repair conflicts and explain risk. The phrase "neither can land a change" conflicts with the L3 row. |
| 6 | Diagrams | 4 | Both are readable and sized well, with orange agent nodes and a legend, consistent with II.9 and II.2. Small issues: chart 1 never shows what the risk tier changes; edge labels mix "fails" and "fail"; one agent edge lacks a rung label. |

## Rung-consistency check (01-conventions, end)

- **No agent approves.** Holds. The L3 row says the change "lands only because every gate passes", and REQ-MRG-03 bars agents from editing scores or thresholds. However, the one-line recommendation says "neither can land a change", which reads as contradicting the L3 row, where a resolution lands with no human click. Reword (edit 6).
- **Ceilings.** No "realistic ceiling for today" is stated. The table marks conflict-agent L3 as "Our proposal" and L4 as "Not proposed". On the risk agent, L2 carries a bare "Ceiling". Make that explicit (edit 11).
- **Labels.** L0 rows are comment-only (Advise), which is correct. The risk agent's L1 ("split the diff, wrap in a flag, add tests") authors code, so the role name "Risk-explanation agent" undersells it. The conflict agent's L1 includes "a revert of the bisected culprit", which is a different action (a culprit revert, close to "roll back to LKG") and needs its own trust record (edit 10).
- **Role names.** The chart and the table match ("Conflict-resolution agent", "Risk-explanation agent").

## Concrete edits

1. **Purpose, cut a sentence.** Cut `A talk titled "Merge is the bottleneck" gives the metric: "Count the developer's time through to merge." [AIE12]; its remedy is running end-to-end tests in a full cloud environment before the PR opens.` Reason: neither the metric nor the remedy is used again, and the Uber figure already makes the point. Replace with nothing, or at most add "P95 time to land" to Key metrics, where it already is. Also drop AIE12 from Open gaps.

2. **Gates, "Verified main" bullet.** Replace `Google's test train bisects non-flaky failures to the culprit change [GOOG6]` with `failures are bisected to the culprit change [GOOG6]`. Reason: "test train" is not introduced yet, and II.7 already owns flaky-test handling (II.7 gate "Flaky failures"). Add "(flaky tests: see II.7)".

3. **Gates, "Signed artifact" bullet, cut to one Microsoft example plus a pointer.** Replace the whole bullet with: `**Signed artifact.** Microsoft's Secure Future Initiative (SFI) requires "code signed and reproducible builds to prevent tampering" [MS19]. Deployment verifies the signature and provenance before the first ring (see II.9, IV.7).` Reason: three companies for one gate is too much ("one strong example beats three"), and BeyondProd [GOOG7] is unexplained. AWS1 and GOOG7 stay in REQ-SEC-01's source column. Also note for the consistency QC: II.9's entry gate does not list signature verification, so either II.9 gains it or this sentence points to IV.7 only.

4. **Real-world reference, LSC paragraph: cut to one sentence or move it.** The paragraph is the third system (the convention asks for one or two), it uses the unexplained names "Rosie" and "TAP train", and it duplicates II.12 (Authorization, Sharding) and II.6 (Cross-team PRs). Replace it with an Enterprise-complications bullet: `**Fleet-wide agent changes.** Google shards large-scale changes by ownership and runs them at low priority so they do not starve the queue [GOOG6]; see II.12.` Then REQ-MRG-06 can keep only the queue-priority clause (edit 13).

5. **DRS paragraph, simplify the arithmetic.** Replace `A simple baseline captured 18.7%, 27.9% and 84.6% of SEVs at those thresholds; the best LLM captured 1.40, 1.52 and 1.05 times that [META3].` with `At the two stricter thresholds, the best LLM caught about 1.4 to 1.5 times as many SEVs as a simple baseline; at the loosest, about the same [META3].` Reason: six numbers a busy reader cannot use. The exact figures can sit in REQ-MRG-03's rationale if needed, and the grounding QC should confirm the paraphrase.

6. **One-line recommendation, fix the apparent contradiction with L3.** Replace `and neither can land a change or move a score.` with `neither approves a change, edits a score or sets a threshold; a change lands only when the deterministic gates pass.` Reason: under the L3 row a textual resolution lands with no human click, so "cannot land" contradicts it.

7. **Agentify paragraph, split it by agent.** The paragraph from "GitHub's Agent Merge..." to "...suggested actions [META3]." mixes evidence for both agents. Reorder it into two short paragraphs: (a) conflict resolution: Agent Merge, then semantic conflicts [AIE10]; (b) risk explanation: Meta's next steps [META2, META3]. Also replace `(vendor marketing)` with `(vendor-reported)`, which is the convention's label, and gloss the product: `GitHub's Agent Merge, a Copilot feature that ...`.

8. **Agentify, sentence to cut.** Cut `The chart shows each agent at its everyday rung; the table gives the ladder.` Reason: the legend and the table make this obvious. If kept, it should name the rungs, as II.2 does ("shows the agent at Prepare and Act on approval").

9. **Diagram 1, show what the tier does.** The node "Risk score sets tier" leads straight into the queue, so the reader cannot see the strictness change. Add an edge label such as `RS -- "tier sets reviewers,<br/>tests, relaxation" --> MQ`, or rename the node `Risk tier sets<br/>gate strictness`. Also make `fails` and `fail` the same word. At 12.7px, block 1 sits just above the WARN threshold, so do not widen it.

10. **Table, conflict agent L1, remove the culprit revert.** Delete `, or a revert of the bisected culprit`. Reason: a culprit revert is a different action with a different blast radius (rung rules: name each rung by what the agent does, and autonomy is granted per action). If you want it, add one row labelled `Culprit-revert (same agent)`: Prepare, with the human running it. Otherwise list it under Open gaps.

11. **Table, risk agent.** In L2, replace `Opens the drafted split or flag change as a PR. Ceiling` with `Opens the drafted split or flag change as a PR. Highest rung proposed; L3 and L4 not proposed because the change alters behaviour.` Consider renaming the role `Risk-reduction agent` in both the chart and the table, since at L1 it writes code, or keep the name and say so. In the L1 guardrail, add `rescoring limited to N attempts; drafts are audited for gaming the model`, because an agent that iterates against the gate is the obvious failure mode.

12. **Chart 2, label consistency.** Change the edge `"flags semantic overlap"` to `"Advise: flags<br/>semantic overlap"` so that every agent edge names its rung.

13. **REQ-MRG-06, trim the overlap.** Sharding by ownership with a per-owner cap is already REQ-OWN-01 in II.6 and II.12. Reduce the statement to: `Fleet-wide agent changes run at low queue priority with a cap on queued shards, so they cannot starve interactive changes (sharding: see II.12).`

14. **REQ-SEC-01, explain "sponsor".** Replace `agent identity and sponsor` with `agent identity and its accountable human sponsor (see IV.4)`. The term is not explained in this section.

15. **Missing (essential, short).** Nothing says what happens after the bisect beyond "hold pointer". Add one gate line: `Post-merge failure: the pointer holds, the culprit's author is paged, and the culprit is reverted under policy.` Without it, the deterministic process ends in a dead end, and readers will wonder who unblocks main.

16. **Inline GAP repetition.** Three inline GAPs (combined-state queue at Microsoft, cross-repo queue, agent rungs) are repeated word for word in Open gaps. Keep the inline GAPs only where they qualify a specific claim (combined-state, cross-pipeline). Drop `[GAP: no source measures an agent resolving semantic conflicts or explaining risk scores; the rungs are synthesis.]` under the table, because Open gaps covers it. This saves about 40 words.

## Verdict

**READY AFTER EDITS.** The structure, the deterministic core and the diagrams meet the II.9/II.2 bar. Edits 1 to 6 cut about 150 words and remove the unexplained names. Edit 6 and edit 10 close the rung-consistency issues.
