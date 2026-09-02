# Legal and intellectual-property boundaries

This document is an engineering boundary, not legal advice. **“IP-proof” cannot be guaranteed. Qualified counsel must evaluate copyright, trademark, contract, trade-secret, patent, privacy, and regulated-industry risk before public use.**

## What this repository may do

- Describe observable functions in neutral terms.
- Use short labels needed to identify a behavior.
- Implement original source code from neutral specifications.
- Use synthetic fixtures and original test cases.
- Compare capability coverage without copying hidden implementation.
- Link to official terms and regulatory guidance.

## What this repository must not do

- Copy proprietary source, database contents, tenant data, screenshots, recordings, icons, illustrations, brand assets, or long prose.
- Preserve unLocked CRM names, logos, distinctive copy, exact visual composition, or tenant fixtures in a public product.
- Circumvent gated access, inspect secrets, automate prohibited account actions, or claim rights not granted by contract.
- Treat functional similarity as proof of legal clearance.

The U.S. Copyright Office distinguishes ideas, systems, methods, and procedures from protected expression, but that distinction does not immunize copied code, text, graphics, or a protectable selection/arrangement. Review [Circular 33](https://www.copyright.gov/circs/circ33.pdf) with counsel.

Trademark risk includes likely consumer confusion, not just identical names or logos. Use the [USPTO likelihood-of-confusion guidance](https://www.uspto.gov/trademarks/search/likelihood-confusion) and obtain a professional clearance search.

## Contract boundary

Before any broader use, counsel must review the current [unLocked CRM Terms of Service](https://www.unlockedcrm.ai/terms-of-service) and [Data Processing Agreement](https://unlockedcrm.ai/dpa). A documentation link is not a conclusion that reverse engineering, copying, resale, or a particular processing activity is permitted.

## Three-phase separation

| Phase | Legal/IP rule |
|---|---|
| 1 | Private, synthetic research; do not distribute protected expression or live-account artifacts |
| 2 | Same expression boundary; add operational/legal controls for limited approved use |
| 3 | New clean-room repository from neutral functional specs; original product identity and design; counsel approval before launch |

A fork is not recommended for Phase 3 because Git history would preserve Phase 1 expression and weaken separation. Use a new repository, independent design brief, independent implementation, and a documented source/license review.

## Phase 3 legal checklist

- [ ] New name, logo, domain, copy, UX, layout system, icons, and assets
- [ ] No unLocked CRM screenshots, copied copy/assets, proprietary source, exact composition, or tenant fixtures
- [ ] Trademark clearance and naming approval
- [ ] Copyright/provenance review for every asset and dependency
- [ ] License inventory and SBOM policy
- [ ] Terms, privacy notice, DPA, BAA/subprocessor program, retention/deletion policy
- [ ] Communications, recording, Medicare marketing, and insurance regulatory review
- [ ] Security/privacy architecture and incident/breach procedures
- [ ] Written qualified-counsel approval for the intended launch scope

## Compliance is separate from IP

Even a clean-room implementation is not automatically lawful to operate. The [HHS HIPAA Security Rule resources](https://www.hhs.gov/hipaa/for-professionals/security/index.html), [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business), and [CMS Medicare communications and marketing guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines) are planning inputs, not certifications.

## Decision record

Record legal questions as `BLOCKED` with `GATED` evidence. Do not let schedule pressure convert unresolved counsel work into an engineering assumption.
