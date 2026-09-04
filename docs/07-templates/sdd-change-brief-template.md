# SDD change brief template

## Outcome

- User/business problem:
- Expected result:
- Target phase:
- Capability IDs:
- Gap IDs:

## Scope

### In scope

-

### Out of scope

-

### Authorized files/roots

-

## Evidence

| Claim | Evidence status | Source | Confidence/next proof |
|---|---|---|---|
| | | | |

## Behavior scenarios

1. Given … when … then …
2. Loading/empty/populated:
3. Validation/error/permission:
4. Setup/disconnected/gated:
5. Failure/retry/reconciliation:
6. Responsive/accessibility:

## Product/data boundary

- Owned core workflow:
- REST/JSON commands and queries:
- PostgreSQL entities/transitions/migrations:
- `workspace_id`, actor context, repositories, constraints, jobs/files/events/audit:
- Cross-module projections:
- Windows local prerequisites and cloud-independent proof:
- Synthetic data and destination guardrails:
- PWA/network requirement; offline behavior explicitly out of scope:

## Provider boundary

- Provider-neutral port and normalized types:
- Phase 1 simulator behavior:
- Provider-boundary status shown to the user:
- Setup/disconnect/success/failure/retry/cancel/reconcile states:
- Persisted attempts, correlation, outcomes, and audit/events:
- Shared deterministic contract tests:
- Vendor/activation blocker and lawful substitute:
- Phase 2 real-provider/legal/security gates:

## Acceptance and TDD

- Exact test command:
- First RED expectation:
- GREEN behavior:
- Refactor boundary:
- Reload/concurrency/error proof:
- Required docs/traceability updates:

## Delivery

- Work-unit boundary:
- Migration/rollback impact:
- Observability/runbook impact:
- Definition-of-done checklist:

## Open decisions

List only decisions that block the proposal. Do not infer gated live behavior.
