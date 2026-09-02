# Live AI, automation, campaigns, and forms audit

**Evidence:** `LIVE-VERIFIED` unless marked. Sources: Engram #641 and #643. No model request, voice creation, workflow/campaign publication, message, form submission, file upload, or export was executed.

## AI capability families

| Surface | Observed behavior | Key boundary |
|---|---|---|
| General AI workspace | Conversation/history, insights, personalization, transforms, 53-action permission model | Approval and data access must be enforced server-side |
| Build | Prompted generation of dashboards, reports, tools, analytics, and saved builds | Needs safe artifact schema/rendering, not arbitrary code execution |
| Agent AI | Three-step voice/phone/compliance setup; only voice accessible; sample voices and short upload/record flow | Phone and compliance are `GATED`; vendor-backed voice/calling is absent locally |
| AI Quoting | Product cards for life, Medicare, ACA, and future annuity | Requires product-specific quote adapters |
| Underwriting | Contact-aware conversational assessment | Estimates need provenance and carrier verification |

## AI permissions

The live settings grouped 53 actions into communication, records, sensitive actions, scheduling, automation, quoting/enrollment, pipeline/activity, marketing, research/analysis, and reporting/data. Two AI contexts had independent automatic, approval-required, and blocked policies.

Phase ownership:

- Phase 1 requires a functional provider-neutral local/sandbox AI path with synthetic data, local history, tool permissions, approvals, and immutable development audit events.
- Deterministic model/tool test doubles cover automated tests but do not substitute for end-to-end local/sandbox inference and tool-policy proof.
- Phase 2 hardens deny-default server policy, least-privilege scopes, redaction, retention, production credentials, BAA/data-use gates, capacity, cost, monitoring and recovery.

## Automations

### List and builder

- All/active/inactive/deleted tabs, agent/search filters, folders, and AI build.
- Existing fictional workflow showed a trigger, email, SMS, wait, follow-up email, and end nodes on a dotted flow canvas.
- Builder exposed trigger/action insertion, zoom, AI prompt, and draft/publish state.

### Nested views

| View | Observed controls/state |
|---|---|
| Settings | Name/description/active, re-entry/cooldown, multiple opportunities, stop on response, exits, timezone/windows, sender identities, daily maximum, delete |
| Enrollment | Date/event/contact/reason filters, re-enroll/remove actions, execution table; empty |
| Logs | Date/action/status/contact filters and execution table; empty |
| Analytics | Revenue attribution window, workflow health, failed-contact download, attribution settings |

Required owned model: versioned triggers, ordered action/delay/end nodes, message templates, draft/publish, enrollments, runs, retries, failures/dead letters, limits, attribution, and audit history.

## Campaigns

Internal views:

1. Overview
2. Campaigns
3. Email Templates
4. SMS Templates
5. Quick Templates
6. Reports
7. Message Queue

Observed patterns included agent/campaign/date filters, create/export actions, product folders, template counts, empty campaign/report states, queue status/error fields, and source/conversion metrics. Phase 1 must implement functional audience snapshots, durable scheduling/queueing, suppression, consent, test-destination delivery callbacks, attribution and replay-safe reporting. Phase 2 adds production credentials, security/compliance approval, capacity, cost controls, observability and recovery.

Commercial email must meet applicable rules such as the [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business); this link is planning input, not legal certification.

## Forms

- Forms and submissions tabs; product folders and synthetic active form counts.
- Existing builder with editable name, autosave, preview, copy URL, AI assist, save.
- Field palette included identity, address, text, choices, media/file, number, signature, list, and submit controls.
- Settings covered submit action/message, post-submit behavior, CRM field mapping/overwrite, conditional logic, multi-step, consent, metadata, and legal links.
- Submissions supported search/export and showed an empty state.

Required model: versioned form schema, safe hosted URL, field registry, autosave/draft/publish, response store, field mapping and overwrite policy, conditional/multi-step logic, consent provenance, legal-version capture, metadata policy, upload controls, export jobs, and audit history.

An older audit saw Forms stuck loading; current evidence supersedes it with a rendered list, folders, builder, settings, and submissions.
