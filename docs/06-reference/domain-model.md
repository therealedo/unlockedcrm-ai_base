# Neutral domain model

This model describes owned concepts inferred from local and live evidence. It is not a copy of a vendor schema.

## Identity and organization

| Entity | Core relationships/purpose |
|---|---|
| Tenant/Workspace | Isolation root for Phase 3; configuration, branding, policies |
| User | Authenticated identity and preferences |
| Membership/Role | User scope in tenant/agency/organization |
| Agency/Organization | Hierarchical business nodes such as IMO/FMO, BGA/MGA, agency, sub-agency |
| Agent Profile | Insurance/work assignment identity linked to a user when applicable |
| Seat/Subscription | Phase 3 entitlement and billing lifecycle |

## CRM and sales

| Entity | Core relationships/purpose |
|---|---|
| Contact/Household | Person, relationships, channels, demographics, ownership |
| Tag/Custom Field Definition/Value | Tenant-configured classification and product-specific data |
| Consent/Suppression | Channel, purpose, source, legal version, time, revocation/DNC |
| Activity | Normalized timeline event linked to records and actor |
| Pipeline/Stage/Opportunity | Sales process, probability, value, product, assignment, history |
| Task/Comment/Attachment | Work item, status, priority, assignment and collaboration |
| Calendar Connection/Availability/Appointment | Scheduling identity, rules and booked event |
| Booking Link/Submission | Personal or round-robin public scheduling boundary |

## Insurance

| Entity | Core relationships/purpose |
|---|---|
| Carrier/Product/Coverage Type | Versioned reference and availability |
| Quote Request/Result | Product-specific inputs, normalized carrier results and provenance |
| Eligibility Assessment | Rule/data version, inputs, result, explanation and history |
| Provider/Medication | Search/reference data used by Medicare/health workflows |
| Application/Enrollment | Submission lifecycle, consent, external identity/status |
| Policy/Renewal | Coverage, dates, ownership, premium, product metadata and renewal lifecycle |
| Commission Statement/Entry/Split/Payment | Immutable source, matching, reconciliation and correction |

## Communications and orchestration

| Entity | Core relationships/purpose |
|---|---|
| Channel Identity | Phone number, email sender/domain, mailbox connection |
| Conversation/Message/Call | Unified communication projection and provider correlation |
| Recording/Voicemail/Transcript | Sensitive object, consent, retention and access |
| A2P Registration | Brand, campaign/use case, numbers and status history |
| Template/Script | Versioned email/SMS/call/form content with folder/product scope |
| Workflow Definition/Version | Trigger and ordered action/delay/end graph |
| Workflow Enrollment/Run/Action | Durable execution, status, retry, error and attribution |
| Campaign/Audience Snapshot/Queue Item | Versioned audience, schedule, delivery and result |
| Form/Version/Response | Hosted schema, mapping, consent/legal version and submission |

## Files, AI, and platform

| Entity | Core relationships/purpose |
|---|---|
| Document/Folder/Object Version | Scoped metadata and immutable object reference |
| Extraction | OCR/model/version/input/output/confidence/human review provenance |
| AI Conversation/Profile/Insight | User context, history and derived preferences |
| AI Tool Policy/Approval/Execution | Action, mode, request, decision, result and audit |
| Notification Preference/Event | Event taxonomy and channel delivery state |
| Audit Event | Actor, tenant, action, target, time, correlation and integrity metadata |
| Webhook Receipt/Outbox Command | Verified inbound and reliable outbound integration events |
| Export Job | Authorized query snapshot, object, expiry and audit |
| Backup/Release/Migration Journal | Operational provenance and recovery state |

## Modeling rules

- Every tenant-scoped record carries enforceable scope; workers and exports do not bypass it.
- External IDs are namespaced by provider and never replace owned primary IDs.
- Time-sensitive rules/data/results store version and provenance.
- Corrections append history; financial/audit records are not silently overwritten.
- Sensitive objects have explicit purpose, retention, access and deletion state.
