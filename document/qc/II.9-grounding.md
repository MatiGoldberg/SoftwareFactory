# QC grounding review: II.9 Safe gradual deployment

Reviewer: QC agent, 2026-11-15. Scope: every cited claim in `sections/II.9.md` checked against the source notes (`sources/01`, `03`, `06`, `07`, `09`, `10`, `12`, `13`, `14`) and grades in `SOURCES.md`; conventions from `01-conventions.md`.

## Summary of checks

- Numbers: all checked numbers match the notes exactly (Gandalf 92.4/100, 94.9/99.8, 155 in 8 months, 1,200+ deployments with 2 misses and 2 false alarms, >300 deployments/day, ~45% and >70%, Holt-Winters 30 days, 1 h steps, >4σ, 1/24/72 h windows, weights 0 to 100, ±1 h, 30 days, 5 min; AWS ≤10%, ≥1 h, ≥12 h, 2 to 4 h, 4 to 5 business days; Fleet defaults 50/1/0, 90 days, 60 days; Meta 5/10/50%, 18.7/27.9/84.6%, 26.2/42.3/88.5%, 10,000+).
- Quotes: all verbatim substrings of the notes (one capitalisation change, see below).
- "(summary)" item (Gandalf 99.2%) is correctly softened with "reportedly".
- Grades: first-use grades match SOURCES.md for all 15 graded IDs; AIE-META-ONCALL correctly marked ungraded (SOURCES.md gives "Detail: high", not a grade).
- Heading order: matches the nine required headings in order. No em-dashes found (0). Requirements table has ID, MUST/SHOULD, statement, rationale, source. Ends with `### Sources used` and `### Open gaps`. Diagram D3 matches the skeleton's planned D3.

## Findings

| Location | Issue | Severity | Suggested fix |
|---|---|---|---|
| "Azure's answer at its own scale is one central policy and the same tooling everywhere [MS-SDP-LEARN]" | Misattribution and stretch. MS-SDP-LEARN is generic Azure DevOps guidance, not a description of Azure's own practice; its "same tooling" means the same tooling in dev, test and prod, not across heterogeneous pipelines. "Central policy" comes from MS-SDP-BLOG. | med | "Azure SDP sets rollout policy centrally [MS-SDP-BLOG], and Microsoft's ADO guidance asks for the same deployment tooling in dev, test and prod [MS-SDP-LEARN]." |
| "Windows restated SDP's \"gradual and staged deployment of updates\" ... for content updates [MS-WIN-RESILIENCY, C]" | "for content updates" is drawn from the note's Relevance line (our synthesis). The source quote speaks of "updates sent to customers". Synthesis presented as Microsoft's statement. | med | Drop "for content updates", or say "for updates sent to customers" (the quote's wording), and keep the content/config inference as our reading. |
| "REQ-DEP-05 ... sets the gate level for a rollout (for example, extra approval or longer bake...)" with Source "META-RELEASE-RISK, META-DRS" | The Source column implies published support, but the section's own GAP says no source uses a risk score to set ring speed or bake time. Meta uses it for freezes, review and test selection. | med | Change Source to "Recommendation; META-RELEASE-RISK, META-DRS (freeze gating only)", as done for REQ-PIPE-02. |
| "Meta's on-call agent work states the rule as \"Grant autonomy action by action.\"" (Agentification path) | Microsoft-first rule: Meta (AIE-META-ONCALL) is named before Azure SRE Agent [MS-SRE-GA], which the notes contain. | med | Swap the two sentences: Azure SRE Agent's recommended-actions/automated-responses tiers first, then Meta's per-action rule. |
| "\| Action \| L0 Suggest \| L1 Draft \| L2 Sandbox \| L3 Gated auto \| L4 Production within budget \|" | Vocabulary must be used exactly: "L2 Act in sandbox" and "L4 Production action within a budget". | med | Rename the two column headers to the exact vocabulary. |
| "Gandalf is Azure's global deployment watchdog [MS-GANDALF-NSDI, A]" | "global ... deployment watchdog" is the MS-GANDALF-BLOG wording, not the NSDI note's. Also the NSDI grade is repeated (first given in Metrics). | low | Cite [MS-GANDALF-BLOG] for the phrase, or keep NSDI and drop the repeated ", A". |
| "AWS's rule is to \"avoid walking through one-way doors\"" | Quote sits in the note's Summary (capitalised "Avoid"), not under Notable quotes; capitalisation changed. | low | Reproduce as "Avoid walking through one-way doors" or paraphrase without quote marks. |
| "Most failed rollbacks come from protocol or serialization changes the old version cannot read" | Note says "protocol changes (serialization, timing) the old version can't handle"; timing dropped, "read" narrows it. | low | "Most failed rollbacks come from protocol changes (serialization, timing) the old version cannot handle." |
| "Microsoft's release flow ships code dark behind flags and deploys in rings [MS-HOW-MSFT-DEVOPS, B]" | "ships code dark" is MS-SDP-LEARN wording; MS-HOW-MSFT-DEVOPS note says short-lived branches plus feature flags, deployment in rings. | low | "...uses short-lived branches with feature flags and deploys in rings [MS-HOW-MSFT-DEVOPS, B]", or add [MS-SDP-LEARN] for "dark". |
| "Emergency acceleration \| Never above L1: named human approvers [MS-WAF-SDP]" | WAF note says "defined approvers and criteria"; "named human" is ours (also in REQ-DEP-06, which is fine as a requirement). | low | "defined approvers and criteria [MS-WAF-SDP]"; keep "named" only in the requirement. |
| "AWS reaches the same goal with simpler means" | "simpler" is our judgment, unsupported by notes. | low | "AWS uses alarm-driven automatic rollback..." without the comparison, or mark as our view. |
| "a false halt costs hours, a false go costs customers" | Unsourced heuristic stated as fact. | low | Prefix with **Recommendation:** or soften ("in our view"). |
| "REQ-PIPE-03 ... Source: MS-AKS-FLEET, MS-GANDALF-NSDI" | Text frames this as a Recommendation (record platform events in the same schema), but Source column does not say so. | low | "Recommendation; MS-AKS-FLEET, MS-GANDALF-NSDI". |
| "REQ-DEP-01 ... Developers and agents cannot shorten bake." | Conflicts with REQ-DEP-06 and the sources' emergency path (WAF, SDP blog allow accelerated bake under defined conditions). | low | Add "except through the emergency path in REQ-DEP-06". |
| "never treats an AKS Fleet run or group status of `Completed`" (REQ-PIPE-01) | Note's quote is about a group; "run" is an extension. | low | Acceptable as a requirement; optionally say "group (and, by extension, run)". |
| "**Risk-based gating.** Meta scores each diff..." | Microsoft-first: no Microsoft option, but the gap is stated only in the mapping table, not in this subsection. | low | Open the subsection with "[GAP: no Microsoft risk-scoring source in the notes.]". |

Counts: high 0, med 5, low 11.

## Verdict

**PASS WITH FIXES.** Grounding is strong: every number and quote checked matches the notes, the "(summary)" item is softened, and grades are correct. Fix the five medium items (one misattribution to MS-SDP-LEARN, one synthesis attributed to the Windows post, one requirement source that contradicts the section's own gap, Microsoft-first order in the agentification path, and the L2/L4 vocabulary) before assembly.

### QC fixes applied

- Med: heterogeneous-pipelines sentence now cites MS-SDP-BLOG for central policy and MS-SDP-LEARN only for same tooling in dev, test and prod.
- Med: Windows quote now uses "updates sent to customers"; the content/config reading is marked as ours.
- Med: REQ-DEP-05 source now "Recommendation; META-RELEASE-RISK, META-DRS (freeze gating only)".
- Med: Agentification path now names Azure SRE Agent before Meta.
- Med: table headers renamed to "L2 Act in sandbox" and "L4 Production action within a budget".
- Low (all applied): "global intelligent deployment watchdog" cited to MS-GANDALF-BLOG; "Avoid walking..." capitalised as in note; "protocol changes (serialization, timing) ... cannot handle"; release flow reworded to short-lived branches with feature flags; emergency row says "defined approvers and criteria"; "simpler means" removed; false-halt heuristic marked Recommendation; REQ-PIPE-03 source marked Recommendation; REQ-DEP-01 adds emergency-path exception; REQ-PIPE-01 says "group (and, by extension, run)"; risk-gating subsection opens with a Microsoft GAP.
- Prose tightened from about 1,720 to about 1,660 words (excluding tables, diagram, sources and gaps).
