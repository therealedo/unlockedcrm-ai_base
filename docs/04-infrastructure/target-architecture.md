# Adapter-first target architecture

The target keeps owned insurance/CRM behavior independent from replaceable vendors. Components listed here are candidates until the [vendor decision register](vendor-decision-register.md) records a selection.

## Architecture principles

1. **Owned domain first:** contacts, policies, consent, workflows, commissions, tasks, eligibility, audit, and permissions are not vendor data models.
2. **Ports and adapters:** every external service implements a narrow owned interface.
3. **Functional synthetic development:** Phase 1 runs real local services and lawful sandbox/test adapters with synthetic data and owned destinations; deterministic test doubles are for automated isolation, not the exit substitute.
4. **Data-first operations:** user data and migrations are separate from replaceable application artifacts.
5. **Deny by default:** authorization and AI/tool permissions are enforced server-side.
6. **Events with provenance:** external callbacks and derived analytics retain source, version, time, actor, and correlation.
7. **Replaceability:** export, reconciliation, and provider exit are design requirements.

## Logical topology

```text
Browser/PWA
   |
Application API / session boundary
   |-- CRM and insurance domain services
   |-- Authorization and tenant/ownership policy
   |-- Provider ports (phone, email, calendar, quote, AI, files)
   |-- Command/outbox and webhook inbox
   |
PostgreSQL ---- durable job/workflow workers ---- audit/analytics projections
   |
S3-compatible object storage (MinIO local; production provider selected later)
   |
Observability, encrypted backups, signed update controller
```

## Core data plane

| Capability | Candidate direction | Decision state |
|---|---|---|
| Transactional records | PostgreSQL with migrations and row/policy enforcement | `CANDIDATE` |
| Local object storage | MinIO using an S3-compatible interface | `CANDIDATE` |
| Production object storage | S3-compatible managed service selected by security/legal/operations gates | `RESEARCH-NEEDED` |
| Durable jobs/workflows | Transactional outbox plus replaceable durable worker/workflow engine | `RESEARCH-NEEDED` |
| Audit/analytics | Append-oriented events plus PostgreSQL projections initially | `CANDIDATE` |
| Local email capture | Mailpit plus owned test inbox adapters | `CANDIDATE` |

These data-plane services have a development-grade Phase 1 slice. Phase 2 hardens encryption, authentication/authorization, secrets, capacity, backup/recovery, observability, migration safety, and operations.

## Domain boundaries

- **Identity/organization:** user, role, membership, agency, organization, hierarchy, seat, scope policy.
- **CRM:** contact, household, tag, custom field/value, DND/consent, activity, relationship.
- **Sales:** pipeline, stage, opportunity, task, appointment, booking link.
- **Insurance:** carrier, product, coverage type, quote request/result, eligibility, application/enrollment, policy, renewal.
- **Communications:** channel identity, conversation, message, call, recording, voicemail, suppression, A2P state.
- **Business:** commission statement/entry/split/payment/reconciliation, document/folder/version/extraction.
- **Orchestration:** workflow definition/version, enrollment, run, action, retry/dead letter, campaign, audience snapshot, form/response.
- **AI:** conversation, profile, tool policy, approval, tool execution, provider usage/provenance.
- **Platform:** audit event, notification, credential reference, webhook receipt, outbox, export job, backup, release/migration journal.

See [Domain model](../06-reference/domain-model.md).

## Adapter contracts

Every adapter must define:

- supported commands and normalized results;
- configuration/connection lifecycle;
- credential scopes and rotation;
- idempotency and correlation keys;
- webhook signature/replay handling or polling cursor semantics;
- rate/cost limits, retries, dead letters, reconciliation;
- data classification, retention, deletion, residency and vendor-use rules;
- health and kill switch;
- deterministic test-double contract suite plus end-to-end local/sandbox integration suite;
- Phase 1 owned test destinations, data seeding/cleanup, and explicit allowlists;
- documented blocker and strongest lawful substitute when vendor sandbox/activation access is unavailable;
- export/exit path.

## Local and production profiles

| Boundary | Phase 1 functional development path | Phase 2 hardening/production candidate |
|---|---|---|
| Email delivery | Mailpit and owned test inbox/domain sandboxes | SES is one candidate; others remain open |
| Phone/SMS | Authorized provider sandbox/test account to owned numbers; local event simulator only when access is blocked | Telnyx is one replaceable candidate subject to product-specific gates |
| Calendar | Owned Google/Microsoft test calendars and/or self-hosted scheduling | Google and Microsoft adapters; self-hosted scheduling candidate |
| Quoting | Authorized commercial sandbox where available; versioned public/local lawful substitute when blocked | Compulife and approved carrier/public-data adapters |
| Provider search | Versioned local CMS/NPPES import | Hardened CMS/NPPES import/update operations |
| AI | Local model or vendor sandbox behind the provider-neutral gateway | Approved BAA-capable production option as required |
| Files/OCR | MinIO/S3-compatible local objects, local scanning and OCR | Hardened S3-compatible storage plus selected scanning/OCR adapters |
| Jobs/events/forms | Durable local workers/events and locally hosted forms | Capacity, retention, recovery, observability and secure public endpoints |

For every row, deterministic test doubles remain part of automated testing but cannot replace the Phase 1 functional path.

## Security boundaries

- Browser is untrusted; all policy is enforced server-side.
- Provider webhooks enter through a verification, deduplication, validation, and quarantine boundary.
- Workers use least-privilege credentials and re-check authorization/tenant context.
- Object access uses short-lived scoped URLs and immutable audit.
- AI tools receive minimum data and require policy/approval before side effects.
- Support/admin access is explicit, time-bound, reviewed, and audited.

## Decision rule

Do not put a vendor SDK directly inside core domain logic. Record every selection/rejection in the [vendor decision register](vendor-decision-register.md) before production use.
