# SDD change intake

Use this gate before creating an SDD proposal or starting implementation.

## Outcome and scope

- [ ] The user outcome is stated without prescribing copied expression.
- [ ] Stable capability and gap IDs are listed.
- [ ] Target phase and prerequisites are met.
- [ ] In-scope and out-of-scope behavior are explicit.
- [ ] The work unit is small enough to review.

## Evidence

- [ ] Live, local, prior, gated, inferred, current, planned, and deferred claims are separated.
- [ ] Every live claim links to an audit/source.
- [ ] Gated behavior stays gated or is replaced by an explicit original product decision.
- [ ] No tenant-specific value or marketing claim is treated as a stable requirement.

## Phase 1 architecture

- [ ] The workflow is classified as owned core behavior, external-provider behavior, or both.
- [ ] Core records and transitions use REST/JSON and PostgreSQL; `workspace_id` and centralized actor/workspace context are carried end to end.
- [ ] Repositories, constraints, jobs, files, events, search, exports, and audit are workspace-scoped where applicable.
- [ ] Stable domain/application APIs and provider ports are named.
- [ ] The clean Windows setup/start/migrate/seed/test path remains cloud-independent.
- [ ] The change uses fictional data only and cannot contact real customer destinations.
- [ ] A PWA change remains network-required and does not add or imply offline CRM data, mutations, synchronization, leases, or conflicts.

## Provider boundary

- [ ] Setup, connected/disconnected, success, unavailable, failure, retry, cancellation, and reconciliation states are specified as applicable.
- [ ] Simulator and future real adapter share an owned port and deterministic contract suite.
- [ ] Provider attempts, correlation, outcomes, retries, and synthetic audit/events persist.
- [ ] The UI and traceability status cannot disguise simulation as real delivery.
- [ ] Vendor/activation blockers and the strongest lawful substitute are documented; no scraping or bypass is proposed.
- [ ] Production credentials, legal/licensing, BAA/data-use, consent, DNC, recording, and A2P gates are assigned to Phase 2 where relevant.

## Acceptance proof

- [ ] Loading, empty, populated, validation, error, permission, setup/gated, and responsive states are covered as applicable.
- [ ] Exact RED command and first failing expectation are known.
- [ ] Cross-record/module projections and reload behavior are identified.
- [ ] Documentation updates are included.

## Intake result

| Field | Value |
|---|---|
| Decision | `READY` / `NEEDS-DECISION` / `BLOCKED` |
| Capability IDs | |
| Gap IDs | |
| Phase | |
| Workflow status target | |
| Provider-boundary status target | |
| Evidence sources | |
| Blocking decision | |
| Test command | |
| Authorized edit scope | |

Stop on `NEEDS-DECISION` or `BLOCKED`; do not invent a decision.
