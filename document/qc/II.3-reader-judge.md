# II.3 reader-judge report

Reader: a busy Microsoft engineering leader who knows engineering basics but not the cited systems. One read, no source notes.

Length check: about 1,050 words of prose outside tables and diagrams, just over the 700 to 1,000 target. Both Mermaid blocks pass the validator (block 1: shown 672x508, text 13.2px; block 2: shown 672x668, text 15.2px). The section is tight and close to the approved bar. Its main problems: the L3 spec-amendment row conflicts with "no agent approves a spec"; the "ready gate is a script" claim blurs into human approval; the generator, the evaluator and the two Anthropic harnesses are used before they are explained; and the section recommends sprint contracts but does not address the fact that Anthropic removed them.

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 3/5 | The one-line recommendation is clear. But line 32 ("The gate is a script ... not a judgement call") sits next to a human-approval gate, and the Spec-drafting L3 row lets the agent re-tag a spec with no owner approval, which contradicts REQ-VER-03 and the Approval bullet. |
| 2. Reading flow | 4/5 | It follows the template well. The snags: line 38 packs two harnesses, a quote, numbers and a reversal into one paragraph, and the sprint contract is introduced three times (line 38, the chart, line 63) before it is defined in one place. |
| 3. Key references | 3/5 | Spec Kit is fine (introduced in II.2). "Anthropic's long-running harnesses ... the first ... the second" never says what they are; "generator" and "evaluator" are used (line 38) before any explanation; "hooks" vs "CLAUDE.md" (line 26) and "claims their file scopes" (planner L2) are unexplained for this reader. |
| 4. Level of detail and length | 3/5 | It is slightly over budget. "Changes to criteria or non-goals re-enter the gate" appears three times (lines 30, 95, and in II.2); "the implementing agent can never weaken checks" appears four times (lines 44, 63, REQ-VER-02, the L4 row). The "Stale harness parts" bullet is not an enterprise complication. Missing: how non-regression criteria (checks that already pass) fit the "checks must fail" rule. |
| 5. Message | 4/5 | The takeaway lands: done is fixed as failing checks before code exists, agents draft them, owners freeze them, and the implementer can never weaken them. It is weakened only by the unresolved tension with Anthropic dropping sprints. |
| 6. Diagrams | 4/5 | Both charts are readable, sensibly sized, use orange agent nodes plus a legend, and match II.9 and II.2. In chart 1, the dotted "any failure" loop starts at the approval box rather than at the gates. In chart 2, rungs are not shown (II.9 does show them), and the sprint-contract half has no human, which is right, but the chart does not say that the contract sits downstream in II.5. |

## The one takeaway (as it should land)

Every acceptance criterion becomes a committed, failing check before any code is written. Agents draft the spec, the checks and the plan; a deterministic gate plus the named owners freeze them as a tagged version; and no implementing agent can ever weaken them. Start both agents at Prepare (L1).

## Concrete edits

1. **Fix the L3 contradiction (required).** In the Spec-drafting agent L3 row, "Makes non-semantic amendments to a tagged spec (for example, a non-breaking contract version bump or a broken link), re-runs the gate and notifies the owner" lets the agent produce a new tagged spec with no approver. That clashes with REQ-VER-03 ("No agent approves a spec") and line 30. A contract version bump is also not non-semantic: line 83 quotes "Any change of behavior requires a change in the API version." Replace it with: "Fixes non-semantic defects in a tagged spec (broken links, renamed paths, typos), re-runs the gate and notifies the owner; the gate, not the agent, re-tags, and only when the diff touches no criterion, check, non-goal or contract reference." In REQ-VER-03, add: "the one exception is the non-semantic amendments allowed at Act, then notify, which the script re-validates."

2. **Separate the script from the approvals (required).** Line 32: "The gate is a script over repo files, not a judgement call." Replace it with: "The four checks are a script over repo files; the only human step is the owners' approval, which the script verifies is recorded before tagging." In REQ-VER-03, change "a deterministic script: constitution rules, red checks, resolved references, two-way traceability, owner approvals" to "a deterministic script that checks constitution rules, red checks, resolved references and two-way traceability, and verifies that owner approvals are recorded."

3. **Address Anthropic removing sprints (required).** After "because 'every component in a harness encodes an assumption about what the model can't do on its own' [AN3]." (line 38), add: "**Recommendation:** keep sprint contracts at first anyway, because in a production service the contract is also the audit record of what was checked; drop them only when the trust ledger shows they no longer catch anything." Then delete the "Stale harness parts" bullet (line 86), which this replaces.

4. **Explain the Anthropic harnesses and the generator/evaluator before relying on them.** Line 38: replace "**Anthropic's long-running harnesses** show a spec an agent executes. In the first," with "**Anthropic's long-running harnesses** are two engineering write-ups on keeping coding agents productive over many hours. In the first [AN2],". At "the generator and the evaluator negotiate", write "the generator (the coding agent) and the evaluator (a separate testing agent) negotiate".

5. **Handle criteria that already pass.** Line 27: "A criterion with no check, or a check that already passes, blocks the spec." Add: "Non-regression criteria (existing behavior that must not change) are the exception: they are marked as such and must pass." Without this, a reader will see the rule as unworkable for changes to an existing service, which is this document's whole audience.

6. **Cut the repeats.** At line 30, delete "Changes to criteria or non-goals re-enter the gate." (REQ-CTX-02 covers it, and II.2 already says the same for PRDs). At line 63, shorten "a lint ensures it adds to the task's spec checks but never removes or loosens them; afterwards only the evaluator records results, like Anthropic's 'passes'-only rule [AN2]." to "a lint ensures it only adds checks; only the evaluator records results [AN2]." REQ-VER-02 already carries the full rule.

7. **Add the deterministic-core sentence that II.2 and II.9 both have.** After the one-line recommendation (line 44), add: "The constitution, the ready-gate script, the owner approvals, the version tag and the contract lint stay deterministic; agents write inputs to them and never approve." This is the owner's first criterion, and right now the reader has to assemble it from the one-liner.

8. **Explain the jargon in two places.** Line 26: change "the same line Anthropic draws between deterministic hooks and advisory CLAUDE.md instructions [AN5]" to "the same line Anthropic draws between hooks (scripts that always run) and CLAUDE.md instructions (advice the model may ignore) [AN5]". In the planner L2 row, change "claims their file scopes" to "announces which files each task will edit (see Cross-service specs below)".

9. **Chart 1: move the failure loop.** `APP -. "any failure or<br/>criteria change" .-> SP` draws gate failures as coming from the approval box. Either relabel it `"rejected or<br/>criteria change"` or add a short note under the chart: "Any failed gate returns the PR to its author." This is minor and has no size impact.

10. **Chart 2 (optional): mark the section boundary.** The sprint-contract half happens at II.5 time. Add a note under the legend: "The sprint contract is drawn here because this stage defines its rules; it is written and enforced per task in II.5 and II.7." Leave the size as it is (668px tall, close to the 700px limit), so add no nodes.

11. **Trim to budget.** The two edits in 3 and 6, plus cutting "The post measures none of its claimed benefits [MS13]." (line 36; the gap is already in Open gaps, and II.2 says the same), bring the prose back under 1,000 words.

## Verdict

**READY AFTER EDITS.** Edits 1 to 3 are required; the rest are polish.
