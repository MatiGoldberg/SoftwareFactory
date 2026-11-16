# II.2 reader-judge report

Reader: a busy Microsoft engineering leader who knows engineering basics but not the cited systems. One read, no source notes.

Length check: about 960 words of prose outside tables and diagrams, inside the 700 to 1,000 target. Both Mermaid blocks pass the validator (block 1: shown 672x529, text 15.3px; block 2: shown 672x558, text 15.1px). Length is fine. The problems are a contradiction in the rungs, a grilling loop with no stated stop rule, and a Real-world reference section that spends its words on the wrong things.

## Scores

| Criterion | Score | Reason |
|---|---|---|
| 1. Clarity | 3/5 | The split between deterministic and agentic parts is stated well (line 41). But the L3 row ("moves ... PRDs to 'ready for spec' itself") contradicts "it never approves its own output", and the owner's "grill until clear" has no stated stop rule. |
| 2. Reading flow | 4/5 | The template order works. The snags: Spec Kit's `/plan`, `/tasks` and constitution detail drifts into II.3, and line 58 piles up four references (Uber, Linear, OpenAI, Spotify) in one paragraph. |
| 3. Key references | 3/5 | Spec Kit and the Anthropic interview pattern are explained well. Honk, "Microsoft Digital", "OpenAI's note" and "Anthropic's long-running harness work" are relied on without a "what it is", and MS15 appears only in a requirement row. |
| 4. Level of detail and length | 4/5 | It is within budget. The repeats: dependency-question routing appears five times, the PRD field list appears twice word for word, and the complication bullets at lines 72 and 73 overlap. The main thing missing is the stop rule (and one example question). |
| 5. Message | 3/5 | The takeaway is in the text but spread across lines 41, 58 and 68: the agent asks and drafts, the deterministic gate approves, it ends with open questions rather than assumptions, and it starts at Prepare. II.9 has a bold one-line recommendation; this section does not. |
| 6. Diagrams | 4/5 | Both charts are readable at column width, compact, and use the orange agent convention with a legend. In chart 2, the grilling loop has no exit condition, the dependency owners are a dead end, and no rung is shown. In chart 1, privacy sign-off is drawn as always required, but the text makes it conditional. |

## The one takeaway (as it should land)

The grilling agent asks questions and drafts the PRD. The template linter, the sign-offs and the ready gate stay deterministic and decide when the PRD is done. "Clear" means the PRD passes that gate; anything still unknown goes on an explicit open-questions list, never into an assumption. Start at Prepare (L1), and promote only when agent-drafted PRDs need no more clarification than human-drafted ones.

## Concrete edits

1. **Fix the L3 contradiction (required).** Line 41 says the agent "never approves its own output", but the L3 row (line 65) has it move PRDs to "ready for spec" itself. Replace the L3 "What it does" cell with: "Submits single-service, no-sensitive-data PRDs to the ready gate without waiting for the owner's click; the lint and the SRE sign-off still apply; the owner is notified and can pull it back." Then change line 41's last clause to: "it never approves its own output: the deterministic gate does."

2. **State the stop rule for "until clear" (required, essential and missing).** After line 41's first sentence, add: "'Clear' has a mechanical definition: the draft passes the completeness lint and every acceptance criterion is an observable check. The agent stops asking when that holds, or when the remaining unknowns are written on the open-questions list for a named person to answer." Without this, the reader cannot tell when the grilling ends, and that is the heart of the owner's idea.

3. **Add a one-line recommendation at the top of "What to agentify".** Replace "The owner's idea: an agent that grills the requirement owner until the requirement is clear, then writes a PRD an agent can pick up." with: "**Recommendation, in one line:** an agent grills the requirement owner and drafts a PRD that another agent can pick up, but the deterministic gate, not the agent, decides when it is clear; anything unresolved stays on an open-questions list. Start at Prepare (L1)." Then line 68's "start at Prepare (L1) and" can be cut, leaving "**Recommendation:** measure the clarification rate on agent-drafted versus human-drafted PRDs before promoting."

4. **Give one example of a grilling question.** In line 58, after "so it should read the context layer first", add something like: "for example, having read an incident in the catalog, it asks 'What should happen to in-flight requests when the flag turns off?' rather than 'Any edge cases?'". Mark it as illustrative. Also point to Appendix D (the PRD-from-interview template). One concrete question makes "grilling" tangible for this reader.

5. **Trim Spec Kit to what this stage uses.** On line 33, cut "`/plan` then adds the technical plan and `/tasks` breaks it into chunks an agent can run. A `constitution.md` holds non-negotiable principles every plan must obey, and" and keep "specs are plain Markdown reviewed by humans or agents". That material belongs to II.3 (specification), which owns the constitution.

6. **Tie the Anthropic pattern to the owner's idea and cut AN3.** On line 35, open with "**Anthropic's interview pattern** is the closest published version of the grilling agent:". Cut the sentence "Anthropic's long-running harness work adds a planner that expands a 1 to 4 sentence prompt into a product spec, kept high-level so that spec errors do not cascade [AN3]." It is tangential, and "long-running harness work" is unexplained.

7. **Explain Honk once, where it first appears.** On line 37, change "Spotify's Honk uses an interactive intake agent" to "Spotify's Honk, its internal background coding agent for fleet-wide changes, uses an interactive intake agent". Line 58 then relies on Honk safely.

8. **Explain "Microsoft Digital".** On line 37, change "Microsoft Digital's AI Work Item Assistant" to "Microsoft Digital (Microsoft's internal IT organization) reports that its AI Work Item Assistant". This also softens the claim, since the source is guidance-grade.

9. **Name "OpenAI's note".** On line 58, change "OpenAI's note is the constraint" to "OpenAI's harness-engineering write-up states the constraint". Better still, move the OpenAI sentence and the Uber/Linear sentence into REQ-CTX-01 and keep only the Spotify failure mode in the prose. The paragraph currently carries four references for one point.

10. **Merge the two overlapping complication bullets.** Lines 72 and 73 make the same point (the requester cannot speak for another team's service; route to its owner via the catalog). Merge them into one: "**Requirements that span teams.** The requirement owner cannot speak for a dependency they do not own. The service catalog maps services to owners [MS28], so the agent routes those questions there and records the answer as that owner's sign-off; unanswered questions block the ready gate. [GAP: no source describes a requirements stage negotiating across owning teams before work starts.]" Drop the Spotify after-the-fact clause, which is a separate point already covered in the open gaps.

11. **Do not repeat the field list in REQ-PRD-01.** Line 81 repeats line 25's eight fields word for word. Replace the statement with "Every PRD uses one template whose required fields (see the completeness check above) are enforced by a linter." Alternatively, keep the list in the table and shorten line 25 to "Required fields are listed in REQ-PRD-01". Do one or the other, not both.

12. **Explain or drop MS15.** REQ-GOV-01 cites MS15, which the prose never mentions. Either add a clause saying what it supports, or replace the source cell with "Recommendation".

13. **The REQ-PRD area is not in the shared vocabulary.** The conventions list the areas CTX, VER, REV, MRG, DEP, OBS, IDN, REPO, API, PIPE, OWN, CFG, SEC and GOV/COST, and PRD is not among them. Either ask the owner to add a PRD (requirements) area to 01-conventions.md, or renumber the rows. Flag this for the consistency reviewer.

14. **Chart 2: show the loop's exit and close the dead end.** Add `DEP -- "answers = sign-off" --> GATE` and `GATE -. "open questions" .-> GA`, so the reader sees that the grilling repeats until the gate passes. Rename the agent node `GA["Grilling agent<br/>Prepare to Act on approval"]:::agent`, or add a sentence before the chart, "The chart shows the agent at Prepare and Act on approval; the table gives all five rungs", to match II.9. Re-run the validator after the change: it is at 558px tall now, and two more edges should still fit under 700px.

15. **Chart 1: make privacy conditional.** Change `D2["Privacy and<br/>compliance sign"]` to `D2["Privacy sign-off<br/>if data tagged"]`, to match the text on line 26.

16. **Minor wording in Purpose.** Line 5: "Agents make this worse, because they fill gaps with plausible assumptions instead of asking." This is the line that motivates the grilling agent, so keep it, but cite it or tie it to SPOT5 ("as Spotify found, see below"), because it is currently an uncited claim.

## Diagrams

- **Block 1 (deterministic process):** 672x529 at 15.3px text. It is clean: a fan-out to three parallel sign-offs, with dotted feedback edges. Readable and well placed. Only edit 15 applies.
- **Block 2 (agent touchpoints):** 672x558 at 15.1px text. One orange agent node, with a legend line. Readable and sized well. The dangling "Dependency owners" node and the missing exit condition weaken the owner's core idea (edit 14).

## Verdict

**READY AFTER EDITS.** The structure, the rungs table and the "open questions, never silent assumptions" rule answer the owner's earlier feedback, and the length is in budget. Edits 1 to 3 are required: they remove the L3 contradiction, define when the grilling stops, and put the takeaway in one line. Edits 5 to 11 remove drift and repetition; edit 14 makes the diagram show the grilling loop.
