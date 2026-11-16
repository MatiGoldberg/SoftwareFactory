# D-kit reader-judge review (Appendix D, D2 to D11)

Reader: a Microsoft engineering leader copying these templates into a repo on Monday. Length: 4,988 words (target about 5,000). No Mermaid blocks, so the validator was not run. All 7 YAML blocks parse with a YAML parser (D2 parses as 7 documents). No em-dashes found.

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Usability | 4 | Every YAML and markdown block has concrete example values on one shared composite (svc-profile, AC-1, profile.v3.write), but required fields are never marked, four items (D7, D8, D9, D10 postmortem) have no file path, and several tables are rendered tables rather than copyable blocks. |
| 2 | Consistency | 3 | Rungs and action IDs mostly line up across D5, D6, D7, D10 and D11, but there are real breaks: D7 points to a `gates` field that does not exist, D10 names `ops.scale-in`, which has no D6 entry, D2's `#svc-profile` fragment does not resolve in D6, the D5 and D7 risk tiers for org/profile#812 disagree, and rungs are restated outside D6 (D5, D11). |
| 3 | Length | 3 | The overall length is on target, but every intro runs 4 to 8 lines against the 2 to 3 asked, and about 300 words are internal bookkeeping ("Not included", "folded in", the assembly note) that a Monday reader does not need. |
| 4 | Day-one completeness | 3 | Missing: how "no agent edits this" is enforced (CODEOWNERS or branch protection), an adoption order, the kill-switch file format, a task-class list for the ledger, a `mode` (live or replay) field for replay evidence, and approval sections that the D4 and D9 gates check for. |
| 5 | Formatting | 3 | Headings and fences are clean, but two template tables have no separator row (D4 Decision log, D9 API contract changes), the D4 constitution's footer line becomes a table row, and the heading levels differ from D1 (`## D1` vs `### D2`). |

## Concrete edits

### Consistency (fix before publishing)

1. **D7 ledger, `approver` comment refers to a field that does not exist.**
   Text: `approver: lee.reviewer              # null for act_then_notify; then 'gates' lists what passed`
   Replace: `approver: lee.reviewer              # null for act_then_notify; then 'verifiers' lists the gates that passed`

2. **D10 names an undo action that D6 never defines, which breaks D6's own rule "every runbook step (D10) names one `id` from this file".**
   D6 text: `  - id: ops.scale-out                  # and its undo, ops.scale-in`
   Replace with two entries:
   ```yaml
     - id: ops.scale-out
       role: on-call-sre-agent
       rung: act_then_notify              # single service, reversible; promoted from replay (II.11)
       scope: { services: one, reversible: true }
       undo: ops.scale-in
     - id: ops.scale-in
       role: on-call-sre-agent
       rung: act_then_notify
       scope: { services: one, reversible: true }
   ```
   (Delete the now-duplicate original `rung:` and `scope:` lines.) Also add `- id: ops.diagnose` / `role: on-call-sre-agent` / `rung: advise` / `scope: { readOnly: true }`, because D10's `diagnose:` steps have no action ID either.

3. **D2 points to a per-service section that D6 does not have.**
   D2 text: `actionPolicy: policy/agent-actions.yaml#svc-profile   # template: D6; read-only here`
   Either replace it with `actionPolicy: policy/agent-actions.yaml   # template: D6; read-only here`, or add `appliesTo: [svc-profile]` to the D6 `defaults` and say that one policy file is kept per service. The first is simpler.

4. **The same PR has two risk tiers.** D5: `change: { type: code+flag, prs: [org/profile#812, org/delivery#433], riskTier: medium }`. D7 for org/profile#812: `riskScore: { value: 0.12, tier: low, ...}`.
   Change D7 to `riskScore: { value: 0.12, tier: low, modelVersion: <risk-model@v> }   # per PR; the change set's tier (D5) is the highest across its PRs`. Or change D5 to `riskTier: low`.

5. **Rungs are restated outside D6, which defeats a single source of truth.**
   - D5 text: `killSwitch: { who: [profile-oncall, on-call/SRE agent], rung: act_then_notify }`
     Replace: `killSwitch: { humans: [profile-oncall], agentAction: ops.flag-off }   # rung comes from D6`
     ("on-call/SRE agent" also matches no D6 role; the role is `on-call-sre-agent`.)
   - D11 text: `actionPolicy: { open: migration.shard-pr, merge: act_on_approval, allowListedClass: null }  # D6`
     Replace: `actionPolicy: { action: migration.shard-pr, mechanicalClassAction: null }  # IDs from D6; rungs live there`
   - In D6, give the allow-listed variant its own entry, so that D11 has something to point to: `- id: migration.shard-pr-mechanical` / `role: migration-agent` / `rung: act_then_notify` / `scope: { classes: [<allow-listed pattern>] }` / `guardrails: [verifiers-before-pr, sampled-audit, demote-on-revert]`. Then change the D6 comment `# owner merges; allow-listed mechanical classes may be act_then_notify (II.12)` to `# owner merges; see migration.shard-pr-mechanical`.

6. **The D11 `driver` approval conflicts with D6.** Text: `driver: sam.driver                     # approves shards for mechanical patterns where allowed`. In D6, the owner merges every shard. Replace: `driver: sam.driver                     # runs the campaign; never approves shards in repos they do not own`.

7. **Pipeline and ring names do not match between D2 and D5.**
   D2: `environments: [canary, pilot, region-waves]`. Replace: `environments: [canary, pilot, wave-1, wave-2]   # must match ring names in D5`.
   D5 `pipelines:` entries name a system, not a catalog ID. Replace `- { system: github-actions, component: cmp-delivery-router }` with `- { pipeline: pipe-delivery-gha, component: cmp-delivery-router }   # catalog Pipeline ID (D2)`, and do the same for the ADO line.

8. **D6 `rung` uses values the intro does not list.** The intro sentence ends: `` `act_then_notify` and `autonomous_within_budget`. `` Append: `` Two more values exist only in D6: `not_allowed` (never, at any rung) and `proposed:` (a future rung the engine ignores). ``

9. **The identity format differs between D4 and D7.** D4: `generator: agent://coding-agent@org` and `evaluator: agent://evaluator@org`. D7: `agentIdentity: entra-agent:coding-agent-profile`. Use one form, for example `generator: entra-agent:coding-agent-profile` and `evaluator: entra-agent:evaluator-profile`.

10. **D7 ledger `class` has no defined list.** Text: `class: feature/1-10-lines             # per task class, never averaged across classes`. Add a `classes:` list to D6 `defaults` (for example `classes: [feature/1-10-lines, feature/11-100-lines, lint-fix, dependency-patch-bump, test-backfill, ops/halt, ops/rollback]`) and change the comment to `# one of D6 defaults.classes; never averaged across classes`. D6 `code.maintenance-pr` `scope.classes` then draws from the same list.

11. **There is no place to store replay evidence.** The promotion checklist requires "replay agreement on past incidents", D6 says `until: replay_matches`, and D6 `ops.rollback-lkg` says "only after replay evidence (D7)", but the ledger record cannot mark a replay. After `record: tl-2026-11-16-000481`, add `mode: live                            # live | replay | shadow; replay records feed promotion, never outcome rates`.

### Usability and day-one gaps

12. **Mark which fields are required.** D2's text says "CI fails the PR if a required field is empty", but no field is marked. Add `# required` to the required lines in D2 (`id`, `owner`, `lifecycle`, `tier`, `slos`, `dataClassification`, `changeIntake`, `attestation`) and in D6 (`id`, `role`, `rung`, `owner`, `killSwitch`). In D6, add to `defaults`: `owner: <service tech lead>` and `killSwitch: policy/kill/<action-id>   # one file per action; presence = off`, then add one sentence under the D6 block: "Fields an entry omits inherit `defaults`." Today only `code.feature-pr` has an owner and a kill switch, but D8 line 14 and the promotion checklist require one for every action.

13. **Give the kill-switch file format.** No item defines `policy/kill/code.feature-pr`. Add a 4-line block under D6:
    ```yaml
    # policy/kill/code.feature-pr.yaml   (presence disables the action; on-call may create it without review)
    action: code.feature-pr
    by: <on-call alias>
    reason: <text>
    until: <date or "manual">
    ```

14. **Show how "no agent edits this" is enforced.** D3, D4 and D6 say "humans only", "agents cannot edit it" and "no agent can edit it", but no item shows the mechanism. Add to D6, after the rules paragraph, a CODEOWNERS block plus one line requiring branch protection with "require review from code owners", and agent identities excluded from those groups:
    ```text
    # .github/CODEOWNERS  (or ADO required reviewers by path)
    /policy/              @org/factory-governance
    /docs/constitution.md @org/profile-architects
    /tests/contract/      @org/profile-owners
    /catalog/             @org/profile-owners
    ```

15. **Add file paths to every item.** Add a path comment as the first line of each of these:
    - D7: `# ledger: platform table, schema factory/ledger-record/v1`, plus `docs/factory/promotion-log.md` and `.github/pull_request_template.md` (the evidence brief).
    - D8: `docs/factory/readiness.md`.
    - D9: `docs/design/<feature>.md`.
    - D10 postmortem: `postmortems/<incident-id>.md`.
    - D11: `migrations/<campaign>/campaign.yaml`.
    D1 itself says "Copy everything inside the block into the repo, for example as `docs/prd/<feature>.md`", so match that.

16. **Make D8, the D10 postmortem, and the D7 promotion checklist and log copyable.** They are rendered tables or checklists, not code blocks. Wrap each in a ```` ```markdown ```` block, as D1 does, so the reader copies the source text.

17. **D8 has no status column.** The text says "Each line is Yes, No or Partial with a link to evidence", but the table has only `| # | Area | Check | MUST/SHOULD | Evidence link |`. Replace the header with `| # | Area | Check | MUST/SHOULD | Status (Yes / No / Partial) | Evidence link |` and add a cell to each row.

18. **D4 Spec has no approvals section, although its ready gate checks for one.** The gate says "approvals from the spec owner and each changed dependency's owner are recorded". Before `## Open questions (must be empty for Ready)`, add:
    ```markdown
    ## Approvals
    | Role | Name | Spec version | Date |
    |---|---|---|---|
    | Spec owner | | | |
    | Each changed dependency owner | | | |
    ```

19. **D9 has no sign-off section, although its checklist asks for signatures.** The checklist line is "Service owner and dependency owners from the PRD have signed." Add `## 6. Approvals` with the same four-column table as edit 18, plus a `Security reviewer` row.

20. **The D10 postmortem has no root cause and no trust-ledger follow-up.** Add two rows to the field table: `| Root cause and contributing factors | |` and `| Did any agent action cause or worsen it? Demotion triggered (D7 log row) | |`.

21. **Unclear placeholder wording in the D7 evidence brief.** Text: `Not done or not verified: <list, never empty by default; "none" must be stated>`. Replace: `Not done or not verified: <list, or the word "none"; a blank field fails the check>`.

22. **Malformed YAML value in the D4 sprint contract.** Text: `editableByGenerator: [criteria (append only, before freeze)]`. This parses as two list items split at the comma. Replace: `editableByGenerator: { criteria: append-only-before-freeze }`.

23. **Awkward D6 default.** Text: `onModelOrHarnessChange: { act_then_notify: fall_back_to act_on_approval, until: replay_matches }`. Replace: `onModelOrHarnessChange: { demote: { from: act_then_notify, to: act_on_approval }, until: replay_matches }`.

24. **D7 nests `harness` inside `harness`.** Text: `harness: { model: <model@version>, prompt: <hash>, harness: <version>, ...}`. Rename the inner key to `harnessVersion: <version>`.

25. **The D5 lint checks a field the plan does not have.** The lint "every ring has a watchdog signal" has nothing to check, because rings carry no signal field. Either add `signals: from-catalog` to each ring line, or reword the lint to "every component in every ring has health signals registered in the catalog (D2 `healthSignals`)". Also show how to lengthen bake, since the lint allows "policy or longer": `bake: { min: policy, extra: 12h }` on one ring.

26. **Add a "Start here" table to replace "Not included" (see edit 29).** Put it at the top of the appendix, right after the intro:

    | Order | Item | File | Owner | Needed by |
    |---|---|---|---|---|
    | 1 | D8 readiness | docs/factory/readiness.md | Sponsor | Step 0 |
    | 2 | D2 catalog entry | catalog/service.yaml | Service owner | Step 0 |
    | 3 | D3 AGENTS.md | AGENTS.md | Tech lead | Step 0 |
    | 4 | D6 policy + CODEOWNERS | policy/agent-actions.yaml | Governance | Step 1 |
    | 5 | D7 ledger + PR template | platform table; .github/pull_request_template.md | Platform team | Step 1 |
    | 6 | D5, D4, D1, D9, D10, D11 | as listed | Per item | Steps 4 to 8 |

    Also add one line naming the scripts the reader must build, because none ships with the kit: catalog CI check, spec ready-gate, ring-plan lint, policy engine check, and sprint-contract append-only lint.

### Length and intros (cut about 350 words)

27. **Trim every intro to 2 or 3 lines, matching D1** (about 60 words). Pattern: "Draws on: <patterns with codes>. Required by: <REQ, section>." For example:
    - D7, current intro (about 100 words), replace with: "Our synthesis, drawing on per-class merge data from dotnet/runtime [MS8], revert rate as a health signal [SHOP1], outcome over usage metrics [AIE5, MS15], one conference talk's evidence rule [AIE13] and Entra Agent ID's recorded sponsor [MS12]. Meets REQ-GOV-03, REQ-GOV-04 (III) and REQ-REV-05 (II.6)."
    - D6: cut the clause "(stop after two consecutive auto-fix commits, never retry a reverted fix)", because it is already in the guardrails. Move "Tools read it before every action; the trust ledger (D7) changes `rung` only through..." to the rules paragraph after the block.
    - D5: cut "(REQ-PIPE-02 in II.9, REQ-PIPE-01 in IV)" down to one REQ, and cut "and the rollout-plan agent opens it as a PR that a human merges (Act on approval)", which duplicates D6 `rollout.plan-pr`.
    - D2: cut the sentence "Reverse edges (`dependencyOf`, `apiConsumedBy`) are never written here; the catalog computes them (REQ-CTX-03 in V.1)." It is repeated in the YAML comments and in the "Derived, not declared" paragraph.
    - Every item intro starts "This X is our synthesis", and the appendix intro already says "Every item below is our synthesis". Drop the phrase from each item.

28. **Remove internal process language.** Cut these phrases:
    - D7 intro: ", and folds in the proposed promotion and demotion log, provenance record and change-set link"
    - D8: "; folds in the proposed phase review item"
    - D5: `# one record per flag (II.10, folded in)` becomes `# one record per flag (II.10)`
    - D6: `# blueprint caps (II.5, folded in)` becomes `# blueprint caps (II.5)`

29. **Cut the "Not included" list from 13 bullets to 3 lines, and move the bookkeeping to kit-proposals.md.** Seven bullets only say "included as D10" or "folded into D7", which the reader can already see. Keep: "Not included: intake record (II.1), full blueprint template (II.5), validation report (II.10), test-ownership record (II.7), S2S identity migration checklist (IV.4), component interface sheet (V.2) and the Part VII fixture."

30. **Remove the "Assembly note" from the published text.** It is an instruction to the editor. Make the fix instead: retarget "(template: D8)" to "(template: D9)" in II.4 and VII, then delete the note.

31. **Remove the duplicated provenance data in D7.** `provenance.pr` repeats `links.prs` and `provenance.reviewers` repeats `actor.approver`. Cut both lines and keep `commit` and `riskScore`. Add the comment `# pr and reviewers are taken from links and actor when the attestation is signed`.

### Formatting

32. **D4 Spec: the Decision log table has no separator row.** Text: `| Date | Decision | Why | Who |`. Add `|---|---|---|---|` on the next line, or it renders as plain text once copied.

33. **D9: the API contract table has no separator row.** Text: `| Contract | Old version | New version | Breaking? (diff tool result) | Consumers (from catalog) | Ack (name, date) |`. Add `|---|---|---|---|---|---|`.

34. **D4 Constitution: the footer line becomes a table row** in GFM, because it follows the table with no blank line and contains pipes. Text: `Owner: <name>  |  Version: <v>  |  Changes need: <owner + architect approval>`. Insert a blank line before it. D1's version-history footer has the same problem: insert a blank line before "Any change to acceptance criteria...".

35. **Align heading levels with D1.** D1 uses `## D1 PRD template` with `### Template`, while this file uses `### D2 ...` under `## Appendix D`. On assembly, either demote D1 to `### D1` (and its subheads to `####`), or promote D2 to D11. Also turn the bold pseudo-headings in D4 (**Constitution**, **Spec**, **Sprint contract**) and D7 (**Ledger record**, **Promotion review checklist**, **Promotion and demotion log**, **PR evidence brief**) into `####` headings, so that they get TOC anchors, as D1's `### Grilling checklist` does.

36. **Two `### Open gaps` headings after assembly.** D1 and D-kit each end with one. Merge them into a single list at the end of Appendix D.

## Verdict

**READY AFTER EDITS.** The templates are concrete and largely consistent, and they hold the rung rules (no agent approves, L3 lands on gates, the ceiling is enforced). Edits 1 to 11 (cross-item consistency), 12 to 19 (required fields, enforcement, approvals) and 32 to 34 (broken tables) are needed before a team can copy the kit as is. The remaining edits are polish and length.
