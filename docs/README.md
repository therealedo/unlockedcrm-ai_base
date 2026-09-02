# Documentation hub

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI or SaaS.**

This hub turns live observations, local implementation evidence, planned infrastructure, and future changes into a traceable system. Start with the path that matches your job; do not reconstruct project state from chat history.

## Quick paths

| I need to… | Read first | Then |
|---|---|---|
| Understand mission and legal boundaries | [Mission and phases](00-governance/mission-and-phases.md) | [Legal and IP boundaries](00-governance/legal-and-ip-boundaries.md) |
| See what the live product exposed | [Audit index](01-audits/README.md) | [Unresolved evidence](01-audits/unresolved-evidence.md) |
| See what the local build actually does | [Local current state](01-audits/local-current-state.md) | [Capability matrix](02-traceability/capability-matrix.md) |
| Plan the next implementation slice | [Gap register](02-traceability/gap-register.md) | [Change intake](05-sdd/change-intake.md) |
| Evaluate an integration | [Integration catalog](04-infrastructure/integration-catalog.md) | [Integration template](07-templates/integration-evaluation-template.md) |
| Prepare production foundations | [Target architecture](04-infrastructure/target-architecture.md) | [Data, security, and compliance](04-infrastructure/data-security-and-compliance.md) and [deployment, backup, and updates](04-infrastructure/deployment-backup-and-updates.md) |
| Prepare an SDD change | [SDD workspace](05-sdd/README.md) | [SDD brief template](07-templates/sdd-change-brief-template.md) |
| Look up a project term or evidence source | [Glossary](06-reference/glossary.md) | [Source register](06-reference/source-register.md) |

## Documentation map

| Area | Purpose | Owner rule |
|---|---|---|
| [00 Governance](00-governance/mission-and-phases.md) | Mission, safety, evidence, legal boundaries | Change only with an explicit project decision |
| [01 Audits](01-audits/README.md) | Read-only live and local observations | Append/revise only from named evidence |
| [02 Traceability](02-traceability/route-map.md) | Stable capability IDs, status, gaps | Update with every behavior/evidence change |
| [03 Roadmap](03-roadmap/overview.md) | Phase scope and gates | Gate changes require decision evidence |
| [04 Infrastructure](04-infrastructure/current-infrastructure.md) | Current and target platform, integrations | Architecture decisions must name tradeoffs |
| [05 SDD](05-sdd/README.md) | Future change intake and completion rules | Preparation only; no active change here |
| [06 Reference](06-reference/domain-model.md) | Domain language and source register | Keep neutral and evidence-linked |
| [07 Templates](07-templates/module-audit-template.md) | Repeatable audit/change formats | Extend without weakening required fields |

## Current truth in one minute

- The local application has 32 registered paths representing 30 effective screens.
- Seven create-only record flows persist a browser-local JSON object; edit/delete and server persistence are absent.
- Most communications, quoting, AI, workflow, document, organization, and settings surfaces are mocks.
- There is no application backend, authentication, tenant isolation, secure object storage, job system, or real external integration.
- The live audit demonstrates much deeper nested behavior than route-level parity alone.
- Phase 1 remains synthetic but must be functionally end to end through local development services and lawful sandbox/test adapters. Phase 2 hardens that stack and is the first possible gate for limited real use; Phase 3 requires a new clean-room repository and qualified legal review.

## Update rule

Every change that affects a capability must update:

1. [Capability matrix](02-traceability/capability-matrix.md)
2. [Gap register](02-traceability/gap-register.md)
3. The relevant audit or architecture document
4. [Source register](06-reference/source-register.md)

Use the status/evidence rules in [Evidence and status model](00-governance/evidence-and-status-model.md).
