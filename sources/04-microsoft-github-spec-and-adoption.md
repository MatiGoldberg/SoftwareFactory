# Microsoft / GitHub: spec-driven development, agentic engineering, internal adoption

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase.

---

## [MS-SPEC] Diving Into Spec-Driven Development With GitHub Spec Kit

URL: https://developer.microsoft.com/blog/spec-driven-development-spec-kit/
Publisher / authors / date: Microsoft for Developers; Den Delimarsky (Principal Product Engineer); 2025-09-15

**Summary.** Introduces GitHub Spec Kit, an open-source toolkit for spec-driven development (SDD) that makes technical decisions explicit before AI agents write code. Contrasts SDD with waterfall PRDs: specs are living documents that evolve with code. The Specify CLI bootstraps templates and helper scripts. Three slash commands (/specify, /plan, /tasks) move from "what and why" to technical plan to agent-executable tasks. A `constitution.md` holds non-negotiable project principles the plan must obey. Presented as an experiment; scaffolding meant to be adapted per organization.

**Key practices & mechanisms**
- `specify init` generates `.specify` templates, bash/PowerShell scripts, and agent prompt files under `.github`.
- /specify (explicitly no technical decisions) → /plan (frameworks, libraries, data contracts, quickstart) → /tasks (phased chunks an agent can execute).
- `constitution.md` = project-level non-negotiables; can define org-wide "opinionated stacks".
- All work on one feature branch; spec, plan, and data contracts cross-referenced.
- Specs are plain Markdown in a `specs/` folder, reviewed by humans or the agent.
- Multi-variant implementation from one spec (e.g., Rust vs Go; different Figma mocks via Figma MCP).

**Numbers & evidence.** None; illustrative scenario only (notification feature, conflicting assumptions across PM/backend/frontend/design).

**Notable quotes**
- "SDD is about making your technical decisions explicit, reviewable, and evolvable."
- "Think of it as version control for your thinking."

**PDLC stages:** requirements, spec, design, implementation, governance (constitution).

**Relevance:** constitution.md maps to an org policy layer every spec/plan must satisfy; spec→plan→tasks with cross-referenced artifacts gives traceability. Caveat: benefits asserted, not measured.

---

## [GH-AGENTIC] Beyond code generation: A developer's guide to agentic engineering

URL: https://github.blog/ai-and-ml/github-copilot/beyond-code-generation-a-developers-guide-to-agentic-engineering/
Publisher / authors / date: The GitHub Blog; Nick Liffen, Philip Holleran; 2026-11-06

**Summary.** AI sped up writing code but not the surrounding work, so the bottleneck moved to planning, review, and production investigation. Organizes agentic engineering into Plan → Build → Verify → Observe and maps Copilot features to each. Plan: Copilot in Slack/Teams, issues with acceptance criteria, plan mode with human approval before implementation. Build: cloud sandboxes, isolated repo copies per task, repo instructions and shared memory. Verify: stacked PRs, code quality, AI code review, AI security scanning, license checks, agents fixing failing checks. Observe: investigate production issues via connectors, turn findings into issues and regression tests. Product-led (vendor marketing).

**Key practices & mechanisms**
- Plan Mode: compare approaches, human approves plan before handoff; issues with acceptance criteria; agentic labeling and complexity estimation; low-complexity tasks assigned directly to Copilot.
- Build: execution in cloud sandboxes; isolated working copy per session; repository instructions with conventions and validation commands; shared memory and "Copilot Dreaming" (reviews sessions and PR feedback to propose instruction/skill updates); per-task model and effort selection; enterprise managed settings.
- Verify: stacked PRs; GitHub Code Quality; Copilot code review with per-PR depth; AI Scan and AI secret detection beyond CodeQL; license compliance and package firewall; Agentic Autofix; Agent Merge (fixes failing checks, review comments, conflicts; can auto-merge once verification passes if configured).
- Observe: connectors (e.g., Fabric) to see affected requests/customers; draft issues with evidence + regression test; lessons fed back to memory.

**Numbers & evidence**
- >1.2 billion commits on GitHub in one week in October 2026, "over 400% more than a year earlier".
- Cites Faros AI: PRs spent 441% longer in review going from low to high AI adoption (not independently verified).

**Notable quotes**
- "Writing code got faster. The work around it didn't."
- "That review queue is the 441% in practice."
- "Start with something that frustrates you most this week and put an agent on it."

**PDLC stages:** requirements, spec, implementation, code review, testing, deployment (auto-merge), monitoring, governance.

**Relevance:** Plan/Build/Verify/Observe with human plan approval is a usable gate model; per-task isolation and managed settings are enterprise controls; production→memory feedback loop closes the cycle (vendor claim, no independent evidence).

---

## [MS-IT-ADO] Reclaiming engineering time with AI in Azure DevOps at Microsoft

URL: https://www.microsoft.com/insidetrack/blog/reclaiming-engineering-time-with-ai-in-azure-devops-at-microsoft/
Publisher / authors / date: Microsoft Inside Track (Microsoft Digital); Diana Mivelli; 2026-04-16 (updated 2026-10-26)

**Summary.** Microsoft Digital's Engineering Systems Platform team embedded AI into Azure DevOps. Users spent time on repetitive admin (creating/breaking down work items, reporting queries, reclaiming permissions). Built two agents: DevOps Assistant (side-panel chat; specialized agents coordinated by an Orchestrator Agent in Copilot Studio) and AI Work Item Assistant (inline, on Microsoft Foundry). Principles: stay in context, preserve user control, inherit existing ADO permissions. Central claim: AI should enforce structure and quality at the start (work items with acceptance criteria) so downstream tools like Copilot produce better code.

**Key practices & mechanisms**
- Specialist agents: Work Item, Knowledge Board, Permission, Bulk Complete, Sprint Board; an Orchestrator routes tasks.
- Inline "Use AI to edit this item"; generates child items and sprint-ready breakdowns.
- Three loops: upstream quality amplification, execution acceleration, capacity reinvestment.
- Target high-effort, high-volume tasks first; validate with measured data.

**Numbers & evidence**
- Team supports 15,000 active users.
- Breaking stories into 100+ tasks for an 8-engineer team: from an hour+ to "less than three minutes". No other before/after data.

**Notable quotes**
- "Validate productivity with measurable data, not intuition."
- "Capacity saving keeps giving back, in a loop."

**PDLC stages:** requirements, spec, planning, governance (permission-aware).

**Relevance:** supports an intake-quality gate (acceptance criteria) feeding agents; orchestrator + specialists inheriting user permissions is an enterprise pattern.

---

## [MS-IT-AINATIVE] Powering the new age of AI-led engineering in IT at Microsoft

URL: https://www.microsoft.com/insidetrack/blog/powering-the-new-age-of-ai-led-engineering-in-it-at-microsoft/
Publisher / authors / date: Microsoft Inside Track (Microsoft Digital); Jason Kellington; 2026-03-05 (updated 2026-08-15)

**Summary.** Microsoft Digital's IT engineering org adopted generative AI in five phases: awareness and access, culture shift, upskilling and role evolution, embedding AI across the lifecycle, eliminating toil. No top-down mandates, quotas, or forced adoption metrics; safe low-risk experimentation first. Defines the "AI-native engineer": routine work delegated to AI, judgment/design/accountability stay with people. AI outputs are reviewed, tested, validated like any other input. Toil reduction drove adoption more than any feature. Measurement shifted from usage to impact on flow, rework, incident and recovery times.

**Key practices & mechanisms**
- Phased adoption; low-risk tasks first (doc summaries, test-case generation, exploring unfamiliar code).
- AI for drafting requirements, design reasoning, code review with system context, test generation, defect analysis.
- Ops: incident summaries, cross-system signal analysis, ML on logs for earlier anomaly detection; agent-assisted network troubleshooting.
- Measure impact (design-cycle speed, earlier defect detection, shorter incident resolution, less rework), with role-specific definitions of value.

**Numbers & evidence.** None quantitative.

**Notable quotes**
- "Toil reduction is the biggest thing."
- "Embedding AI wasn't just a technical exercise. It was a systems change."
- "Measure impact where engineers feel it."

**PDLC stages:** requirements, design, implementation, testing, code review, monitoring/incident, governance.

**Relevance:** "measure impact, not usage" for factory KPIs; human accountability gates retained; an org-change maturity model rather than ROI evidence.

---

## Not retrieved
- TechRepublic, "Microsoft Study Finds AI Coding Agents Lift Pull Requests by 24%" (https://www.techrepublic.com/article/news-ai-coding-agents-microsoft-pull-requests/) — site refused automated fetch. Original study still to be located.
