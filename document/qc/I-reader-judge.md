# I reader-judge report

Reader: a busy Microsoft engineering leader who knows engineering basics but not the systems cited, reading Part I right after Part 0 (including the 0.5 systems primer). One read, no source notes.

Length check: about 1,400 words of prose (I.1 is about 1,320 words; I.2 adds about 80 outside the table), about 1,810 words with the table. That fits the skeleton's "~4 pages", so length is not the problem; density is. Most lesson paragraphs pack three or four companies and five or more numbers into three sentences, and several numbers are repeated exactly in the Part II section the lesson points to. The edits below cut about 170 words and add about 110, so the section gets slightly shorter and much easier to read.

Rung consistency ("agent never approves"): no contradiction. Lesson 4 says each Duolingo test PR was human-approved, lesson 6 uses Meta's per-action rule, and lesson 7 says no agent change merges before rings and halt exist, which matches III.4. Two places could still mislead a reader who has not reached Part III yet; edits 6 and 7 fix them.

Diagram: none, and none is required. The skeleton planned D1 (an evidence heat map). A compact strip would help a little, because the I.2 message ("strong at the two ends, thin in the middle") is a shape, and a picture shows a shape faster than a 16-row table. If one is added: two `direction LR` rows of six stage boxes (II.1 to II.6, II.7 to II.12), filled green, amber or grey by evidence grade, with a one-line legend. It is optional. The closing sentence of I.2 already carries the point if edit 12 is applied.

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 4/5 | The claim, caveat and "so what" pattern is clear and the "so what" lines are concrete. But lesson 1 leads with evidence that AI review speeds things up, which argues against its own claim. Lesson 3's caveat is really a supporting point. Lesson 6 mixes an agent fact (Copilot) with a deterministic gate (Diff Risk Score) without saying which is which. |
| 2. Reading flow | 3/5 | There is no hook: the first sentence announces a list rather than a finding. The lessons are never drawn together, so the reader finishes with eight paragraphs and no single picture. "Step 0" and "one rung at a time" are used before the roadmap and ladder exist. The evidence-map rows jump from II.12 to V.1, then IV.4, then III. |
| 3. Key references explained | 3/5 | The primer covers SDP/Gandalf, Copilot coding agent, AI code review, Meta DRS, Honk and Google migrations. It does not cover: "harness" (the central term of lesson 2), Microsoft Digital, 1ES, DORA, MCP gateway, Backstage, mabl, Linear, Azure SRE Agent, trust ledger, "rung", "Step 0", "factory metrics", "sprint contracts", "non-REST gates" and "one-box". |
| 4. Detail and length | 3/5 | Length is within target, but each lesson carries roughly twice the evidence it needs. Numbers repeated exactly from Part II and III: 41.7% to 71% and $9 vs $200 (II.5), the 80.0%/64.0% size split (II.5, III), the Gandalf control-plane pair (II.9), the 10,000-change freeze (II.8), the 44% Uber figure (II.8), and the Google review quote (II.6, II.12, III, VII). |
| 5. Message | 3/5 | The intended takeaway (the bottleneck moves from writing code to verifying, contextualizing and deploying it, and autonomy is earned per action) is present but never stated. I.2 ends on a different point (where the evidence is strong), so the part closes on a footnote, not the thesis. |

## The one takeaway (as it should land)

The companies furthest ahead found that generating code is the cheap part. What limits them is verifying it, giving agents the right context, and deploying it safely. So a factory is mostly that infrastructure, and agents earn autonomy one action at a time, on evidence.

## Concrete edits

1. **Give Part I a hook and state the takeaway first (line 3).** Replace "Eight lessons recur across the companies that have published how they put agents into engineering. Each is shown in detail in a later section; here are the claim, the strongest evidence, the main caveat and what it means for an existing service." with: "The companies furthest ahead found that generating code was the easy part. What limits them is checking it, giving agents the right context, and deploying it safely; autonomy, where they grant it, is earned one action at a time. Eight lessons recur in what they published. Each gets a claim, the strongest evidence, the main caveat and what it means for an existing service; the later sections show the detail." Keep the I.2 sentence.

2. **Close the lessons with one synthesis line (after line 69, before I.2).** Add: "Taken together: lessons 1, 5 and 7 say what to build first (verification, context, safe deployment), lessons 3 and 8 say where to build it (the shared platform and the existing organization), and lessons 2, 4 and 6 say how to let agents in (small, verifiable work, a versioned harness and per-action trust). Parts II to VI follow that order." About 60 words. Edits 8 to 11 pay for it.

3. **Lesson 1: put the claim's evidence first (line 9).** The Microsoft sentence shows AI review working, not review being the bottleneck. Reorder: start with "Google's migration report says 'The bottleneck ...' [GOOG2], Spotify reports '76% more PRs to review' [SPOT2], and one Uber conference talk reports ... [AIE3]." Then: "Microsoft's response is an AI first-pass reviewer, now on over 90% of PRs (over 600K a month), with an early 10 to 20% improvement in median PR completion time [MS6]." The caveat then follows naturally.

4. **Define "harness" in lesson 2 (line 15/17).** It is the lesson's key term and the primer does not cover it. After the heading, open the paragraph with: "The harness is everything around the model: instructions, tools, sandbox, verifiers and the orchestration loop." In the Anthropic sentence, change "Anthropic's solo agent" to "Anthropic's agent running alone (no planner or evaluator)".

5. **Lesson 2 caveat: split the OpenAI point off or cut it (line 19).** "OpenAI says of its relaxed merge gates: 'This would be irresponsible in a low-throughput environment.'" is not about harness parts ageing, and "relaxed merge gates" is never explained. Either cut it (preferred, saves 17 words), or turn it into its own sentence that says what was relaxed.

6. **Lesson 6: clarify the Copilot quote (line 49).** "Copilot Coding Agent 'cannot open PRs on its own'" reads as a contradiction, since opening PRs is its job. Replace it with: "Every Copilot Coding Agent PR in dotnet/runtime (the .NET runtime repository) is opened at a maintainer's explicit request, and a human merges it ('CCA cannot open PRs on its own') [MS8]; its revert rate ...". Cut the task-size clause ", and success falls with task size (80.0% for 1 to 10 lines, 64.0% for 101 to 500)". It is in II.5 and III, and it is about task size, not autonomy.

7. **Lesson 6: say that Diff Risk Score is a gate, not an agent, and define the ladder in a clause (lines 49, 53).** Replace "Meta's Diff Risk Score let over 10,000 changes land during a 2024 freeze 'with minimal production impact' [META2], gating only the riskiest diffs [META3]." with: "Meta applies the same idea to gates: its Diff Risk Score, a deterministic model and not an agent, lets low-risk changes land and holds back only the riskiest diffs [META2, META3] (see II.8)." In the "So for" line, change "promote one action one rung at a time on trust-ledger evidence" to "promote one action one rung at a time (from Advise up to Act, then notify; no agent ever approves its own output) on evidence in a trust ledger, a per-action record of outcomes (see III.1, III.2; templates: D6, D7)". This sets up Part III's vocabulary and closes off the owner's "agent never approves" concern before it can arise.

8. **Lesson 3: fix the caveat logic and cut a duplicate (lines 25, 27).** "standardization is a precondition: Spotify dropped one framework from a migration for too much per-team variability [SPOT5]" supports the claim; it is not a caveat. Move it into the evidence paragraph after "significantly better" [SPOT2], and keep only the source-quality point as the caveat. Cut ", and DORA lists quality internal platforms among its seven AI capabilities [GOOG4]". DORA comes back in lesson 8, and "seven AI capabilities" is unexplained here. Explain "MCP gateway" as "a gateway for the tool servers agents call (Model Context Protocol)".

9. **Lesson 4: cut the 1ES sentence (line 33).** Cut "; 1ES says 'Central to our transformation is delegating toil to agents.' [MS7]". It repeats the Microsoft Digital point and introduces an unexplained name. At first use, make "Microsoft Digital" read "Microsoft Digital (Microsoft's internal IT organization)". Also: the opening Microsoft Digital claims in lessons 4 and 8 rest only on MS15, which is grade C, and say so in words ("Microsoft's Inside Track blog reports").

10. **Lesson 5: explain the non-primer names, cut the obscure caveat (lines 41, 43).** Change "Backstage lineage" to "Backstage (Spotify's open-source developer portal and service catalog) lineage data". Change "mabl reports" to "the test-tooling vendor mabl reports". Change "Azure SRE Agent's preview" to "the preview of Azure SRE Agent, Microsoft's AI operations agent (see II.11),". Cut "and Linear warns that instruction files distilled from review comments keep growing (one conference talk) [AIE11]" (saves about 20 words). Keep the catalog-accuracy caveat, which is the one that matters.

11. **Explain "Step 0" at first use (line 45) and trim lesson 7 (line 57).** Change "are Step 0 deliverables" to "are deliverables of Step 0, the readiness step that opens the roadmap (see III.4)". After that, line 61's "Step 0 prerequisite" reads fine. In lesson 7, cut ", and control-plane ones with 94.9% and 99.8%". II.9 carries both pairs, and one pair makes the point. Change "from one-box to waves" to "from a single first host to region waves". Line 69: change "DORA and factory metrics" to "DORA delivery metrics plus factory metrics such as revert rate and cost per accepted change". At the first DORA mention (lesson 8), add "(Google's DevOps Research and Assessment program)".

12. **Lesson 8 caveat: cut the hard-to-parse second clause (line 67).** Cut ", and the closest analogue to a regulated multi-team transformation is an unvalidated roadmap from a perception study [EMB1]". A busy reader cannot use it here, and VI cites EMB1. Saves about 20 words.

13. **I.2: order the rows by Part and fix jargon (lines 77 to 92, 94).** Move the "III Trust ledger", "IV.4 Agent identity" and "V.1 Service catalog" rows into III, IV, V order after II.12. In the II.3 row, replace "Sprint contracts only for single apps" with "Agreed per-task acceptance checks shown only for single apps". In the II.4 row, replace "non-REST gates" with "gates for non-REST APIs (gRPC, events)". Consider dropping the "Main sources" column: codes alone mean nothing to this reader, and the cell content is in Appendix B. Finally, end I.2 on the thesis. After "The roadmap in III.4 follows the same order." add: "So begin where the evidence is strongest, and treat everything in the thin rows as an experiment with its own baseline."

14. **Optional (style).** "So for an existing service:" appears 8 times. A bold "**So what:**" label reads faster and saves about 30 words without losing the pattern.

## Overlap with Parts II, III and IV

Pointers such as "(see II.6, II.8, IV.8)" are the right way to set up later parts, and Part I does not pre-empt the ladder, ledger or requirements. The overlap is in the numbers. Edits 6, 7 and 11 remove the exact duplicates of II.5, II.8 and II.9. The Google review quote now appears in five sections (I, II.6, II.12, III, VII); Part I is the right home for it, so the final editor should consider trimming it in III and VII, not here.

## Verdict

**READY AFTER EDITS.** The structure and evidence are sound. Edits 1, 2, 4, 6 and 7 are needed for it to work as the document's opening argument; the rest are polish.
