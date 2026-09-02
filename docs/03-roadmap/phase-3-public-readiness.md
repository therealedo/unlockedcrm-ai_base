# Phase 3 — clean-room public and SaaS readiness

Phase 3 must begin in a **new clean-room repository built from neutral functional specifications**. This is recommended over a fork because a fork preserves Phase 1 expression and history.

## Non-negotiable separation

Do not carry forward:

- unLocked CRM branding, names, marks, domains, screenshots, icons, illustrations, or assets;
- copied interface copy, onboarding text, templates, scripts, legal copy, or help content;
- proprietary source, compiled artifacts, hidden API material, exports, or tenant data;
- exact visual composition or a mechanically restyled clone;
- Phase 1 tenant fixtures or account-specific values;
- Git history containing those materials.

The clean-room input is a neutral capability specification: actors, data, states, rules, inputs, outputs, errors, permissions, and acceptance scenarios.

## Independent product creation

- New product name and trademark clearance.
- Original information architecture, workflows, navigation, visual system, copy, and assets.
- Independent code, data model, APIs, tests, fixtures, documentation, and onboarding.
- Documented provenance for every dependency and asset.

“IP-proof” cannot be guaranteed. Qualified counsel must evaluate the actual product, provenance, contracts, trademarks, copyright, trade secrets, patents, and intended markets before launch. See [Legal and IP boundaries](../00-governance/legal-and-ip-boundaries.md).

## SaaS foundations

| Area | Required proof |
|---|---|
| Tenancy | Tenant ID and policy enforced on every query, job, file, search index, cache, webhook, export, AI tool, and support action |
| Roles/hierarchy | Owner/admin/manager/agent plus organization hierarchy verified by negative authorization tests |
| Billing | Subscription, seats, wallet/metering, taxes, invoices, refunds/disputes and idempotent ledger |
| Domains/branding | Original branding, domain proof, certificates, email sender verification, reputation and teardown |
| Security | Threat model, independent testing, secrets, MFA/recovery, rate limits, audit, vulnerability and incident processes |
| Privacy/compliance | Data inventory, purpose, retention/deletion/export, DPA/BAA/subprocessors, breach/incident, consent and regulated communications |
| Operations | SLOs, support, abuse, billing disputes, incident response, backups/DR, release/rollback, status communication |
| Supply chain | License policy, dependency review, SBOM, provenance, signing, vulnerability response |

## Clean-room workflow

1. Counsel approves the functional-spec input boundary.
2. A spec team produces neutral requirements without screenshots, copied prose, source, or exact composition.
3. An independent design team creates original UX and visual language.
4. An implementation team builds only from approved neutral specs and original designs.
5. Provenance, license/SBOM, security, privacy, and legal reviewers audit the candidate.
6. Launch occurs only after written gate approval.

## Public launch checklist

- [ ] New repository and independent history
- [ ] Original product identity/design/content/assets
- [ ] Trademark clearance and qualified-counsel approval
- [ ] License audit, SBOM, signed artifacts, vulnerability process
- [ ] Multi-tenant isolation and privileged support controls
- [ ] Billing, subscription, metering and dispute operations
- [ ] Terms, privacy, DPA, BAA/subprocessor program as applicable
- [ ] Communications, recording, Medicare marketing and insurance regulatory review
- [ ] Backup/DR, monitoring, incident, abuse and support readiness
- [ ] No Phase 1 expression or tenant artifact carried forward
