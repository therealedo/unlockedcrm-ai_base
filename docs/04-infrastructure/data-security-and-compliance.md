# Data, security, privacy, and compliance plan

> The current build and Phase 1 synthetic environment are not approved for real PII/PHI. Nothing in this plan is a compliance certification.

This is an engineering control plan, not legal advice. Limited real use requires Phase 2 approval; public/SaaS use also requires the Phase 3 clean-room and legal gates.

## Phase boundaries

| Phase | Data boundary | Security meaning |
|---|---|---|
| Phase 1 | Fictional records and deterministic provider scenarios only | Workspace-aware design and policy tests; not production authentication, tenant isolation, or sensitive-data approval |
| Phase 2 | Limited real data only after explicit approval | Secure hosted single-workspace product with production auth/MFA/fixed roles, encryption/keys, backups, monitoring, selected providers, and operations |
| Phase 3 | Public/multi-customer only after clean-room and counsel gates | Independent public product, tenant isolation, SaaS control plane, subscriptions, fleet operations, and public legal/compliance program |

A `workspace_id` column or synthetic authorization test is a design seam, not a production security control by itself.

## Sensitive data classes

| Class | Examples | Required eventual handling |
|---|---|---|
| Identity/contact | Name, phone, email, address, DOB | Minimize, encrypt, scope, audit |
| Health/eligibility | Conditions, medications, providers, Medicare/ACA eligibility | Treat as highly sensitive and potentially PHI |
| Insurance | Policy IDs, coverage, carrier, premiums, applications/enrollments | Workspace/owner scope, retention, disclosure control |
| Communications | Email, SMS, calls, transcripts, recordings, voicemail | Consent, suppression, recording law, retention, access audit |
| Financial | Commissions, billing/payment references | Ledger integrity, restricted access, audit |
| Credentials | OAuth tokens, API keys, SMTP passwords, webhook secrets | Vault only; never browser storage, logs, fixtures, or source |
| Documents | IDs, applications, E&O, attachments, exports | Scoped objects, scanning, versions, expiry, audit |
| AI data | Prompts, context, outputs, tool calls, embeddings | Minimize, redact, policy, provenance, retention/data-use gate |

Phase 1 uses synthetic forms/documents even where future fields may hold these classes.

## Phase 1 guardrails

- Seed one fictional workspace and identities; do not import customer data.
- Carry centralized actor/workspace context through requests, repositories, jobs, files, events, search, exports, and audit.
- Enforce workspace scopes and negative tests, while labeling this as development policy—not production RBAC.
- Prevent deterministic providers from contacting real destinations.
- Keep provider status explicit and record synthetic attempts/outcomes.
- Keep secrets externalized; use only development values.
- Do not cache sensitive-shaped API responses for offline use. A network-required PWA must not claim offline storage or mutation support.
- Record every omitted security control as a Phase 2 gap.

## Phase 2 minimum control set

### Identity and authorization

- Secure sessions/tokens, expiry, revocation, CSRF protection, recovery, MFA, and privileged-action step-up.
- Server-side fixed-role and record ownership/hierarchy enforcement with negative tests.
- Least-privilege support/admin access that is explicit, time-bound, reviewed, and audited.

### Data protection

- TLS plus encrypted database, objects, backups, and secret vault.
- Key rotation, separation of duties, and tested recovery.
- Purpose limitation, minimization, redaction, safe logs, retention, legal hold, deletion, export, and closure workflows.
- Workspace-scoped repositories and constraints independently reviewed; Phase 3 adds true multi-workspace/tenant isolation tests.

### Communications and consent

- Consent source/version/time, DNC/opt-out, quiet hours, and channel suppression.
- Recording/transcription disclosure, jurisdiction policy, retention, and deletion.
- A2P/10DLC brand/campaign/number state and audit.
- Email sender identity, unsubscribe, bounce/complaint suppression, and reputation controls.
- Medicare communication/marketing review and versioned approved content.

Planning references:

- [HHS HIPAA Security Rule resources](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- [CMS Medicare communications and marketing guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines)

These references do not establish applicability or certify the application. Use qualified counsel and compliance professionals.

### Integrity and availability

- Server validation, database constraints, idempotency, signed webhooks, and replay protection.
- Immutable or tamper-evident audit events.
- Encrypted backups, restore drills, disaster recovery, and application-independent export/recovery.
- Redacted observability, incident response, vulnerability management, and secure release provenance.

### Vendors and subprocessors

For every product-specific flow, document purpose/fields, controller/processor roles, BAA/conduit applicability, training/data use, retention/deletion, subprocessors, region/residency, incident notice, audit rights, service/configuration eligibility, and exit/export.

An eligible cloud service or BAA can be necessary but never makes the complete application compliant. See the [AWS service eligibility reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) for an example of service-specific scoping.

## Required threat tests

- Cross-user or cross-workspace object reference.
- Job/webhook/export/search/AI/support action missing actor or workspace context.
- Replayed callback causing a duplicate send, enrollment, commission import, or charge.
- Credential leakage to browser, logs, traces, errors, backups, or support bundles.
- Object URL guessing or access after revocation.
- Suppressed contact receiving a message.
- Recording retained or accessed outside policy.
- Failed migration/update without a recoverable state.
- Restore missing objects, secrets, indexes, job state, or audit continuity.
- Phase 3 control plane attempting direct product-table access.

## Approval boundary

Phase 2 requires a written limited-use scope and independent security/legal review before any real sensitive data or production side effect. Public/SaaS use additionally requires the [Phase 3 gate](../03-roadmap/phase-3-public-readiness.md). “IP-proof” and “compliant” cannot be guaranteed by documentation or architecture.
