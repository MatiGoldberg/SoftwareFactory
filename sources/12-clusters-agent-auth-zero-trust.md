# Multi-cluster rollout, agent delegated auth, MCP authorization, zero trust between services

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase.

---

## [MS-AKS-FLEET] Safely update Kubernetes and node images across multiple clusters (AKS Fleet Manager update orchestration)

URL: https://learn.microsoft.com/azure/kubernetes-fleet/concepts-update-orchestration
Publisher / date: Microsoft Learn; 2026-08-21

**Summary.** Fleet Manager "update runs" stage Kubernetes and node-image upgrades across many AKS clusters. Strategy → sequential stages → parallel groups → member clusters. Gates (approval, scheduled start), max concurrency, max allowed failures pace the run. Honors maintenance windows. Auto-upgrade profiles trigger runs. Platform-initiated upgrades bypass fleet sequencing. "Completed" does not mean success.

**Key mechanisms**
- Groups assigned via Update Group property or label `memberSelector` (preview).
- Approval gates before/after stages or groups; scheduled-start gates.
- maxConcurrency (int or %) at stage and group; max allowed failures (default fail-fast 0).
- "Consistent" node image across regions so earlier stages verify what later stages get.
- Restarted run resumes at last unprocessed cluster.

**Numbers & evidence.** ≤50 groups per stage; stage maxConcurrency default 50, group default 1; node images valid 90 days; 60-day platform grace period.

**Notable quotes**
- "A group can be `Completed` even if all members failed."

**Relevance:** Microsoft-native template for ring-based promotion across heterogeneous clusters; agents must check per-member state, not run status; plan for out-of-band platform changes.

---

## [MS-ENTRA-AGENT-OBO] Agent OAuth flows: On behalf of flow

URL: https://learn.microsoft.com/en-us/entra/agent-id/agent-on-behalf-of-oauth-flow
Publisher / date: Microsoft Learn (Entra Agent ID); 2025-11-04 (updated 2026-08-10)

**Summary.** OBO for agents built from an agent identity *blueprint* with child agent identities. User token Tc → blueprint obtains T1 using a managed identity as federated credential → child agent identity exchanges T1 + Tc for a resource token. Agents can't run interactive /authorize; consent comes from preauthorized, inheritable permissions on the blueprint. Refresh tokens support background work.

**Key mechanisms**
- Tc audience must be the blueprint; T1's `sub` (FMI path) resolves to the child agent identity.
- Credential preference: managed identity (FIC) > certificate > secret (discouraged in production).
- `InheritDelegatedPermissions` within tenant; admins preauthorize scopes.

**Notable quotes**
- "Agent identity blueprints can't initiate interactive `/authorize` flows directly."
- "Managed identities are the preferred credential type."

**Relevance:** an agent acting for a developer stays separately auditable from the developer; template-level (blueprint) consent scales to many agent instances.

---

## [MS-ENTRA-AGENT-PROTOCOLS] Authentication protocols in agents

URL: https://learn.microsoft.com/entra/agent-id/agent-oauth-protocols
Publisher / date: Microsoft Learn; updated 2026-06-11

**Summary.** All agent entities are confidential clients that can also serve as APIs for OBO. Three modes: on behalf of a user (interactive agents); own behalf via service principal (autonomous, app-only); own behalf via an agent user account. All auth uses multi-stage exchanges where the blueprint impersonates the agent identity via FIC. No interactive flows or public clients.

**Notable quotes**
- "All agent entities are confidential clients that can also serve as APIs for On-Behalf-Of scenarios."
- "Interactive flows aren't supported for any agent entity type."

**Relevance:** maps to factory roles: developer-delegated agents, autonomous pipeline/cluster bots, persona agents — each with separate policy and audit.

---

## [MS-CA-AGENTS] Conditional Access for agents

URL: https://learn.microsoft.com/entra/identity/conditional-access/agent-id
Publisher / date: Microsoft Learn; 2026-07-31 (updated 2026-09-30)

**Summary.** Conditional Access evaluates user/agent context, device, location, risk whenever Entra issues or refreshes a token. Each token has one subject; policies target that subject only, so an agent using several patterns needs several policies. OBO evaluates the user's policies, not the agent's. Blueprint- and attribute-level targeting covers classes of agents, including future ones. API keys bypass CA entirely.

**Key mechanisms**
- Three targets: Users (OBO), agent identity/blueprint (app-only), Agents assignment (agent user accounts).
- Continuous Access Evaluation for near-real-time enforcement; "agent execution environments" condition (Windows 365 Cloud PCs for Agents, preview).

**Notable quotes**
- "Conditional Access is evaluated whenever Microsoft Entra ID issues or refreshes an access token."
- "A policy that targets an agent identity doesn't apply to the agent's user account."

**Relevance:** standardize on Entra-issued tokens (no static API keys) so policy applies; budget for multiple policies per agent type.

---

## [MCP-AUTHZ] Model Context Protocol: Authorization (draft spec)

URL: https://modelcontextprotocol.io/specification/draft/basic/authorization
Publisher: MCP project

**Summary.** HTTP-transport authorization based on OAuth 2.1. MCP servers are OAuth resource servers publishing Protected Resource Metadata (RFC 9728); clients discover the AS, register via Client ID Metadata Documents (preferred), pre-registration, or (deprecated) DCR; send RFC 8707 `resource` on every request. Servers must validate token audience and must not pass tokens through. 403 `insufficient_scope` drives step-up with least privilege. Enterprise-managed authorization lives in a separate extensions repo (not read).

**Notable quotes**
- "MCP servers **MUST** only accept tokens that are valid for use with their own resources."
- "Clients **MUST** treat the scopes provided in the challenge as authoritative for the current operation."

**Relevance:** every internal tool server the factory exposes to agents (repo, CI, cluster, telemetry) should be an audience-bound resource server; no token passthrough; per-operation scope step-up.

---

## [GOOG-BEYONDPROD] BeyondProd

URL: https://docs.cloud.google.com/docs/security/beyondprod
Publisher / date: Google Cloud; updated 2026 (tail read via summary)

**Summary.** Google secures containerized microservices on Borg without perimeter trust: trust comes from code provenance, service identity, and trusted hardware. ALTS for mutual auth and encryption between services; Binary Authorization for Borg verifies signed build manifests and two-person review at deploy time; service access management for per-RPC authorization; end-user context tickets carry the user's identity separately from the service's; blue-green rollout; gVisor isolation for less-trusted code.

**Key mechanisms**
- Service identity bound to the microservice, not host/IP.
- ALTS credentials only to hosts that passed verified boot.
- End-user context tickets: short-lived, forwardable, integrity-protected.
- (summary) Migration lesson: ALTS rollout was prerequisite to access management; start by logging violations before blocking.

**Numbers & evidence.** Borg "deploys several billion containers a week."

**Notable quotes**
- "Only authenticated, trusted, and specifically authorized callers or services can access any other service."

**Relevance:** the reference zero-trust S2S model: service identity + user context ticket ≈ managed identity/WIF + Entra agent OBO; deploy-time provenance gate for agent-authored code; log-then-enforce migration path for an existing estate.
