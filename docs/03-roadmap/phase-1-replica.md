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
| UI | `PARTIAL`: retain the current React Vinext/Vite parity UI; broader Phase 1 workflows remain incomplete |
| API | `PARTIAL` (`LOCAL-VERIFIED`): Fastify health shell exists; modular-monolith domain routes remain incomplete |
| Toolchain | `FUNCTIONAL` (`LOCAL-VERIFIED`): Node.js 24.18.0 and npm 12.0.2 are pinned |
| Transport | `PARTIAL` (`LOCAL-VERIFIED`): REST/JSON health endpoints exist; CRM contracts remain incomplete |
| Local infrastructure | `FUNCTIONAL` for Foundation (`LOCAL-VERIFIED`): Docker Compose runs PostgreSQL only on Windows |
| Database | `PARTIAL` (`LOCAL-VERIFIED`): PostgreSQL service exists; migrations, constraints, deterministic seed, and transaction tests remain Unit 2 |
| Data access | `MISSING`: Unit 2 adds Prisma and reviewed custom SQL behind repository interfaces |
| Async | `MISSING`: modular monolith plus bounded TypeScript workers using durable job/outbox contracts remain later Phase 1 work |
| Auxiliary Python | `MISSING` and deferred unless a proven specialized library requires one isolated worker; never a second API/data authority |
| Workspace | `MISSING`: Unit 2 adds one deterministic seeded workspace and `workspace_id` on the renewal graph |
| Request policy | `MISSING`: the Foundation defines a synthetic context contract; Unit 2 must derive and enforce it centrally |
| Configuration | `PARTIAL` (`LOCAL-VERIFIED`): Foundation API/process configuration is externalized and synthetic-only; later slices add their settings |
| External providers | `MISSING`: later slices add owned ports with explicit simulated or real adapter status |
| Process placement | `FUNCTIONAL` for Foundation (`LOCAL-VERIFIED`): Vinext/Vite and Fastify run on the Windows host; Compose runs PostgreSQL |
| Development | `PARTIAL` (`LOCAL-VERIFIED`): `dev:foundation` starts PostgreSQL plus host API/web; `dev:local` readiness awaits Unit 2 |

Application frameworks and cloud infrastructure are separate decisions. Vinext/Next.js organize the frontend, Fastify is the selected HTTP framework for the API, and Vite builds the web client. Railway, Vercel, Sites, and Cloudflare are hosting/runtime choices. None replaces the API or PostgreSQL, and none is required for Phase 1 local development.

The `LOCAL-VERIFIED` Foundation pins Node.js/npm and provides `dev:foundation`, which starts the PostgreSQL-only Compose service plus the host Fastify and Vinext/Vite processes. `GET /health/live` returns HTTP 200 with `{"status":"live"}`; `GET /health/ready` returns HTTP 503 with `MIGRATIONS_UNAVAILABLE`. Unit 2 still owns Prisma generation, migrations, deterministic seed, repositories, and renewal GET behavior. Object storage, mail capture, queues, and other services remain incomplete until a functional slice requires them. Full local application containerization remains deferred unless measured environment-parity problems justify it.

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
| 1. Windows product foundation | `PARTIAL`: pins, host-run health API/UI, PostgreSQL-only Compose, root `dev:foundation`, and health contract are `LOCAL-VERIFIED`; Prisma migrations, deterministic seed, repositories, renewal GET, and durable workspace/request behavior remain Unit 2 | `CAP-PLAT-*` |
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
- Foundation Windows startup is `LOCAL-VERIFIED`: pinned Node/npm runs the host UI/API, Docker Compose runs PostgreSQL, and `dev:foundation` starts both layers without a cloud account; live returns HTTP 200 and ready returns HTTP 503 `MIGRATIONS_UNAVAILABLE`.
- No real PII/PHI, production credentials, customer destinations, or uncontrolled side effects.

## Exit checklist

- [ ] Every audited owned/core capability is `FUNCTIONAL`; any unresolved omission remains an explicit gap and blocks Phase 1 completion unless the owner formally reclassifies it as non-core.
- [ ] PostgreSQL, not browser storage, is the authoritative business-record store.
- [ ] One seeded workspace and all required SaaS seams are proven without claiming tenant isolation.
- [ ] Every external workflow has complete simulator/adapter status and contract evidence.
- [ ] Cross-module records, jobs, events, notifications, analytics, and audit agree.
- [x] Foundation startup is `LOCAL-VERIFIED`: exact Node.js 24.18.0/npm 12.0.2 pins, host-run UI/health API, PostgreSQL-only Compose, and `dev:foundation` with live HTTP 200 and ready HTTP 503 `MIGRATIONS_UNAVAILABLE`.
- [ ] Unit 2 makes `dev:local` ready with Prisma generation, migration, deterministic seed, workspace-scoped repositories, and renewal GET behavior.
- [ ] Responsive Windows-local proof passes; any PWA claim is network-required only.
- [ ] Documentation and source register are current.
