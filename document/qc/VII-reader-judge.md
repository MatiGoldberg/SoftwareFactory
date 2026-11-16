# VII reader judge (worked example: Larkspur Notifications)

Reader: a busy Microsoft engineering leader. Prose is about 2,370 words without the Mermaid blocks (steps about 1,900, vignettes about 460), so it is at the top of the 1,800 to 2,300 target. Aim for about 2,000 after the cuts below. Both diagrams pass the validator (D11: 672x671, 15.6px text; D11b: 672x534, 12.9px text). Neither prints a WARN.

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity (deterministic vs rung) | 4 | The Acts/Gate/Ledger/Label grid makes every rung explicit, and almost all of them match Part II. Three things blur it: the two-phase "Prepare" phase is easy to confuse with the "Prepare (L1)" rung, the step 3 sequence is muddled, and no one is named as the requester, so requester-is-not-approver cannot be checked. |
| 2 | Reading flow | 4 | The steps run in a clean order and the failure in step 8 lands well. The repeated identity and managed-identity lines (steps 4 and 7, plus the service paragraph) and the label lines that repeat inline citations slow the reading. |
| 3 | References explained first | 4 | Most mechanisms point back to the Part II stage that explains them. "LKG" is defined only in step 8. "Tolerant reader" is used without a gloss. Gandalf is cited in step 8 as "as Gandalf does" with no one-line reminder of what it is. |
| 4 | Detail and length | 3 | About 300 to 400 words can go (see cuts). The vignettes repeat II.12 and II.5 almost word for word: the GOOG2 shell and the review-bottleneck quote are in II.12 lines 38 and 65, the SPOT5 lineage is in V.1 line 60 and II.12 line 27, and the MS8 merge rates are in II.5 line 40. Missing: a named human cast and one line on elapsed time. |
| 5 | Message | 3 | The implicit lesson is strong: the deterministic core caught a context gap, not an agent error, and the repair goes into the catalog and verifiers. The section never says this. It ends on vignettes and gaps instead. |
| 6 | Diagrams | 4 | Both are readable, orange agent nodes are used, and the D11 legend is good. D11 is a stage flow, not the "teams x stages swimlane" the skeleton asked for, but it works. In D11b the replay runs in parallel with the fix, although the text says replay happens after the fix. Its edge label "Prepare" is ambiguous. Its legend does not explain the rounded gates. D11 sits at the 700px height limit. |

## Consistency check (rung rules and referenced sections)

These match the referenced sections: clustering (L0) and brief (L1) agents with II.1; grilling agent at L2 for dependency questions with II.2 row 72; spec-drafting agent at L1 (draft PR) with II.3; contract and compat (L1), breaking-change (L0) and threat-model (L1) agents with II.4; coding agent at L2 with II.5; AI reviewer block at L3 under the blocking rule (II.6); test-generation agent at L2 with II.7; risk-explanation agent at L0 with II.8; rollout-plan agent at L2 with II.9; SRE agent at L0/L1 with the L3 aside, consistent with II.9 and II.11; the drift cap and repair exemption with V.1 line 75; and "rolling back writers before readers" with the AWS3 note. No agent approves anything. Issues:

- **Planner agent at L2 (step 4).** II.3 says it files tasks "after approval", but the step names no approver.
- **Requester vs approver (steps 4 and 7).** Step 7: "acting on behalf of the requesting engineer [MS22] ... and Profile's owner merges it." Nothing names the requester. If the requester is Profile's owner, this breaks REQ-GOV-09.
- **Drift-cap timing (steps 8 and 9).** The cap applies "while the drift item is open", and every agent action on Larkspur drops to Advise. If the drift item opens when the SRE agent finds the undeclared subscription, the coding agent's tolerant-reader PR at L2 in step 8 would itself be capped. It is not a catalog-repair PR, so the exemption does not cover it. Say when the drift item opens, or say the incident fix runs before it opens.
- **Step 3 sequence.** The text says the agent caught the breaking shape *before* the PR, yet "In CI the diff labels the original shape as breaking". If Profile switched before the PR, CI never saw the original shape. The heading "the breaking-change diff fires" makes this worse.
- **Watchdog sees digest-worker (step 8).** II.9's entry gate requires health signals only for touched components, and digest-worker was not touched. One clause is needed to say that its signals were registered as its own component, so the fleet-wide watchdog could see them. Otherwise a reader asks how the halt happened at all.
- **Ledger blame (step 9).** "the contract and compat agent's plan records a missed consumer" puts the catalog's gap on the agent's record, which would demote it unfairly. Record it as a catalog miss.

## Concrete edits (cuts first)

1. **Intro, cut.** "and no company has published this end-to-end run" can go, because Open gaps bullet 1 already says it (-9 words).
2. **Step 7, cut.** Delete "The delivery-router service reaches the new API version with its existing managed identity, so no secret changes hands [MS16]." The service paragraph already says this (-22).
3. **Step 7, cut.** In "The rollout-plan agent, acting on behalf of the requesting engineer [MS22], opens", delete "acting on behalf of the requesting engineer [MS22]," because step 4 already sets up OBO. Also delete "Bake times come from policy, not the plan (see II.9)." (-20)
4. **Label lines, compress.** Each label line repeats the citations already given inline in its step. Keep only the citations that do not appear in the step text. Step 4 becomes "[Published] see citations above; coordination graph across 79 repos [MABL1] (vendor-reported). [Illustrative] the plan." Do the same in steps 5, 6, 7 and 8 (-60 to -80).
5. **Step 5, cut.** Delete ", which is Act, then notify by the blocking rule (see II.6)". The Acts bullet already gives the rung (-11).
6. **Step 6, cut.** Delete "its one suggestion, keeping the v3 writer behind a flag, is already done." Keep "The risk-explanation agent explains the score." (-14)
7. **Vignettes, trim to about 90 words each.** These cuts remove the overlap with II.12, II.5 and V.1, and keep what is new: the link to a step and the rung (-150).
   - Google: delete "Static analysis found the locations and an LLM toolkit wrote the edits; build and unit tests validated them. The same engineer then reviewed the changes and sharded them to code owners."
   - Spotify: delete "A human migration guide led to wrong field mappings, and explicit mapping tables fixed it." It is irrelevant to Larkspur.
   - Microsoft: delete "Success rose from 41.7% in the first month to about 71%." and "Copilot Code Review runs on every PR."
8. **Open gaps bullet 2, cut.** It duplicates the II.9 gap almost exactly. Replace it with "Step 8's SRE agent behaviour is synthesis on top of MS10 (see II.9 gaps)." (-20)
9. **Fix step 3.** Replace "the breaking-change agent runs the diff before the PR and proposes an additive field in a new API version instead. In CI the diff labels the original shape as breaking, as Azure's tooling does, and only the review board can clear that label [MS25]. Profile takes the additive version." with "the breaking-change agent runs the same diff CI uses before the PR, and it flags the change as breaking. In CI that verdict would add a label that only the review board can clear [MS25]. The agent proposes an additive field in a new API version instead, and Profile takes it."
10. **Disambiguate Prepare.** Write "the Prepare phase" and "the Activate phase" wherever the phase is meant: in step 7, step 8 ("never received a Prepare-phase build"), step 9 ("Prepare-phase complete") and Open gaps. In D11b, change the edge label `"Prepare"` to `"Prepare (L1)"`. II.4 already uses "Prepare-phase/Activate-phase".
11. **Name the cast (step 4 or step 1).** Add one clause, for example "Maya, the Experience owner, requests the work; each team's maintainer approves its own repo's PRs." Then step 7 reads "...on behalf of Maya; Profile's owner merges it." This makes requester-is-not-approver visible (+20).
12. **Planner approval (step 4).** "The planner agent files tasks" becomes "After the Experience owner approves the plan, the planner agent files tasks" (+7).
13. **Step 8, believability.** "digest failures and dead-lettered messages rise" becomes "dead-lettered messages on digest-worker's profile-events subscription rise". A daily digest would not fail within the hour. After it, add "(digest-worker's health signals were registered as its own component)".
14. **Drift-cap timing (step 9).** Add "The drift item opens once the fix has merged" or "The incident fix was in flight before the drift item opened". Without one of these, the L2 tolerant-reader PR contradicts V.1's cap.
15. **Ledger line (step 9).** "the contract and compat agent's plan records a missed consumer" becomes "the missed consumer is recorded as a catalog gap, not against the contract and compat agent".
16. **D11b order.** Make the replay follow the merge: `MRG --> ONC --> RES`. Remove `SRE -- "Prepare" --> ONC` and replace it with `SRE -- "Prepare (L1):<br/>replay command" --> ONC`, keeping the replay after MRG. Change the legend to "Orange boxes are agents; rounded boxes are deterministic gates; the rest is the deterministic core." Give it a label (D11b) to match D11.
17. **Add the takeaway (end of step 9, about 40 words).** "**What this shows:** no agent caused or approved the failure. The deterministic core (watchdog, rollback policy, normal gates) contained it, the gap was in context (an undeclared consumer), and the fix went into the catalog and verifiers, not into a prompt."
18. **Glosses.** In step 8, write "tolerant-reader PR (it ignores and preserves unknown fields)". Write "as Gandalf, Azure's deployment watchdog, does [MS4]".

Net effect: about -330 words cut and +90 added, landing at about 2,100 prose words.

## Verdict

**READY AFTER EDITS.** The story is concrete and believable. It shows four repos, two pipeline systems, AKS beside App Service, and an undeclared legacy consumer, which is exactly the kind of failure an enterprise leader recognizes. It makes II, III and V.1 click step by step. The fixes are local: the Prepare naming clash, the step 3 sequence, the requester and drift-cap consistency, the D11b ordering, and trimming the vignettes.
