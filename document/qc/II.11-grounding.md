# II.11 grounding QC

Scope: every cited claim in sections/II.11.md checked against the source notes; codes checked against references.md (including the new GH3). Template headings, rung names, REQ areas, em-dashes, cross-references and Mermaid validity also checked.

Codes used and mapping: GOOG5 (GOOG-SRE-CANARY), MS3 (MS-WAF-SDP), GH3 (GH-SERVICEOWNERS), META4 (META-CONFIG-SAFETY), MS9 (MS-SRE-BUILD), MS10 (MS-SRE-GA), MS11 (MS-RCACOPILOT), AIE4 (AIE-META-ONCALL), AIE14 (AIE-ALWAYS-ON-OPS), AIE2 (AIE-UBER-SDLC), AIE11 (AIE-LINEAR-CONTEXT), MS5 (MS-GANDALF-NSDI), MS23 (MS-ENTRA-AGENT-PROTOCOLS), MS12 (MS-ENTRA-AGENTID), MS24 (MS-CA-AGENTS), AN1 (AN-TEAMS), MS20 (MS-WIN-RESILIENCY). All map to the intended source; GH3 correctly points to the SERVICEOWNERS post, whose note has the incident-commander claim.

Numbers and quotes verified exact: MS9 (35,000+ incidents handled autonomously; 89% positive RCA responses on Azure Container Apps; 3 minutes vs 40.5-hour human-only average; nine months), MS10 ("AI operations teammate", "within defined guardrails", GA March 2026, Ecolab 30 to 40 down to under 10), MS11 ("RCACopilot achieves RCA accuracy up to 0.766", one year of incidents, over four years in production, EuroSys '24), AIE4 ("Promotion applies to a particular action."), AIE14 (quote verbatim).

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Ideal process, Detect bullet | GOOG5 is canary guidance (SLIs as canary metrics, user-visible over CPU, pair relative comparison with absolute SLO checks). The text presents it as Google recommending that paging alerts fire on SLIs against SLO targets. MS3 likewise is a deployment health model ("include usage metrics to catch silent failures" during bake). Both are stretched from rollout evaluation to steady-state paging. | med | Rephrase: "Google's canary guidance favours user-visible SLIs over CPU and pairs comparisons with absolute SLO checks [GOOG5]; Azure's deployment health model adds usage metrics to catch silent failures [MS3]. **Recommendation:** apply the same rule to paging alerts." |
| What to agentify, para after the one-line recommendation | "Without a rollout cause, the agent first correlates everything that changed (config, flags, infrastructure, dependencies)" is synthesis but not labelled; the supporting quote is from a talk by Resolve AI (a vendor) and is not described as such. | med | Start the sentence with "**Recommendation:**" and attribute the quote as "as one vendor's conference talk puts it" [AIE14]. |
| How trust is earned per action | "Meta's three criteria set each ceiling [AIE4]: a single-service scale-out can reach Act, then notify; a failover ... stays at Act on approval." The examples are our synthesis, but the citation placement reads as Meta's assignments. Meta's talk also says production mitigations stay human, so the L3 scale-out example contradicts the cited source. | med | Move the citation: "Using the three criteria from Meta's talk [AIE4] (cost of a mistake, checks, track record), we would let a single-service scale-out reach ... ". Keep it inside the Recommendation. |
| Learning loop | "Linear distills review comments into agent instructions ... [AIE11]" rests only on a talk; not described as one (the adjacent Uber claim is). | low | "one Linear talk describes distilling review comments ..." |
| Ideal process, Postmortem bullet | META4 is a podcast landing page (grade C, no transcript) that only lists "blameless incident reviews" as a topic. "a practice Meta names" is acceptable but the weakness is not stated. | low | "(a topic of a Meta podcast [META4])" or drop the citation; the blameless-postmortem rule can stand as Recommendation. |
| Real-world reference, Azure SRE Agent | MS10 is grade C (GA announcement); "lets teams choose between recommended actions and automated responses" is fine, but the realistic-ceiling line leans on MS10 ("as Azure's guardrailed automated responses allow") while MS9 says "Everything occurs within governance guardrails and human approval checks". | low | Add "the GA announcement says" and note in the ceiling line that MS9 stresses human approval checks; the existing GAP already covers which actions ran unattended. |
| Real-world reference, RCACopilot | "At about three in four right, its output is advice." is our judgment, not labelled. | low | Prefix "**Recommendation:** treat its output as advice" or rephrase as "so this document treats it as Advise". |
| Enterprise complications, Runbooks as code | AN1 is anecdote (grade C); "Anthropic teams keep markdown runbooks beside CLAUDE.md" not marked as anecdotal. | low | "Anthropic reports, anecdotally, that its teams keep ..." |
| REQ-OBS-03 Source column | MS10 only says past runbooks are surfaced; it does not support runbooks versioned and reviewed as code. Harmless with "Recommendation" present. | low | Drop MS10 or keep and rely on "Recommendation". |
| Length | About 1,060 words outside tables and code (including the Open gaps list), at the top of the 700 to 1,000 range. | low | Trim one or two sentences (for example the Ecolab line or the Linear clause). |

Passed checks:
- Template headings present and in order (Purpose, Ideal deterministic process, Real-world reference, What to agentify, Enterprise complications, Requirements, Open gaps).
- Rung names exact; L4 marked "Future proposal"; the table does not exceed the stated L3 ceiling; no agent approves its own output.
- REQ areas (OBS, IDN, OWN, CTX) all on the conventions list; MUST/SHOULD set on every row.
- No em-dashes or en-dashes.
- Cross-references: service catalog points to V.1, templates D6 and D7 used, runbook template marked "(template: proposed)" and listed in Open gaps; II.9, II.1, II.7, IV.4 cross-referenced rather than re-explained.
- GH3 "(summary)" claim softened with "reportedly". MS9 figures marked self-reported. Meta and Uber talks described as talks. Ecolab labelled vendor customer story.
- GAP markers present for burn-rate alerting, unattended actions, repair-item effect, cross-team coordination.
- Both Mermaid blocks validate OK with no WARN (14.9px and 16.0px text).

## Verdict

**PASS WITH FIXES.** High 0, medium 3, low 7.
