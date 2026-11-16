## Appendix A: Glossary

Terms as this document uses them. The last column names the section that defines or first explains each one; Appendix B resolves the citation codes.

| Term | Plain-English definition | Defined in |
|---|---|---|
| Act on approval (L2) | Rung at which the agent carries out an action after one explicit human approval, such as a click or a PR merge. An agent opening a PR that a human merges is at this rung | see III.1 |
| Act, then notify (L3) | Rung at which the agent carries out a pre-approved, reversible action within guardrails, then tells humans, who review afterwards. The action lands because deterministic gates pass, not because the agent decided. Today's ceiling, and only for narrow classes | see III.1 |
| Actor of record | The human who answers for an agent's action: whoever requested the work counts as its author, so a different owner approves it | see III.3 |
| ADO (Azure DevOps) | Microsoft's work-tracking, repo and pipeline service. Its area paths map work to teams, and its release flow is Microsoft's trunk-based branch and PR model | see II.6, IV.3 |
| Advise (L0) | Rung at which the agent investigates, explains and suggests; a human decides and acts. Running a check and commenting is Advise | see III.1 |
| Agent action policy | The versioned file (template: D6) that lists every agent action with its rung, scope, guardrail, owner and kill switch. Tools check it before acting | see III.1, III.2 |
| AGENTS.md | A short instruction file in each repo that maps into versioned in-repo docs and lists build, test and validation commands (template: D3). Part of the context layer | see II.5, V.2 |
| AKS Fleet Manager | Microsoft's service that stages Kubernetes and node-image upgrades across many AKS clusters through "update runs" with approval gates. It does not roll out applications or flags | see II.9 |
| Autonomous within budget (L4) | Rung at which the agent also takes non-routine actions inside a scoped budget, with automatic rollback and full audit. A future proposal everywhere in this document | see III.1 |
| Blueprint | Stripe's code-defined sequence of deterministic steps (lint, push) and agent steps (implement, fix CI) that runs a coding task, with caps and budgets | see II.5 |
| Canary (EUAP) | The first ring of a rollout, a small, time-limited exposure judged against a control. Azure's canary regions belong to the Early Updates Access Program (EUAP); D5 targets them as `euap-regions` | see II.9 |
| CCA (Copilot coding agent) | GitHub's cloud coding agent. A maintainer assigns it an issue and it opens a PR from a sandbox; in dotnet/runtime it never opens a PR on its own | see II.5 |
| Change set | One ID carried by every PR, build, deployment and ledger record of a cross-repo change, so the change can be tracked, halted and reverted as a unit | see IV.1 |
| Conditional Access | Entra's sign-in policy engine, run each time a token is issued or refreshed. Under OBO it evaluates the user's policies; static API keys bypass it | see IV.4 |
| Constitution and spec | The spec turns an approved PRD into acceptance criteria, plan and tasks, each criterion with a check that fails before code is written; it is tagged before implementation. The constitution (`constitution.md`) holds the repo's fixed principles every plan must obey (template: D4) | see II.3 |
| Context layer | What agents read before acting: AGENTS.md or CLAUDE.md files, the service catalog, the dependency graph and runbooks | see V.2 |
| Deterministic core, agentic edges | The shape of the factory: builds, verifiers, ready gates, merge queue, risk thresholds, ring promotion, bake and the watchdog verdict stay policy-driven; agents write their inputs, interpret their outputs and take bounded mitigations | see III.1 |
| Diff Risk Score (DRS) | Meta's fine-tuned model that predicts how likely a change is to cause a severe incident, so only the riskiest diffs are gated instead of freezing everything | see II.8 |
| DORA metrics | DORA (Google's DevOps research program) delivery metrics: deployment frequency, lead time for changes, change failure rate and time to restore service. Part VI reports lead time and change failure rate against the Step 0 baseline | see VI.4 |
| Entra Agent ID | Microsoft Entra's identity type for agents: each agent gets its own identity, created from a blueprint, with the creating user recorded as sponsor and its activity logged as an agent's | see III.3 |
| Evidence brief | A section of the PR description in which each claimed test run gives its command, result and commit SHA, re-verified by the pipeline (template: D7) | see II.6 |
| Feature flag | A switch that turns a code path on or off without a build. Flag changes ride the same rings as code, a breach turns the flag off automatically, and the flag stays as a kill switch until the latent-fault window closes and it is removed | see II.10 |
| GA (generally available) | A released, supported version of a product or API, as opposed to a preview | see II.12 |
| Gandalf | Azure's global deployment watchdog: it finds which rollout most likely caused a fault and writes a go or no-go that the deploy engine enforces, opening an incident on no-go | see II.9 |
| Gateway (model, tool/MCP) | The two choke points agents reach the core through. The model gateway is the one endpoint for model calls (attribution, budgets, redaction, model version); the tool/MCP gateway exposes internal APIs as tools with auth, scope checks, logging and a registry | see V.2 |
| Grilling agent | The requirements agent that interviews the owner, drafts the PRD and lists open questions instead of resolving ambiguity by assumption | see II.2 |
| Harness | Everything around the model: instructions, tools, sandbox, verifiers and the orchestration loop. It is versioned like code and re-tested when the model changes | see I.1, III.2 |
| HLD (high-level design) | The design document for a change that crosses service boundaries, reviewed with its contract changes, compatibility plan and threat model (template: D9) | see II.4 |
| Human-only baseline | The merge, revert and other rates of humans on a task class, recorded before the first agent touches it, against which promotion is judged | see III.2 |
| IaC (infrastructure as code) | Infrastructure defined in versioned files; IaC changes ride the same rings as code | see II.9 |
| Kill switch | A per-action and per-agent-identity off switch owned by on-call that takes effect at once, without waiting for token expiry | see III.2 |
| LKG (last known good) | The last release known to be healthy, which an automatic or agent rollback returns to | see II.9 |
| LLM judge | A model used as a verifier that grades an agent's output. It runs after deterministic verifiers, may comment or veto but never approve, and is measured against human labels before it blocks | see II.7 |
| Managed identity and WIF | Ways to remove stored secrets. Managed identity gives an Azure workload an Entra identity; workload identity federation (WIF) lets a workload outside Azure trade its own platform's token for an Entra token | see IV.4 |
| MCP (Model Context Protocol) | The protocol through which agents call tools. Its draft authorization spec makes each tool server an OAuth resource server that accepts only tokens addressed to it | see IV.4 |
| Merge queue | The deterministic queue that tests each PR on top of those ahead of it (a combined state), lands it, and advances a "verified main" pointer only when post-merge validation passes | see II.8 |
| Migration campaign | A fleet-wide change, such as an upgrade or deprecation, authorized once by an approved proposal (Google calls it a large-scale change), split into per-owner shards and tracked to 100% (template: D11) | see II.12 |
| Mutation score | The share of deliberately injected faults (mutants) that the tests catch. Meta's ACH uses mutants to guide test generation | see II.7 |
| OBO (on behalf of) | The Entra flow in which an agent trades the user's token for one addressed to a single tool that still names the user. One of three ways an agent acts; the others are app-only (its own rights, for unattended work) and agent user (a paired user account) | see III.3, IV.4 |
| On-call/SRE agent | The operations agent that investigates from the first page and, per promoted action, runs reversible mitigations. Azure SRE Agent is Microsoft's product for this role | see II.9, II.11 |
| PII | Personally identifiable information; it is redacted before agent or model access | see II.2 |
| PRD (product requirements document) | The approved, testable statement of a requirement: problem, acceptance criteria as observable checks, non-goals, owner, dependencies, SLO impact, data classification, rollout constraints (template: D1) | see II.2 |
| Prepare (L1) | Rung at which the agent prepares the exact action (a draft, a command, a plan) that a human edits or adopts and submits as their own | see III.1 |
| Prepare/Activate | Amazon's two-phase change for data-format or protocol changes: first ship code that reads the new form and still writes the old, verify and bake, then ship the write | see II.9 |
| Promotion and demotion | Moving one action up one rung, signed by a named owner in a promotion review against the human-only baseline (operations actions also need a replay set of past incidents); demotion is automatic after a revert, wrong-target action or escaped defect | see III.2 |
| Provenance | The record attached to a signed release artifact: commit, PR, reviewers, agent identity and sponsor, risk score and model version. Deployment verifies it before the first ring | see II.8 |
| RCA, RCACopilot | Root-cause analysis. RCACopilot is Microsoft's peer-reviewed system that collects diagnostics per alert type and predicts the root-cause category | see II.11 |
| Ready gate | A deterministic check that decides an artifact is complete: "ready for spec" for a PRD, "ready for implementation" for a spec. No agent passes it by approval | see II.2, II.3 |
| Reverse dependency graph | The computed "who depends on me" edges of the service catalog, used to find consumers and owners, set merge and release order and size blast radius | see V.1 |
| Ring and bake time | A ring is one stage of a gradual rollout (canary, pilot, region waves). Bake time is how long a ring is held with all health signals green before promotion, set by central policy, not developers | see II.9 |
| Risk score and risk tier | A versioned model's score for how risky a change is; the tier it implies sets reviewers, test scope and whether conflict relaxation and auto-merge apply | see II.8 |
| Roadmap step | One of the nine steps (Step 0 readiness to Step 8 closed loop) for agentifying a service, in three phases (A foundations, B new behaviour, C production loop) | see III.4 |
| Rung | One of the five autonomy levels, assigned per action, not per agent: Advise, Prepare, Act on approval, Act, then notify, Autonomous within budget | see III.1 |
| Runbook, postmortem, repair item | A runbook is a versioned, reviewed set of mitigation steps, each bound to a D6 action; a blameless postmortem records why verifiers and alerts missed an incident; each repair item has an owner, due date and type (template: D10) | see II.11 |
| S2S (service-to-service) | Calls between services. The target is short-lived Entra tokens addressed to one audience, with the requesting human's identity carried on every hop | see IV.4 |
| Sandbox | The fresh, isolated environment each agent task runs in, built from the repo's setup, with no production access, no real customer data and limited egress | see II.5, V.2 |
| SDP (Safe Deployment Practices) | Azure's practice of moving all code and configuration through canary regions, a pilot and incremental regions, with mandatory health signals and centrally set bake | see II.9 |
| Service catalog | The record every stage looks things up in: owners, dependencies, consumers, pipelines, data classification and allowed agent actions per service (template: D2) | see V.1 |
| SFI (Secure Future Initiative) | Microsoft's security programme; its engineering-systems pillar requires tamper-resistant, auditable systems and signed, reproducible builds | see IV.7 |
| SLO, SLI | A service-level indicator (SLI) is a user-visible measure such as error rate or latency; a service-level objective (SLO) is its target. Ramp steps and paging alerts are judged on them | see II.10, II.11 |
| Spec Kit | GitHub's open-source toolkit for spec-driven development (`/specify`, `/plan`, `/tasks`, `constitution.md`); Microsoft calls it an experiment | see II.2, II.3 |
| Sponsor | For an agent identity, the human recorded as accountable for it. For the programme, the director or GM who funds Step 0 and chairs each phase review | see III.3, VI.3 |
| Sprint contract | The testable criteria with hard thresholds that a generator agent and a separate evaluator agree before work starts; only the evaluator records results (template: D4) | see II.3 |
| Trust ledger | The per-action record used to promote or demote an action: success rate, revert rate, escaped defects (faults found after release), human override rate and cost per accepted change (template: D7) | see III.2 |
| Verifier | Any automated check an agent's output must pass, such as build, tests, lint, contract diff, mutation score or an LLM judge | see II.7 |
| Watchdog | The deterministic go/no-go per ring that halts a rollout when health turns bad; ML-based analytics such as Gandalf belong to it, and it is not an agent | see II.9 |
