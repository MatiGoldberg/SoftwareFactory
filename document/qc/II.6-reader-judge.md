# II.6 reader judge (Code review: AI first pass, human ownership)

Reader: a busy Microsoft engineering leader who knows engineering basics but not mabl, uReview, Meta's Diff Risk Score or Google's large-scale-change process. Bar: approved II.9 and II.2.

Prose length: about 1,005 words excluding tables and diagrams (headings and bullets included), so at the top of the 700 to 1,000 target. Validator: both blocks OK (block 1: 511x543, text 16px; block 2: 456x663, text 16px).

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity: deterministic core and rungs | 3 | The deterministic core is stated cleanly and the one-line recommendation names the L3 exception, but the "Block, but not approve." heading and the mabl quote sit right before an L3 row that approves, the blocking check is folded into the L2 row although blocking is not "act on approval", and the L4 row's guardrail ("for everything else") is unclear. |
| 2 | Reading flow | 4 | Purpose to deterministic chart to the two named systems to the agent chart reads well; the three bold paragraphs after chart 2 come in an odd order (block policy before evidence before human-review rule), and the "Recommendation" on the requester-as-author rule lands only in the third of them. |
| 3 | References explained before use | 3 | Microsoft AI code review and uReview are explained well; "release flow", mabl, Meta's "per-diff risk score", Spotify's "migration drivers" (Honk is never named), Google's "shards" and "global approvers", and AIE12/AIE13 talks are used without a plain gloss. |
| 4 | Detail and length | 3 | At the upper limit; several sentences add little (60,000 tests, Atlassian quote, Spotify CI validation, the AIE12 quote, the dotnet/runtime sentence); "No source has an AI reviewer approve" appears three times; missing a sentence on prompt injection through PR content into the AI reviewer and on what happens when the reviewer is down. |
| 5 | Message | 4 | "AI gives every PR a first pass and may block; humans own approval, except a narrow, proven low-risk class" lands, but the heading "Block, but not approve" partly fights it. |
| 6 | Diagrams | 4 | Both readable at column width, well sized, orange agent nodes plus legend, consistent with II.9/II.2. Chart 2 routes "findings or block" into "Route by risk class", so a block appears to continue to approval rather than stop at the policy gate; the evidence agent from the table is folded into the author agent node without saying so. |

## Concrete edits

1. **Resolve the "never approves" vs L3 tension (owner's known concern).** Heading "**Block, but not approve.**" -> "**Block early, approve last.**" and after the mabl quote add: "We keep that rule everywhere except the opt-in L3 class below." Also in REQ-REV-03 replace "it cannot approve except under REQ-REV-06" with "it approves only under REQ-REV-06", so the exception reads as one rule, not a contradiction repeated in three places.
2. **Give the block its own rung.** The L2 row mixes "Commits the fix after one author click" with "may post a blocking check for high-precision categories". A block is automatic, not approval-gated. Move the block to the L3 row's position logic, or add a sentence under the table: "Posting a blocking check is an Act, then notify (L3) action of the reviewer itself; it is safe early because the owner can dismiss it." Then the L2 row keeps only the fix commit, and its guardrail keeps "Commit attributed [MS6]".
3. **Fix chart 2's block path.** `AIR -- "findings or block" --> RT` makes a block flow on to approval. Change to `AIR -- "findings" --> RT` and add `AIR -. "block" .-> MQ` (or label the policy-gate node `"Policy gate: checks,<br/>blocks, approval"`), so the reader sees a block stops at the deterministic gate. Optional: rename the author node `"Author + evidence<br/>agents: PR, brief"` so the table's Evidence agent appears in the chart.
4. **Gloss unexplained references on first use.**
   - "This is Microsoft's release flow" -> "This is Microsoft's release flow (its trunk-based branching and PR model in Azure DevOps)".
   - "mabl encodes" -> "mabl, a test-automation vendor, encodes ... (vendor-reported)" (the vendor label currently first appears only later).
   - "Meta uses its per-diff risk score for reviewer selection [META2]" -> "Meta uses its Diff Risk Score, a model that predicts how likely a diff is to cause an incident (see II.8), for reviewer selection [META2]".
   - "Spotify lets migration drivers approve their own PRs [SPOT7]" -> "Spotify lets the engineer driving a fleet-wide migration with its Honk agent approve those PRs [SPOT7]".
   - "global approvers" -> "a small group of global approvers for mechanical patterns".
5. **Cut non-essential sentences (about 70 words).**
   - "; some Microsoft repos run about 60,000 tests in under 5 minutes per PR [MS27]" (specialist detail).
   - "Atlassian likewise keeps "developers ... in control of the merge button" [ATL1] (vendor-reported)." (second vendor saying the same thing).
   - "Spotify opens agent PRs only after CI validation [SPOT7]." (already implied by required checks).
   - In Key metrics, drop the quote ": "Count the developer's time through to merge." [AIE12]" and end at "time to merge".
6. **Remove the triple "no source approves" statement.** It appears in the recommendation ("our proposal"), the L3 row ("Our recommendation: no source has an AI reviewer approve") and Open gaps. Delete the L3 row clause "Our recommendation: no source has an AI reviewer approve"; the one-line recommendation and Open gaps suffice.
7. **Clarify the L4 row.** Guardrail "A named human owner stays accountable for everything else" -> "Approval of non-routine changes would remove the accountable human owner" (says why it is not proposed, as II.2 does).
8. **Reorder the three bold paragraphs.** Put "**Human review of agent-authored PRs.**" first (the default rule), then "**Block early, approve last.**", then "**Evidence makes review cheaper.**". The reader then sees the default before the exception.
9. **Fix Purpose punctuation.** ""we now have 76% more PRs to review." [SPOT2], and Google found" -> ""we now have 76% more PRs to review" [SPOT2], and Google found" (period inside quote before a comma reads as an error). Same for "...review the changes." [GOOG2]." if the convention allows.
10. **Add one missing essential: the AI reviewer reads untrusted input.** Add an Enterprise complications bullet: "**The reviewer reads untrusted text.** PR descriptions, comments and code can carry prompt injection aimed at the reviewer; at L3 this could approve a change. **Recommendation:** the reviewer has no write scope beyond comments and checks, and L3 approval also requires the deterministic class check (see IV.7)." Mark [GAP] if no note covers it.
11. **Trim the catalog re-explanation.** "reconciled with owners from the service catalog (see V.1), which maps services to repos and owners [MS28]" -> "reconciled with owners from the service catalog (see V.1) [MS28]" (conventions say do not re-explain the catalog).
12. **Overlap check.** No significant overlap with II.9 or II.2. REQ-OWN-01 reuses II.2's ID with a different statement; fine per conventions (renumbered at assembly). The risk-class threshold defers to II.8 correctly.

## Verdict

READY AFTER EDITS. Edits 1 to 4 matter most (contradiction wording, block rung, chart block path, glosses); the rest are trims.
