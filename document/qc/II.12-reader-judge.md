# II.12 reader-judge report

Reader: a busy Microsoft engineering leader who knows engineering basics but not the cited systems. One read, no source notes.

Length check: about 1,120 to 1,150 words of prose outside tables and diagrams (depending on whether headings count), against a 700 to 1,000 target. Both Mermaid blocks pass the validator with no WARN (block 1: 672x660 shown, text 14.5px; block 2: 495x646, text 16px). The cuts in edits 1 to 9 remove about 160 words and bring the prose to about 960 to 990.

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 4/5 | The one-line recommendation says exactly what stays deterministic (discovery, sharding, verification, merge gate, tracker), and the table states that the class and risk gate, not the agent, decides at L3. Two small gaps: "class and risk gate" and "migration driver" are used before they are explained. |
| 2. Reading flow | 4/5 | Clear order, and the deterministic chart reads top to bottom. The agentify section stacks three bold paragraphs (Green but wrong, Review is the bottleneck, Realistic ceiling) between the chart and the table, which delays the table, and the ceiling line repeats the opening recommendation. |
| 3. Key references | 4/5 | LSC, Rosie, Honk, Fleetshift and Fleet Management are explained before use. Unexplained: "1ES", "Service 360", "Resource Graph", "GA", and "migration driver". |
| 4. Detail and length | 3/5 | About 15% over the limit. The overrun is in a few stacked statistics (JUnit, Spotify's 1,500 PRs and 1,000 PRs in 10 days, Amazon's CEO quote) and in weak single-talk anecdotes (Maersk, AIE9, AIE5, AIE15), not in the core mechanism. |
| 5. Message | 4/5 | One takeaway, stated early and backed by the strongest evidence in the document: tools decide where and verify, the LLM writes the edit, and auto-merge applies only to allow-listed mechanical classes. It lands. |
| 6. Diagrams | 4/5 | Both are readable at column width, sized well, and match II.9 and II.2 (orange agent nodes, legend). Chart 2 says "stragglers go back to discovery" in a node with no edge back, and "Merges on green" leaves the actor unclear at the L3 branch. |

## Rung consistency (01-conventions.md)

- **Ceiling:** passes. "Realistic ceiling today: Act, then notify" matches the table, and the only L4 row starts with "Proposal:".
- **No self-approval:** passes. At L2, "the owner's merge is the approval"; at L3, "Class and risk gate decide, not the agent". The driver, a human, approves scope. Deletion is always human-run (table and REQ-DEP-01).
- **Labels:** pass. L0 "runs a sample... and reports" is Advise. The discovery agent's L3 (reminders, stale-PR flags, escalation) is reversible and cannot close, merge or delete.
- **Roles:** pass. "Discovery/impact agent" and "Migration agent" are spelled the same in the chart and the table.
- **One wording risk:** the chart 2 node `AUTO["Merges on green,<br/>owner notified"]` can be read as "the agent merges". See edit 10.

## Concrete edits

Length cuts (about 160 words in total):

1. **Real-world reference, Google paragraph.** Cut "A JUnit3 to 4 migration covered 5,359 files and 149K+ lines in three months, with about 87% of AI code committed unchanged [GOOG2]." (about 23 words). The int32-to-int64 case already makes the point. One strong example is enough.
2. **Airbnb and Amazon paragraph.** Cut the Amazon sentence: "Amazon's CEO reported (self-reported, no quality data) that Amazon Q cut Java 17 upgrades ... shipped unchanged [AWS2]." (about 32 words). In Open gaps, cut "; Amazon's Java numbers are a CEO quote [AWS2]" (about 7 words). It is the weakest source in the section and is qualified twice.
3. **Spotify paragraph.** Replace "Spotify reports 1,500+ merged agent PRs and 60 to 90% time saved [SPOT1], then 2.5M+ automated maintenance PRs" with "Spotify reports 2.5M+ automated maintenance PRs" (saves about 13 words). The later, bigger figure is the one that matters.
4. **Green but wrong.** Cut "One talk reports checking took about 90% of agent time on a change at Maersk [AIE7]; another, an agent reporting a rebuild complete that had stopped at scaffolding [AIE9]." (about 27 words). The Spotify shortcuts already make the point with a stronger source. Drop AIE7 and AIE9 from the Open gaps talk list.
5. **Review is the bottleneck.** Cut "Spotify reached 1,000 merged PRs in 10 days, after which review became the constraint [SPOT7]." (about 15 words). It repeats the Google quote just before it.
6. **One-line recommendation.** Cut "; this is the stage where Act, then notify is most defensible today, for allow-listed mechanical classes only" (about 17 words) and end the sentence at "stay deterministic." The "Realistic ceiling today" line says the same thing eight lines later. Alternatively, keep it here and delete the ceiling line, but not both.
7. **Enterprise complications, Legacy bullet.** Cut "One talk advises capturing legacy behaviour in tests before replatforming [AIE5]." (11 words). The "Many owning teams" recommendation (backfill tests first, see II.7) already covers it. Drop AIE5 from Open gaps.
8. **Enterprise complications, Rationale bullet.** Cut the whole bullet "**Rationale months later.** One talk recommends keeping the agent's conversation with the branch [AIE15]." (15 words). It rests on one talk and is not about migrations. Drop AIE15 from Open gaps, and then also drop the now-empty "conference talks" gap line (9 words).
9. **Heterogeneous builds bullet (overlap with II.9).** Replace "; AKS upgrades go through Fleet update runs (see II.9) [MS21]" with "; for AKS clusters, see II.9". II.9 already explains Fleet update runs.

Clarity and reference edits (each adds only a few words, all covered by the cuts above):

10. **Chart 2, L3 actor.** Change `AUTO["Merges on green,<br/>owner notified"]` to `AUTO["Gate auto-merges,<br/>owner notified"]`. This makes it unambiguous that the gate, not the agent, lands the change.
11. **Chart 2, straggler loop.** Either add `OWN -. "stragglers" .-> DIA` and shorten the node to `OWN["Owner merges"]`, or drop "; stragglers go back to discovery" from the node. Right now the text describes an edge that is not drawn.
12. **Explain the class and risk gate at first use.** After the legend line under chart 2, add: "The class and risk gate is deterministic: it checks the change class against an allow-list and the risk score (see II.8)."
13. **Define the driver.** In "the human migration driver approving PRs [SPOT7]", write "the migration driver (the engineer who runs the campaign) approving PRs [SPOT7]". The chart uses "Driver" with no definition.
14. **Unexplained names.** Change "Microsoft's 1ES" to "Microsoft's One Engineering System (1ES) team" (check the note's wording). Change "raise owner action items in Service 360" to "raise owner action items in Service 360, Microsoft's internal service-health portal" (check against MS31), or simply "raise action items for owners". Change "a GA version" to "a generally available (GA) version".

## Verdict

READY AFTER EDITS. The mechanism, the rungs and the takeaway are sound and consistent with the conventions. The section only needs to lose about 160 words of stacked statistics and single-talk anecdotes (edits 1 to 9), and to tighten the L3 wording in chart 2 (edit 10).
