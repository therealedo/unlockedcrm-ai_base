# Mission and gated delivery phases

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI, hosted production use, or SaaS.**

Build an online-first insurance CRM without confusing local reproducibility, application framework choice, hosting, or SaaS operations.

## Phase summary

| Phase | Product outcome | Data/deployment boundary | Exit gate |
|---|---|---|---|
| 1 — Online-first single-workspace product/data plane | Every audited owned/core CRM workflow works coherently through a local Node API and PostgreSQL while external-provider workflows use honest provider-neutral simulators where needed | Synthetic data; one seeded workspace; Windows-local start/test; no cloud required | Functional core, parity/state coverage, workspace seams, REST/API/database proof, explicit provider-boundary status |
| 2 — Secure hosted single-workspace readiness | One securely hosted workspace with production identity, operations, selected real integrations, and approved limited use | Limited real data only after explicit owner and independent-review approval | Auth/MFA/fixed roles, encryption, vendor gates, backup/restore, observability, deployment, migration, signed upgrades/rollback |
| 3 — Clean-room public/SaaS readiness | New original public product plus separate SaaS control plane | Multi-workspace production under approved governance | Tenant isolation, provisioning, billing/plans, fleet operations, support/abuse, legal, security, licenses/SBOM, original design |

## Phase 1 — online-first single-workspace functional CRM

Phase 1 is locally reproducible, not local-first or offline-first. The browser, API, and PostgreSQL may all run on one Windows PC, but CRM behavior still uses a networked REST/JSON application boundary.

Docker Desktop and Docker Compose are selected for Phase 1 Windows infrastructure, starting with PostgreSQL. Add object storage, mail capture, queues, or other services only when a functional slice requires them. By default, Vinext/Vite and Node.js/Fastify run directly on the Windows host with pinned Node/npm versions; one planned root command checks/starts infrastructure and both app processes. Full application containerization is deferred unless measured environment-parity problems justify it. None of this topology is implemented yet.

Required owned/core outcomes:

- all 32 registered paths, 30 effective screens, audited nested views, responsive layouts, dialogs, validation, and state families remain traceable;
- contacts/households, pipeline/opportunities, tasks/appointments, policies/renewals, internal commission records, documents/forms, automations, search/notifications, dashboards/analytics, and single-workspace settings work end to end;
- browser `localStorage` is no longer the business-record authority; PostgreSQL persistence, migrations, constraints, API validation, and cross-module projections are proven;
- the retained Vinext/Vite React UI talks to a separate Fastify-based Node.js 24 LTS TypeScript modular-monolith API;
- Prisma is the planned primary data-access layer, with reviewed custom SQL isolated behind repository interfaces;
- Python/FastAPI is not part of the core stack; a future Python worker requires a proven specialized library and cannot become a second API or data authority;
- bounded async workers use durable job/outbox contracts where completed workflows require them;
- one workspace is seeded and operated, while `workspace_id`, centralized request identity/authorization context, workspace-scoped repositories/constraints, stable APIs, external configuration, and provider ports preserve inexpensive future seams.

External-provider workflows may use deterministic simulators in Phase 1. Phone/SMS, delivered email, external calendar sync, quoting/enrollment, Commission+ sync, AI/voice, managed OCR, and similar boundaries are not required to contact a real vendor for the Phase 1 gate. They must still provide:

- the complete user workflow and observable state machine;
- setup, disconnected, validation, failure, retry, and recovery states;
- an owned provider-neutral port and deterministic contract tests;
- synthetic events/audit and coherent cross-module effects;
- explicit workflow status and provider-boundary status;
- an identified integration gap and safe next proof.

Hard-coded cards without domain behavior do not satisfy Phase 1. “Almost all” is not an acceptance rule: every omitted audited core capability must be explicitly tracked and approved.

Phase 1 uses synthetic data only. It does not authorize real sensitive insurance data, production credentials, customer outreach, real enrollment, scraping, gate bypass, hosted production, or public offering.

## Phase 2 — secure hosted single-workspace operation

Phase 2 turns the proven one-workspace product/data plane into a securely hosted service for explicitly approved limited use.

Required outcomes:

- production authentication, secure sessions, MFA/recovery, fixed roles, record ownership, and server-side enforcement;
- encryption/key management, secret rotation, hardened PostgreSQL and object storage, migration safety, retention/deletion/export, backup and recovery;
- selected real provider adapters after product-specific legal, licensing, security, consent, BAA/conduit, data-use, and operational gates;
- a Railway deployment spike for the persistent Fastify API, bounded workers, and PostgreSQL topology; Railway remains a preferred candidate rather than implemented infrastructure;
- hosted deployment, environment validation, health/readiness, observability, alerts, incident procedures, capacity/cost controls, and kill switches;
- signed data-first upgrades with preflight, backup, migration journal, atomic activation, health check, rollback, channels, and recovery;
- explicit owner approval after independent security/privacy/compliance review.

Phase 2 remains one workspace. It does not add public self-service provisioning, subscription billing, plan enforcement, or fleet management.

## Phase 3 — clean-room public product and SaaS control plane

Phase 3 begins in a **new repository**, not a fork. Its input is a counsel-approved neutral capability specification, not Phase 1 source, screenshots, assets, branding, long copy, exact composition, or tenant fixtures.

The public product requires original branding, information architecture, UX, code, schemas, tests, documentation, and operations. A separate control plane owns customer/workspace provisioning, subscriptions/billing, plan enforcement, fleet/deployment lifecycle, and public operations. It may call stable administrative product APIs or consume events; it must not directly manipulate CRM product tables.

“IP-proof” cannot be guaranteed. Qualified counsel must review the intended public product, provenance, contracts, trademarks, copyright, privacy, regulated-industry requirements, and launch.

## Deferred product modes

The current roadmap does not include installed native apps, Tauri/native adapters, device SQLite, offline mutations, durable cursor synchronization, conflict UX, offline leases, or app-store distribution. A Phase 1 PWA shell may be installable but remains network-required and must not claim offline CRM support.

## Gate ownership

| Gate | Required approval |
|---|---|
| Phase 1 complete | Product owner plus functional/test evidence |
| Limited real data in Phase 2 | Product owner plus independent security and privacy/compliance review |
| Real provider enabled | Product owner plus provider-specific legal/security/operational evidence |
| Phase 3 public launch | Product, security, operations, privacy/compliance, and qualified legal counsel |

## Next step

Use the [roadmap](../03-roadmap/overview.md), [capability matrix](../02-traceability/capability-matrix.md), and [gap register](../02-traceability/gap-register.md) to select the next bounded core slice.
