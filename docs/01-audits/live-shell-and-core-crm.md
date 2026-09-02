# Live shell and core CRM audit

**Evidence:** `LIVE-VERIFIED` unless marked otherwise. Source: Engram #641, authenticated read-only audit. No live state was changed.

## Shell

| Element | Observed behavior |
|---|---|
| Primary rail | Approximately 62 px; Home, Phone, Email, Quoting, Life, Medicare, ACA, Build, Comm+, Agency, IMO/FMO, More; Earn, Support, Settings below |
| Context navigation | CRM: AI workspace, Inbox, Contacts, Pipeline, Calendar; Tools: Agent AI, Automations, AI Quoting, Underwriting, Campaigns, Forms; Business: Policies, Commissions, Tasks, Booking Links, Analytics, Documents |
| Main layout | Context navigation began near x=68 and content near x=294 at a 1138×565 audit viewport; no document overflow |
| Visual system | Inter/system sans serif, dark slate text, white surfaces, bright-blue selection, pale borders, compact rounded controls, low-shadow cards, dense tables |
| Persistent utilities | Search, Customize, Invite Agent, Support, notifications, AI assistant, user menu, Voice OS controls, collapsible/resizable navigation, route-aware guide |
| Runtime gotcha | Fresh deep links could remain on `Loading`; SPA navigation from a settled dashboard was more reliable |

Do not reproduce account-specific names, notification ages, trial notices, or tenant banners as global defaults.

## Dashboard

- Density control with comfortable/compact modes.
- Greeting and AI composer with content/voice affordances.
- Suggestions, today activity, meetings, and tasks are record-driven.
- The audited fictional records connected a policy renewal and task into dashboard widgets.

**Parity requirement (`CAP-CRM-001`):** use a normalized synthetic record graph so dashboard values derive from contacts, tasks, appointments, policies, and opportunities rather than independent hard-coded cards.

## AI workspace

- Dedicated inner sidebar: new conversation, insights, disabled plugin state, permissions, search, pinned and recent history.
- Composer modes for writing, strategy, email, calendar, and contacts.
- Insights views for usage, voice, personalization, and transforms.
- Permission model: two AI contexts and 53 actions grouped into ten categories, each configurable as automatic, approval-required, or blocked.

The audit observed 19 automatic, 34 approval-required, and zero blocked actions. That tenant state is evidence, not a recommended default. Production enforcement must be server-side.

## Inbox

- Two-pane layout.
- List tabs for unread, starred, drafts, and all; search/filter/sort/add.
- Empty list and empty-detail states were distinct.
- New-conversation dialog searched contacts and offered contact creation; no conversation was started.
- UI grouped SMS, email, and calls, implying a shared conversation/activity projection.

## Contacts

### List and creation

- Subviews for lead lists, restore, lead-list management, and family trees.
- Search, sorting, agent/status-oriented filters, columns, upload/create actions, and pagination.
- Columns covered identity, contact channels, birth data, location, connection, interactions, tags, product interest, source, and agent.
- Create types included ACA, Medicare, Life, and generic contact; generic creation required name plus at least one contact channel.

### Contact detail

- Previous/next navigation, jump search, filters, tag/favorite/snapshot/panel actions.
- Communication, note, workflow, call, and quote actions.
- Product-specific and custom-field sections.
- Tabs for AI, overview, activity, conversations, emails, calls, notes, tags, tasks, appointments, quotes, policies, medications/providers, files, and tab management.
- Cross-record summary included connection score, active policies, commissions, appointments, tasks, risk cues, activity, lead score, and communication preferences.

**Highest parity risk (`CAP-CRM-003`):** the detail workspace and relationship graph are much deeper than a contacts table.

## Pipeline

- Board and table modes.
- Pipeline, agent, search, and advanced filters; edit, AI, and add actions.
- Nine observed recruiting stages from prospect through activated.
- Cards displayed status, contact, product/source, commission, probability, and last-contact timing.
- Table added weighted value, carrier, assigned agent, and days-in-stage.
- Add form covered contact, pipeline/stage, value/probability, policy type, agent, source, tags, and description.

Existing-opportunity detail was not exposed during the safe audit; track it as `GATED`.

## Calendar

- Calendar and table views, previous/next navigation, week view, view management, calendar connection, availability, and appointment creation.
- Appointment form included calendar, title, description, assignee, timezone, date/time, location, contact, guests, notes, and scope-of-appointment field.
- `GATED`: creation was disabled because no calendar was configured.

## Tasks

- Board and list modes with all/export/add controls.
- Four status columns and a fictional follow-up task.
- Create form included title, contact, date/time, priority, status, assignee, and details.
- Detail included attachments, comments, activity log, complete/edit/delete actions. No mutation was performed.

## Next proof

Use [Unresolved evidence](unresolved-evidence.md) for safe rechecks, then connect each workspace to the stable IDs in the [capability matrix](../02-traceability/capability-matrix.md).
