# Live administration, settings, and organizations audit

**Evidence:** `LIVE-VERIFIED` unless marked. Source: Engram #642. No settings, invitations, billing, connections, exports, uploads, domain requests, keys, agreements, team members, or organization records were changed.

## Global administration surfaces

- More drawer: Integrations, Client Portal, Clinic Portal, Carriers, Policy Analyzer.
- Customize navigation: search/reset, destinations assigned to Rail/Menu/More/Hidden, icon-only or labeled appearance, Home locked to rail.
- Utilities: Invite Agent, Support, notifications, user menu, Voice OS, floating AI.

## Settings inventory

### My business

| Surface | Evidence summary |
|---|---|
| My Profile | Personal/contact details, photo, signature, login email/password, verification/logout behavior; identity redacted |
| Business Profile | `GATED`; shell rendered but primary content remained blank |
| Billing | Plan, wallet, rates, recharge, transactions/export; point-in-time tenant values omitted |
| My Team | Owner/admin/manager/agent concepts, seat state and invitations; no invite used |
| Access Levels | `GATED`; no usable content |
| White Label | Self-service name/AI/logo/colors/fonts/preview; domain/sender is assisted DNS workflow |
| Integrations | `GATED`; blank/loading |

Current role cards showed Admin, Manager, and Agent. Older Producer/Read-only labels are `PRIOR-VERIFIED` and must not be merged without a safe recheck.

### Business services

- Opportunities & Pipelines: pipelines, stages, probabilities, defaults, inactive filter, new pipeline.
- Calendars: settings/availability, duration/type/timezone, note capture, sync, Google/Microsoft, beta scheduling connection, weekly availability.
- Booking Links: filters/search/submissions/folders/create.
- My Carriers: carrier filtering for quote/underwriting contexts.
- Agency Carrier Rules: `GATED`; blank.
- Carrier Compensation: contracted rates used for quote/commission ordering.

### Account and security

- Security: authenticator MFA, password management, recent login activity, security recommendations. The audited tenant had MFA disabled; that is not a recommended default.
- AI Permissions: two AI contexts, 53 actions, category filters and bulk policies.
- Recordings: call/meeting/AI library with filters, playback/download/remove promises, sync and source integrations.
- Notifications: email and in-app channels across 47 event types and ten domain categories.
- Audit Logs: search/date/action/user filters and export; current empty state. Retention/tamper resistance were not exposed.

### Data and customization

- Custom Fields: sections, fields, product types, merge variables, form visibility, types, product-conditional sections.
- Custom Values: merge tags, overrides, template testing.
- Tags: reusable contact/campaign/follow-up labels.
- Manage Scoring: activity points and cold/warm/hot thresholds.
- Record Pages: `GATED`; blank.

### Developer surfaces

- Developer Portal, API Documentation, MCP Server, and generated TypeScript/Python SDK links were visible.
- API Keys, OAuth Apps, and Webhooks were `GATED`; no credentials or payloads were inspected.
- A Supabase-hosted OpenAPI link was visible. It is a vendor clue, not proof of the live backend architecture.

### Legal surfaces

Privacy, Terms, DPA, and BAA entry points were visible. Support stated a BAA request path; none was requested. These surfaces are not evidence of HIPAA compliance or legal sufficiency.

## Agency workspace

Information architecture:

- Overview: Dashboard, Live Call Wallboard
- Team: Team, Sub-Agencies, Agents, Lead Flow
- Recruiting: Recruiting, Downlines
- Production: Performance, Book of Business
- Operations and compliance: Operations, Complaints & Audit

Observed behavior included hierarchy metrics, five-second wallboard, user/group/hierarchy/reassignment tabs, directories/uploads/create actions, seat-to-agent warning, round-robin/cap/state assignment, recruiting pipeline, performance/targets, portfolio/retention/reassignment, licensing/E&O resources, and complaint logging/export. None was mutated.

## IMO/FMO workspace

Root used an organization switcher. Nested areas: Dashboard, Organizations, Agencies, Sub-Agencies, Agents, Production, Carriers, Reports. Hierarchy cards covered IMO/FMO, BGA/MGA, agencies, and agents; production split policies/commissions/metrics; carrier relationships/contracts and several reports were visible.

This is strong evidence for hierarchical scope semantics, not proof of tenant isolation or secure backend enforcement.

## Earn, Support, and user menu

- Earn showed affiliate metrics and a tenant referral mechanism; codes and account-specific values were omitted.
- Support exposed knowledge base, videos, topics, tickets, BAA request, status, events, updates, community links, and A2P/BAA actions.
- User menu exposed plan/status/profile/wallet/feedback/referral/language/help/settings/sign-out/product-update actions; identity and balances were omitted.

## Public-readiness implications (`INFERRED`)

- Enforce tenant and hierarchy scope on every query, job, object, webhook, index, AI tool, and export.
- Implement server-side RBAC/ABAC, seat lifecycle, billing ledger, domains, certificates, reputation, secret rotation, OAuth/API keys, signed webhooks, rate limits, audit retention, MFA/recovery, recording/consent policy, incident/support/abuse operations, and privacy/legal programs.
