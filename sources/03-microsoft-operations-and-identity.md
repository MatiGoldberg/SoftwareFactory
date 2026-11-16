# Microsoft: AI operations (SRE Agent, RCA) and agent identity

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase. arXiv items: abstract page only.

---

## [MS-SRE-BUILD] How we build and use Azure SRE Agent with agentic workflows

URL: https://techcommunity.microsoft.com/blog/appsonazureblog/how-we-build-and-use-azure-sre-agent-with-agentic-workflows/4508753
Publisher / authors / date: Microsoft Community Hub, Apps on Azure Blog ("Customer Zero" series); Shamir AbdulAziz; 2026-04-05 (updated 2026-04-09)

**Summary.** Azure SRE Agent watches production, investigates incidents, and performs RCA across logs, metrics, code changes, and deployment records. The team built it with an "agentic workflow": specialized agents across the SDLC from planning to operations (spec-driven planning and prototyping, code quality and security review, evaluation and deployment, operations). Autonomy is adjustable from assistive investigation to automated remediation proposals; humans approve under RBAC and escalation paths. Four lessons: build agents with agents; pair a generic memory-driven agent with specialized agents for well-defined incident types; integrate with existing tooling rather than replacing it; invest in continuous feedback and evaluation.

**Key practices & mechanisms**
- SDLC agent roles: "Plan & Code" (spec-driven development; PM/UX prototypes checked into staging), "Verify, Test & Deploy" (code quality, security, evaluation, deployment agents to shift left), "Operate & Optimize" (investigation, remediation).
- Self-maintenance: a dedicated instance of SRE Agent maintains SRE Agent and drives feedback loops.
- Governance: guardrails, human approval checks, RBAC, escalation paths.
- Integration via custom agents, MCP, Python tools, telemetry, incident platforms, repos, knowledge sources.
- Learns from past incidents, outcomes, and human feedback; specialized agents encode proven patterns for recurring incident categories.

**Numbers & evidence (self-reported, last nine months)**
- 35,000+ incidents handled autonomously; 50,000+ developer hours saved.
- Azure Container Apps: 89% positive responses to RCA results, covering >90% of incidents.
- Azure App Service: time-to-mitigation down to 3 minutes vs a 40.5-hour human-only average.

**Notable quotes**
- "building agents with agents"
- "Everything occurs within governance guardrails and human approval checks"

**PDLC stages:** requirements, spec, implementation, code review, testing, deployment, monitoring/incident, governance.

**Relevance:** concrete reference for per-stage agents with governance from day one; self-maintaining agent pattern; build on existing toolchains.

---

## [MS-SRE-GA] Announcing general availability for the Azure SRE Agent

URL: https://techcommunity.microsoft.com/blog/AppsonAzureBlog/announcing-general-availability-for-the-azure-sre-agent/4500682
Publisher / authors / date: Microsoft, Apps on Azure Blog; Mayunk Jain; 2026-03-10 (updated 2026-04-10)

**Summary.** GA of Azure SRE Agent, an "AI operations teammate". Preview showed the most effective agents were grounded in the team's own context, so GA loads source code, tools, and operational context up front. Adds Code Interpreter, memory that builds a knowledge base and can be taught, skills, subagents, Python tools, hooks, MCP connectors. Outcomes: faster RCA, knowledge reuse, automated mitigation under governance, standardized operations, proactive reliability.

**Key practices & mechanisms**
- Deep context preloaded: code, logs, metrics, traces, infra state, tools.
- Autonomy tiers: recommended actions → automated responses "within defined guardrails".
- Knowledge reuse: past resolutions and runbooks surfaced in real time; teams teach it directly.
- Feedback via thumbs up/down and GitHub issues.

**Numbers & evidence**
- Internal: 1,300+ agents deployed, 35,000+ incidents mitigated, 20,000+ engineering hours saved (different measure from the 50,000 figure above; do not merge).
- Ecolab: daily performance alerts from 30–40 to under 10.

**Notable quotes**
- "the most effective agents were those deeply grounded in their team's specific context."
- "Teams can choose how autonomous the agent should be"

**PDLC stages:** monitoring/incident, post-deploy validation, governance.

**Relevance:** tiered autonomy as approval-gate model; incident knowledge feeding the learning loop. Vendor figures.

---

## [MS-RCACOPILOT] Automatic Root Cause Analysis via Large Language Models for Cloud Incidents (RCACopilot)

URL: https://arxiv.org/abs/2305.15778
Publisher / authors / date: Microsoft (Chen, Xie, Ma, Kang, … Lin, Rajmohan, Zhang, Xu); arXiv 2023-05 (v4 2023-11); EuroSys 2024

**Summary.** RCACopilot matches each incident to a handler by alert type, automatically collects runtime diagnostics, then uses an LLM to predict the root-cause category with an explanatory narrative. Evaluated on one year of real Microsoft incidents. Diagnostic collection has run in production at Microsoft for over four years.

**Key practices & mechanisms**
- Alert-type routing to handlers; automated diagnostic aggregation; LLM classification + narrative for the on-call engineer.

**Numbers & evidence**
- RCA accuracy up to 0.766 on one year of Microsoft incidents.
- Diagnostic collection in production >4 years.

**Notable quotes**
- "RCACopilot achieves RCA accuracy up to 0.766"
- manual RCA steps "are often laborious, error-prone, and challenging for on-call engineers"

**PDLC stages:** monitoring/incident.

**Relevance:** published baseline for LLM incident triage; handler-per-alert-type is a reusable automated-runbook pattern.

---

## [MS-ENTRA-AGENTID] What are agent identities? (Microsoft Entra Agent ID)

URL: https://learn.microsoft.com/en-us/entra/agent-id/what-are-agent-identities
Publisher / authors / date: Microsoft Learn; 2025-11-06 (updated 2026-06-15)

**Summary.** Agent identities are Entra ID identity accounts that uniquely identify and authenticate AI agents, because agents fit neither human nor application identity models. An agent = model + orchestration loop + memory + tools. Agent identities let you distinguish agent operations, give right-sized access, block access to critical roles, and scale to agents created and destroyed often. Can be paired one-to-one with an "agent user" account where a user identity is needed. Used by the Entra conditional-access optimization agent and Copilot Studio agents.

**Key practices & mechanisms**
- Access modes: token-based access to web services; autonomous access with rights on the agent identity; delegated access on behalf of a user; authenticating inbound requests with Entra tokens.
- Lifecycle: bulk creation, consistent policy, retirement without orphaned credentials/permissions.
- Auditability: activity logged as performed by an agent.
- Sponsorship: the creating user is recorded as the agent's sponsor.

**Numbers & evidence.** None (licensing via Microsoft Agent 365).

**Notable quotes**
- "Agents can act autonomously, using access rights given directly to the agent identity."
- "The identity model is designed for scale and ephemerality rather than permanence."

**PDLC stages:** governance/security, deployment.

**Relevance:** each factory agent gets its own least-privilege, auditable, sponsor-owned identity; autonomous vs delegated access maps to pipeline agents acting for developers; key building block for S2S trust.

---

## [EXT-DEPUTYDEV] Intuition to Evidence: Measuring AI's True Impact on Developer Productivity

URL: https://arxiv.org/abs/2509.19708
Publisher / authors / date: Kumar, Khare, Sharma et al.; arXiv 2025-09-24. **Not a Microsoft or frontier-lab study** (in-house platform "DeputyDev" at an enterprise; affiliation not shown on abstract). Kept as secondary evidence only.

**Summary.** Year-long production evaluation of 300 engineers using an in-house platform combining code generation and automated code review. Cohort analysis reports statistically significant gains.

**Numbers & evidence**
- 31.8% reduction in PR review cycle time; 85% satisfaction with review features; 93% want to continue.
- Adoption 4% (month 1) → 83% peak (month 6) → 60% steady.
- Top adopters +61% code to production; tool contributed ~30–40% of shipped code; +28% shipment volume overall.

**Relevance:** realistic adoption curve and review-cycle benchmark; single-company, self-reported.
