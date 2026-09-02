# Phase 2 — local production readiness

Phase 2 makes the CRM deployable for personal use and a small invited agent circle. It does **not** make the product public-SaaS ready.

## Entry condition

Phase 1 already provides working end-to-end development integrations on synthetic data. Phase 2 hardens those proven boundaries for approved limited real use; it is not the first implementation of phone, email, calendar, quoting, AI, jobs, files, forms, commissions, or automation.

## Foundation workstreams

| Workstream | Required outcome |
|---|---|
| Identity and access | Authentication, secure sessions, MFA option, recovery, server RBAC/ABAC, ownership and hierarchy scope |
| Durable data | Harden the Phase 1 PostgreSQL schema with production encryption, migration safety, capacity, retention/deletion/export and recovery |
| Files | Harden Phase 1 S3-compatible storage with signed access, scanning, versioning, lifecycle, backup and OCR provenance |
| Jobs/events | Harden Phase 1 workflows/events with idempotency, retry/dead-letter, capacity, scheduling, webhook inbox/outbox and retained audit |
| Integrations | Replaceable adapters with credentials, signatures, rate/cost limits, revocation and failure modes |
| Observability | Structured redacted logs, metrics, traces, health, alerts, dashboards, runbooks |
| Operations | One-command installation, environment validation, backup/restore, incident and recovery procedures |
| Updates | Signed data-first upgrades with migrations, health checks, atomic activation and rollback |

## Candidate stack boundary

The [target architecture](../04-infrastructure/target-architecture.md) considers PostgreSQL, S3-compatible storage, durable jobs/workflows, Mailpit for local email, provider adapters, and a signed update controller. These are architecture candidates until selected through recorded decisions.

## Signed data-first update contract

User data must be separate from application artifacts. Every release must provide:

1. semantic version and release channel;
2. signed manifest and signed immutable artifacts;
3. compatibility and disk/database/object-store preflight;
4. encrypted pre-upgrade backup and recovery reference;
5. migration journal with checksums and resumable state;
6. forward data migration before application activation;
7. atomic application activation;
8. health/readiness and critical synthetic transaction checks;
9. automatic rollback of application artifacts when health fails;
10. documented data rollback/forward-repair policy;
11. export/recovery path independent of the application binary.

Never overwrite or bundle user data inside deployable application directories.

## Integration release gate

Each real adapter requires:

- business purpose and data-flow map;
- minimum scopes/data fields;
- Phase 1 sandbox/test proof and production credential gate;
- security, legal, license, BAA/conduit, retention, data-use, subprocessor, pricing, rate-limit, exit, and deletion review;
- signed webhook or polling integrity;
- idempotency, retries, dead letters, reconciliation, revocation, and cost limits;
- deterministic test-double contract tests plus Phase 1 end-to-end local/sandbox integration evidence;
- operational dashboard and runbook.

## Limited-use approval

Only an explicit owner decision after independent security and privacy/compliance review may enable limited real data. Approval must name users, data classes, enabled adapters, retention, backup, incident contact, and rollback plan.

## Exit checklist

- [ ] All `P0` platform, security, and operations gaps for the approved scope are closed.
- [ ] Backup and full restore have been timed on a clean host.
- [ ] Upgrade and rollback drills pass with realistic data volume.
- [ ] Every enabled adapter passes its gate and has a kill switch.
- [ ] Monitoring and incident runbooks have been exercised.
- [ ] Independent review has produced actionable evidence, not a self-attestation.
- [ ] The owner has explicitly approved the narrow real-use scope.
