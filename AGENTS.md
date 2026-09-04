# Repository operating guide

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI, hosted production use, or SaaS.**

This repository studies observable CRM behavior and builds an original, synthetic-data implementation. Current behavior, planned architecture, and deferred work must remain visibly distinct.

## Mission

Deliver work in three gated phases:

1. **Phase 1 — online-first single-workspace product/data plane:** keep the Vinext/Vite React parity UI, make every audited owned/core CRM workflow functional against a separate Fastify-based Node.js 24 LTS TypeScript modular-monolith API and local PostgreSQL, and preserve provider-neutral simulated boundaries for external services. It must run and be testable on the user's Windows PC without cloud infrastructure.
2. **Phase 2 — secure hosted single-workspace readiness:** add production identity, fixed-role enforcement, encryption, backup/restore, observability, deployment/upgrades, operational hardening, and selected real integrations before any approved limited real-data use.
3. **Phase 3 — clean-room public/SaaS readiness:** build a new clean-room product plus a separate SaaS control plane for provisioning, subscriptions, plan enforcement, fleet management, and public operations.

Installed native apps, device SQLite, offline mutations/synchronization/conflict handling, offline leases, Tauri/native adapters, and app-store distribution are deferred. Read [Mission and phases](docs/00-governance/mission-and-phases.md) before changing scope.

## Hard safety boundaries

- Phase 1 uses synthetic records only. It never authorizes real PII/PHI, production credentials, customer outreach, or production destinations.
- External-service workflows may use deterministic provider-neutral adapters/simulators. If a separately approved integration test produces a side effect, it may target only an explicitly owned test endpoint or account.
- Never place real names, phone numbers, email addresses, policy identifiers, credentials, tokens, PHI, or other account-specific values in code, fixtures, screenshots, logs, tests, or documentation.
- Treat the authenticated live account as read-only research. Do not send, call, quote, submit, publish, upload, export, connect, activate, delete, change settings, or affect account/trial state.
- Do not claim HIPAA compliance, production readiness, SaaS readiness, legal clearance, or “IP-proof” status.
- Do not copy proprietary source, screenshots, long vendor copy, branding, icons, assets, or exact visual composition into a public product.
- Preserve unavailable or gated evidence as unavailable. Never invent hidden behavior.

See [Working agreements](docs/00-governance/working-agreements.md) and [Legal and IP boundaries](docs/00-governance/legal-and-ip-boundaries.md).

## Current and target runtime

| Boundary | Current implementation | Approved target |
|---|---|---|
| Web UI | React on Vinext 1.0 beta/Vite 8; Next-compatible source conventions | Retain for Phase 1; do not migrate to official Next.js without a demonstrated blocker |
| Application API | Absent | Fastify on Node.js 24 LTS and TypeScript; modular monolith; REST/JSON |
| Persistence | One browser `localStorage` object | Local PostgreSQL, accessed only through workspace-scoped repositories |
| Local development infrastructure | No Dockerfile, Compose configuration, or local PostgreSQL service | Docker Desktop + Docker Compose on Windows; PostgreSQL first; add other services only for a functional slice |
| Local process topology | Vinext/Vite UI runs on the Windows host; API is absent | Vinext/Vite UI and Node.js/Fastify API run on the Windows host; Compose manages infrastructure |
| Toolchain versions | `engines.node` allows `>=22.13.0`; npm lockfile exists; no exact Node/npm pin | Pin an exact Node.js 24 LTS patch and npm version in repository metadata |
| Data access | None | Prisma plus reviewed, isolated custom SQL escape hatches |
| Async work | Absent | Bounded workers behind durable job/outbox contracts |
| Deployment | Local Vite/Vinext and Wrangler tooling; no database bindings or combined startup command | One planned root startup command checks/starts Compose infrastructure plus both host app processes; Railway is the unvalidated preferred Phase 2 candidate; Vercel is optional for frontend previews only |
| Auxiliary Python | Absent | Not part of the core API; permitted later only in an isolated worker for a proven specialized library, never as a second API/data authority |
| PWA/offline | No manifest, service worker, or offline sync | Network-required responsive PWA shell may be added; offline data mutation/sync remains deferred |

Vinext/Next.js are frontend application frameworks, and Fastify is the selected backend HTTP framework. Vite is build tooling. Railway, Vercel, OpenAI Sites, Cloudflare, and Wrangler are hosting/runtime choices. A framework is not hosting, and none of these hosting services is required for Phase 1 local development.

Docker Desktop and Docker Compose are selected Phase 1 local-development dependencies, not current implementation evidence. Compose starts with PostgreSQL; object storage, mail capture, queues, and other services join only when a functional slice needs them. By default, the Vinext/Vite UI and Node.js/Fastify API run directly on the Windows host with pinned Node/npm versions. Full application containerization is deferred unless measured environment-parity problems justify it.

## Architecture seams required in Phase 1

- Operate one seeded workspace, but place explicit `workspace_id` ownership on business records, jobs, files, events, and audit records.
- Build one centralized request identity/authorization context, even while Phase 1 uses synthetic identity.
- Require workspace-scoped repositories, database constraints, stable domain/application APIs, externalized configuration/secrets, and provider ports.
- Keep the future control plane outside the CRM product database. It may provision through stable administrative APIs/events; it must not manipulate product tables directly.
- Do not put database or domain logic in browser components or vendor SDKs.
- Keep Python/FastAPI out of the core stack. A future Python process requires a proven specialized-library need, an isolated worker contract, and no independent API or data authority.

## Evidence and status language

Implementation statuses are `FUNCTIONAL`, `PARTIAL`, `MOCK`, `MISSING`, and `BLOCKED`. Evidence statuses are `LIVE-VERIFIED`, `LOCAL-VERIFIED`, `PRIOR-VERIFIED`, `GATED`, and `INFERRED`. Priorities are `P0` through `P3`.

A complete owned workflow may be functional while its external provider boundary remains `MOCK`. Split capability IDs or record both boundaries; never label a hard-coded card or simulated transport as a real integration. Follow [Evidence and status model](docs/00-governance/evidence-and-status-model.md).

## Current sources of truth

| Question | Source |
|---|---|
| Where do I start? | [Documentation hub](docs/README.md) |
| What was observed? | [Audit index](docs/01-audits/README.md) |
| Which paths and screens exist? | [Route map](docs/02-traceability/route-map.md) |
| What works now? | [Capability matrix](docs/02-traceability/capability-matrix.md) |
| What is missing and why? | [Gap register](docs/02-traceability/gap-register.md) |
| What phase owns the work? | [Roadmap](docs/03-roadmap/overview.md) |
| What architecture is intended? | [Target architecture](docs/04-infrastructure/target-architecture.md) |
| How do we prepare an SDD change? | [SDD workspace](docs/05-sdd/README.md) |
| Which evidence supports a claim? | [Source register](docs/06-reference/source-register.md) |

The active non-root UI is rendered by `components/live-parity-pages.tsx`. A legacy duplicate screen set remains in `components/crm-app.tsx`; verify renderer ownership before editing.

## Phase gates

- **Phase 1:** every audited owned/core CRM workflow is functional and PostgreSQL-backed across one seeded workspace; cross-module projections agree; all routes and state families remain traceable and responsive. External-provider workflows may end at deterministic provider-neutral simulators only when the UI workflow, state machine, failure/retry/setup states, owned port, contract tests, synthetic audit/events, and explicit provider-boundary status are complete. Local Windows proof must use Docker Desktop + Docker Compose for PostgreSQL-backed infrastructure and one root startup command that checks/starts Compose plus both host app processes; exact Node/npm versions must be pinned. Cloud infrastructure is not required, and full application containerization needs measured parity evidence.
- **Phase 2:** the single-workspace product is securely hosted with production auth/MFA/fixed roles, encryption/key management, backups/restores, monitoring, incident operations, migrations, signed upgrades/rollback, and separately approved real integrations. Only independent security/privacy/compliance review plus explicit owner approval permits limited real data.
- **Phase 3:** a new clean-room repository contains an original public product and separate SaaS control plane. Tenant isolation, provisioning, billing, plan enforcement, fleet operations, support/abuse processes, legal review, licenses/SBOM, and independent product design are complete.

Passing one gate never implies the next gate.

## Documentation maintenance

- Update capability and gap records with every behavior, boundary, or evidence change.
- Add a source-register entry for new audit, repository, official-reference, or owner-decision evidence.
- Keep direct observation, prior evidence, gated state, local verification, planning, and inference distinct.
- Keep hub pages short; prefer tables and checklists.
- Use English for artifacts unless an explicit decision changes the artifact language.

## Browser and live-account safety

1. Open a temporary agent-created tab.
2. Prefer a settled SPA route; fresh deep links may remain on `Loading`.
3. Inspect visible state only; do not mutate or dismiss anything.
4. Redact account identity, balances, referral codes, dates, and contact details.
5. Label delayed, blank, setup-gated, and activation-gated states `GATED`.
6. Close only tabs you created.

## Git conventions

- Use Conventional Commits.
- Never add `Co-Authored-By` or AI attribution.
- Never force-push.
- Keep commits reviewable and keep tests/documentation with the behavior they prove.
- Do not commit credentials, generated secrets, account exports, or live screenshots.

## Engram memory protocol

Use project `unlockedcrm-ai_base`. Search memory before work that may repeat an audit or decision. Save durable discoveries and decisions immediately, then finish with a session summary. Repository and current runtime evidence remain stronger than memory.

Stable topic keys include `audit/local/current-baseline`, `audit/live/core-business`, `audit/live/communications-insurance-tools`, `audit/live/admin-settings-organizations`, `architecture/documentation-system`, `architecture/integration-strategy`, `roadmap/phase-strategy`, and `sdd/{change-name}/{artifact}`.

## Future SDD and TDD workflow

No active SDD change or OpenSpec artifact is created by this documentation system.

1. Create a [change brief](docs/07-templates/sdd-change-brief-template.md).
2. Confirm capability IDs, phase, workflow boundary, provider boundary, evidence, safety, and measurable acceptance criteria.
3. Initialize or continue SDD only when explicitly selected.
4. Follow strict RED → GREEN → REFACTOR.
5. For Phase 1 core work, prove REST/API/database behavior and cross-module persistence. For provider work, prove the owned contract and explicit simulator or real-adapter boundary without overstating it.
6. Update traceability and run [Definition of done](docs/05-sdd/definition-of-done.md).

## Completion checks

- [ ] Changed files stay inside the authorized scope.
- [ ] Current, target, and deferred states are explicit.
- [ ] Capability and provider-boundary statuses are honest.
- [ ] Internal Markdown links resolve.
- [ ] No secrets, account identity, real PII/PHI, or live screenshots were added.
- [ ] No claim says the current build is compliant, production-ready, or SaaS-ready.
- [ ] Vendor decisions include evidence and do not imply implementation.
- [ ] Tests and local proof match each claimed status.
- [ ] Capability matrix, gap register, source register, and roadmap are current.
