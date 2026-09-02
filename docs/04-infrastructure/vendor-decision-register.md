# Vendor and technology decision register

Allowed states: `CANDIDATE`, `RESEARCH-NEEDED`, `SELECTED`, `REJECTED`. **No item is selected today.** Candidate status does not block Phase 1 evaluation: use local services or authorized sandbox/test accounts where feasible. A gated candidate requires an owned adapter contract, documented blocker, and strongest lawful substitute; never scrape or bypass access. Production credentials and real data remain Phase 2 gates.

| Decision ID | Capability | Candidate | State | Why considered | Open gates / rejection criteria |
|---|---|---|---|---|---|
| `VDR-001` | Transactional database | PostgreSQL | `CANDIDATE` | Mature relational constraints, transactions, migrations, ecosystem | Hosting/backup/HA/operations, encryption, tenancy policy, migration tooling |
| `VDR-002` | Local object storage | MinIO | `CANDIDATE` | S3-compatible local development and self-hosting | Upgrade/backup/erasure/ops burden, license and production fit |
| `VDR-003` | Production object storage | S3-compatible managed providers | `RESEARCH-NEEDED` | Replaceable interface and broad ecosystem | BAA/service eligibility, regions, retention, versioning, egress, exit |
| `VDR-004` | Development email capture | Mailpit | `CANDIDATE` | Local-only deterministic mailbox; prevents accidental delivery | Keep development-only, access controls in shared environments |
| `VDR-005` | Production email | Amazon SES | `CANDIDATE` | Delivery APIs and ecosystem | Region/service eligibility, BAA scope, domain/reputation, suppression, costs, exit |
| `VDR-006` | Calendar | Google Calendar adapter | `CANDIDATE` | Live product exposes Google workflows | OAuth scopes, review, sync limits, data use/retention, revocation |
| `VDR-007` | Calendar | Microsoft Graph adapter | `CANDIDATE` | Live product exposes Microsoft calendar workflows | OAuth scopes, tenant consent, throttling, data use/retention, revocation |
| `VDR-008` | Scheduling | Self-hosted Cal.com | `CANDIDATE` | Self-hosted scheduling and availability concepts | License, tenancy, upgrade burden, webhook/data boundary, UX independence |
| `VDR-009` | Phone/SMS | Telnyx | `CANDIDATE` | Replaceable voice/messaging/A2P capabilities | Product-specific BAA/conduit, recording/transcription, AI, consent, 10DLC, retention, data use, pricing, portability |
| `VDR-010` | Life quoting | Compulife | `CANDIDATE` | Commercial life quote API candidate | License, permitted storage/display, carrier/field coverage, security, pricing, versioning, exit |
| `VDR-011` | Provider directory | CMS NPPES files | `CANDIDATE` | Official public downloadable source used by observed live search | Import cadence, normalization, data quality, attribution, update/recovery |
| `VDR-012` | Medicare rules/data | CMS public sources | `CANDIDATE` | Authoritative planning input | Exact dataset/API, update cadence, legal use, rule versioning and provenance |
| `VDR-013` | ACA/enrollment | HealthSherpa | `RESEARCH-NEEDED` | Visible live connection/workflows | Authorized access, partner terms, signatures, identity, data use, BAA, reconciliation, exit |
| `VDR-014` | Carrier/e-app | Direct and aggregator adapters | `RESEARCH-NEEDED` | Enrollment/application needs | Appointments/licensing, signatures, product coverage, data contracts, error/reconciliation |
| `VDR-015` | AI gateway | Provider-neutral owned gateway | `RESEARCH-NEEDED` | Avoid provider lock-in; support local and production policies | Local runtime, BAA-capable providers, data use/training, retention, region, reliability, cost |
| `VDR-016` | Voice AI | Provider-neutral voice adapters | `RESEARCH-NEEDED` | Agent/receptionist capabilities | Consent/cloning rights, disclosure, abuse, retention, BAA, fallback, cost |
| `VDR-017` | Durable jobs/workflows | Self-hosted/managed engines | `RESEARCH-NEEDED` | Timers, retries, long-running workflows | Portability, operations, determinism/versioning, multi-tenancy, pricing |
| `VDR-018` | OCR/extraction | Local and managed engines | `RESEARCH-NEEDED` | Documents/E&O extraction | Accuracy, PHI/data use, training, retention, human review, provenance, cost |
| `VDR-019` | Auth/identity | Self-hosted or managed OIDC | `RESEARCH-NEEDED` | Secure identity, MFA, SSO path | BAA, recovery, tenant claims, admin/support, export/exit, operational burden |
| `VDR-020` | Billing | Subscription/payment providers | `RESEARCH-NEEDED` | Phase 3 subscription/seats/metering | Taxes, disputes, ledger, webhooks, country scope, privacy, portability |
| `VDR-021` | Observability | OpenTelemetry-compatible stack | `CANDIDATE` | Vendor-neutral instrumentation | Redaction, PHI/PII handling, retention, access, on-call, managed-vs-local cost |
| `VDR-022` | Update signing | TUF/Sigstore-style approaches | `RESEARCH-NEEDED` | Signed manifests, provenance, revocation | Key custody, offline root, channels, Windows/Linux support, operator recovery |

## Telnyx review bundle

- [A2P/10DLC quickstart](https://developers.telnyx.com/docs/messaging/10dlc/quickstart)
- [AI Services Addendum](https://telnyx.com/legal/ai-services-addendum)
- [Acceptable Use Policy](https://telnyx.com/acceptable-use-policy)

Do not infer that one contract or BAA covers every Telnyx product or data flow.

## Supporting official references

- [AWS HIPAA eligible services reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/)
- [Cal.com availability documentation](https://cal.com/docs/availability)
- [Compulife API](https://compulife.com/api/)
- [CMS NPPES files](https://download.cms.gov/nppes/NPI_Files.html)

## How to change a state

1. Complete an [integration evaluation](../07-templates/integration-evaluation-template.md).
2. Attach current official evidence, deterministic test-double contract results, and Phase 1 end-to-end local/sandbox proof (or the documented blocker and lawful substitute).
3. Record security, legal, privacy/BAA, license, pricing, operations, reliability, and exit decisions.
4. Update this table and the integration catalog in the same change.
5. `SELECTED` requires an explicit project decision; a working demo is not enough.
