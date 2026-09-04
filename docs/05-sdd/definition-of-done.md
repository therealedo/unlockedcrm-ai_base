# Definition of done

A change is complete only when behavior, evidence, safety, operations, and documentation agree.

## Universal checks

- [ ] Capability/gap IDs and phase match the approved scope.
- [ ] Changed files stay inside authorized roots.
- [ ] Strict RED → GREEN → REFACTOR evidence exists for behavior changes.
- [ ] Tests, type checks, format/lint checks, and targeted runtime proof pass.
- [ ] Loading, empty, populated, validation, error, permission, setup/gated, and responsive states are covered as applicable.
- [ ] Accessibility names, focus, keyboard operation, contrast, and reduced-motion behavior are checked.
- [ ] No real PII/PHI, credentials, live screenshot, account identity, or unsafe side effect was introduced.
- [ ] Capability matrix, gap register, architecture/audit docs, and source register are updated.
- [ ] Internal Markdown links resolve.

## Phase 1 checks

- [ ] The feature runs through the REST/JSON application boundary and persists owned records/transitions in PostgreSQL.
- [ ] Business data, jobs, files, events, search, exports, and audit carry `workspace_id` where applicable.
- [ ] Centralized synthetic actor/workspace context reaches commands, queries, repositories, workers, and audit.
- [ ] Cross-module synthetic records remain consistent after reload and concurrent/error scenarios.
- [ ] Provider-dependent workflows expose a complete setup/disconnect/success/failure/retry/reconcile state machine.
- [ ] Simulator and future real adapter share the owned port and deterministic contract tests; provider attempts/outcomes/audit persist.
- [ ] The product visibly distinguishes simulated, disconnected, unavailable, and real-provider status.
- [ ] No hard-coded card or optimistic state is counted as functional behavior.
- [ ] The clean Windows path pins exact Node.js 24 LTS/npm versions, runs UI/API on the host, uses Docker Desktop + Docker Compose for a PostgreSQL-first infrastructure profile, and exposes one root install/migrate/seed/start/health/test command surface without a cloud account; every additional service is justified by the slice.
- [ ] All data is fictional and provider simulators cannot reach real customer destinations.
- [ ] Responsive phone/tablet/desktop proof exists; any PWA remains network-required and does not cache sensitive CRM data for offline use.
- [ ] Gated live behavior is not invented, scraped, or bypassed.
- [ ] Every omitted audited capability remains in the gap register.

## Phase 2 checks

- [ ] Secure production auth/MFA, recovery, session controls, fixed roles, and negative scope tests pass.
- [ ] Encryption/keys/secrets, backup/restore, observability, capacity, migration, health, signed update, and rollback evidence exists.
- [ ] Selected real adapters pass the shared contract and authorized end-to-end tests.
- [ ] Webhooks/jobs are authenticated, idempotent, retryable, reconcilable, and observable.
- [ ] Vendor security/legal/license/BAA/data-use/retention/exit gates are approved.
- [ ] Limited-real-use scope, runbooks, incident handling, and kill switches are approved and exercised.

## Phase 3 checks

- [ ] Work occurs in the new clean-room repository.
- [ ] Original branding, UX composition, copy, assets, and provenance are verified.
- [ ] The SaaS control plane uses versioned product APIs/events and has no direct CRM-table access.
- [ ] Tenant isolation, subscriptions/billing, plan enforcement, fleet operations, license/SBOM, privacy/legal, and qualified-counsel gates pass.

## Closure evidence

Record exact commands/results, synthetic screenshots only when authorized, database migrations, provider-boundary status, remaining warnings, and follow-up gap IDs. “Looks right” is not proof.
