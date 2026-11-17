## Part I: What frontier companies learned

The companies furthest ahead found that generating code was the easy part. What limits them is checking it, giving agents the right context, and deploying it safely. Where they grant autonomy, it is earned one action at a time. Eight lessons recur in what they published. Each gets a claim, the strongest evidence, the main caveat and a "So for an existing service:" line, which is this document's own recommendation, not a company's practice. The later sections show the detail, and I.2 shows where the evidence is strong and where it is thin.

### I.1 Cross-cutting lessons

**1. Verification and review become the bottleneck, not code generation.**

Google's migration report says "The bottleneck in the process was the speed at which engineers could review the changes." [GOOG2], and Spotify reports "76% more PRs to review" [SPOT2]. One Uber conference talk reports that a 44% rise in hourly merge requests pushed P95 land time from 30 minutes to 3 to 4 hours [AIE3]. Microsoft's response is an AI first-pass reviewer, now on over 90% of PRs (over 600K a month), with an early 10 to 20% improvement in median PR completion time [MS6].

*Caveat:* Microsoft publishes no method for its 10 to 20% figure, and no source compares defect or revert rates of AI-reviewed against human-only-reviewed PRs (see II.6).

> **Takeaway:** So for an existing service: plan review and merge capacity before agent volume, and measure time through to merge, not PRs opened (see II.6, II.8, IV.8).

**2. The harness matters more than the model, and it must be re-tested when the model changes.**

The harness is everything around the model: instructions, tools, sandbox, verifiers and the orchestration loop. In dotnet/runtime, Copilot Coding Agent's success rate rose from 41.7% in its first month to about 71% recently, and repo instructions and environment setup reportedly raised it [MS8]. Anthropic's agent running alone (no planner or evaluator) built a game maker in 20 minutes for $9 with a core feature broken, against 6 hours and $200 with the full harness; Anthropic warns that "every component in a harness encodes an assumption about what the model can't do on its own" [AN3]. OpenAI's team shipped about 1M lines in five months with no manually written code by investing in docs, lints and agent-legible environments [OAI1].

*Caveat:* harness parts age. Spotify's LLM judge vetoed about 25% of sessions while "We have yet to invest in evals for our judge." [SPOT4], and was later removed as too rigid [SPOT7] (an InfoQ report of a talk).

> **Takeaway:** So for an existing service: version the harness like code, and treat a model change as a new version of every agent action, which re-runs its evaluation set (see III.2, II.5).

**3. Standardize the platform, not the tools.**

Microsoft Digital (Microsoft's internal IT organization) built compliance into pipelines for 900+ services and 3,800 repos by letting a central service catalog decide which checks apply [MS28]. In an interview, Shopify's head of engineering puts it as "standardize infrastructure, not tools.": every AI tool goes through one LLM proxy [SHOP1]. Uber routes agents through a model gateway and an MCP gateway (a gateway for the tool servers agents call) that handle auth and telemetry [UBER2, AIE2]. Spotify finds that consistent code makes agents "significantly better" [SPOT2], and it dropped one framework from a migration for too much per-team variability [SPOT5].

*Caveat:* the Shopify and Uber platform evidence comes from an interview, a conference talk and a partly paywalled newsletter.

> **Takeaway:** So for an existing service: put one gateway, one verification service and one agent identity model under whatever tools teams use (see V.2, IV.3).

**4. Start with toil and with work that is easy to verify.**

Microsoft's Inside Track blog reports that Microsoft Digital started with low-risk tasks such as test-case generation, and that toil reduction drove adoption more than any feature [MS15] (guidance with no numbers). Anthropic's engineers delegate verifiable, low-stakes, self-contained work first, and most can fully delegate only 0 to 20% of their work [AN4]. Airbnb migrated about 3.5K test files in six weeks against a 1.5-year manual estimate [ABNB1], and one Duolingo talk reports repository-layer coverage rising from 11% to 72% through agent test PRs, each human-approved [AIE6].

*Caveat:* easy-to-verify work still games its verifier: "A test PR could pass CI by weakening an existing test." [AIE6], and Spotify's early agents commented out failing tests [SPOT7].

> **Takeaway:** So for an existing service: pilot on test backfill or a pending migration, with a deterministic test-only diff check (see VI.2, II.7, II.12).

**5. Context is infrastructure.**

Microsoft Digital's service catalog links services to repos, subscriptions and owners and drives compliance [MS28]. The GA announcement for Azure SRE Agent, Microsoft's AI operations agent (see II.11), says "the most effective agents were those deeply grounded in their team's specific context." [MS10]. OpenAI keeps a short AGENTS.md as "a map, not a 1,000-page instruction manual." [OAI1]. Spotify used lineage data in Backstage (its open-source developer portal and service catalog) to find about 1,800 downstream pipelines and their owners before changing anything, and reusing a human migration guide produced wrong field mappings [SPOT5]. The test-tooling vendor mabl reports context-drift failures falling from about 40% to under 5% after building its cross-repo base and coordination graph (vendor-reported) [MABL1].

*Caveat:* no source measures catalog accuracy or its effect on agent outcomes (see V.1).

> **Takeaway:** So for an existing service: the service catalog, AGENTS.md and the dependency graph are deliverables of Step 0, the readiness step that opens the roadmap (see III.4), kept as code with CI checks (see V.1; templates: D2, D3).

**6. Autonomy is granted per action, on track record.**

Every Copilot Coding Agent PR in dotnet/runtime is opened at a maintainer's explicit request ("CCA cannot open PRs on its own") and merged by a human; its revert rate (3 of 535 merged PRs, against 33 of 4,251 for other PRs) shows no meaningful difference [MS8]. Meta's on-call team says "Grant autonomy action by action." based on the cost of a mistake, the checks that would catch it and the agent's record (one conference talk) [AIE4]. Meta applies the same idea to gates: its Diff Risk Score, a deterministic gate and not an agent, lets low-risk changes land during freezes and holds back only the riskiest diffs [META2, META3] (see II.8).

*Caveat:* the per-action ladder rests on one talk and a product announcement [AIE4, MS10], and no source publishes promotion thresholds (see III.2). Shopify's head of engineering said in an interview that it does not yet let AI check in code automatically [SHOP1].

> **Takeaway:** So for an existing service: record human-only baselines per task class, then promote one action one rung at a time, from Advise up to Act, then notify (see III.1), on evidence in a trust ledger, the per-action record of outcomes (see III.2; templates: D6, D7). No agent ever approves its own output.

**7. Safe deployment is the backstop that makes speed affordable.**

Azure moves all code and configuration through canary, pilot and regional stages with policy-set bake times [MS2], and Gandalf, "the last safeguard", caught bad data-plane rollouts with 92.4% precision and 100% recall [MS5]. AWS deploys "completely hands-off" from a single first host to region waves, with automatic rollback on alarms [AWS1]. Google's SRE guidance assumes "Some defects will reach production." [GOOG5].

*Caveat:* this evidence predates agents, and no source shows an agent halting or rolling back a ring (see II.9). Rings bound blast radius, but Spotify names a PR that passes CI yet is functionally wrong as the most serious agent failure [SPOT4], and a ring only catches it if a health signal moves.

> **Takeaway:** So for an existing service: rings, bake and a deterministic automatic halt are a Step 0 prerequisite; no agent change merges before they exist (see II.9, III.4).

**8. AI amplifies the organization you already have.**

Microsoft's Inside Track blog reports that Microsoft Digital adopted AI without mandates or quotas and moved its measures from usage to flow, rework and incident recovery [MS15]. The 2025 survey of DORA (Google's DevOps Research and Assessment program), with about 5,000 respondents, calls AI a "mirror and a multiplier", with 90% adoption but low trust (24% trust it a lot or a great deal) [GOOG3]; its capabilities model finds that without user focus AI adoption can hurt team performance [GOOG4]. In an interview, Shopify's head of engineering estimates about 20% productivity, explicitly not measured by PRs, with reversion rate roughly flat [SHOP1].

*Caveat:* most productivity figures are self-reported, and Anthropic's authors flag the bias in their own survey [AN4].

> **Takeaway:** So for an existing service: fix flaky builds, weak rollback and unclear ownership first, and judge progress by DORA delivery metrics plus factory metrics such as revert rate and cost per accepted change, against the service's own baseline (see VI.1, VI.4).

**Taken together:** lessons 1, 5 and 7 say what to build first (verification, context, safe deployment); lessons 3 and 8 say where to build it (the shared platform and the existing organization); lessons 2, 4 and 6 say how to let agents in (a versioned harness, small verifiable work and per-action trust). Parts II to VI follow that order.

### I.2 Evidence map

Strong means measured outcomes from three or more companies, or a peer-reviewed study plus others with numbers. Moderate means measured outcomes from one or two companies, or mostly from talks. Thin means no measured outcomes, however many companies describe the practice.

| Stage or concern | Evidence | Main sources | What is missing |
|---|---|---|---|
| II.1 Intake | Thin | MS14, AIE2, AIE11, ATL1 | Any measured outcome beyond one before-and-after anecdote |
| II.2 Requirements agents | Thin | MS13, AN5, SPOT1 | Practice only; no effect on rework |
| II.3 Specification | Thin | MS13, AN3, AN2 | Agreed per-task acceptance checks shown only for single apps |
| II.4 Design, API contracts | Thin | MS25, MS26, AWS3 | Provider-side practice only; no consumer-driven contract testing; no gates for non-REST APIs (gRPC, events) |
| II.5 Implementation | Strong | MS8, STRIPE1, OAI1, SPOT1, SPOT3 | Cost per accepted PR |
| II.6 Code review | Strong | MS6, UBER1, GOOG1 | Defect rates, AI versus human review |
| II.7 Testing | Strong | MS8, META1, ABNB1, AIE6 (a talk) | Microsoft test-generation outcome data |
| II.8 Merge, risk scores | Moderate | META2, META3, GOOG6, AIE3 | No Microsoft merge queue or risk score |
| II.9 Safe deployment | Strong | MS2, MS4, MS5, AWS1, GOOG5 | Agents in the rollout loop |
| II.10 Post-deploy validation | Thin | MS2, MS27, GOOG5 | Flag ramps, experiment platforms |
| II.11 Incidents | Strong for investigation and RCA; thin for autonomous mitigation | MS11, MS9, MS10, AIE4 | Which actions ran without approval |
| II.12 Migrations | Strong | GOOG2, GOOG6, SPOT5, SPOT7, ABNB1 | Post-merge defect rates |
| III Trust ledger, per-action autonomy | Thin | AIE4, MS10, MS8 | Promotion thresholds, kill-switch timing |
| IV.4 Agent identity | Thin | MS12, MS22, MS24, GOOG7 | Product docs and design only; no production outcomes |
| V.1 Service catalog | Thin | MS28, SPOT5, SPOT8, MABL1 | Catalog accuracy and freshness; mabl's figure covers its whole system |
| Org adoption | Strong (surveys) | GOOG3, GOOG4, AN4, MS15 | Outcome data beyond self-report |

Evidence is strongest at the two ends a factory shares with pre-agent practice: bulk change (migrations, implementation, review, testing) and safe deployment. It is thinnest where agents would take on judgment: requirements, specification, cross-team contracts and the rules for promoting an agent's autonomy. The roadmap in III.4 follows the same order. So begin where the evidence is strongest, and treat everything in the thin rows as an experiment with its own baseline.

### Open gaps

- No source measures whether requirements or grilling agents reduce rework or defects (see II.2).
- No frontier company has published consumer-driven contract testing at scale (see II.4, IV.2).
- No source publishes promotion thresholds for a trust ledger, or the time a kill switch takes to act (see III.2).
- No source compares defect or revert rates of AI-reviewed and human-only-reviewed changes (see II.6).
- Lessons 1, 3, 4, 5, 6 and 8 lean partly on conference talks (AIE2, AIE3, AIE4, AIE6), interviews (SHOP1), vendor reports (MABL1) and grade C Microsoft posts (MS10, MS15).
- The stage table stands in for the planned evidence heat map (the skeleton's diagram D1, not kit item D1); the owner should confirm that no stage-by-company diagram is needed.
- Proposed kit item: a one-page evidence map kept current as new sources arrive, with grade and date per row (template: proposed).
