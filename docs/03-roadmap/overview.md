# Three-phase roadmap

The roadmap protects the order of operations: **first prove synthetic behavior, then make local operation safe, then create an independent public product.**

## Phase sequence

| Phase | Primary result | Must not do |
|---|---|---|
| [Phase 1](phase-1-replica.md) | Fully functional synthetic development replica using local services and lawful sandbox/test integrations | Real PII/PHI, customer outreach, production credentials or destinations |
| [Phase 2](phase-2-local-production-readiness.md) | Secure, durable, observable, recoverable personal/small-circle deployment | Assume SaaS/tenant/public readiness |
| [Phase 3](phase-3-public-readiness.md) | New clean-room, original, multi-tenant public product | Fork/carry Phase 1 expression, branding, screenshots, copy/assets, source, fixtures |

## Current position

Phase 1 is in progress. The route shell is broad, but most deep live views and external boundaries are `MOCK` or `MISSING`. Phase 2 foundations are largely absent.

## Gate summary

### Phase 1 → Phase 2

- Every accessible route and major nested view has a capability ID.
- Synthetic behavior, state families, responsive layout, and cross-record projections pass tests.
- Local PostgreSQL/object storage/job/event services and feasible sandbox/test adapters prove complete workflows with synthetic data and owned test destinations.
- Deterministic test doubles cover automated isolation but are not the Phase 1 exit proof.
- Vendor-gated capabilities have an adapter contract, documented blocker, and strongest lawful substitute; no scraping or bypass.
- Gated live behavior remains explicitly gated.
- Capability matrix and gap register are current.

This gate permits work on production foundations; it does not permit real data by itself.

### Phase 2 limited-use approval

- Independent security/privacy/compliance review.
- Authentication, authorization, secure durable data, secrets, audit, consent, files, jobs, monitoring, backup/restore, and signed rollback-capable updates proven.
- Selected adapters pass product-specific vendor/legal/security gates.
- Owner explicitly approves the limited user/data scope.

### Phase 3 launch approval

- New clean-room repository and original design system/product identity.
- Tenant, billing, support, incident, abuse, retention, deletion, legal, license/SBOM, and vendor programs complete.
- Qualified counsel clears the intended public launch.

## Work selection

1. Start at [Gap register](../02-traceability/gap-register.md).
2. Choose one bounded capability slice whose phase prerequisites are met.
3. Create a [change brief](../07-templates/sdd-change-brief-template.md).
4. Follow strict TDD and [Definition of done](../05-sdd/definition-of-done.md).
