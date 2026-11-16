# QC: Appendix D kit (D2 to D11), grounding and consistency

Reviewer scope: `sections/D-kit.md` against `01-conventions.md`, `references.md` and the source notes in `sources/*.md`. Section not edited.

## Summary of checks

- (a) Grounding: all 40 cited codes exist in references.md and map to a note. Numbers and quotes checked ("a map, not a 1,000-page instruction manual", roughly 100-line AGENTS.md, about 24 hours bake, two consecutive auto-fix commits, two CI rounds, eight pillars, "within defined guardrails", "Grant autonomy action by action.", "Any change of behavior requires a change in the API version.", "Restrict developer, agent, and pipeline access based on role and build context.", "A passing-test claim needs a command, a result and the version of the code it checked."): all verbatim or exact. Minor attribution slips listed below.
- (b) Company attribution: the opening line and every item lead-in frame the templates as our synthesis. No template field is presented as a company's published practice. Two lead-in citations are slightly off (MS5, SPOT5).
- (c) Rungs: no agent approves its own output (`review.approve` and `ops.promote-ring` are `not_allowed`; D9 label is deterministic; emergency approvers "never an agent"). PR rule holds (feature, test-backfill, rollout-plan, catalog-repair, migration and fix-forward PRs are `act_on_approval`; `spec.draft` is `prepare` with owner submitting). Blocking rule holds (`review.blocking-finding` is `act_then_notify`, "a block is a gate action"). Ceiling `act_then_notify` matches III.1; L4 only as `proposed`.
- (d) Cross-references: every "template: Dn" in other sections points to an existing item that fits (D1 to D9 used; D10, D11 not yet referenced). All REQ IDs cited by D-kit exist in the named sections and match. Mismatches are stale "(template: proposed)" markers and the stale assembly note.
- (e) Em-dashes: 0 found.
- (f) Code blocks: all 7 YAML blocks parse (PyYAML `safe_load_all`; D2 is 7 documents). One block parses to an unintended value (D4 `editableByGenerator`). Markdown template blocks are not machine-checked.

## Issues

| Location | Issue | Severity | Fix |
|---|---|---|---|
| D6 YAML, lines 316 to 372 | REQ-GOV-01 (III.md:119) says each policy entry names "the action, its rung, scope, guardrail, owner and kill switch". Only `code.feature-pr` has all of them; most entries lack `owner` and `killSwitch`, and several lack `scope` or `guardrails` (for example `review.approve`, `ops.rollback-lkg`, `ops.flag-off`, `ops.failover-region`, `ops.fix-forward`). The template therefore fails the requirement it claims to meet. | med | Add `owner` and `killSwitch` (and `scope`/`guardrails` where missing) to every entry, or add `defaults.owner` / `defaults.killSwitch` and state that entries inherit them. |
| Line 607 (Assembly note) | Stale. II.4.md:28 and VII.md:68 already cite "(template: D9)" for the design-approved checklist; neither cites D8 any more. An editor note also should not ship in the appendix. | med | Delete the assembly note. |
| Other sections vs D-kit "Not included" list | Items now in the kit are still marked "(template: proposed)" elsewhere: II.3.md:107 sprint contract (now D4); II.4.md:27 design/security review (D9); II.6.md:99 PR evidence brief (D7); II.8.md:103 provenance record (D7); II.10.md:97 flag registry (D5 `flagRegistry`); II.11.md:86 runbooks as code (D10); II.12.md:26, :96 (REQ-REPO-02), :110 campaign record (D11); III.md:138 promotion and demotion log (D7); IV.md:170 change-set record (D7 `links.changeSet`); VI.md:32, :132 phase review record (D8); II.5.md:110 blueprint caps (partly D6 `defaults.budgets`). | med | Retarget each to the D-item named here; drop the matching Open-gaps "proposed kit item" bullets. Also update 01-conventions.md line 64 to list D9 to D11. |
| D6 lead-in line 295; D10 lead-in line 527 | "Meta's on-call team rule" and "Meta's per-action autonomy" rest only on AIE4, a conference talk; conventions require saying so in words (D7 and D8 do this for AIE13 and AIE8). | med | Write "Meta's on-call team, in one conference talk, ..." in both places. |
| D5 lead-in line 235 | "bake set by policy rather than by developers [MS2, MS5]": MS5 (Gandalf NSDI paper) supports proceed/stop analytics, not policy-set bake. | low | Cite only [MS2] for policy bake; put [MS5] on the `watchdog: shared # Gandalf-style go/no-go` line. |
| D3 lead-in line 103 | "which dotnet/runtime tuned [MS8]": the note marks the instructions/setup finding "(summary)". | low | "which dotnet/runtime reportedly tuned [MS8]" (V.2.md:46 already says "reportedly"). |
| D7 lead-in line 379 | "merge rate varied by PR size [MS8]": the note's by-size figures are success rates (80.0% vs 64.0%), and success (67.9%) is not the same as merged/opened (535/878). | low | "success rate varied by PR size". |
| D11 lead-in line 565 | "Spotify's ... per-consumer tracker [SPOT5]": the note says Fleetshift's UI "tracks progress and communication"; per-consumer granularity is our addition. | low | "Spotify's consumer list from catalog lineage and Fleetshift progress tracking [SPOT5]". |
| D6 rules, line 375 | "a kill switch takes effect in the policy check at once, without waiting for token expiry [MS16]" reads as if MS16 says it. MS16 only says managed-identity tokens are cached about 24 h, so revocation can take hours. | low | "...at once, because token revocation can take hours [MS16]". |
| D4 sprint-contract YAML, line 230 | `editableByGenerator: [criteria (append only, before freeze)]` parses as two strings, `"criteria (append only"` and `"before freeze)"`. | low | `editableByGenerator: { criteria: append_only_before_freeze }` or quote the item. |
| D7 ledger YAML, line 392 | Comment says "then 'gates' lists what passed", but the record has no `gates` field. | low | Add a `gates:` list, or change the comment to point at `verifiers`. |
| D7 ledger record vs II.5.md:100 and II.12.md:101 | Both sections' REQ-GOV-01 rows say the ledger records CI rounds, human-pushed commits and end-to-end time (including review and landing); the D7 record has no `ciRounds`, `humanPushedCommits` or end-to-end time field. | low | Add `ciRounds`, `humanPushedCommits` and `timeToLand` under `outcome` or `cost`. |
| D6 vs II.8.md:69-70, II.4.md:70 | Sections cite D6 for the merge-conflict resolver (L2 and L3) and for design-stage roles, but D6 has no such entries. | low | Add `merge.resolve-conflict` entries (L2, and L3 for allow-listed textual files) or state that D6 is an illustrative subset. |
| D7 PR evidence brief, line 439 | "the evidence agent drafts it at Prepare": the brief rides on the agent's PR, which is Act on approval; no evidence-agent role exists in D6. | low | "the coding agent attaches it to its PR" or add an `evidence.brief` entry to D6 at `prepare`. |
| Lead-ins of D2, D3, D6, D11 | Microsoft-first rule: Backstage, OpenAI, Meta and Google are named before the Microsoft or GitHub option (GH3/MS28, GH2/MS8, MS10, MS3). | low | Reorder each lead-in to put the Microsoft or GitHub source first. |
| 01-conventions.md line 64 (outside section) | Kit list stops at D8, and line 66 forbids D9 and up; D-kit now defines D9 to D11. | low | Update the conventions list so writers reference D9 to D11. |

Counts: high 0, med 4, low 12.

## Verdict

**PASS WITH FIXES.** Grounding is sound and the rung rules hold throughout; fixes are consistency and labelling, chiefly D6 entries missing owner and kill switch, the stale assembly note, and "(template: proposed)" markers in other sections that D-kit now covers.
