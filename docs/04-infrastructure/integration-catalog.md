# Integration catalog

This catalog separates the owned product workflow from the external provider boundary. Phase 1 completes each audited workflow with synthetic data and a deterministic provider-neutral simulator when a real service is not yet selected. Phase 2 introduces selected lawful production providers before limited real-data use.

**Status rule:** `SELECTED` in the vendor register means an approved target, not a current implementation. No production provider credentials are approved by this catalog.

| Integration ID | Capability | Phase 1 owned workflow and boundary | Phase 2/3 provider status | Required gates |
|---|---|---|---|---|
| `INT-COMMS-001` | Phone/voice | Persistent number/setup, inbound/outbound call, routing, voicemail, recording, callback, failure/retry and audit state via deterministic simulator | Telnyx `CANDIDATE`; alternatives `RESEARCH-NEEDED` | Numbers, webhooks, SIP, recording, BAA/conduit, consent, retention, cost |
| `INT-COMMS-002` | SMS/MMS | Persistent conversation/send/receive/delivery/opt-out/DNC/A2P state via deterministic simulator | Telnyx `CANDIDATE`; alternatives `RESEARCH-NEEDED` | Consent, quiet hours, A2P/10DLC, delivery, data use, deletion |
| `INT-COMMS-003` | Personal email | Mailbox connect/disconnect/sync/thread/send/revoke/error/retry state via simulator; Mailpit may capture development mail | Google/Microsoft adapters `CANDIDATE` | OAuth scopes/review, sync, revocation, threading, retention, audit |
| `INT-COMMS-004` | Bulk/transactional email | Campaign delivery, suppression, bounce, complaint, retry and provider-event state via simulator/Mailpit | SES `CANDIDATE`; alternatives open | Domain identity, reputation, unsubscribe, service eligibility, BAA/data scope |
| `INT-CAL-001` | Calendar sync | Connection, incremental event sync, conflict, timezone, revoke, failure and retry states via simulator | Google/Microsoft `CANDIDATE` | OAuth, incremental sync, limits, data use, revocation |
| `INT-CAL-002` | Scheduling/booking | Owned availability, booking, reschedule, cancel, conflict and notification workflow; provider edge simulated | Self-hosted Cal.com `CANDIDATE`; owned scheduler remains possible | License, webhooks, branding, upgrades, public endpoint security |
| `INT-QUOTE-001` | Life quoting | Complete intake, normalized synthetic results, comparison, provenance, save/share and failure/retry via deterministic rating adapter | Compulife `CANDIDATE` | Commercial license, permitted storage/display, coverage, security, price, exit |
| `INT-QUOTE-002` | Medicare plans/quoting | Versioned synthetic/public-data snapshot, drug/provider inputs, normalized results, stale/unavailable states | CMS/public and approved commercial feeds `RESEARCH-NEEDED` | Source authority, cadence, attribution, geography, reconciliation |
| `INT-QUOTE-003` | ACA quote/subsidy | Versioned synthetic rules/results, QLE/subsidy explanation, provenance, stale/unavailable/error states | Marketplace/approved aggregator `RESEARCH-NEEDED` | Certification, rule authority, consent, state coverage, audit |
| `INT-INS-001` | Provider search | Deterministic versioned provider dataset; optional lawful NPPES snapshot import | CMS NPPES `CANDIDATE` | Import cadence, normalization, quality, attribution, no scraping |
| `INT-INS-002` | Carrier/e-app enrollment | Complete application, consent, submission-attempt, external-status, failure/retry/cancel/reconcile lifecycle via simulator | Direct/aggregator adapters `RESEARCH-NEEDED` | Appointment/licensing, signatures, data contract, reconciliation |
| `INT-INS-003` | HealthSherpa | Setup/disconnected, submission/status/webhook-shaped events, failure/retry/reconcile via simulator | HealthSherpa `RESEARCH-NEEDED` | Authorized access, API/webhook contract, identity, data use, BAA, exit |
| `INT-AI-001` | General/quote/underwriting AI | Persistent prompt/result/tool/approval/usage lifecycle through deterministic provider-neutral model adapter | Local and BAA-capable providers `RESEARCH-NEEDED` | Training/data use, retention, region, redaction, tool policy, cost, fallback |
| `INT-AI-002` | Voice AI | Synthetic voice/call lifecycle, approval, disclosure, usage, failure and retry through deterministic adapter | Provider-neutral voice vendors `RESEARCH-NEEDED` | Consent, cloning rights, disclosure, abuse, retention, BAA/data use |
| `INT-AUTO-001` | Durable workflows/jobs | PostgreSQL-backed definitions/runs plus bounded local workers, timers, retries, cancellation and dead letters | Specialized engine `RESEARCH-NEEDED`; not required initially | Idempotency, versioning, recovery, portability, operations |
| `INT-BIZ-001` | Commission statements/sync | Functional internal ledger, synthetic file import and deterministic API-shaped sync/reconciliation adapter | Carrier/aggregator adapters `RESEARCH-NEEDED` | License, formats, provenance, corrections, exit |
| `INT-DOC-001` | Object storage | S3-compatible local object lifecycle with workspace-scoped keys and database metadata | MinIO `CANDIDATE`; managed S3-compatible provider open | Encryption, scopes, versions, retention, backup, deletion, BAA |
| `INT-DOC-002` | OCR/extraction | Upload/scan/quarantine/extract/review/provenance workflow with deterministic OCR adapter | Local/managed engines `RESEARCH-NEEDED` | Accuracy, PHI/data use, training, retention, human review |
| `INT-FORM-001` | Hosted forms | Locally served form, schema/version, validation, consent, upload, mapping, response and export | Owned service preferred; external vendors open | Abuse controls, legal version, object safety, public hosting, export |
| `INT-OBS-001` | Analytics/audit | PostgreSQL workspace-scoped events and projections from real synthetic workflows | PostgreSQL projections `SELECTED`; specialized stores later if needed | Integrity, retention, access, redaction, performance, export |
| `INT-AUTH-001` | Authentication/identity | One seeded development identity and centralized request/policy context; no production-auth claim | Self-hosted/managed OIDC `RESEARCH-NEEDED` for Phase 2 | MFA, recovery, fixed roles, admin/support, BAA, export/exit |
| `INT-BILL-001` | Subscriptions/billing | Deferred; CRM may use synthetic entitlements only where audited UI needs a state | Phase 3 control-plane provider `RESEARCH-NEEDED` | Taxes, disputes, ledger, metering, webhooks, portability |
| `INT-MON-001` | Monitoring/alerting | Development health and redacted structured logs | OpenTelemetry-compatible stack `CANDIDATE` for Phase 2 | PII/PHI redaction, access, retention, on-call, cost |
| `INT-BACKUP-001` | Backup/restore | Development export/reseed may aid testing but is not production backup | Encrypted database/object tooling `RESEARCH-NEEDED` for Phase 2 | RPO/RTO, immutability, keys, off-site copy, restore drill |
| `INT-UPDATE-001` | Signed updates | Deferred except migration compatibility discipline | TUF/Sigstore-style tooling `RESEARCH-NEEDED` for Phase 2 | Signing custody, provenance, channels, revocation, rollback |
| `INT-HOST-001` | Product hosting | No provider: Fastify API, workers, and PostgreSQL run locally on Windows | Railway `PREFERRED-PHASE-2-CANDIDATE`; Vercel `CANDIDATE` for frontend previews only | Deployment spike, cost/limits, portability, backup/restore, continuous monitoring, upgrades, access control, application security, compliance, and exit |

## Phase 1 simulator acceptance

A simulator counts only when it:

- implements the same owned port and normalized types expected of a future real adapter;
- drives the complete user workflow and persists attempts, correlation IDs, outcomes, retries, reconciliation, and synthetic audit/events;
- exposes deterministic success, unavailable, timeout, rejected, duplicate-callback, and recovery scenarios as applicable;
- has contract tests reusable against real adapters;
- is visibly labeled as simulated/disconnected where users could otherwise infer real delivery;
- needs no cloud account and cannot contact real customer destinations.

Hard-coded cards, optimistic buttons without durable transitions, and unlabelled fake success remain `MOCK`.

## Product-specific Telnyx gate

Telnyx is replaceable and must not be treated as a blanket compliance answer. Review each product and data flow against:

- [A2P/10DLC quickstart](https://developers.telnyx.com/docs/messaging/10dlc/quickstart)
- [AI Services Addendum](https://telnyx.com/legal/ai-services-addendum)
- [Acceptable Use Policy](https://telnyx.com/acceptable-use-policy)

BAA/conduit treatment, recording/transcription, AI, consent, A2P/10DLC, retention, data use, subprocessors, and deletion require separate approval.

## Other official planning references

- [Cal.com availability documentation](https://cal.com/docs/availability)
- [Compulife API](https://compulife.com/api/)
- [CMS NPPES downloadable files](https://download.cms.gov/nppes/NPI_Files.html)
- [AWS HIPAA eligible services reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) — service eligibility never makes this application compliant.

## Evaluation flow

Use the [integration evaluation template](../07-templates/integration-evaluation-template.md), record the provider-boundary result, and update the [vendor decision register](vendor-decision-register.md). Production credentials remain prohibited until the Phase 2 gates pass.
