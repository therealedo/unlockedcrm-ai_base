# Integration catalog

This catalog names required interfaces and candidate paths. **No production vendor is selected by this table.** Phase 1 must exercise each feasible interface end to end through a local service or lawful sandbox/test account using synthetic data and owned destinations. If access is vendor-gated, the required substitute is an adapter contract, documented blocker, and strongest lawful test path—not scraping or bypass.

| Integration ID | Capability | Phase 1 functional path | Production candidates/status | Required gates |
|---|---|---|---|---|
| `INT-COMMS-001` | Phone/voice | Authorized sandbox/test account to owned numbers; local event simulator only if blocked | Telnyx `CANDIDATE`; alternatives `RESEARCH-NEEDED` | Numbers, webhooks, recording, routing, SIP, cost, BAA/conduit, retention |
| `INT-COMMS-002` | SMS/MMS | Authorized sandbox/test traffic to owned numbers with delivery callbacks | Telnyx `CANDIDATE`; alternatives open | Consent, DNC, quiet hours, A2P/10DLC, opt-out, delivery, data use |
| `INT-COMMS-003` | Personal email | Mailpit/test mailbox plus owned Google/Microsoft test inbox when authorized | Google and Microsoft `CANDIDATE` adapters | OAuth scopes, sync, revocation, retention, threading, audit |
| `INT-COMMS-004` | Bulk/transactional email | Mailpit plus provider sandbox delivery to owned inboxes | SES `CANDIDATE`; alternatives open | Domain verification, suppression, bounce/complaint, reputation, BAA/service eligibility |
| `INT-CAL-001` | Calendar sync | Owned test calendars through authorized Google/Microsoft adapters | Google/Microsoft `CANDIDATE` | OAuth, incremental sync, conflicts, timezones, revocation |
| `INT-CAL-002` | Scheduling/booking | Locally hosted scheduler and owned test booking endpoint | Self-hosted Cal.com `CANDIDATE`; owned scheduler remains possible | Availability, webhooks, tenancy, data use, branding, upgrade path |
| `INT-QUOTE-001` | Life quoting | Licensed sandbox/test API if available; otherwise contract, blocker and lawful versioned substitute | Compulife `CANDIDATE` | Commercial license, allowed storage/display, carrier coverage, pricing, data security, exit |
| `INT-QUOTE-002` | Medicare plan data/quoting | Versioned local public-data import plus authorized test feed where available | CMS/public data and approved commercial feeds `RESEARCH-NEEDED` | Update cadence, terms, result provenance, drugs/providers, state/county |
| `INT-QUOTE-003` | ACA quoting/subsidy | Versioned local rules plus authorized marketplace/aggregator test path where available | Marketplace/approved aggregator `RESEARCH-NEEDED` | QLE/subsidy authority, certification, consent, state coverage, audit |
| `INT-INS-001` | Provider search | Versioned local CMS NPPES import and real search | CMS NPPES files `CANDIDATE` | Import cadence, normalization, quality, source attribution, no scraping |
| `INT-INS-002` | Carrier/e-app enrollment | Authorized sandbox if available; otherwise adapter contract, blocker and local lifecycle simulator | Carrier/e-app adapters `RESEARCH-NEEDED` | Appointment/licensing, consent, signatures, status reconciliation, legal terms |
| `INT-INS-003` | HealthSherpa | Authorized sandbox/webhook if available; otherwise adapter contract, blocker and strongest lawful substitute | HealthSherpa `RESEARCH-NEEDED` | Authorized access, webhook/API contract, signature, identity, data use, reconciliation |
| `INT-AI-001` | General/quote/underwriting AI | Local model and/or authorized vendor sandbox through provider-neutral gateway | Provider-neutral gateway; local and BAA-capable production options `RESEARCH-NEEDED` | BAA, training/data use, retention, region, redaction, tool policy, cost, fallback |
| `INT-AI-002` | Voice synthesis/agent | Local/test voice service and owned test-call workflow when lawful | Provider-neutral voice vendors `RESEARCH-NEEDED` | Voice consent, cloning rights, recording, disclosure, retention, abuse, BAA |
| `INT-AUTO-001` | Durable workflows/jobs | Persisted local worker/workflow runtime with timers/retries | Self-hosted/managed engines `RESEARCH-NEEDED` | Idempotency, retry, timers, versioning, operations, portability |
| `INT-BIZ-001` | Commission statements/sync | Synthetic files and authorized sandbox API import with real matching/reconciliation | Carrier aggregators and direct files/APIs `RESEARCH-NEEDED` | License, formats, reconciliation, splits, provenance, corrections, exit |
| `INT-DOC-001` | Object storage | MinIO/S3-compatible local object lifecycle | MinIO local `CANDIDATE`; S3-compatible production provider open | Encryption, scopes, versioning, retention, backup, deletion, BAA as needed |
| `INT-DOC-002` | OCR/extraction | Local OCR/extraction over synthetic documents | Local OCR and managed services `RESEARCH-NEEDED` | Accuracy, provenance, PHI handling, training/data use, human review |
| `INT-FORM-001` | Hosted forms | Locally hosted submission service and synthetic responses | Owned service preferred; external form vendors open | Consent/legal version, abuse, uploads, validation, tenancy, export |
| `INT-OBS-001` | Analytics/audit | Persisted local append-only events and PostgreSQL projections | PostgreSQL projections `CANDIDATE`; specialized stores later | Integrity, retention, access, redaction, query performance, export |
| `INT-AUTH-001` | Auth/identity | Local synthetic identity/role service sufficient for development workflows | Self-hosted or managed OIDC `RESEARCH-NEEDED` | MFA, recovery, SCIM/SSO needs, BAA, tenant claims, admin access, export |
| `INT-BILL-001` | Billing/subscriptions | Functional synthetic local ledger | Billing provider `RESEARCH-NEEDED` | Idempotency, taxes, disputes, metering, webhooks, portability |
| `INT-MON-001` | Monitoring/alerting | Local structured logs/metrics for development workflows | OpenTelemetry-compatible stack `CANDIDATE`; managed sinks open | PHI/PII redaction, access, retention, region, on-call, cost |
| `INT-BACKUP-001` | Backup/restore | Development database/object export rehearsal; production hardening is Phase 2 | Encrypted database/object backup tools `RESEARCH-NEEDED` | RPO/RTO, immutability, off-site copies, key recovery, restore drill |
| `INT-UPDATE-001` | Signed updates | Release/migration contract may be designed in Phase 1; production system is Phase 2 | TUF/Sigstore-style tooling `RESEARCH-NEEDED` | Signing custody, provenance, channels, revocation, rollback, offline recovery |

Deterministic test doubles remain required beside these paths for fast, repeatable automated tests; they do not replace Phase 1 end-to-end proof.

## Product-specific Telnyx gate

Telnyx must not be treated as a blanket compliance answer. Review each product and data flow against:

- [A2P/10DLC quickstart](https://developers.telnyx.com/docs/messaging/10dlc/quickstart)
- [AI Services Addendum](https://telnyx.com/legal/ai-services-addendum)
- [Acceptable Use Policy](https://telnyx.com/acceptable-use-policy)

Explicit decisions are required for BAA/conduit treatment, recording/transcription, AI services, consent, A2P/10DLC, retention, data use, subprocessors, and deletion.

## Other official planning references

- [Cal.com availability documentation](https://cal.com/docs/availability)
- [Compulife API](https://compulife.com/api/)
- [CMS NPPES downloadable files](https://download.cms.gov/nppes/NPI_Files.html)
- [AWS HIPAA eligible services reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) — eligibility is service/configuration-specific and does not itself make this application compliant.

## Evaluation flow

Copy [the integration evaluation template](../07-templates/integration-evaluation-template.md), record evidence, and update the [vendor decision register](vendor-decision-register.md). Production credentials are prohibited before approval.
