# QC: II.9 grounding review (v2, rewritten section)

Reviewer scope: every cited claim in `sections/II.9.md` checked against the source notes (`sources/01`, `03`, `06`, `07`, `09`, `10`, `12`, `13`, `14`) and grades in `SOURCES.md`. Template headings, em-dashes, Mermaid validity and length also checked.

## Summary of checks

- **Gandalf explainer.** All mechanism claims trace to the full-paper note in `10-full-texts` (baseline, rollout attribution, classifier, KV store read by the deploy engine, incident with evidence, weight 0 for noise, last of four layers). Numbers exact: >18 months, >300 deployments/day, 92.4%/100% data plane, 94.9%/99.8% control plane, 1,200+ region-level deployments, 2 misses and 2 false alarms. The 99.2% figure is a "(summary)" item and is correctly softened with "Reportedly". Quote "Gandalf serves as the last safeguard" is verbatim. One issue with the blog quote (row 1).
- **AKS Fleet explainer.** Supported by `12-clusters` note: update runs, sequential stages, parallel groups, approval gates, maxConcurrency, failure budget default 0 (fail-fast), platform-initiated upgrades bypass sequencing, node images valid 90 days. Quote "A group can be `Completed` even if all members failed." is verbatim. Grade C correct.
- **Autonomy-rung table.** Rung names match the shared vocabulary exactly (Advise L0 to Autonomous within budget L4). Table is introduced with **Recommendation:** and a `[GAP]`, so synthesis is not presented as a company practice. MS-SRE-GA ("within defined guardrails") and AIE-META-ONCALL ("Grant autonomy action by action.", production mitigations stay human) are accurately reported. Minor points in rows 4 and 5.
- **Grades on first use.** MS-GANDALF-NSDI A, MS-GANDALF-BLOG B, MS-SDP-BLOG B, MS-SDP-LEARN C, MS-WAF-SDP C, MS-AKS-FLEET C, MS-WIN-RESILIENCY C, MS-SRE-GA C, AWS-HANDSOFF B, AWS-ROLLBACK-SAFETY B, GOOG-SRE-CANARY B, META-RELEASE-RISK A, META-DRS B, META-CONFIG-SAFETY C: all match SOURCES.md. AIE-META-ONCALL is correctly marked ungraded.
- **Other numbers and quotes.** ~24 h bake and full business day (MS-SDP-LEARN); "intentionally sacrifice velocity" (MS-SDP-BLOG); halt on end-user-impacting alert and all-green through bake (MS-WAF-SDP); 4 to 5 business days and zeta stage (AWS-HANDSOFF); Prepare/Activate and "Avoid walking through one-way doors" (AWS-ROLLBACK-SAFETY); "Some defects will reach production." (GOOG-SRE-CANARY); top 5/10/50% (META-RELEASE-RISK); 10,000+ changes, "with minimal production impact", "another large category" (META-DRS); "As AI increases developer speed..." (META-CONFIG-SAFETY); both Windows quotes (MS-WIN-RESILIENCY). All exact and correctly attributed.
- **Template.** Headings present and in the required order: Purpose, The ideal deterministic process, Real-world reference, What to agentify, and how far, Enterprise complications, Requirements, Sources used, Open gaps. Microsoft options named first in each part.
- **Mermaid.** Both blocks pass the validator (OK, OK).
- **Em-dashes.** None found.
- **Length.** About 1,030 words outside code blocks and tables, including headings and the Sources/Gaps lists, so prose is within 700 to 1,000.

## Issues

| # | Location | Issue | Severity | Fix |
|---|---|---|---|---|
| 1 | Real-world reference, Gandalf, sentence 1 | "global intelligent deployment watchdog" is set in quotation marks, but in the MS-GANDALF-BLOG note it appears only in the Summary, which the note says is paraphrase. The note's only verbatim quote is "Gandalf has become a default baseline for all release validations". | Minor | Drop the quotation marks (keep as paraphrase), or swap in the verbatim quote. |
| 2 | What to agentify, intro paragraph | "No source describes an agent in either role during a rollout" is too broad: MS-SRE-GA describes an on-call/SRE agent doing "automated mitigation under governance" (35,000+ incidents mitigated, vendor figure), and AIE-META-ONCALL's agent investigates config pushes. What is missing is an agent halting or rolling back a ring rollout, or writing rollout plans. | Minor | Narrow to: "No source describes an agent halting or rolling back a ring rollout, or writing a rollout plan [GAP: ...]." |
| 3 | What to agentify, "Never agentic: emergency acceleration ..." | "Never agentic" is our synthesis; MS-WAF-SDP supports only "defined approvers and criteria". The sentence is not labelled. | Minor | Prefix with **Recommendation:** or fold into the following Recommendation sentence. |
| 4 | Rung table, On-call/SRE agent, Act, then notify (L3) | Our L3 rung lets the agent halt, roll back to LKG or turn off a flag on its own; the only cited practitioner source (AIE-META-ONCALL) keeps production mitigations human. The text notes Meta's stance just above, but the tension is not stated, so a reader may think L3 is backed by Meta. | Minor | Add half a sentence: "This goes beyond Meta's published ladder, which keeps production mitigations human; it is our proposal for the reversible actions only." |
| 5 | Rung table, L3 "Evidence to promote" | Uses Gandalf's 92.4% to 94.9% precision as the bar. Accurate numbers, but they are a watchdog's precision, not an agent benchmark; fine as Recommendation, slightly ambiguous. | Info | Optional: "(for comparison, Gandalf's watchdog precision: 92.4% to 94.9%)". |
| 6 | What to agentify, "Gandalf-style analytics belong to that core: a policy-driven gate, not an agent." | Gandalf is ML-based (Holt-Winters baseline, Gaussian classifier trained on team feedback). Calling it part of the "deterministic" core is defensible (no agent acts, the decision is enforced by policy) but may confuse a reader. | Minor | Say "automated, policy-enforced gate (ML-based, but not an agent)". |
| 7 | Ideal process, Bake gate bullet | "Microsoft's ADO guidance defaults to about 24 hours": note says "~24 hours generally"; "defaults" slightly overstates. | Minor | "suggests about 24 hours in general". |
| 8 | Ideal process, Entry gate bullet | Entry-gate conditions are given without a citation, though the notes support them (signal registration mandatory: MS-GANDALF-BLOG; upgrade-downgrade tests: AWS-ROLLBACK-SAFETY). | Minor | Add `[MS-GANDALF-BLOG]` and `[AWS-ROLLBACK-SAFETY]`. |
| 9 | Enterprise complications, mixed-version bullet | "but team 1 cannot see team 2's servers" is our inference, sitting between two AWS citations. | Info | Acceptable as framing; optionally rephrase as "in practice, team 1 often cannot see ...". |

## Counts

- Critical: 0
- Major: 0
- Minor: 7
- Info: 2

## Verdict

**PASS WITH FIXES.** No unsupported numbers, misattributed sources or unsoftened summary items. The Gandalf and AKS Fleet explainers are well grounded and the autonomy table is properly labelled as Recommendation. The fixes are small: one quote that is really paraphrase (row 1), an over-broad gap statement (row 2), and two unlabelled or under-flagged synthesis points (rows 3 and 4).
