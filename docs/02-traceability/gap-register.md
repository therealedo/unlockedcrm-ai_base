# Prioritized gap register

This register assigns missing work to a phase without changing current implementation status. Phase 1 means a functional, synthetic-data-only, single-workspace CRM that runs on Windows without cloud infrastructure. A provider simulator can satisfy the external boundary only when the owned workflow and state machine are complete.

## Platform foundation

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-PLAT-001` | `P0` | Request identity and session context | `MISSING`, `LOCAL-VERIFIED` | Phase 1 synthetic request context; Phase 2 production auth/MFA | Central request context reaches commands, queries, jobs, files, events, and audit; secure session/MFA/recovery proof follows before real use |
| `GAP-PLAT-002` | `P0` | Authorization and ownership | `MISSING`, `LOCAL-VERIFIED` | Phase 1 policy seams; Phase 2 fixed-role enforcement | One policy boundary and negative workspace/record tests; production-grade fixed roles enforced server-side |
| `GAP-PLAT-003` | `P0` | Durable records | `MISSING`, `LOCAL-VERIFIED` | Phase 1 | Node.js API, Prisma migrations plus reviewed SQL constraints, PostgreSQL transactions, reload and concurrency tests |
| `GAP-PLAT-004` | `P0` | Workspace ownership seam | `MISSING`, `LOCAL-VERIFIED`; hierarchy `LIVE-VERIFIED` | Phase 1 seam; Phase 3 multi-workspace isolation | `workspace_id` enforced in repositories and constraints for business data, jobs, files, events, search, exports, and audit; only one seeded workspace initially |
| `GAP-PLAT-005` | `P1` | Events and bounded async workers | `MISSING`, `LOCAL-VERIFIED` | Phase 1 functional slice; Phase 2 operations | Transactional outbox/inbox, persisted jobs, idempotency, retry and reconciliation; capacity/dead-letter operations later |
| `GAP-PLAT-006` | `P1` | Configuration and secrets | `MISSING`, `LOCAL-VERIFIED` | Phase 1 externalized development config; Phase 2 secret hardening | Checked environment schema and safe local defaults; vaulting, rotation and redaction before production credentials |
| `GAP-PLAT-007` | `P0` | Application API | `MISSING`, `LOCAL-VERIFIED` | Phase 1 | Separate Fastify-based Node.js 24 LTS TypeScript modular monolith exposes stable REST/JSON APIs; browser never reaches PostgreSQL directly |
| `GAP-PLAT-008` | `P2` | Network-required PWA shell | `MISSING`, `LOCAL-VERIFIED` | Optional Phase 1 enhancement | Installability and online routing work without claiming offline data access; sensitive responses are not cached |
| `GAP-PLAT-009` | `P3` | Native/offline clients and sync | `MISSING`, `INFERRED` | Deferred outside current roadmap | Separate approved initiative for device database, mutation sync, conflict UX, leases, native adapters, and distribution |

## CRM

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-CRM-001` | `P1` | Contact and household graph | Detail graph `MISSING`, `LIVE-VERIFIED` | Phase 1 | PostgreSQL-backed create/read/edit/archive, relationships, history, validation, and cross-module reload tests |
| `GAP-CRM-002` | `P1` | Pipeline, tasks, appointments | Create-only `PARTIAL`, `LOCAL-VERIFIED` | Phase 1 | Complete lifecycle, ownership, comments, reschedule/cancel, activity events, and consistent projections |
| `GAP-CRM-003` | `P1` | Policies, renewals, dashboards, analytics | Independent fixtures, `PARTIAL` | Phase 1 | One normalized PostgreSQL graph drives all synthetic views and derived metrics |
| `GAP-CRM-004` | `P1` | Inbox and conversations | `MOCK`; live two-pane model verified | Phase 1 workflow plus simulated provider; Phase 2 real delivery | Persistent threads/messages, compose/reply/failure/retry states, provider correlations, events, and explicit simulated status |
| `GAP-CRM-005` | `P2` | Calendar and booking | `PARTIAL`; no adapter | Phase 1 workflow plus simulated provider; Phase 2 real calendar | Persistent availability/appointment lifecycle, conflicts, timezones, setup/disconnect/failure/retry, and deterministic contract tests |
| `GAP-CRM-006` | `P2` | Global search and notifications | Routes/contacts only, `PARTIAL` | Phase 1 | Workspace-scoped indexes/events, result authorization, notification preferences/read state, and cross-module navigation tests |

## Communications

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-COMMS-001` | `P1` | Phone suite nested workflows | Top-level `MOCK`; nested `LIVE-VERIFIED` | Phase 1 complete simulated workflow | All audited views and call/message/voicemail/recording state machines persist; disconnected, failure, retry and audit states work |
| `GAP-COMMS-002` | `P0` | Telephony/SMS provider | `MISSING`; vendor research needed | Phase 1 deterministic adapter; Phase 2 selected real provider | Owned port and contract suite simulate inbound/outbound/webhooks, delivery, opt-out, DNC, A2P and retries; production legal/vendor gates later |
| `GAP-COMMS-003` | `P1` | Personal email provider | `MISSING`; live boundary verified | Phase 1 deterministic adapter; Phase 2 selected real provider | Complete connect/sync/thread/send/revoke/error workflow against simulator; production OAuth and mailbox proof later |
| `GAP-COMMS-004` | `P1` | Bulk email provider | `MISSING`; live setup verified | Phase 1 Mailpit/simulator path; Phase 2 selected real provider | Synthetic delivery to local capture plus suppression/bounce/complaint state machine; domain/reputation gates later |
| `GAP-COMMS-005` | `P0` | Recording/transcription provider | `MISSING`; legal/vendor gates | Phase 1 deterministic adapter; Phase 2 selected lawful provider | Synthetic consent, recording/transcription, retention, access and failure workflow; product-specific approval before real calls |

## Quoting and insurance

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-INS-001` | `P1` | Product-specific quote flows | Generic hub `MOCK`; detailed live flows verified | Phase 1 complete workflow plus simulator | Separate intake steppers, normalized results/provenance, comparison, save/share state, empty/failure/retry, and cross-record persistence |
| `GAP-INS-002` | `P1` | Policies and product workspaces | `PARTIAL`; deep live behavior verified | Phase 1 | Conditional forms, lifecycle/history, renewals, documents, tasks, and six coherent product workspaces |
| `GAP-INS-003` | `P1` | Life rating provider | `MISSING`; Compulife `CANDIDATE` | Phase 1 deterministic adapter; Phase 2 selected licensed provider | Versioned synthetic request/result contract and failure suite; licensed integration only after commercial/security gates |
| `GAP-INS-004` | `P1` | Medicare rules/providers | `MISSING`; CMS/NPPES use verified live | Phase 1 versioned public data where lawful plus simulator | Reproducible imports, provenance, search/rule tests, unavailable/stale-data states, and update recovery |
| `GAP-INS-005` | `P0` | Enrollment/e-app/HealthSherpa | `MISSING`; live disconnected state | Phase 1 lifecycle simulator; Phase 2 authorized real provider | Complete application/status/reconciliation/consent/error workflow, owned port contract, explicit blocker and no scraping/bypass |
| `GAP-INS-006` | `P1` | ACA subsidy/QLE/transitions | `MOCK`; live views verified | Phase 1 versioned synthetic rules/simulator; Phase 2 authoritative provider | Rule-version/provenance tests, transition history, stale/unavailable state, and later authorized source reconciliation |

## AI, automation, and marketing

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-AI-001` | `P1` | AI workspace/history/insights | `MOCK`; live workspace verified | Phase 1 complete deterministic workflow | Persistent synthetic conversations, prompt/result provenance, history, insights, failure/retry and explicit simulated-provider status |
| `GAP-AI-002` | `P0` | AI permissions/approvals | `MISSING`; 53-action model verified live | Phase 1 synthetic enforcement; Phase 2 production policy | Deny-default tool policy, approvals, idempotency, audit, negative tool tests, and centralized identity/workspace context |
| `GAP-AI-003` | `P1` | Provider-neutral AI/voice gateway | `MISSING`; candidates undecided | Phase 1 deterministic adapters; Phase 2 selected real providers | Owned text/voice ports, deterministic contract suite, tool/voice lifecycle and synthetic usage events; legal/data-use gates later |
| `GAP-AUTO-001` | `P1` | Workflow builder/runtime | UI `MOCK`; live builder/runs/settings verified | Phase 1 | Versioned graph, validation/publish, enrollment, bounded worker execution, timers, retries, cancellation, logs and recovery |
| `GAP-AUTO-002` | `P1` | Campaigns/queue | `MOCK`; nested views verified live | Phase 1 functional queue plus simulated channels | Audience snapshot, consent/suppression, schedule, delivery states, callbacks, failure/retry, cancellation and attribution |
| `GAP-AUTO-003` | `P1` | Forms/submissions | `MOCK`; builder/settings verified live | Phase 1 | Locally served form endpoint, versioned schema, validation, consent, uploads, mapping, response/export and abuse states |

## Business operations

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-BIZ-001` | `P1` | Commission ingestion/reconciliation | Create-only `PARTIAL`; Commission+ gated | Phase 1 local ledger/import and sync simulator; Phase 2 real sync | Synthetic file/API-shaped import, matching, splits, exceptions, corrections, provenance and immutable PostgreSQL ledger |
| `GAP-BIZ-002` | `P1` | Documents and OCR | `MOCK`; folders/extraction verified live | Phase 1 local object storage and OCR simulator; Phase 2 production storage/OCR | Object versions, scan/quarantine, metadata, synthetic extraction/provenance/review, access/audit and failure/retry |
| `GAP-BIZ-003` | `P1` | Analytics/audit event model | Hard-coded `PARTIAL`; 11 live views | Phase 1 functional events/projections; Phase 2 integrity/operations | Persisted workspace-scoped events drive dashboards; retention, capacity and tamper controls follow |
| `GAP-BIZ-004` | `P2` | Report/export jobs | `MISSING`; live controls not executed | Phase 1 | Authorized async synthetic exports, scoped objects, expiry, cancellation, audit and recovery |

## Administration and future SaaS

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-ADMIN-001` | `P1` | Single-workspace settings | Top-level `MOCK`; live inventory exists | Phase 1 | All audited settings subviews and validation/state changes persist in PostgreSQL for the seeded workspace |
| `GAP-ADMIN-002` | `P0` | Roles, teams, hierarchy | UI `MOCK`; hierarchy semantics verified live | Phase 1 synthetic policy context; Phase 2 fixed-role enforcement | Functional assignments/hierarchy in Phase 1; authenticated negative authorization tests before real use |
| `GAP-ADMIN-003` | `P1` | Agency operations | `MOCK`; nested workspace verified live | Phase 1 | Synthetic directories, wallboard, lead flow, recruiting and operations persist and agree with CRM data |
| `GAP-ADMIN-004` | `P1` | IMO/FMO operations | `MOCK`; hierarchy/report views verified live | Phase 1 | Synthetic hierarchy, production, contracts and reports persist with workspace ownership |
| `GAP-ADMIN-005` | `P0` | SaaS subscriptions/billing/plans | `MISSING`; live mechanics observed | Phase 3 control plane | Idempotent subscriptions/ledger/metering/dispute lifecycle outside product tables |
| `GAP-ADMIN-006` | `P1` | Branding/domain lifecycle | `MISSING`; assisted live workflow | Phase 1 workspace customization; Phase 2 hosted domain hardening; Phase 3 original public branding | Synthetic theme/profile/settings first; secure domains/certificates later; clean-room public identity in new repo |
| `GAP-ADMIN-007` | `P1` | API/webhooks/developer surfaces | Mostly `GATED`; backend absent | Phase 1 owned local contracts/simulators; Phase 2 secure exposure | REST API, keys/webhooks/test console and failure states; production identity/signing/rate/audit controls later |
| `GAP-ADMIN-008` | `P0` | SaaS provisioning/fleet control plane | `MISSING`, `INFERRED` | Phase 3 | Separate clean-room service manages customers, plans and deployments only through versioned product APIs/events; no direct CRM-table access |

## Security and compliance

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-SEC-001` | `P0` | Data classification/minimization | `MISSING`, `LOCAL-VERIFIED` | Phase 2 gate; synthetic rules start Phase 1 | Field inventory, purpose/retention/redaction policy and review |
| `GAP-SEC-002` | `P0` | Encryption/key management | `MISSING` | Phase 2 | TLS, encrypted database/objects/backups/secrets, key rotation and recovery evidence |
| `GAP-SEC-003` | `P0` | Consent/DNC/opt-out/recording | `MISSING`; live compliance surfaces | Phase 1 synthetic enforcement; Phase 2 legal/production approval | Deterministic policy and negative-side-effect tests, then counsel/vendor review for real channels |
| `GAP-SEC-004` | `P0` | Audit/retention/deletion/export | `MISSING`; visible controls are not backend proof | Phase 1 synthetic workflows; Phase 2 production hardening | Workspace-scoped events and functional export/delete flows; tamper evidence, retention and recovery later |
| `GAP-SEC-005` | `P0` | Vendor/BAA/subprocessor program | `MISSING` | Phase 2/3 | Product-specific legal/security/data-use gate and signed agreements as applicable |
| `GAP-SEC-006` | `P0` | Legal/public readiness | `BLOCKED`, `INFERRED` | Phase 3 | New clean-room repository/design plus qualified-counsel approvals |

## Operations and update system

| Gap ID | Priority | Capability | Current status/evidence | Target ownership | Exit proof |
|---|---|---|---|---|---|
| `GAP-OPS-001` | `P0` | Reproducible Windows development | `MISSING`, `LOCAL-VERIFIED`; no Docker/Compose artifacts, exact Node/npm pins, API, or combined startup command | Phase 1 | Pinned Node.js 24/npm run host UI/API; Docker Desktop/Compose runs the PostgreSQL-first profile; one root command checks/starts infrastructure and both app processes without a cloud account |
| `GAP-OPS-002` | `P0` | Hosted deployment and one-command operations | `MISSING` | Phase 2 | Railway spike first, then reproducible provision/start/stop/status/log/support workflow if promoted; Vercel remains preview-only |
| `GAP-OPS-003` | `P0` | Backups/restore/export | `MISSING` | Phase 2 | Encrypted automated backups and timed clean-host restore/export drills |
| `GAP-OPS-004` | `P0` | Signed upgrade pipeline | `MISSING` | Phase 2 | Signed artifact/manifest, semantic version, preflight, backup, migration journal, health, atomic activation and rollback proof |
| `GAP-OPS-005` | `P1` | Observability/alerts | `MISSING` | Phase 2 | Redacted logs/metrics/traces, health/SLO alerts and runbooks |
| `GAP-OPS-006` | `P1` | CI/release/SBOM | `MISSING`; point-in-time dependency audits `LOCAL-VERIFIED` by `DEP-AUDIT-2026-09-04` | Phase 2; public license gate Phase 3 | Automated recurring checks, provenance, release channels, dependency inventory and rollback |

## Triage rule

Phase 1 closes core product/data-plane gaps with synthetic data, PostgreSQL persistence, workspace seams, and complete provider-neutral simulations. It never requires cloud infrastructure or real provider credentials. Phase 2 closes every security, operational, and selected real-integration gate before limited sensitive-data use. Phase 3 owns the clean-room public product and separate SaaS control plane. Any omitted audited capability stays explicit here; it is never hidden behind “nearly complete.”
