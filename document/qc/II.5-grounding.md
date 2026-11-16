# II.5 grounding QC

Reviewed against 01-conventions.md, references.md and the source notes (02, 03, 04, 05, 06, 07, 08, 12, 13, 14). Codes checked: OAI1, OAI2, AN2, AN3, AN4, AN5, STRIPE1, MS8, MS12, MS22, GH1, GH2, SPOT2, SPOT4, SPOT5, MABL1, AIE1, AIE8, AIE9, AIE13. Every code maps to the right source ID. All numbers checked match the notes exactly (878/535, 67.9% vs 87.1%, 41.7% to ~71%, 80.0%/64.0%, 3/535 vs 33/4,251, 1,300+/week, ~10 s, <5 s, 3M+ tests, 400 to 500 tools, ~25% veto, 79 repos, 25 engineers, $9/20 min and $200/6 h, 50 to 60% coverage, ~10 repos). Quotes are verbatim ("a map, not a 1,000-page instruction manual", "are deterministic and guarantee the action happens", "since Claude won't be biased toward code it just wrote", "CCA cannot open PRs on its own", the AIE13 passing-test quote).

Structure: all seven template headings present and in order. Rung names exact. REQ areas (CTX, PIPE, VER, COST, REV, GOV, IDN, REPO) all on the conventions list. No em-dashes or en-dashes. Both Mermaid blocks validate OK with no WARN (text 16.0px and 15.7px). V.1, D3, IV.1, IV.4, II.3, II.6, II.7, II.8 cross-references used correctly; the blueprint template is proposed under Open gaps rather than numbered.

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Ideal process, Gates, "PR with evidence" bullet; REQ-REV-01 | The AIE13 quote rests only on a conference talk (Neo4j) but is presented without saying so (rule e). | med | Write "One conference talk (Neo4j) puts it this way: ..." in the gate bullet. |
| What to agentify, "inner loop" paragraph | "an LLM judge that vetoes about 25% of sessions for scope creep" [SPOT4]: the note gives the 25% veto rate and says the judge catches scope creep, but not that all vetoes are for scope creep, and adds that judge accuracy is not yet evaluated. | low | "an LLM judge, aimed at scope creep, that vetoes about 25% of sessions (its accuracy is not yet evaluated)". |
| What to agentify, "inner loop" paragraph | GH1 (grade C, self-reported blog) is the only source for the human-only contract-test area; not labelled as weak. | low | "GitHub's Applied Science team reports keeping ...". |
| REQ-PIPE-03 | "network egress limited to an allow-list" is not in STRIPE1, SPOT4 or GH2 (Stripe: isolated from the internet; Spotify: virtually no access). Synthesis inside a source-cited row. | low | Add "Recommendation for egress allow-list" to the Source column, as REQ-COST-01 does. |
| Real-world reference, Minions | "a small curated subset of 400 to 500 tools" reads as if the subset is 400 to 500 tools; the note has 400 to 500 tools in total with a small subset per agent. | low | "a small curated subset of its 400 to 500 tools". |
| Enterprise complications, cost bullet | "$9 in 20 minutes to $200 in 6 hours" [AN3] omits that the $9 solo run left the core feature broken, so it is not a like-for-like cost range. | low | Add "(the cheap solo run left the core feature broken)". |
| Real-world reference, CCA description [GH2, MS8] | The cloud-sandbox and repo-instructions description comes from GH2 (grade C, product marketing); MS8 does not describe the sandbox. | low | Keep the citation but note it is GitHub's product description, or cite GH2 alone for that sentence. |
| Rung table; REQ-GOV-02 | Relevant kit items not referenced: D6 (agent action policy) for the rung table, D7 (trust-ledger record and promotion review) for REQ-GOV-02. | low | Add "(template: D6)" under the rung table and "(template: D7)" in REQ-GOV-02. |
| Whole section | Prose is about 1,050 words including headings and bullets, at or slightly over the 700 to 1,000 target. Real-world reference runs past 3 to 5 sentences with the numbers list. | low | Trim a sentence or two, for example the Entra blueprint aside or the doubled CCA description. |

Not issues: "Reportedly" correctly softens the (summary) instructions/environment claim from MS8; mabl is labelled vendor-reported; AIE1, AIE8 and AIE9 are described as talks; Act, then notify for feature code is flagged as [GAP] and synthesis; the "realistic ceiling" line is labelled Recommendation.

## Verdict

**PASS WITH FIXES** (high 0, med 1, low 8).
