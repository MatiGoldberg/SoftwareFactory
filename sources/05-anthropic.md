# Anthropic: agentic coding in practice, harnesses, and how work changes

Notes produced 2026-11-14 by reading each source. Quotes are verbatim; everything else is paraphrase.

---

## [AN-TEAMS] How Anthropic teams use Claude Code

URL: https://claude.com/resources/articles/how-anthropic-teams-use-claude-code (redirect from anthropic.com/news/…)
Publisher / date: Anthropic; 2025-07-24

**Summary.** Anecdotes from Anthropic teams. Product Engineering calls it their "first stop" for programming tasks. Uses: codebase onboarding Q&A via CLAUDE.md, writing tests, automating PR comments via GitHub Actions, tracing control flow from stack traces during security incidents, diagnosing a Kubernetes pod-scheduling outage, prototyping from Figma, autonomous write-test-iterate loops. Non-engineering teams (Growth Marketing, Legal) built automation too.

**Key practices & mechanisms**
- CLAUDE.md files explain pipeline dependencies for new joiners.
- Security Eng: ask for pseudocode, guide TDD, check in periodically.
- Autonomous loops; team reviews solutions before refinement.
- Design-stage edge-case mapping (error states, logic flows) before development.
- MCP + CLAUDE.md + markdown runbooks as knowledge consolidation.

**Numbers & evidence (anecdotal, team-reported)**
- Security: debugging that took 10–15 min resolves "3x as quickly".
- Inference team: research time down ~80% (an hour → 10–20 min).
- Data Infra: saved 20 minutes during an outage.

**Notable quotes**
- "The most successful teams treat Claude Code as a thought partner rather than a code generator."
- "Claude Code works best when you focus on the human workflows that it can augment."

**PDLC stages:** design, implementation, code review, testing, incident.

---

## [AN-HARNESS-1] Effective harnesses for long-running agents

URL: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
Publisher / authors / date: Anthropic Engineering; Justin Young; 2025-11-26

**Summary.** Agents spanning many context windows start each session with no memory. Opus 4.5 on the Agent SDK with only a high-level prompt fell short of a production-quality app: it tried to one-shot, then declared victory early. Fix: an initializer agent sets up the environment (feature list JSON with all features failing, init.sh, progress file, initial commit), then a coding agent makes incremental progress per session and leaves clean, committed state. End-to-end testing via browser automation.

**Key practices & mechanisms**
- Feature list JSON with a "passes" field; agents may change only that field (JSON less likely to be overwritten than Markdown).
- One feature per session; descriptive commits so bad changes can be reverted.
- Session-start routine: pwd, git log, progress file, feature list, init.sh, smoke E2E test before new work.
- Puppeteer MCP for E2E testing "as a human user would".

**Numbers & evidence.** claude.ai clone with "over 200 features"; failure-mode table (premature victory, buggy undocumented state, premature "done", time lost figuring out how to run the app).

**Notable quotes**
- "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality."
- "Providing Claude with these kinds of testing tools dramatically improved performance"

**PDLC stages:** spec, implementation, testing, code review.

**Relevance:** machine-readable acceptance list protected from tampering; standard state hand-off between agent sessions.

---

## [AN-HARNESS-2] Harness design for long-running application development

URL: https://www.anthropic.com/engineering/harness-design-long-running-apps
Publisher / authors / date: Anthropic Engineering (Labs); Prithvi Rajasekaran; 2026-03-24

**Summary.** GAN-inspired generator/evaluator. For full-stack apps: planner expands a 1–4 sentence prompt into a product spec; generator builds; evaluator tests the running app with Playwright. Before each sprint, generator and evaluator negotiate a "sprint contract" with testable criteria; communication via files. As models improved, the harness was simplified (sprints removed, single evaluation pass at end). Evaluator is worth its cost only when the task exceeds what the model does reliably alone.

**Key practices & mechanisms**
- Separate generator from evaluator because agents "reliably skew positive" grading their own work.
- Criteria encode quality; evaluator calibrated with few-shot score examples.
- Planner stays high-level so spec errors don't cascade.
- Hard thresholds per criterion; any failure fails the sprint.
- Remove one harness component at a time to find what's load-bearing; re-examine on each new model.

**Numbers & evidence**
- Retro game maker: solo 20 min / $9 (core feature broken) vs full harness 6 h / $200.
- Sprint 3 contract: 27 criteria. Planner: 16-feature spec over 10 sprints.
- V2 harness (DAW, Opus 4.6): 3 h 50 min, $124.70 total (planner $0.46; three build/QA rounds).

**Notable quotes**
- "Separating the agent doing the work from the agent judging it proves to be a strong lever to address this issue."
- "every component in a harness encodes an assumption about what the model can't do on its own"
- "The generator-evaluator loop maps naturally onto the software development lifecycle"

**PDLC stages:** requirements, design, spec, implementation, code review, testing.

**Relevance:** sprint contracts = agreed definition of done before coding; cost baselines; regularly test whether each gate is still needed.

---

## [AN-WORK] How AI is transforming work at Anthropic

URL: https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic
Publisher / date: Anthropic Societal Impacts; 2025-12-02

**Summary.** Survey of 132 engineers/researchers, 53 interviews, 200,000 internal Claude Code transcripts (Feb vs Aug 2025). Self-reported Claude use rose 28% → 59% of daily work; productivity +20% → +50%. 27% of Claude-assisted work wouldn't have happened otherwise. Most can "fully delegate" only 0–20% of work because they keep validating outputs. Engineers delegate verifiable, low-stakes, repetitive or out-of-context tasks; keep high-level design and "taste". Concerns: skill atrophy, the "paradox of supervision", mentorship changes. Autonomous actions before human input rose ~10 → ~20.

**Key practices & mechanisms**
- Delegation criteria: verifiable, low-stakes, boring, self-contained, or faster to prompt than do.
- Trust grows progressively from simple tasks.
- Engineers as managers of several parallel agents.
- Papercut fixes = 8.6% of Claude Code tasks.

**Numbers & evidence**
- Feature implementation 14% → 37% of usage; design/planning 1% → 10%.
- 14% report >100% productivity gain. Cites +67% merged PRs per engineer per day.
- Self-reported; authors flag bias.

**Notable quotes**
- "When producing output is so easy and fast, it gets harder and harder to actually take the time to learn something."

**Relevance:** basis for a delegation policy by verifiability and stakes; review capacity and human skill must be preserved.

---

## [AN-BESTPRACTICES] Best practices for Claude Code

URL: https://code.claude.com/docs/en/best-practices (from anthropic.com/engineering/claude-code-best-practices)
Publisher: Anthropic

**Summary.** Patterns from Anthropic internal teams. Context window is the main constraint. Always give the agent a verification check (tests, build, linter, screenshot). Explore → plan → implement → commit. Short, pruned CLAUDE.md; permissions (auto mode, allowlists, sandbox); hooks are deterministic, CLAUDE.md is advisory. Interview-driven specs, then implement in a fresh session. Scale with non-interactive mode, fan-out, writer/reviewer sessions, adversarial review subagent.

**Key practices & mechanisms**
- Stop hooks block completion until a check passes.
- Interview the requester (AskUserQuestion) → SPEC.md → fresh session to implement.
- Writer/reviewer in separate sessions; adversarial reviewer checks diff against PLAN.md.
- Fan-out with `claude -p` and `--allowedTools`.

**Notable quotes**
- "Give Claude a check it can run: tests, a build, a screenshot to compare."
- "A fresh context improves code review since Claude won't be biased toward code it just wrote."
- "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens."

**Relevance:** the "grill the owner until clear" step is a documented practice; deterministic gates; independent review.

---

## [AN-AGENTS] Building effective agents

URL: https://www.anthropic.com/research/building-effective-agents
Publisher / authors / date: Anthropic; Erik Schluntz, Barry Zhang; 2024-12-19

**Summary.** Workflows (predefined code paths) vs agents (LLM directs its own process). Use the simplest thing that works. Patterns: prompt chaining (with programmatic gates), routing, parallelization (sectioning, voting), orchestrator-workers, evaluator-optimizer. Agents suit open-ended problems in trusted, sandboxed environments. Coding agents work well because code is verifiable by tests, but human review remains crucial. Tool design ("agent-computer interface") matters as much as prompts.

**Notable quotes**
- "we recommend finding the simplest solution possible, and only increasing complexity when needed."
- "human review remains crucial for ensuring solutions align with broader system requirements."

**Relevance:** choose the least-autonomous pattern per PDLC stage; voting/evaluator patterns for review and security checks.
