# Phase 1 — online-first single-workspace functional replica

Phase 1 ends when every audited owned/core CRM workflow works coherently through the local product/data plane, and every external-provider boundary is honestly integrated, simulated, blocked, or explicitly deferred. It remains synthetic-data-only.

## Required core scope

- Global rail, context navigation, search, customization, density, notifications, account/support/AI overlays.
- Contacts and households, tags/custom fields, timelines, related records, validation, edit/delete, and imports.
- Pipelines/opportunities, stage history, tasks/comments/files, appointments, booking behavior, and calendar views.
- Policies, renewals, product/category fields, internal commission ledger/import simulation, reconciliation, and cross-record projections.
- Documents/object metadata, forms/responses, automations/jobs, campaigns/queues, analytics/audit, and single-workspace settings.
- Every audited route, nested view, loading/empty/populated/setup/disconnected/disabled/validation/error/permission/retry state, and responsive breakpoint.
- Explicit capability/gap records for every omission. “Almost all” is not an exit criterion.

## Product/data-plane architecture

| Boundary | Phase 1 decision |
|---|---|
| UI | Retain current React Vinext/Vite parity UI; no official Next.js migration now |
| API | Fastify on Node.js 24 LTS and TypeScript; separate modular monolith |
| Toolchain | Pin one exact Node.js 24 LTS patch and npm version in repository metadata |
| Transport | REST/JSON |
| Local infrastructure | Docker Desktop + Docker Compose on Windows; PostgreSQL is the first service, with other services added only for a functional slice |
| Database | Local PostgreSQL with migrations, constraints, seed, and transaction tests |
| Data access | Prisma as primary client; reviewed custom SQL isolated behind repository interfaces |
| Async | Modular monolith plus bounded TypeScript workers using durable job/outbox contracts |
| Auxiliary Python | Deferred unless a proven specialized library requires one isolated worker; never a second API/data authority |
| Workspace | One seeded workspace; `workspace_id` on business data, jobs, files, events, and audit |
| Request policy | Central identity/authorization context, synthetic in Phase 1 |
| Configuration | Externalized environment/configuration; no committed secrets |
| External providers | Owned ports with explicit simulated or real adapter status |
| Process placement | Run Vinext/Vite UI and Node.js/Fastify API directly on the Windows host; Compose manages infrastructure |
| Development | One planned root command checks/starts Compose and both app processes; reproducible Windows start/test; cloud not required |

Application frameworks and cloud infrastructure are separate decisions. Vinext/Next.js organize the frontend, Fastify is the selected HTTP framework for the API, and Vite builds the web client. Railway, Vercel, Sites, and Cloudflare are hosting/runtime choices. None replaces the API or PostgreSQL, and none is required for Phase 1 local development.

Docker Desktop and Docker Compose are selected development dependencies, not implemented infrastructure. The first Compose profile should start PostgreSQL; object storage, mail capture, queues, and other services join only with a slice that exercises them. The default app processes run on the Windows host with pinned Node/npm versions. Full local application containerization is deferred unless measured environment-parity problems justify it; the planned root startup command is not implemented.

## External-provider acceptance

Phone/SMS, delivered email, third-party calendar sync, life/Medicare/ACA quoting or enrollment, Commission+ sync, AI/voice, managed OCR, and similar workflows may use deterministic provider-neutral simulators.

Each simulated workflow must include:

1. complete user-visible flow and state transitions;
2. setup, disconnected, validation, failure, retry, and recovery states;
3. owned port commands/results and deterministic contract tests;
4. persisted synthetic events, audit, and cross-module effects;
5. separate owned-workflow and provider-boundary status;
6. explicit integration gap, decision state, and next proof.

A hard-coded success card, inert form, or fake counter is not functional. A simulator proves product behavior, not vendor integration.

## Delivery waves

| Wave | Outcome | Highest-value capabilities |
|---|---|---|
| 1. Windows product foundation | Pinned Node/npm, host-run UI/API, Docker Compose PostgreSQL profile, root startup command, PostgreSQL/Prisma migrations/seed, REST contract, workspace/request context | `CAP-PLAT-*` |
| 2. Shared record graph | Contacts, households, opportunities, tasks, appointments, policies, renewals, commissions, activities | `CAP-CRM-*`, `CAP-BIZ-001..003` |
| 3. Deep core workspaces | Record detail, edit/delete, documents, forms, settings, search, analytics/audit | `CAP-CRM-*`, `CAP-BIZ-*`, `CAP-ADMIN-*` |
| 4. Durable orchestration | Jobs/outbox, automation runs, campaigns/queues, notifications and failure/retry behavior | `CAP-AUTO-*`, `CAP-PLAT-*` |
| 5. Provider-simulated workflows | Complete phone/email/calendar/quote/enrollment/AI/voice/OCR/Commission+ flows behind owned ports | `CAP-COMMS-*`, `CAP-QUOTE-*`, `CAP-INS-*`, `CAP-AI-*` |
| 6. Parity and responsive hardening | All nested/state families, accessibility, desktop/tablet/phone baselines | All |

## Cross-record acceptance example

A synthetic policy renewal appears consistently in contact detail, policy list/detail, renewal dashboard, home/dashboard activity, follow-up tasks, analytics, and audit. Independent hard-coded fixtures do not satisfy this requirement.

## Web and PWA boundary

Responsive phone/tablet/desktop web UX is required. A network-required installable PWA shell may be added, but the current app has no PWA implementation and Phase 1 does not include device SQLite, offline writes, synchronization cursors, conflicts, offline leases, Tauri/native bridges, or app-store packaging. Do not cache sensitive API responses for offline use.

## Test gate

- RED behavior/API test first for each slice.
- Repository constraints, migration/seed repeatability, REST validation/errors, and workspace-scope tests.
- Reload persistence and cross-module projections.
- Provider-port contract tests and explicit simulator assertions.
- Worker/outbox idempotency and retry tests where applicable.
- Route/state landmarks, keyboard/focus/accessibility, and responsive checks.
- Clean Windows setup uses pinned Node/npm for the host-run UI/API and Docker Desktop + Docker Compose for PostgreSQL and slice-required services; one root command checks/starts both layers without a cloud account.
- No real PII/PHI, production credentials, customer destinations, or uncontrolled side effects.

## Exit checklist

- [ ] Every audited owned/core capability is `FUNCTIONAL`; any unresolved omission remains an explicit gap and blocks Phase 1 completion unless the owner formally reclassifies it as non-core.
- [ ] PostgreSQL, not browser storage, is the authoritative business-record store.
- [ ] One seeded workspace and all required SaaS seams are proven without claiming tenant isolation.
- [ ] Every external workflow has complete simulator/adapter status and contract evidence.
- [ ] Cross-module records, jobs, events, notifications, analytics, and audit agree.
- [ ] Exact Node.js 24 LTS/npm versions are pinned; one root startup command checks/starts the host-run UI/API and PostgreSQL-first Compose profile; every additional service has a functional-slice justification.
- [ ] Responsive Windows-local proof passes; any PWA claim is network-required only.
- [ ] Documentation and source register are current.
