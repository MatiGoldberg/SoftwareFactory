# Consistency report (consistency pass, 2026-11-16)

Scope: all sections in `document/sections/`, checked against `01-conventions.md`, `00-skeleton.md`, `consistency-todo.md` and `kit-proposals.md`. Edits were surgical; no citation or number was changed and no Mermaid block was touched, so the validator did not need re-running. No em-dashes were found anywhere (before or after).

## consistency-todo.md items

| # | Item | Resolution |
|---|---|---|
| 1 | II.9 L4 row not marked as future | II.9 L4 row now starts "Future proposal:". |
| 2 | II.9 REQ-OBS-01 versus II.11 scale-out at L3 | II.9's rule (now REQ-OBS-01) says it covers rollout mitigations and that runbook actions such as scale-out follow REQ-OBS-07 in II.11. II.11's rule (now REQ-OBS-07) says it covers runbook actions and that rollout mitigations follow REQ-OBS-01 in II.9. |
| 3 | II.11 postmortem agent and the II.1 owner gate | Verified and tightened: the L3 row and the ceiling sentence now say the agent files an intake record only, and II.1's dedupe keys, priority rule and owner triage decide whether it becomes a backlog item (II.1's filing rate limit applies). III Step 8 controls now name owner triage too. |
| 4 | Blocking wording | III.1 now states the rule: a finding that blocks through a deterministic policy is Act, then notify, overridable by a human, never an approval. II.4 (blocking label: the board can clear it, never an approval) and II.6 (dismissal is a human override; a block is never an approval) say the same. Checked 0, III Step 2, VI, VII Step 5 and D6 `review.blocking-finding`: already consistent. |
| 5 | II.12 L3 depends on II.8's risk gate (step order) | Resolved by making the risk gate a Step 3 prerequisite everywhere: III Step 3 prerequisites say "II.8's deterministic class and risk gate, live from this step"; III Step 6 says the risk gate is "live since Step 3" and Step 6 adds only the risk-explanation agent; II.12 says the gate must be live before its L3 rung opens (Step 3 prerequisite). V.2 ("risk gate from Step 3") and VI (Days 90 to 180 delivers the class and risk check) already agreed. |
| 6 | AKS Fleet (MS21) mentions | 0.5, IV.3, V.2 and II.9's reference paragraph were already correct. Fixed: II.9 Enterprise complications ("Fleet sequences only Kubernetes and node-image upgrades on AKS, not application or flag rollouts"); D-kit D5, which listed a Fleet update run as a pipeline of an app and flag rollout plan (replaced by the Profile GitHub Actions pipeline plus a comment that Fleet runs stay outside the plan; intro reworded, citation kept); D2 `fleetMembership` comment now says cluster and node-image upgrades only. VII has no Fleet mention. |
| 7 | "(template: proposed)" now in D-kit | Replaced: II.3 sprint contract (D4); II.4 design review and open gap (D9); II.6 PR evidence brief, twice (D7); II.8 provenance record (D7, ledger `provenance`); II.10 flag registry (D5 `flagRegistry`); II.11 runbook and postmortem, twice (D10); II.12 campaign record, three times (D11); III promotion and demotion log (D7); IV change-set links (D7 `links`, standalone record still proposed); VI phase review, twice (D8). |
| - | V.2 reference to a D9 item | V.2 no longer mentions D9; nothing to reconcile. D9 is now the design review template. |
| - | Requirement IDs | Renumbered (see below). |

Every remaining "(template: Dn)" reference was checked against D-kit's contents and points to the item that holds that content.

## Whole-document checks

- **Rung ceilings.** Part 0's agent chart shows II.2 and II.3 at Act on approval and calls their L3 rows proposals, as III.1 does; the II.2 L3 row and both II.3 L3 rows (spec-drafting, planner) now start "Our proposal:". All other II.x tables, III's roadmap table and chart, V.2, VI and VII agree with Part 0's chart.
- **PR rule.** Three Prepare rows had an agent PR that a human merges (which is Act on approval). Fixed: II.5 context-gardener (a human adopts the proposal and opens the PR), II.7 flaky-test triage (owner adopts and submits), II.10 flag-cleanup (Prepare now drafts the PR; Act on approval opens it and the owner merges).
- **No agent approves its own output.** No violations found.
- **Terms** (trust ledger, verifier, context layer, deterministic core): used as defined; no change needed.
- **Cross-references.** Every "see X" target exists. Fixed: III.1 ladder table, where the L4 fix-forward example pointed to II.11 instead of II.9. I.2's open gap called the planned heat map "D1", which clashes with kit item D1; it now says the skeleton's diagram D1.
- **Phases and steps.** III (A = Steps 0 to 3, B = 4 and 5, C = 6 to 8) and VI (days 0 to 180, 180 to 270, 270 onward) agree. D-kit's start-here table listed D5 under "Steps 3 to 8", but D8 and V.2 need the ring plan at Step 0. D5 now has its own Step 0 row, and the remaining items are "Steps 3 to 7".

## Requirement renumbering

There were 131 requirements, renumbered in document order per area. All 16 areas are in the conventions list. The mapping is in `document/req-renumber-map.md`.

| CTX | VER | REV | MRG | DEP | OBS | IDN | REPO | API | PIPE | OWN | CFG | SEC | GOV | COST | PRD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 11 | 13 | 8 | 7 | 5 | 9 | 9 | 5 | 5 | 8 | 13 | 4 | 8 | 18 | 2 | 6 |

In-text mentions were updated, and cross-section mentions were mapped with the cited section's old numbering:
- II.4: REQ-DEP-04 (II.9) stays REQ-DEP-04. "complements REQ-OWN-01" meant II.2's rule (per the II.4 reader-judge note), so it is now "REQ-OWN-03 in II.2".
- II.9 and II.11: the two new cross-references (REQ-OBS-07, REQ-OBS-01).
- VI: REQ-GOV-10 in III is now REQ-GOV-16; REQ-GOV-06 (III) is now REQ-GOV-12.
- D-kit: all 15 mentions, for example V.1's CTX-01, OWN-03 and CTX-05 are now CTX-07, OWN-12 and CTX-11; III's GOV-01, 03, 04 and 10 are now GOV-07, 09, 10 and 16.
- Same-section mentions in II.2, II.5, II.6 and IV were mapped within their own section.

## Changed files

D-kit, I, II.2 to II.12, III, IV, V.1, V.2 and VI. V.1 and V.2 changed only by renumbering. 0, II.1, VII and D1 needed no change; II.1's IDs are the first in each area, so they are unchanged.

## Not resolved

- Kit items that are still proposals stay marked "(template: proposed)": the intake record and brief (II.1), the blueprint (II.5), the test-ownership record (II.7), the validation report (II.10), the S2S migration checklist (IV), the component interface sheet (V.2), the worked-example fixture (VII) and the evidence map (I). `kit-proposals.md` was not edited and still lists items that D-kit now covers.
- II.6's opt-in low-risk class (approved by the risk gate) is not placed on any roadmap step in III.4. It is marked as a proposal, so it was left as is.
- `consistency-todo.md` was not edited. This report records each item's resolution.
- No Microsoft source supports making the risk gate a Step 3 prerequisite; it rests on II.8's synthesis, as before.
