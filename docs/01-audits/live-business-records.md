# Live business-record audit

**Evidence:** `LIVE-VERIFIED` unless marked. Source: Engram #641. No policy, commission, booking, export, upload, or document action was executed.

## Policies

### List and detail

- Main controls: AI insights, export, bulk upload, add policy, agent/product/carrier/status/recent/search filters.
- Internal views: all policies, applications, enrollments, renewals, book of business, cross-sell.
- The fictional active policy linked client, carrier, product/category, policy identifier, status, and renewal date.
- Detail covered policy/member identifiers, carrier/product, coverage, status, premium/payment, dates, enrollment context, benefits, cost/network/drug metadata, ownership, agent, and commission state.
- Clone-for-renewal and section editing were visible but untouched.

### Creation

- Category-specific entry points for life, Medicare/health, annuities, and other lines.
- Medicare/health form exposed carrier, coverage type, product, agent, commission status, client, premium, policy IDs, CMS/network/SNP/formulary/cost/drug fields, enrollment period, benefits, dates, payment frequency, and status.
- Product/coverage-specific custom fields appeared conditionally.

### Workspaces

| View | Observed state |
|---|---|
| Applications | Empty; manual and connected applications described |
| Enrollments | Empty metrics, filters, and enrollment table |
| Renewal dashboard | One urgent fictional renewal with progress |
| Book of business | `GATED`; selected panel remained blank |
| Cross-sell | Empty analysis, gap, opportunity, and revenue states |

**Parity requirement (`CAP-BIZ-001`):** model policy detail and category-specific fields, not one generic record form.

## Commissions

- Summary KPIs for paid, pending, count, and average.
- Status/type/product/carrier/agent filters and a ledger table.
- Create form covered optional client/policy, type, agent, status/date, premium, percentage, amount, notes, and custom fields.
- `PRIOR-VERIFIED`: positive-amount validation was observed in an earlier audit but not safely rechecked.
- No statement ingestion, split reconciliation, or carrier sync was proven from this page.

Commission+ is a separate activation-gated product; see [insurance and quoting](live-insurance-and-quoting.md).

## Booking links

- Status/type/agent/search filters, submissions, folders, and create action.
- Personal and round-robin link types.
- Personal setup included name, description, team member, slug, and duration.
- No link was created.

## Analytics

The route needed roughly 30 seconds to settle. Internal views:

1. Overview
2. Calls
3. Dispositions
4. Email
5. SMS
6. Appointments
7. Agents
8. Marketing
9. Sources
10. Audit
11. Report Builder

The fictional overview derived lead, task, opportunity, commission, and activity metrics. Other views provided channel/activity/agent/marketing/source projections, audit events, and saved-report folders. Download/export actions were not used.

**Parity requirement (`CAP-BIZ-004`):** analytics must derive from shared immutable events and normalized records; independent hard-coded cards cannot maintain cross-view consistency.

## Documents and E&O

- Documents and E&O tabs.
- Bulk upload, download, folders, upload, search/type/agent/date filters.
- Folder breadcrumb and empty-folder state.
- Document table fields for name, type, contact, carrier/plan, size, added time, and actions.
- E&O drop zone named PDF/image/text and promised extraction; no upload occurred.
- New-folder dialog remained disabled until named.

**Planning direction (`CAP-BIZ-005`):** Phase 1 requires functional S3-compatible local object storage, scan/quarantine, metadata, versions, relationships, access events, and reviewable synthetic extraction through a deterministic OCR adapter. Phase 2 adds production-grade authorization, encryption, retention, backup/recovery, download auditing, and an approved real OCR provider if selected.

## Shared record graph

Live evidence implies relationships among contacts, policies, opportunities, tasks, appointments, messages, documents, commissions, renewals, analytics, and audit events. Phase 1 must persist and prove this graph for one synthetic workspace through workspace-scoped repositories and constraints. Phase 2 adds secure production identity, fixed-role enforcement, encryption, and operational controls; Phase 3 adds true tenant isolation.
