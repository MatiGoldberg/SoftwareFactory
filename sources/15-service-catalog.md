# Service catalog: metadata, dependency graphs, and keeping it accurate

Notes produced 2026-11-15. Quotes verbatim; rest paraphrase. Items marked "(summary)" came from a model-extracted summary of the page rather than text read directly, or (for Netflix) from a secondary report because the original post would not load.

Public Microsoft material on **Service Tree** and **S360** is very thin: no Inside Track or Learn page describing either was found. What is public: the Inside Track scream-test post (Service 360 fed by Azure Resource Graph queries), a GitHub issue in `microsoft/sre-agent` that refers to a "Service Tree ID" on the S360 connector, and Learn docs for Azure Service Groups and Resource Graph change tracking. MS-IT-COMPLIANT-ENG (file 13) is still the best public Microsoft description of a catalog that drives compliance.

---

## [SPOTIFY-BACKSTAGE-CATALOG] Backstage Software Catalog: overview (plus "Backstage Service Catalog alpha" post)

URL: https://backstage.io/docs/features/software-catalog/ ; https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha
Publisher / date: Backstage project (CNCF, created by Spotify); docs current as of 2026-11; blog post by Stefan Ålund (Spotify), 2020-06-22

**Summary.** The catalog tracks ownership and metadata for all software (services, websites, libraries, data pipelines). Its source of truth is descriptor YAML stored in each repo, usually at the root. Entities enter the catalog in four ways: manual registration of the YAML URL, automatic registration when software is created from a Backstage template, static locations in config, or external integrations (providers). Owning teams edit metadata through their normal Git workflow, and the catalog picks up merged changes automatically. Entities that fail processing are shown by the "Unprocessed Entities" plugin.

**Key mechanisms**
- Catalog-as-code: metadata lives with the code and changes through the same PR and review as the code.
- Creating software from a template registers it, so new services start in the catalog from day one.
- Default view filters to the signed-in user's team's components ("owned by me"), which makes owners see their own entries.

**Notable quotes**
- "The source of truth for the components in your software catalog are metadata YAML files stored in source control"
- "Teams owning the components are responsible for maintaining the metadata about them"
- "Backstage will automatically show the updated metadata in the software catalog after a short while."
- (alpha post) the design "requires hardly any oversight from a governing or centralized team."

**Relevance:** the reference pattern for freshness: the catalog is derived from files in the repo that owners edit, not a separate database that people update by hand. Registering through templates closes the "never catalogued" gap. Spotify's internal catalog size and orphan handling are not in these pages.

---

## [SPOTIFY-BACKSTAGE-DESCRIPTOR] Backstage descriptor format of catalog entities

URL: https://backstage.io/docs/features/software-catalog/descriptor-format/
Publisher / date: Backstage project; docs current as of 2026-11

**Summary.** Defines the entity kinds (Component, API, Resource, System, Domain, Group, User, Template, Location) and their fields. Component and API require `owner` and `lifecycle` (`experimental` / `production` / `deprecated`). Components declare `dependsOn`, `providesApis` and `consumesApis`, and Resources can also declare `dependsOn`. APIs carry their definition (OpenAPI, AsyncAPI, gRPC and so on). `system` and `domain` group entities. Annotations hold references into external systems such as CI, on-call, monitoring and source location.

**Key mechanisms**
- **Reverse edges are computed.** Descriptors must not contain a `relations` field. Processors derive relations from the spec and always emit them in inverse pairs: `dependsOn`/`dependencyOf`, `ownedBy`/`ownerOf`, `providesApi`/`apiProvidedBy`, `consumesApi`/`apiConsumedBy`, `partOf`/`hasPart`. So the reverse dependency graph ("who depends on me") is free once each service declares its forward edges.
- Plugins should read the computed relations rather than the raw `spec.owner` (summary).
- Annotations link the catalog to pipelines, SLO dashboards, on-call and so on. SLOs and data classification are not first-class fields; they are added through annotations or custom kinds.

**Notable quotes**
- "the owner of a component is the singular entity (commonly a team) that bears ultimate responsibility"
- `owner` "is not to be used by automated processes to for example assign authorization in runtime systems." (summary of field text)
- dependencyOf points "to the components and resources that the component is a dependency of"
- Annotations' "purpose is mainly, but not limited, to reference into external systems."

**Relevance:** a concrete schema for owners, dependencies, APIs, lifecycle and system boundaries. Declared edges are only as accurate as owners keep them, so they need checking against runtime discovery (see NETFLIX-SERVICE-TOPOLOGY).

---

## [SPOTIFY-BACKSTAGE-INGESTION] Backstage external integrations and "The Life of an Entity"

URL: https://backstage.io/docs/features/software-catalog/external-integrations/ ; https://backstage.io/docs/features/software-catalog/life-of-an-entity/
Publisher / date: Backstage project; docs current as of 2026-11

**Summary.** There are three stages. **Ingestion:** entity providers fetch from authoritative sources (Git, LDAP or Entra, cloud APIs and so on) and tell the database what was added or removed. They do this either as a full replace of their entity set or as targeted deltas, on a schedule or from webhooks. **Processing:** processors validate, enrich and emit child entities and relations, re-running each entity on a timestamp-driven loop. **Stitching:** the stitcher merges the entity, its errors and all its incoming and outgoing relations into the final served entity. Incremental providers page through very large sources in bursts.

**Key mechanisms**
- **Derived from the source of truth:** each entity is owned by exactly one provider. Two providers cannot emit the same entity, and the database tracks which provider manages each one.
- **Last good version wins:** "Processing errors do not replace the last error-free version"; errors show in the entity's status field and through catalog events (summary).
- **Orphan detection:** when a parent stops emitting a child, the child gets `backstage.io/orphan: 'true'`. By default orphans are removed automatically; `orphanStrategy: keep` disables this.
- **Eager deletion:** when a provider signals a removal, the entity is deleted (if nothing else claims it). If you delete an entity whose parent still emits it, the entity comes back on the next processing pass. The catalog cannot drift away from its sources by hand edits.
- Cadence depends on the provider: config providers run once at startup, LDAP runs on a timer with full updates, and the location database sends incremental changes (summary). No global refresh interval is documented.

**Notable quotes**
- An entity provider "sits at the edge of the catalog as an original source of entities"
- Incremental providers handle "deletions and updates without holding the full data set at once."
- "If that child has no other edges pointing at it either, it becomes orphaned."
- "The default behavior of the catalog is to automatically remove orphaned entities"
- "when a provider signals the removal of an entity, then that leads to an eager deletion."

**Relevance:** the most explicit published design for catalog freshness: single-writer providers per entity, continuous reprocessing, orphan flagging and eager deletion. A factory catalog fed from the Microsoft sources (Service Tree, ADO repos and pipelines, Entra groups, Azure Resource Graph) can follow the same provider model.

---

## [GH-SERVICEOWNERS] How we organize and get things done with SERVICEOWNERS

URL: https://github.blog/engineering/how-we-organize-and-get-things-done-with-serviceowners/
Publisher / author / date: GitHub Blog; Max Beizer; 2023-12-19

**Summary.** GitHub's monolith (github/github) maps every file to a service through a `SERVICEOWNERS` file, which uses CODEOWNERS-style glob patterns. `service-mappings.yaml` then links each service to the catalog and to GitHub teams, plus its PM, EM, repo and chat channel. The `serviceowners` Ruby gem generates `CODEOWNERS` from these, so a reorg changes one line of YAML instead of many CODEOWNERS entries. The catalog shows the owning team, the on-call contact, support SLA expectations, SLO performance, tier (0 = critical to 3 = experimental) and fundamentals scorecards. `ownership.yaml` lets a service span several repos.

**Key mechanisms (CI-enforced accuracy)**
- "There can be no duplicate patterns/directories/files in `SERVICEOWNERS`."
- "All new files added to the github/github repository must have a service owner."
- "All patterns/directories/files must match at least one existing file." (stale entries fail CI)
- "Files matched by multiple glob patterns must be disambiguated by a file or directory definition."
- A CLI and a Hubot chat-op answer "who owns this file / what files does this service own" (summary).
- Incident commanders use the catalog to find on-call contacts, which the post says reduced remediation time (summary).

**Numbers & evidence.** Monolith of "over 4.2 million lines of code across roughly 30,000 files". No service or team counts are given.

**Notable quotes**
- "changing which team or teams maintain a service is a one-line YAML change."

**Relevance:** a Microsoft-family (GitHub) example of keeping ownership fresh through CI rules. New code with no owner fails the build, and dead patterns fail the build. Ownership goes through a stable service layer, so team reorgs don't break the file-to-owner mapping. The post says nothing about attestation or dependency edges.

---

## [GOOG-OWNERS] Code Review (Software Engineering at Google, ch. 9): OWNERS files

URL: https://abseil.io/resources/swe-book/html/ch09.html
Publisher / date: O'Reilly / Google (Winters, Manshreck, Wright, eds.), 2020

**Summary.** Every change at Google needs three approvals: a peer LGTM, ownership approval from an owner of each touched directory, and readability approval in the language. OWNERS files in each directory list the people responsible for it and its children. Ownership is hierarchical and additive (the union of the OWNERS files up the tree), and entries can reference other OWNERS files or ACLs. A new project needs only a new OWNERS file, with no central registration. The root OWNERS can approve large-scale changes globally.

**Key mechanisms**
- Ownership lives in the repo next to the code and is enforced at review time, so the review tool reads the ownership data and that keeps it current.
- Lists are kept small; departing members should hand off ownership promptly; ownership means stewardship, not an initiation rite (summary).
- OWNERS files double as documentation: tools and people find the responsible party by walking up the tree.

**Numbers & evidence.** One LGTM by default; feedback within 24 working hours; ~35% of changes touch one file; small changes are about 200 lines. The mechanism has scaled for about two decades to tens of thousands of engineers and billions of lines in one repo (summary).

**Notable quotes**
- "Specially named OWNERS files list usernames of people who have ownership responsibilities for a directory and its children."
- "a given file is generally owned by the union of the members of all the OWNERS files above it"
- "an owner of the directory in question must also approve this addition to their part of the codebase."

**Relevance:** the longest-running published proof that ownership metadata stays accurate when it lives in the repo and gates every change. This chapter does not cover service-level dependency or blast-radius tooling at Google, and no public Google source for that was found.

---

## [MS-AZ-SERVICE-GROUPS] What are Azure Service Groups?

URL: https://learn.microsoft.com/en-us/azure/governance/service-groups/overview
Publisher / date: Microsoft Learn; ms.date 2025-05-19, updated 2026-10-15. **Public preview.**

**Summary.** A service group is a custom grouping of Azure resources, resource groups and subscriptions across subscriptions, separate from the management-group and subscription hierarchy. It models "a service" as it actually runs. A resource can belong to several service groups. Groups nest up to 10 levels under a root whose ID equals the tenant ID. RBAC on a service group is inherited only by child service groups, never by member resources.

**Key mechanisms**
- A first-party, tenant-wide way to tie runtime resources to a logical service. It could serve as the "resources" edge of a catalog entry, or be generated from one.
- Membership doesn't grant access, so it is safe to populate automatically.

**Numbers.** Up to 2,000 service-group members per subscription; 10,000 service groups per tenant; 10 nesting levels; IDs up to 250 characters. Custom RBAC is not supported in preview.

**Notable quotes**
- "Azure Service Groups enable you to create flexible, custom groupings of Azure resources across subscriptions and resource groups without changing the existing resource hierarchy."
- "access on service groups doesn't grant access to the underlying resources."
- "There's **no RBAC inheritance** through the memberships to the resources or resource containers."

**Relevance:** the public Azure building block for "which resources make up service X". The page does not cover health or SLO aggregation, or how service groups relate to Service Tree.

---

## [MS-ARG-CHANGES] Get resource changes (Azure Resource Graph change analysis)

URL: https://learn.microsoft.com/en-us/azure/governance/resource-graph/how-to/get-resource-changes
Publisher / date: Microsoft Learn; ms.date 2024-06-14, updated 2026-04-03

**Summary.** Every create, update or delete of an Azure resource produces a `Microsoft.Resources/changes` record in the `resourcechanges`, `resourcecontainerchanges` and `healthresourcechanges` tables. Each record carries the property-level diff, plus `changeType`, `changedBy` (user or app identity), `clientType` (portal, CLI and so on), `operation` (the RBAC permission used) and a correlation ID. All of it can be queried with KQL across the tenant.

**Key mechanisms**
- A runtime source of truth for drift detection: compare the declared catalog or IaC state with the actual change stream, and flag changes made outside pipelines (for example `clientType` = portal on a production resource).
- `changedBy: System` marks platform-initiated changes; `Unspecified` means no identity was recorded.
- Limits: no snapshots for deleted resources; newly introduced properties are not shown as changes; tags added without values are not shown.

**Numbers.** "Change records should be available in less than five minutes." The page does not state a retention period (summary).

**Relevance:** gives the factory a near-real-time, tenant-wide feed of what actually changed and who changed it. That feed can keep the catalog's resource edges fresh and catch out-of-band changes. Combined with MS-AZ-SERVICE-GROUPS it can attribute a change to a service.

---

## [MS-IT-SCREAM-TEST] Moving from a "Scream Test" to holistic lifecycle management: how we manage our Azure services at Microsoft

URL: https://www.microsoft.com/insidetrack/blog/moving-from-a-scream-test-to-holistic-lifecycle-management-how-we-manage-our-azure-services-at-microsoft/
Publisher / author / date: Microsoft Inside Track; David Hirning (with Brent Burtness, Commerce Financial Platforms, and Pete Apple, Microsoft Digital); 2025-11-20

**Summary.** At first Microsoft IT had no reliable server inventory. They found owners by turning machines off and seeing who complained (the "Scream Test"). Today, automated Azure Resource Graph queries feed an internal **Service 360** tool, which raises action items for developers, each linked to the resource in the portal. Azure Advisor and Update Manager flag underused VMs, and a six-month lifecycle review asks whether each workload is still needed. The post does not name Service Tree and does not describe how resources are mapped to owners.

**Numbers & evidence.** About 15% of on-prem machines were found unused, some cold servers ran under 5% CPU, and compute costs fell 15–20%. In a pilot, the Commerce Financial Platforms team reduced 233 resources across 36 subscriptions, 17 services and 6 team groups, saving more than $15,000 a month. About 98% of IT resources run in Azure.

**Notable quotes**
- "We didn't have a great server inventory and tracking system, and we didn't always know who owned a server,"
- "Or, say we discover that a machine or server is getting hacked; you need to talk to who owns it."
- "Now, with clearer ownership, clearer accountability, and better inventory, it's a much better experience."

**Corroborating public mention.** A feature request in Microsoft's public `sre-agent` repo (https://github.com/microsoft/sre-agent/issues/223, undated) asks for Azure SRE Agent's **S360** data connector to be set up fully through Bicep, including "we need to be able to set the Service Tree ID for the connector via bicep". This confirms in public that S360 findings are keyed by Service Tree ID (summary).

**Relevance:** public Microsoft evidence for the pattern "runtime inventory (ARG) → per-service action items (S360) → owner". Without an accurate owner mapping, the fallback is the scream test. This is the closest public description of how S360 consumes inventory.

---

## [NETFLIX-SERVICE-TOPOLOGY] Netflix real-time Service Topology (via InfoQ, two articles)

URL: https://www.infoq.com/news/2026/06/netflix-microservices-realtime/ (Claudio Masolo, 2026-06-05) ; https://www.infoq.com/news/2026/08/netflix-service-topology/ (Eran Stiller, 2026-08-11)
Originals (not loadable from here): Netflix TechBlog, "From Silos to Service Topology: Why Netflix Built a Real-Time Service Map" and "Building Service Topology at Scale: Architecture Challenges and Lessons Learned", 2026
Publisher / date: InfoQ reporting on the Netflix TechBlog, 2026. **All content (summary), from secondary reporting.**

**Summary.** Four years of support requests kept asking the same questions: what depends on what, what is the blast radius of a change, and is a fault local or upstream. Netflix answered with a dependency graph discovered from runtime traffic rather than declared by owners. It merges three layers, each in its own graph partition:
- eBPF network flow logs, which cover services even when they aren't instrumented, but carry no endpoint context;
- IPC metrics, which add endpoint and protocol detail but only for instrumented services;
- aggregated distributed traces, which show real request paths but are sampled.

The pipeline has three stages: ingest multi-region Kafka streams in five-minute windows; resolve load balancers, gateways and NAT into direct app-to-app edges; enrich nodes with health, **ownership** and metadata, then write to a graph store. A gRPC API supports multi-hop queries filtered by availability tier and business domain, with sub-second responses as a hard requirement.

**Key mechanisms**
- **Freshness by construction:** the graph "updates almost in real-time as traffic patterns shift". Under load it applies backpressure and accepts "delayed freshness under load rather than dropped data or an incomplete map."
- **History:** time-windowed aggregator snapshots plus property-level mutation history let engineers rebuild the topology at a past time, to line up dependency changes with when an incident started.
- Uses: incident investigation, **blast-radius analysis and change management**. Planned next: add deployment and configuration change events to the graph, aiming at automated RCA.
- Consistent hashing over the service registry's healthy instances assigns aggregators. Hot destinations had seen up to 100× typical traffic.

**Lessons (summary)**
- Static or delayed dependency maps were not useful when services deploy several times a day.
- Incomplete or incorrect dependency data was "worse than no data at all", because it misled engineers during incidents.

**Relevance:** the strongest published case for deriving the dependency and reverse-dependency graph from runtime traffic instead of trusting declared edges. The factory should reconcile declared `dependsOn` (SPOTIFY-BACKSTAGE-DESCRIPTOR) with observed edges and treat mismatches as drift. Caveat: the details come from secondary reporting, not the Netflix post itself.

---

## Not found / unpublished

- **Microsoft Service Tree** schema, ownership attestation, and how S360 decides which checks apply: no public Learn or Inside Track description; only passing mentions (MS-IT-SCREAM-TEST, sre-agent issue). MS-IT-COMPLIANT-ENG (file 13) remains the best public proxy.
- **Uber uOwn** and **Meta ownership metadata**: no public engineering post found.
- **Owner attestation cadence** (periodic "confirm you still own this"): not documented by any frontier company found; GitHub and Google rely on CI and review-time enforcement instead.
- **Google service-level dependency and blast-radius tooling**: not found in public SWE-book or SRE material.
