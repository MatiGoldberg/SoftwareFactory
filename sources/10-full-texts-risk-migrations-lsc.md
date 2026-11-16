# Full-text deep reads: Gandalf, Google migrations, DORA capabilities, Meta release risk, Google LSC, Meta config safety

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase. Items marked "(summary)" came from a model-extracted summary of a truncated page and are less reliable.

---

## [MS-GANDALF-NSDI] (full paper) Gandalf: An Intelligent, End-To-End Analytics Service for Safe Deployment

URL: https://web.eecs.umich.edu/~ryanph/paper/gandalf-nsdi20.pdf
Publisher / authors: USENIX NSDI '20; Ze Li et al. (Microsoft Azure), Peng Huang (JHU), Qingwei Lin (MSR)

**Summary.** Gandalf ingests deployment events, failure signals and perf counters; clusters raw errors into fault signatures; flags anomalies vs a learned baseline; attributes each anomaly to the most likely rollout; a classifier assesses impact scope and issues go/no-go. Lambda architecture: speed layer for immediate issues, batch layer for latent ones. Decisions written to a key-value store that the deployment engine reads to halt rollouts. Positioned as the *last* of four safety layers (testing → SDP process policy → component watchdogs → Gandalf).

**Key mechanisms**
- Azure rollout order: stage → canary → pilot → light region → heavier region → half of region pairs → other half.
- Unified event schema (timestamp, location, pivot group, build version, signature).
- Holt-Winters baseline over 30 days, 1-h steps; anomaly at >4σ.
- Vote-veto: a fault votes for components deployed earlier on the same node and vetoes those deployed after; windows 1/24/72 h; exponential weighting toward faults closer to deployment; spatial score (share of faulting nodes that received the deployment) with a confidence cut-off; time decay for older rollouts.
- Gaussian discriminant classifier on impact scope (clusters, nodes, customers); trained with component-team feedback; no static thresholds.
- Per-signature weights 0–100 set by developers; weight 0 whitelists expected noise (e.g., reboots during OS image rollout).
- On no-go: email owning team, open incident with evidence, stop rollout via KV store. UI: binary decision page, rollout profile, issue pivots (e.g., by hardware SKU).

**Numbers & evidence**
- >18 months in production; >300 deployments/day in Azure; ~45% of clusters get multiple deployments/day; >70% of rollouts span multiple clusters.
- Data plane: 92.4% precision, 100% recall, 155 critical failures captured in 8 months. Control plane: 94.9% precision, 99.8% recall over 1,200+ region-level deployments (2 misses, 2 false alarms).
- (summary) 99.2% of suspicious data-plane rollouts stopped before broad production; fleet deployment time cut by more than half.

**Notable quotes**
- "Gandalf serves as the last safeguard"

**Relevance:** concrete blueprint for an automated, evidence-producing promotion gate tied to the deploy engine; developer-tunable noise weights; decision evidence routed to owning teams.

---

## [GOOG-MIGRATIONS] (full paper) How is Google using AI for internal code migrations?

URL: https://arxiv.org/html/2501.06972v1
Publisher / authors / date: Google Core + Google Ads; Nikolov et al.; 2025-01-12. Experience report.

**Summary.** Fine-tuned Gemini (DIDACT) for large migrations. Main case: int32 → int64 IDs in Google Ads (500M+ lines). Deterministic static analysis (Kythe, Code Search, AST tools) finds locations; an LLM toolkit generates edits; build + unit tests validate, with optional LLM repair. Humans own both ends: experts scope, engineers check and fix, owning reviewers approve sharded changes. LLMs alone are insufficient; combine AST, heuristics and LLMs. Success metric: ≥50% end-to-end time saved. Also JUnit3→4, Joda→java.time, flag cleanup.

**Key mechanisms**
- 3-step workflow: expert finds seed + file superset → toolkit runs autonomously to test-passing changes → same engineer reviews/fixes, then shards to code owners.
- Kythe references expanded breadth-first from a protobuf seed; regex/parsing to remove false positives.
- Related files (tests, interfaces, deps) added to context via cross-references; few-shot examples.
- Parallel prompt variants (pass@k by prompt) scored by validations.
- Principle: tools decide *where* and *verify*; the LLM writes the edit.

**Numbers & evidence**
- Manual estimate "hundreds of software engineering years"; 80% of modifications in landed CLs fully AI-authored; ~50% time saved incl. review and landing.
- JUnit3→4: 5,359 files, 149K+ lines in 3 months; ~87% of AI code committed unchanged.
- (summary) Joda: ~89% time saved on small clusters.

**Notable quotes**
- "The use of LLMs alone through simple prompting is not sufficient for anything but the simplest of migrations."
- "The bottleneck in the process was the speed at which engineers could review the changes."
- "Humans review the LLM-generated code the same way as any other code"

**Relevance:** the reference workflow for bulk change across many owners; reviewer bandwidth is the rate limit; measure end-to-end.

---

## [DORA-AICM] Introducing the DORA AI Capabilities Model

URL: https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model
Publisher / authors / date: Google Cloud (DORA); Kevin M. Storer, Derek DeBellis; 2025-09-23

**Summary.** Seven capabilities that amplify AI's benefits, derived from 78 interviews, instrument validation, and ~5,000 survey responses. Tools alone aren't enough; without user focus AI adoption can hurt team performance; version control is a critical safety net as change volume grows.

**The seven capabilities**
1. Clear and communicated AI stance (expectations, experimentation support, permitted tools).
2. Healthy data ecosystems.
3. AI-accessible internal data (company context connected to AI tools).
4. Strong version control practices (frequent commits; practiced rollback).
5. Working in small batches.
6. User-centric focus (without it AI can have a negative impact).
7. Quality internal platforms (guardrails and shared capabilities).

**Notable quotes**
- "Encourage teams to become highly proficient in using rollback and revert features."
- "A quality internal platform provides the necessary guardrails and shared capabilities"

**Relevance:** readiness checklist for the organization before/while building the factory.

---

## [META-RELEASE-RISK] Moving Faster and Reducing Risk: Using LLMs in Release Deployment

URL: https://arxiv.org/html/2410.06351v1
Publisher / authors / date: Meta; Abreu, Murali, Rigby, Maddila, … Mockus, Nagappan; 2024-10-08

**Summary.** Diff risk scores predict a diff's chance of causing a SEV so release engineers gate the riskiest diffs during freezes instead of freezing everything. Compares production logistic regression, StarBERT (RoBERTa), and CodeLlama variants. Best: iDiffLlama-13B (pretrained on internal diffs, risk-aligned fine-tuning). Scores shown in Phabricator with reasons and suggested actions.

**Key mechanisms**
- Gating zones by top-X% risk: weekends top 5%, yellow top 10%, red top 50% (e.g., Black Friday). Gated developers wait, reduce risk, or escalate with standard reasons.
- Baseline features (~a dozen): diff size/diffusion, file criticality (prior SEVs), file properties, author expertise.
- Inputs to LLMs: diff title, test plan, unidiff. Chronological train/test split.

**Numbers & evidence**
- Baseline captures 18.7% / 27.9% / 84.6% of SEVs gating top 5/10/50%. iDiffLlama-13B captures 1.40× / 1.52× / 1.05× that (≈26.2% / 42.3% / 88.5%).
- (summary) 855K training diffs, 0.23% caused SEVs; generalized to a second org.

**Notable quotes**
- "Diffs that are beyond a particular threshold of risk can then be gated."

**Relevance:** tunable risk-based gate; developers need reasons and actions with the score; keep a simple baseline.

---

## [GOOG-LSC] Large-Scale Changes (Software Engineering at Google, ch. 22)

URL: https://abseil.io/resources/swe-book/html/ch22.html
Publisher / authors: O'Reilly / abseil.io; Hyrum Wright (case study Adam Bender)

**Summary.** At scale, atomic sweeping commits are infeasible, so LSCs are a standard practice: automated tooling generates the change, a central infra group supports it, it's sharded into independent reviewable pieces, tested via transitive-closure tests and the TAP train, and submitted by Rosie. A lightweight committee authorizes LSCs; reviews can route to a global approver; local owners can appeal but have no veto.

**Key mechanisms**
- Phases: authorization → change creation → shard management → cleanup.
- Proposal: reason, estimated shards, FAQ, API-owner review; committee of ~a dozen can fast-track.
- Tooling recommended above ~500 edits; formatters as separate pass so changes look human-written.
- Rosie shards by project boundaries and ownership; each shard runs test-mail-submit; caps outstanding shards; low priority.
- TAP train every 3 h: sample 1,000 tests per change, combine passing changes, run the union of affected tests, bisect non-flaky failures, report per change.
- Global approvers review mechanical patterns; local owners review only where local context matters.

**Numbers & evidence**
- scoped_ptr → unique_ptr: >500,000 references; peak >700 changes/day touching >15,000 files (sometimes 10× now).
- 10–20% of changes in a project are LSCs. Operation RoseHub: >2,600 patches.

**Notable quotes**
- "Rosie takes a large change and shards it based upon project boundaries and ownership rules"
- "they don't hold a veto over the broader LSC"

**Relevance:** the pre-AI governance model for bulk changes across many owners — directly reusable for agent-generated fleet changes.

---

## [META-CONFIG-SAFETY] Trust But Canary: Configuration Safety at Scale (Meta Tech Podcast)

URL: https://engineering.fb.com/2026/04/08/security/trust-but-canary-configuration-safety-at-scale-meta-tech-podcast/
Publisher / date: Engineering at Meta; 2026-04-08. Podcast landing page only (no transcript).

**Summary.** Topics: canarying and progressive rollout for config, health checks catching regressions early, blameless incident reviews, ML for alert-noise reduction and faster bisection.

**Notable quotes**
- "As AI increases developer speed and productivity it also increases the need for safeguards."

**Relevance:** framing only; config changes need the same progressive gates as code.
