# V.1 reader-judge review (service catalog)

Prose length (excluding tables, diagrams and Open gaps): about 1,140 words, at the top of the 900 to 1,200 target. Validator: all 3 Mermaid blocks OK, no WARN (block 1: 16.0px text, block 2: 15.5px, block 3: 14.2px).

## Scores

| # | Criterion | Score | Reason |
|---|---|---|---|
| 1 | Clarity (deterministic vs rungs) | 4 | The write path is clearly deterministic and the ceiling is honoured, but two rules clash: "Agents only open PRs" vs the drift agent marking entries, and the Advise (L0) staleness cap blocks the drift agent's own repair PRs. |
| 2 | Reading flow | 4 | Logical order (stores, reverse graph, freshness, agents). The Real-world reference section is dense and opens with the weakest material (the Service Tree/S360 sentence). |
| 3 | References explained before use | 3 | Rosie, S360, "OpenAI's lints", eBPF, and Resource Graph or Service Groups (in the table) appear before or without a one-clause explanation. |
| 4 | Detail and length | 4 | Within target. The owner's "how to ask for a change" is only a field name in a table cell; some specialist detail (orphanStrategy, clientType, inline GAP repeats) can go. |
| 5 | Message | 4 | The takeaway (derive, do not declare; make stale entries fail; staleness lowers autonomy) is strong but never stated in one line, unlike II.2 and II.9. |
| 6 | Diagrams | 4 | All three are readable and well placed. Diagram 3 feeds raw telemetry straight into an agent, which hides the deterministic reconciler, and diagram 1 has no `dependsOn` edge even though section 2 relies on it. |

## Owner-question coverage

| Owner asked | Where answered | Verdict |
|---|---|---|
| Metadata and data to store | Entity diagram and table | Clear |
| Architecture design | Service row: "architecture summary and design-doc links"; attestation bullet | Adequate, thin |
| APIs and contracts | API contract entity; reverse graph | Clear |
| Owners | Team and Service entities; REQ-OWN-01 | Clear |
| Deployment pipelines | Pipeline entity (ring plan D5, bake policy) | Clear |
| How to ask for a change | Only `change-intake path ("how to ask us for a change")` inside the Service row | **Not concrete.** See edit 1 |
| Change management via reverse dependency graph | Its own section, with a diagram and 3 published uses | Clear |
| Keeping it up to date | "Keeping it current", six mechanisms | Clear and strong |

## Concrete edits

1. **Make "how to ask for a change" concrete (owner question).** After "The full YAML schema is template D2.", add: "The change-intake path is a machine-readable address, not prose: the team's work queue (an ADO area path or a GitHub repo and label), the request template, and the expected response time. Agents that need another team's change, such as the grilling agent routing dependency questions (II.2) or a coordinated migration (IV.1), file a request there instead of messaging people, and the request is tracked like any other work item." Mark it **Recommendation:** if the notes have no source for it.

2. **Fix the "only writers" contradiction.** The text says "providers and merged catalog PRs are the only writers" and "Agents only open PRs", but the drift agent's L2 row says "marks the entry 'drift open' after owner click", which is a direct write. Replace the L2 "What it does" cell with "Opens the fix PR; drift status is set by the deterministic reconciler, not the agent". Change its guardrail to "Owner merges".

3. **Fix the staleness-cap conflict.** "an entry with open drift or lapsed attestation caps every agent action on that service at Advise (L0) until fixed" also blocks the drift and curator agents' repair PRs (L1/L2) on the very entries they exist to fix. Append: "Catalog-repair PRs for that entry are exempt; they still need owner approval." Make the same change in REQ-OWN-03.

4. **Separate the deterministic reconciler from the agent.** Comparing declared `dependsOn` to observed edges is a deterministic computation. In "Drift detection against runtime", change the recommendation to: "**Recommendation:** a scheduled reconciliation job compares declared `dependsOn` with observed edges, and out-of-band resource changes with the pipeline record; each mismatch becomes a drift item for the owner. The drift agent triages these items (real drift or telemetry noise) and drafts the fix." Rename "Drift-detection agent" to "Drift-triage agent" in both the chart and the table. In diagram 3, insert a core node: `TRAF --> REC(["Reconciler"]) --> DRI`.

5. **Add the one-line takeaway** at the top of "What to agentify, and how far", matching II.2 and II.9: "**Recommendation, in one line:** the catalog is written only by providers and merged PRs; agents keep it current by proposing diffs with every change and triaging drift, and a stale entry lowers every agent's autonomy on that service."

6. **Align who approves allowed-action changes.** The body says "Owners approve ownership, classification and allowed-action changes", but REQ-OWN-02 adds "(and governance for allowed actions)". Change the body to "Owners approve ownership and classification changes; allowed-action changes also need governance (see D6)."

7. **Cut or move the weakest reference sentence.** Remove "Microsoft's internal Service Tree is not publicly documented. A public issue in the Azure SRE Agent repo reportedly shows S360 findings keyed by a Service Tree ID, and Microsoft Digital describes Azure Resource Graph queries feeding Service 360 action items for owners [MS31]." Open gaps already covers it. If you keep any of it, write "Service 360 (S360), Microsoft's internal compliance-action dashboard," at first use, not after "S360". Doing this also brings Real-world reference closer to the template's 3 to 5 sentences.

8. **Explain Rosie or drop it.** "Google's Rosie "shards it based upon project boundaries and ownership rules" [GOOG6]" is unexplained, and it is about splitting a large change by owner, not about finding consumers. Either write "Google's Rosie, its tool for splitting a large-scale change into per-owner pieces, ..." or cut it; the Spotify example carries the bullet.

9. **Explain OpenAI's lints.** Change "OpenAI's lints check that the in-repo knowledge base is current" to "In OpenAI's harness-engineering write-up, lints check that the in-repo knowledge base is current" (or whatever OAI1 is, in one clause).

10. **Explain table terms before use.** The table's "Azure Resource Graph, Service Groups" comes before either is explained in "Keeping it current". Either add a one-line gloss under the table or move the Resource Graph and Service Groups sentence up into Real-world reference. Also gloss eBPF: "eBPF (kernel-level network tracing)".

11. **Trim specialist detail (about 40 words).** In Orphans, cut "(Backstage's `orphanStrategy: keep` [SPOT10])", since "keep orphaned entities flagged" is enough. In Owner attestation, cut "No source we found documents attestation cadence; GitHub and Google rely on CI and review instead [GH3, GOOG8]." because Open gaps already says it. Consider cutting "A reorg is "a one-line YAML change" [GH3]."

12. **Diagram 1: show the edge that section 2 depends on.** Add a "depends on" edge, for example `CMP -- "depends on" --> SVC` or a short caption: "Components also declare `dependsOn` other components; reverse edges are computed (next section)." The reverse-graph section currently relies on an edge the entity model does not show.

13. (Optional) **Tie it to "change management" as an MS reader means it.** Add to the reverse-graph intro: "This replaces the hand-written impact assessment in a change record: the lookup produces the affected consumers, owners and tiers." This connects directly to the owner's "use it for change management".

## Rung-consistency check (01-conventions.md)

- Ceiling: L2 is stated, and the only L3 row is marked "Future proposal", with the CI gate doing the merge. Pass.
- Labels: the curator's L0 (comment) is Advise and its L1 (diff in someone else's PR, author reviews) is Prepare. Pass. Drift L2 "marks the entry" is a write outside the PR path (edit 2).
- Roles: chart and table names match. If edit 4 renames the drift role, rename it in both places.
- Agent never approves its own output: pass ("No agent edits its own allowed actions"; owner or CI merges).
- Conflict with the staleness cap: see edit 3.

## Overlap with approved sections

There is little. II.2 already cites MS28 (catalog maps services to owners, and metadata triggers compliance). V.1 is the right home for that material and II.2 should just point to it. There is no duplication of II.9 content.

## Verdict

**READY AFTER EDITS.** Edits 1 to 4 are required. The rest are polish.
