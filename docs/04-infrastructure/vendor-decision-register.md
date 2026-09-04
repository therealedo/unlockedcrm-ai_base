# Vendor and technology decision register

Allowed states are `CANDIDATE`, `PREFERRED-PHASE-2-CANDIDATE`, `RESEARCH-NEEDED`, `SELECTED`, `SELECTED-TARGET`, and `REJECTED`. `PREFERRED-PHASE-2-CANDIDATE` ranks the next hosting spike but is neither a production selection nor implementation proof. A `SELECTED` or `SELECTED-TARGET` technology is an approved target, not proof that it exists in the current implementation. The [current infrastructure audit](current-infrastructure.md) remains authoritative for what is actually built.

Phase 1 must run on Windows without a cloud account. The selected target runs pinned Node.js 24 LTS/npm Vinext/Vite and Fastify processes on the host while Docker Desktop + Docker Compose manages PostgreSQL and later slice-required infrastructure. The topology and root startup command are not implemented; full app containerization requires measured parity evidence. Railway is the unvalidated preferred Phase 2 hosting candidate; Vercel is optional for frontend previews only. External providers remain replaceable and may be represented by deterministic provider-neutral simulators. Production credentials and sensitive data remain Phase 2 gates.

| Decision ID | Capability | Candidate | State | Decision or reason considered | Open gates / revisit trigger |
|---|---|---|---|---|---|
| `VDR-001` | Transactional database | PostgreSQL | `SELECTED` | Authoritative Phase 1/2 product database; relational integrity and portable local/hosted operation | Implement migrations, workspace constraints, backup and hosted operations |
| `VDR-002` | Development object storage | MinIO | `CANDIDATE` | S3-compatible local development and self-hosting | License, upgrade/backup burden, production fit |
| `VDR-003` | Production object storage | Managed S3-compatible provider | `RESEARCH-NEEDED` | Replaceable interface and broad ecosystem | BAA/service scope, region, retention, versions, egress, exit |
| `VDR-004` | Development email capture | Mailpit | `CANDIDATE` | Prevents accidental delivery and supports deterministic inspection | Shared-environment access controls; development-only boundary |
| `VDR-005` | Production email | Amazon SES | `CANDIDATE` | Delivery APIs and ecosystem | Region/service eligibility, BAA scope, domain reputation, suppression, exit |
| `VDR-006` | Calendar | Google Calendar adapter | `CANDIDATE` | Observed workflow and broad user availability | OAuth scopes/review, sync limits, retention, revocation |
| `VDR-007` | Calendar | Microsoft Graph adapter | `CANDIDATE` | Observed workflow and enterprise availability | OAuth/tenant consent, throttling, retention, revocation |
| `VDR-008` | Scheduling | Self-hosted Cal.com | `CANDIDATE` | Possible replaceable scheduling implementation | License, upgrade burden, webhook/data boundary, independent UX |
| `VDR-009` | Phone/SMS | Telnyx | `CANDIDATE` | Replaceable voice/messaging/A2P capabilities | Product-specific BAA/conduit, recording, AI, consent, 10DLC, retention, data use, price, exit |
| `VDR-010` | Life quoting | Compulife | `CANDIDATE` | Commercial rating API candidate | License, permitted storage/display, coverage, security, price, versioning, exit |
| `VDR-011` | Provider directory | CMS NPPES files | `CANDIDATE` | Official public downloadable source | Cadence, normalization, quality, attribution, recovery |
| `VDR-012` | Medicare rules/data | CMS public sources | `CANDIDATE` | Potential authoritative inputs | Exact dataset/API, use terms, cadence, provenance |
| `VDR-013` | ACA/enrollment | HealthSherpa | `RESEARCH-NEEDED` | Observed connection/workflows | Authorized access, partner terms, signatures, data use, BAA, reconciliation, exit |
| `VDR-014` | Carrier/e-app | Direct and aggregator adapters | `RESEARCH-NEEDED` | Enrollment/application needs | Appointment/licensing, signatures, product coverage, reconciliation |
| `VDR-015` | AI gateway | Provider-neutral owned gateway | `SELECTED` | Core logic must not depend on one model vendor; simulator works in Phase 1 | Select real Phase 2 local/BAA-capable providers and policies |
| `VDR-016` | Voice AI | Provider-neutral voice adapters | `RESEARCH-NEEDED` | Agent/receptionist workflow | Consent/cloning rights, disclosure, abuse, retention, BAA, fallback, cost |
| `VDR-017` | Durable jobs/workflows | Transactional outbox plus bounded workers | `SELECTED` | Sufficient, inspectable modular-monolith starting point | Choose a specialized engine only if measured needs justify it |
| `VDR-018` | OCR/extraction | Local and managed engines | `RESEARCH-NEEDED` | Document extraction workflow | Accuracy, PHI/data use, training, retention, human review, provenance |
| `VDR-019` | Authentication | Self-hosted or managed OIDC | `RESEARCH-NEEDED` | Phase 2 production identity/MFA | Recovery, fixed-role claims, BAA, support access, export, burden |
| `VDR-020` | Billing | Subscription/payment providers | `RESEARCH-NEEDED` | Phase 3 control plane | Taxes, disputes, metering, privacy, portability |
| `VDR-021` | Observability | OpenTelemetry-compatible stack | `CANDIDATE` | Vendor-neutral instrumentation | Redaction, retention, access, on-call, local-vs-managed cost |
| `VDR-022` | Update signing | TUF/Sigstore-style approaches | `RESEARCH-NEEDED` | Signed manifests, provenance, revocation | Key custody, trust root, channels, host support, recovery |
| `VDR-023` | Web UI framework/build | Current Vinext/Vite React stack | `SELECTED` | Preserve parity work and avoid a no-value framework migration in Phase 1 | Revisit only for a concrete incompatibility, security, maintenance, or hosting blocker |
| `VDR-024` | Backend runtime | Node.js 24 LTS with TypeScript | `SELECTED` | One maintainable language and portable long-term runtime | Implement separate API process/package; pin an exact Node.js 24 LTS patch and npm version in repository metadata |
| `VDR-025` | Server architecture | Modular monolith | `SELECTED` | Clear module boundaries without premature distributed operations | Preserve APIs/events; extract only after measured pressure |
| `VDR-026` | Database access/migrations | Prisma plus reviewed custom SQL | `SELECTED` | Typed application access with explicit PostgreSQL escape hatches | Review constraints/indexes/locking/search SQL and migration safety |
| `VDR-027` | API transport | HTTPS REST/JSON | `SELECTED` | Simple online client boundary; no Phase 1 offline sync requirement | Versioning, idempotency, validation, error and concurrency contracts |
| `VDR-028` | PostgreSQL hosting | Supabase | `CANDIDATE` | Optional managed PostgreSQL host after local development | Must remain PostgreSQL-only optionality; no required proprietary auth/domain dependency |
| `VDR-029` | Core HTTP framework | Fastify | `SELECTED-TARGET` | Node.js 24 LTS TypeScript framework for the one modular-monolith REST API | Implement and verify plugins, schemas, error handling, lifecycle, tests, security defaults, and operations |
| `VDR-030` | Phase 2 application/database hosting | Railway | `PREFERRED-PHASE-2-CANDIDATE` | Candidate topology for persistent Fastify API, bounded workers, and PostgreSQL with low operator burden | Deployment spike; backup/restore, continuous monitoring, upgrades, access control, application security, compliance, cost, portability, and exit remain project gates |
| `VDR-031` | Frontend previews | Vercel | `CANDIDATE` | Optional protected preview URLs for UI review | Preview-only; no product API, worker, PostgreSQL, production-data, or Phase 1 dependency |
| `VDR-032` | Core API | Python/FastAPI | `REJECTED` | A second language/API authority would increase operational and data-boundary complexity | Do not revisit for core API; a specialized worker does not reopen this decision |
| `VDR-033` | Specialized worker runtime | Isolated Python process | `RESEARCH-NEEDED` | A future library may justify a narrowly scoped worker | Require proven library need, owned job/port contract, normalized result, least privilege, no public product API, and no independent data authority |
| `VDR-034` | Windows development topology | Host-run Vinext/Vite and Fastify + Docker Desktop/Compose infrastructure | `SELECTED-TARGET` | Fast app feedback and debugging with reproducible PostgreSQL-first services and no cloud account | Not implemented; pin Node.js 24 LTS/npm, verify Windows/WSL/license prerequisites, build one root startup command, add services only with slice need, and containerize apps only after measured parity problems |

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
- [Docker Desktop installation on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Compose](https://docs.docker.com/compose/)

## State-change rule

1. Complete an [integration evaluation](../07-templates/integration-evaluation-template.md).
2. Attach current official evidence plus deterministic contract results; keep simulator proof separate from real-provider proof.
3. Record security, legal, privacy/BAA, license, pricing, operations, reliability, and exit decisions.
4. Update this table and the [integration catalog](integration-catalog.md) together.
5. `SELECTED` and `SELECTED-TARGET` require an explicit decision; implementation still requires `LOCAL-VERIFIED` evidence in the capability matrix. `PREFERRED-PHASE-2-CANDIDATE` requires a bounded spike before it can be promoted.
