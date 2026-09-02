# Live insurance and quoting audit

**Evidence:** `LIVE-VERIFIED` unless marked. Source: Engram #643. No quote, eligibility calculation, enrollment, webhook test, PDF generation, marketing intake, export, or activation was executed.

## Quoting hub

The hub exposed distinct products rather than one generic form:

- Life
- Annuity (`GATED`/Soon)
- Medicare Advantage
- Medicare Advantage with drug coverage
- Medicare Supplement (`GATED`/upgrading)
- Medicare Part D
- ACA Marketplace
- Private plans

### Product input differences

| Product | Distinct observed inputs/flow |
|---|---|
| Life | Optional CRM contact, geography, DOB/age, gender, tobacco, product type/group, face amount or budget, health class, premium mode, riders, conditions, medications |
| Medicare Advantage | ZIP then county when needed; MA-only semantics |
| MAPD | ZIP/county plus drug list and estimated copays |
| Part D | ZIP/county and drug list for standalone PDP |
| ACA | Seven-step flow beginning with ZIP; document autofill affordance |
| Private plans | Three-step ZIP-first flow with non-ACA/subsidy/pre-existing-condition warning |

Saved life quotes had search and product/status/state filters. Do not collapse product models; geography, doctors, drugs, health, subsidy, QLE, eligibility, budget, result, and saved-quote semantics differ.

## Life

- Overview: client quote link, zero-state metrics, quote/link pipeline, attention, recent quotes, agent performance.
- Quote and Saved Quotes link into product quoter/history.
- Underwriting AI: conversation history, contact selection, assessments, carriers, example cases, explicit estimate/not-final warning.
- Life AI: conversational quote assistant and common coverage examples.
- Marketing: `GATED`/Soon.

Compulife is a `CANDIDATE` commercial life-rating adapter, not selected. Its [API information](https://compulife.com/api/) must be evaluated for license, allowed storage/display, carrier coverage, pricing, security, and exit rights.

## Medicare

Secondary views and key behavior:

| View | Evidence |
|---|---|
| Overview | Enrollment-season countdown, T65/SOA/review/enrollment summaries and quick actions |
| T65 Pipeline | DOB-driven eligibility windows; missing-DOB warning and search/source filters |
| Quote | Product/AI chooser for MA, MAPD, Medigap, Part D |
| HealthSherpa | Disconnected state; connection, enrollments, reporting, activity, actions; webhook/API guidance |
| Eligibility | DOB and work-quarter inputs; calculation action |
| Doctor Search | Name/org/specialty/location/NPI/type inputs; public NPPES source and result cap |
| SOA | Booking-link auto-send concept, forms, metrics, filters, empty state |
| Annual Reviews | Suitability/renewal/gap/urgency dashboard and PDF action |
| CMS Rules | Eligibility, penalties, IRMAA, history; coverage/income/condition inputs |
| Marketing | Branded intake link, campaign templates, source attribution |
| Medicare AI | Product-specific conversational prompts |

Use official CMS/NPPES data rather than scraping: [NPPES downloadable files](https://download.cms.gov/nppes/NPI_Files.html). Medicare communications and marketing must be designed against current [CMS guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines), not copied tenant templates.

## ACA

- Overview with enrollment-season/QLE context, active lead/quote funnel, and agent metrics.
- Quote stepper and saved quotes.
- Leads and contacts with source/status/state/subsidy filters and synthetic sample records.
- Eligibility tracker that projects age transitions into Medicare education/nurture state.
- Insights for funnel, subsidy, pipeline, metal tier, and geography.
- Quick exports/history for leads, eligibility, subsidy, aging, quoted-not-enrolled, saved quotes.
- Marketing link/branding, email/SMS templates, and source-attributed campaign links.
- ACA AI conversational quote assistance.

Marketplace calculations, subsidy/QLE rules, HealthSherpa/carrier/e-app enrollment, source attribution, and export jobs are not implied by the local UI. Phase 1 still owns functional local/public-data or authorized sandbox/test paths where feasible. Vendor-gated paths require an adapter contract, documented blocker, and strongest lawful substitute; Phase 2 hardens approved production integrations.

## Commission+

- Separate activation-gated product, not a synonym for the commission ledger.
- Landing state requested contact information and described carrier/book synchronization plus tutorial links.
- `GATED`: post-activation dashboard, carrier connections, sync history, and reconciliation records were not available without activation.
- Marketing claims about carrier counts or compliance were recorded as visible copy only and were not independently verified.

## Next proof

Model every product as an owned domain interface. Phase 1 must exercise authorized sandboxes/test APIs or lawful local/public-data substitutes with synthetic data; deterministic test doubles remain for automated tests only. Evaluate live result schemas through safe, authorized evidence, and never submit real quote/enrollment data, scrape, or bypass a gate to discover them.
