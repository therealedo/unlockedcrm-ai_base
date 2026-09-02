# Data, security, privacy, and compliance plan

> The current build has none of the controls required to claim production or HIPAA readiness. Do not use real PII/PHI.

This is an engineering control plan, not legal advice or certification.

## Sensitive data classes

| Class | Examples | Default handling |
|---|---|---|
| Identity/contact | Name, phone, email, address, DOB | Minimize, encrypt, scope, audit |
| Health/eligibility | Conditions, medications, providers, Medicare/ACA eligibility | Treat as highly sensitive/possible PHI |
| Insurance | Policy IDs, coverage, carrier, premiums, applications/enrollments | Tenant/owner scope, retention and disclosure control |
| Communications | Email, SMS, calls, transcripts, recordings, voicemail | Consent, suppression, recording law, retention, access audit |
| Financial | Commissions, wallet, billing, payment references | Ledger integrity, restricted access, audit |
| Credentials | OAuth tokens, API keys, SMTP passwords, webhook secrets | Vault only; never logs/browser/localStorage |
| Documents | IDs, applications, E&O, attachments, exports | Scoped objects, scan, version, expiry, audit |
| AI data | Prompts, context, outputs, tool calls, embeddings | Minimize, redact, policy, provenance, retention/data-use gate |

## Phase 2 minimum control set

### Identity and authorization

- Secure session cookies/tokens, expiration, revocation, CSRF protection and recovery.
- MFA option and privileged-action step-up.
- Server-side RBAC/ABAC and record ownership/hierarchy enforcement.
- Least-privilege support/admin access with time-bound audit.

### Data protection

- TLS in transit and encrypted database, objects, backups, and secret vault at rest.
- Key rotation, separation of duties and recovery procedure.
- Purpose limitation, field minimization, redaction and safe logs.
- Retention, legal hold, deletion, export and account closure workflows.

### Communications and consent

- Consent source/version/time, DNC/opt-out, quiet hours and channel suppression.
- Recording/transcription disclosure, jurisdiction policy, retention and deletion.
- A2P/10DLC brand/campaign/number state and audit.
- Email unsubscribe, physical-sender identity as required, bounce/complaint suppression and reputation controls.
- Medicare communication/marketing review and versioned approved content.

Planning references:

- [HHS HIPAA Security Rule resources](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- [CMS Medicare communications and marketing guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines)

These references do not certify the application. Applicability and required controls need qualified counsel and compliance professionals.

### Integrity and availability

- Server validation, database constraints, idempotency, signed webhooks, replay protection.
- Immutable or tamper-evident audit events.
- Encrypted backups, tested restore, disaster recovery and export/recovery independent of the app.
- Monitoring, incident response, vulnerability management and secure release provenance.

### Vendors and subprocessors

For each product-specific data flow, document:

- purpose and fields;
- controller/processor roles;
- BAA/conduit applicability where relevant;
- training/data use, retention, deletion and subprocessors;
- region/residency and cross-border handling;
- incident notice, audit rights and exit/export;
- service/configuration eligibility and customer responsibilities.

An eligible cloud service or signed BAA is necessary in some contexts but never sufficient to make the complete application compliant. See the [AWS service eligibility reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) as an example of service-specific scoping.

## Threat scenarios that must have tests

- Cross-user and cross-tenant object reference.
- Worker/job/webhook missing tenant or authorization context.
- Export, search, AI tool or support action bypassing scope.
- Replayed provider callback creating duplicate send, enrollment, or charge.
- Credential leakage to browser, logs, traces, errors, or backups.
- Object URL guessing or stale access after revocation.
- Suppressed contact receiving a message.
- Recording retained or accessed outside policy.
- Failed migration or update corrupting data without recovery.
- Restore producing missing objects, secrets, indexes, or audit chain.

## Approval boundary

Limited real use requires an explicit written scope and independent review. Public/SaaS use additionally requires the [Phase 3 gate](../03-roadmap/phase-3-public-readiness.md).
