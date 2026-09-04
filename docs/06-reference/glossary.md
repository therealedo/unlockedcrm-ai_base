# Glossary

| Term | Meaning in this repository |
|---|---|
| A2P/10DLC | U.S. application-to-person messaging registration/lifecycle; not merely a UI badge |
| Adapter | Replaceable implementation of an owned provider-neutral port |
| Application framework | Code/runtime structure for the web application, such as Vinext or Next.js; not a database, backend, cloud, or hosting environment |
| BAA | Business Associate Agreement; scope and product coverage require legal review |
| Capability ID | Stable `CAP-<FAMILY>-<NNN>` traceability identifier |
| Clean room | Independent implementation from neutral approved specifications with source/expression separation and provenance |
| Cloud infrastructure | Hosted compute, storage, networking, identity, and operations; not required for Phase 1 local development |
| Control plane | Future Phase 3 service for customer provisioning, subscriptions/plans, and fleet operations; it cannot directly manipulate CRM product tables |
| Deterministic provider simulator | Phase 1 adapter that exercises the full product workflow with repeatable synthetic provider responses and persisted attempts/outcomes |
| Deterministic test double | Isolated automated-test implementation used for fast contract/unit tests; not proof that the complete user workflow is functional |
| DNC | Do-not-call/suppression state requiring enforceable policy |
| Durable job | Persisted, idempotent work that survives restart and supports retry/reconciliation |
| Effective screen | Unique renderer; aliases may expose multiple paths to one screen |
| Evidence status | `LIVE-VERIFIED`, `LOCAL-VERIFIED`, `PRIOR-VERIFIED`, `GATED`, or `INFERRED` |
| Fastify | Selected target HTTP framework for the single Node.js 24 LTS TypeScript product API; not currently implemented |
| FastAPI | Rejected for the core API; Python may appear only in a separately justified isolated worker |
| Gated | Unavailable, blank, activation-dependent, or deliberately unsafe to exercise |
| HIPAA-ready | Not a current claim; requires applicable safeguards, agreements, operations, and independent review |
| IMO/FMO | Insurance marketing organization hierarchy represented in the audited workspace |
| Implementation status | `FUNCTIONAL`, `PARTIAL`, `MOCK`, `MISSING`, or `BLOCKED` |
| Locally reproducible | Browser/API/data services can be installed, seeded, run, and tested on the user's Windows PC without a cloud account |
| Network-required PWA | Optional installable web shell that still requires the API/network for CRM data and mutations; it is not offline-capable |
| Online-first | The server REST/JSON API and PostgreSQL are authoritative even when all processes run on one PC |
| Product/data plane | The CRM application, business workflows, APIs, data, jobs, files, events, and audit for an operational workspace |
| Provider-boundary status | Explicit state showing whether an external edge is simulated, disconnected, unavailable, test, or real |
| Preferred Phase 2 candidate | Highest-priority deployment option to test next; not selected production infrastructure or implementation evidence |
| Provider port | Owned interface between domain/application logic and replaceable simulators or real providers |
| Railway | Preferred but unvalidated Phase 2 candidate for persistent API, worker, and PostgreSQL hosting |
| Vercel | Optional frontend-preview candidate only; not the product API, worker, or database host |
| QLE | Qualifying life event used in ACA enrollment eligibility contexts |
| RPO/RTO | Recovery-point and recovery-time objectives |
| Selected target | Approved planned technology or provider; not proof it is currently implemented |
| SOA | Medicare Scope of Appointment workflow/document |
| Synthetic data | Fictional, non-identifying records required throughout Phase 1 |
| T65 | Turning-65 Medicare workflow window |
| Tenant isolation | Phase 3 enforceable separation across queries, jobs, files, caches, webhooks, search, AI, exports, and operations |
| Workspace | Phase 1 product ownership root; one seeded workspace operates initially |
| Workspace seam | Consistent `workspace_id` plus actor/workspace context and scoping rules that reduce later SaaS migration cost without claiming tenant security |
