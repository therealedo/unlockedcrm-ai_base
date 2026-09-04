# Neutral domain model

This model describes owned concepts inferred from repository/live evidence and approved planning. It is not a copy of a vendor schema.

## Phase 1 workspace root

| Entity | Purpose |
|---|---|
| Workspace | Ownership root for product data and configuration; exactly one fictional workspace is seeded in Phase 1 |
| Development Identity | Seeded actor used by centralized request/policy context; not production authentication |
| User | Product identity and preferences; production session/MFA behavior arrives in Phase 2 |
| Membership/Role | Fixed-profile assignment and policy input within the workspace |
| Agency/Organization | Hierarchical business nodes such as IMO/FMO, BGA/MGA, agency, and sub-agency |
| Agent Profile | Insurance/work assignment identity linked to a user where applicable |

Every Phase 1 business record, job, file, event, search row, export, and audit record carries `workspace_id` where applicable. This is a forward-compatible ownership seam, not proof of multi-tenant security.

## CRM and sales

| Entity | Core relationships/purpose |
|---|---|
| Contact/Household | Person, relationships, channels, demographics, assignment, ownership |
| Tag/Custom Field Definition/Value | Workspace-configured classification and product-specific data |
| Consent/Suppression | Channel, purpose, source, legal version, time, revocation, DNC |
| Activity | Normalized timeline event linked to records, actor, and workspace |
| Pipeline/Stage/Opportunity | Sales process, probability, value, product, assignment, history |
| Task/Comment/Attachment | Work item, status, priority, assignment, collaboration |
| Calendar Connection/Availability/Appointment | Owned scheduling rules/events plus provider-boundary state |
| Booking Link/Submission | Personal/round-robin scheduling boundary and persisted booking lifecycle |
| Notification Preference/Event | Event taxonomy, recipient, read state, and optional delivery state |
| Search Document | Workspace-scoped normalized index projection and source reference |

## Insurance

| Entity | Core relationships/purpose |
|---|---|
| Carrier/Product/Coverage Type | Versioned reference and availability |
| Quote Request/Result | Product-specific inputs, normalized synthetic/provider results, status, and provenance |
| Eligibility Assessment | Rule/data version, inputs, result, explanation, and history |
| Provider/Medication | Versioned search/reference data for Medicare/health workflows |
| Application/Enrollment | Owned lifecycle, consent, submission attempts, external identity/status, reconciliation |
| Policy/Renewal | Coverage, dates, owner, premium, metadata, and renewal lifecycle |
| Commission Statement/Entry/Split/Payment | Immutable source, matching, reconciliation, correction, and provider-boundary state |

## Communications and orchestration

| Entity | Core relationships/purpose |
|---|---|
| Provider Connection | Provider-neutral setup, connected/disconnected/health state, credential reference |
| Channel Identity | Phone number, sender/domain, mailbox, or simulated endpoint |
| Conversation/Message/Call | Unified product projection, delivery/call state, attempts, and provider correlation |
| Recording/Voicemail/Transcript | Sensitive-shaped object, synthetic consent, retention, and access state in Phase 1 |
| A2P Registration | Brand/campaign/use case/numbers and status history; simulated until approved |
| Template/Script | Versioned email/SMS/call/form content |
| Workflow Definition/Version | Trigger and ordered action/delay/end graph |
| Workflow Enrollment/Run/Action | Durable execution, status, attempt, retry, error, and attribution |
| Campaign/Audience Snapshot/Queue Item | Versioned audience, suppression, schedule, delivery, and result |
| Form/Version/Response | Hosted schema, mapping, consent/legal version, upload, and submission |

## Files, AI, and platform

| Entity | Core relationships/purpose |
|---|---|
| Document/Folder/Object Version | Workspace-scoped metadata and immutable object reference |
| Extraction | OCR/model/version/input/output/confidence/human-review provenance |
| AI Conversation/Profile/Insight | User context, history, outputs, usage, and provider status |
| AI Tool Policy/Approval/Execution | Action, mode, request, decision, result, and audit |
| Provider Attempt | Port, command, normalized request/result, simulator/real status, correlation, retry, outcome |
| Audit Event | Actor, workspace, action, target, time, correlation, provenance, integrity metadata |
| Webhook Receipt/Outbox Command | Verified/deduplicated inbound and reliable outbound integration events |
| Export Job | Authorized query snapshot, object, expiry, status, and audit |
| Release/Migration/Backup Journal | Phase 2 operational provenance and recovery state |

## Future Phase 3 control plane

| Entity | Purpose |
|---|---|
| Customer Account | Public commercial relationship, separate from CRM contacts |
| Workspace Provisioning Record | Requested product deployment/workspace lifecycle |
| Subscription/Plan/Entitlement | Billing, limits, and plan enforcement |
| Deployment/Fleet Record | Version, health, release channel, and operator action metadata |
| Public Support/Operations Record | Audited SaaS service operation outside product tables |

The control plane exchanges versioned commands/events with the product/data plane. It must not own, query, or mutate contacts, policies, communications, documents, commissions, or other CRM product tables directly.

## Modeling rules

- Owned domain/application APIs are stable; external provider schemas stop at adapters.
- External IDs are namespaced by provider and never replace owned primary IDs.
- Workspace context is mandatory in repositories, constraints, object keys, jobs, caches, idempotency keys, search, exports, and audit.
- Time-sensitive rules/results keep version and provenance.
- Corrections append history; financial and audit records are not silently overwritten.
- Provider workflows persist setup, attempt, correlation, success/failure/retry/reconcile, and explicit simulator/real status.
- Browser storage may hold ephemeral preferences only; PostgreSQL is authoritative for product state.
