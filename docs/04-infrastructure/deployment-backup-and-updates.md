# Deployment, backup, restore, and updates

This document separates Phase 1 local development from Phase 2 hosted operations. The current browser prototype has neither workflow and contains no Dockerfile, Compose configuration, exact Node/npm pin, API, or combined root startup command.

## Phase 1: reproducible Windows development

A clean Windows PC must be able to run and test one synthetic workspace without a cloud account. Docker Desktop + Docker Compose is the selected local-infrastructure dependency, not current implementation evidence.

Required operator path:

1. verify Docker Desktop/Compose prerequisites and the repository-pinned Node.js 24 LTS/npm versions;
2. install locked application dependencies with the pinned package manager;
3. configure checked, non-secret development values;
4. start PostgreSQL as the first Compose service, then migrate it;
5. add object storage, mail capture, queues, or other services only when the selected functional slice requires them;
6. seed exactly one fictional workspace and deterministic provider scenarios;
7. use one root command to check/start Compose infrastructure plus the host-run Vinext/Vite UI and Fastify API, including any slice-required worker;
8. check health/readiness, run the test suite, and reset or reseed synthetic data safely.

The root command's name and implementation remain future work. Full application containerization is deferred unless measured environment-parity problems justify it; Docker Compose owns infrastructure by default, not the UI or API processes.

Cloud hosting, production credentials, real customer destinations, and real PII/PHI are forbidden prerequisites. An optional PWA shell remains network-required; service-worker caches must not imply offline CRM behavior.

Development export/reseed supports testing but is not a production backup or disaster-recovery claim.

## Phase 2: hosted single-workspace operations

Railway is `PREFERRED-PHASE-2-CANDIDATE` for the persistent Fastify API, bounded workers, and PostgreSQL topology. It is not implemented or validated. Before promotion, a deployment spike must prove service builds/starts, `PORT`/health behavior, private connectivity, migrations, worker restart/retry behavior, database access, logs, costs, backup/restore, and rollback. Vercel may be evaluated only for protected frontend previews; it is not the API, worker, or database host.

Railway features do not make the system production-ready. Database backup policy and restore drills, continuous monitoring, application upgrades, access control, application security, incident response, and compliance remain project responsibilities.

Before limited real-data use, one operator must be able to provision, start, stop, inspect, back up, restore, upgrade, roll back, and recover the hosted product/data plane. Production identity, encryption, key/secret handling, observability, selected real-provider configuration, and capacity limits are part of this gate.

### Data and application separation

| Plane | Contents | Lifecycle |
|---|---|---|
| Application | Versioned API/worker/web images or artifacts and config schema | Immutable and replaceable |
| Database | Workspace-owned domain, audit, job, integration, and release metadata | Migrated, encrypted, backed up, retained |
| Object store | Documents, recordings, exports, and derived objects | Versioned, scoped, encrypted, backed up |
| Secrets | Keys, provider credentials, signing trust roots | Vaulted, rotated, recovered separately |
| Backups | Encrypted database/objects/config metadata | Off-host/immutable per approved policy |

Never place user data inside a release directory, image, static asset bundle, or repository checkout.

### One-command operator surface

Expose documented commands for:

- install/provision/preflight;
- start/stop/status and health/readiness;
- migrate/seed only where authorized;
- backup/list/verify/restore;
- upgrade and release-channel selection;
- rollback/recovery/export;
- logs and redacted support bundle.

The command may orchestrate steps, but every action must remain visible, bounded, and journaled.

### Backup and restore gate

- Encrypt database and object backups with a separately tested key-recovery procedure.
- Produce checksums, a completeness manifest, and database-to-object reconciliation.
- Define RPO, RTO, retention, local/off-host copies, and immutability.
- Restore indexes, job state, integration cursors, configuration metadata, and audit history.
- Run scheduled verification and timed clean-host restore drills.
- Provide an export usable when the application cannot start.

### Signed update protocol

1. **Discover:** fetch authenticated release-channel metadata.
2. **Verify:** validate the signed manifest, artifact digests, semantic version, compatibility, provenance, and revocation.
3. **Preflight:** check host version, disk, database, objects, backups, secrets, permissions, and migration prerequisites.
4. **Protect:** create and verify an encrypted recovery point.
5. **Journal:** persist the release/migration attempt, checksums, timestamps, and step state.
6. **Migrate:** run resumable, idempotent, locked data-first migrations.
7. **Stage:** place immutable application artifacts beside the active version.
8. **Activate:** switch traffic/pointers atomically.
9. **Check:** verify readiness, database/objects, a critical synthetic transaction, workers, and webhooks.
10. **Rollback:** reactivate prior artifacts on failed health; use documented compatible rollback or forward repair for data.
11. **Finalize:** persist the result and retention/recovery metadata.

### Migration rules

- Prefer expand/contract changes across compatible application versions.
- Record checksum, prerequisites, locking/transaction behavior, duration estimate, and recovery path.
- Require verified backup and delayed cleanup before destructive changes.
- Journal failures and make retries explicit; never loop silently.
- Do not promise database rollback after irreversible data changes; prefer forward repair.

### Release channels

| Channel | Use |
|---|---|
| `stable` | Owner-approved hosted releases with full verification |
| `candidate` | Explicit canary use; never automatic for real-data hosts |
| `development` | Synthetic local environments only |

Signing keys, trust-root rotation, emergency revocation, and channel choice require documented custody.

## Phase 3 fleet boundary

The future control plane may orchestrate product deployment through authenticated product/operator APIs and release events. It must not query or mutate CRM product tables. Public fleet operations and customer subscriptions remain Phase 3.

## Acceptance drills

- Phase 1 clean Windows setup with pinned Node.js 24 LTS/npm, host-run UI/API, Docker Desktop + Docker Compose PostgreSQL, and one root command that checks/starts both layers before migrate, seed, health, and tests without cloud.
- Phase 2 Railway spike for Fastify API, worker, PostgreSQL, health, restart, cost, backup/restore, and rollback behavior.
- Phase 2 clean-host provision and first boot.
- Encrypted backup followed by isolated restore and record/object reconciliation.
- Interrupted migration resume.
- Invalid signature and revoked release rejection.
- Insufficient disk/preflight rejection.
- Health failure with atomic artifact rollback.
- Operator export/recovery while the current application is unavailable.
