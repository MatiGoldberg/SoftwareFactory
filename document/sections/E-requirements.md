## Appendix E: Requirements catalogue

This appendix collects all 131 requirements from Parts II to V in one table, grouped by area in the order the conventions give. Each row keeps the wording of its section table; statements over about 40 words are trimmed, with cuts marked [...], and the section holds the full text with its rationale and sources.

The roadmap step column names the step of the III.4 roadmap that first needs the requirement, where one step clearly does; a blank means it applies across steps or has no single home.

Of the 131, 106 are MUST and 25 are SHOULD.

| Area | MUST | SHOULD |
|---|---|---|
| CTX | 6 | 5 |
| VER | 11 | 2 |
| REV | 7 | 1 |
| MRG | 5 | 2 |
| DEP | 5 | 0 |
| OBS | 8 | 1 |
| IDN | 8 | 1 |
| REPO | 4 | 1 |
| API | 5 | 0 |
| PIPE | 4 | 4 |
| OWN | 11 | 2 |
| CFG | 3 | 1 |
| SEC | 8 | 0 |
| GOV | 14 | 4 |
| COST | 1 | 1 |
| PRD | 6 | 0 |
| **Total** | **106** | **25** |

### CTX: context

The catalog, AGENTS.md, specs and docs that agents read before they act.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-CTX-01 | SHOULD | Accepted items link to their evidence (incidents, telemetry, feedback) so II.2 can read it. | II.1 | Step 8 |
| REQ-CTX-02 | SHOULD | The grilling agent reads the service catalog, incident history and design docs before asking [...], and the approved PRD is stored in the repo. | II.2 | Step 4 |
| REQ-CTX-03 | MUST | Spec, plan, tasks, constitution and decision log live in the repo; implementation runs against a tagged spec version, and changes to criteria or non-goals re-enter the gate. | II.3 | Step 4 |
| REQ-CTX-04 | MUST | Each repo has a short AGENTS.md that maps into versioned in-repo docs and lists build, test and validation commands; rules are scoped by directory (template: D3). | II.5 | Step 0 |
| REQ-CTX-05 | SHOULD | Postmortem findings update the context layer (runbooks, AGENTS.md, incident history linked in the catalog) by PR, with periodic pruning of instruction files. | II.11 | Step 8 |
| REQ-CTX-06 | SHOULD | The migration prompt is version-controlled, with explicit mapping tables and "do not migrate" rules; where judgment is needed the agent leaves code unchanged with a comment. | II.12 | Step 3 |
| REQ-CTX-07 | MUST | Catalog entries live in repos as files using the D2 schema; CI validates required fields, references that resolve, and patterns that match existing files. | V.1 | Step 0 |
| REQ-CTX-08 | MUST | Derived facts come from exactly one provider per entity, and humans do not hand-edit them. | V.1 |  |
| REQ-CTX-09 | MUST | Reverse edges are computed, never declared, and served through an API or MCP tool to gates and agents. | V.1 |  |
| REQ-CTX-10 | MUST | A deterministic reconciler compares declared dependencies with observed traffic and flags resource changes made outside pipelines; it opens a drift item for the owner and sets the entry's drift status. | V.1 |  |
| REQ-CTX-11 | SHOULD | A change PR that alters a dependency, pipeline or data store carries the matching catalog diff, or CI fails. | V.1 |  |

### VER: verification

The checks every change must pass, and how they are protected from the agents they judge.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-VER-01 | MUST | Every acceptance criterion has an ID and at least one committed check, and that check fails before implementation starts. | II.3 | Step 4 |
| REQ-VER-02 | MUST | Implementing agents cannot edit, delete or loosen spec checks or sprint-contract checks; only the evaluator records results. | II.3 | Step 4 |
| REQ-VER-03 | MUST | The ready-for-implementation gate is a deterministic script that checks constitution rules, red checks, resolved references and two-way traceability, and verifies that owner approvals are recorded. No agent approves a spec [...]. | II.3 | Step 4 |
| REQ-VER-04 | MUST | Local verifiers (build, lint with remediation text, fast tests) run as deterministic hooks before a PR opens; any failure blocks it. Agents cannot edit protected tests or weaken lints. | II.5 | Step 5 |
| REQ-VER-05 | MUST | Each service class defines required tiers (fast PR gate, contract diff, post-merge integration, pre-production with backward-compatibility checks against production endpoints) and no change, human or agent, skips one. | II.7 |  |
| REQ-VER-06 | MUST | Any change to serialization, protocol or stored data runs upgrade-downgrade tests in a production-like topology with the real deployment order before entering rings. | II.7 |  |
| REQ-VER-07 | MUST | A deterministic check blocks agent PRs that delete, disable or weaken existing tests, and test PRs that touch non-test files; contract tests live in a human-only area. | II.7 | Step 1 |
| REQ-VER-08 | SHOULD | Mutation score on changed code, per named risk class, is a recorded verifier for generated tests, with an equivalent-mutant filter. | II.7 | Step 1 |
| REQ-VER-09 | MUST | Agent-written tests merge only after approval by an owner from the service catalog (see V.1), until a test-only class is promoted to Act, then notify through the trust ledger [...]. No agent writes the tests that judge its own change. | II.7 | Step 1 |
| REQ-VER-10 | MUST | LLM judges run after deterministic verifiers, may comment or veto but never approve, and are measured against human labels before they block. | II.7 |  |
| REQ-VER-11 | MUST | Agents test in isolated environments with no production access and no real user data. | II.7 | Step 0 |
| REQ-VER-12 | SHOULD | Flaky tests are detected deterministically, quarantined with an owner and expiry, and never quarantined if protected. | II.7 | Step 0 |
| REQ-VER-13 | MUST | Deterministic verifiers chosen by repo contents run before any PR opens; diffs that delete or disable tests or change toolchain versions outside scope are blocked. | II.12 | Step 3 |

### REV: review

Who reviews and approves a PR, and what the AI reviewer may and may not do.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-REV-01 | MUST | "Design approved" is a deterministic check: HLD, contract PR with labels resolved, compatibility plan, consumer acknowledgements, threat model and sign-offs all present. No agent approves a design or applies an approval label. | II.4 | Step 4 |
| REQ-REV-02 | MUST | Every agent PR lists each verification claim with the command, result and commit SHA, links the originating task, and is merged only by a human with ownership of the code, except allow-listed classes promoted to Act, then notify [...]. | II.5 | Step 5 |
| REQ-REV-03 | MUST | Owners of touched code, from code-owner files reconciled with the service catalog, are added as required reviewers automatically; branch policy blocks direct pushes and requires passing checks and one human owner approval, except under REQ-REV-08. | II.6 | Step 2 |
| REQ-REV-04 | MUST | The same AI reviewer runs on every PR, human or agent; fixes are applied only by an explicit author action and attributed in commit history. | II.6 | Step 2 |
| REQ-REV-05 | MUST | The AI reviewer's findings in proven high-precision categories feed a required blocking check, which a human owner can dismiss with a logged reason; approval happens only under REQ-REV-08. | II.6 | Step 2 |
| REQ-REV-06 | MUST | Each AI comment carries a usefulness vote and an addressed-or-not record; categories below a precision threshold are suppressed, and rollout proceeds team by team. | II.6 | Step 2 |
| REQ-REV-07 | MUST | Agent PRs carry an evidence brief: each claimed test run gives command, result and commit SHA, re-verified by the pipeline. | II.6 | Step 5 |
| REQ-REV-08 | SHOULD | Approval without a human applies only to named low-risk classes, decided by the deterministic risk gate, opted in per repo, with sampled audit and automatic demotion on revert. | II.6 |  |

### MRG: merge

The merge queue, verified main, the risk score and merges without an owner.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-MRG-01 | MUST | Every PR is tested in the merge queue on top of the changes ahead of it; none lands tested only against its own base. | II.8 | Step 1 |
| REQ-MRG-02 | MUST | Post-merge validation advances a verified-main pointer; failures are bisected to a culprit; only verified commits build release artifacts. | II.8 | Step 1 |
| REQ-MRG-03 | MUST | A versioned risk model scores every change with reasons; its capture rate at each threshold is measured on a chronological holdout; policy owners set thresholds; no agent edits a score or threshold. | II.8 | Step 3 |
| REQ-MRG-04 | MUST | The risk tier sets gate strictness: required reviewers, test scope, whether conflict relaxation and auto-merge apply, and the rollout plan's input (see II.9). | II.8 | Step 3 |
| REQ-MRG-05 | MUST | Agent conflict resolutions are new commits that rerun every queue gate; a resolution beyond textual merge needs owner re-review. | II.8 |  |
| REQ-MRG-06 | SHOULD | Fleet-wide agent changes run at low queue priority with a cap on queued shards, so they cannot starve interactive changes (sharding: see II.12). | II.8 | Step 3 |
| REQ-MRG-07 | SHOULD | Merge without an owner applies only to allow-listed mechanical classes that pass the deterministic class and risk gate, with sampled audit and demotion on revert. | II.12 | Step 3 |

### DEP: deploy

Rings, bake, the watchdog halt, two-phase changes and decommissioning.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-DEP-01 | MUST | Every production change, including config, flags and IaC, goes through the same rings with centrally set bake. No human or agent shortens bake except through emergency acceleration with defined approvers and criteria. | II.9 | Step 0 |
| REQ-DEP-02 | MUST | A deterministic watchdog issues a per-ring go/no-go that the deploy engine enforces, opens an incident with evidence on no-go, and has its precision and recall measured per component class before it is trusted. [...] | II.9 | Step 0 |
| REQ-DEP-03 | MUST | Each component registers health signals, with owner-set noise weights, before its first rollout. | II.9 | Step 0 |
| REQ-DEP-04 | MUST | Data-format and cross-service protocol changes use two-phase Prepare/Activate, with Prepare verified on every server of every consuming service before Activate; backward compatibility is tested against production endpoints before rollout. | II.9 | Step 6 |
| REQ-DEP-05 | MUST | Decommissioning signals deprecation in-band, proves zero use from telemetry over a full business cycle, snapshots and disables before delete; a human runs the delete. | II.12 |  |

### OBS: observability and operations

SLO checks, alerts, runbooks, postmortems and on-call agent mitigations.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-OBS-01 | MUST | For rollout mitigations, the on-call/SRE agent at Act, then notify may only halt, roll back to LKG or turn off a flag; each action is logged in the trust ledger and promoted per action. [...] | II.9 | Step 7 |
| REQ-OBS-02 | MUST | Each ramp step is gated on a small set of user-visible SLIs compared with a control and against absolute SLOs; a breach turns the flag off automatically. | II.10 |  |
| REQ-OBS-03 | MUST | A latent-fault window (30 days by default) follows full exposure; the flag stays as a kill switch until it closes. | II.10 |  |
| REQ-OBS-04 | MUST | Paging alerts fire on user-visible SLIs against SLO targets and page the owning on-call from the service catalog; alerts without customer impact open tickets. Alert rules change only by PR. | II.11 |  |
| REQ-OBS-05 | MUST | Every incident above a set severity gets a blameless postmortem whose repair items each carry an owner, a due date and a type (fix, verifier, alert, runbook or context). The postmortem closes only when every item is closed or declined [...]. | II.11 | Step 8 |
| REQ-OBS-06 | MUST | Runbooks are versioned in the service repo and reviewed like code; each executable step names an action ID in the agent action policy (D6) with its current rung. | II.11 | Step 7 |
| REQ-OBS-07 | MUST | SRE-agent autonomy is granted per runbook action from trust-ledger evidence (D7): replay on past incidents, then live Prepare runs. Any wrong-target action demotes that action. [...] | II.11 | Step 7 |
| REQ-OBS-08 | SHOULD | The SRE agent's investigation, evidence and every action it took are attached to the incident record, and the postmortem draft is built from it; a named human owner signs the postmortem. | II.11 | Step 7 |
| REQ-OBS-09 | MUST | The deterministic core (build, verifiers, merge queue, ring promotion, watchdog halt, kill switches) has no runtime dependency on the model gateway or any agent. | V.2 |  |

### IDN: identity and auth

Agent, service and pipeline identities, tokens and tool access.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-IDN-01 | MUST | Each coding agent acts under its own identity with a human sponsor (Entra Agent ID), using managed identity rather than stored secrets; its commits and PRs are attributed to that identity. | II.5 | Step 0 |
| REQ-IDN-02 | MUST | Agent PRs are authored under the agent's own identity, show its sponsor and task, and the sponsor is not the sole approver outside low-risk classes. | II.6 |  |
| REQ-IDN-03 | MUST | The SRE agent has its own Entra agent identity: read-only app-only access for investigation, and a separate identity scoped per promoted action for mitigation. No static API keys. | II.11 | Step 7 |
| REQ-IDN-04 | MUST | Service-to-service and pipeline-to-cloud calls use managed identity or workload identity federation; no stored secrets, certificates or API keys in services, pipelines or agent sandboxes. | IV |  |
| REQ-IDN-05 | MUST | Each federated credential is scoped to one repo, branch, environment or namespace; each pipeline and runner pool has its own identity with least privilege. | IV |  |
| REQ-IDN-06 | MUST | Every tool exposed to agents sits behind an MCP server or gateway that is an OAuth resource server: it accepts only tokens for its own audience, never passes a token through, and calls downstream with its own managed identity or an OBO exchange. | IV |  |
| REQ-IDN-07 | MUST | The requester and agent identity travel with every hop: as the token subject (OBO) where the service enforces user rights, otherwise as signed context; each hop logs both. | IV |  |
| REQ-IDN-08 | SHOULD | Per-call S2S authorization is introduced log-only, then enforced per service once violations stay at zero for an agreed window; agents get tool access to a service only after enforcement. | IV |  |
| REQ-IDN-09 | MUST | The tool gateway keeps a registry of tools; each agent gets a default small set, and a tool with write or destructive effect is callable only when the task's D6 entry allows it. | V.2 | Step 1 |

### REPO: multi-repo

Changes that span repos, migration campaigns and change sets.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-REPO-01 | SHOULD | A change spanning repos is opened as linked PRs in dependency order taken from the service catalog, with reviewers from code owners. | II.5 | Step 5 |
| REQ-REPO-02 | MUST | Cross-repo changes are a linked PR set, merged in catalog dependency order; downstream waits for the upstream artifact on verified main. | II.8 | Step 5 |
| REQ-REPO-03 | MUST | Each migration starts from an authoritative consumer list (reverse dependency graph from the service catalog plus code search) with owners; exclusions are recorded with a reason. | II.12 | Step 3 |
| REQ-REPO-04 | MUST | Each campaign has an approved proposal: reason, estimated shards, exclusions, verifier set, end date, escalation path (template: D11). | II.12 | Step 3 |
| REQ-REPO-05 | MUST | A cross-repo change carries one change-set ID on every PR, build, deployment and ledger record, so it can be tracked, halted and reverted as a unit. | IV |  |

### API: contracts

API versions, breaking-change gates and compatibility plans.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-API-01 | MUST | Specs refer to API contracts by name and version (see II.4); a criterion implying new behavior requires a new contract version. | II.3 | Step 4 |
| REQ-API-02 | MUST | Every API contract change is written spec-first as OpenAPI (or the protocol's schema) in a central spec repo before implementation starts. | II.4 | Step 4 |
| REQ-API-03 | MUST | CI diffs each contract PR against the latest GA and preview versions and applies blocking labels for breaking changes and missing version bumps; only a human board member can apply the approval label. | II.4 | Step 4 |
| REQ-API-04 | MUST | Any behavior change gets a new dated version (`api-version=YYYY-MM-DD[-preview]`), versioned from the first release. Breaking a GA version needs board approval, a documented reason [...] and a recorded migration window [...]. | II.4 | Step 4 |
| REQ-API-05 | MUST | Every data-format or protocol change has a compatibility plan at design time: Prepare-phase/Activate-phase split, reader/writer order and an upgrade-downgrade test. Execution and Prepare-phase verification are REQ-DEP-04 (see II.9). | II.4 | Step 4 |

### PIPE: pipelines and clusters

Sandboxes, the shared ring plan, the control plane and component APIs.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-PIPE-01 | MUST | Every agent task runs in a fresh, ephemeral sandbox built from the repo's environment definition, with no production access, no real customer data and network egress limited to an allow-list. | II.5 | Step 0 |
| REQ-PIPE-02 | MUST | Automation checks per-member cluster state and never treats a Fleet group (and, by extension, run) status of `Completed` as success [...]. Platform-initiated upgrades are recorded in the watchdog's event stream. | II.9 |  |
| REQ-PIPE-03 | SHOULD | The ring plan is defined once as data and executed by every pipeline system in use; one no-go halts all of them. | II.9 | Step 0 |
| REQ-PIPE-04 | MUST | Every pipeline system in use implements the shared ring plan (template: D5), a verification API that agents call, and the shared watchdog's halt signal. | IV | Step 0 |
| REQ-PIPE-05 | SHOULD | Every component, whatever its language or host, exposes an AGENTS.md with build and test commands, the shared verification API and a schema diff per published contract type before agents change it. | IV |  |
| REQ-PIPE-06 | MUST | Agent work starts only from a control-plane task record that names the requester, the action ID from D6, the budget and the sandbox; no agent run touches shared repos or tools without one. | V.2 | Step 0 |
| REQ-PIPE-07 | SHOULD | Components talk through versioned APIs (task, verification, merge, deploy, ledger), so an agent product can be replaced without changing gates. | V.2 |  |
| REQ-PIPE-08 | SHOULD | Each sandbox can boot the service and query an ephemeral telemetry stack, so agents verify behavior before a PR opens. | V.2 |  |

### OWN: ownership

Owners from the catalog, cross-team approval and owner attestation.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-OWN-01 | MUST | The owner of every intake item comes from the service catalog; an item with no catalog owner is a catalog defect, not a backlog item. | II.1 | Step 8 |
| REQ-OWN-02 | MUST | A cross-team ask is a parent item with one accountable driver and one child per owning service; only that service's owner accepts its child. | II.1 | Step 8 |
| REQ-OWN-03 | MUST | Questions about a dependency go to its owner from the service catalog; only that owner's answer counts as a sign-off. | II.2 | Step 4 |
| REQ-OWN-04 | MUST | A cross-service spec has one child spec per owning repo, approved by that owner from the service catalog (see V.1); the parent is ready only when all children are. | II.3 | Step 4 |
| REQ-OWN-05 | MUST | Consumers are listed from the service catalog's reverse dependency graph, and each consumer owner acknowledges a breaking or deprecating change before design approval (complements REQ-OWN-03 in II.2). | II.4 | Step 4 |
| REQ-OWN-06 | SHOULD | Cross-team agent changes are sharded by ownership, with a global approver for mechanical patterns and a per-owner cap on open agent PRs. | II.6 | Step 3 |
| REQ-OWN-07 | MUST | In a cross-team incident, a human incident commander leads; each team's agent acts only on its own service, and a mitigation on another team's service needs that owner's approval. | II.11 | Step 7 |
| REQ-OWN-08 | MUST | Shards follow ownership boundaries, with a cap on open shards per owner; mechanical patterns may route to a global approver. | II.12 | Step 3 |
| REQ-OWN-09 | MUST | An agent acting for one team never changes another team's service without that owner's approval, or the global approver named by an approved campaign (see II.12); an unanswered request escalates to a named human and never defaults to auto-merge. | IV |  |
| REQ-OWN-10 | MUST | Every repo path, pipeline and production resource maps to a service with an owning team; new code or services without one fail CI, and templates register services at creation. | V.1 | Step 0 |
| REQ-OWN-11 | MUST | Changes to ownership or data classification need the owning team's approval; changes to allowed agent actions also need governance; no agent changes its own allowed actions. | V.1 |  |
| REQ-OWN-12 | MUST | Each service's change-intake path names a work queue, a request template and an expected response time; agents file cross-team requests there. | V.1 |  |
| REQ-OWN-13 | SHOULD | Owners attest non-derivable fields on a schedule; open drift or lapsed attestation caps agent actions on that service at Advise (L0), except catalog-repair PRs, which still need owner approval. | V.1 |  |

### CFG: config

Feature flags, config changes and agent configuration as production config.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-CFG-01 | MUST | Config and feature-flag changes are versioned, canaried per ring, and can be paused, rolled back or turned off. | II.9 | Step 0 |
| REQ-CFG-02 | MUST | Every flag is registered at creation with owner, expiry date and cleanup ticket; flag changes ride the II.9 rings. | II.10 |  |
| REQ-CFG-03 | SHOULD | Flag removal PRs go through the normal PR gates; auto-merge only after a clean Act on approval record. | II.10 | Step 1 |
| REQ-CFG-04 | MUST | Agent prompts, skills, tool scopes and action-policy entries are production config: changed by PR, rolled through rings, reversible. | IV |  |

### SEC: security and compliance

Data handling, provenance, the factory as a high-value target.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-SEC-01 | MUST | Intake agents inherit the caller's backlog permissions; feedback and incident text is PII-redacted as in II.2. | II.1 | Step 8 |
| REQ-SEC-02 | MUST | Data classification in a PRD triggers privacy and compliance review automatically; transcripts pass PII redaction before model calls. | II.2 | Step 4 |
| REQ-SEC-03 | MUST | A threat model accompanies every HLD; a new endpoint, caller identity, data class or trust boundary triggers security review, and the design states per-caller authorization and agent access by role. | II.4 | Step 4 |
| REQ-SEC-04 | MUST | Release artifacts are built hermetically from verified main, signed and immutable, with provenance (commit, PR, reviewers, agent identity and its accountable human sponsor (see IV.4), risk score and model version) that deployment verifies. | II.8 |  |
| REQ-SEC-05 | MUST | Agents read only aggregated, privacy-approved telemetry with PII redacted. | II.10 |  |
| REQ-SEC-06 | MUST | Agent sandboxes, model and MCP gateways and tool servers are in SFI scope, with their own identities and no standing production access; the deploy gate verifies that the approver is not the requester. | IV |  |
| REQ-SEC-07 | MUST | Content agents read is untrusted; write scopes come only from the task's action-policy entry, and high-impact tools require step-up scope per operation. | IV |  |
| REQ-SEC-08 | MUST | The model gateway is the only model egress from sandboxes and agents. It attributes each request to agent, requester, team and task, redacts sensitive data, and records the model version. | V.2 | Step 0 |

### GOV: trust and governance

The action policy, the trust ledger, promotion, demotion and kill switches.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-GOV-01 | SHOULD | Each intake agent has a per-service filing rate limit, and its themes, drafts and merges are recorded in the trust ledger with owner accept and undo rates. | II.1 | Step 8 |
| REQ-GOV-02 | MUST | Clarification rate after the gate and rework traced to requirements are recorded per PRD in the trust ledger, for agent-drafted and human-drafted PRDs alike. | II.2 | Step 4 |
| REQ-GOV-03 | SHOULD | Mid-implementation spec changes and review findings traced to a missing criterion are recorded in the trust ledger, for agent-drafted and human-drafted specs alike. | II.3 | Step 4 |
| REQ-GOV-04 | MUST | The trust ledger records, per task class, merge rate, revert rate, CI rounds and human-pushed commits; tasks are routed to agents only in classes that meet the bar. | II.5 | Step 5 |
| REQ-GOV-05 | MUST | The ship, iterate or drop verdict is the owner's; the report, queries and sign-off are stored with the flag record, and the agent's proposal outcomes go to the trust ledger. | II.10 |  |
| REQ-GOV-06 | MUST | The tracker records per-consumer status to 100% and the trust ledger records end-to-end time (including review and landing) and revert rate per class. | II.12 | Step 3 |
| REQ-GOV-07 | MUST | Autonomy is assigned per action in a versioned agent action policy (template: D6). Each entry names the action, its rung, scope, guardrail, owner and kill switch. Tools check the policy before acting. | III | Step 0 |
| REQ-GOV-08 | MUST | No agent approves its own output or the tests that judge it. At Act, then notify, a change lands only because deterministic gates pass. | III |  |
| REQ-GOV-09 | MUST | Every agent action writes a trust-ledger record (template: D7): action ID, rung, agent identity, sponsor, requester, approver, model and harness version, verifier results, human decision, outcome and cost. | III | Step 0 |
| REQ-GOV-10 | MUST | An action is promoted one rung at a time, by a named owner in a promotion review, against a human-only baseline for the same class recorded before agents start. Operations actions also need replay agreement on past incidents. | III |  |
| REQ-GOV-11 | MUST | Demotion is automatic: a revert in an Act, then notify class, a wrong-target action or an escaped defect drops that action one rung. Auto-fix loops stop after two consecutive auto-fix commits and never retry a reverted fix. | III |  |
| REQ-GOV-12 | MUST | Each action and each agent identity has a kill switch owned by on-call that takes effect without waiting for token expiry. | III | Step 0 |
| REQ-GOV-13 | MUST | A model, prompt or harness change re-runs the evaluation and replay set; affected Act, then notify actions fall back to Act on approval until results match. LLM judges are measured against human labels before they block. | III |  |
| REQ-GOV-14 | MUST | Every agent runs under its own Entra Agent ID with a recorded sponsor, never a borrowed human identity or a static API key. Developer-requested work uses OBO; unattended work uses app-only, each with its own Conditional Access policy. | III | Step 0 |
| REQ-GOV-15 | MUST | The requester of an agent's work is its author of record; a different owner from the service catalog (see V.1) approves it, except in mechanical classes promoted to Act, then notify. | III |  |
| REQ-GOV-16 | SHOULD | A roadmap step starts only when the previous step's exit criteria hold for that service. No action is enabled at Autonomous within budget without a separate review. | III |  |
| REQ-GOV-17 | SHOULD | Cost per accepted change, including human review hours, is measured through a central gateway from Step 0, with spend alerts that trigger investigation. | III | Step 0 |
| REQ-GOV-18 | MUST | Trust-ledger records are written by deterministic components (gateways, verification service, merge queue, deployment orchestrator, watchdog), append-only and keyed by run ID; an agent's own report is never the record of an outcome. | V.2 | Step 0 |

### COST: cost and capacity

Task budgets, quotas and review throughput.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-COST-01 | MUST | Each task has a CI-round cap (default 2), a wall-clock limit and a token budget; on any limit it stops and hands its log to the owner. | II.5 | Step 5 |
| REQ-COST-02 | SHOULD | Agents get per-agent quotas on CI and shared pre-production; each campaign is sized against owners' measured review throughput, and agent PR generation slows when review queue time rises. | IV |  |

### PRD: requirements and PRDs

Intake records, priority rules, the PRD template and its ready gate.

| ID | MUST/SHOULD | Requirement | Section | Roadmap step |
|---|---|---|---|---|
| REQ-PRD-01 | MUST | Every signal enters as an intake record from one template (template: proposed); deduplication uses deterministic keys, and agent-suggested duplicates are merged only after owner approval and remain reversible. | II.1 | Step 8 |
| REQ-PRD-02 | MUST | Priority is computed by a published rule with floors for compliance deadlines and repeat incidents; agents may supply inputs but never set or override priority. | II.1 | Step 8 |
| REQ-PRD-03 | MUST | Every PRD uses one template whose required fields (see the completeness check above) are enforced by a linter. | II.2 | Step 4 |
| REQ-PRD-04 | MUST | A PRD passes "ready for spec" only with zero open questions, testable criteria and all required sign-offs recorded. The gate is deterministic; no agent approves a PRD. | II.2 | Step 4 |
| REQ-PRD-05 | MUST | The grilling agent outputs open questions explicitly and never resolves an ambiguity by assumption. | II.2 | Step 4 |
| REQ-PRD-06 | MUST | Before the ramp starts, every acceptance criterion is bound to a named telemetry query and threshold, so pass or fail is computed, not judged. | II.10 |  |
