# QC grounding review: Part 0 (sections/0.md)

Reviewer scope: 01-conventions.md, references.md, sections/0.md, the source notes for every code cited (MS2, MS4, MS5, MS6, MS8, MS9, MS10, MS12, MS13, MS22, MS23, MS25, MS28, GOOG2, GOOG6, META2, META3, SPOT1, SPOT2, SPOT5, SPOT8, STRIPE1, AIE4, AIE6, AN3, OAI1, AWS1, AWS3, UBER1, SHOP1, MABL1), and sections I, II.1 to II.12, III, IV, V.1, VI for the summary checks. Local files only.

## What passes

- **Codes map correctly.** Every code in 0.md resolves in references.md to the note that holds the claim (MS2 = MS-SDP-BLOG, MS5 = MS-GANDALF-NSDI, MS8 = MS-CCA-DOTNET, MS9 = MS-SRE-BUILD, MS10 = MS-SRE-GA, MS28 = MS-IT-COMPLIANT-ENG, SPOT2 = SPOTIFY-CONSTRAINT, SPOT5 = SPOTIFY-HONK-4, SPOT8 = SPOTIFY-BACKSTAGE-CATALOG, META3 = META-RELEASE-RISK, AIE6 = AIE-DUOLINGO-TESTS, and so on). No invented codes.
- **Quotes are verbatim:** "76% more PRs to review", "intentionally sacrifice velocity", "AI operations teammate", "within defined guardrails", "with minimal production impact", "Grant autonomy action by action.", "reliably skew positive", "a map, not a 1,000-page instruction manual", "blocks problematic PRs but explicitly cannot approve them".
- **Numbers match** the notes: 535 of 878, 41.7% to about 71%, over 90% and 600K a month, 35,000+, 900+ services and 3,800 repos, 80% and about 50%, 10,000+, top 5% and top 50%, 2.5M+, about 1,800, 1,300+, 75%, 65%, 51%, 700+, 11% to 72%, March 2026 (MS10 dated 2026-03-10). The one exception is the Gandalf period (row 3).
- **Weak sources are flagged in words:** AIE4 and AIE6 as "one conference talk", SHOP1 as "in an interview", MABL1 as "vendor-reported", MS9 as "self-reports", MS13 as "an experiment, with no measurements".
- **Five requirements** all exist and point to the right sections (II.9; II.3, II.5, II.7; II.6, V.1; III.2 with D6 and D7; III.3, IV.4). VI.4, I.2 and III.1 cross-references resolve.
- **Roadmap:** Steps 0, 1 and 2 match III.4 (Step 0 at Prepare; Step 1 at Act on approval with owner approval; Step 2 blocking only in proven categories). Step 1 as "the pilot" matches VI.2. "Nine steps" matches. The Open gaps note on Steps 4 and 8 matches I.2 (intake, requirements and specification are thin).
- **Overlay ceilings:** no box goes past a stated ceiling. II.5, II.7 and II.10 show Act on approval, and II.11 and II.12 show Act, then notify* with the classes their ceilings name. II.1, II.4, II.6, II.8 and II.9 reach L3 only for the narrow classes in their tables, and II.2 and II.3 show L2, the rung III.4 uses. L4 is described as future everywhere.
- **AKS Fleet** is not mentioned in Part 0, so it is not presented as an app-rollout mechanism.
- **Rung names, PR rule, blocking rule:** the plain rung names are used throughout. Test PRs that an owner approves are Act on approval, and Step 0 is Prepare. A block through policy sits at Act, then notify and is never an approval. "At Act, then notify a change lands because the deterministic gates pass" is stated.
- **No em-dashes or en-dashes.** Both Mermaid blocks pass the validator with no WARN (14.1 to 15.1px text, at most 698px tall).

## Issues

| Location | Issue | Severity | Fix |
|---|---|---|---|
| 0.1, requirement 3 | "a human owner from the service catalog approves" is absolute. III.3 (REQ-GOV-09), II.6 (the low-risk class approved by the risk gate) and II.5 and II.12 (allow-listed classes that merge at Act, then notify) all make an exception for mechanical classes, so the summary contradicts the sections it points to. | med | Add: "except allow-listed mechanical classes promoted to Act, then notify, where the deterministic gates decide (see II.6, II.12)". |
| 0.1, thesis, five requirements, "What done looks like" | This is the document's own synthesis ("A software factory is therefore mostly...", the five requirements, the done criteria), but it has no **Recommendation:** label and is not in a requirements table, as 01-conventions requires. | med | Open the paragraph after the two citations with "**Recommendation:**", and put "**Recommendation:**" (or "Our synthesis:") before the requirements list and the done paragraph. |
| 0.5, Gandalf | "over 18 months it reached 92.4% precision and 100% recall on the data plane [MS5]". The note gives >18 months in production, but the full-text note links the data-plane figures to "155 critical failures captured in 8 months", so the period is not clearly 18 months. | med | Change to "in production for over 18 months, it reports 92.4% precision and 100% recall on the data plane [MS5]". |
| 0.5, Gandalf | "writes go or no-go for the deploy engine [MS4]". The MS4 note gives go/no-go decisions; the detail that the deploy engine reads the decision (a key-value store) is in the MS5 full-text note. | low | Cite [MS4, MS5]. |
| 0.5, Backstage | "its lineage found the consumers of about 1,800 pipelines". Per SPOT5, Backstage endpoint lineage together with Codesearch found about 1,800 downstream pipelines, and those pipelines are the consumers. The current wording misstates what was counted. | low | Change to "its endpoint lineage, with code search, found about 1,800 downstream consumer pipelines before a migration [SPOT5]". |
| 0.5, Spotify | The 2.5M+ figure sits in the Honk sentence, but SPOT2 counts all automated maintenance PRs (Fleet Management), not only Honk's. | low | Change to "across its fleet tooling, Spotify reports 2.5M+ automated maintenance PRs merged, mostly auto-merged [SPOT2]". |
| 0.5, AI code review | "proposes fixes the author must apply" can be read as an obligation. The note says fixes are never auto-committed and the author must explicitly choose to apply them. | low | Change to "proposes fixes that land only if the author clicks to apply them [MS6]". |
| 0.1, Step 1 | "agents open test-only PRs". III.4 Step 1 is "Toil and test backfill" and also includes flaky-triage and flag-cleanup agents, whose PRs are not test-only. | low | Change to "Step 1, toil and test backfill: the pilot; test-backfill (test-only PRs), flaky-triage and flag-cleanup agents open PRs that an owner approves (Act on approval)". |
| 0.4, overlay II.5 box | The box shows "Act on approval" with no asterisk, but the prose under the chart lists II.5 allow-listed classes at Act, then notify. | low | Add the asterisk or a third line, for example "Act on approval<br/>L3* maintenance only", or drop II.5 from the L3 list in the prose. |
| 0.4, "How to read it" | The list of L3 classes leaves out II.6's opt-in low-risk class, which the deterministic risk gate approves (our proposal) and which III.1 mentions. It also does not say that the L3 rows in II.2 and II.3 are proposals. | low | Add "an opt-in low-risk review class approved by the deterministic risk gate (II.6, our proposal); the L3 rows in II.2 and II.3 are proposals". |
| 0.5, Azure SRE Agent | The description rests on MS10 (grade C, a product announcement) without saying so. | low | Change to "Microsoft's GA announcement calls it an 'AI operations teammate'...". |
| II.9 table (cross-section, not 0.md) | II.9 lists an Autonomous within budget row (fix-forward) with guardrails and promotion evidence, but does not mark it as a future proposal. Part 0 and III.1 say L4 is future everywhere. | low | In II.9, mark the L4 row "Future proposal only". Part 0 needs no change. |
| 0.2, Appendices row | It lists "A glossary" and "C open questions", but sections/ has no Appendix A or C file. | low | Confirm they are produced at assembly, or change the row. |

**Counts:** high 0, med 3, low 10 (13 issues).

## Verdict

**PASS WITH FIXES.** Grounding is sound: codes map correctly, quotes are verbatim, nearly all numbers are exact, weak sources are flagged, and the summary is faithful to III.4 and the Part II ceilings. Fix the three med items: the absolute approval wording in requirement 3, the missing Recommendation: labels on the synthesis in 0.1, and the Gandalf period.
