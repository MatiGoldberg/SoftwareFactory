## Appendix C: Open questions and evidence gaps

This appendix collects the "Open gaps" lists and inline [GAP: ...] markers from every section, with duplicates merged. The codes in brackets name the sections each gap comes from. Where a gap sits under a recommendation, the recommendation is our synthesis until the gap closes.

### Evidence the published record does not yet contain

**Autonomy and the trust ledger**

- No source describes an agent at Act, then notify for rollout or runbook mitigations in production, or an agent halting or rolling back a ring rollout or writing a rollout plan. Meta keeps production mitigations human (0, II.9, II.11, VII).
- No source publishes promotion thresholds (sample size, acceptable revert or override rate), budget defaults or rate limits; the numbers in D6 and D7 are placeholders (I, III, D-kit).
- No source describes an agent kill switch or measures how fast one takes effect (I, III, D-kit).
- No source measures re-qualifying an agent action after a model upgrade (III).
- The per-action ladder rests on one conference talk (AIE4) and a product announcement (MS10); there is no peer-reviewed study (I, III, II.11).
- Azure SRE Agent's figures are self-reported, and the posts do not say which actions ran without approval (II.11).
- No Microsoft product describes a per-action outcome ledger; D7 is our design (V.2).

**Intake, requirements and specs**

- No source measures intake clustering, agent dedupe or agent-drafted briefs, or publishes intake metrics for a high-scale service (II.1, VII).
- No source shows how an incident pattern becomes a backlog item (II.1).
- No source covers cross-team prioritization when owners disagree, or requirements and specs negotiated across several owning teams (II.1, II.2, II.3).
- No source measures whether grilling agents, interview-driven specs, spec or planner agents, or checks-before-code reduce clarification, rework or defects; published metric definitions for clarification rate and requirements rework do not exist (I, II.2, II.3).
- No source covers privacy or compliance review inside an agentic requirements flow (II.2).
- No source describes a "ready for implementation" gate; sprint contracts are published only for single apps built from a prompt (II.3).
- No source publishes a PRD template, or any of the kit's templates, for agent consumption, or measures their effect (D1, D-kit).

**Design and contracts**

- No source describes an HLD template, a design-review process or a threat-modelling method, or publishes design-stage metrics (II.4).
- No frontier company has published consumer-driven contract testing at scale (I, II.4, IV).
- No source shows a breaking-change gate for gRPC, event or database-schema contracts (II.4, IV).
- No source describes agents in design critique, contract drafting or breaking-change review (II.4).

**Implementation, review and test**

- No evidence on auto-merging agent feature code on a production service, and no measured legacy versus modern comparison (II.5).
- The runtime identity, network policy and credentials of Copilot coding agent are undescribed (II.5).
- No source describes a risk gate approving low-risk classes after AI review (II.6).
- Microsoft publishes no method for its 10 to 20% review figure and no precision or addressed rates (II.6).
- No source compares revert or defect rates of AI-reviewed and human-only-reviewed changes (I, II.6).
- Evidence-carrying PRs rest on one conference talk (AIE13), and no source shows agent identity and evidence on a PR (II.6).
- No source measures prompt-injection defenses for coding or review agents (II.6, IV).
- No source describes load or performance gates, or contention and quotas on shared pre-production (II.7).
- No Microsoft source on mutation testing or agent test generation; ACH is the only measured case (0, II.7).
- No source measures agent flaky-test triage, or covers synthetic or redacted test data for agents and ownership of cross-service tests (II.7).
- No published accuracy for any LLM judge; Spotify adopted, then removed, its judge (II.7, II.12).

**Merge and deploy**

- No Microsoft source describes a combined-state merge queue or a change risk score (0, II.8, II.9, V.2).
- No source describes a merge queue spanning repos, or one combined-state test or one watchdog spanning two pipeline systems such as ADO and GitHub Actions (II.8, II.9, IV, VII).
- No source shows a risk model calibrated on agent-authored diffs, or uses a risk score or a reverse dependency graph to set ring speed, bake or risk (II.8, II.9, V.1).
- No source measures agents resolving semantic conflicts, explaining risk or preparing culprit reverts (II.8).
- No source shows one watchdog halting non-AKS compute, and no published mechanism or metric exists for config canary analysis (II.9).

**Validate, operate and maintain**

- No source gives flag ramp steps, hold times or an error-budget policy for a feature ramp, or describes a product experimentation platform (II.10).
- No source describes an agent writing a post-launch validation report or measures agent-driven flag cleanup; no Microsoft source on flag cleanup (II.10).
- No source covers cross-team telemetry access, privacy rules for agent-read telemetry, or removal order for cross-service flags (II.10).
- No source describes SLO burn-rate alerting or an error-budget policy (II.11).
- No source shows agents from several teams coordinating within one incident (II.11).
- No source measures whether agent-drafted repair items, or the closed loop as a whole, reduce repeat incidents (II.11, III, VI, VII).
- No source reports post-merge defect or revert rates for agent migrations; Microsoft's Entra SDK migration figure has no published mechanism (II.12).
- No source describes agent-assisted decommissioning, or an agent tuning its own prompt within a campaign budget (II.12).

**Identity, platform and catalog**

- No Microsoft source describes a forwardable end-user context separate from the access token (IV).
- The MCP enterprise-managed authorization extension was not read (IV).
- No source gives the exit criterion for moving S2S authorization from log-only to enforced (IV).
- No note names a Microsoft model gateway, MCP gateway or flag service product, or Codespaces or Dev Box as agent sandboxes (V.2).
- No source measures gateway overhead or how the factory degrades when the model gateway fails (V.2).
- Service Tree and S360 have no public schema or attestation process (V.1, D-kit).
- No source describes a machine-readable change-intake path, or shows an agent maintaining a catalog (V.1, D-kit).

### Data only your own service can provide

These gaps close only with measurements from the target service and its organization.

- Human-only baselines: the four DORA metrics and per-class merge, revert and override rates, recorded in Step 0. No external benchmarks exist, so every target is relative to them (III, VI).
- The sample size and thresholds for each promotion review, set from the service's own ledger (III, D-kit).
- Bake durations per ring and region; the notes hold only the generic ADO guidance of about 24 hours (II.9).
- Watchdog precision and recall per component class before the halt is trusted (II.9).
- A replay set of the service's past incidents, for promoting SRE-agent actions (III, II.11).
- Owners' measured review throughput and review hours per agent PR, to size campaigns and cap open PRs (IV, VI).
- Token, CI and pre-production cost per accepted change, and CI capacity (II.5, IV, V.2).
- Catalog accuracy and freshness, and how often undeclared consumers break two-phase rollouts (V.1, VII).
- The inventory of stored secrets and API keys, and the S2S violation count during the log-only window (IV).
- The service's flaky-test rate and time from a clean checkout to a green build (VI).
- Intake, clarification and rework rates for the service's own PRDs and specs (II.1, II.2, II.3).
- SLO targets, ramp steps and hold times for the service's flags (II.10, II.11).
- Calendar durations for each phase; the windows in Part VI are ours (VI).

### Proposed kit items not yet written

Appendix D covers D1 to D11. These proposals from the sections and from document/kit-proposals.md are still open:

- Intake record and opportunity brief template (II.1).
- Full blueprint template with caps and budgets as config; D6 holds only the budget fields (II.5).
- Test-ownership and flaky-quarantine record (II.7).
- Validation report template; the flag registry record is already in D5 (II.10).
- Standalone change-set record; its links are fields of D7 for now (IV).
- S2S identity migration checklist: secret inventory, federation scope, log-only window, enforcement criterion (IV).
- Component interface sheet listing the task, verification, merge, deploy and ledger APIs and the REQ-IDs each satisfies (V.2).
- Worked-example fixture: filled-in D1, D2, D5 and D7 records for one feature (VII).
- One-page evidence map kept current, with grade and date per row (I).

Already covered, so no longer open: sprint contract (D4), design review and threat model (D9), PR evidence brief, provenance record and promotion log (D7), phase review record (D8), runbook-as-code and postmortem record (D10), migration campaign record (D11).
