# Spotify Honk series: context, verification, and multi-team migrations

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase. Figures are Spotify's self-reported numbers.

---

## [SPOTIFY-HONK-2] Background Coding Agents: Context Engineering (Honk, Part 2)

URL: https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2
Publisher / authors / date: Spotify Engineering; Max Charas, Marc Bruggmann; 2025-11-24

**Summary.** Spotify tried open-source agents (Goose, Aider), then its own loop on LLM APIs (struggled with cascading multi-file changes and context limits), then moved to Claude Code — its top performer, used for ~50 migrations and the majority of merged background-agent PRs. Deliberately minimal tools: a verify tool, a standardized Git tool, a strict Bash allowlist. No code search or doc tools; users put needed context into the prompt. Prompts evolve by trial and error; no structured prompt/model evaluation yet.

**Key practices & mechanisms**
- Describe the end state (Claude Code) rather than strict steps; state preconditions including when NOT to act (one prompt reused across many repos).
- Concrete code examples; define the end state as tests; one change per prompt.
- Prompts stored as large static, version-controlled files.
- Build-system invocation encoded in an MCP "verify" tool (format, lint, test, summarized logs) rather than per-repo AGENTS.md, because repos have very different build configs.
- Git tool exposes only selected subcommands (never push or change origin), standardizes committer and commit message format.
- Ask repo owners to add tests, linters, API docs so any agent benefits.

**Numbers & evidence.** ~50 migrations; old loop capped at 10 turns × 3 retries; "still flying mostly by intuition" on evaluation.

**Notable quotes**
- "The agent needs a verifiable goal so it can iterate on a solution as it goes."
- "We keep our background coding agent very limited in terms of tools and hooks so it can focus on generating the right code change from a prompt."

**Relevance:** central verify tool solves heterogeneous build systems across repos; centrally enforced Git guardrails; need a versioned, evaluated prompt library.

---

## [SPOTIFY-HONK-3] Background Coding Agents: Predictable Results Through Strong Feedback Loops (Honk, Part 3)

URL: https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3
Publisher / authors / date: Spotify Engineering; Max Charas, Marc Bruggmann; 2025-12-09

**Summary.** Three failure modes: no PR, PR fails CI, PR passes CI but is functionally wrong (most serious). Mitigation: independent deterministic verifiers auto-activated by component contents (e.g., Maven verifier on pom.xml); the agent just calls an MCP tool and doesn't know verifier internals. Verifiers run before a PR opens (Claude Code stop hook). An LLM judge compares the diff to the original prompt to catch scope creep (refactors, disabling flaky tests). Agent is single-purpose and runs in a highly sandboxed container; pushing, Slack, prompt authoring live in surrounding infrastructure.

**Key practices & mechanisms**
- Verifiers extract only the relevant errors (regex) or return a short success, to save context.
- Pre-PR gating: any verifier failure blocks the PR.
- LLM-as-judge after deterministic verifiers.
- Container with limited permissions, few binaries, virtually no access to surrounding systems.
- Planned outer loop acting on GitHub CI checks; more platforms (macOS, ARM64); structured evals.

**Numbers & evidence.** Judge vetoes ~25% of sessions; agent course-corrects ~50% of the time after a veto. Judge accuracy not yet evaluated. Verifiers Linux x86 only.

**Notable quotes**
- "The agent runs in a container with limited permissions, few binaries, and virtually no access to surrounding systems."
- "We have yet to invest in evals for our judge."

**Relevance:** verifiers keyed to repo contents give one gate model across heterogeneous repos; the "green but wrong" risk is addressed by a scope judge; per-platform runners required.

---

## [SPOTIFY-HONK-4] Background Coding Agents: Supercharging Downstream Consumer Dataset Migrations (Honk, Part 4)

URL: https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4
Publisher / authors / date: Spotify Engineering; Devon Edwards Joseph; 2026-04-22

**Summary.** One data team used Honk + Backstage + Fleetshift to migrate ~1,800 downstream pipelines (owned by many teams) off two deprecated datasets in six months. Backstage endpoint lineage and Codesearch found target repos; marked in-scope in Fleetshift. Covered BigQuery Runner and dbt; dropped Scio (too much per-team variability). Honk had no skills or configurable MCP tools — a deliberate guardrail — so all context lived in the prompt/context file. Reusing a human migration guide produced wrong field mappings; explicit mapping tables worked. Where judgment was needed, Honk left fields unchanged and added comments linking guides. Repos rarely had unit tests, so owning teams tested manually before merging.

**Key practices & mechanisms**
- Discovery via lineage catalog → authoritative consumer list and owners before any change.
- Explicit "do not migrate" rules with links for reviewers.
- Exclude non-standard frameworks; pursue standardized ones.
- Owning teams review, test, and merge; Fleetshift UI tracks progress and communication.

**Numbers & evidence.** ~1,800 direct pipelines (several thousand indirect); 240 automated PRs; ~10 engineering weeks saved (estimate). No merge/defect rates.

**Notable quotes**
- "we had to rely on the downstream owning teams to perform their own manual testing before merging the automated PRs."
- "Honk was left to make assumptions about how to map from one dataset field to another that were often incorrect."

**Relevance:** the clearest public multi-team example: dependency graph defines blast radius and owners; owners keep merge authority; missing tests shift cost to owners → require tests as a precondition; standardization is a prerequisite.

---

## [SPOTIFY-ANTHROPIC-LIVE] Let's Talk Agentic Development: Spotify x Anthropic Live

URL: https://engineering.atspotify.com/2026/4/anthropic-agentic-development
Publisher / date: Spotify Engineering; Niklas Gustavsson with Anthropic's David Soria Parra and Christian Ryan; 2026-04-06

**Summary.** Recap of a fireside chat. Opus 4.5 (Nov 2025) seen as a visible inflection on Spotify's internal charts. Themes: standardize the ecosystem to orchestrate agents across thousands of repos; simple, reproducible CLAUDE.md + skills setups; judge code by outcomes with a named accountable person regardless of author; Backstage moving toward an agent-first platform via MCP.

**Notable quotes**
- "It doesn't really matter who generated what or what was behind it."
- "you also want to have someone who's accountable for the outcome."

**Relevance:** accountability model for agent changes: outcome-based, named human owner. Framing source, no data.
