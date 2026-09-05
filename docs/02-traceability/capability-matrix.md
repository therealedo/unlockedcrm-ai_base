# Capability matrix

This is the source of truth for implementation coverage. Status describes the **current local boundary**, not the live vendor, target architecture, or production readiness. Owned-workflow and external-provider status must be recorded separately when they differ.

Legend: `LV` = `LIVE-VERIFIED`, `LO` = `LOCAL-VERIFIED`, `PV` = `PRIOR-VERIFIED`, `G` = `GATED`, `I` = `INFERRED`.

## All 32 registered local paths

| Capability ID | Route/effective screen | Local status | Evidence | Target phase | Next proof |
|---|---|---|---|---|---|
| `CAP-CRM-001` | `/` Home | `PARTIAL` | `LO` | Phase 1 | Derive every widget from shared synthetic records |
| `CAP-CRM-002` | `/dashboard` Dashboard | `PARTIAL` | `LO`,`LV` | Phase 1 | Match live widget hierarchy and cross-record metrics |
| `CAP-AI-001` | `/unlocked-ai` | `MOCK` | `LO`,`LV` | Phase 1 complete simulated workflow; Phase 2 selected real provider/hardening | Nested shell/history/insights/permissions tests |
| `CAP-CRM-003` | `/inbox` | `MOCK` | `LO`,`LV` | Phase 1 functional threads with simulated channels; Phase 2 selected real providers/hardening | Thread/dialog/channel synthetic interaction suite |
| `CAP-CRM-004` | `/contacts` | `PARTIAL` | `LO`,`LV` | Phase 1 | Detail workspace, edit/delete, imports and graph projections |
| `CAP-CRM-005` | `/pipeline` | `PARTIAL` | `LO`,`LV` | Phase 1 | Existing detail, stage transitions, validation and history |
| `CAP-CRM-006` | `/calendar` | `PARTIAL` | `LO`,`LV`,`G` | Phase 1 functional internal calendar + simulated sync; Phase 2 selected real provider/hardening | Connection/setup/error states and adapter contract |
| `CAP-AI-002` | `/agent-ai` | `MOCK` | `LO`,`LV`,`G` | Phase 1 complete simulated voice workflow; Phase 2 selected real providers/hardening | Voice/phone/compliance step states without external calls |
| `CAP-AUTO-001` | `/automations` | `MOCK` | `LO`,`LV` | Phase 1 functional local runtime; Phase 2 hardening | Builder/settings/enrollment/log/analytics state suite |
| `CAP-AI-003` | `/ai-quoting` | `MOCK` | `LO`,`LV` | Phase 1 complete simulated assistant workflow; Phase 2 selected real provider/hardening | Product-specific simulated assistants and synthetic histories |
| `CAP-AI-004` | `/underwriting` | `MOCK` | `LO`,`LV` | Phase 1 complete simulated assessment workflow; Phase 2 selected real provider/hardening | Contact-aware synthetic assessments and provenance |
| `CAP-AI-005` | `/underwrite-ai` alias | `MOCK` | `LO`,`PV` | Phase 1 | Decide/test local alias and document live legacy behavior |
| `CAP-AUTO-002` | `/campaigns` | `MOCK` | `LO`,`LV` | Phase 1 functional local runtime; Phase 2 hardening | All seven nested views with deterministic events |
| `CAP-AUTO-003` | `/forms` | `MOCK` | `LO`,`LV` | Phase 1 functional local hosting; Phase 2 hardening | Builder/settings/submission state and schema tests |
| `CAP-BIZ-001` | `/policies` | `PARTIAL` | `LO`,`LV`,`G` | Phase 1 | Detail/category forms/six workspaces |
| `CAP-BIZ-002` | `/commissions` | `PARTIAL` | `LO`,`LV`,`PV` | Phase 1 functional local ledger/import; Phase 2 hardening | Validation, statements, matching, splits, reconciliation |
| `CAP-CRM-007` | `/tasks` | `PARTIAL` | `LO`,`LV` | Phase 1 | Detail/edit/delete/comments/files/activity |
| `CAP-BIZ-003` | `/booking-links` | `PARTIAL` | `LO`,`LV` | Phase 1 functional local booking + simulated calendar; Phase 2 selected real provider/hardening | Round-robin, submissions and calendar-backed booking |
| `CAP-BIZ-004` | `/analytics` | `PARTIAL` | `LO`,`LV` | Phase 1 functional; Phase 2 hardening | Eleven event-derived views and report state |
| `CAP-BIZ-005` | `/documents` | `MOCK` | `LO`,`LV` | Phase 1 functional local object storage; Phase 2 hardening | Folder/file/E&O states then secure storage/OCR |
| `CAP-COMMS-001` | `/phone-system` | `MOCK` | `LO`,`LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Thirteen nested views and deterministic synthetic event lifecycle |
| `CAP-COMMS-002` | `/email-services` | `MOCK` | `LO`,`LV`,`G` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapters/hardening | Nine nested views and personal/bulk separation |
| `CAP-QUOTE-001` | `/quoting` | `MOCK` | `LO`,`LV` | Phase 1 complete normalized quote simulator; Phase 2 selected real data/providers | Product-specific steppers/results/saved histories |
| `CAP-INS-001` | `/life` | `MOCK` | `LO`,`LV`,`G` | Phase 1 complete simulated product workflow; Phase 2 selected real providers | Overview/quote/saved/underwriting/AI states |
| `CAP-INS-002` | `/medicare` | `MOCK` | `LO`,`LV` | Phase 1 owned rules/public-data + simulated providers; Phase 2 selected real integrations | All verified subviews and data provenance |
| `CAP-INS-003` | `/aca-marketplace` | `MOCK` | `LO`,`LV` | Phase 1 owned rules + simulated marketplace workflow; Phase 2 selected real integrations | Funnel/leads/eligibility/insights/exports/marketing |
| `CAP-BIZ-006` | `/commission-plus` | `MOCK` | `LO`,`LV`,`G` | Phase 1 complete simulated sync/reconciliation; Phase 2 selected real integration | Activation boundary and synthetic sync/reconciliation |
| `CAP-ADMIN-001` | `/settings` | `MOCK` | `LO`,`LV`,`G` | Phase 1 functional single-workspace settings + simulated connections; Phase 2 production hardening | Settings hierarchy and every verified/gated state |
| `CAP-ADMIN-002` | `/agency` | `MOCK` | `LO`,`LV` | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Agency workspace synthetic navigation/data |
| `CAP-ADMIN-003` | `/imo-fmo` alias | `MOCK` | `LO`,`LV` | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Alias/navigation and hierarchy fixture tests |
| `CAP-ADMIN-004` | `/org/dashboard` | `MOCK` | `LO`,`LV` | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Organization switcher/directories/production/reports |
| `CAP-ADMIN-005` | `/more` | `PARTIAL` | `LO`,`LV` | Phase 1 | Drawer destinations and distinct empty/setup states |

## Global shell and cross-cutting surfaces

| Capability ID | Capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-SHELL-001` | Product rail and contextual navigation | `PARTIAL` | `LO`,`LV` | Phase 1 | Route/selection/collapse/responsive visual tests |
| `CAP-SHELL-002` | Search across CRM | `PARTIAL` | `LO`,`LV` | Phase 1 | Index all synthetic record families and keyboard states |
| `CAP-SHELL-003` | Navigation customization | `PARTIAL` | `LO`,`LV` | Phase 1 | Persist Rail/Menu/More/Hidden and reset behavior |
| `CAP-SHELL-004` | Density and appearance | `PARTIAL` | `LO`,`LV` | Phase 1 | Persist density/icon modes and assert all breakpoints |
| `CAP-SHELL-005` | Notifications | `MOCK` | `LO`,`LV` | Phase 1 functional local events; Phase 2 hardening | Synthetic 47-event taxonomy and channel preferences |
| `CAP-SHELL-006` | User/support/AI/Voice overlays | `MOCK` | `LO`,`LV` | Phase 1 functional local workflows | Scoped dialogs, launchers, actions and duplicate-label-safe tests |
| `CAP-SHELL-007` | Loading/empty/error/setup/soon states | `PARTIAL` | `LO`,`LV`,`G` | Phase 1 | State catalog plus deterministic route tests |

## Core CRM nested capabilities

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-CRM-101` | Dashboard composer/suggestions/activity/meetings/tasks | `PARTIAL` | `LO`,`LV` | Phase 1 | Shared-record projection tests |
| `CAP-CRM-102` | Inbox list tabs/search/filter/sort | `MOCK` | `LO`,`LV` | Phase 1 | Deterministic empty/populated list states |
| `CAP-CRM-103` | Inbox selected thread and new-conversation dialog | `MOCK` | `LO`,`LV` | Phase 1 | Contact search, channel composer and draft states |
| `CAP-CRM-104` | Contact list/subviews/filter/columns/pagination | `PARTIAL` | `LO`,`LV` | Phase 1 | All controls and responsive table tests |
| `CAP-CRM-105` | Product-specific contact creation | `PARTIAL` | `LO`,`LV` | Phase 1 | ACA/Medicare/Life/generic validation tests |
| `CAP-CRM-106` | Contact detail workspace and tabs | `MISSING` | `LV` | Phase 1 | Synthetic detail graph, actions, sections and tabs |
| `CAP-CRM-107` | Connection score/DND/lead score | `MISSING` | `LV`,`I` | Phase 1 model; Phase 2 policy | Explainable synthetic score and preference tests |
| `CAP-CRM-108` | Pipeline board/table/stages | `PARTIAL` | `LO`,`LV` | Phase 1 | Stage/action/history and table consistency |
| `CAP-CRM-109` | Opportunity create/detail | `PARTIAL` | `LO`,`LV`,`G` | Phase 1 | Existing-detail recheck plus edit/validation tests |
| `CAP-CRM-110` | Calendar grid/table | `PARTIAL` | `LO`,`LV` | Phase 1 | Week navigation, timezone and populated state |
| `CAP-CRM-111` | Appointment creation/connection gate | `PARTIAL` | `LO`,`LV`,`G` | Phase 1 functional; Phase 2 hardening | Disabled/configured/error state contract |
| `CAP-CRM-112` | Tasks board/list/create | `PARTIAL` | `LO`,`LV` | Phase 1 | Status/priority/assignee and persistence tests |
| `CAP-CRM-113` | Task detail/files/comments/activity | `MISSING` | `LV` | Phase 1 functional local files; Phase 2 hardening | Full detail behavior with synthetic audit trail |

## Business-record nested capabilities

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-BIZ-101` | Policy list/filter/search/import/export | `PARTIAL` | `LO`,`LV` | Phase 1 functional local jobs; Phase 2 hardening | Complete controls with working synthetic import/export jobs |
| `CAP-BIZ-102` | Policy detail/edit/ownership/coverage/commission | `MISSING` | `LV` | Phase 1 | Conditional detail sections and relationship tests |
| `CAP-BIZ-103` | Category-specific policy creation | `PARTIAL` | `LO`,`LV` | Phase 1 | Life/health/annuity/other schemas and validation |
| `CAP-BIZ-104` | Applications workspace | `MISSING` | `LV` | Phase 1 | Empty/populated/source/status states |
| `CAP-BIZ-105` | Enrollments workspace | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Metrics/filter/table and synthetic events |
| `CAP-BIZ-106` | Renewal dashboard | `MISSING` | `LV` | Phase 1 | Date-driven urgency/progress tests |
| `CAP-BIZ-107` | Book of Business | `BLOCKED` | `G` | Phase 1 | Safe live recheck; meanwhile preserve gated state |
| `CAP-BIZ-108` | Cross-sell analysis | `MISSING` | `LV`,`I` | Phase 1 | Explainable synthetic gaps/opportunities |
| `CAP-BIZ-109` | Commission KPIs/filters/ledger | `PARTIAL` | `LO`,`LV` | Phase 1 | Derived metrics and validation |
| `CAP-BIZ-110` | Commission statements/matching/splits | `MISSING` | `I` | Phase 1 functional synthetic import + sync simulator; Phase 2 selected real sync/hardening | Immutable reconciliation ledger and exception tests |
| `CAP-BIZ-111` | Booking filters/folders/submissions | `PARTIAL` | `LO`,`LV` | Phase 1 | Folder and submission state tests |
| `CAP-BIZ-112` | Personal/round-robin booking setup | `PARTIAL` | `LO`,`LV` | Phase 1 functional; Phase 2 hardening | Scheduling rules and booking lifecycle with simulated calendar boundary |
| `CAP-BIZ-113` | Analytics Overview | `PARTIAL` | `LO`,`LV` | Phase 1 | Event-derived cross-record metrics |
| `CAP-BIZ-114` | Calls/Dispositions/Email/SMS/Appts analytics | `MISSING` | `LV` | Phase 1 functional local events; Phase 2 hardening | Five synthetic channel projections |
| `CAP-BIZ-115` | Agents/Marketing/Sources analytics | `MISSING` | `LV` | Phase 1 | Synthetic attribution and performance fixtures |
| `CAP-BIZ-116` | Analytics Audit/Report Builder | `MISSING` | `LV` | Phase 1 functional local event store; Phase 2 hardening | Searchable events and saved report fixtures |
| `CAP-BIZ-117` | Document folders/table/filter | `MOCK` | `LO`,`LV` | Phase 1 | Full local synthetic file/object lifecycle and filter states |
| `CAP-BIZ-118` | Upload/download/version/relationships | `MISSING` | `LV`,`I` | Phase 1 functional local object service; Phase 2 hardening | Object lifecycle/scanning first, then production authorization/audit/recovery |
| `CAP-BIZ-119` | E&O upload/extraction | `MOCK` | `LO`,`LV` | Phase 1 functional local objects + extraction simulator; Phase 2 selected real OCR/hardening | Deterministic extraction with provenance, review and retention proof |
| `CAP-BIZ-120` | Commission+ activation and sync | `BLOCKED` | `LV`,`G` | Phase 1 functional; Phase 2 hardening | Synthetic activation/sync states; no live activation |

## Current external-provider boundaries

These statuses describe provider connectivity, not the surrounding owned workflow. Phase 1 requires the deterministic simulator/port column; Phase 2 selects and hardens only needed real providers.

| Provider boundary | Current status | Phase 1 target | Phase 2 target |
|---|---|---|---|
| Phone/SMS transport and callbacks | `MISSING` | Provider-neutral call/message simulator, contract tests, synthetic audit/events | Approved real telephony/SMS adapter |
| Personal/bulk email delivery | `MISSING` | Thread/delivery/bounce/suppression simulator | Approved mailbox and delivery adapters |
| Third-party calendar sync | `MISSING` | Calendar connection/sync/conflict simulator | Approved Google/Microsoft or selected provider |
| Quote/enrollment/carrier feeds | `MISSING` | Versioned normalized result/lifecycle simulators; lawful public data may remain real | Approved licensed/provider integrations |
| Commission+ or carrier synchronization | `MISSING` | Statement/sync/reconciliation simulator | Approved carrier/aggregator integrations |
| AI/voice inference | `MISSING` | Deterministic model/tool/voice simulator | Approved model/voice providers |
| Managed OCR/extraction | `MISSING` | Deterministic extraction adapter over synthetic objects | Approved local or managed extraction provider |

## Phone and email nested capabilities

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-COMMS-101` | Phone Numbers/pools/verified IDs | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Empty/setup/pending/active states |
| `CAP-COMMS-102` | Power Dialer | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Synthetic session, keyboard, skip and disposition tests |
| `CAP-COMMS-103` | AI receptionist profiles | `MISSING` | `LV` | Phase 1 complete simulated AI/phone workflow; Phase 2 selected real providers/hardening | Five-step setup and disabled/active states |
| `CAP-COMMS-104` | Messaging compliance/analytics/restrictions | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Synthetic opt-out/restriction lifecycle |
| `CAP-COMMS-105` | AI Auto-Reply | `MISSING` | `LV` | Phase 1 functional development approvals; Phase 2 hardening | Disabled/review/send-policy states |
| `CAP-COMMS-106` | Scripts/dispositions/folders | `MISSING` | `LV` | Phase 1 | Folder/search/type/create/edit tests |
| `CAP-COMMS-107` | Voice recording/transcription/forwarding/SIP | `MISSING` | `LV`,`I` | Phase 1 complete consent-aware simulator; Phase 2 selected real provider/legal hardening | Consent, retention, adapter and audit gates |
| `CAP-COMMS-108` | Call Identity contact card | `MISSING` | `LV` | Phase 1 complete delivery simulator; Phase 2 selected real provider/hardening | Asset validation, caller-ID match and metrics |
| `CAP-COMMS-109` | Call Recordings/coaching/export | `MISSING` | `LV` | Phase 1 functional local object storage; Phase 2 hardening | Filter/playback/access/export state tests |
| `CAP-COMMS-110` | Voicemail greetings/drops/inbox | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Synthetic messages/transcripts/status |
| `CAP-COMMS-111` | A2P Trust Center | `MISSING` | `LV`,`I` | Phase 1 complete compliance-state simulator; Phase 2 selected real provider/hardening | Brand/campaign/number registration state machine |
| `CAP-COMMS-112` | Phone analytics | `MISSING` | `LV` | Phase 1 | Derived synthetic call metrics |
| `CAP-COMMS-113` | Phone settings | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | Validation, quiet-hours and routing tests |
| `CAP-COMMS-201` | Email delivery setup | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Domain/DNS verification state machine |
| `CAP-COMMS-202` | Dedicated Domain | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Empty/pending/verified/failing states |
| `CAP-COMMS-203` | Dedicated IP | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Request/warmup/reputation lifecycle |
| `CAP-COMMS-204` | SMTP services | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Masked configuration, verify and delivery events |
| `CAP-COMMS-205` | Gmail SMTP | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Secret-safe validation and revocation |
| `CAP-COMMS-206` | Reply & Forward | `BLOCKED` | `G` | Phase 1 | Safe recheck; render explicit unavailable state |
| `CAP-COMMS-207` | Email analytics | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Synthetic events then provider reconciliation |
| `CAP-COMMS-208` | Reputation/risk/Postmaster | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Health state and connection lifecycle |
| `CAP-COMMS-209` | Bounce/complaint/unsubscribe | `MISSING` | `LV`,`I` | Phase 1 complete callback simulator; Phase 2 selected real provider/hardening | Suppression and callback idempotency tests |

## Quoting, Life, Medicare, and ACA nested capabilities

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-QUOTE-101` | Quoting product hub | `MOCK` | `LO`,`LV` | Phase 1 | Product cards, disabled/upgrading/setup states |
| `CAP-QUOTE-102` | Life quote inputs/results | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Full synthetic input/result normalization tests |
| `CAP-QUOTE-103` | Saved life quotes | `MISSING` | `LV` | Phase 1 | Search/filter/status/history fixtures |
| `CAP-QUOTE-104` | Medicare Advantage quoter | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | ZIP/county/filter/result fixtures |
| `CAP-QUOTE-105` | MAPD quoter | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | Drug/provider/cost result fixtures |
| `CAP-QUOTE-106` | Part D quoter | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | Drug/cost plan fixtures |
| `CAP-QUOTE-107` | ACA quote stepper | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | Seven-step synthetic flow and validation |
| `CAP-QUOTE-108` | Private plans stepper | `MISSING` | `LV` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Three-step flow and disclosure state |
| `CAP-QUOTE-109` | Annuity/Medigap upgrading states | `BLOCKED` | `G` | Phase 1 | Preserve Soon/upgrading; await direct evidence |
| `CAP-INS-101` | Life overview | `MOCK` | `LO`,`LV` | Phase 1 | Link/quote pipeline and synthetic metrics |
| `CAP-INS-102` | Life Underwriting AI | `MISSING` | `LV` | Phase 1 complete simulated AI workflow; Phase 2 selected real provider/hardening | Contact/assessment/carrier history and disclaimer |
| `CAP-INS-103` | Life AI | `MISSING` | `LV` | Phase 1 complete simulated AI/quote workflow; Phase 2 selected real providers/hardening | Conversational synthetic quote history |
| `CAP-INS-104` | Life Marketing | `BLOCKED` | `G` | Phase 1 | Soon state only |
| `CAP-INS-201` | Medicare Overview | `MOCK` | `LO`,`LV` | Phase 1 | Enrollment-season and synthetic KPI logic |
| `CAP-INS-202` | T65 Pipeline | `MISSING` | `LV` | Phase 1 | DOB-driven buckets and missing-DOB states |
| `CAP-INS-203` | Medicare Quote chooser | `MISSING` | `LV` | Phase 1 | Product/AI routing tests |
| `CAP-INS-204` | HealthSherpa connection/enrollments/reporting | `MISSING` | `LV`,`G` | Phase 1 complete provider-neutral simulator; Phase 2 selected real adapter/hardening | Disconnected/synthetic events then approved API/webhook |
| `CAP-INS-205` | Medicare eligibility | `MISSING` | `LV`,`I` | Phase 1 functional local rules; Phase 2 hardening | Versioned rule provenance and boundary tests |
| `CAP-INS-206` | Doctor search/NPPES | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | Local public-data import/search/update tests |
| `CAP-INS-207` | Scope of Appointment | `MISSING` | `LV` | Phase 1 functional local workflow; Phase 2 hardening | Form/booking/link/status/audit fixtures |
| `CAP-INS-208` | Annual Reviews/PDF | `MISSING` | `LV` | Phase 1 functional local documents; Phase 2 hardening | Renewal/gap/urgency and generated-doc audit |
| `CAP-INS-209` | CMS Rules | `MISSING` | `LV`,`I` | Phase 1 functional local rules; Phase 2 hardening | Versioned inputs/results/history tests |
| `CAP-INS-210` | Medicare Marketing | `MISSING` | `LV` | Phase 1 complete communications simulator; Phase 2 selected real provider/hardening | Intake/branding/source attribution and consent |
| `CAP-INS-211` | Medicare AI | `MISSING` | `LV` | Phase 1 complete simulated AI workflow; Phase 2 selected real provider/hardening | Product-context synthetic conversations |
| `CAP-INS-301` | ACA Overview/funnel | `MOCK` | `LO`,`LV` | Phase 1 | Shared lead/quote/enrollment projection |
| `CAP-INS-302` | ACA leads/contacts | `MOCK` | `LO`,`LV` | Phase 1 | Source/status/state/subsidy filter tests |
| `CAP-INS-303` | ACA eligibility/Medicare transition | `MISSING` | `LV`,`I` | Phase 1 functional; Phase 2 hardening | Date/rule transition and audit tests |
| `CAP-INS-304` | ACA saved quotes | `MISSING` | `LV` | Phase 1 | Empty/populated/filter/history states |
| `CAP-INS-305` | ACA insights | `MISSING` | `LV` | Phase 1 | Funnel/subsidy/tier/state projections |
| `CAP-INS-306` | ACA exports/history | `MISSING` | `LV` | Phase 1 functional local jobs; Phase 2 hardening | Async authorized export fixtures/history |
| `CAP-INS-307` | ACA marketing | `MISSING` | `LV` | Phase 1 complete communications simulator; Phase 2 selected real provider/hardening | Branded link/templates/source/consent states |
| `CAP-INS-308` | ACA AI | `MISSING` | `LV` | Phase 1 complete simulated AI workflow; Phase 2 selected real provider/hardening | Product-context synthetic conversations |

## AI, automation, campaigns, and forms nested capabilities

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-AI-101` | AI inner sidebar/history/search/pins | `MISSING` | `LV` | Phase 1 | Deterministic conversation navigation |
| `CAP-AI-102` | AI composer modes/contact context | `MOCK` | `LO`,`LV` | Phase 1 complete simulated AI provider boundary | Mode/output/tool-request states through the development provider path |
| `CAP-AI-103` | AI Insights | `MISSING` | `LV` | Phase 1 | Usage/voice/personalization/transform fixtures |
| `CAP-AI-104` | 53-action permission matrix | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | Search/bulk/per-action UI then server policy tests |
| `CAP-AI-105` | Build prompt/templates/artifacts | `MISSING` | `LV`,`I` | Phase 1 | Safe typed artifact schema and preview tests |
| `CAP-AI-106` | Agent AI voice setup | `MOCK` | `LO`,`LV` | Phase 1 | Profile/preview/record/upload validation fixtures |
| `CAP-AI-107` | Agent AI phone/compliance setup | `BLOCKED` | `G` | Phase 1 | Preserve gated steps; seek safe direct evidence |
| `CAP-AI-108` | Underwriting assessments/carriers/history | `MISSING` | `LV` | Phase 1 complete simulated engine workflow; Phase 2 selected real provider/hardening | Synthetic assessment/provenance/disclaimer tests |
| `CAP-AUTO-101` | Automation list/folders/status/filter | `MOCK` | `LO`,`LV` | Phase 1 | Eight workflow fixtures and folder states |
| `CAP-AUTO-102` | Workflow graph builder | `MISSING` | `LV` | Phase 1 | Trigger/action/wait/end editing and version tests |
| `CAP-AUTO-103` | Workflow settings | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | Re-entry/exits/timezone/window/sender/limit tests |
| `CAP-AUTO-104` | Workflow enrollment | `MISSING` | `LV` | Phase 1 functional local runtime; Phase 2 hardening | Filter/status/current/next execution fixtures |
| `CAP-AUTO-105` | Workflow logs | `MISSING` | `LV` | Phase 1 functional local runtime; Phase 2 hardening | Success/failure/retry synthetic events |
| `CAP-AUTO-106` | Workflow analytics/attribution | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Event-derived health/revenue attribution |
| `CAP-AUTO-201` | Campaign Overview | `MOCK` | `LO`,`LV` | Phase 1 | Performance/health/engagement state fixtures |
| `CAP-AUTO-202` | Campaign list/create | `MISSING` | `LV` | Phase 1 | Draft/scheduled/running/complete states |
| `CAP-AUTO-203` | Email/SMS template folders | `MISSING` | `LV` | Phase 1 | Folder/search/create/edit/version tests |
| `CAP-AUTO-204` | Quick Templates | `MISSING` | `LV` | Phase 1 | Personal shortcut/create/edit tests |
| `CAP-AUTO-205` | Campaign Reports | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Synthetic delivery/conversion projection |
| `CAP-AUTO-206` | Message Queue | `MISSING` | `LV` | Phase 1 functional local jobs; Phase 2 hardening | Queue/status/error/cancel/retry fixtures |
| `CAP-AUTO-301` | Forms list/folders | `MOCK` | `LO`,`LV` | Phase 1 | Product folders/count/filter states |
| `CAP-AUTO-302` | Form builder/palette/autosave/preview | `MISSING` | `LV` | Phase 1 | Versioned schema editing and autosave tests |
| `CAP-AUTO-303` | Form settings/mapping/logic/consent | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | Mapping/overwrite/logic/legal-version tests |
| `CAP-AUTO-304` | Form submissions/export | `MISSING` | `LV` | Phase 1 functional local endpoint with simulated provider; Phase 2 hosted hardening | Synthetic responses then secure hosted/export jobs |

## Settings nested capabilities

| Capability ID | Settings surface | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-ADMIN-101` | My Profile | `MISSING` | `LV` | Phase 1 functional development identity; Phase 2 hardening | Redacted profile/signature/security states |
| `CAP-ADMIN-102` | Business Profile | `BLOCKED` | `G` | Phase 1 | Preserve blank/gated; safe recheck |
| `CAP-ADMIN-103` | Billing Overview/Wallet/Usage | `MISSING` | `LV` | Phase 1 functional synthetic ledger; Phase 3 production billing | Synthetic plan/wallet/rate/transaction states |
| `CAP-ADMIN-104` | My Team | `MISSING` | `LV` | Phase 1 functional team/role workflow; Phase 2 production enforcement; Phase 3 tenant hardening | Roles/seats/table/invite states without sending |
| `CAP-ADMIN-105` | Access Levels | `BLOCKED` | `G`,`PV` | Phase 1 | Safe recheck role taxonomy |
| `CAP-ADMIN-106` | White Label | `MISSING` | `LV` | Phase 1 functional local customization; Phase 3 original public branding | Original preview plus assisted domain state |
| `CAP-ADMIN-107` | Integrations | `BLOCKED` | `G` | Phase 1 | Adapter-neutral empty/gated state; safe recheck |
| `CAP-ADMIN-108` | Opportunities & Pipelines settings | `MISSING` | `LV` | Phase 1 | Stage/order/probability/default tests |
| `CAP-ADMIN-109` | Calendars settings/availability | `MISSING` | `LV` | Phase 1 complete provider-neutral simulators; Phase 2 selected real adapters/hardening | Connection/sync/availability state tests |
| `CAP-ADMIN-110` | Booking Links settings | `MISSING` | `LV` | Phase 1 | Filters/folders/submissions/create states |
| `CAP-ADMIN-111` | My Carriers | `MISSING` | `LV` | Phase 1 | Selection/filter visibility semantics |
| `CAP-ADMIN-112` | Agency Carrier Rules | `BLOCKED` | `G` | Phase 1 | Preserve gated state; safe recheck |
| `CAP-ADMIN-113` | Carrier Compensation | `MISSING` | `LV` | Phase 1 owned rules/public-data or simulator; Phase 2 selected real provider/hardening | Rate/version/effective-date fixtures |
| `CAP-ADMIN-114` | Security | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | MFA/password/login activity states |
| `CAP-ADMIN-115` | AI Permissions | `MISSING` | `LV` | Phase 1 functional development enforcement; Phase 2 hardening | 53-action two-context policy tests |
| `CAP-ADMIN-116` | Recordings | `MISSING` | `LV` | Phase 1 functional local files + extraction simulator; Phase 2 selected real adapters/hardening | Source/filter/sync/access states |
| `CAP-ADMIN-117` | Notifications | `MISSING` | `LV` | Phase 1 functional local events; Phase 2 hardening | 47-event channel taxonomy and preference tests |
| `CAP-ADMIN-118` | Audit Logs | `MISSING` | `LV`,`I` | Phase 1 functional local event store; Phase 2 hardening | Search/filter/export events then tamper/retention evidence |
| `CAP-ADMIN-119` | Custom Fields/Product Types | `MISSING` | `LV` | Phase 1 functional; Phase 2 hardening | Sections/fields/types/conditional display/version tests |
| `CAP-ADMIN-120` | Custom Values | `MISSING` | `LV` | Phase 1 | Merge tag/override/test states |
| `CAP-ADMIN-121` | Tags | `MISSING` | `LV` | Phase 1 | CRUD/usage/filter tests |
| `CAP-ADMIN-122` | Manage Scoring | `MISSING` | `LV` | Phase 1 | Point/threshold/explanation fixtures |
| `CAP-ADMIN-123` | Record Pages | `BLOCKED` | `G` | Phase 1 | Preserve blank/gated; safe recheck |
| `CAP-ADMIN-124` | Developer Portal | `MISSING` | `LV` | Phase 1 functional local API/resources; Phase 2 hardening | Neutral resource entry points and working development API |
| `CAP-ADMIN-125` | API Keys | `BLOCKED` | `G` | Phase 1 synthetic key contract; Phase 2 production hardening | Scoped hashed key lifecycle and audit, no live inspection |
| `CAP-ADMIN-126` | API Documentation | `MISSING` | `LV` | Phase 1 functional local API docs; Phase 2 hardening | Generated neutral API docs with auth/error schemas |
| `CAP-ADMIN-127` | MCP Server | `MISSING` | `LV` | Phase 1 functional local MCP; Phase 2/3 hardening | Scoped tool/resource model and approval tests |
| `CAP-ADMIN-128` | OAuth Apps | `BLOCKED` | `G` | Phase 1 local contract/simulator; Phase 2 real integration hardening; Phase 3 public OAuth | Secure registration/consent/token/revocation model |
| `CAP-ADMIN-129` | Webhooks | `BLOCKED` | `G` | Phase 1 local webhook simulator; Phase 2 production hardening | Signed, replay-safe subscription/delivery lifecycle |
| `CAP-ADMIN-130` | SDKs | `MISSING` | `LV` | Phase 1 functional local SDK; Phase 2 hardening/versioning | Generated clients, version policy and examples |
| `CAP-ADMIN-131` | Privacy summary | `MISSING` | `LV` | Phase 3 | Original counsel-approved notice |
| `CAP-ADMIN-132` | Terms summary | `MISSING` | `LV` | Phase 3 | Original counsel-approved terms |
| `CAP-ADMIN-133` | DPA summary | `MISSING` | `LV` | Phase 3 | Original counsel-approved DPA |
| `CAP-ADMIN-134` | BAA request/status | `MISSING` | `LV`,`I` | Phase 1 functional local contract; Phase 2/3 hardening | Counsel/vendor program and agreement lifecycle |

## Agency, organization, and secondary administration

| Capability ID | Nested capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-ADMIN-201` | Agency Dashboard | `MOCK` | `LO`,`LV` | Phase 1 | Synthetic KPI/hierarchy/communications/pipeline |
| `CAP-ADMIN-202` | Live Call Wallboard | `MISSING` | `LV` | Phase 1 functional local realtime simulation; Phase 3 scalable realtime hardening | Five-second queue/call/agent/TV fixtures |
| `CAP-ADMIN-203` | Team/Groups/Hierarchy/Reassignment | `MISSING` | `LV` | Phase 1 functional synthetic/local scope; Phase 3 tenancy hardening | Synthetic directories and permission-aware actions |
| `CAP-ADMIN-204` | Sub-Agencies and Agents | `MISSING` | `LV` | Phase 1 functional synthetic/local scope; Phase 3 tenancy hardening | Hierarchy/upload/create/validation fixtures |
| `CAP-ADMIN-205` | Lead Flow | `MISSING` | `LV` | Phase 1 functional local jobs; Phase 3 SaaS hardening | Round-robin/cap/state/rotation/history tests |
| `CAP-ADMIN-206` | Recruiting/Downlines | `MISSING` | `LV` | Phase 1 functional synthetic/local scope; Phase 3 tenancy hardening | Workbench/pipeline/contact fixtures |
| `CAP-ADMIN-207` | Performance | `MISSING` | `LV` | Phase 1 | Leaderboard/channel/pipeline/report/target fixtures |
| `CAP-ADMIN-208` | Agency Book of Business | `MISSING` | `LV` | Phase 1 functional local; Phase 3 SaaS hardening | Portfolio/retention/product/reassignment fixtures |
| `CAP-ADMIN-209` | Operations/licensing/E&O | `MISSING` | `LV` | Phase 1 functional synthetic governance; Phase 3 operational hardening | Resource/expiry/status fixtures |
| `CAP-ADMIN-210` | Complaints & Audit | `MISSING` | `LV` | Phase 1 functional synthetic operations; Phase 3 hardening | Working complaint lifecycle/filter/export/audit on synthetic data |
| `CAP-ADMIN-211` | Organization switcher/dashboard | `MOCK` | `LO`,`LV` | Phase 1 functional local scope; Phase 3 tenancy hardening | Synthetic scope switching and negative visibility tests |
| `CAP-ADMIN-212` | Organizations/Agencies/Sub-Agencies/Agents | `MISSING` | `LV` | Phase 1 functional synthetic directories; Phase 3 tenancy hardening | Four working directory/hierarchy/upload/create views |
| `CAP-ADMIN-213` | Organization Production | `MISSING` | `LV` | Phase 1 functional local; Phase 3 SaaS hardening | Policies/commissions/metrics projections |
| `CAP-ADMIN-214` | Carrier Relationships/Contracts | `MISSING` | `LV`,`G` | Phase 1 functional synthetic/local operations; Phase 3 SaaS hardening | Contract fixtures and Soon state |
| `CAP-ADMIN-215` | Organization Reports | `MISSING` | `LV` | Phase 1 functional local jobs; Phase 3 SaaS hardening | Production/roster/policy/commission/appointment reports |
| `CAP-ADMIN-216` | More destinations | `PARTIAL` | `LO`,`LV` | Phase 1 | Integrations/portals/carriers/analyzer distinct states |
| `CAP-ADMIN-217` | Earn/affiliate | `MISSING` | `LV` | Phase 3 | Original referral program/ledger if selected |
| `CAP-ADMIN-218` | Support center/tickets/status/content | `MISSING` | `LV` | Phase 1 functional local contract; Phase 2/3 hardening | Original support workflows and incident status |
| `CAP-ADMIN-219` | User menu/account actions | `MOCK` | `LO`,`LV` | Phase 1 functional development identity; Phase 2 hardening | Redacted status/profile/wallet/help/sign-out states |

## Platform capabilities required before real use

| Capability ID | Capability | Local status | Evidence | Target | Next proof |
|---|---|---|---|---|---|
| `CAP-PLAT-001` | Request identity, authentication/session/MFA/recovery | `MISSING` | `LO`,`I` | Phase 1 centralized synthetic request identity; Phase 2 production auth/MFA | Request-context tests first, then threat model and secure auth tests |
| `CAP-PLAT-002` | Authorization context, fixed roles and record ownership | `MISSING` | `LO`,`LV`,`I` | Phase 1 centralized synthetic policy context; Phase 2 fixed-role enforcement | Workspace/ownership scope tests, then production negative authorization |
| `CAP-PLAT-003` | PostgreSQL durable data/migrations | `MISSING` | `LO`,`I` | Phase 1 development-grade persistence; Phase 2 hardening | Schema/migration/transaction/restore tests |
| `CAP-PLAT-004` | Workspace ownership seam / tenant isolation | `MISSING` | `LO`,`LV`,`I` | Phase 1 one-workspace `workspace_id` scope; Phase 3 tenant isolation | Workspace constraints now; cross-tenant negative tests only in clean-room SaaS |
| `CAP-PLAT-005` | Durable jobs/workflows | `MISSING` | `LO`,`I` | Phase 1 functional local runtime; Phase 2 hardening | Idempotency/retry/dead-letter/replay proof |
| `CAP-PLAT-006` | Secrets/configuration | `MISSING` | `LO`,`I` | Phase 1 externalized development config; Phase 2 secure secret rotation/hardening | Encrypted vault, rotation and log-redaction tests |
| `CAP-PLAT-007` | S3-compatible secure objects | `MISSING` | `LO`,`I` | Phase 1 development-grade local objects; Phase 2 hardening | MinIO local + production adapter and access tests |
| `CAP-PLAT-008` | Audit/analytics event store | `MISSING` | `LO`,`LV`,`I` | Phase 1 functional local events; Phase 2 hardening | Tamper-evident append/query/retention proof |
| `CAP-PLAT-009` | Observability and incident response | `MISSING` | `LO`,`I` | Phase 2 | Redacted telemetry, alerts and runbook exercise |
| `CAP-PLAT-010` | Backup/restore/export/recovery | `MISSING` | `LO`,`I` | Phase 2 | Encrypted backup and timed restore drill |
| `CAP-PLAT-011` | Signed data-first update system | `MISSING` | `LO`,`I`; point-in-time dependency audit `LOCAL-VERIFIED` | Phase 2 | Recurring dependency checks plus manifest/artifact/migration/health/rollback tests |
| `CAP-PLAT-012` | Subscription/billing/metering control plane | `MISSING` | `LO`,`LV`,`I` | Phase 3 | Separate control-plane ledger and API/event lifecycle tests; no direct product-table writes |
| `CAP-PLAT-013` | Fastify Node.js TypeScript modular-monolith REST API | `MISSING` | `LO`,`I` | Phase 1 | Fastify on Node.js 24 LTS, stable REST/JSON contracts, module boundaries and Windows start/test proof |

## Maintenance rule

Every status change requires current proof and a matching gap-register update. Phase 1 is not complete at UI parity: audited owned/core workflows must persist through the REST/API/PostgreSQL product plane. External-provider workflows may use deterministic contract-backed simulators, but their provider boundary remains `MOCK` until a real adapter is proven. Phase 2 hosts one workspace securely and enables selected real providers; Phase 3 owns the separate clean-room SaaS control plane.
