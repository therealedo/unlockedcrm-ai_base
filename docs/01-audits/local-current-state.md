# Local current state

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI or SaaS.**

**Evidence:** `LOCAL-VERIFIED`. Source: Engram #647, current repository inspection and 32-route runtime smoke audit.

## Executive summary

- 32 registered paths map to 30 effective screens.
- Root uses a separate home screen; active non-root routes use `LiveParityRouter`.
- Seven create-only flows persist one JSON object in browser `localStorage`.
- Most external-service and advanced product surfaces are `MOCK`.
- No application backend, authentication, tenant isolation, server authorization, database, object storage, durable jobs, or real provider integrations exist.
- All 32 routes rendered at 1707×848 without blank/404/crash, document overflow, or console errors after settled waits.
- The current Playwright suite contains 15 Chromium tests; it was not rerun during the documentation audit.

## Runtime architecture

| Concern | Current evidence |
|---|---|
| Entry points | `app/page.tsx:1-6` and `app/[...slug]/page.tsx:1-6` render `CrmApp` |
| Route registry | `components/crm-app.tsx:81-170` |
| Navigation | Custom `history.pushState` handling at `components/crm-app.tsx:240-279` |
| Root renderer | `HomeScreen`, `components/crm-app.tsx:753-759,847-1023` |
| Non-root renderer | `LiveParityRouter`, `components/crm-app.tsx:761-779` and `components/live-parity-pages.tsx:375-465` |
| Legacy duplicate | Unused exported screen set at `components/crm-app.tsx:1069-2815`; verify ownership before editing |
| Styles | `app/globals.css`, including base shell, preference modes, active overrides, and responsive breakpoints |

## Persistence and functional local behavior

Storage key: `unlockedcrm-live-parity-state-v1` (`lib/crm-data.ts:217-218`). The entire `CrmData` object is serialized after hydration.

Create-only persisted records:

1. Contact
2. Task
3. Opportunity
4. Appointment
5. Policy
6. Commission
7. Booking link

No edit or delete handlers exist. Global search indexes route titles and contacts only. Collapse and icon-only preferences persist; density is session-only; navigation-placement controls are inert.

## Synthetic fixtures

Current fixtures include two fictional contacts, one life opportunity, one follow-up task, one active Medicare policy, and two workflow folders. Commissions, appointments, and booking links start empty. Route-local hard-coded values supply ACA, campaigns, forms, organization metrics, notifications, calls, and quotes outside persisted `CrmData`.

## Route status summary

| Status | Routes |
|---|---|
| `PARTIAL` | `/`, `/dashboard`, `/contacts`, `/pipeline`, `/tasks`, `/calendar`, `/policies`, `/commissions`, `/booking-links`, `/analytics`, `/more` |
| `MOCK` | `/inbox`, `/documents`, `/automations`, `/campaigns`, `/forms`, `/unlocked-ai`, `/agent-ai`, `/ai-quoting`, `/underwriting`, `/underwrite-ai`, `/phone-system`, `/email-services`, `/quoting`, `/life`, `/medicare`, `/aca-marketplace`, `/commission-plus`, `/settings`, `/agency`, `/imo-fmo`, `/org/dashboard` |

Aliases: `/underwrite-ai` shares `/underwriting`; `/imo-fmo` shares `/org/dashboard`.

See [Route map](../02-traceability/route-map.md) for all paths and [Capability matrix](../02-traceability/capability-matrix.md) for next proof.

## Shell and responsiveness

- Base desktop grid: `62px 208px 1fr`.
- Context/sidebar reduces near 980 px and hides at 720 px.
- Additional breakpoints near 1280, 1100, 800, and 560 px.
- Tables generally use scroll containers and minimum widths.
- Existing tests cover 1707, 1280, 1024, and 768 widths, not small mobile below 768.

## External-service reality

No application-level fetch, WebSocket, EventSource, API server, database domain layer, job queue, worker, event bus, or tenant service was found. Phone/SMS/email/calendar, carrier quoting/enrollment, AI/voice, campaigns/forms, documents, commissions, webhooks, and integrations are absent or simulated.

## Current infrastructure

- React 19.2.6, Vinext 1.0.0-beta.5, Vite 8, TypeScript 5.9, Node 22.13 or newer.
- Vite/Vinext and Cloudflare/Sites plugins are configured.
- `.openai/hosting.json` declares no D1 or R2 bindings.
- Generated Wrangler configuration has no database, bucket, queue, service, or secret binding.
- Missing: README/runbook, CI, container/deployment recipe, migrations, environment example, backup/restore, rollback, and incident procedures.

## Tests

`tests/crm.spec.ts:8-587` contains 15 Playwright tests. Chromium defaults to 1440×900 on port 3000 with screenshot/trace retention on failure. Coverage includes shell, contact creation/reload, route landmarks, four responsive widths, rail popovers, global search, and icon-only mode.

Gaps: six other create flows, malformed storage, edit/delete, unit/API tests, accessibility, authorization/tenancy, cross-browser, small mobile, performance, and visual-diff baselines.

## Production blockers

Authentication, RBAC/ABAC, tenant isolation, server validation, encryption/key management, audit logs, consent/suppression, retention/deletion/export, backup/DR, secure files/scanning, rate limits, monitoring, vendor/BAA controls, secrets, security headers, and HIPAA-oriented safeguards are absent.

Do not use real data until the [Phase 2 gate](../03-roadmap/phase-2-local-production-readiness.md) is independently approved.

These blockers do not defer functional backing to Phase 2. Phase 1 must add a development-grade PostgreSQL/object/job/event stack and lawful local/sandbox integrations for the product workflows using synthetic data and owned test destinations. Phase 2 hardens that working stack for limited real use.
