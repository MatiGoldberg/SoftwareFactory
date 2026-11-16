# Software Factory research: source index (Phase 1)

Collected 2026-11-14 (Phase 1 + gap passes 1b and 1c). 84 sources read (31 Microsoft/GitHub), including 15 detailed AI Engineer conference talks (file 14). Full texts read for Gandalf, Google migrations, and Meta release risk (file 10). Each source has a structured note (summary, mechanisms, numbers, verbatim quotes, PDLC stages, enterprise relevance) in `sources/`. IDs in brackets are used for citations in later documents.

Evidence grade: **A** = peer-reviewed or measured production data with method; **B** = company engineering post with production numbers but little method; **C** = guidance, product docs, or anecdote.

## Microsoft and GitHub (priority)

| ID | Title | Publisher, date | Grade | Note file |
|---|---|---|---|---|
| MS-SDP-LEARN | Safe deployment practices | Microsoft Learn, 2022 | C | 01 |
| MS-SDP-BLOG | Advancing safe deployment practices | Azure Blog (Russinovich), 2020 | B | 01 |
| MS-WAF-SDP | Architecture strategies for safe deployment (WAF OE:11) | Microsoft Learn, 2026 | C | 01 |
| MS-GANDALF-BLOG | Advancing safe deployment with AIOps: Gandalf | Azure Blog, 2021 | B | 01 |
| MS-GANDALF-NSDI | Gandalf: analytics service for safe deployment | USENIX NSDI '20 | A | 01 |
| MS-AICR | Enhancing code quality at scale with AI-powered code reviews | Engineering@Microsoft, 2025 | B | 02 |
| MS-AGENTIC-PLATFORM | Learn from Microsoft: transform software development through an agentic platform (1ES, Customer Zero) | Microsoft for Developers, 2026 | B | 02 |
| MS-CCA-DOTNET | Ten months with Copilot Coding Agent in dotnet/runtime | .NET Blog (Toub), 2026 | A- | 02 |
| GH-APPLIEDSCI | Agent-driven development in Copilot Applied Science | GitHub Blog, 2026 | C | 02 |
| MS-SRE-BUILD | How we build and use Azure SRE Agent with agentic workflows | Microsoft Tech Community, 2026 | B | 03 |
| MS-SRE-GA | Announcing GA for Azure SRE Agent | Microsoft Tech Community, 2026 | C | 03 |
| MS-RCACOPILOT | Automatic RCA via LLMs for cloud incidents (RCACopilot) | Microsoft / EuroSys '24 | A | 03 |
| MS-ENTRA-AGENTID | What are agent identities? (Entra Agent ID) | Microsoft Learn, 2025–26 | C | 03 |
| MS-SPEC | Spec-driven development with GitHub Spec Kit | Microsoft for Developers, 2025 | C | 04 |
| GH-AGENTIC | Beyond code generation: a developer's guide to agentic engineering | GitHub Blog, 2026-11 | C | 04 |
| MS-IT-ADO | Reclaiming engineering time with AI in Azure DevOps | Microsoft Inside Track, 2026 | C | 04 |
| MS-IT-AINATIVE | Powering the new age of AI-led engineering in IT | Microsoft Inside Track, 2026 | C | 04 |
| MS-MI-BESTPRACTICE | Best practice recommendations for managed identities | Microsoft Learn, 2025–26 | C | 09 |
| MS-WIF | Workload identity federation | Microsoft Learn, 2025–26 | C | 09 |
| MS-IT-SECURE-AGENTS | Securing AI agents in the enterprise: learnings from our journey | Microsoft Inside Track, 2026 | B | 09 |
| MS-SFI | Secure Future Initiative overview (pillar 4: protect engineering systems) | Microsoft Learn, 2026 | C | 09 |
| MS-WIN-RESILIENCY | Taking steps that drive resiliency and security for Windows customers (post-CrowdStrike SDP) | Windows Blog, 2024 | C | 09 |
| MS-AKS-FLEET | AKS Fleet Manager: staged updates across multiple clusters | Microsoft Learn, 2026 | C | 12 |
| MS-ENTRA-AGENT-OBO | Entra Agent ID: on-behalf-of flow for agents | Microsoft Learn, 2025–26 | C | 12 |
| MS-ENTRA-AGENT-PROTOCOLS | Entra Agent ID: authentication protocols (delegated, autonomous, agent user) | Microsoft Learn, 2026 | C | 12 |
| MS-CA-AGENTS | Conditional Access for agents | Microsoft Learn, 2026 | C | 12 |
| MS-AZURE-BREAKING-CHANGES | Azure's approach to versioning and avoiding breaking changes | Azure SDK Blog, 2023 | B | 13 |
| MS-API-GUIDELINES | Azure REST API guidelines: considerations for service design | Microsoft (GitHub), 2024 | C | 13 |
| MS-HOW-MSFT-DEVOPS | How Microsoft develops with DevOps (release flow, rings, repo strategy) | Microsoft Learn, 2022 | B | 13 |
| MS-IT-COMPLIANT-ENG | Enabling secure and compliant engineering with Azure DevOps (service catalog drives compliance) | Microsoft Inside Track, 2020 | B | 13 |
| AIE-MSFT-SUBAGENTS | Your sub-agents are a distributed system (SAFE handoffs) | AI Engineer talk, Microsoft engineer | B | 14 |
| MS-AZ-SERVICE-GROUPS | What are Azure Service Groups? (cross-subscription service grouping, preview) | Microsoft Learn, 2025–26 | C | 15 |
| MS-ARG-CHANGES | Get resource changes (Azure Resource Graph change analysis) | Microsoft Learn, 2024–26 | C | 15 |
| MS-IT-SCREAM-TEST | From "Scream Test" to lifecycle management (ARG → Service 360 action items) | Microsoft Inside Track, 2025 | B | 15 |
| GH-SERVICEOWNERS | How we organize and get things done with SERVICEOWNERS | GitHub Blog, 2023 | C | 15 |

## Anthropic

| ID | Title | Date | Grade | Note file |
|---|---|---|---|---|
| AN-TEAMS | How Anthropic teams use Claude Code | 2025 | C | 05 |
| AN-HARNESS-1 | Effective harnesses for long-running agents | 2025 | B | 05 |
| AN-HARNESS-2 | Harness design for long-running application development | 2026 | B | 05 |
| AN-WORK | How AI is transforming work at Anthropic (survey + 200K transcripts) | 2025 | A- | 05 |
| AN-BESTPRACTICES | Best practices for Claude Code | current | C | 05 |
| AN-AGENTS | Building effective agents | 2024 | C | 05 |

## OpenAI and Google

| ID | Title | Date | Grade | Note file |
|---|---|---|---|---|
| OAI-HARNESS | Harness engineering: leveraging Codex in an agent-first world | 2026 | B | 06 |
| OAI-CODEX-USE | How OpenAI uses Codex | n.d. | C | 06 |
| GOOG-AISE | AI in software engineering at Google: progress and the path ahead | 2024 | B | 06 |
| GOOG-MIGRATIONS | How is Google using AI for internal code migrations? (full text) | 2025 | B+ | 06, 10 |
| DORA-2025 | 2025 DORA State of AI-assisted Software Development (blog summary) | 2025 | A | 06 |
| DORA-AICM | DORA AI Capabilities Model (7 capabilities) | 2025 | A | 10 |
| GOOG-SRE-CANARY | Canarying Releases (SRE Workbook) | 2018 | B | 06 |
| GOOG-LSC | Large-Scale Changes (Software Engineering at Google, ch. 22) | 2020 | B | 10 |
| GOOG-OWNERS | Code Review: OWNERS files (Software Engineering at Google, ch. 9) | 2020 | B | 15 |

## Meta, Stripe, Spotify, AWS

| ID | Title | Date | Grade | Note file |
|---|---|---|---|---|
| META-ACH | Mutation-guided LLM-based test generation at Meta | FSE '25 | A | 07 |
| META-DRS | Diff Risk Score: AI-driven risk-aware software development | 2025 | B | 07 |
| STRIPE-MINIONS | Minions: Stripe's one-shot, end-to-end coding agents (Parts 1–2) | 2026 | B | 07 |
| SPOTIFY-HONK-1 | 1,500+ PRs later: Spotify's background coding agent (Honk, Part 1) | 2025 | B | 07 |
| SPOTIFY-CONSTRAINT | Coding is no longer the constraint (Code with Claude 2026) | 2026 | B | 07 |
| AWS-HANDSOFF | Automating safe, hands-off deployments (Builders' Library) | 2020 | B | 07 |
| META-RELEASE-RISK | Moving faster and reducing risk: using LLMs in release deployment | Meta, 2024 | A | 10 |
| META-CONFIG-SAFETY | Trust but canary: configuration safety at scale (podcast page) | Meta, 2026 | C | 10 |
| SPOTIFY-HONK-2 | Background coding agents: context engineering (Honk 2) | 2025 | B | 08 |
| SPOTIFY-HONK-3 | Background coding agents: strong feedback loops (Honk 3) | 2025 | B | 08 |
| SPOTIFY-HONK-4 | Background coding agents: downstream dataset migrations across owning teams (Honk 4) | 2026 | B | 08 |
| SPOTIFY-ANTHROPIC-LIVE | Let's talk agentic development: Spotify x Anthropic live | 2026 | C | 08 |
| SPOTIFY-BACKSTAGE-CATALOG | Backstage Software Catalog overview (catalog-as-code) | current / 2020 | C | 15 |
| SPOTIFY-BACKSTAGE-DESCRIPTOR | Backstage descriptor format (owners, dependsOn/dependencyOf, APIs) | current | C | 15 |
| SPOTIFY-BACKSTAGE-INGESTION | Backstage entity providers, processing, orphaning (Life of an Entity) | current | C | 15 |

## Enterprise transformations to AI-first (gap pass 1b)

| ID | Title | Publisher, date | Grade | Note file |
|---|---|---|---|---|
| SHOPIFY-PLAYBOOK | Inside Shopify's AI-first engineering playbook | BVP interview with Shopify's Head of Eng, 2026 | C | 11 |
| UBER-UREVIEW | uReview: scalable, trustworthy GenAI for code review | Uber Engineering, 2025 | B | 11 |
| UBER-AISTACK | How Uber uses AI for development (partly paywalled) | Pragmatic Engineer, 2026 | B | 11 |
| AIRBNB-MIGRATION | Accelerating large-scale test migration with LLMs | Airbnb Tech Blog, 2025 | B | 11 |
| AMAZON-Q-JAVA | Amazon Q Java upgrades: 4,500 developer-years (Jassy quote) | 2024 | C | 11 |
| SPOTIFY-QCON-2026 | Rewriting all of Spotify's code base, all the time | InfoQ / QCon London, 2026 | B | 11 |
| EMBEDDED-AIFIRST-ROADMAP | Developing a roadmap to an AI-first organization (embedded-software company) | Gothenburg/Chalmers, arXiv 2026 | B | 11 |

## Other enterprise and zero-trust sources (gap pass 1c)

| ID | Title | Publisher, date | Grade | Note file |
|---|---|---|---|---|
| GOOG-BEYONDPROD | BeyondProd: zero trust between microservices | Google Cloud, 2019/2026 | B | 12 |
| MCP-AUTHZ | MCP authorization spec (OAuth 2.1, audience-bound tokens) | MCP project, draft | C | 12 |
| AWS-ROLLBACK-SAFETY | Ensuring rollback safety during deployments (two-phase deploys) | Amazon Builders' Library, 2019 | B | 13 |
| ATLASSIAN-AGENT-LOOPS | Governed agent loops for the AI-native SDLC | Atlassian, 2026 | C | 13 |
| MABL-75-REPOS | AI agents shipping code across 75+ repos (vendor, 25 engineers) | mabl, 2026 | C | 13 |
| NETFLIX-SERVICE-TOPOLOGY | Netflix real-time Service Topology from eBPF flows, IPC metrics, traces (via InfoQ) | InfoQ on Netflix TechBlog, 2026 | B | 15 |

## AI Engineer conference talks (gap pass 1c; library pages carry full essays)

| ID | Title | Speaker org | Detail | Note file |
|---|---|---|---|---|
| AIE-UBER-SDLC | Agentic SDLC at Uber: building blocks for Uber's software factory | Uber | high | 14 |
| AIE-UBER-MERGE | AI writes code faster than Uber can merge it | Uber | high | 14 |
| AIE-META-ONCALL | Give your on-call its own AI teammate (per-action autonomy) | Meta | high | 14 |
| AIE-BOOKING-ROI | Building AI agents with real ROI in the enterprise SDLC | Booking.com, Sourcegraph | high | 14 |
| AIE-DUOLINGO-TESTS | 225,000 lines of tests, written and merged by agents | Duolingo | high | 14 |
| AIE-MAERSK-MAINTAIN | Agents made code free; maintaining it didn't get cheaper | Maersk | high | 14 |
| AIE-AGENT-READY | Making codebases agent-ready (eight verification pillars) | Factory | high | 14 |
| AIE-LEGACY-BENCH | Benchmarking coding agents on new vs legacy codebases | Wisedocs | high | 14 |
| AIE-MULTIPLAYER-FACTORY | Your team's agents are all shipping to the same code at once | Tessl | high | 14 |
| AIE-LINEAR-CONTEXT | What your coding agent can't see in the code | Linear | high | 14 |
| AIE-MERGE-BOTTLENECK | Merge is the bottleneck | Vorflux | high | 14 |
| AIE-PROVE-TESTS | Your PR says the tests passed. Prove it. | Neo4j | high | 14 |
| AIE-ALWAYS-ON-OPS | Always-on agents run production without the on-call tax | Resolve AI | medium | 14 |
| AIE-AGENT-ARCHAEOLOGY | Stop doing agent archaeology on your team's code | Delta/Zed | medium | 14 |

Plus ~12 relevant World's Fair 2026 sessions with abstracts only, listed at the end of file 14.

## Secondary (not a frontier company)

| ID | Title | Grade | Note file |
|---|---|---|---|
| EXT-DEPUTYDEV | Intuition to Evidence: measuring AI's true impact on developer productivity (300 engineers, 1 year) | B | 03 |

## Not retrieved (skipped)

- **1ES** agentic-security post: requires Microsoft sign-in; skipped at Mati's request.
- **TechRepublic** "AI coding agents lift PRs by 24%": site blocks automated reads.

## Coverage by PDLC stage

● = primary focus, ○ = touched

| Stage | Microsoft / GitHub | Others |
|---|---|---|
| Ideation, requirements | ○ MS-IT-ADO, ○ GH-AGENTIC, ○ MS-AGENTIC-PLATFORM | ○ AN-BESTPRACTICES (interview → spec), ○ SPOTIFY-HONK-1 (intake agent) |
| Spec, design | ● MS-SPEC, ○ MS-AGENTIC-PLATFORM | ● OAI-HARNESS (docs as system of record), ● AN-HARNESS-2 (planner, sprint contracts) |
| Implementation | ● MS-CCA-DOTNET, ○ GH-APPLIEDSCI | ● STRIPE-MINIONS, ● SPOTIFY-HONK-1, ● OAI-HARNESS, ● AN-HARNESS-1, ○ GOOG-MIGRATIONS |
| Code review | ● MS-AICR | ○ GOOG-AISE, ○ AN-HARNESS-2 (evaluator), ○ SPOTIFY-CONSTRAINT (review triage) |
| Testing, validation | ○ GH-APPLIEDSCI (protected tests) | ● META-ACH, ○ AN-HARNESS-1/2 (E2E via browser) |
| Risk assessment | | ● META-DRS |
| Deployment | ● MS-SDP-BLOG, ● MS-WAF-SDP, ○ MS-SDP-LEARN | ● AWS-HANDSOFF, ● GOOG-SRE-CANARY |
| Post-deploy validation | ● MS-GANDALF-NSDI / BLOG | ○ GOOG-SRE-CANARY |
| Monitoring, incident | ● MS-SRE-BUILD, ● MS-RCACOPILOT, ○ MS-SRE-GA | ○ AN-TEAMS |
| Governance, identity, trust | ● MS-ENTRA-AGENTID, ○ MS-AGENTIC-PLATFORM | ○ STRIPE-MINIONS (sandbox isolation), ○ AN-WORK (delegation, supervision) |
| Org adoption, measurement | ○ MS-IT-AINATIVE | ● DORA-2025, ● AN-WORK, ○ SPOTIFY-CONSTRAINT |

## Enterprise complexity: where the evidence now sits

| Complexity | Best sources |
|---|---|
| Many repos, many owning teams | MS-IT-COMPLIANT-ENG (service catalog → repos → owners → gates), MS-HOW-MSFT-DEVOPS (owner reviewers, mono vs multi-repo), SPOTIFY-HONK-4, GOOG-LSC, GOOG-MIGRATIONS, AIE-UBER-SDLC (mega DevPod, context graph), MABL-75-REPOS (coordination graph, release order), AIE-MULTIPLAYER-FACTORY, AIE-LEGACY-BENCH (repo consolidation enabled E2E tests) |
| Cross-service contracts and compatibility | MS-AZURE-BREAKING-CHANGES (spec repo + diff tool + review board), MS-API-GUIDELINES, AWS-ROLLBACK-SAFETY (two-phase deploys, upgrade-downgrade tests), AWS-HANDSOFF (zeta stage), AIE-MULTIPLAYER-FACTORY (semantic conflicts) |
| Heterogeneous builds, pipelines, clusters | SPOTIFY-HONK-2/3, SPOTIFY-QCON-2026 (separate agent and verification runtimes), MS-AKS-FLEET (staged multi-cluster updates), MS-SDP-BLOG, AIE-UBER-MERGE (merge queue under AI load) |
| S2S trust and auth, agent identity | MS-WIF, MS-MI-BESTPRACTICE, MS-ENTRA-AGENTID, MS-ENTRA-AGENT-OBO, MS-ENTRA-AGENT-PROTOCOLS, MS-CA-AGENTS, MS-IT-SECURE-AGENTS, MS-SFI, GOOG-BEYONDPROD, MCP-AUTHZ, AIE-UBER-SDLC (SPIRE identity at gateway) |
| Config and content changes | MS-WIN-RESILIENCY, MS-WAF-SDP, AWS-HANDSOFF, META-CONFIG-SAFETY |
| Risk-based gating and autonomy | META-DRS, META-RELEASE-RISK, MS-GANDALF-NSDI, AIE-META-ONCALL (per-action autonomy promotion) |
| Org transformation and adoption | SHOPIFY-PLAYBOOK, UBER-AISTACK, AIE-BOOKING-ROI, EMBEDDED-AIFIRST-ROADMAP, MS-IT-AINATIVE, DORA-AICM, AN-WORK |

## Remaining known gaps

1. **Consumer-driven contract testing at scale**: still no frontier-company write-up. Azure's breaking-change governance (spec diff + review board) and AWS's two-phase deploy and upgrade-downgrade testing cover the compatibility problem from the provider side.
2. **Requirements clarification agents** ("grill the owner"): documented as practice (AN-BESTPRACTICES interview → spec, MS-IT-ADO, SPOTIFY-HONK-1 intake agent) but with no measured results.
3. **Contradiction to note**: Spotify's Part 3 (Dec 2025) relies on an LLM judge (~25% veto rate), while the QCon talk (Mar 2026) says the judge was removed as models improved. Consistent with AN-HARNESS-2's advice to re-test every harness component on each new model.
