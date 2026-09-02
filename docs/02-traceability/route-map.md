# Local route map

The local registry exposes **32 paths and 30 effective screens**. `/underwrite-ai` aliases `/underwriting`; `/imo-fmo` aliases `/org/dashboard`.

## Renderer ownership

- Root `/`: `HomeScreen` in `components/crm-app.tsx:847-1023`.
- Non-root: `LiveParityRouter` in `components/live-parity-pages.tsx:375-465`.
- Do not confuse the active renderer with the unused legacy screen set at `components/crm-app.tsx:1069-2815`.

## Registered paths

| # | Capability ID | Path | Active renderer | Local status | Evidence/notes |
|---:|---|---|---|---|---|
| 1 | `CAP-CRM-001` | `/` | `HomeScreen` | `PARTIAL` | Local counts/quick actions; separate from dashboard |
| 2 | `CAP-CRM-002` | `/dashboard` | `DashboardScreen` | `PARTIAL` | Local and hard-coded summaries |
| 3 | `CAP-AI-001` | `/unlocked-ai` | `UnlockedAiScreen` | `MOCK` | No model/history/permissions backend |
| 4 | `CAP-CRM-003` | `/inbox` | `InboxScreen` | `MOCK` | No mailbox or delivery service |
| 5 | `CAP-CRM-004` | `/contacts` | `ContactsScreen` | `PARTIAL` | List/create/local persistence; no detail/edit/delete/import |
| 6 | `CAP-CRM-005` | `/pipeline` | `PipelineScreen` | `PARTIAL` | Board/table/create; no production sync/detail |
| 7 | `CAP-CRM-006` | `/calendar` | `CalendarScreen` | `PARTIAL` | Local appointment creation; no calendar adapter |
| 8 | `CAP-AI-002` | `/agent-ai` | `AgentAiScreen` | `MOCK` | Simulated setup/voice state |
| 9 | `CAP-AUTO-001` | `/automations` | `AutomationsScreen` | `MOCK` | No workflow engine |
| 10 | `CAP-AI-003` | `/ai-quoting` | `AiQuotingScreen` | `MOCK` | Product cards only |
| 11 | `CAP-AI-004` | `/underwriting` | `UnderwritingScreen` | `MOCK` | No rules/carrier/model service |
| 12 | `CAP-AI-005` | `/underwrite-ai` | `UnderwritingScreen` | `MOCK` | Alias of `/underwriting` |
| 13 | `CAP-AUTO-002` | `/campaigns` | `CampaignsScreen` | `MOCK` | No audience/delivery/metrics backend |
| 14 | `CAP-AUTO-003` | `/forms` | `FormsScreen` | `MOCK` | No hosted forms or response store |
| 15 | `CAP-BIZ-001` | `/policies` | `PoliciesScreen` | `PARTIAL` | Table/create/local persistence; no detail/carrier integration |
| 16 | `CAP-BIZ-002` | `/commissions` | `CommissionsScreen` | `PARTIAL` | Table/create/local persistence; no ingestion/reconciliation |
| 17 | `CAP-CRM-007` | `/tasks` | `TasksScreen` | `PARTIAL` | Board/list/create; no detail/edit/delete/assignment backend |
| 18 | `CAP-BIZ-003` | `/booking-links` | `BookingLinksScreen` | `PARTIAL` | Local create/list; no public endpoint/calendar sync |
| 19 | `CAP-BIZ-004` | `/analytics` | `AnalyticsScreen` | `PARTIAL` | Local/hard-coded metrics; no event/query layer |
| 20 | `CAP-BIZ-005` | `/documents` | `DocumentsScreen` | `MOCK` | No file storage/lifecycle |
| 21 | `CAP-COMMS-001` | `/phone-system` | `PhoneScreen` | `MOCK` | No telephony/SMS provider |
| 22 | `CAP-COMMS-002` | `/email-services` | `EmailScreen` | `MOCK` | No mailbox or delivery provider |
| 23 | `CAP-QUOTE-001` | `/quoting` | `QuotingScreen` | `MOCK` | Carrier connections explicitly mocked |
| 24 | `CAP-INS-001` | `/life` | `LifeScreen` | `MOCK` | Overview/actions only |
| 25 | `CAP-INS-002` | `/medicare` | `MedicareScreen` | `MOCK` | Overview/actions only |
| 26 | `CAP-INS-003` | `/aca-marketplace` | `AcaScreen` | `MOCK` | Hard-coded leads/campaign values |
| 27 | `CAP-BIZ-006` | `/commission-plus` | `CommissionPlusScreen` | `MOCK` | Activation/aggregation simulated |
| 28 | `CAP-ADMIN-001` | `/settings` | `SettingsScreen` | `MOCK` | Overview only; most controls inert |
| 29 | `CAP-ADMIN-002` | `/agency` | `AgencyScreen` | `MOCK` | Fixture overview, no membership/RBAC |
| 30 | `CAP-ADMIN-003` | `/imo-fmo` | `OrganizationScreen` | `MOCK` | Alias of organization screen |
| 31 | `CAP-ADMIN-004` | `/org/dashboard` | `OrganizationScreen` | `MOCK` | No tenant hierarchy enforcement |
| 32 | `CAP-ADMIN-005` | `/more` | `MoreScreen` | `PARTIAL` | Navigation overlay works; destinations incomplete |

## Smoke evidence

At 1707×848 every path rendered with title `unLocked CRM Local`, no page-not-found/crash, no document-level horizontal overflow, and no console warning/error after settled waits. This proves route availability, not business completeness or production safety.

## Update rule

When adding, removing, aliasing, or changing a route:

1. Update this table and preserve existing IDs.
2. Update the [capability matrix](capability-matrix.md).
3. Add/close entries in the [gap register](gap-register.md).
4. Update route tests and the [source register](../06-reference/source-register.md).
