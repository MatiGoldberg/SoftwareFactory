# QC grounding review: II.4 High-level design, API contracts, threat model

Reviewed against 01-conventions.md, references.md and source notes 02, 03, 05, 07, 09, 12, 13, 14. All 13 cited codes map to the correct source IDs. Every quote checked is verbatim (MS25, AWS3, MS19, GOOG7, AN3, MABL1, AIE10). Numbers match the notes (47 change types, three years, 90 days, 79 repos, two previews). The MS26 "(summary)" item (status/error codes, pagination) is softened with "reportedly". Template headings are present and in order, rung names are exact, REQ areas (API, OWN, SEC, REV) are valid, there are no em-dashes, V.1 is used for the catalog, and both Mermaid blocks validate OK with no WARN (block 1 at 12.7px text).

| Location | Issue | Severity | Fix |
|---|---|---|---|
| Requirements table: REQ-OWN-02, REQ-SEC-02, REQ-REV-01, REQ-API-01 | These IDs are already used for different requirements in II.1 (OWN-02, SEC-02), II.3 (API-01, OWN-02), II.5 and II.6 (REV-01). Requirement IDs collide across the document. | high | Renumber to free IDs in each area (for example REQ-API-05.., REQ-OWN-0x, REQ-SEC-0x, REQ-REV-0x), or agree on a per-section numbering block with the editor. |
| Real-world reference, para 3; Gates, "Versioning rules" | MS19 (SFI, Learn overview) and MS26 (API guidelines) are grade C, but the text does not say so. "SFI names agents directly" and "Azure's guidelines say" read as strong evidence. | med | Add words such as "Microsoft's published guidance (SFI overview)" or "design guidance, not a measured practice" for MS19 and MS26. |
| Enterprise complications, "Semantic changes" | "Azure treats it as a behavior change needing a new version [MS25]" applies MS25's general rule to a unit change. MS25 does not discuss unit changes. | med | Reword: "Under Azure's rule that any behavior change needs a new version [MS25], a unit change would need one." |
| Requirements, REQ-SEC-02 Source column | MS28 is cited, but the note only shows catalog metadata triggering scans, not threat models or security review. The support is weak. | low | Drop MS28, or tag the row "Recommendation" alongside MS19 and GOOG7. |
| Gates, "Security review" and "Design approved" bullets | Uncited trigger rules (new endpoint, caller, data class, trust boundary) and the checklist gate are stated as process. A GAP covers this later, but the bullets are not labelled as synthesis. | low | Prefix with "Recommendation:" or point to the [GAP] in Real-world reference. |
| Enterprise complications, "Consumer-driven contracts" | "Azure's diff and AWS's two-phase tests check from the provider side only" is the reviewer's own characterization, without a label. | low | Prefix "In our reading," or fold it into the GAP. |
| Real-world reference | The section has three paragraphs and covers four systems (Azure, AWS, SFI, BeyondProd), against "3 to 5 sentences, one or two systems". | low | Keep Azure and AWS in this subsection, and move the SFI/BeyondProd lines into the Security review gate bullet or the requirements rationale. |
| Whole section | Prose is about 1,076 words, against a 700 to 1,000 target. This is within +20% of 1,000 but over the stage norm. | low | Trim about 80 words, for example by merging the "Versioning rules" bullet with the Azure reference paragraph, which repeat the GA and preview rules. |
| Cross-references, D-items | The agent rungs and guardrails do not reference D6 (agent action policy), and the "Design approved" checklist does not reference D8 (readiness checklist). Only the proposed D9 is cited. | low | Add "(template: D6)" under the agent table and consider "(template: D8)" for the gate checklist. |
| Open gaps, last bullet | "AIE10 is a conference talk with no grade" conflicts with references.md, which grades it "talk". | low | Reword: "AIE10 is a single conference talk." |

## Verdict

**PASS WITH FIXES.** Grounding is accurate: no misquotes, wrong numbers or mis-mapped codes. The fixes needed are the document-wide REQ-ID collisions and the missing weak-source wording for MS19 and MS26.

Counts: high 1, med 2, low 7.
