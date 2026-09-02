# Current infrastructure

> The current infrastructure serves a fictional-data browser prototype. It does not provide a production data or security boundary.

**Evidence:** `LOCAL-VERIFIED`, Engram #647.

## Stack

| Layer | Current state |
|---|---|
| UI/runtime | React 19.2.6 with Vinext 1.0.0-beta.5 |
| Build | Vite 8, TypeScript 5.9 |
| Runtime requirement | Node 22.13 or newer |
| Routing | Root and catch-all entries render one client `CrmApp`; custom pushState routing |
| Persistence | One browser `localStorage` JSON object |
| Styling | One large global CSS file plus mostly unused generated UI components |
| Tests | 15 Playwright tests, Chromium only |
| Hosting config | Vite/Vinext with Cloudflare/Sites plugins |
| Generated deploy metadata | Wrangler output, static headers, build ID |

## Configured bindings

`.openai/hosting.json` declares no D1 database or R2 object storage. Generated Wrangler configuration contains no database, bucket, queue, service, or secret binding. Static headers only add immutable caching for framework static assets.

## Missing production layers

- Backend API and server-side validation
- Authentication, secure sessions, MFA and recovery
- RBAC/ABAC, record ownership and tenant isolation
- PostgreSQL or another durable transactional store
- Secure object storage and document scanning
- Durable job/workflow engine, scheduler, retry/dead-letter queues
- Webhook ingress/outbox and idempotency
- External phone/SMS/email/calendar/quote/enrollment/AI adapters
- Encryption/key and secret management
- Audit/event store, consent/suppression, retention/deletion/export
- Structured observability, alerts, incident response
- Encrypted backup/restore and disaster recovery
- Signed release/update/rollback system
- CI, environment example, migrations, deployment and operational runbooks

## Correct phase ownership

The absence of these services is not permission to postpone functional backing until Phase 2. Phase 1 owns a development-grade PostgreSQL database, S3-compatible local object storage, durable jobs/events, local hosted forms, and end-to-end sandbox/test integrations for phone/SMS, email, calendar/booking, quoting, commissions, AI, documents/OCR, and other feasible dependencies. Synthetic data and owned test destinations remain mandatory.

Deterministic test doubles are still required for automated isolation, but they do not satisfy the Phase 1 exit alone. If a vendor or activation gate prevents sandbox access, Phase 1 must still produce the owned adapter contract, documented blocker, and strongest lawful substitute without scraping or bypassing the gate. Phase 2 hardens the working stack with production security, credentials, operations, and recovery.

## Maintainability constraints

| File | Approximate size | Risk |
|---|---:|---|
| `components/crm-app.tsx` | 3,443 lines | Shell/state/forms plus unused duplicate screens |
| `components/live-parity-pages.tsx` | 3,435 lines | Active non-root screen monolith |
| `app/globals.css` | 5,830 lines | Broad cascade and responsive coupling |

The active renderer and legacy duplicate must be consolidated deliberately after parity behavior is protected by tests.

## Operational status

An existing `dist` was present during the audit, but no build or deployment was performed. There is no documented clean-host install, release provenance, backup, restore, rollback, incident, or recovery procedure.

## Next step

Use the [target architecture](target-architecture.md) for the Phase 1 functional development stack and the [Phase 2 roadmap](../03-roadmap/phase-2-local-production-readiness.md) for production hardening and limited-real-use approval.
