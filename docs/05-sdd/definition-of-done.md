# Definition of done

A change is complete only when behavior, evidence, safety, operations, and documentation agree.

## Universal checks

- [ ] Capability/gap IDs and target phase match the approved scope.
- [ ] Changed files stay inside authorized roots.
- [ ] Strict RED → GREEN → REFACTOR evidence exists for behavior changes.
- [ ] Tests, type checks, lint/format checks, and targeted runtime proof pass.
- [ ] Loading, empty, populated, validation, error, permission, setup/gated, and responsive states are covered as applicable.
- [ ] Accessibility names, focus, keyboard operation, contrast and reduced-motion behavior are checked.
- [ ] No real PII/PHI, credential, live screenshot, account identity, or unsafe side effect was introduced.
- [ ] Capability matrix, gap register, relevant audit/architecture docs, and source register are updated.
- [ ] Internal documentation links resolve.

## Phase 1 checks

- [ ] Deterministic test doubles cannot escape automated tests, and every feasible dependency also passes end-to-end through an approved local service or sandbox/test adapter.
- [ ] Test side effects use synthetic data and explicit allowlists for owned numbers, inboxes, calendars, accounts, buckets, and endpoints.
- [ ] Vendor-gated capabilities include an owned adapter contract, documented blocker, and strongest lawful substitute; no scraping or bypass occurred.
- [ ] Development-grade PostgreSQL/object storage/jobs/events are used where required by the completed workflow.
- [ ] Synthetic records remain consistent across related modules.
- [ ] Gated live behavior is not invented.
- [ ] Responsive proof includes small mobile below 768 px when relevant.

## Phase 2 checks

- [ ] Server authorization and negative scope tests pass.
- [ ] Migration, backup, restore, health, rollback and recovery evidence exists.
- [ ] Secrets, logs, metrics and support bundles are redacted.
- [ ] Webhooks/jobs are signed or authenticated, idempotent, retryable, reconcilable and observable.
- [ ] Vendor security/legal/license/BAA/data-use/retention/exit gates are approved.
- [ ] Runbook and kill switch are exercised.

## Phase 3 checks

- [ ] Work occurs in the new clean-room repository.
- [ ] Original branding/UX/copy/assets and provenance are verified.
- [ ] License/SBOM, tenancy, billing, privacy/legal and qualified-counsel gates pass.

## Closure evidence

Record exact commands, results, screenshots only if synthetic and authorized, migration/release IDs, remaining warnings, and follow-up gap IDs. “Looks right” is not proof.
