# Integration evaluation template

## Decision header

| Field | Value |
|---|---|
| Integration ID | |
| Capability IDs | |
| Candidate/provider | |
| Decision state | `CANDIDATE` / `RESEARCH-NEEDED` / `SELECTED` / `REJECTED` |
| Proof environment | Simulator / local service / authorized test / production |
| Owner/date | |

A selected target is not current implementation evidence.

## Owned workflow and data flow

- User outcome:
- Domain commands/results:
- Setup/disconnect/success/failure/retry/cancel/reconcile states:
- Data fields/classification:
- Persistent attempts/correlation/audit/events:
- Storage/retention/deletion:
- Workspace/actor context:
- Regions/subprocessors:
- Training/data use:

## Port and adapter fit

- Owned interface and normalized types:
- Deterministic simulator:
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

- Shared deterministic contract tests:
- Phase 1 complete simulator/state-machine proof:
- Phase 1 Windows/cloud-independent proof:
- Explicit simulated/disconnected UI status:
- Vendor/activation blocker and lawful substitute:
- Authorized real-adapter proof, when scheduled:
- Failure/retry/replay/reconciliation tests:
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
