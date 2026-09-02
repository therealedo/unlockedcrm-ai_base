# Phase 1 — synthetic functional local replica

Phase 1 ends when every safely accessible live capability works end to end on a traceable development stack or has an honest vendor/activation blocker with an owned adapter contract and strongest lawful substitute. It remains fictional-data-only.

## Scope

- All 32 local paths and 30 effective screens.
- Global rail, context navigation, search, customization, density, notifications, account/support/AI overlays.
- Core CRM, business records, communications, quoting, Life, Medicare, ACA, AI, automation, campaigns, forms, settings, Agency, IMO/FMO, and More.
- Major nested views listed in the [capability matrix](../02-traceability/capability-matrix.md).
- Loading, empty, populated, setup-required, not-enabled, disabled/Soon, validation, error, permission-denied, and destructive-confirmation states.
- Responsive behavior at desktop, tablet, and small mobile.
- Development-grade PostgreSQL, S3-compatible object storage, durable jobs/workflows, and event projections where needed.
- Functional self-hosted development services or lawful sandbox/test adapters for external boundaries where feasible.
- End-to-end phone/SMS, email, calendar/booking, quoting, commissions, automation, AI, documents/OCR, forms, and other workflows using only synthetic data and explicitly owned test destinations/accounts.
- Deterministic test doubles for fast automated tests; they do not substitute for the Phase 1 runtime/integration proof.
- Adapter contract, documented blocker, and strongest lawful substitute for vendor/activation-gated capabilities; never scrape or bypass access controls.

## Delivery waves

Waves organize dependencies but do not replace capability-level change briefs.

| Wave | Outcome | Highest-value capabilities |
|---|---|---|
| 1. Traceable shell | Navigation, customization, overlays, state catalog, responsive baseline | `CAP-SHELL-*` |
| 2. Shared record graph | Contacts, opportunities, tasks, appointments, policies, commissions, activities | `CAP-CRM-*`, `CAP-BIZ-001..003` |
| 3. Deep workspaces | Contact detail, policy detail/workspaces, task detail, analytics, documents | `CAP-CRM-106`, `CAP-BIZ-102..119` |
| 4. Communications workflows | Phone/email/inbox views plus sandbox/test delivery to owned destinations | `CAP-COMMS-*` |
| 5. Insurance workflows | Product-specific quote steppers and lawful sandbox/public/local data adapters | `CAP-QUOTE-*`, `CAP-INS-*` |
| 6. AI and orchestration workflows | Local/sandbox AI, durable workflow execution, campaigns and hosted local forms | `CAP-AI-*`, `CAP-AUTO-*` |
| 7. Administration workflows | Working synthetic settings, hierarchy, support, developer/API/webhook, and adapter boundaries | `CAP-ADMIN-*` |
| 8. Parity hardening | Cross-view consistency, a11y, responsive, visual baselines, error states | All |

## Functional synthetic architecture

Phase 1 should already use production-shaped boundaries:

- domain services separate from screen fixtures;
- repository interfaces backed by development-grade PostgreSQL where persistence is required;
- S3-compatible local object storage and a durable local job/event runtime;
- provider interfaces backed by self-hosted services or lawful sandbox/test email, phone, calendar, quote, AI, file, and enrollment adapters where feasible;
- deterministic test doubles retained for unit/contract tests only;
- a persisted synthetic event stream driving activity, analytics, notifications, workflow, and audit projections;
- a clock/ID generator injectable for deterministic tests;
- test-only credentials and explicit destination allowlists; no production credentials, customer destinations, or PHI.

## Cross-record acceptance example

A synthetic policy renewal should appear consistently in:

1. contact detail;
2. policy list/detail;
3. renewal dashboard;
4. home/dashboard activity;
5. task/follow-up workflow;
6. analytics and audit projections.

Independent hard-coded cards do not satisfy this requirement.

## Test gate

- RED behavior test first for each slice.
- Route and nested-view landmarks.
- Keyboard and dialog focus behavior.
- Validation, empty/populated/error/setup/gated states.
- Reload persistence for every local record type and preference.
- Responsive checks at 1707, 1440, 1280, 1024, 768, and below 768.
- Accessibility checks for names, roles, focus, contrast, and reduced motion.
- Automated tests cannot escape deterministic test doubles; dedicated integration tests exercise only approved local services, sandboxes, and owned test destinations.

## Exit checklist

- [ ] Every matrix row targeted to Phase 1 is `FUNCTIONAL` through its local/sandbox development boundary or explicitly `BLOCKED` with an adapter contract, `GATED` evidence, and strongest lawful substitute.
- [ ] All direct live evidence is represented without copied long prose/assets.
- [ ] All state families and nested navigation are test-covered.
- [ ] Shared synthetic records remain consistent across modules.
- [ ] No customer identity, production credential/destination, PII/PHI, or uncontrolled external side effect exists; all test side effects are allowlisted and owned.
- [ ] Documentation and source register are current.
