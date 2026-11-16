# Multi-repo coordination, API contracts, ownership, and pipeline compliance

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase. Items marked "(summary)" came from a model-extracted summary of a truncated page.

---

## [MS-AZURE-BREAKING-CHANGES] Azure's approach to versioning and avoiding breaking changes

URL: https://devblogs.microsoft.com/azure-sdk/azure-approach-to-versioning-and-avoiding-breaking-changes/
Publisher / authors / date: Azure SDK Blog; Mike Kistler, Jeffrey Richter; 2023-03-06

**Summary.** An API version is a contract that fully defines behavior: any behavior change needs a new version. All REST API definitions live in the azure-rest-api-specs GitHub repo; PRs are checked by tooling, and flagged PRs can't merge without approval from the Breaking Change Review Board (weekly office hours, usually proposes non-breaking alternatives). Breaking changes to GA are reserved for security/compliance/legal or rare architecture needs, with notice and typically three years to migrate. Previews are looser (90 days to move off).

**Key mechanisms**
- `api-version=YYYY-MM-DD[-preview]`.
- azure-openapi-diff compares each PR to the latest GA and preview, detects 47 change types, applies `BreakingChangeReviewRequired`; changes without a version bump get `NewApiVersionRequired`; merge blocked until `Approved-BreakingChange`.
- Next: validate live traffic against the API definition; active testing of definitions in CI.

**Notable quotes**
- "Any change of behavior requires a change in the API version."

**Relevance:** the Microsoft-native answer to cross-team contract safety: central spec repo + automated diff + blocking label + central board. Directly reusable as a factory gate for agent-authored API changes.

---

## [MS-API-GUIDELINES] Considerations for Service Design (Azure REST API guidelines)

URL: https://github.com/microsoft/api-guidelines/blob/vNext/azure/ConsiderationsForServiceDesign.md
Publisher / date: Microsoft; latest history entry 2024-03-17

**Summary.** Azure REST design guidance: version from the first release; never break customer workloads; let customers adopt new versions without code changes. Design for change up front (extensible string enums, ETags, server-side paging from day one). Define hero scenarios and OpenAPI early; ≥2 previews before GA. Deprecation via `azure-deprecating` header (owner emails often don't reach developers). Standard LRO pattern. Engage the Azure REST API Stewardship Board early.

**Key mechanisms**
- Idempotent operations; `:<action>` suffixes; LRO `Operation-Location` + `retry-after`.
- (summary) Changing status/error codes or adding pagination later is breaking; `x-ms-request-id` on every response.

**Notable quotes**
- "DO ensure that customer workloads never break"

**Relevance:** checklist for service templates so later changes (including agent-made ones) stay non-breaking.

---

## [MS-HOW-MSFT-DEVOPS] How Microsoft develops with DevOps

URL: https://learn.microsoft.com/devops/develop/how-microsoft-develops-devops
Publisher / date: Microsoft Learn; 2022

**Summary.** One Engineering System on trunk-based "release flow": branch, push, PR, merge. Short-lived topic branches + feature flags; PRs run build policies, a fast test pass and owner-based review; `main` always buildable. Release branches per ~3-week sprint; hotfixes always start in `main` then are cherry-picked. Deployment in rings. Repo structure varies: monorepos with component folders and multi-repo (often chosen by microservice teams); pipelines organized by component.

**Key mechanisms**
- Owners of touched code are required automatic reviewers.
- Branch policies block direct pushes to `main`; only release managers create `releases/*`.
- Post-merge acceptance tests.

**Numbers & evidence.** Some repos: several hundred developers, 200+ PRs/day into `main`, 300+ CI builds/day, 500+ test runs/day; ~60,000 tests in <5 minutes per PR.

**Notable quotes**
- "The process always starts by making the change in `main` first."

**Relevance:** baseline of how Microsoft teams already branch, review and ring-deploy — the factory should plug into this, not replace it.

---

## [MS-IT-COMPLIANT-ENG] Enabling secure and compliant engineering with Azure DevOps

URL: https://www.microsoft.com/insidetrack/blog/enabling-secure-and-compliant-engineering-with-azure-devops/
Publisher / date: Microsoft Inside Track (Microsoft Digital); 2020-09-17

**Summary.** Microsoft Digital built compliance into pipelines for 900+ services, 3,000+ engineers, 3,800 repos. Three parts: know what's production; run compliance tooling consistently; clear ownership of code and pipelines. A central service catalog links services → repos → subscriptions → owners and drives which compliance tasks apply. Production = `main`; only `main` builds can deploy to production. Pipelines live in folders mirroring the service tree.

**Key mechanisms**
- Catalog metadata triggers scans: UI → accessibility; web endpoints → vulnerability scanning; code → static analysis; Azure resources → Secure DevOps Kit policies.
- Every area path maps to a team and repos; a repo maps to a service from creation.
- Central compliance scans on production code; planned pre-deployment gates and artifact filters.

**Numbers & evidence.** Per day: 1,000 PRs, 7,000 commits, 2,800 builds, 650 releases.

**Notable quotes**
- "Every area path in Azure DevOps has a team and associated set of repositories."
- "we always host production code in the main branch of a repo."

**Relevance:** the service catalog (Service Tree-style) is the backbone for multi-repo ownership and compliance; agents should read it to know owners, scope, and required gates.

---

## [AWS-ROLLBACK-SAFETY] Ensuring rollback safety during deployments

URL: https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/
Publisher / authors / date: Amazon Builders' Library; Sandeep Pokkunuri; 2019-12-05

**Summary.** "Avoid walking through one-way doors": prepare for rollback before every deployment and verify backward compatibility at every revision. Most failed rollbacks come from protocol changes (serialization, timing) the old version can't handle. Main technique: two-phase deployment — Prepare (read new format, still write old) → bake a few days → Activate (write new). Serialization best practices and upgrade-downgrade testing in production-like environments.

**Key mechanisms**
- Verify Prepare completed on every server before Activate; coordinate across microservices.
- Backfill after Activate before removing the old read path.
- Version serializers independently of builds; store version with data; preserve unknown attributes; emit version metrics.
- Upgrade-downgrade tests with same deployment order and multi-AZ topology; readers before writers rolling forward, writers before readers rolling back.
- Don't trust `minimumHealthyHosts` alone; check every server.

**Notable quotes**
- "we fully prepare ourselves for a rollback before every deployment."

**Relevance:** the cross-service compatibility discipline the factory must enforce, since agent changes across many services create mixed-version periods.

---

## [ATLASSIAN-AGENT-LOOPS] We're bringing governed agent loops to the AI-Native SDLC

URL: https://www.atlassian.com/blog/jira/governed-agent-loops
Publisher / date: Atlassian; Taroon Mandhana (CTO, AI & Teamwork); 2026-09-10. Product announcement, mostly beta/early access.

**Summary.** Agents move from one-off sessions to governed loops over the backlog: Code Context across multi-repo codebases (Teamwork Graph), Agent Context Controls (which agents can operate where and see what), Jira agent loops delegating unassigned work, Standards defined once and mapped to repos, AI Review on every PR against those standards, humans keep the merge button, DX metrics for throughput, quality, adoption, cost.

**Numbers & evidence.** "94% … using AI, but only 6% have the systems to actually scale it" (Atlassian survey); "roughly 64% more per developer" with most context (DX analysis, unverified).

**Notable quotes**
- "developers stay in control of the merge button but stop being the bottleneck for everything leading up to it."

**Relevance:** standards-mapped-to-repos and per-agent context controls are useful multi-team governance concepts (vendor claims).

---

## [MABL-75-REPOS] How We Built a System for AI Agents to Ship Real Code Across 75+ Repos (Part 1)

URL: https://www.mabl.com/blog/how-we-built-a-system-for-ai-agents-to-ship-real-code-across-75-repos
Publisher / date: mabl (25-engineer vendor; not frontier); Geoff Cooney; 2026-04-08

**Summary.** Four layers: Cross Repo Base (shared rules, dependency graphs), skills on MCP (~40), operations and governance, and (Part 2) a ticket-to-merged-PR pipeline. Per-repo CLAUDE.md with purpose, dependencies, conventions. A central Repo Coordination Graph (79 repos) tells agents which repos to change, merge order (upstream first), and reviewers from CODEOWNERS. Isolated worktrees; hooks block edits to the wrong workspace. AI review can block but not approve; humans merge.

**Key mechanisms**
- Coordination graph: dependencies, Pub/Sub topic maps, DB table ownership, prescribed release order.
- "Any breaking change requires coordinated PRs."
- Auto-fix circuit breakers (stop after two consecutive auto-fix commits; never retry a reverted fix); limited to lint/imports/simple types.
- Org rules in Terraform: one human approval, squash-only, no force push, required checks, merge queue.

**Numbers & evidence (self-reported).** AI-assisted commits 10% → 39% (60% in infra repos) Aug 2025 → Feb 2026; PRs 230 → 370+/month; context-drift failures ~40% → <5%.

**Notable quotes**
- "AI code review blocks problematic PRs but explicitly cannot approve them."

**Relevance:** the most concrete published design for cross-repo agent coordination (dependency/ownership graph + release order), albeit at small scale.
