# Documentation hub

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI, hosted production use, or SaaS.**

The approved direction is an online-first, locally reproducible, single-workspace CRM. Phase 1 runs on the user's Windows PC without cloud infrastructure; hosted production and public SaaS are later gates.

## Quick paths

| I need to… | Read first | Then |
|---|---|---|
| Understand scope and phase boundaries | [Mission and phases](00-governance/mission-and-phases.md) | [Legal and IP boundaries](00-governance/legal-and-ip-boundaries.md) |
| See the current implementation | [Local current state](01-audits/local-current-state.md) | [Current infrastructure](04-infrastructure/current-infrastructure.md) |
| See live-product evidence | [Audit index](01-audits/README.md) | [Unresolved evidence](01-audits/unresolved-evidence.md) |
| Plan the next core workflow | [Gap register](02-traceability/gap-register.md) | [Capability matrix](02-traceability/capability-matrix.md) |
| Understand the target stack | [Target architecture](04-infrastructure/target-architecture.md) | [Deployment, backup, and updates](04-infrastructure/deployment-backup-and-updates.md) |
| Evaluate an external provider | [Integration catalog](04-infrastructure/integration-catalog.md) | [Integration template](07-templates/integration-evaluation-template.md) |
| Prepare an SDD change | [SDD workspace](05-sdd/README.md) | [Change intake](05-sdd/change-intake.md) |
| Look up terms or evidence | [Glossary](06-reference/glossary.md) | [Source register](06-reference/source-register.md) |

## Documentation map

| Area | Purpose | Owner rule |
|---|---|---|
| [00 Governance](00-governance/mission-and-phases.md) | Mission, safety, evidence, legal boundaries | Change only with an explicit product decision |
| [01 Audits](01-audits/README.md) | Historical live and current local observations | Preserve observations; separate later planning notes |
| [02 Traceability](02-traceability/route-map.md) | Stable capabilities, boundary status, gaps | Update with every behavior/evidence change |
| [03 Roadmap](03-roadmap/overview.md) | Phase scope and gates | Keep online/local/hosted/SaaS boundaries explicit |
| [04 Infrastructure](04-infrastructure/current-infrastructure.md) | Current and target platform/integrations | Label technology as current, selected target, candidate, or deferred |
| [05 SDD](05-sdd/README.md) | Future change intake and completion rules | Preparation only; no active change here |
| [06 Reference](06-reference/domain-model.md) | Domain language and sources | Keep neutral and evidence-linked |
| [07 Templates](07-templates/module-audit-template.md) | Repeatable audit/change formats | Extend without weakening required fields |

## Current truth in one minute

- React currently runs through Vinext/Vite using Next-compatible source conventions; the official Next.js package is not the runtime.
- Root and catch-all pages render one client CRM shell with custom browser routing.
- Seven create-only flows persist one `localStorage` object; edit/delete, API, PostgreSQL, jobs, auth, real providers, and PWA support are absent.
- OpenAI Sites/Cloudflare tooling is configured for the web build, but no D1/R2 or other application data bindings exist.
- The selected Phase 1 topology runs Vinext/Vite and Node.js/Fastify on the Windows host while Docker Desktop + Docker Compose manages PostgreSQL and later slice-required infrastructure. No Compose profile, API, exact Node/npm pin, or combined root startup command exists yet.
- Phase 1 keeps this UI stack and adds a separate Fastify-based Node.js 24 LTS TypeScript modular-monolith REST/JSON API plus local PostgreSQL/Prisma.
- Phase 1 makes every audited owned/core workflow functional in one seeded workspace. External-provider boundaries may remain explicit deterministic simulators with complete workflows and contract tests.
- Railway is the preferred but unvalidated Phase 2 hosting candidate for the persistent Fastify API, bounded workers, and PostgreSQL topology; Vercel is optional for frontend previews only.
- Phase 2 securely hosts that single workspace and enables selected real integrations before limited real-data use.
- Phase 3 creates the clean-room public SaaS product and separate control plane.
- Native apps and offline data synchronization are deferred; responsive web remains required, and any PWA shell remains network-required.

## Update rule

Every behavior or boundary change updates:

1. [Capability matrix](02-traceability/capability-matrix.md)
2. [Gap register](02-traceability/gap-register.md)
3. The relevant audit or architecture document
4. [Source register](06-reference/source-register.md)

Use the status/evidence rules in [Evidence and status model](00-governance/evidence-and-status-model.md).
