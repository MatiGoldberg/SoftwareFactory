# QC: II.2 grounding review

Reviewer scope: every cited claim in `sections/II.2.md` checked against the source notes, using the code-to-ID map in `references.md`. Codes checked: MS13 (MS-SPEC), AN5 (AN-BESTPRACTICES), AN3 (AN-HARNESS-2), MS14 (MS-IT-ADO), GH2 (GH-AGENTIC), SPOT1 (SPOTIFY-HONK-1), AIE2 (AIE-UBER-SDLC), AIE11 (AIE-LINEAR-CONTEXT), OAI1 (OAI-HARNESS), SPOT5 (SPOTIFY-HONK-4), MS28 (MS-IT-COMPLIANT-ENG), MS15 (MS-IT-AINATIVE). Notes read: `sources/04`, `05`, `06`, `07`, `08`, `13`, `14`. The section was not edited.

## Summary of checks

- **Code mapping.** All 12 codes exist in references.md and point to the source the text describes. No invented codes.
- **Claims and numbers.** Spec Kit mechanics (/specify with no technical decisions, /plan, /tasks, constitution.md, Markdown specs reviewed by humans or agent, living spec versus waterfall PRDs, "experiment") match MS-SPEC. Interview to SPEC.md to fresh session matches AN-BESTPRACTICES. Planner expanding a 1 to 4 sentence prompt and staying high-level so spec errors do not cascade matches AN-HARNESS-2. MS14, GH2, SPOT1, OAI1, MS28 claims match. Uber context graph (design docs, Jira, incidents) and ">20 PII types redacted" match AIE-UBER-SDLC. Linear triage agent flagging open product decisions matches AIE-LINEAR-CONTEXT. The only number in the text (more than 20 PII types) is exact.
- **Quotes.** SPOT5 quote "was left to make assumptions about how to map from one dataset field to another that were often incorrect" is verbatim. One phrase set in quotes ("what and why") comes from a note Summary (row 10).
- **"(summary)" items.** None of the notes cited carry a "(summary)" marker for the claims used. Nothing to soften.
- **Weak sources.** Grade C: MS13, GH2, MS14, MS15, AN5. Talk: AIE2, AIE11. AN5 ("documented practice, not a measured one"), MS14 ("on the claim that") and AIE2/AIE11 in the context paragraph ("both are conference talks") are handled. Gaps in rows 3, 4, 5.
- **Synthesis labelling.** The rung table is covered by "[GAP: ... all the rungs above are synthesis]" and a **Recommendation:** line; the living-spec bullet has a **Recommendation:**. Several normative sentences outside those are unlabelled (rows 6, 7, 8, 9).
- **Template.** Headings present and in order: Purpose, The ideal deterministic process, Real-world reference, What to agentify, and how far, Enterprise complications, Requirements, Open gaps. Ends with `### Open gaps`. Title matches 00-skeleton. Microsoft/GitHub (Spec Kit) named first.
- **Rung names.** Advise (L0), Prepare (L1), Act on approval (L2), Act, then notify (L3), Autonomous within budget (L4): exact.
- **Requirement IDs.** REQ-PRD is not an allowed area (row 1).
- **Em-dashes.** None (no em or en dashes found).
- **Mermaid.** Both blocks pass the validator (OK, text 15.3px and 15.1px, no WARN). Legend present under the agent chart.
- **Length.** About 960 words of prose outside code and tables, within 700 to 1,000.

## Issues

| # | Location | Issue | Severity | Fix |
|---|---|---|---|---|
| 1 | Requirements table, REQ-PRD-01, -02, -03 | `PRD` is not one of the allowed requirement areas in 01-conventions (CTX, VER, REV, MRG, DEP, OBS, IDN, REPO, API, PIPE, OWN, CFG, SEC, GOV, COST). | med | Renumber to an allowed area, for example REQ-CTX-02 (template and required fields), REQ-GOV-02 (ready-for-spec gate), REQ-VER-01 (open questions explicit, no assumption), or ask the owner to add PRD to the area list. |
| 2 | Real-world reference, Spec Kit, sentence 5 | "Microsoft presents it as an experiment, with benefits asserted, not measured [MS13]." "Presented as an experiment" is Microsoft's framing; "benefits asserted, not measured" is the note author's caveat (Relevance line). The sentence attributes our assessment to Microsoft. | med | "Microsoft presents it as an experiment [MS13]; the post asserts benefits but measures none." |
| 3 | Real-world reference, "Other references", GH2 sentence | GH2 is grade C and the note calls it "Product-led (vendor marketing)" with "vendor claim, no independent evidence". The text states it plainly. | med | "GitHub's product guide (vendor marketing) puts issues with acceptance criteria and human plan approval at the front of its loop [GH2]." |
| 4 | Enterprise complications, compliance bullet, Uber PII sentence | Rests only on a talk (AIE2). "reportedly" softens it, but the source type is not named, and the earlier "both are conference talks" sits in a different section. | low | "one conference talk reports that Uber's gateway redacts more than 20 PII types before model calls [AIE2]." |
| 5 | Real-world reference, Spec Kit paragraph | MS13 is grade C and the whole explainer leans on it; there is no in-words signal that it is a single blog post with an illustrative scenario only. | low | Add "a single Microsoft blog post with an illustrative scenario" to the experiment sentence (can merge with row 2). |
| 6 | What to agentify, paragraph 2, sentence 1 | "The agent's value is in the questions, so it should read the context layer first." Normative synthesis, not labelled, and placed right before company examples so it can read as their practice. | med | Prefix with **Recommendation:** or move to after the examples as "Recommendation: the agent reads the context layer before asking." |
| 7 | What to agentify, paragraph 2, last sentence | "A grilling agent should end with a list of open questions, never with silent assumptions." Synthesis drawn from SPOT5's failure mode; unlabelled. | med | Start with **Recommendation:**. |
| 8 | Enterprise complications, "Who answers the grilling questions" bullet | Entire bullet is our design (routing, record as sign-off, block the gate) with no citation and no label; it reads as established practice. | med | Prefix with **Recommendation:**; optionally add [GAP: no source describes routing requirement questions to dependency owners]. |
| 9 | Enterprise complications, compliance bullet, sentence 1 | "Data classification in the PRD triggers the review, in the same way that catalog metadata triggers compliance scans at Microsoft Digital [MS28]." The first half is our design; MS28 supports only the analogy (catalog metadata triggering scans, not privacy review of PRDs). | low | "Recommendation: let data classification in the PRD trigger the review, as catalog metadata triggers compliance scans at Microsoft Digital [MS28]." |
| 10 | Real-world reference, Spec Kit, sentence 2 | "what and why" is in quotation marks but appears only in the MS-SPEC note Summary, which the note declares paraphrase; it is not among the verbatim quotes. | low | Drop the quotation marks or use a verbatim note quote. |
| 11 | Real-world reference, Spec Kit, sentence 1 | "Microsoft and GitHub's open-source toolkit": the note calls it GitHub Spec Kit, described on a Microsoft for Developers blog. Ownership by both is slightly overstated. | low | "GitHub's open-source toolkit for spec-driven development, described on Microsoft's developer blog [MS13]." |
| 12 | Real-world reference, Anthropic, sentence 1 | "interviews the requester with structured questions": "structured" is not in the AN5 note (it says only "Interview the requester (AskUserQuestion)"). | low | "interviews the requester (using the AskUserQuestion tool)". |
| 13 | Purpose, last sentence | "Agents make this worse, because they fill gaps with plausible assumptions instead of asking." A general factual claim with no citation; SPOT5 supports it later. | low | Add [SPOT5] or soften to "Agents can make this worse ... (see the Spotify example below)." |
| 14 | Ideal process, Completeness check required fields | The field list is our design, uncited and unlabelled. Acceptable for an ideal-process section, but the thin evidence base makes it worth flagging. | low | Optional: "Required fields (our template; see REQ-...)". |

Counts: high 0, med 6, low 8.

## Verdict

**PASS WITH FIXES.** No misattributed numbers, no wrong codes, and the quote is verbatim. The fixes are the invalid REQ-PRD area code, one caveat attributed to Microsoft, an unlabelled vendor-marketing source (GH2), and four unlabelled synthesis sentences in a section whose evidence is practice-only.
