# Three-phase roadmap

The sequence is: **functional single-workspace product locally, secure hosted single-workspace operation, then a separate clean-room SaaS/control-plane product.**

## Phase sequence

| Phase | Primary result | Must not do |
|---|---|---|
| [Phase 1](phase-1-replica.md) | Online-first, locally reproducible CRM product/data plane with functional owned workflows and explicit simulated provider boundaries | Real PII/PHI, production credentials, customer outreach, cloud dependency, offline claim |
| [Phase 2](phase-2-local-production-readiness.md) | Secure hosted single workspace with selected real integrations and approved limited use | Assume multi-tenant/SaaS/control-plane readiness |
| [Phase 3](phase-3-public-readiness.md) | New clean-room public product and separate SaaS control plane | Fork/carry Phase 1 expression or let the control plane manipulate product tables |

## Current position

Phase 1 is in progress. The current Vinext/Vite UI covers 32 paths/30 screens, but persistence is browser-local, most workflows are partial or mocked, and no API, PostgreSQL, worker, production identity, real provider integration, or PWA exists.

## Phase 1 exit

- Every audited owned/core workflow and omitted exception is traceable.
- Contacts/households, pipeline, tasks/appointments, policies/renewals, internal commissions, documents/forms, automations, search/notifications, dashboards/analytics, and single-workspace settings are functional.
- A separate Fastify-based Node.js 24 LTS TypeScript REST/JSON API persists coherent synthetic data in local PostgreSQL through Prisma/repository boundaries.
- One seeded workspace operates with `workspace_id` ownership, centralized request context, workspace-scoped repositories/constraints, stable APIs, external config, and provider ports.
- External-provider workflows expose complete state machines and deterministic provider-neutral simulators with contract tests and synthetic audit/events; their provider status remains `MOCK` until a real adapter is proven.
- Pinned Node.js 24/npm run Vinext/Vite and Fastify on the Windows host; Docker Desktop + Docker Compose runs PostgreSQL and later slice-required infrastructure; one root startup command checks/starts both layers. Full application containerization remains deferred unless parity evidence justifies it.
- Responsive desktop/tablet/phone behavior and Windows clean-start/test proof pass.
- Any PWA shell is explicitly network-required. Native/offline data modes remain deferred.

This gate does not require cloud infrastructure or every real vendor integration.

## Phase 2 limited-use approval

- Complete a Railway deployment spike for the persistent Fastify API, bounded workers, and PostgreSQL topology; keep Railway labeled preferred candidate until validated.
- Secure hosted single-workspace deployment; Vercel, if used, is limited to frontend previews.
- Production authentication, MFA/recovery, fixed-role/ownership enforcement, encryption/key management, secret rotation, and hardened data/files/jobs.
- Selected real integrations pass legal, licensing, security, BAA/conduit, consent, data-use, failure, cost, and operational gates.
- Backup/restore, monitoring, incident response, migrations, signed updates, health checks, and rollback are exercised.
- Independent review and explicit owner approval name the limited users/data/adapters.

## Phase 3 public launch

- New clean-room repository and original product design/identity.
- Separate control plane owns provisioning, subscriptions/billing, plan enforcement, fleet management, and public operations through stable APIs/events.
- Tenant isolation, support/abuse, privacy/legal, licenses/SBOM, incident, retention, and deletion programs pass.
- Qualified counsel clears the intended launch.

## Work selection

1. Start at [Gap register](../02-traceability/gap-register.md).
2. Choose one bounded capability and boundary.
3. Create a [change brief](../07-templates/sdd-change-brief-template.md).
4. Follow strict TDD and [Definition of done](../05-sdd/definition-of-done.md).
