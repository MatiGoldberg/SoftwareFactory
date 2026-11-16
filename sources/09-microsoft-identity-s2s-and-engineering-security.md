# Microsoft: S2S identity, securing agents, engineering-system security, post-CrowdStrike SDP

Notes produced 2026-11-14. Quotes verbatim; rest paraphrase.

---

## [MS-MI-BESTPRACTICE] Best practice recommendations for managed system identities

URL: https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations
Publisher / date: Microsoft Learn (Entra); 2025-03-14 (updated 2026-02-19)

**Summary.** When to use user-assigned vs system-assigned managed identities. User-assigned: rapid resource creation, replicated workloads, approval-heavy compliance, access needed before deployment. System-assigned: per-resource audit attribution, automatic permission removal with the resource. Least privilege (broad roles like subscription Contributor enlarge the "security blast radius"). Anyone who can run code on a resource inherits its identities. Lifecycle hygiene: delete unused identities and orphaned assignments. Group/role changes apply only after cached tokens expire.

**Key practices & mechanisms**
- One user-assigned identity per group of resources doing the same task (fewer role assignments and object creations).
- Code-execution rights = identity use; scope them tightly.
- For fast permission changes, assign roles directly to the identity, not via groups.
- Find and remove orphaned assignments (ObjectType "Unknown").

**Numbers & evidence**
- Mass creation of system-assigned identities can hit Entra rate limits (HTTP 429); deleted ones count until purged after 30 days.
- 4 VMs × 2 storage accounts: 2 role assignments (user-assigned) vs 8 (system-assigned).
- Managed identity tokens cached ~24 h per resource URI; cannot force refresh → revocation can take hours.

**Notable quotes**
- "always grant the least permissions needed to perform the desired actions"

**Relevance:** identity-per-service-tier pattern for microservices; anyone (or any agent) that can run jobs on a runner inherits its identity; emergency revocation can't rely on role edits alone.

---

## [MS-WIF] Workload identity federation

URL: https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation
Publisher / date: Microsoft Learn (Entra Workload ID); 2025-04-09 (updated 2026-08-13)

**Summary.** External workloads access Entra-protected resources without secrets: a federated identity credential on a user-assigned managed identity or app registration trusts tokens from an external IdP; the workload exchanges its IdP token (validated against the issuer's OIDC endpoint) for an Entra access token. Scenarios: Kubernetes (AKS, EKS, GKE, on-prem), GitHub Actions, AWS, Google Cloud, SPIFFE/SPIRE, Azure Pipelines service connections, and more.

**Key practices & mechanisms**
- Replace stored secrets/certificates with short-lived token exchange.
- Issuer, subject, audience must match exactly (case-sensitive).
- Azure Pipelines ARM service connections via WIF.

**Numbers & evidence.** Eight scenario families; only first 100 IdP signing keys stored.

**Notable quotes**
- "eliminates the risk of leaking secrets or having certificates expire"
- "Microsoft Entra ID issued tokens may not be used for federated identity flows."

**Relevance:** the Microsoft answer for S2S and pipeline auth across heterogeneous clusters, clouds and CI systems; precise subject scoping limits blast radius.

---

## [MS-IT-SECURE-AGENTS] Securing AI agents in the enterprise: Learnings from our journey at Microsoft

URL: https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/
Publisher / authors / date: Microsoft Inside Track; Mark Armstrong; 2026-08-27

**Summary.** Internal "Securing AI Agents" initiative in Microsoft's corporate tenant (Microsoft Digital, Windows, Entra, Intune, Defender, Purview, Security). Pilot on dedicated, resettable Windows 365 Cloud PCs for ~100 users, with preinstalled agent CLIs, Entra Agent IDs, Defender runtime protection, Purview DLP, Intune agent configuration, Global Secure Access network controls. Central mechanism: each agent gets its own Entra Agent ID instead of borrowing a person's identity, so access, audit, and runtime protection distinguish humans from agents. Phased rollout; existing security parameters not bypassed.

**Key practices & mechanisms**
- Distinct identity per agent; governance defined by who oversees a process.
- Layered controls: endpoint, identity, data, network, runtime — validated against live agent traffic, not just policy text.
- Pilot in isolated, resettable environments; phased control rollout with monitoring.

**Numbers & evidence.** ~100 pilot users; >70 stakeholders; started as a two-week sprint before Build 2026. No efficacy metrics.

**Notable quotes**
- "Entra Agent IDs let us give an agent its own distinct identity, instead of having it borrow a person's"
- "That meant not bypassing any of the security parameters that we've already deployed."

**Relevance:** blueprint for agent identity and layered controls in a Microsoft tenant; directly applicable to factory agents.

---

## [MS-SFI] Microsoft Secure Future Initiative (SFI) overview

URL: https://learn.microsoft.com/en-us/security/zero-trust/sfi/secure-future-initiative-overview
Publisher / date: Microsoft Learn; 2026-07-23

**Summary.** Multiyear initiative (Nov 2023) to secure how Microsoft designs, builds, tests, operates. Six engineering pillars mapped to Zero Trust and NIST CSF. Pillar 4 "Protect engineering systems": code, build systems and pipelines tamper-resistant, auditable, trustworthy. Zero Trust: verify explicitly (signed, traceable identities for every SDLC action), least privilege (developer, agent, and pipeline access by role and build context), assume breach (segregated build systems, signed reproducible builds). Other pillars: short-lived tokens and rapid rotation; access between environments only on approved paths.

**Notable quotes**
- "Restrict developer, agent, and pipeline access based on role and build context."
- "enforce code signed and reproducible builds to prevent tampering"

**Relevance:** the internal Microsoft security baseline a software factory must satisfy; explicitly names agents in SDLC access control.

---

## [MS-WIN-RESILIENCY] Taking steps that drive resiliency and security for Windows customers

URL: https://blogs.windows.com/windowsexperience/2024/09/12/taking-steps-that-drive-resiliency-and-security-for-windows-customers/
Publisher / authors / date: Windows Experience Blog; David Weston (CVP); 2024-09-12

**Summary.** Recap of the Windows Endpoint Security Ecosystem Summit after the July 2024 CrowdStrike incident. Safe Deployment Practices are core: gradual, staged deployment and the ability to pause or roll back. Microsoft shares SDP data/tools with MVI partners. Near term: more testing of critical components, joint compatibility testing across diverse configurations, health-info sharing, incident-response coordination. Long term: security products outside kernel mode. Customers: BCP, major incident response plan, backups.

**Notable quotes**
- "A core SDP principle is gradual and staged deployment of updates sent to customers."
- "being able to pause or rollback if needed"

**Relevance:** content/config updates (incl. security content and agent policies) must ride staged rings with pause/rollback; compatibility testing across heterogeneous fleets before broad rollout.
