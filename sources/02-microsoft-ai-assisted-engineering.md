# Microsoft / GitHub: AI code review, agentic platform, Copilot coding agent in practice

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase.

---

## [MS-AICR] Enhancing Code Quality at Scale with AI-Powered Code Reviews

URL: https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/
Publisher / authors / date: Engineering@Microsoft; Sneha Tuli (Principal PM); 2025-07-14

**Summary.** Internal AI review assistant joins every PR as an automatic reviewer. Started as an experiment; now supports >90% of PRs company-wide (>600K PRs/month). Built with DevDiv Data & AI; learnings fed GitHub's AI code review product. Motivation: humans spent time on low-value comments while architecture and security issues were missed; some PRs waited days or weeks. Leaves categorized line comments, proposes fixes the author must explicitly apply, generates PR summaries, answers reviewer questions in-thread. Repos can add guidelines and custom review prompts (e.g., regressions based on historical crash patterns).

**Key practices & mechanisms**
- Runs automatically on PR creation; comments in the normal PR thread.
- Categories (exception handling, null check, sensitive data…).
- Suggested fixes never auto-committed; author clicks to apply; commits attributed.
- "Ask the AI" in-PR Q&A; auto PR summaries.
- Per-repo custom prompts for specialized checks (e.g., flight and change gates).

**Numbers & evidence**
- >90% of PRs, >600K PRs/month, 5,000 repos onboarded.
- 10–20% median PR completion time improvement (early experiments; method not detailed).

**Notable quotes**
- "When AI suggests code changes, it does not commit them directly."
- "All changes are attributed to the commit history, preserving accountability and transparency."

**PDLC stages:** code review, implementation, governance.

**Relevance:** AI as first-class reviewer with human-in-the-loop apply — usually the second agentification step after coding; per-repo prompts encode org-specific gates.

---

## [MS-AGENTIC-PLATFORM] Learn from Microsoft: Transform software development through an agentic platform

URL: https://developer.microsoft.com/blog/learn-from-microsoft-transform-software-development-through-an-agentic-platform/
Publisher / authors / date: Microsoft for Developers; Poonam Gupta (Partner Director of PM, 1ES and Azure DevOps); 2026-06-25. Opens the "Customer Zero" series.

**Summary.** Microsoft moved from a "software factory" vision to an "AI and agent factory" (previewed at Ignite 2025) where agents collaborate across the lifecycle. Four goals: rearchitect the lifecycle with agentic workflows; agents as side-by-side collaborators; security, compliance, governance built into the engineering platform; better developer experience. Specs are the single source of truth that agents and pipelines follow, turning standards into auditable automation. Toil (security fixes, framework upgrades) is delegated to agent tasks; features split into agent-driven PRs. Innersource sharing of agents.

**Numbers & evidence (as stated; several from linked posts)**
- >90% of Microsoft developers use GitHub Copilot.
- AI code review on 90% of PRs, >10% faster completion.
- 62% say AI increased job satisfaction; 88% report higher throughput (arXiv 2508.00178).
- >50,000 developer hours saved with Azure SRE Agent.
- 80–90% accuracy migrating hundreds of repos (Entra SDK migration).
- 55% reduction in manual toil via specialized agents (1ES; not independently verified — 1ES post requires sign-in).

**Notable quotes**
- "treating specs as a single source of truth to define what we're building"
- "turns intent (the standards, best practices, and non-negotiables) into repeatable, auditable automation."
- "Central to our transformation is delegating toil to agents."

**PDLC stages:** all, from ideation to incident and governance.

**Relevance:** Microsoft's own framing of the target state; directly applicable vocabulary and programs (1ES) for Mati.

---

## [MS-CCA-DOTNET] Ten Months with Copilot Coding Agent in dotnet/runtime

URL: https://devblogs.microsoft.com/dotnet/ten-months-with-cca-in-dotnet-runtime/
Publisher / authors / date: .NET Blog; Stephen Toub (Distinguished Engineer); 2026-03-23. Data 2025-05-19 → 2026-03-22. (Later sections read via summary only; marked.)

**Summary.** Ten months of GitHub Copilot Coding Agent (CCA) in a large, critical codebase, with the team keeping full ownership and standards. 878 CCA PRs (535 merged): 67.9% success vs 87.1% for Microsoft human PRs — different populations, directional only. Revert rate 0.6% (CCA) vs 0.8% (others), not statistically meaningful. Success rose from 41.7% in month one to ~71% recently. Many PRs target long-standing backlog. Well-scoped tasks succeed more than large vague ones; CCA strong at well-specified implementation and investigation, weaker at architecture. Copilot Code Review runs on every PR.

**Key practices & mechanisms**
- Every CCA PR is created at the explicit request of a maintainer; "CCA cannot open PRs on its own."
- Same AI reviewer on staff, CCA, and community PRs.
- Issues filed specifically for CCA; some community issues routed to CCA same day (median 2.7 h).
- Human review rounds with feedback.
- (summary) copilot-instructions.md and environment setup raised success; encode build/test conventions.

**Numbers & evidence**
- 878 PRs, 535 merged; +95K / −31K lines. Across 7 .NET repos: 2,963 PRs, 1,885 merged (68.6%).
- Success: human-MS 87.1%, community 79.7%, CCA 67.9%, bots 85.9%.
- Reverts: 3/535 CCA vs 33/4,251 non-CCA.
- Tests are 65.7% of CCA-added lines vs 49.9% for humans.
- By size: 1–10 lines 80.0%; 101–500 lines 64.0%.
- (summary, unverified) cleanup 84.7%, testing 75.6%, refactoring 69.7%, bug fixes 69.4%, performance 54.5%; PRs with human-pushed commits 86.2% vs 55.1%.

**Notable quotes**
- "The .NET team has full ownership for everything we ship."
- "CCA is excellent at implementing well-specified changes"

**PDLC stages:** requirements (triage), implementation, code review, testing, governance, post-merge quality.

**Relevance:** the best public, honest dataset on a coding agent in a critical Microsoft repo; supports routing bounded, well-specified work to agents and tracking success-by-task-type and revert rate as trust metrics. Compute/CI costs unmeasured.

---

## [GH-APPLIEDSCI] Agent-driven development in Copilot Applied Science

URL: https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/
Publisher / authors / date: The GitHub Blog; Tyler McGoffin; 2026-03-31

**Summary.** Built "eval-agents" (analyzes coding-agent trajectories on TerminalBench2, SWEBench-Pro) with Copilot CLI + Claude Opus 4.6, making agents the main contribution path. Lessons: verbose conversational prompts, plan before acting; keep architecture agent-navigable (refactor, document, test often); "blame process, not agents". Guardrails: strict typing, linters, integration/E2E/contract tests agents can run; a reserved test area only humans can change. Loop: /plan → /autopilot → Copilot Code Review until no relevant comments → human review.

**Key practices & mechanisms**
- Human-only contract-test space so agents can't edit tests to fit code.
- Weekly scheduled /plan sweeps for missing tests, dead code, duplication, doc gaps; update copilot-instructions.md.
- When an agent errs, add tests or prompts so it can't repeat it.

**Numbers & evidence.** Five new contributors shipped 11 agents, 4 skills, a new workflow concept in <3 days; +28,858 / −2,884 lines across 345 files (self-reported).

**Notable quotes**
- "if you want your agent to act like an engineer, treat it like one"
- "blame process, not agents."

**Relevance:** reusable plan → build → AI review → human review template; protected test oracle as a trust control.

---

## Not retrieved
- "How Microsoft 1ES uses agentic AI to take on security and …" (techcommunity …/4515191) — redirects to Microsoft sign-in. Mati may be able to open it internally.
