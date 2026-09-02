# Mission and gated delivery phases

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI or SaaS.**

The mission is to build a useful private insurance CRM without confusing visual parity with a secure product. Each phase has a different purpose, data boundary, and exit gate.

## Phase summary

| Phase | Outcome | Data boundary | Exit gate |
|---|---|---|---|
| 1 — Functional development replica | Every safely accessible layout, module, nested subview, workflow, setting, and replaceable dependency works end to end against synthetic data through local services or lawful sandbox/test integrations | Fictional data; owned test destinations only | Traceable parity, functional development stack, adapter contracts, integration and behavior tests |
| 2 — Local production readiness | Plug-and-play personal/small-circle deployment that hardens the Phase 1 stack for approved limited real use | Limited real data only after explicit owner approval and independent review | Auth/RBAC, encryption, production vendor gates, backup/restore, observability, migration safety, signed upgrades, health/rollback |
| 3 — Public/SaaS readiness | Independently designed, multi-tenant public product in a new clean-room repository | Production data under approved governance | Legal, security, privacy, tenancy, billing, operations, licenses/SBOM, original product design |

## Phase 1 — synthetic functional parity

Phase 1 is an implementation laboratory. It may reproduce observable behavior and short functional labels, but not proprietary source, long copy, screenshots, branding assets, or hidden behavior.

Required outcomes:

- All 32 local paths and 30 effective screens remain mapped.
- Major live nested views and settings have capability IDs.
- Forms, dialogs, filters, empty/loading/error/setup/soon/disabled states, and responsive behavior work with fictional fixtures.
- Replaceable external services have owned adapter contracts and work through self-hosted development services or lawful vendor sandbox/test accounts where feasible.
- Phase 1 includes development-grade PostgreSQL, S3-compatible object storage, durable jobs/workflows, and event projections when the capability depends on them.
- Communications and calendar flows may target only explicitly owned test numbers, inboxes, and calendars; quote, enrollment, carrier, and AI flows use sandbox/test accounts or lawful public/local substitutes.
- Deterministic test doubles remain required for automated tests but are not a Phase 1 exit substitute.
- If a vendor or activation gate prevents a sandbox path, record the blocker, implement the provider-neutral adapter contract, and exercise the strongest lawful substitute without scraping or bypassing access controls.
- Cross-module synthetic records produce coherent dashboard, contact, policy, renewal, commission, analytics, and audit views.
- Automated tests plus end-to-end development integration tests prove workflows, persistence, jobs/events, and safe test-destination side effects.

Phase 1 does **not** authorize customer data, PHI, customer outreach, production destinations, production credentials, scraping, gate bypass, or a public offering.

## Phase 2 — safe local operation

Phase 2 does not introduce the product's first working integrations. It hardens the functional Phase 1 development stack for limited real use while retaining adapter replaceability.

Required outcomes:

- Authentication, secure sessions, MFA option, server authorization, role and ownership enforcement.
- Production-grade PostgreSQL records and S3-compatible object storage with encryption, capacity, recovery, and lifecycle controls.
- Encrypted secrets, rotation, least-privilege production adapters, webhook verification, idempotency, hardened durable jobs, and retained audit events.
- One-command documented hosting, health checks, monitoring, alerts, and incident procedures.
- Encrypted backups, tested restore, export/recovery, retention/deletion, and disaster-recovery objectives.
- Versioned migrations and signed data-first automatic upgrades with preflight, journal, atomic activation, health check, rollback, release channels, and recovery/export.
- Compliance controls for consent, DNC/opt-out, recording, CMS marketing, email delivery, and protected data.
- Independent security/privacy/compliance review before the owner enables real data.

Phase 2 is optimized for personal use and a small, explicitly invited circle. It is not automatically SaaS-ready.

## Phase 3 — clean-room public product

Phase 3 should begin in a **new repository**, not as a fork. A fork carries Phase 1 expression and history, making clean separation and later proof harder.

The new repository must be derived from neutral functional specifications and independently created:

- product name, trademarks, domains, copy, information architecture, visual system, layouts, icons, illustrations, and assets;
- source code, schemas, APIs, workflows, tests, fixtures, documentation, and onboarding;
- tenant isolation, subscriptions/billing, support, abuse, incident, privacy, retention, and deletion operations;
- license inventory, SBOM, dependency policy, terms, privacy notice, DPA/BAA/subprocessor program, and legal approvals.

Do not carry forward unLocked CRM branding, screenshots, copied copy/assets, proprietary source, exact visual composition, or tenant fixtures.

“IP-proof” cannot be guaranteed. Copyright, trademark, contract, trade-secret, patent, privacy, and regulated-industry risk require qualified counsel. See [Legal and IP boundaries](legal-and-ip-boundaries.md).

## Gate ownership

| Gate | Required approvers |
|---|---|
| Phase 1 complete | Product owner plus test evidence |
| Real data enabled in Phase 2 | Product owner, independent security review, privacy/compliance review |
| External vendor enabled | Product owner and documented vendor gate review |
| Phase 3 public launch | Product, security, operations, privacy/compliance, and qualified legal counsel |

## Next step

Use the [roadmap overview](../03-roadmap/overview.md) and [capability matrix](../02-traceability/capability-matrix.md) to select the next bounded slice.
