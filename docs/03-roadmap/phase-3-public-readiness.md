# Phase 3 — clean-room public/SaaS readiness and control plane

Phase 3 begins in a **new clean-room repository built from neutral functional specifications**. A fork is not recommended because it preserves Phase 1 expression and history.

## Non-negotiable separation

Do not carry forward unLocked CRM branding, marks, domains, screenshots, icons, illustrations, assets, copied copy/templates/legal text, proprietary source, compiled artifacts, hidden APIs, exact visual composition, account data, tenant fixtures, or contaminated Git history.

The clean-room input is a neutral capability specification: actors, data, states, rules, inputs, outputs, errors, permissions, and acceptance scenarios.

## Independent product creation

- New product name and trademark clearance.
- Original information architecture, workflows, navigation, visual system, copy, and assets.
- Independent code, data model, APIs, tests, fixtures, documentation, and onboarding.
- Documented provenance for every dependency and asset.

“IP-proof” cannot be guaranteed. Qualified counsel must evaluate provenance, contracts, trademarks, copyright, trade secrets, patents, privacy, regulated-industry obligations, and intended markets.

## Product plane and control plane

The CRM product/data plane owns workspace business records and workflows. The separate SaaS control plane owns customer/workspace provisioning, subscriptions/billing, plans and entitlements, fleet/deployment lifecycle, public account operations, and platform support.

The control plane may invoke stable administrative APIs or consume published events. It must not connect to or manipulate CRM product tables directly.

## SaaS foundations

| Area | Required proof |
|---|---|
| Tenancy | Tenant/workspace policy enforced on every query, job, file, search, cache, webhook, export, AI tool and support action |
| Provisioning | Idempotent create/suspend/reactivate/close workflow through product administrative APIs |
| Billing/plans | Subscriptions, seats, entitlements, metering, taxes, invoices, refunds/disputes and ledger reconciliation |
| Fleet operations | Version/channel rollout, health, migration orchestration, rollback and tenant-safe support |
| Roles/hierarchy | Original role model and negative authorization tests |
| Domains/branding | Original branding, domains, certificates, sender verification, reputation and teardown |
| Security/privacy | Independent testing, secrets, MFA/recovery, data inventory, retention/deletion/export, incident and legal programs |
| Operations | SLOs, support, abuse, status communication, backups/DR and release provenance |
| Supply chain | License policy, SBOM, signing, provenance and vulnerability response |

## Deferred native/offline products

Native desktop/mobile apps, device SQLite, offline mutation/sync/conflict UX, offline leases, Tauri/native adapters, and app-store distribution remain outside this roadmap until separately approved. REST/JSON is the Phase 1 product API; durable cursor synchronization is future-only.

## Clean-room workflow

1. Counsel approves the functional-spec input boundary.
2. A spec team produces neutral requirements without copied expression.
3. An independent design team creates original UX and visual language.
4. An implementation team builds only from approved specs/designs.
5. Provenance, license/SBOM, security, privacy, and legal reviewers audit the candidate.
6. Launch occurs only after written gate approval.

## Public launch checklist

- [ ] New repository and independent history
- [ ] Original product identity/design/content/assets
- [ ] Separate product and control planes with API/event-only administration
- [ ] Multi-tenant isolation, provisioning, billing/plans and fleet operations
- [ ] Trademark clearance and qualified-counsel approval
- [ ] License audit, SBOM, signed artifacts and vulnerability process
- [ ] Terms, privacy, DPA, BAA/subprocessor program as applicable
- [ ] Communications, recording, Medicare marketing and insurance regulatory review
- [ ] Backup/DR, monitoring, incident, abuse and support readiness
- [ ] No Phase 1 expression or account artifact carried forward
