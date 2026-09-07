# Target architecture

The approved target is an online-first, locally reproducible, single-workspace CRM product/data plane. The current synthetic browser prototype now includes a locally verified Foundation: pinned host tooling, a Fastify health shell, PostgreSQL-only Compose, and closed Windows startup. Durable CRM persistence and the broader modular-monolith product/data plane remain targets.

## Decision summary

| Decision | State | Boundary |
|---|---|---|
| Keep Vinext/Vite React UI for Phase 1 | `FUNCTIONAL` | Existing parity UI retained (`LOCAL-VERIFIED`); no migration to official Next.js now |
| Fastify HTTP API on Node.js 24 LTS and TypeScript | `PARTIAL` | Health plus one workspace-scoped renewal GET are `LOCAL-VERIFIED`; mutations and remaining domains are incomplete |
| Exact Node.js 24 LTS and npm pins | `FUNCTIONAL` | Node 24.18.0 and npm 12.0.2 are pinned in repository metadata (`LOCAL-VERIFIED`) |
| Modular monolith plus bounded async workers | `MISSING` | Domain modules and durable asynchronous workers remain target work |
| REST/JSON transport | `PARTIAL` | Health endpoints are `LOCAL-VERIFIED`; browser-facing CRM APIs remain incomplete |
| PostgreSQL | `PARTIAL` | PostgreSQL-only Compose service is `LOCAL-VERIFIED`; authoritative CRM persistence remains incomplete |
| Docker Desktop + Docker Compose | `FUNCTIONAL` | PostgreSQL-only Foundation profile is `LOCAL-VERIFIED`; add services only when a slice requires them |
| Windows application process topology | `FUNCTIONAL` | Default `dev:local` runs persistence startup plus host Vinext/Vite and Fastify; `dev:foundation` is preserved (`LOCAL-VERIFIED`) |
| Root startup command | `PARTIAL` | `npm run dev` validates the synthetic DSN, waits for PostgreSQL, generates/migrates/seeds, then starts API/web; hosted operations remain absent |
| Prisma plus reviewed custom SQL | `PARTIAL` | Generation, migration, workspace constraints, deterministic seed, repository, audit immutability, and GET wiring are `LOCAL-VERIFIED`; commands remain later work |
| Supabase | `CANDIDATE` | Optional PostgreSQL hosting provider only; never a required application dependency |
| Railway | `PREFERRED-PHASE-2-CANDIDATE` | Candidate host for persistent Fastify API, bounded workers, and PostgreSQL; deployment spike required |
| Vercel | `CANDIDATE` | Optional protected frontend previews only; not the product API, worker, or database host |
| Python/FastAPI core API | `REJECTED` | TypeScript/Fastify remains the only product API/data authority |
| Isolated Python worker | `RESEARCH-NEEDED` | Allowed only after a proven specialized-library need and a narrow job/port contract |
| Network-required PWA shell | `OPTIONAL-TARGET` | May add installability; no offline CRM data or mutation support |

Implementation rows use the project status vocabulary and `LOCAL-VERIFIED` evidence. Candidate, rejected, research, and optional rows remain architecture decision classifications rather than implementation claims.

Application frameworks, process placement, and cloud infrastructure are different choices. Vinext/Next.js organize the frontend, Fastify provides HTTP, Docker Desktop/Compose orchestrates local infrastructure, and Railway/Vercel are hosting platforms. The `LOCAL-VERIFIED` Windows path maps `npm run dev` to `dev:local`, while `dev:foundation` remains available. Units 2A–2C add Prisma generation, migration, deterministic seed, workspace-scoped renewal GET, and persistence-aware startup.

## Logical topology

```text
Windows host
  |-- Vinext/Vite browser UI / optional network-required PWA
  |          |
  |     HTTPS REST/JSON
  |          |
  |-- Fastify on pinned Node.js 24 LTS and npm
      |-- Prisma/reviewed SQL renewal persistence and read-only API (Units 2B–2C)
      |-- centralized request identity and authorization context
      |-- CRM, sales, insurance, communications, business, AI modules
      |-- application commands, queries, policies, and stable provider ports
      |-- webhook inbox and transactional outbox
              |
Docker Compose
  |-- PostgreSQL (Foundation)
  `-- slice-triggered object storage, mail capture, queues, and provider simulators
              |
bounded async workers use the selected host/infrastructure boundary for their slice
              |
synthetic audit/events, logs, and health checks
```

The `LOCAL-VERIFIED` runtime runs on one Windows PC: `dev:local` starts PostgreSQL and the pinned host applications after migration/seed, while `dev:foundation` stays generation-independent. Units 2B–2C add the scoped repository, constraints, immutable audit, one renewal GET, and persistence readiness. Mutation routes, additional services, and complete Phase 1 workflows remain `MISSING`. Cross-platform host support is owner-deferred.

A hosted Phase 2 profile deploys the same product/data plane with production security and operations.

## Phase 1 product/data plane

### Owned modules

- **Identity context:** one seeded user/workspace context for deterministic development; production authentication is Phase 2.
- **CRM:** contacts, households, relationships, tags, custom fields, consent, activities, search, and notifications.
- **Sales:** pipelines, stages, opportunities, tasks, appointments, booking links, dashboards, and analytics.
- **Insurance:** quote requests/results, eligibility, applications/enrollments, policies, renewals, carriers/products, providers, and medications.
- **Communications:** conversations, messages, calls, voicemail, recordings, sender/mailbox/number setup, suppression, and provider correlation.
- **Business:** internal commission ledger/import/reconciliation, documents, folders, versions, forms, responses, and extraction review.
- **Orchestration:** versioned automations, enrollments, runs, retries, campaigns, audience snapshots, schedules, queues, and callbacks.
- **AI:** conversations, prompt/result provenance, tool policies, approvals, usage, and provider state.
- **Administration:** single-workspace settings, teams, hierarchy, agency/IMO operations, support/developer surfaces, and customization.

Core modules and bounded workers remain TypeScript. Python/FastAPI cannot become a parallel API or data authority. If a specialized library later proves a Python worker necessary, it receives bounded jobs through an owned port, returns normalized results, and never accesses product tables outside its explicit repository/service contract.

Every audited owned/core workflow must be functional and PostgreSQL-backed. Omissions remain explicit capability/gap records; “almost all” is not an exit criterion.

### Workspace seams

Operate exactly one seeded workspace in Phase 1 while preserving inexpensive SaaS seams:

- put `workspace_id` on business records, jobs, files, events, search rows, exports, and audit records;
- derive workspace and actor once in a centralized request identity/authorization context;
- require workspace scope in repositories, unique constraints, foreign keys, object keys, job payloads, caches, and idempotency keys;
- expose stable domain/application APIs rather than database tables;
- externalize environment configuration and secret references;
- keep all provider integrations behind owned ports.

These seams reduce later migration cost; they are not proof of tenant isolation or production security.

## Provider-boundary contract

Phase 1 may simulate external services—phone/SMS, delivered email, third-party calendars, quote/enrollment vendors, Commission+ sync, AI/voice, managed OCR—while the owned workflow remains complete.

Every simulated boundary must include:

1. a provider-neutral port and normalized command/result types;
2. setup, connected, disconnected, unavailable, failure, retry, cancellation, and reconciliation states where applicable;
3. deterministic contract tests shared by simulator and future real adapters;
4. persisted provider correlation, idempotency, attempts, outcomes, and synthetic audit/events;
5. clear UI and traceability labels that the provider is simulated;
6. a documented activation/licensing blocker and lawful test substitute when relevant;
7. no scraping, bypass, real customer outreach, or real sensitive data.

A hard-coded success card or button that changes no persisted workflow state remains `MOCK`.

## Data and worker rules

- PostgreSQL is authoritative; browser storage may hold ephemeral UI preferences only.
- Prisma owns ordinary typed access and migrations; reviewed SQL is allowed for constraints, partial indexes, locking, search, and other PostgreSQL-specific needs.
- Commands that produce external or asynchronous work commit domain state and an outbox item atomically.
- Workers are bounded by explicit queues, concurrency, idempotency, retry policy, dead-letter/reconciliation, and workspace context.
- External callbacks enter through verification, deduplication, validation, quarantine, and inbox persistence.
- Objects use workspace-scoped keys and database metadata; the object provider remains replaceable.
- Events store source, schema/version, actor, workspace, time, correlation, and provenance.

## Phase 2 hosted product

Railway is the preferred candidate for hosting the persistent Fastify API, bounded workers, and PostgreSQL topology, but it is not implemented, validated, or selected production infrastructure. A deployment spike must prove builds, start commands, private connectivity, migrations, health/readiness, restarts, logs, cost limits, backup/restore, and rollback before promotion. Vercel may host protected frontend previews only.

Platform capabilities do not transfer responsibility: database backup, continuous monitoring, application upgrades, access control, application security, incident response, and compliance remain owned by this project.

Before limited real-data use, Phase 2 also adds production authentication/MFA, fixed-role enforcement, encryption/key management, secret rotation, backups/restore, observability, capacity, migration safety, signed updates, rollback, and selected lawful real integrations.

## Phase 3 control plane

The clean-room public/SaaS repository adds a separate control plane for customer/workspace provisioning, subscriptions/billing, plan enforcement, fleet/deployment management, and public operations. It may use versioned product APIs, commands, and events. It must never query or mutate CRM product tables directly.

## Explicitly deferred

Installed native apps, Tauri/native adapters, device SQLite, offline mutations, durable cursor synchronization, conflict UX, offline leases, and app-store distribution are not in the current roadmap. A network-required PWA does not change that boundary.

## Next step

For the active renewal slice, Unit 3 is the next proof: atomically complete the task and append one correlated audit event without closing the renewal. Use the [capability matrix](../02-traceability/capability-matrix.md) and [SDD change intake](../05-sdd/change-intake.md) for later slices.
