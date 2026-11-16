# V.1 grounding QC

Section: `document/sections/V.1.md`. Reviewed against `01-conventions.md`, `references.md`, `00-skeleton.md` (V.1 brief) and the cited source notes (mainly `sources/15-service-catalog.md`, plus files 06, 07, 08, 10, 13). Requirement-ID clashes ignored as instructed.

## What checks out

- All 15 codes map to the right source IDs (MS28 to MS31, SPOT2, SPOT5, SPOT8 to SPOT10, GOOG6, GOOG8, GH3, MABL1, NFLX1, OAI1).
- Numbers match the notes: 900+ services and 3,800 repos (MS28), about 1,800 pipelines (SPOT5), 79 repos (MABL1), "less than five minutes" (MS30).
- Quotes are verbatim: MS28 area-path quote, SPOT8 source-of-truth quote, GOOG6 Rosie quote, GH3 pattern-match quote and "a one-line YAML change", NFLX1 "worse than no data at all".
- Coverage matches the brief: purpose, real-world reference, what it stores (entity chart, table, pointer to D2), reverse graph, keeping it current (derive, catalog-as-code, drift, attestation, agent-proposed updates), agentification, complications, requirements, open gaps.
- Synthesis is labelled throughout ("Recommendation:", "(our synthesis)", and a [GAP] on risk-score input). mabl is labelled vendor-reported.
- Rung names are exact. The ceiling is stated as Act on approval (L2), and the one L3 row is marked "Future proposal", with the CI gate doing the merge. Role names match between the chart and the table.
- REQ areas (CTX, OWN) are on the conventions list. Each requirement is MUST or SHOULD.
- No em-dashes. All 3 Mermaid blocks pass the validator with no WARN (smallest text 14.2px).
- Cross-references are used rather than re-explained: D2, D5, D6, II.4, II.8, IV.4, IV.7.
- Prose is about 1,240 words, which fits the "~2 pages" brief.

## Issues

| Location | Issue | Severity | Fix |
|---|---|---|---|
| What to agentify, intro vs. drift-detection agent L2 row | The intro says "providers and merged catalog PRs are the only writers" and "Agents only open PRs", but at L2 the drift agent "marks the entry 'drift open'". That is a direct catalog write outside the PR path, so the two statements contradict each other. | med | Make the "drift open" flag a derived field: a provider emits it from the open drift item, or the mark goes in through a catalog PR. Alternatively, state the exception explicitly in the intro. |
| Agentify table, curator L1 and L2 rows, drift L1 and L2 rows | The rung labels blur together. "Opens catalog PRs for gaps" (curator L2) and "Opens the fix PR" (drift L2) are Prepare (L1) under the vocabulary, because the agent prepares a PR and a human merges it. Curator L1 ("adds the catalog diff to the change PR") is the same kind of action, so the L1 and L2 rows do not differ in rung. | med | Relabel the PR-opening rows as Prepare. Keep Act on approval only for actions the agent itself carries out after a click, for example applying the drift flag or merging after the owner approves. Alternatively, restate L2 as "agent merges its catalog PR after explicit owner approval". |
| Reverse graph ("Blast radius" bullet); Keeping it current ("Drift detection", first sentence); Complications ("Uninstrumented legacy") | The NFLX1 note marks all content as "(summary)" from secondary InfoQ reporting. Three Netflix claims are stated flatly: built for blast radius and change management, derives its graph from eBPF/IPC/traces, eBPF has no endpoint detail. Only the "static maps" sentence says "reportedly". The open gaps mention the secondary status, but the body text does not. | med | Soften each one: "InfoQ reports that Netflix built...", "Netflix reportedly derives...". One clause at first use is enough, for example "(per InfoQ's reporting of the Netflix TechBlog)". |
| Real-world reference, Backstage paragraph: "Spotify exposes ownership and docs from Backstage to agents through MCP and a CLI [SPOT2]" | This claim rests only on a talk (SPOTIFY-CONSTRAINT is a write-up of Niklas Gustavsson's Code with Claude talk). Conventions require a talk-only claim to be named as such. | low | Write "Spotify's chief architect said in a 2026 conference talk that Backstage exposes ownership and docs to agents through MCP and a CLI [SPOT2]." |
| Real-world reference (GH3) and Keeping it current (GH3) | GH3 is grade C, and the GitHub SERVICEOWNERS practice rests only on it. The text gives no in-words signal of the source's weight. | low | At first mention, add "a 2023 GitHub engineering blog post describes...". |
| Backstage claims (SPOT8, SPOT9, SPOT10) and Azure claims (MS29, MS30) | These are grade C because they are product documentation. They are used for product behaviour, which documentation is the right source for, but nothing tells the reader that this is documented design rather than measured practice. | low | Add once: "per the Backstage docs" and "per Microsoft Learn". Optionally note in the open gaps that no source measures Backstage catalog accuracy in production (partly covered already). |
| Keeping it current, first bullet: "Processing errors do not replace the last error-free version" [SPOT10] | In the note, this quoted text sits in a bullet marked "(summary)" and is not under Notable quotes, so it may not be verbatim. | low | Paraphrase without quote marks ("a processing error does not replace the last good version"), or soften with "reportedly". |
| Keeping it current, first bullet: Resource Graph records changes "in less than five minutes" [MS30] | The source says "Change records should be available in less than five minutes", which is a target, not a guarantee. The clipped quote reads as a firmer claim. | low | Write "change records 'should be available in less than five minutes'". |
| Real-world reference, Microsoft paragraph: the S360 / Service Tree ID claim, cited [MS31] | The `microsoft/sre-agent` issue is a different document from MS31 (the Scream Test post). It is recorded inside the MS31 note but has no reference code of its own. The citation therefore attributes it to the Inside Track post. | low | Split the sentence: the issue claim carries "(public GitHub issue, recorded in the MS31 note)" or no code plus "reportedly". The ARG-to-Service 360 claim keeps [MS31]. |
| Reverse graph, "Order" bullet: "mabl, a test-automation vendor" | The note says only "25-engineer vendor; not frontier". "Test-automation" is not in the note, so it comes from memory. | low | Write "mabl, a 25-engineer vendor". |
| Reverse graph, "Consumers and owners" bullet: Google's Rosie [GOOG6] | Rosie shards changes by project boundaries and ownership. That is an ownership lookup, not a reverse-dependency (consumer) lookup, so it is a slightly stretched example of "uses of the graph". | low | Reword to "Google's Rosie uses ownership data to shard a change" or drop it. SPOT5 already carries the point. |
| Keeping it current, "Derive from sources of truth" bullet | Microsoft-first rule: the Azure options (Resource Graph, Service Groups) come after Backstage, even though the notes contain them. | low | Lead with Resource Graph and Service Groups for the Azure estate, then Backstage's provider model. |
| Purpose | The skeleton's V.1 brief ties the catalog to reviews (II.6), coordinated changes (IV.1) and compliance gates (IV.7). The Purpose names II.1, II.2, II.4, II.9 and II.12 but not II.6 or IV.1. | low | Add "reviewers (II.6)" and "coordinated multi-repo changes (IV.1)" to the list in the Purpose. |
| Complications, "Ownership is not authorization": "Backstage says `owner` reportedly should not drive..." | Softening is correct (the note marks it "(summary)"), but "says ... reportedly" reads awkwardly. | low | Write "Backstage's descriptor docs reportedly say `owner` should not drive runtime access [SPOT9]". |

## Counts

- High: 0
- Med: 3
- Low: 11

## Verdict

**PASS WITH FIXES.** Citations, numbers and quotes are sound, and synthesis is clearly labelled. Fix before assembly:

1. The drift agent writes to the catalog directly, which contradicts "only PRs write".
2. The PR-opening rows are labelled Act on approval, but they are Prepare.
3. The Netflix (NFLX1) claims are not softened, although the note marks them as summary from secondary reporting.
