# Microsoft: safe deployment practices (SDP) and Gandalf

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase. Gandalf paper: abstract only.

---

## [MS-SDP-LEARN] Safe deployment practices (Azure DevOps docs)

URL: https://learn.microsoft.com/devops/operate/safe-deployment-practices
Publisher / date: Microsoft Learn; 2022-07-25 (updated 2022-11-28)

**Summary.** Safe deployment as progressive exposure: a release reaches broader audiences as it proves itself in production. Tier-based rollout (tiers 0–4), feature flags and opt-in as exposure controls, bake time between tiers. Lists early-adoption problems (large payloads, no service isolation, manual steps, Ops-only deployments, no rollback) and principles (same tooling everywhere, daily quality signals, zero-downtime, deploy in working hours). Defines hotfix rules by severity.

**Key practices & mechanisms**
- Tier 0 = internal users in one datacenter; later tiers add customers, scale checks, then all remaining scale units.
- Bake time ~24 hours generally; include a full business day for business-hours-peak services.
- Hotfix routing: Sev 0 may go directly to the affected scale unit; Sev 1 via tier 0 then affected units after approval; lower severities go through all tiers.
- Feature flags/opt-in: code shipped dark, enabled per tier, deployment, or user.
- Same deployment tooling in dev, test, prod; CD platform with automation plus granular authorization on who can start which deployment.

**Numbers & evidence.** 5-tier example; ~24h bake. No outcome metrics.

**Notable quotes**
- "A typical tier deployment model is designed to find issues as early as possible through the careful segmentation of users and infrastructure."

**PDLC stages:** testing, deployment, post-deploy validation, monitoring, governance.

**Relevance:** template for promotion gates; explicit emergency-change policy; who-may-deploy authorization.

---

## [MS-SDP-BLOG] Advancing safe deployment practices

URL: https://azure.microsoft.com/en-us/blog/advancing-safe-deployment-practices/
Publisher / authors / date: Microsoft Azure Blog; Mark Russinovich (written by Cristina del Amo Casado, Azure Compute); 2020-02-05

**Summary.** Azure's SDP moves all code AND configuration changes through stages with monitored health: integration/test validation → canary regions (Early Updates Access Program) → pilot (more hardware diversity) → incremental regions, respecting region pairs and Availability Zones (one zone, then the paired region). Rollout is automated and policy-driven, with mandatory health signals and centrally set bake times. Emergency acceleration exists but is very rare. Future: richer signals, ML correlation/anomaly detection, more automatic rollback.

**Key practices & mechanisms**
- Canary regions are full Azure regions (one with AZs, one without) running production-level E2E validation, fault injection, DR drills.
- Pilot phase covers diverse hardware (GPU, large-memory, multiple CPU generations).
- Global services that can't roll per region shift traffic progressively via Azure Traffic Manager.
- Policies, not developers, set rollout speed; bake times cover full load patterns.
- Emergency path: deploy to all of Azure at once for critical vulnerabilities under defined conditions.

**Numbers & evidence.** "over a thousand new capabilities released in the last year." No failure-rate metrics.

**Notable quotes**
- "change is expected, and we plan for it."
- "These exceptions are very rare, in general our deployment tools and processes intentionally sacrifice velocity"

**PDLC stages:** testing, deployment, post-deploy validation, monitoring, governance.

**Relevance:** canary→pilot→region sequence with AZ/region-pair rules; central mandatory rollout policy; config changes gated like code.

---

## [MS-WAF-SDP] Architecture strategies for safe deployment practices (Well-Architected OE:11)

URL: https://learn.microsoft.com/azure/well-architected/operational-excellence/safe-deployments
Publisher / date: Microsoft Learn, Azure Well-Architected Framework; 2026-02-11 (updated 2026-06-17)

**Summary.** Four guidelines: safety and consistency, progressive exposure, health models, issue detection. Canary and blue-green rollouts with bake times in hours/days; immediate halt-and-recover on alert; recovery by rollback, roll-forward, or redeploying last known good. Guardrails: versioning, trunk-based branching, automation, CI, feature flags, staging, predeployment checks, circuit breakers. Emergency SDP protocol, safe decommissioning, and an AI callout on data-driven rollout tuning.

**Key practices & mechanisms**
- Every deployment is risky, including IaC, feature flags, config. Deploy regularly to avoid security debt.
- Bake time grows per rollout group to cover time zones and usage patterns.
- Health model: halt on any end-user-impacting alert; continue only if all indicators stay green through bake; include usage metrics to catch silent failures.
- Predeployment checks: code review, security scans, compliance; simulate network rule changes (Network Watcher rule impact analyzer).
- Emergency SDP: defined approvers and criteria for accelerating approvals, testing, bake time.
- Decommissioning: validate inactivity over a full business cycle, snapshot, disable before delete, watch through peaks.

**Notable quotes**
- "There are no low-risk deployments to production."
- "Frequent small deployments are preferable to infrequent large deployments."
- "Treat every deletion as irreversible and follow a deliberate, safety-first approach"

**PDLC stages:** code review, testing, deployment, post-deploy validation, monitoring, governance.

**Relevance:** emergency protocol with named approvers; predeploy gate checklist; decommissioning as a lifecycle stage.

---

## [MS-GANDALF-BLOG] Advancing safe deployment with AIOps—introducing Gandalf

URL: https://azure.microsoft.com/en-us/blog/advancing-safe-deployment-with-aiops-introducing-gandalf/
Publisher / authors / date: Microsoft Azure Blog; Mark Russinovich with Ken Hsieh, Ze Li, Yingnong Dang, Murali Chintalapati; 2021-06-30

**Summary.** Gandalf is a global intelligent deployment watchdog that works alongside local watchdogs, SDP policies, and pre-qualification tests. It ingests perf counters, data/control-plane failure signals, and deployment events; uses ML baselines instead of fixed thresholds; correlates faults with rollouts using temporal, spatial, and fault-age signals; and makes go/no-go decisions by impact scope. Streaming for fast decisions, batch for latent issues over 30 days. Now the default baseline for release validation across many Azure services; gives engineers a single source of truth.

**Key practices & mechanisms**
- Vote-veto to attribute concurrent faults to specific rollout components.
- Fault age weights newer rollouts more.
- Developers can tune signal weights (domain knowledge into the model).
- Streaming (Azure Data Explorer, ±1h around each node deployment) + batch (Cosmos, 30 days), both every 5 minutes.
- Signal registration mandatory when onboarding new components.

**Numbers & evidence.** >200 datacenters, >60 regions; ±1h streaming window; 30-day batch; 5-minute cadence.

**Notable quotes**
- "Gandalf has become a default baseline for all release validations"

**PDLC stages:** deployment, post-deploy validation, monitoring, governance.

**Relevance:** change-to-fault attribution is the core capability a factory needs; automated go/no-go with human-tunable weights; plan a long batch window for latent bugs.

---

## [MS-GANDALF-NSDI] Gandalf: An Intelligent, End-To-End Analytics Service for Safe Deployment in Large-Scale Cloud Infrastructure

URL: https://www.usenix.org/conference/nsdi20/presentation/li (PDF: https://web.eecs.umich.edu/~ryanph/paper/gandalf-nsdi20.pdf)
Publisher / authors / date: USENIX NSDI '20, pp. 389–402; Ze Li, Qian Cheng, Ken Hsieh, Yingnong Dang, et al. (Microsoft Azure), Peng Huang (JHU), Qingwei Lin (MSR)

**Summary.** End-to-end analytics service assessing rollout impact to catch bad rollouts early. Correlates each fault signal against all ongoing rollouts spatially and temporally; ensemble ranking attributes the culprit rollout; a binary classifier assesses impact; result decides proceed/stop. Lambda architecture for real-time + long-term monitoring with automated decisions and notifications.

**Numbers & evidence**
- >18 months in production in Azure Compute.
- Data-plane: 92.4% precision, 100% recall; no high-impact Azure Compute outages caused by bad rollouts in that period (per abstract).
- Control-plane: 94.9% precision, 99.8% recall.

**Notable quotes**
- "catch bad rollouts before they cause widespread outages"

**Relevance:** precision/recall baseline for trusting an automated promotion gate; tune gates per component class (data vs control plane).
