# III reader-judge report

Reader: a busy Microsoft engineering leader who wants to know where to start on Monday and why to trust each next step. One read, no source notes.

Length check: about 1,900 to 2,000 words of prose outside the requirements table and the diagrams (headings and Open gaps included). That is at the top of the 1,600 to 2,000 target, so every edit below that adds text is paired with a cut. Both Mermaid blocks pass the validator (block 1: 276x582, 16.0px text; block 2: shown 672x534, 14.1px text). No WARN.

Consistency with Part II: I compared every "What to agentify" table in II.1 to II.12 with the III.1 ceiling paragraph and the III.4 roadmap. The PR rule is applied correctly throughout (agent opens PR, human merge = L2). "No agent approves" holds everywhere, including REQ-GOV-09. Three mismatches are listed in the edits (Step 2 rung, the L3 inventory on line 35, and the watchdog's place in the order).

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 4/5 | Line 32 names exactly what stays deterministic, and the rung table gives a concrete Part II example per rung. Two lapses: Step 2 is labelled L2 although its blocking check is L3 under the conventions' blocking rule, and the "Deploy watchdog" step title suggests an agent watchdog that line 87 then says is deterministic. |
| 2. Reading flow | 4/5 | Ladder, ledger, identity, roadmap is the right order. The 7-column, 9-row roadmap table will be very cramped at 672px, and the phase grouping in the diagram (0-2, 3-5, 6-8) contradicts the risk grouping in the prose (1-3, 4-5, 6-8). |
| 3. Key references explained | 3/5 | Meta's ladder, mabl, Entra Agent ID and OBO are explained. Not explained: "the eight readiness pillars [AIE8]", "sprint contracts", "ready gates", "two-phase discipline (II.4)", "Gandalf-style go/no-go" (relies on II.9 and 0.5 only). |
| 4. Detail and length | 3/5 | At the cap, and much of the length is re-quoted Part II evidence: the MS8 numbers (II.5), Uber 75%/65% (II.6), the Spotify judge 25% (II.7), "skew positive" (II.3, II.4, II.7). The DORA trust paragraph and half of III.3 (which IV.4 will cover) are non-essential. Missing: a deterministic safety net in Step 0, and a concrete "what to do first week" line. |
| 5. Message | 4/5 | The takeaway (autonomy is earned per action with ledger evidence, around a deterministic core) lands by the end of III.2, but III.4 has no one-line opener, so the Monday-morning answer is spread across a dense table. |
| 6. Diagrams | 4/5 | Both are readable and sensibly sized; the L4 "future" grey box and the L3* footnote are good. The ladder is a tall 582px column of five boxes that mostly repeats the table (its only new information is the demotion arrow). Neither chart has agent nodes, so the orange agent convention and legend do not apply; that is fine here. |

## The one takeaway (as it should land)

Keep the pipeline, gates and watchdog deterministic from day one. Then let agents earn autonomy one action at a time, in nine steps ordered by risk, each step promoting only when the trust ledger shows the action matches a recorded human baseline, and demoting automatically on the first revert.

## Concrete edits

1. **Fix the Step 2 rung (rung rules, blocking rule).** In the roadmap table, Step 2's rung cell reads "Act on approval (L2); proven categories feed a deterministic required check". Under 01-conventions ("When an agent's finding blocks a merge through a deterministic policy, that is Act, then notify (L3)") and II.6's own table ("Act, then notify (L3): block"), this is L3. Replace it with: "Act, then notify (L3) for blocking findings in proven categories, overridable by the owner; fixes stay at Act on approval (L2)". Change the diagram node to `S2["Step 2<br/>AI review, L3*"]` and extend the caption's L3* definition: "...or blocking findings in proven review categories (Step 2)". Line 35 already counts the blocking label as L3, so this also removes an internal contradiction.

2. **Move the deterministic safety net into Step 0 and rename Step 6.** Step 3 lets migration PRs auto-merge (L3) and Step 5 raises feature-PR volume, but rings, the automatic halt and registered health signals only appear as Step 6 prerequisites. That runs against the document's own lesson that safe deployment is the backstop that makes speed affordable. In Step 0's Prerequisites, add "rings with bake and an automatic, deterministic halt (see II.9); health signals registered". In Step 6, rename "Deploy watchdog and risk-gated rollout" to "Rollout-plan and risk-explanation agents", and replace the prerequisite "health signals registered" with "the Step 0 halt has a clean record". Update the diagram node to `S6["Step 6<br/>Rollout plans, L2"]`. This is the most important edit for the "small, safe steps" test.

3. **Add a one-line opener to III.4 that a leader can act on.** Before "Recommendation: agentify in nine steps", add: "**Recommendation, in one line:** on Monday, pick one service and one team, record human-only baselines and fill the readiness checklist (D8); turn on the first agent only after that, and promote each action one rung at a time on ledger evidence." To pay for it, cut the last sentence of line 75 ("Anthropic's engineers already work this way: ... [AN4].").

4. **Align the phases with the risk rationale.** Line 77 groups Steps 1 to 3 (mechanically verifiable), 4 to 5 (new behaviour), 6 to 8 (production), but the diagram groups 0 to 2, 3 to 5 and 6 to 8. Move S3 into Phase A and rename it "Phase A: foundations and verifiable change", rename Phase B "Phase B: new behaviour" (Steps 4 and 5). Alternatively, rewrite line 77 to match the diagram; either way the two must agree.

5. **Make the roadmap table fit the column.** Seven columns of long cells will wrap into an unreadable strip at 672px. Drop the "Part II" column and put the section references in brackets in "What agents do" (for example "...open labelled PRs (II.7, II.10)"). Shorten Controls cells to the two most important controls each; the rest are already in the Part II tables. For example, Step 3 Controls: "Verifiers before PR; demote on revert".

6. **Correct the L3 inventory on line 35.** It omits L3 rungs that Part II recommends today: II.1's linking agent ("Adds related links"), II.12's discovery agent ("Sends reminders ... escalates stragglers"), II.11's postmortem agent filing intake items, and II.6's low-risk class approved by the deterministic risk gate. Replace "and gate-tightening actions such as a blocking label (II.4, II.6)." with "gate-tightening actions such as a blocking label (II.4, II.6), and low-impact bookkeeping such as adding links, reminders or filing intake items (II.1, II.11, II.12)." Add after the II.2/II.3 clause: "II.6's low-risk class rung is approved by the deterministic risk gate, not the agent."

7. **Explain or cut unexplained terms.**
   - Step 0: "Inventory verifier gaps across the eight readiness pillars [AIE8]" becomes "Inventory verifier gaps (tests, lint, build, docs) using the readiness checklist (D8) [AIE8]". The pillars are never named.
   - Line 55: cut "removed sprint contracts once newer models made them unneeded, and". The term is not defined here, and the quote before it makes the point.
   - Step 4 Controls: "Deterministic ready gates" becomes "Deterministic ready gates (lint and sign-off that decide a PRD or spec is complete, see II.2)".
   - Step 6 Prerequisites: "two-phase discipline (II.4)" becomes "two-phase rollout of contract changes (II.4)".

8. **Cut evidence that Part II already carries.** In line 39, keep only the point and one number: "Across ten months in dotnet/runtime, Copilot Coding Agent PRs succeeded far more often when small (80.0% for 1 to 10 lines against 64.0% for 101 to 500) [MS8]; see II.5 for the full dataset." Cut the 67.9%/87.1%, 41.7% to 71% and revert-rate sentences (they are in II.5). In line 49, cut the Uber parenthesis "(Uber reports 75% ... [UBER1]; see II.6)" and keep "(see II.6)". This saves about 80 words.

9. **Cut the DORA trust paragraph (line 57).** "DORA's 2025 survey explains why ... per-action number." The survey numbers do not support any ledger design choice; the line before it ends the section better. Saves about 45 words.

10. **Shorten III.3 to what this part needs.** Keep the actor-of-record paragraph and the three-modes list. Replace the Entra Agent ID paragraph (line 63) with two sentences: "Entra Agent ID gives each agent its own Entra identity, created from a blueprint whose preferred credential is a managed identity, with the creating user recorded as its sponsor [MS12, MS22]. Microsoft's own pilot gives each agent its own ID 'instead of having it borrow a person's' [MS18]." IV.4 carries the rest. Saves about 50 words.

11. **Give promotion a starting default, labelled as ours.** "over a sample its owner judges long enough" leaves the leader with no number, which makes the ledger less concrete than it should be. Add after it: "(Recommendation: as a starting point, at least several dozen actions and several weeks of production traffic per class, tuned per class in the promotion review; no source publishes a threshold)". This keeps the Open gaps line honest while giving the reader something to start with.

12. **Make the demotion arrow match the text.** The ladder chart shows demotion only from L3 to L2, but line 51 says an escaped defect or a rise in override rate demotes at any rung. Either add `L2 -- "trigger demotes" --> L1`, or change the caption to "Each arrow moves one action, not one agent; a demotion trigger drops an action one rung from any level." The caption change is cheaper and keeps the chart small.

13. **Optional: shrink the ladder chart.** It is 582px tall for five boxes that repeat the table. If space is needed, drop the edge labels "ledger evidence" (the caption says it) to shorten it by about a third.

## Verdict

**READY AFTER EDITS.** Edits 1 and 2 are required (rung-rule compliance, and a safe ordering). Edits 3 to 6 are strongly recommended for the "start on Monday" test. The rest are trims.
