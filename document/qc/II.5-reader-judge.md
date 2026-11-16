# II.5 Implementation: reader-judge review

Reader: a busy Microsoft engineering leader who knows engineering basics but not the systems cited. Benchmarks: II.9 and II.2 (owner-approved).

## Scores

| # | Criterion | Score | One-line reason |
|---|---|---|---|
| 1 | Clarity: deterministic core and rungs | 3 | The deterministic shell is clear, but the "realistic ceiling is Act on approval" line conflicts with an L3 auto-merge row and with REQ-REV-01, and the chart's "Implement agent" and "Fix-CI agent" do not match the table's "Coding agent". |
| 2 | Reading flow | 4 | Follows the template well; the "Context as a map" and "inner loop" paragraphs read as a quick list of citations rather than an argument. |
| 3 | References explained before use | 3 | CCA, Minions and blueprints are well introduced. AGENTS.md, Codex, hooks, MCP, Copilot Code Review, Spotify's agent and "doc-gardening" are used without a word of explanation. |
| 4 | Detail and length | 3 | About 1,050 words of prose (within the limit). The Toolshed and Entra "blueprint" asides, the AIE1 distributed-systems detail and the dense CCA numbers bullet are non-essential. The selection gate's owner and its rule are missing. Small overlap with II.2 (the OAI1 "invisible" line). |
| 5 | Message | 4 | "Agents write code inside a sandbox and blueprint; selection, verifiers, the CI cap and the merge stay deterministic" comes through. The L3 row blurs it. |
| 6 | Diagrams | 4 | Both pass at full size (16px and 15.7px text, under 700px tall), uncluttered, orange agents with a legend, matching II.9 and II.2. Small issues: "devbox" in chart 2 and "sandbox" in chart 1; chart 2 shows no rungs and no line explains this. |

## Concrete edits

1. **Fix the "ceiling" contradiction (owner feedback: "agent never approves" vs higher rungs).** Replace "Today's realistic ceiling is Act on approval: the agent opens the PR, and a human merge is the approval." with "For feature code the ceiling today is Act on approval: the agent opens the PR, and a human merge is the approval. Act, then notify applies only to allow-listed maintenance classes (lint fixes, dependency bumps), where the deterministic gates, not the agent, approve the merge."
2. **Align REQ-REV-01 with item 1.** Replace "and is merged only by a human with ownership of the code at Act on approval." with "and is merged only by a human with ownership of the code, except allow-listed classes promoted to Act, then notify (see the rungs table), which merge only after every gate passes."
3. **L3 row, Evidence column.** Move "Spotify auto-merges most of its maintenance PRs [SPOT2]; OpenAI's greenfield team let agents merge their own [OAI1]" out of the evidence cell and into one sentence under the table, starting "Precedents:". The evidence cell should hold only the promotion bar ("Zero escaped defects in the class over a long sample"). Note that OAI1 is a greenfield repo, not an existing service.
4. **Match the role names in the table and the chart.** Rename the table's "Coding agent" to "Coding agent (implement and fix-CI nodes)", or relabel the chart's "Fix-CI agent" as "Coding agent: fix CI".
5. **Say who runs the selection gate.** After "has a check that proves it done." add: "The gate is a rule, not a judgment call: the task's class must be on the allow-list that the trust ledger keeps (REQ-GOV-02), and the task must name its verifying command."
6. **Explain AGENTS.md on first use** (it first appears in chart 2 and in "Context as a map"). Replace "a roughly 100-line AGENTS.md pointing into" with "a roughly 100-line AGENTS.md (a Markdown file at the repo root that agents read first) pointing into". Also, "OpenAI gave Codex" becomes "OpenAI gave Codex, its coding agent,".
7. **Explain hooks.** Replace "Instruction files are advisory, but hooks" with "Instruction files are advisory, but hooks (scripts the agent harness runs at fixed points, as in Claude Code)".
8. **Name Spotify's agent.** Replace "Spotify runs verifiers chosen by repo contents" with "Spotify's Honk, its fleet-wide coding agent, runs verifiers chosen by repo contents".
9. **Cut the Toolshed sentence or shorten it.** "Toolshed, a central MCP server, gives each agent a small curated subset of 400 to 500 tools [STRIPE1]." MCP is never explained, and the sentence does not support any gate or rung. Either cut it or replace it with "A central tool server gives each agent a small curated subset of its 400 to 500 tools [STRIPE1]."
10. **Cut the Entra aside.** "(Entra Agent ID's "blueprint" is an unrelated identity template; see IV.4.)" interrupts the Stripe explainer. Move it to the Secrets and agent identity bullet, or drop it.
11. **Trim the AIE1 sentence.** Replace "One conference talk by a Microsoft engineer treats subagents as a distributed system: explicit partial or unknown outcomes, fan-out budgets, and reading back a PR by ID when its creation reply is lost, not retrying [AIE1]." with "One conference talk by a Microsoft engineer argues that subagents need distributed-systems discipline: fan-out budgets and explicit unknown outcomes [AIE1]."
12. **Make the CCA numbers bullet lighter.** Split it into two lines: (a) "Merge rate 67.9% (535 of 878), up from 41.7% in month one to about 71%; Microsoft employees' PRs: 87.1% (different populations, directional only)." (b) "Small changes do better (1 to 10 lines: 80.0%; 101 to 500 lines: 64.0%); reverts 3 of 535, too few to compare." Cut "against 33 of 4,251".
13. **Explain "Copilot Code Review".** Replace "and Copilot Code Review runs on every PR" with "and GitHub's AI reviewer, Copilot Code Review (see II.6), runs on every PR".
14. **Introduce the context-gardener agent in prose.** It appears only in the table, and "doc-gardening" is unexplained. Add one line before the table: "A second agent, the context gardener, keeps AGENTS.md, lints and tests current by proposing fixes after repeated failures."
15. **Diagram consistency.** In chart 2, change "Selected task in<br/>fresh devbox" to "Selected task in<br/>fresh sandbox" ("devbox" is Stripe's term). Under the legend, add a rung note in the style of II.9: "The chart shows Act on approval; the table gives all five rungs."
16. **Optional: reduce overlap with II.2.** The "what is not in the repo is invisible to the agent" line already appears in II.2 (REQ-CTX-01 rationale). Keep it here, where it belongs, and accept the repetition, or shorten this REQ-CTX-02 rationale to "Agents see only the repo".

## Verdict

**READY AFTER EDITS.** Edits 1 to 5 are required, because they close the owner's "never approves vs higher rungs" and "unclear agentification" concerns. Edits 6 to 15 are quick clarity and length fixes.
