# Deployment, backup, restore, and signed updates

Phase 2 must be operable by one person without making user data disposable or coupling it to an application directory.

## Data/application separation

| Plane | Contents | Lifecycle |
|---|---|---|
| Application | Versioned images/binaries/static assets/config schema | Immutable and replaceable |
| Database | User/tenant/domain/audit/job/release metadata | Migrated, backed up, retained |
| Object store | Documents, recordings, exports and derived objects | Versioned, scoped, backed up |
| Secrets | Encryption keys, provider credentials, signing trust roots | Vaulted, rotated, separately recovered |
| Backups | Encrypted database/objects/config metadata | Off-site/immutable per policy |

Never store user data inside a release directory or container layer.

## One-command operator experience

The delivery should expose documented commands for:

- install/preflight;
- start/stop/status;
- health/readiness;
- backup/list/verify/restore;
- upgrade/channel selection;
- rollback/recovery/export;
- logs/support bundle with automatic secret/PII redaction.

The underlying steps remain visible and journaled; “one command” must not mean opaque or irreversible.

## Backup and restore

Required policy:

- encrypted database and object backups;
- separate key recovery procedure;
- checksums and completeness manifest;
- configurable RPO/RTO and retention;
- local plus off-host/immutable copy;
- scheduled verification and clean-host restore drills;
- reconciliation of database references to object versions;
- restoration of indexes, job state, configuration metadata and audit history;
- export format usable without the application.

## Signed update protocol

1. **Discover:** read release-channel metadata over authenticated transport.
2. **Verify:** validate signed manifest, artifact digests, semantic version, compatibility, provenance and revocation state.
3. **Preflight:** check platform/version, disk, database, object store, backups, secrets, permissions and migration prerequisites.
4. **Protect:** create and verify an encrypted pre-upgrade backup/recovery point.
5. **Journal:** create an immutable migration/release attempt with version, checksums, timestamps and step status.
6. **Migrate data first:** run resumable, idempotent forward migrations under lock; never activate incompatible code first.
7. **Stage:** load immutable application artifacts beside the active version.
8. **Activate atomically:** switch routing/symlink/deployment pointer without partial copies.
9. **Verify health:** readiness, database/object checks, critical synthetic transaction and worker/webhook health.
10. **Rollback:** automatically reactivate prior application artifacts on health failure; follow documented data forward-repair or compatible rollback rules.
11. **Finalize:** record outcome, release channel and recovery point; expire artifacts/backups only under policy.

## Migration rules

- Expand/contract schema changes across compatible versions when possible.
- Every migration has checksum, preconditions, transaction/lock behavior, expected duration and recovery path.
- Destructive changes require explicit backup verification and delayed cleanup.
- Failed migrations remain journaled and resumable; never silently retry indefinitely.
- Application rollback cannot promise database rollback when irreversible data changes occurred; prefer forward repair.

## Release channels

- `stable`: owner-approved, full verification.
- `candidate`: limited canary testing; never automatic for real-data hosts without opt-in.
- `development`: synthetic/local environments only.

Channel choice is explicit and persisted. Signing keys, trust-root rotation and emergency revocation require documented custody.

## Observability

Track release/migration/backup/restore duration and outcome, but redact secrets and sensitive payloads. Alert on failed backups, stale restore drills, migration lock/timeouts, health rollback, job backlog, object/database mismatch and signature failure.

## Acceptance drills

- Clean-host install and first boot.
- Full backup followed by isolated restore and record/object reconciliation.
- Interrupted migration resume.
- Invalid signature and revoked release rejection.
- Insufficient disk/preflight rejection.
- Health-check failure with atomic artifact rollback.
- Operator export/recovery when the current application will not start.
