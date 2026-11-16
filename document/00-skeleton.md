# Skeleton: From an existing service to a frontier software factory

Status: APPROVED by Mati 2026-11-15 (single document; Part VII added at Mati's request). Nothing below is written yet. Each section has a brief, a target length, the sources it must draw on (IDs from SOURCES.md), and planned diagrams. Writer agents fill one section each; reviewer agents check them afterwards.

Working title: **"The Agentic PDLC: building a software factory around a high-scale service"**

Guiding thesis (to be tested by the writers, not assumed): the bottleneck moves from writing code to *specifying and verifying* it. A factory is mostly verification, identity, context and rollout infrastructure, and only a little code generation. You earn autonomy one action at a time, with evidence.

---

## Part 0: Front matter (~1 page)

**0.1 Executive summary.** One page: the thesis, the five most important requirements, the first three steps of the roadmap, and what "done" looks like for an existing service.
**0.2 How to read this.** The parts, who each is for, and the evidence grades (A = peer-reviewed or measured, B = company post with numbers, C = guidance or anecdote). Every claim carries a short reference code such as [MS4]; codes resolve in Appendix B.
**0.3 Scope and non-goals.** The goal is safe transformation of one existing service, not PR volume. Not a vendor comparison.

**0.4 The uber chart (D0).** One Mermaid flowchart of the whole ideal, deterministic PDLC from intake to monitoring, with its gates. Agent touchpoints are overlaid in a second colour and labelled with their highest recommended rung. Every Part II stage zooms into one box of this chart. A short paragraph explains how to read it: the core is deterministic and agents work at the edges.
**0.5 Real-world systems in two minutes.** A short primer, 2 to 3 sentences each, on the systems the document leans on most: Azure SDP and Gandalf, Copilot coding agent and AI code review, Entra Agent ID, Google's AI migrations, Meta's Diff Risk Score, Spotify Honk, Stripe Minions. The reader knows what each one is before it appears as evidence.

---

## Part I: What frontier companies learned (layered learnings, ~4 pages)

**I.1 Cross-cutting lessons.** Each lesson gets a claim, evidence, a counter-evidence or caveat, and a "so what for an existing service" line.
1. Verification and review become the bottleneck (GOOG-MIGRATIONS, SPOTIFY-HONK-4, AIE-MERGE-BOTTLENECK, MS-AICR, AIE-UBER-MERGE).
2. The harness matters more than the model; re-test harness parts when a new model arrives (AN-HARNESS-1/2, OAI-HARNESS, SPOTIFY-QCON-2026 vs SPOTIFY-HONK-3: the LLM-judge contradiction).
3. Standardize the platform, not the tools (SPOTIFY-CONSTRAINT, SHOPIFY-PLAYBOOK, UBER-AISTACK, DORA-AICM).
4. Start with toil and with work that is easy to verify (AN-WORK, AIRBNB-MIGRATION, AMAZON-Q-JAVA, AIE-DUOLINGO-TESTS).
5. Context is infrastructure: AGENTS.md as a map, service catalogs, dependency graphs (OAI-HARNESS, MABL-75-REPOS, AIE-AGENT-READY, AIE-LINEAR-CONTEXT, MS-IT-COMPLIANT-ENG).
6. Autonomy is granted per action, based on track record (AIE-META-ONCALL, META-DRS, MS-CCA-DOTNET).
7. Safe deployment is the backstop that makes speed affordable (MS-SDP-BLOG, MS-GANDALF-NSDI, AWS-HANDSOFF).
8. AI amplifies the organization you already have (DORA-2025, DORA-AICM).

**I.2 Evidence map.** A table of the lessons against companies, with the evidence grade. It shows where the evidence is strong (deployment, migrations, review) and where it is thin (requirements agents, contract testing).

Diagram D1: an evidence heat map of PDLC stage × company.

---

## Part II: The PDLC reference model (~10 pages; the core)

Every stage uses the same template (revised after Mati reviewed the sample on 2026-11-15): **Purpose · The ideal deterministic process (Mermaid flowchart) · Real-world reference (a short explainer) · What to agentify, and how far (agent touchpoints + rungs table) · Enterprise complications · Requirements**. Each stage is 700 to 1,000 words of prose. Inputs, outputs, gates and metrics live in the flowchart and its notes.

| ID | Stage | Main sources |
|---|---|---|
| II.1 | Intake and ideation (signal → opportunity) | AIE-UBER-SDLC, AN-TEAMS, MS-IT-AINATIVE |
| II.2 | Requirements (PRD; the "grilling" interview) | AN-BESTPRACTICES (interview → SPEC.md), MS-SPEC, AIE-UBER-SDLC; flag: practice only, no measurements |
| II.3 | Specification (constitution, acceptance criteria, sprint contracts) | MS-SPEC, AN-HARNESS-2, GH-AGENTIC |
| II.4 | High-level design, API contracts, threat model | MS-API-GUIDELINES, MS-AZURE-BREAKING-CHANGES, AWS-ROLLBACK-SAFETY |
| II.5 | Implementation (task decomposition, sandboxes, blueprints) | STRIPE-MINIONS, MS-CCA-DOTNET, AIE-MSFT-SUBAGENTS, OAI-HARNESS |
| II.6 | Code review (AI first pass, human ownership) | MS-AICR, UBER-UREVIEW, MABL-75-REPOS, AIE-PROVE-TESTS |
| II.7 | Validation and testing (unit, mutation, integration, upgrade/downgrade) | META-ACH, AIE-DUOLINGO-TESTS, AIE-PROVE-TESTS, AWS-ROLLBACK-SAFETY, SPOTIFY-HONK-3 |
| II.8 | Integration and merge (merge queues, semantic conflicts, risk scores) | AIE-UBER-MERGE, META-DRS, META-RELEASE-RISK, GOOG-LSC, AIE-MULTIPLAYER-FACTORY, MS-HOW-MSFT-DEVOPS |
| II.9 | Safe gradual deployment (rings, bake, auto-halt, config) | MS-SDP-LEARN/BLOG, MS-WAF-SDP, MS-GANDALF-*, MS-AKS-FLEET, AWS-HANDSOFF, GOOG-SRE-CANARY, META-CONFIG-SAFETY |
| II.10 | Post-deploy customer and engineering validation (flags, experiments, SLOs) | MS-SDP-BLOG, MS-HOW-MSFT-DEVOPS, GOOG-SRE-CANARY |
| II.11 | Monitoring, incidents, learning loop | MS-SRE-BUILD/GA, MS-RCACOPILOT, AIE-META-ONCALL, AIE-ALWAYS-ON-OPS, MS-WIN-RESILIENCY |
| II.12 | Maintenance, migrations, decommissioning | GOOG-MIGRATIONS, GOOG-LSC, SPOTIFY-HONK-1..4, AIRBNB-MIGRATION, AMAZON-Q-JAVA, AIE-MAERSK-MAINTAIN, AIE-LEGACY-BENCH |

Diagrams: D2, the full PDLC loop with artifacts and gates (the master diagram). D3, the safe deployment ring flow with Gandalf-style halt. D4, the requirements-grilling loop (owner ↔ agent → PRD → spec → task plan).

---

## Part III: Trust model and agentification roadmap (~6 pages)

**III.1 The autonomy ladder.** Rungs are defined per *action*, not per agent (AIE-META-ONCALL): **Advise** (L0) → **Prepare** (L1) → **Act on approval** (L2) → **Act, then notify** (L3, pre-approved reversible actions such as halt, roll back to LKG, flag off) → **Autonomous within budget** (L4). Principle: a deterministic core with agentic edges.
**III.2 The trust ledger.** The evidence needed to promote an action: success rate, revert rate, escaped defects, reviewer override rate, and cost. Demotion triggers and kill switches. (MS-CCA-DOTNET revert rate, META-DRS thresholds, MABL circuit breakers, SPOTIFY-HONK-3 verifiers.)
**III.3 Agent identity and accountability.** Who is the actor of record? Covers OBO vs app-only vs agent user, and audit trails (MS-ENTRA-AGENT-OBO, MS-ENTRA-AGENT-PROTOCOLS, MS-CA-AGENTS, MS-ENTRA-AGENTID). Short here; the detail is in Part IV.
**III.4 The roadmap: small steps, each with prerequisites, controls, promotion metrics and exit criteria.**
  - Step 0: Readiness. Verifiers, AGENTS.md, a service catalog, a telemetry baseline (AIE-AGENT-READY, DORA-AICM).
  - Step 1: Toil and test backfill (AIE-DUOLINGO-TESTS, META-ACH).
  - Step 2: AI code review as the first pass (MS-AICR, UBER-UREVIEW).
  - Step 3: Migrations and fleet-wide changes (GOOG-MIGRATIONS, SPOTIFY-HONK).
  - Step 4: The requirement-grilling agent → PRD → spec (AN-BESTPRACTICES, MS-SPEC).
  - Step 5: Spec → PR for bounded features (STRIPE-MINIONS, MS-CCA-DOTNET).
  - Step 6: Deploy watchdog and risk-gated rollout (MS-GANDALF, META-RELEASE-RISK).
  - Step 7: SRE agent for diagnosis, then mitigation (MS-SRE-GA, AIE-META-ONCALL).
  - Step 8: Closed loop: incidents → requirements (AIE-UBER-SDLC).

Diagrams: D5, the autonomy ladder per action. D6, a roadmap swimlane (steps × people, process, platform).

---

## Part IV: Enterprise complexity and the requirements catalogue (~8 pages)

Each subsection covers: the problem in an enterprise, what frontier companies did, the Microsoft-native option, and then **requirements** as `REQ-<area>-NN | MUST/SHOULD | statement | rationale | source`.

| ID | Area | Main sources |
|---|---|---|
| IV.1 | Many repos and architectures (context graph, coordinated changes, release order) | MABL-75-REPOS, SPOTIFY-HONK-4, GOOG-LSC, MS-HOW-MSFT-DEVOPS |
| IV.2 | Cross-service API contracts and compatibility | MS-AZURE-BREAKING-CHANGES, MS-API-GUIDELINES, AWS-ROLLBACK-SAFETY; gap: consumer-driven contract testing |
| IV.3 | Heterogeneous pipelines and clusters | MS-AKS-FLEET, MS-SDP-*, MS-IT-COMPLIANT-ENG, AWS-HANDSOFF |
| IV.4 | S2S trust and agent identity (zero trust, no secrets, audience-bound tools) | MS-MI-BESTPRACTICE, MS-WIF, MS-ENTRA-AGENT-*, MS-CA-AGENTS, MCP-AUTHZ, GOOG-BEYONDPROD, UBER-AISTACK (SPIRE), MS-SFI |
| IV.5 | Multi-team ownership and accountability | MS-IT-COMPLIANT-ENG, MS-HOW-MSFT-DEVOPS, ATLASSIAN-AGENT-LOOPS, SPOTIFY-HONK-4 |
| IV.6 | Configuration and feature-flag changes | META-CONFIG-SAFETY, MS-SDP-BLOG |
| IV.7 | Security and compliance of the engineering system itself (supply chain, provenance, prompt injection) | MS-SFI, MS-IT-SECURE-AGENTS, GOOG-BEYONDPROD |
| IV.8 | Cost, capacity and review load | SPOTIFY-HONK-4 (76% more PRs to review), AIE-BOOKING-ROI, SHOPIFY-PLAYBOOK |

The consolidated requirements table follows (all REQ-IDs, sortable by area, priority and roadmap step).

Diagrams: D7, a coordinated multi-repo change (graph → ordered PRs → two-phase rollout). D8, the identity and token flow (developer → agent blueprint → OBO → MCP tool server → service, with managed identity for S2S).

---

## Part V: Factory reference architecture (~6 pages)

**V.1 The service catalog: the factory's backbone (~2 pages; added at Mati's request 2026-11-15).** Every stage leans on it: owners for routing questions and reviews (II.2, II.6), dependencies for coordinated changes (IV.1), catalog metadata that triggers compliance gates (IV.7), and signals and rollout policy for deployment (II.9). Contents:
- **What it stores.** The schema, by entity: service, component, API/contract, data store, pipeline, cluster, team. Fields include the architecture summary and design-doc links; API contracts and their versions; owners and on-call; deployment pipelines, rings and environments; health signals and SLOs; data classification; the change-intake path ("how to ask this team for a change"); and the agent context (AGENTS.md location, allowed agent actions).
- **The reverse dependency graph for change management.** Blast radius, the list of consumers to notify or migrate, merge and release order, and risk input (SPOTIFY-HONK-4 lineage, MABL-75-REPOS coordination graph, GOOG-LSC).
- **Keeping it up to date.** Derive facts from sources of truth (repos, pipelines, IaC, runtime telemetry) rather than relying on hand entry. Treat catalog entries as code with CI checks. Detect drift between the catalog and observed traffic and deployments. Have owners attest on a schedule. Agents propose catalog updates as part of every change.
- **Agentification.** Rungs for a catalog-curator agent.
- **Sources:** MS-IT-COMPLIANT-ENG, MABL-75-REPOS, SPOTIFY-HONK-4, SPOTIFY-CONSTRAINT (Backstage), ATLASSIAN-AGENT-LOOPS (Teamwork Graph), GOOG-LSC, OAI-HARNESS, AIE-AGENT-READY, plus a targeted research pass on catalog freshness (Backstage software catalog, Microsoft Service Tree, others) because the notes are thin there.

Diagram D9a: the catalog entity model, plus the reverse-dependency lookup during a change.

**V.2 Other components.** Each is traced to the REQ-IDs it satisfies:
- control plane (intake, task queue, orchestrator);
- execution sandboxes (devboxes or Codespaces);
- model gateway and tool/MCP gateway;
- identity (Entra Agent ID);
- context layer (service catalog, code graph, AGENTS.md);
- verification service (build, test, mutation, judges);
- risk scoring and merge queue;
- deployment orchestrator (SDP, Fleet);
- observability and watchdog (Gandalf-style);
- trust ledger and audit.

Each component gets a Microsoft-first option and a reference from elsewhere.

Diagram D9: the reference architecture.

---

## Part VI: Transformation plan for an existing service (~3 pages)

A 0–30, 30–90, 90–180 and 180+ day plan. Covers the readiness assessment checklist, the first pilot (choose a narrow, verifiable slice), how to measure (DORA plus factory metrics), the operating-model changes (roles, review capacity, on-call), and the risks with their mitigations. Sources: SHOPIFY-PLAYBOOK, AIRBNB-MIGRATION, EMBEDDED-AIFIRST-ROADMAP, MS-IT-AINATIVE, DORA-AICM, AIE-BOOKING-ROI.

Diagram D10: the transformation timeline.

---

## Part VII: Worked example, one feature through the factory (~4 pages)

Mati asked for this on 2026-11-15. It follows one feature end to end through a convoluted enterprise service. The service is an **illustrative composite**: a multi-region Azure service with about 6 microservices in 4 repos owned by 3 teams, mixed architectures (.NET on AKS plus a legacy App Service component), two pipeline systems (Azure DevOps plus GitHub Actions), and S2S calls between teams. Every step is labelled in one of two ways:
- **[Published]** means a mechanism a named company describes, with a citation.
- **[Illustrative]** means our composition of those mechanisms. It is never presented as published fact.

Flow, one walkthrough step per PDLC stage:
1. **Intake.** An incident pattern becomes a feature request (AIE-UBER-SDLC).
2. **Grilling.** A requirements agent interviews the owner and produces a PRD and SPEC.md (AN-BESTPRACTICES, MS-SPEC).
3. **Design.** A cross-service API change is caught by a breaking-change diff and routed to owners from the service catalog (MS-AZURE-BREAKING-CHANGES, MS-IT-COMPLIANT-ENG).
4. **Implementation.** Coordinated PRs across repos land in dependency order, in sandboxes (MABL-75-REPOS, STRIPE-MINIONS, MS-CCA-DOTNET).
5. **Review and test.** AI first-pass review, mutation-guided tests, and an upgrade/downgrade test (MS-AICR, META-ACH, AWS-ROLLBACK-SAFETY).
6. **Merge.** A risk score sets the gate level (META-DRS).
7. **Rollout.** A two-phase prepare/activate rollout across SDP rings and AKS Fleet stages, with S2S over managed identity and the agent acting via Entra Agent ID OBO (MS-SDP-BLOG, MS-AKS-FLEET, MS-ENTRA-AGENT-OBO).
8. **Halt and recovery.** A Gandalf-style watchdog halts a bad stage, and the SRE agent diagnoses it (MS-GANDALF-NSDI, MS-SRE-GA).
9. **Learning.** The postmortem feeds back into the context and the verifiers.

Each step states who or what acts, at which autonomy level, through which gate, and what evidence is recorded in the trust ledger.

Alongside it, **three short published case vignettes** show that parts of this happen for real at scale: Google's AI-assisted migrations (GOOG-MIGRATIONS), Spotify's fleet-wide multi-team migrations (SPOTIFY-HONK-4), and the Copilot coding agent in dotnet/runtime (MS-CCA-DOTNET).

Diagram D11: the worked-example swimlane (teams × stages, with agent and gate markers).

---

## Appendices

- A: Glossary.
- B: References: one table for the whole document (short code such as MS4, source, title, grade, link), generated from SOURCES.md into `document/references.md`.
- C: Open questions and evidence gaps, including where Mati's own service data is needed.
- **D: Implementation kit** (added at Mati's request). These are practical starting points, each referenced from its section:
  - D1 PRD template, with the grilling checklist and open-questions list (II.2)
  - D2 Service catalog schema, as a YAML example (V.1)
  - D3 AGENTS.md template for a service repo (II.5)
  - D4 Spec/constitution template (II.3)
  - D5 Rollout plan as data (II.9)
  - D6 Agent action policy: allowed actions per rung, as a config example (III)
  - D7 Trust-ledger record and promotion review checklist (III)
  - D8 Readiness assessment checklist for an existing service (VI)
  Each is labelled as our synthesis, with the published patterns it draws on cited.

---

## Production plan

1. **Writers** (one subagent per section, in this order: II → IV → III → VII → I → V → VI → 0). Each writer reads only its brief and the cited source notes, and writes to `document/sections/<ID>.md`. It must not cite anything that isn't in the notes; when evidence is missing it writes "[GAP]".
2. **QC reviewers** (separate agents, each with one job), writing reports to `document/qc/`:
   - Grounding: every claim is traced to a quote or paraphrase in the source notes; unsupported claims get flagged.
   - Consistency: the same terms, autonomy levels and REQ-IDs are used across sections; no contradictions.
   - Enterprise coverage: each of Mati's complexities (multi-repo, pipelines/clusters, S2S, multi-team) is handled in every relevant stage.
   - Microsoft priority and practicality: a Microsoft option is named wherever one exists, and the text is actionable for an existing service.
   - **Reader judge** (added at Mati's request): reads as a busy engineering leader would. Checks clarity, reading flow, whether key references are explained before they are used, repetition, non-essential detail, and the right level of detail. Proposes concrete cuts. Also looks at the preview PNG of every diagram and checks that it is readable at column width, sensibly sized and placed where it helps.
   - Every Mermaid block must pass the headless render validator.
3. Writers fix the QC findings, then a final editor assembles the document. I check the assembled document myself.
4. **Mati's review points:** this skeleton (approved), the style sample II.9 (revised after first review), and the assembled draft.
