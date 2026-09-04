# Target architecture

The approved target is an online-first, locally reproducible, single-workspace CRM product/data plane. It retains the Vinext/Vite React parity UI and adds a separate Fastify-based Node.js 24 LTS TypeScript modular-monolith API. This is a target, not a description of the current browser prototype.

## Decision summary

| Decision | State | Boundary |
|---|---|---|
| Keep Vinext/Vite React UI for Phase 1 | `SELECTED-TARGET` | No migration to official Next.js now |
| Fastify HTTP API on Node.js 24 LTS and TypeScript | `SELECTED-TARGET` | Separate modular-monolith process/package boundary from the web UI |
| Exact Node.js 24 LTS and npm pins | `SELECTED-TARGET` | Repository metadata limits Windows toolchain drift; exact patch/tool versions are chosen during implementation |
| Modular monolith plus bounded async workers | `SELECTED-TARGET` | Domain modules stay explicit; only durable asynchronous work runs separately |
| REST/JSON transport | `SELECTED-TARGET` | Browser talks to application APIs; no Phase 1 offline sync protocol |
| PostgreSQL | `SELECTED-TARGET` | Authoritative product database locally and when hosted |
| Docker Desktop + Docker Compose | `SELECTED-TARGET` | Reproducible Windows development infrastructure; PostgreSQL first, then only slice-required services |
| Windows application process topology | `SELECTED-TARGET` | Run Vinext/Vite and Node.js/Fastify directly on the host; defer full app containerization until measured parity problems justify it |
| Root startup command | `SELECTED-TARGET` | One not-yet-named command checks/starts Compose infrastructure and both host app processes; not currently implemented |
| Prisma plus reviewed custom SQL | `SELECTED-TARGET` | Typed access/migrations; SQL escape hatches for critical constraints, indexes, and database features |
| Supabase | `CANDIDATE` | Optional PostgreSQL hosting provider only; never a required application dependency |
| Railway | `PREFERRED-PHASE-2-CANDIDATE` | Candidate host for persistent Fastify API, bounded workers, and PostgreSQL; deployment spike required |
| Vercel | `CANDIDATE` | Optional protected frontend previews only; not the product API, worker, or database host |
| Python/FastAPI core API | `REJECTED` | TypeScript/Fastify remains the only product API/data authority |
| Isolated Python worker | `RESEARCH-NEEDED` | Allowed only after a proven specialized-library need and a narrow job/port contract |
| Network-required PWA shell | `OPTIONAL-TARGET` | May add installability; no offline CRM data or mutation support |

Application frameworks, process placement, and cloud infrastructure are different choices. Vinext/Next.js organize the frontend, Fastify provides the HTTP application framework, Docker Desktop/Compose orchestrates local infrastructure, and Railway/Vercel are hosting platforms. Phase 1 runs the UI and API on the Windows host and requires neither a Next.js migration nor a cloud account. This topology, its version pins, and its startup command are targets, not current implementation evidence.

## Logical topology

```text
Windows host
  |-- Vinext/Vite browser UI / optional network-required PWA
  |          |
  |     HTTPS REST/JSON
  |          |
  |-- Fastify on pinned Node.js 24 LTS and npm
      |-- centralized request identity and authorization context
      |-- CRM, sales, insurance, communications, business, AI modules
      |-- application commands, queries, policies, and stable provider ports
      |-- webhook inbox and transactional outbox
              |
Docker Compose
  |-- PostgreSQL + Prisma/reviewed SQL
  `-- slice-triggered object storage, mail capture, queues, and provider simulators
              |
bounded async workers use the selected host/infrastructure boundary for their slice
              |
synthetic audit/events, logs, and health checks
```

The Phase 1 profile runs on one Windows PC. Vinext/Vite and Node.js/Fastify run directly on the host with exact Node/npm versions pinned; Docker Desktop + Docker Compose starts PostgreSQL first and adds other services only when a functional slice exercises them. One planned root command checks/starts infrastructure and both app processes. Full application containerization is deferred unless measured environment-parity problems justify it. None of this execution topology is implemented yet.

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

Use the [capability matrix](../02-traceability/capability-matrix.md) to select a thin vertical slice, then apply the [SDD change intake](../05-sdd/change-intake.md) when SDD is explicitly chosen.
