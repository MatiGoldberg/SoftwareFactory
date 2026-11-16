## D1 PRD template

This template is our synthesis, not a published company template. It draws on Spec Kit's what-and-why spec with no technical decisions [MS13], Anthropic's interview-to-SPEC.md pattern [AN5], and work items with acceptance criteria as the input for downstream agents [MS14, GH2]. It holds the fields that II.2's completeness check requires; the linter fails a PRD with any required field empty.

### Template

Copy everything inside the block into the repo, for example as `docs/prd/<feature>.md`.

```markdown
# PRD: <feature name>

Version: <v1.0>  |  Status: Draft / In review / Ready for spec  |  Last change: <date>
Intake item: <link>  |  Spec (II.3): <link, once created>

## 1. Problem and user
- Who has the problem: <user, customer segment or internal team>
- The problem today, with evidence: <incident, ticket, metric, quote; links>
- Why now: <deadline, incident trend, dependency change>

## 2. Acceptance criteria (observable checks)
Each criterion names a condition, an action and a result that a test, query or dashboard can check.
- AC-1: <Given ..., when ..., then ... (measured by ...)>
- AC-2: ...

Good: "AC-1: Given the flag is off in a region, when a client sends a v2 request, then
the service returns 400 with error code `V2Disabled` within 200 ms (integration test)."
Bad: "AC-1: The v2 API should work reliably and be fast."  (no condition, no measure, no check)

## 3. Non-goals
- <What this work will not do, even if it seems related>

## 4. Accountable owner
- Owner (one named person): <name, team>
- Backup: <name>

## 5. Dependencies
Owners come from the service catalog (see V.1), not from memory.

| Service | Owning team | What we assume about it | Sign-off (name, date) |
|---|---|---|---|
| <service-a> | <team> | <e.g. accepts new field `x` from v1.4; no SLO change> | <pending> |

## 6. SLO impact
- SLOs touched: <availability, latency p99, ...> | Expected change: <none / +n ms / ...>
- New load on dependencies: <requests per second, by service>
- SRE sign-off: <name, date>

## 7. Data classification and privacy trigger
- Data touched: <none / customer content / personal data / ...>
- New data collected, stored or moved across regions: <yes or no; details>
- Privacy and compliance review required: <yes or no>  (yes if any line above is not "none" or "no")
- Review sign-off: <name, date, or n/a>

## 8. Rollout constraints (see II.9)
- Rings: <standard / custom, and why>
- Feature flag: <name; default off; who can turn it off>
- Two-phase change needed (data format or protocol): <yes or no; Prepare and Activate described>
- Rollback: <how, and whether it is safe at every step>

## 9. Open questions
The PRD cannot pass "ready for spec" while any row is Open.

| # | Question | Who answers (named person) | Status | Answer or link |
|---|---|---|---|---|
| Q1 | <question> | <name> | Open / Answered | <answer> |

## 10. Sign-off log
| Role | Name | Version signed | Date |
|---|---|---|---|
| Accountable owner | | | |
| Each dependency owner (section 5) | | | |
| SRE (section 6) | | | |
| Privacy and compliance (if section 7 says yes) | | | |

## 11. Version history
| Version | Date | Change | Re-entered ready gate? |
|---|---|---|---|
| v1.0 | | Initial | n/a |
Any change to acceptance criteria, non-goals or dependencies creates a new version and re-enters the ready gate.
```

### Grilling checklist

The grilling agent works through this list in order. Before asking, it reads the context layer (catalog, incident history, design docs; see II.2) so its questions are specific.

1. **Problem.** Who is the user, and what evidence shows the problem? Ask for links, not opinions.
2. **Acceptance criteria.** For each "should", ask how it would be observed. Rewrite vague criteria as checks and confirm them with the owner.
3. **Non-goals.** Name at least one adjacent thing this will not do.
4. **Owner.** Confirm one accountable person.
5. **Dependencies.** List every service touched from the catalog. Send each assumption to that service's owner; never accept the requester's answer for another team.
6. **SLO and load.** Which SLOs move, and what new load lands on dependencies?
7. **Data.** What data is touched or moved? If any, mark the privacy trigger.
8. **Rollout.** Is there a flag? Is a two-phase change needed? Is rollback safe at every step?
9. **Leftovers.** Write every unresolved point as an open question with a named person to answer it. Never fill a gap with an assumption.

**Stop rule.** The agent stops asking when the draft passes the completeness lint, every acceptance criterion is an observable check, and every remaining unknown is on the open-questions table with a named person to answer it. It then submits the PRD to the ready gate; it never sets "Ready for spec" itself.

### Open gaps

- No source publishes a PRD template for agent consumption or measures one; every field and check here is our synthesis.
