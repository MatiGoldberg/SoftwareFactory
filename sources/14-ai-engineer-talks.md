# AI Engineer conference talks (ai.engineer)

Notes produced 2026-11-14. AI Engineer talk-library pages often carry a full written essay derived from the talk; those are rated "detail: high". World's Fair 2026 sessions in the schedule have abstracts only. Event/date often not stated on library pages. Quotes verbatim; rest paraphrase.

Index used: https://ai.engineer/worldsfair/2026/llms-full.md (all WF 2026 abstracts) and https://ai.engineer/talks (library, ~1,500 talks).

---

## [AIE-UBER-MERGE] AI Writes Code Faster Than Uber Can Merge It

URL: https://ai.engineer/talks/hX140a5klW0-ai-writes-code-faster-than-uber-merge
Speakers: Preetam Dwivedi, Manjari Akella (Uber). Detail: high.

**Key ideas**
- SubmitQueue tests combined states before trunk, so two individually green PRs are tested together.
- Under AI-driven load: admit cheap changes at peak, defer expensive ones to a retry queue (no resubmission).
- Conflict relaxation: drop weak dependency overlaps (Jaccard scoring) to run more queues in parallel — biggest throughput gain, knowingly accepting rare A+B failures.
- Stovepipe post-merge validation keeps a "verified main" pointer that only advances when a later integrated state passes.
- Next: batch related changes, track green state per service, automate fixes and reverts.

**Numbers**
- Six language monorepos, 5,000+ developers, ~36,000 commits and ~27,000 PRs/week.
- Hourly merge requests +44% (≈90 → 130/h, Jan–Mar 2026) pushed P95 land time from 30 min to 3–4 h; after fixes, peak ~300 lands/h at 30-min P95.

**Quotes**
- "Each pull request passes against its own base. Neither test run exercises the combined change."

**Relevance:** merge/integration capacity is a hard constraint once agents raise PR volume; explicit correctness-vs-throughput trade-offs and a "verified main" pointer.

---

## [AIE-META-ONCALL] Give Your On-Call Its Own AI Teammate

URL: https://ai.engineer/talks/_NBx2NNOuA4-give-your-on-call-its-own-ai
Speakers: Swaapnika Motapothula, Chinmay Gandhi, Vlad Tsvang (Meta). Detail: high.

**Key ideas**
- One shared agent per on-call rotation investigates across alerts, tickets, config pushes, past incidents; keeps team memory across shifts.
- **Autonomy granted per action**, based on cost of a mistake, checks that would catch it, and the agent's track record on that action.
- Ladder: investigate → draft a fix (review + CI + human approval to reach prod) → clear selected routine work alone. Production mitigations stay human.
- Daily digest, handoff summaries, a decision queue separating "needs a person" from "agent handled".
- Corrections reopen the item and enter memory; memory entries scored by whether they helped.
- Rotations onboard with their own playbooks/skills; identity, config, memory per team.

**Numbers.** Illustrative only; time saved "remains open" (unmeasured).

**Quotes**
- "Grant autonomy action by action."
- "Promotion applies to a particular action."

**Relevance:** the most concrete published trust model for promoting agent autonomy — per action, evidence-based, with human-owned production mitigations.

---

## [AIE-MSFT-SUBAGENTS] Your Sub-Agents Are a Distributed System. Treat Them Like One.

URL: https://ai.engineer/talks/DxP5aW4VknQ-your-sub-agents-are-distributed-system-treat
Speaker: Girish Konda (Microsoft, principal software engineer; MCP Pacemaker). Detail: high.

**Key ideas**
- Orchestrators treat worker calls as string-returning functions, hiding partial work, stale reads, lost replies.
- Explicit `partial` / `stale` / `unknown` outcomes; a timeout doesn't mean failure.
- SAFE handoffs: **S**ource reads versioned and freshness-checked at decision time; **A**t-most-once effects with identity, single-use approval, read-back; **F**an-out budgets with bounded waits, refusals counted as failures; **E**xplicit outcomes, with code re-checking claims (e.g., recomputing rates).
- Resolve uncertain writes (e.g., lost PR-creation reply) by reading back the effect by ID, not retrying.
- Several agents agreeing on unverified shared context can be one unsupported guess repeated.

**Quotes**
- "A worker can return a confident verdict after skipping an investigation, or create a pull request and lose the reply."

**Relevance:** reliability engineering for agents that write to CI, pipelines, and prod systems: idempotency keys, read-back, bounded concurrency.

---

## [AIE-PROVE-TESTS] Your PR Says the Tests Passed. Prove It.

URL: https://ai.engineer/talks/gbeuC0ud1p4-your-pr-says-tests-passed-prove-it
Speakers: Stephen Chin, Cassandra Chin (Neo4j). Detail: high.

**Key ideas**
- PR descriptions generated from agent session traces; every claim must carry evidence.
- A passing-test claim needs the command, result, and code version checked.
- A stronger model drafts; cheaper focused reviewers check claims against an evidence brief in both directions (unsupported claims, omitted facts).

**Numbers.** PR Bench description scores ~74–76 → 82–86 (team's own benchmark); ~half the tokens.

**Quotes**
- "A passing-test claim needs a command, a result and the version of the code it checked."

**Relevance:** "evidence-carrying PRs" make agent output cheaper for humans to review — a lever on the review bottleneck.

---

## [AIE-AGENT-ARCHAEOLOGY] Stop Doing Agent Archaeology on Your Team's Code

URL: https://ai.engineer/talks/Enn9dVrRXAo-stop-doing-agent-archaeology-on-your-teams
Speaker: Richard Feldman (Delta / Zed). Detail: medium (product demo).

**Key ideas.** Keep the agent conversation, decisions and review alongside the branch so the next engineer doesn't reconstruct intent from commits and transcripts.

**Relevance:** design-rationale retention across hand-offs; little on governance.

---

## [AIE-UBER-SDLC] Agentic SDLC at Uber: Building Blocks for Uber's Software Factory

URL: https://ai.engineer/talks/17-YSUHo6Lk-agentic-sdlc-at-uber-building-blocks-ubers
Speakers: Uday Kiran Medisetty, Adam Huda (Uber); AI Engineer World's Fair 2026. Detail: high.

**Key ideas**
- Model Gateway: one OpenAI/Anthropic-compatible endpoint; middleware with SPIRE workload identity, data anonymizer, AI guard; every request attributed to user, project, team.
- MCP Gateway: a crawler projects internal APIs into MCP tools; patterns evolve Direct MCP → OmniMCP → CLI projection → code-mode skills to keep tool output out of context.
- Pre-provisioned environments (repo snapshots, search indexes) and a "mega DevPod" with all repos for cross-repo autonomous coding.
- Managed skills marketplace with lint + automated-review baseline, persona-based defaults, trace/eval feedback.
- Context graph: 150 node/edge types linking mobile, backend, data lake, design docs, Jira, incidents.
- Minion cloud agent stops at a draft PR; inner-loop validation (static analysis, simulator screenshot vs Figma, staging backend integration) before CI; small model reviews early, stronger model later.
- Scheduled maintenance loops within shared capacity; review comments and merges label data to improve the skill that proposed the change.

**Numbers.** Few thousand engineers, 12 sites; >70% of PRs involve agents; >250 automated migrations covering 9M lines; >800 internal projects and >100M model requests/day via gateway; >20 PII types redacted; >1,000 MCP tools; 2,500 skills, >20,000 skill executions/day; context graph 40M entries.

**Quotes**
- "Earlier validation is part of capacity management"
- "Discovery reduces the need to expose everything up front."

**Relevance:** the most complete public blueprint of an enterprise software factory platform layer (gateway, identity, MCP projection of existing APIs, context graph, skills, environments).

---

## [AIE-AGENT-READY] Making Codebases "Agent-Ready"

URL: https://ai.engineer/talks/ShuJ_CN6zr4-making-codebases-agent-ready
Speaker: Eno Reyes (Factory); AI Engineer Code 2025. Detail: high.

**Key ideas**
- Agent readiness = make engineering standards explicit, executable, verifiable. Eight pillars: testing, documentation, code quality, build systems, dev environment, observability, security, standards. (Factory later published five readiness levels.)
- Loop: specify → generate → verify → iterate; good verifiers are objective, fast, low-noise, graded.
- Gaps humans tolerate (50–60% coverage, flaky builds) become hard constraints for agents.
- Agents can strengthen the environment themselves (find lint gaps, generate initial tests).
- Senior-vs-junior result differences reveal implicit practices worth encoding.

**Quotes**
- "A slop test is better than no test."
- "Agent readiness requires making more of those quality judgments executable."

**Relevance:** step zero for an existing service — inventory and harden verifiers before scaling agents.

---

## [AIE-BOOKING-ROI] Building AI Agents with Real ROI in the Enterprise SDLC

URL: https://ai.engineer/talks/UXOLprPvr-0-building-ai-agents-real-roi-in-enterprise
Speakers: Bruno Passos (Booking.com), Beyang Liu (Sourcegraph); AI Engineer Summit 2025. Detail: high.

**Key ideas**
- Adoption: code search first, then assistant; availability ≠ use; relax token limits, allow model choice, then training and hackathons with business units.
- "Hours saved" too weak; replaced with one-year KPIs (lead time, quality, codebase insights, modernization). "Daily user" = ≥12 active days/month; observed cohort, not randomized.
- Experiment flags and dead code as toil targets; migration analysis via code search + metaprompts + divide-and-conquer; capture legacy behavior in tests before replatforming.
- Org-specific code review from a flat rules file, rules selected by modified files, precision over recall.

**Numbers.** >3,000 developers; 2.5M CI jobs/year; daily users >30% faster and 30% more MRs (smaller MRs), observed cohort.

**Quotes**
- "Buying access is easy; demonstrating an improvement in software delivery is harder."

**Relevance:** realistic enterprise rollout and measurement on a legacy estate.

---

## [AIE-LEGACY-BENCH] Benchmarking Coding Agents on New vs Legacy Codebases

URL: https://ai.engineer/talks/7vn4WpqNpck-benchmarking-coding-agents-on-new-vs-legacy
Speaker: Denys Linkov (Wisedocs); World's Fair 2026. Detail: high.

**Key ideas**
- A six-month refactor consolidated ~10 repos into a monorepo; this made full-system sandbox testing practical (navigation alone wasn't the bottleneck).
- Proof of concept is part of tool selection.
- Plan for 90–99% reliability rather than 50% time horizons.
- A whole-codebase rebuild attempt stopped at scaffolding while the agent reported completion.

**Quotes**
- "The agent's completion report did not establish that the system had been rebuilt."

**Relevance:** cross-repo end-to-end testability is a precondition; never accept agent completion claims without independent verification.

---

## [AIE-ALWAYS-ON-OPS] Always-on agents run production without the on-call tax

URL: https://ai.engineer/talks/vSx5IULvBns-always-on-agents-run-production-without-on
Speaker: Justin Smith (Resolve AI); World's Fair 2026. Detail: medium.

**Key ideas**
- Background agents triggered by schedule, events (deploys, Slack), or request.
- Deployment monitoring plans derived from the specific change (which metrics, dependencies, pipelines it touches), including changes outside the pipeline (flags, infra).
- Hard part: an evolving knowledge system of service interactions.

**Quotes**
- "The expensive part of operational work is understanding a changing environment, as well as executing the task."

**Relevance:** change-specific post-deploy validation complements generic canary metrics.

---

## [AIE-DUOLINGO-TESTS] 225,000 Lines of Tests, Written and Merged by Agents

URL: https://ai.engineer/talks/D_4Rn6uLdQM-225-000-lines-tests-written-merged
Speaker: Kush Agrawal (Duolingo). Detail: high.

**Key ideas**
- Coverage report uploaded on each main merge; selector ranks files (boost data/logic layers, skip UI).
- Per-file Temporal workflow: agent clones, reads testing skill, writes tests, opens labeled PR; idempotent retries.
- Lifecycle state machine every couple of hours per PR: close stale (~3 weeks/conflict), skip if CI running or reviewer assigned, deterministic pre-commit fix, repair agent on failures (5 attempts), on green assign git-blame top contributor + auto-merge, on rejection 30-day cooldown for that file.
- Anti-gaming: deterministic check closes PRs touching files outside tests/mocks/fakes/stubs; reviewer agent checks for production edits, deleted/disabled tests; rejections feed back into prompts and skill.

**Numbers.** >700 test PRs merged (~225K lines), each human-approved; repository layer coverage 11% → 72%, whole app 11% → 24%; early batches merged 8/17 and 19/40.

**Quotes**
- "A test PR could pass CI by weakening an existing test."

**Relevance:** a complete, safe first agentification loop on a legacy codebase (test backfill) with owner routing and anti-gaming controls.

---

## [AIE-MAERSK-MAINTAIN] Agents Made Code Free. Maintaining It Didn't Get Cheaper.

URL: https://ai.engineer/talks/oeknLUsN_GE-agents-made-code-free-maintaining-it-didnt
Speaker: Dmitry Buykin (Maersk). Detail: high.

**Key ideas**
- 110 countries, ~10,000 scenarios; unit of change is a "slice" (one process, one country); corrections stay in the slice by default.
- Decision tables: code prepares facts, experts own rows, model picks a row, code executes; no match → human.
- Writes gated in code (five checks before, one after to confirm landing; journal ensures single effect).
- Replay over thousands of past sessions to estimate a check's reach; frozen real-task replay of old vs new behavior; unexercised branches recorded as "no evidence".
- Second agent reviews with a checklist and without the author's reasoning.

**Numbers.** Checking took ~90% of agent time on a change.

**Quotes**
- "A passing replay says little about an approval path that no order in the set took."

**Relevance:** blast-radius scoping ("where may this change spread") and replay-based evidence for divergent multi-tenant/multi-market legacy systems.

---

## [AIE-MERGE-BOTTLENECK] Merge Is the Bottleneck

URL: https://ai.engineer/talks/TlOAhw9t5DA-merge-is-bottleneck
Speaker: Prasanna Sankar (Vorflux). Detail: high.

**Key ideas**
- Full cloud dev environment per session (ports, auth, secrets, seed data) so E2E and browser tests run before PR.
- Plans with dependency graphs; independent pieces to build subagents; different model reviews than builds.
- Persistent "Autobots" with goal, owner, home channel, budget, webhook triggers; signal triage (handled / needs a person / noise) — "fix every alert" floods PRs.

**Quotes**
- "Count the developer's time through to merge."

**Relevance:** bot governance (owner, budget, scoped triggers) and end-to-end-to-merge metrics.

---

## [AIE-MULTIPLAYER-FACTORY] Your Team's Agents Are All Shipping to the Same Code at Once

URL: https://ai.engineer/talks/fTUinMqA1XQ-your-teams-agents-are-all-shipping-same
Speaker: Patrick Debois (Tessl). Detail: high.

**Key ideas**
- "Solo factory" vs "multiplayer factory"; plan concurrent delivery before coding.
- Claim tickets and announce intended files/edits to surface overlaps; isolate with worktrees, pinned API versions, DB snapshots, mocks/digital twins.
- Semantic conflicts: one PR returns cents, another dollars — tests pass; an agent should trace values across PRs.
- Speculative merge trains; review depth by production impact and recovery cost; shared decision log.
- A "factory team" owns skills, shared context, agent routing, monitoring.

**Quotes**
- "Two passing PRs can disagree about the meaning of a value."

**Relevance:** coordination problems specific to many teams' agents changing the same system concurrently.

---

## [AIE-LINEAR-CONTEXT] What Your Coding Agent Can't See in the Code

URL: https://ai.engineer/talks/Xw9utONfhIY-what-your-coding-agent-cant-see
Speaker: Tom Moor (Linear). Detail: high.

**Key ideas**
- Triage agent labels, routes, dedups, flags open product decisions, leaves its investigation on the issue (logs, traces, customer history via MCP).
- Review agent starts from the original issue, then searches history for earlier decisions, reverts, incidents, overlapping work; identifies who owns the trade-off.
- Daily automation distills review comments that led to changes or reverts into agent instructions — with a warning about ever-growing instruction files.

**Quotes**
- "Implementation has become cheap enough that the harder decision is which settings deserve to exist together."

**Relevance:** intent and history live outside the code in legacy services; agents need decision/incident history to review safely.

---

## World's Fair 2026 sessions (abstract only, from the schedule dump)

Relevant titles worth tracking (no detailed page available):
- **Agentic SDLC at Uber: Building Blocks for Uber's Software Factory** (Uday Kiran Medisetty, Adam Huda): model gateway, MCP infrastructure, agent skills, spec-to-post-ship SDLC.
- **Scaling Code Quality: Building uReview, Uber's Multi-Agent Code Review Engine** (Will Bond, Ameya Ketkar).
- **Rise of the Software Factory** (Tereza Tížková): "agent readiness" checklist, per-agent scoped credentials, open questions on persistent identity and recovery from partial failure.
- **We Gave an Agent Production Code Access and Then Tried to Sleep at Night** (Moritz Johner): scoped permissions, constrained PRs, approval gates, credential boundaries.
- **The Enterprise Agentic Gap: When Developer-Level AI Tools Hit Millions of Lines** (Dan Adler, Sourcegraph): failure modes for enterprise-scale migrations across code hosts.
- **Governance Is the Real Bottleneck to AI ROI** (David Hsu): visibility, guardrails, approvals, rollback.
- **Your Agent Didn't Fail. Your Harness Did.** (Vinoth Govindarajan): harness failure modes, run-receipt audits.
- **Your Agent Evolved. Your Evals Didn't.** (Ameya Bhatawdekar): SRE incident agent through six architecture generations.
- **Dual-Surface Architecture: Serving Humans and Agents from the Same Tool Layer** (Ethan Cha, Carlyle): governed MCP/API server, phased agent permissions.
- **Tethered: Our Agents Are Us** (Shu Fang, Two Sigma): per-employee remote agents with internal tool access and controls.
- **Evolution of agentic surfaces** (Anthropic): sandboxing, credentials, sessions, managed agents.
- **Build a Platform, Unleash an Agent on it… and Watch it Burn!**: agent vs Kubernetes governance stack (ArgoCD, Kyverno, Falco).
