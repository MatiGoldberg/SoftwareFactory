# Enterprise transformations to AI-first engineering: Shopify, Uber, Airbnb, Amazon, Spotify, an embedded-systems company

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase. Each note includes a "Transformation journey" section: how the org moved from its previous way of working.

---

## [SHOPIFY-PLAYBOOK] Inside Shopify's AI-first engineering playbook

URL: https://www.bvp.com/atlas/inside-shopifys-ai-first-engineering-playbook
Publisher / date: Bessemer Venture Partners Atlas; interview with Farhan Thawar (VP & Head of Engineering, Shopify); 2026-04-02

**Summary.** Standardize the infrastructure layer under AI tools rather than picking one tool: all AI traffic goes through a central LLM proxy. Adoption by culture and low-friction enablement (leadership demos, setup guides, MCP connections, prompt library), not mandates; spread to sales, finance, HR building "n-of-1" software. Impact estimate ~20%, explicitly not measured by LOC or PRs. Guardrails: mandatory senior human PR review, reversion-rate tracking, AI-assisted security review, "comprehension debt" rule (understand systems 2–3 layers below your work).

**Key practices & mechanisms**
- Central LLM proxy: cost control, bulk pricing, per-team/person usage analytics, model switching.
- Token-spend alert at $250/person/day → investigation, not shutdown.
- MCP to wiki, product tool, data warehouse, Salesforce, Slack, Workspace — user's own auth, same reliability standards.
- Tool diversity (Cursor, Claude Code, Copilot, Codex, Gemini). Small ML infra team (~6 engineers) owns the proxy.
- "AI-reflexive" is part of biannual performance reviews.
- No automatic AI check-ins; a human reviewer on every merge.
- Security: role + vulnerability-class prompts (e.g., IDOR) as a pairing partner for review and fuzzing.

**Transformation journey.** Early Copilot rollout to every engineer → central proxy → enablement and culture (public demos, MCP, prompts) → non-engineers build internal tools → measurement and guardrails (weekly demos, reversion rate, human review) → 2026: agentic harnesses (parallel agents, critique loops). Hard parts: token costs, review bottleneck, no good productivity metric, comprehension debt.

**Numbers & evidence.** ~20% productivity ("humble estimate"); PR volume up slightly with reversion rate roughly flat.

**Notable quotes**
- "in a rapidly evolving AI landscape, standardize infrastructure, not tools."
- "Shopify is not yet at the place where we allow AI to check in code automatically into the repos"
- "You shouldn't abdicate the thinking." / "You should abdicate the toil."

**Relevance:** gateway + telemetry before broad rollout; reversion rate and review throughput as health signals; deep human understanding of critical paths.

---

## [UBER-UREVIEW] uReview: Scalable, Trustworthy GenAI for Code Review at Uber

URL: https://www.uber.com/en-US/blog/ureview/
Publisher / authors / date: Uber Engineering; Sonal Mahajan, Shauvik Roy Choudhary, Will Bond; 2025-08-12

**Summary.** In-house AI second reviewer. Prompt chain: three assistants (Standard, Best Practices, AppSec) generate comments → confidence scoring → semantic dedup → category classifier suppresses low-value categories. Precision is the design priority (false positives make developers ignore the tool). Every comment has Useful/Not Useful; an automated check reruns five times on the final commit to see whether comments were addressed. Runs in CI across six monorepos; built in-house because Uber uses Phabricator.

**Key practices & mechanisms**
- Filter out config, generated, experimental files; include nearby functions, classes, imports as context.
- Per-assistant, per-language, per-category confidence thresholds; suppress categories developers dislike.
- Feedback streamed via Kafka to Hive; golden-commit offline benchmark (precision/recall/F1).
- Linters for syntax; LLM for semantic checks. Runs in CI, not just IDE.
- Gradual rollout by team or assistant with precision-recall dashboards.

**Transformation journey.** Single-shot prompting → hallucinations and duplicates → multi-stage chain; precision over volume; phased rollout one team/assistant at a time.

**Numbers & evidence**
- >90% of ~65,000 weekly diffs; 75% of comments rated useful; 65% addressed in-changeset vs 51% for human comments.
- Median 4 min per commit; ~1,500 hours/week saved (assumes 10 min per second human review).

**Notable quotes**
- "Early in development, we learned that comment quality matters far more than quantity."
- "Developers don't like certain categories of comments from AI tools."

**Relevance:** concrete trust-building method for AI review: measure usefulness and addressed rate per category, roll out team by team.

---

## [UBER-AISTACK] How Uber uses AI for development: inside look

URL: https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development (paywalled after section 3)
Publisher / date: The Pragmatic Engineer (Gergely Orosz), from a talk by Uber's Ty Smith and Anshu Chada; 2026-03-10

**Summary.** Uber's goal: eliminate toil (upgrades, migrations, trivial bugs). Four-layer agentic stack: internal AI platform (Michelangelo + model gateway); internal context sources as agent memory; industry agents (Claude Code, Copilot, Codex); specialized agents (background "Minion", test generation "Autocover", review "uReview"), plus enablement. Moved from one agent in the IDE to many parallel background agents → resource and cost pressure.

**Key practices & mechanisms**
- Central MCP gateway: any internal Thrift/Protobuf/HTTP endpoint exposed as MCP via config; gateway handles authN/authZ, telemetry, logging, registry, sandbox. Built by a tiger team.
- Agent Builder (no-code) + Agent Studio (tracing, versioning, evals); registry of reusable agents.
- AIFX CLI centrally provisions agent clients, MCP discovery, defaults, updates.

**Transformation journey.** IDE-centric → single agents with plan approval → parallel background agents. Adoption slower than expected; peer-shared wins beat top-down mandates; token cost now a priority.

**Numbers & evidence**
- 84% of developers are agentic coding users (Mar 2026); 92% use agents monthly; 11% of PRs opened by agents.
- Claude Code usage 32% → 63% (Dec → Feb); AI costs up 6× since 2024; Autocover 5,000+ tests/month; ~3,000-person tech org.

**Notable quotes**
- "we push some of the boring stuff to AI – upgrades, migrations, bug fixes"

**Relevance:** expose existing services to agents through a governed MCP gateway (auth + telemetry) instead of rewriting; budget for parallel-agent cost.

---

## [AIRBNB-MIGRATION] Accelerating large-scale test migration with LLMs

URL: https://medium.com/airbnb-engineering/accelerating-large-scale-test-migration-with-llms-9565c208023b
Publisher / authors / date: Airbnb Tech Blog; Charles Covey-Brandt; 2025-03-13

**Summary.** ~3.5K React test files migrated Enzyme → React Testing Library in six weeks vs a 1.5-year manual estimate. Per-file state machine (Enzyme removed → Jest passing → lint → TypeScript), LLM fix on any failure inside a retry loop. First bulk run 75% in four hours; four days of sample-tune-sweep reached 97%; rest done manually. Main success driver: choosing the right related files as context, not prompt perfection.

**Key practices & mechanisms**
- Retry loops with prompts containing validation errors + latest file; most succeeded within ~10 attempts; long tail 50–100.
- 40K–100K-token prompts with up to 50 related files (source, sibling tests, examples, guidelines).
- Per-file status stamped as a comment; CLI re-runs by step and path glob.
- Breadth-first tuning: sample 5–10 failing files sharing an issue, tune, re-sweep.
- Acceptance bar: original test intent and coverage preserved.

**Transformation journey.** RTL for new tests since 2020 → hackathon PoC (mid-2023) → scalable pipeline (2024) → bulk run → tune → manual tail.

**Notable quotes**
- "the main success driver we saw was choosing the right related files"

**Relevance:** validation-gated per-unit pipeline; know when to stop automating and hand off the tail.

---

## [EMBEDDED-AIFIRST-ROADMAP] Developing a Roadmap to an AI-first Organization: A Case Study in Embedded Software Development

URL: https://arxiv.org/abs/2609.30863
Publisher / authors / date: University of Gothenburg / Chalmers (Kjellberg, Basu, Sun, Fotrousi, Staron); arXiv 2026-09-25. Academic case study at an unnamed ~20,000-employee embedded-systems company.

**Summary.** Workshop with 40 practitioners (scrum masters, managers, architects, POs). Agentic AI seen as an organizational transition, not a tooling change. Preferred a federated model: central standards and governance + an AI ambassador per team. Roles shift toward domain knowledge, supervision, validation, accountability; 70% prefer developers using agents over being replaced. Barriers: no clear strategy, slow tool approval (MCP approval took a long time), fear of losing code understanding, "illusion of productivity", weak AI support for C/embedded, an agent editing tests instead of fixing code. Output: an unvalidated roadmap across technical, human, organizational layers.

**Roadmap elements**
- Enablers: models, hardware, shared framework and governance, isolated sandbox, validation metrics that include upstream/downstream effects ("AI Process Validation").
- Start with low-risk processes (documentation, PR analysis, log/fault analysis) with AI ambassadors and communities of practice.
- Redesign processes for AI-first rather than bolting agents onto existing ones.
- Human checkpoints where legally/technically required; explicit accountability for agent-generated code; reorientation program for changing roles.

**Notable quotes**
- "Finding 1: Practitioners perceive the transition towards agentic AI as an organizational transition."
- "We are producing much more code and need much more tests, reviews, and validations"

**Relevance:** the closest published analogue to transforming an existing, regulated, multi-team engineering org; perception study, not outcomes.

---

## [AMAZON-Q-JAVA] A quote from Andy Jassy (Amazon Q Java upgrades)

URL: https://simonwillison.net/2024/Aug/24/andy-jassy-amazon-ceo/ (quoting Jassy's LinkedIn post)
Date: 2024-08-24

**Summary.** Amazon integrated Amazon Q into internal systems for Java upgrades: Java 17 upgrade time from ~50 developer-days to a few hours per app; estimated 4,500 developer-years saved; >50% of production Java systems modernized in under six months; developers shipped 79% of auto-generated code reviews without additional changes. No details on review, security, or rollout.

**Notable quotes**
- "developers shipped 79% of the auto-generated code reviews without any additional changes."

**Relevance:** fleet-wide upgrades are a strong first agent use case with a measurable baseline; claim is self-reported, no post-merge quality data.

---

## [SPOTIFY-QCON-2026] QCon London 2026: Rewriting All of Spotify's Code Base, All the Time

URL: https://www.infoq.com/news/2026/03/spotify-honk-rewrite
Publisher / date: InfoQ (Daniel Curtis) reporting a talk by Jo Kelly-Fenton and Aleksandar Mitic; 2026-03-18

**Summary.** Before Honk, Fleet Management made library owners migrate consumers; deterministic scripts moved ~70% of the fleet in under a week, the last 30% lingered. Honk agents now handle the long tail. Early agents took shortcuts (commenting out failing tests, downgrading Java). The LLM judge was later removed as too rigid, with verification steps in prompts sufficient (note: contrasts with Part 3's judge). Agent runtime separated from verification runtime; PRs created only after CI validation through a verification service. Output reached 1,000 merged PRs in 10 days (vs 3 months, six months earlier) → review became the bottleneck.

**Key practices & mechanisms**
- Verification-gated PR creation; verification service abstracts heterogeneous CI (iOS can't build on Linux; credentials and Docker at scale).
- Review strategies: migration drivers may approve their own PRs; stale PRs closed; PR inbox prioritization; auto-merge for docs.
- Standardization via advisory boards, monorepos and lint; Honk drives migrations to 100%.
- Flywheel: standard code → more correct agent output → easier review → more capacity → more standardization.

**Notable quotes**
- "agents would take shortcuts to make builds pass, such as commenting out failing tests or downgrading Java versions."
- "a diverse codebase produces a diverse set of problems"

**Relevance:** separate agent and verification runtimes to cope with heterogeneous pipelines; plan review-capacity tooling and low-risk auto-merge; standardize in parallel.
