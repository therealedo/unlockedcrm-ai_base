# Integration evaluation template

## Decision header

| Field | Value |
|---|---|
| Integration ID | |
| Capability IDs | |
| Candidate/provider | |
| Decision state | `CANDIDATE` / `RESEARCH-NEEDED` / `SELECTED` / `REJECTED` |
| Environment | Local / sandbox / production |
| Owner/date | |

## Business and data flow

- User outcome:
- Commands/results:
- Data fields/classification:
- Storage/retention/deletion:
- Regions/subprocessors:
- Training/data use:

## Contract and technical fit

- Owned interface:
- Authentication/scopes/rotation:
- Webhook signatures/replay or polling cursor:
- Idempotency/correlation:
- Rate/cost limits:
- Retries/dead letters/reconciliation:
- Availability/failover/kill switch:
- Export/exit/portability:

## Security, legal, and compliance gates

| Gate | Evidence | Result/owner |
|---|---|---|
| Security review | | |
| BAA/conduit/product scope | | |
| Privacy/data use/retention | | |
| Consent/recording/A2P/CMS/email rules | | |
| License/IP/permitted display/storage | | |
| Subprocessors/residency/incident notice | | |
| Pricing/fees/termination | | |

## Proof

- Deterministic test-double contract tests:
- Phase 1 end-to-end local/sandbox tests and owned destinations:
- Vendor/activation blocker and strongest lawful substitute, if applicable:
- Failure/retry/replay tests:
- Revocation/deletion/export tests:
- Observability/runbook:
- Secrets/log redaction:

## Decision

- State:
- Rationale and tradeoffs:
- Rejected alternatives:
- Conditions before production:
- Revisit date/trigger:

Update the [integration catalog](../04-infrastructure/integration-catalog.md) and [vendor register](../04-infrastructure/vendor-decision-register.md) with the result.
