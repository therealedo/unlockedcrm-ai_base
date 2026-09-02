# Prioritized gap register

This register groups missing work by system boundary. It does not schedule implementation by itself; use phase gates and a bounded change brief.

## Platform foundation

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-PLAT-001` | `P0` | `CAP-PLAT-001` auth/session | `MISSING`, `LOCAL-VERIFIED` | Phase 2 | Secure sessions, MFA path, recovery, expiry/revocation tests |
| `GAP-PLAT-002` | `P0` | `CAP-PLAT-002` authorization/ownership | `MISSING`, `LOCAL-VERIFIED` | Phase 2 | Server-side RBAC/ABAC and negative scope tests |
| `GAP-PLAT-003` | `P0` | `CAP-PLAT-003` durable records | `MISSING`, `LOCAL-VERIFIED` | Phase 1 development slice; Phase 2 hardening | Local PostgreSQL migrations/constraints/transactions, then encryption/capacity/restore hardening |
| `GAP-PLAT-004` | `P0` | `CAP-PLAT-004` tenant scope | `MISSING`, `LOCAL-VERIFIED`; hierarchy `LIVE-VERIFIED` | Phase 3 | Tenant ID enforced across queries/jobs/files/search/AI/export |
| `GAP-PLAT-005` | `P1` | `CAP-PLAT-005` events/jobs | `MISSING`, `LOCAL-VERIFIED` | Phase 1 functional local runtime; Phase 2 hardening | Persisted jobs/events with idempotency/retry/replay, then capacity/dead-letter operations |
| `GAP-PLAT-006` | `P1` | `CAP-PLAT-006` configuration/secrets | `MISSING`, `LOCAL-VERIFIED` | Phase 1 test-only configuration; Phase 2 hardening | Safe sandbox configuration first, then encrypted vault/rotation/redaction |

## CRM

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-CRM-001` | `P1` | `CAP-CRM-101` contact detail graph | `MISSING`, `LIVE-VERIFIED` | Phase 1 | Synthetic cross-record detail/tabs and interaction tests |
| `GAP-CRM-002` | `P1` | Contacts/tasks/opportunities/appointments | Create-only `PARTIAL`, `LOCAL-VERIFIED` | Phase 1 | Edit/delete/validation/activity history and reload tests |
| `GAP-CRM-003` | `P1` | Dashboard/analytics/renewals | Independent fixtures, `PARTIAL` | Phase 1 | One normalized synthetic graph drives all projections |
| `GAP-CRM-004` | `P1` | Inbox/conversations | `MOCK`, live two-pane model verified | Phase 1 functional sandbox/local integration; Phase 2 hardening | End-to-end threads and delivery to owned test inboxes/numbers; production gates later |
| `GAP-CRM-005` | `P2` | Calendar/booking | `PARTIAL`, no adapter | Phase 1 functional test-calendar integration; Phase 2 hardening | Create/sync/reschedule/cancel against owned test calendars plus failure tests |
| `GAP-CRM-006` | `P2` | Global search | Routes/contacts only, `LOCAL-VERIFIED` | Phase 1 | Indexed synthetic records and scoped result tests |

## Communications

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-COMMS-001` | `P1` | Phone suite nested views | Top-level `MOCK`; nested `LIVE-VERIFIED` | Phase 1 functional sandbox integration | All thirteen views plus calls/messages to owned test numbers and callback state |
| `GAP-COMMS-002` | `P0` | Telephony/SMS adapter | `MISSING`; vendor research needed | Phase 1 sandbox/test adapter; Phase 2 hardening | Test-number send/receive/webhooks, consent/DNC/A2P simulations; production legal/security gates later |
| `GAP-COMMS-003` | `P1` | Personal email | `MISSING`, live boundary verified | Phase 1 owned-test mailbox integration; Phase 2 hardening | Google/Microsoft or lawful test mailbox threads/sync/revocation with synthetic messages |
| `GAP-COMMS-004` | `P1` | Bulk email | `MISSING`, live setup verified | Phase 1 Mailpit/sandbox delivery; Phase 2 hardening | Domain/suppression/bounce/complaint lifecycle against development or sandbox services |
| `GAP-COMMS-005` | `P0` | Recording/transcription | `MISSING`; legal/vendor gates | Phase 1 owned-test/local integration; Phase 2 production/legal hardening | Synthetic consent and test-call recording/transcription; production vendor/data-use approval later |

## Quoting and insurance

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-INS-001` | `P1` | Product-specific quote flows | Generic hub `MOCK`; detailed live flows verified | Phase 1 functional local/sandbox integration | Separate steppers plus normalized results from lawful test/public/local sources |
| `GAP-INS-002` | `P1` | Policy detail/category forms/workspaces | `PARTIAL`; deep live behavior verified | Phase 1 | Detail, conditional fields, six workspaces, cross-record tests |
| `GAP-INS-003` | `P1` | Life rating | `MISSING`; Compulife `CANDIDATE` | Phase 1 sandbox/test adapter or documented blocker; Phase 2 hardening | Licensed sandbox if available; otherwise adapter contract, blocker, lawful substitute, provenance/normalization tests |
| `GAP-INS-004` | `P1` | Medicare data/rules/providers | `MISSING`; CMS/NPPES live use verified | Phase 1 functional public/local data; Phase 2 hardening | Versioned CMS/NPPES import, rule provenance and update/recovery tests |
| `GAP-INS-005` | `P0` | Enrollment/e-app/HealthSherpa | `MISSING`; live disconnected state | Phase 1 sandbox/test contract or documented blocker; Phase 2 production gate | Authorized sandbox/webhook if available; otherwise adapter contract and strongest lawful substitute |
| `GAP-INS-006` | `P1` | ACA subsidy/QLE/transitions | `MOCK`; live views verified | Phase 1 functional local/sandbox data; Phase 2 hardening | Versioned rules and authoritative test adapter/data proof |

## AI, automation, and marketing

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-AI-001` | `P1` | AI workspace/history/insights | `MOCK`; live nested workspace verified | Phase 1 functional local/sandbox AI | End-to-end synthetic conversations/insights via local or test provider plus deterministic test doubles |
| `GAP-AI-002` | `P0` | AI permissions/approvals | `MISSING`; 53-action model live verified | Phase 1 functional development enforcement; Phase 2 hardening | Deny-default policy, approvals, audit and negative tool tests on synthetic data |
| `GAP-AI-003` | `P1` | Provider-neutral AI/voice | `MISSING`; candidates undecided | Phase 1 local/sandbox adapters; Phase 2 production gate | Local/test model and voice workflows, then BAA/data-use/retention/rotation hardening |
| `GAP-AUTO-001` | `P1` | Workflow builder/runtime | UI `MOCK`; live builder/runs/settings verified | Phase 1 functional local runtime; Phase 2 hardening | Versioned graph, publish, enrollment, durable execution, retry/log tests |
| `GAP-AUTO-002` | `P1` | Campaigns/queue | `MOCK`; live nested views verified | Phase 1 functional local/sandbox runtime; Phase 2 hardening | Audience snapshot, suppression, schedule, queue, callbacks to test destinations, attribution |
| `GAP-AUTO-003` | `P1` | Forms/submissions | `MOCK`; live builder/settings verified | Phase 1 functional local hosting; Phase 2 hardening | Hosted local endpoint, versioned schema, mapping, consent, response/export tests |

## Business operations

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-BIZ-001` | `P1` | Commission ingestion/reconciliation | Create-only `PARTIAL`; Commission+ gated | Phase 1 functional local/sandbox import; Phase 2 hardening | Synthetic file/API import, matching, splits, exceptions and immutable local ledger |
| `GAP-BIZ-002` | `P1` | Documents/OCR/E&O | `MOCK`; live folders/extraction verified | Phase 1 functional local storage/OCR; Phase 2 hardening | MinIO/local scanning/OCR, versions, provenance and access/audit; production controls later |
| `GAP-BIZ-003` | `P1` | Analytics/audit event model | Hard-coded `PARTIAL`; 11 live views | Phase 1 functional local events; Phase 2 hardening | Persisted synthetic event projections then retention/capacity/tamper hardening |
| `GAP-BIZ-004` | `P2` | Report/export jobs | `MISSING`; live controls not executed | Phase 1 functional local jobs; Phase 2 hardening | Authorized async synthetic exports, expiry and audit; production scale later |

## Administration and SaaS

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-ADMIN-001` | `P1` | Settings nested pages | Top-level `MOCK`; live settings inventory | Phase 1 | Every verified/gated settings state represented without invention |
| `GAP-ADMIN-002` | `P0` | Roles, teams, hierarchy | UI `MOCK`; live hierarchy semantics | Phase 1 functional synthetic scope; Phase 2 personal hardening; Phase 3 SaaS | Local role/hierarchy behavior first, then server security and tenant tests |
| `GAP-ADMIN-003` | `P1` | Agency operations | `MOCK`; live nested workspace | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Working directories/wallboard/lead flow/recruiting/ops on synthetic data |
| `GAP-ADMIN-004` | `P1` | IMO/FMO operations | `MOCK`; live hierarchy/report views | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Working hierarchy, production, contracts and reports on synthetic data |
| `GAP-ADMIN-005` | `P0` | Billing/wallet/seats | `MISSING`; live mechanics observed | Phase 3 | Idempotent ledger, subscriptions, metering, disputes and lifecycle tests |
| `GAP-ADMIN-006` | `P1` | White-label/domain lifecycle | `MISSING`; assisted live workflow | Phase 1 functional local customization/test DNS; Phase 2 hardening; Phase 3 original public branding | Local branding and test-domain lifecycle, then certificates/sender verification and clean-room design |
| `GAP-ADMIN-007` | `P1` | API/OAuth/webhooks/MCP | Mostly `GATED`; local backend absent | Phase 1 functional local contracts/simulators; Phase 2/3 hardening | Local API/key/webhook/MCP flows; gated OAuth gets contract, blocker and lawful substitute |

## Security and compliance

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-SEC-001` | `P0` | Data classification/minimization | `MISSING`, `LOCAL-VERIFIED` | Phase 2 | Inventory, classification, purpose/retention and redaction controls |
| `GAP-SEC-002` | `P0` | Encryption/key management | `MISSING` | Phase 2 | In-transit/at-rest controls, key rotation, backup encryption evidence |
| `GAP-SEC-003` | `P0` | Consent/DNC/opt-out/recording | `MISSING`; live compliance surfaces | Phase 1 functional synthetic enforcement; Phase 2 legal/security hardening | Test-destination policy engine and negative side-effect tests, then production approval |
| `GAP-SEC-004` | `P0` | Audit/retention/deletion/export | `MISSING`; live controls not backend proof | Phase 1 functional local events; Phase 2 hardening | Local event/export/delete workflows, then tamper/retention/recovery hardening |
| `GAP-SEC-005` | `P0` | Vendor/BAA/subprocessor program | `MISSING` | Phase 2/3 | Per-product legal/security/data-use gate and signed agreements as needed |
| `GAP-SEC-006` | `P0` | Legal/public readiness | `BLOCKED`, `INFERRED` | Phase 3 | New repo/design plus qualified counsel approvals |

## Operations and update system

| Gap ID | Priority | Capabilities | Current status/evidence | Target | Exit proof |
|---|---|---|---|---|---|
| `GAP-OPS-001` | `P0` | Backups/restore/export | `MISSING` | Phase 2 | Encrypted automated backups and timed restore drills |
| `GAP-OPS-002` | `P0` | Signed upgrade pipeline | `MISSING` | Phase 2 | Signed manifest/artifact, version/preflight/migration/health/rollback tests |
| `GAP-OPS-003` | `P1` | Observability/alerts | `MISSING` | Phase 2 | Structured logs/metrics/traces, redaction, alerts and runbooks |
| `GAP-OPS-004` | `P1` | One-command hosting | `MISSING` | Phase 2 | Reproducible install/start/upgrade/backup/restore on clean host |
| `GAP-OPS-005` | `P1` | CI/release/SBOM | `MISSING` | Phase 2/3 | Automated checks, provenance, SBOM, release channels and rollback |

## Triage rule

Resolve `P0` production foundations before enabling real data or customer-facing side effects. Phase 1 must still complete functional development workflows through local services or lawful sandbox/test adapters. Deterministic test doubles are required for isolation but are not an exit substitute; gated vendors require an adapter contract, documented blocker, and strongest lawful substitute.
