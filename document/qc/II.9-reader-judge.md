# II.9 reader-judge report

Reader: a busy Microsoft engineering leader who knows deployment basics but not the cited systems. One read, no source notes.

Length check: about 1,030 words of prose outside tables and diagrams (including headings, Sources and Gaps), which is just above the 700 to 1,000 target. Both Mermaid blocks pass the validator. Length is acceptable; the problem is density and a few repeats, not total size.

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 3/5 | The deterministic/agentic split is stated well (line 49), but the reader will ask "if the watchdog already halts and rolls back automatically, what does the agent's halt/LKG/flag-off add?" The section never answers that. |
| 2. Reading flow | 4/5 | Purpose, process, reference, agentify, complications, requirements runs in a logical order. Two snags: the first chart has a dangling "Promote to next ring" node, and the agent chart shows only two of the five rungs without saying so. |
| 3. Key references | 3/5 | Gandalf is now explained well. But SDP is never spelled out, LKG is not expanded, Azure SRE Agent (the main source for the agent half) gets no "what it is" line, and "zeta stage", "SEVs" and "maxConcurrency" are left unexplained. |
| 4. Level of detail and length | 3/5 | The ring order is listed twice, the platform-upgrade caveat appears three times, the Fleet `Completed` caveat appears twice, and the bake-gate and risk-gating bullets carry specialist detail that belongs in requirement rows or in II.8. |
| 5. Message | 3/5 | The best line, "an agent may halt, never promote; a false halt costs hours, a false go costs customers", is buried at line 81 after the table. The takeaway does not land until the reader is nearly done. |

## The one takeaway (as it should land)

Rings, bake and the watchdog's go/no-go stay deterministic. Agents write the rollout plan and act as on-call: first they speed up the investigation (Advise), and only after a proven per-action record do they take the three reversible mitigations by themselves (halt, roll back to LKG, flag off). An agent may halt a rollout but never promote one.

## Concrete edits

1. **Resolve the watchdog vs SRE-agent overlap (most important).** In chart 1, the step after `HALT` is an automatic `LKG["Roll back to LKG or flag off"]`, so the agent's L3 actions look redundant. Change `HALT --> LKG["Roll back to LKG or flag off"]` to `HALT --> DEC{"On-call: roll back to LKG, flag off, or fix forward?"}`. Then add one sentence under the agent chart: "The watchdog only stops the rollout it blames. Choosing and running the mitigation, and handling alarms the watchdog does not attribute (for example during the 30-day watch or from customer reports), is on-call work. That is the work the agent takes over, rung by rung." This one change makes criterion 1 pass.

2. **Put the takeaway first.** Move line 81's sentence up to open "What to agentify, and how far". Replace "The pipeline, the bake policy and the watchdog verdict stay deterministic." with: "**In one line:** the pipeline, bake policy and watchdog verdict stay deterministic; agents write the rollout plan and do the on-call work, and an agent may halt a rollout but never promote one (a false halt costs hours, a false go costs customers)." Then delete the second sentence of line 81 ("**Recommendation:** an agent may halt, never promote; ..."), but keep the **Recommendation:** label on the new sentence, because it is synthesis.

3. **Remove the dangling node in chart 1.** Delete `W -- "go: all green" --> NEXT["Promote to next ring"]`. The rings already chain R1 to R6, so instead label one ring edge, for example `R1 -- "go after bake" --> R2`. Right now NEXT goes nowhere, and the reader cannot tell whether it is a ring.

4. **Stop listing the ring order twice.** On line 28, cut "The ring order is Azure's: stage, canary, pilot, light region, heavier region, then each half of the region pairs [MS-GANDALF-NSDI, A]." and replace it with "The rings are Azure's [MS-GANDALF-NSDI, A]." The chart already lists them.

5. **Spell out SDP and LKG.** At the first use of SDP (line 31, "Azure's tools"), write "Azure's Safe Deployment Practices (SDP) tooling". In chart 1, keep the label short, but expand LKG in the gates notes: "roll back to the last known good (LKG) release".

6. **Explain Azure SRE Agent before relying on it.** Line 69 opens "Microsoft first: Azure SRE Agent lets teams choose...". Add a clause in front: "Azure SRE Agent is Microsoft's generally available agent that investigates and mitigates incidents on Azure resources; it lets teams choose..." (check the exact description against the MS-SRE-GA note). It is the main reference for the agent half, so it needs its own short "what it is", as Gandalf has.

7. **Cut the repeats from the AKS Fleet paragraph.** On line 43, cut "Two caveats: "A group can be `Completed` even if all members failed.", and platform-initiated upgrades bypass fleet sequencing [MS-AKS-FLEET]." Both caveats are already in line 87 and REQ-PIPE-01. Also cut "paced by approval gates, maxConcurrency and a failure budget (default 0, fail fast)" and replace it with "paced by approval gates and a failure budget". The specialist knob names add nothing for this reader.

8. **Trim the bake-gate bullet.** On line 31, cut "including a full business day for business-hours-peak services" (specialist). The bullet then carries one idea per sentence: policy sets bake, about 24 hours by default, promotion only while all signals stay green.

9. **Cut "zeta stage".** On line 86, cut "AWS also tests backward compatibility in a zeta stage that calls production endpoints [AWS-HANDSOFF]." The term is unexplained, and the bullet's point (two-phase across teams) stands without it. If you keep the idea, make it a requirement row instead.

10. **Shorten the risk-gating bullet, which belongs to II.8.** Replace line 88 with: "**Risk-based gating.** Meta tightens gates only for its riskiest diffs during sensitive periods [META-RELEASE-RISK, A] (see II.8). [GAP: no Microsoft source, and no source uses a risk score to set ring speed or bake.]" This drops the 5/10/50% split and the 10,000-change freeze statistic, which are II.8 material.

11. **Merge the config mentions.** Config appears at line 33 ("Config is code"), line 89 ("Config volume") and REQ-CFG-01. Fold line 89 into line 33 as one sentence ("At Meta, config is "another large category" of SEVs (severe incidents) after code [META-DRS]") and delete the line 89 bullet. This also explains "SEVs".

12. **Say which rungs the agent chart shows.** In chart 2, the edges show only Advise and Act, then notify. Add before the chart: "The chart shows the lowest and highest everyday rungs; the table gives all five." Otherwise the reader looks for Prepare and Act on approval in the diagram.

13. **Fix the L3 promotion evidence.** In the table row for L3, "Halt precision on past incidents near the watchdog's (Gandalf: 92.4% to 94.9%)" compares the agent's mitigations to a detector's precision. These are different things. Replace with "Replayed on past incidents, chose the same mitigation as humans in nearly all cases, with zero wrong-target actions; time to mitigate below the human baseline". Add "time to mitigate" to the Key metrics line (line 35) too. It is the metric that justifies the agent, and it is missing.

14. **Link to the uber chart.** Add one clause to Purpose: "This stage zooms into the Deploy box of the overview chart (0.4)." That gives the reader the bridge from the uber chart to this section.

15. **Minor wording in Purpose.** In "Because agents raise change volume, the pipeline must stay deterministic and policy-driven, whoever wrote the change.", drop "whoever wrote the change". Section 0 and line 49 already make the point, and the clause reads as filler.

## Verdict

**READY AFTER EDITS.** The structure, the Gandalf explainer and the rungs table answer the owner's earlier feedback. Edits 1 to 3 are required: without them the agent's role still overlaps the deterministic halt, and the key message is buried. Edits 4 to 11 remove repetition and specialist detail, and take the prose back under 1,000 words.
