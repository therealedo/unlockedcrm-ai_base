# Phase 2 — secure hosted single-workspace production readiness

The filename is retained for link stability. Phase 2 securely hosts one workspace and enables selected real integrations before any approved limited real-data use.

## Entry condition

Phase 1 already provides a functional core CRM through a local Node API/PostgreSQL product/data plane and complete provider-neutral simulated workflows. Real vendor connectivity is not a Phase 1 gate.

## Foundation workstreams

| Workstream | Required outcome |
|---|---|
| Identity and access | Production authentication, secure sessions, MFA/recovery, fixed roles, ownership and privileged-action controls |
| Durable data | Harden PostgreSQL/Prisma repositories, constraints, migrations, encryption, capacity, retention/deletion/export and recovery |
| Files | Signed access, scanning, versioning, lifecycle, encryption, backup and provenance |
| Jobs/events | Harden workers/outbox/webhook inbox with idempotency, retry/dead-letter, capacity, scheduling and retained audit |
| Real integrations | Select only needed providers; pass credentials, signatures, consent, legal/license/BAA/data-use, rate/cost, revocation and kill-switch gates |
| Hosting | Validate Railway as the preferred candidate for persistent Fastify API, bounded workers, and PostgreSQL; then prove environment validation, TLS, health/readiness and rollback |
| Observability | Redacted logs, metrics, traces, alerts, dashboards and runbooks |
| Operations | Backup/restore, incident response, secret rotation, capacity and disaster recovery |
| Updates | Signed data-first upgrades with migration journal, atomic activation, health checks and rollback |

## Preferred hosting candidate

Railway is `PREFERRED-PHASE-2-CANDIDATE`, not selected production infrastructure and not currently implemented or validated. A bounded deployment spike must prove persistent Fastify API and worker processes, PostgreSQL connectivity/migrations, private service communication, health/readiness, restart behavior, logs, costs, and rollback. Database backup/restore, continuous monitoring, upgrade safety, access control, application security, incident response, and compliance remain project responsibilities regardless of platform features.

Vercel is optional for protected frontend preview deployments only. It is not the product API, worker, or PostgreSQL host. Neither Railway nor Vercel may become a Phase 1 prerequisite.

## Single-workspace boundary

Phase 2 may support an explicitly invited user circle inside one workspace, but it does not include public workspace provisioning, tenant fleet management, subscription billing, plan enforcement, or self-service lifecycle. Phase 1 `workspace_id` seams reduce future cost; they are not proof of multi-tenant isolation.

## Integration release gate

Each real adapter requires:

- business purpose and data-flow map;
- minimum scopes and data fields;
- deterministic port contract evidence from Phase 1;
- security, legal, license, consent, BAA/conduit, retention, data-use, subprocessor, pricing, rate-limit, exit and deletion review;
- signed webhook or polling integrity;
- idempotency, retries, dead letters, reconciliation, revocation and cost limits;
- operational monitoring, runbook and kill switch;
- owned test-environment proof before production credentials.

## Signed data-first update contract

User data remains separate from application artifacts. Every release provides semantic version/channel, signed manifest/artifacts, compatibility preflight, encrypted recovery point, migration journal, forward data migration, atomic activation, health/readiness checks, application rollback, documented data repair policy, and export/recovery independent of the current application.

## Limited-use approval

Only an explicit owner decision after independent security and privacy/compliance review may enable limited real data. Approval names users, workspace, data classes, providers, retention, backups, incident owner, and rollback plan.

## Exit checklist

- [ ] Production auth/MFA/fixed-role and negative ownership tests pass.
- [ ] Encrypted storage, secrets, backup/restore and migration/rollback drills pass.
- [ ] Every enabled real adapter passes its product-specific gate.
- [ ] The Railway spike is documented and passed before any hosting selection is promoted; hosted deployment, monitoring, incident and recovery runbooks are exercised.
- [ ] The owner and independent reviewers approve the narrow real-use scope.
- [ ] No claim implies SaaS/control-plane readiness.
