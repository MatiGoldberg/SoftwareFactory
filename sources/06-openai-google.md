# OpenAI and Google: harness engineering, Codex practice, AI in SWE at Google, DORA, canarying

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase.

---

## [OAI-HARNESS] Harness engineering: leveraging Codex in an agent-first world

URL: https://openai.com/index/harness-engineering/
Publisher / authors / date: OpenAI; Ryan Lopopolo; 2026-02-11

**Summary.** Five-month internal experiment: a team shipped an internal beta with zero manually written code — Codex wrote app logic, tests, CI, docs, observability, tooling. Engineering is reframed as designing environments, specifying intent, and building feedback loops. Repo-local docs are the system of record: a ~100-line AGENTS.md is a map into a structured docs/ tree. The running app, logs, metrics, traces are legible to agents. Architecture enforced mechanically (layered dependency rules, custom lints). Merge gates relaxed because corrections are cheap at high agent throughput. One prompt can take a bug from repro → fix → validate → PR → merge, escalating to humans only for judgment. Authors caution it depends on repo structure and tooling.

**Key practices & mechanisms**
- docs/: design-docs, exec-plans (active/completed, tech-debt tracker), product-specs, references, quality/reliability docs; plans versioned in-repo with progress and decision logs.
- Lints/CI check the knowledge base is current and cross-linked; a "doc-gardening" agent opens fix-up PRs.
- Anything not in the repo (Docs, Slack, tacit knowledge) is invisible to the agent → must be encoded in-repo.
- Fixed per-domain layering (Types → Config → Repo → Service → Runtime → UI) with Providers for cross-cutting concerns; lint error messages carry remediation text into agent context.
- Bootable app per git worktree; Codex drives it via Chrome DevTools Protocol and queries an ephemeral observability stack (LogQL, PromQL, traces).
- "Golden principles" + background tasks that scan for drift, update quality grades, open mostly auto-mergeable refactors.
- Review mostly agent-to-agent; agents often merge their own PRs.

**Numbers & evidence**
- ~1M lines, ~1,500 PRs in five months; 3 → 7 engineers; ~3.5 PRs/engineer/day; ~1/10th the time.
- Single runs >6 hours. Earlier, every Friday (20% of time) went to cleaning "AI slop", which didn't scale.

**Notable quotes**
- "Humans steer. Agents execute."
- "give Codex a map, not a 1,000-page instruction manual."
- "By enforcing invariants, not micromanaging implementations, we let agents ship fast without undermining the foundation."
- "This would be irresponsible in a low-throughput environment."

**PDLC stages:** spec, design, implementation, code review, testing, monitoring, governance. (Deployment barely covered.)

**Relevance:** invariants-as-lints with remediation text; per-change ephemeral environment + telemetry; relaxed merge gates are the riskiest thing to transfer to a production enterprise service (greenfield internal product).

---

## [OAI-CODEX-USE] How OpenAI uses Codex

URL: https://openai.com/business/guides-and-resources/how-openai-uses-codex/
Publisher: OpenAI (interviews + internal usage data); undated

**Summary.** Seven use cases across Security, Product, Frontend, API, Infra, Performance: code understanding, refactoring/migrations, performance, test coverage, velocity, staying in flow, exploration/ideation. Best practices: plan in Ask mode then Code mode; scope tasks to ~an hour or a few hundred lines; invest in the task environment; write prompts like GitHub issues; maintain AGENTS.md; best-of-N.

**Key practices & mechanisms**
- Startup scripts, env vars, internet access "significantly" reduce error rates; fix build errors in environment config.
- Use the task queue as a lightweight backlog.
- Example: find all modules hand-building SQL strings instead of using the query builder.

**Notable quotes**
- "Structure your prompt as if you are writing a Github Issue"
- "Codex works best with well-scoped tasks"

**Relevance:** task taxonomy; agent environment as managed infrastructure. No metrics.

---

## [GOOG-AISE] AI in software engineering at Google: Progress and the path ahead

URL: https://research.google/blog/ai-in-software-engineering-at-google-progress-and-the-path-ahead/
Publisher / authors / date: Google Research; Satish Chandra, Maxim Tabachnyk; 2024-06-06

**Summary.** ML/LLMs across inner loop (IDE, code review, search) and outer loop (bugs, planning). Guidelines: prioritize feasible high-impact ideas; learn fast; measure. Code completion first (code = training data; AI-character share = impact). Then review-comment resolution, smart paste, NL edits, build-failure fixes. Trained on years of curated internal logs. Lessons: fit the workflow; the author increasingly becomes a reviewer, so balance review cost vs value. Calls for enterprise benchmarks (migrations, production debugging).

**Numbers & evidence**
- Completion acceptance 37%; ~50% of code characters AI-completed.
- >8% of code review comments addressed with AI assistance; smart paste ~2% of IDE code.

**Notable quotes**
- "Experiments requiring the user to remember to trigger the feature have failed to scale."
- "the code author increasingly becomes a reviewer"
- "Quick iterations with online A/B experiments are key"

**Relevance:** acceptance-rate and opportunity-funnel KPIs; online A/B over offline proxies; plan review capacity.

---

## [GOOG-MIGRATIONS] How is Google using AI for internal code migrations?

URL: https://arxiv.org/abs/2501.06972
Publisher / authors / date: Google; Nikolov, Codecasa, Sjovall, Tabachnyk, Chandra, Taneja, Ziftci; 2025-01-12 (abstract only so far)

**Summary.** Experience report (explicitly not a research study) on LLM-based migrations across many cases. LLMs reduce migration time "significantly" and lower barriers to starting and finishing migration programs.

**Notable quotes**
- "We see evidence that the use of LLMs can reduce the time needed for migrations significantly"

**Relevance:** migrations as a bounded, high-volume first use case. TODO: read full PDF for workflow and metrics.

---

## [DORA-2025] How are developers using AI? Inside our 2025 DORA report

URL: https://blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025/ (report PDF: https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf)
Publisher / authors / date: Google; Ryan J. Salva; 2025-09-23

**Summary.** ~5,000 respondents. AI adoption 90% (+14%). "Trust paradox": high use, low trust. AI adoption now linked to higher delivery throughput, but ensuring software works before delivery remains a challenge. AI is a "mirror and a multiplier": amplifies cohesive orgs, exposes fragmented ones. Seven team archetypes; the DORA AI Capabilities Model (seven capabilities, technical + cultural).

**Numbers & evidence**
- Median 2 h/day with AI; >80% feel more productive; 59% positive on code quality.
- Trust: 24% a lot/great deal; 30% little/not at all.

**Notable quotes**
- "mirror and a multiplier"

**Relevance:** organizational readiness framework. TODO: get the seven capabilities from the Cloud blog/report.

---

## [GOOG-SRE-CANARY] Canarying Releases (SRE Workbook ch. 16)

URL: https://sre.google/workbook/canarying-releases/
Publisher / authors: Google SRE; Alec Warner, Štěpán Davidovič et al.; 2018

**Summary.** Canary = partial, time-limited deployment and its evaluation, effectively A/B vs control. Grounded in reproducible/automated builds, tests, deployments, small deployments. A majority of incidents are triggered by binary or config pushes; some defects will reach production. Requirements: deploy to a subset, evaluate good/bad, integrate with release. Covers sizing, metric selection, risks of before/after comparisons, blue/green, artificial load, teeing, feature flags.

**Key practices & mechanisms**
- One canary at a time; SLIs as canary metrics, "perhaps no more than a dozen"; user-visible metrics over CPU.
- Break down by canary vs control; multi-stage canary; pair relative comparison with absolute SLO checks.
- Feature flags decouple feature launch from binary release.

**Notable quotes**
- "Some defects will reach production."
- "Canarying is effectively an A/B testing process."

**Relevance:** automated canary analysis as the progressive-delivery gate for agent changes; error budgets tie velocity to SLOs.
