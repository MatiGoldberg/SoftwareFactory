# Cross-section consistency to-do (for the consistency pass)
Found by the Part III writer, 2026-11-15:
1. II.9: the L4 fix-forward row must be marked as a future proposal, as II.11 does.
2. II.9 REQ-OBS-01 limits L3 to halt, LKG and flag off, while II.11 also allows scale-out at L3. Align them: II.9's rule covers rollout mitigations, II.11's covers runbook actions.
3. II.1 needs an owner click to file an intake item. II.11's postmortem agent has since been changed to go through the II.1 gate; verify.
4. II.4 and II.6 put blocking at L3. Decision: an agent finding that blocks a merge through a deterministic policy is "Act, then notify". It is reversible by human override and never an approval. Make sure the wording is consistent.
5. II.12's L3 depends on II.8's risk gate, which the roadmap schedules at Step 6. Align the order of the roadmap steps.
Also: requirement IDs need renumbering across the whole document.
6. Check every AKS Fleet (MS21) mention. Fleet update runs stage Kubernetes and node-image upgrades, not application or flag rollouts. Part VII's draft got this wrong, so check IV and V.2 too.
- V.2 references a D9 diagram/kit item; reconcile with D-kit numbering and kit-proposals.md at assembly.
- Replace "(template: proposed)" in sections with real kit items now in D-kit (D4 sprint contract, D9 design review, D10 runbook/postmortem, D11 campaign record); see qc/D-kit-grounding.md.
