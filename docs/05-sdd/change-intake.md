# SDD change intake

Use this gate before creating an SDD proposal or starting implementation.

## Intake checklist

### Outcome and scope

- [ ] The problem and user outcome are stated without prescribing copied expression.
- [ ] Stable capability IDs and gap IDs are listed.
- [ ] Target phase and entry prerequisites are met.
- [ ] In-scope and out-of-scope behavior are explicit.
- [ ] The change is small enough to review or has clear work-unit boundaries.

### Evidence

- [ ] Live, local, prior, gated, and inferred evidence are separately labeled.
- [ ] Every live claim links to an audit/source.
- [ ] Gated behavior remains gated or is replaced by an explicit original product decision.
- [ ] No tenant-specific value or marketing claim is treated as a stable requirement.

### Safety and dependencies

- [ ] Data classes are identified; Phase 1 remains synthetic-only.
- [ ] Phase 1 side effects are limited to explicitly owned test numbers, inboxes, calendars, sandboxes, and local services using synthetic data; customer and production destinations remain prohibited.
- [ ] The acceptance plan includes both deterministic test-double coverage and end-to-end local/sandbox proof where feasible.
- [ ] Vendor/activation gates name the adapter contract, blocker, and strongest lawful substitute; no scraping or bypass is proposed.
- [ ] Vendor state is recorded in the decision register.
- [ ] Consent, DNC, recording, legal, licensing, and BAA/data-use gates are identified.
- [ ] Failure, retry, idempotency, reconciliation, exit, and kill-switch behavior are defined where applicable.

### Acceptance and proof

- [ ] User-visible scenarios include loading, empty, populated, validation, error, permission, setup/gated, and responsive states as applicable.
- [ ] Exact RED test command and first failing expectation are known.
- [ ] Cross-record and cross-module projections are identified.
- [ ] Documentation updates are included in tasks.

## Intake result

| Field | Value |
|---|---|
| Decision | `READY` / `NEEDS-DECISION` / `BLOCKED` |
| Capability IDs | |
| Gap IDs | |
| Phase | |
| Evidence sources | |
| Blocking decision | |
| Test command | |
| Authorized edit scope | |

Stop when the result is `NEEDS-DECISION` or `BLOCKED`; do not invent a decision in the proposal.
