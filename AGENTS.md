# Repository operating guide

> **The current local build is a fictional-data browser prototype, not safe for real PII/PHI or SaaS.**

This repository exists to study and reproduce observable CRM behavior for private, synthetic-data development. It is not evidence of security, regulatory compliance, production readiness, or permission to reuse another product's protected expression.

## Mission

Deliver work in three gated phases:

1. **Phase 1 — functional development replica:** reproduce every safely observed layout, module, nested view, state, workflow, and replaceable dependency end to end using fictional data, local services, and lawful sandbox/test integrations.
2. **Phase 2 — local production readiness:** harden that working development stack with secure durable configuration, production credentials after vendor/legal gates, authentication/authorization, one-command hosting, backups, observability, capacity controls, migrations, and signed data-first upgrades for personal use and a small invited agent circle.
3. **Phase 3 — public readiness:** start a **new clean-room repository** from neutral functional specifications, with original branding, UX, copy, assets, and independently cleared legal and operational foundations.

Read [Mission and phases](docs/00-governance/mission-and-phases.md) before changing scope.

## Hard safety boundaries

- Use synthetic records only until the Phase 2 security gate is independently passed. Phase 1 may contact only explicitly owned test numbers, inboxes, calendars, sandboxes, and development services configured for synthetic traffic.
- Never place real names, phone numbers, email addresses, policy identifiers, credentials, tokens, PHI, or other account-specific values in code, fixtures, screenshots, logs, tests, or documentation.
- Treat the authenticated live account as read-only research. Do not send communications, start calls, run quotes, submit forms, publish workflows or campaigns, upload/export data, connect vendors, invite users, activate products, change settings, or use destructive/account/trial controls.
- Do not claim HIPAA compliance, production readiness, SaaS readiness, legal clearance, or “IP-proof” status. Qualified counsel and independent security/compliance review are required.
- Do not copy proprietary source, screenshots, long vendor copy, branding, icons, assets, or exact visual composition into a public product.
- Preserve unavailable or gated evidence as unavailable. Never invent a hidden workflow.

See [Working agreements](docs/00-governance/working-agreements.md) and [Legal and IP boundaries](docs/00-governance/legal-and-ip-boundaries.md).

## Evidence and status language

Use only these implementation statuses:

- `FUNCTIONAL` — behavior works against the intended local or production-grade boundary and has current proof.
- `PARTIAL` — a meaningful slice works, but required behavior or backing services are incomplete.
- `MOCK` — representative UI or simulated behavior without the real dependency.
- `MISSING` — no meaningful implementation exists.
- `BLOCKED` — proof or implementation is prevented by an explicit gate.

Use only these evidence statuses:

- `LIVE-VERIFIED` — directly observed in a safe, read-only live audit.
- `LOCAL-VERIFIED` — inspected or exercised in the current local repository/runtime.
- `PRIOR-VERIFIED` — credible earlier evidence not reverified in the current audit.
- `GATED` — unavailable, blank, setup-dependent, activation-dependent, or deliberately unsafe to exercise.
- `INFERRED` — a requirement or implication, not observed implementation.

Priorities are `P0` through `P3`. Capability IDs are immutable once published. Follow [Evidence and status model](docs/00-governance/evidence-and-status-model.md).

## Current sources of truth

| Question | Source |
|---|---|
| Where do I start? | [Documentation hub](docs/README.md) |
| What was observed? | [Audit index](docs/01-audits/README.md) |
| Which paths and screens exist? | [Route map](docs/02-traceability/route-map.md) |
| What works now? | [Capability matrix](docs/02-traceability/capability-matrix.md) |
| What is missing and why? | [Gap register](docs/02-traceability/gap-register.md) |
| What phase owns the work? | [Roadmap](docs/03-roadmap/overview.md) |
| What architecture is intended? | [Target architecture](docs/04-infrastructure/target-architecture.md) |
| How do we prepare an SDD change? | [SDD workspace](docs/05-sdd/README.md) |
| Which evidence supports a claim? | [Source register](docs/06-reference/source-register.md) |

The active non-root UI is rendered by `components/live-parity-pages.tsx`. A legacy duplicate screen set remains in `components/crm-app.tsx`; verify renderer ownership before editing.

## Phase gates

- **Phase 1 gate:** all accessible capabilities have stable IDs and work end to end on a functional development stack. Use local PostgreSQL/object storage/job/event services and sandbox/test adapters where feasible, with synthetic data and owned test destinations only. Deterministic test doubles remain mandatory for automated tests but do not replace integration proof. A vendor-gated capability requires an owned adapter contract, documented blocker, and strongest lawful test substitute.
- **Phase 2 gate:** the Phase 1 stack is hardened with real authentication and authorization, encrypted durable configuration/storage, production credentials only after product-specific vendor/legal/BAA/conduit gates, backup/restore drills, observability, capacity and cost controls, secret rotation, migration safety, signed upgrades, health checks, rollback, and independent security review. Only then may a designated owner approve limited real data.
- **Phase 3 gate:** a new clean-room repository exists; no Phase 1 expression/history is carried forward; original product design and branding are complete; license/SBOM, trademark, privacy, terms, BAA/subprocessor, tenancy, billing, incident, and legal reviews are approved.

Passing one gate never implies the next gate.

## Documentation maintenance

- Update the capability matrix and gap register in the same change as behavior or evidence.
- Add a source-register entry when a claim depends on a new audit, official reference, or repository location.
- Keep direct observation, prior evidence, gated state, local verification, and inference visibly distinct.
- Record dates for time-sensitive evidence; do not turn tenant-specific counts, pricing, or marketing claims into product guarantees.
- Keep hub pages short and link to detail. Prefer tables and checklists over repeated prose.
- Use English for artifacts unless a project decision explicitly changes the artifact language.

## Browser and live-account safety

1. Open a temporary agent-created tab.
2. Prefer an already-settled SPA route; fresh deep links may remain on `Loading`.
3. Inspect visible state only. Do not dismiss, submit, save, upload, export, connect, activate, delete, or change settings.
4. Redact account identity, balances, referral codes, dates tied to the account, and contact details.
5. Label delayed, blank, setup-gated, and activation-gated states as `GATED`.
6. Close only the temporary tabs you created.

## Git conventions

- Use Conventional Commits.
- Never add `Co-Authored-By` or AI attribution.
- Never force-push.
- Keep commits reviewable and keep tests/documentation with the behavior they prove.
- Do not commit credentials, generated secrets, account exports, or live screenshots.

## Engram memory protocol

Use project `unlockedcrm-ai_base`. Search memory before work that may repeat an earlier audit or decision. Save durable discoveries and decisions immediately, then finish with a session summary.

Stable topic keys:

- `audit/local/current-baseline`
- `audit/live/core-business`
- `audit/live/communications-insurance-tools`
- `audit/live/admin-settings-organizations`
- `architecture/documentation-system`
- `architecture/integration-strategy`
- `roadmap/phase-strategy`
- Future SDD artifacts: `sdd/{change-name}/{proposal|spec|design|tasks|apply-progress|verify-report|archive-report}`

Do not treat memory as user-facing delivery or as stronger evidence than the repository and current verified runtime.

## Future SDD and TDD workflow

No active SDD change or OpenSpec artifact is created by this documentation system.

When implementation begins:

1. Create a change brief from [the template](docs/07-templates/sdd-change-brief-template.md).
2. Confirm capability IDs, phase, evidence, dependencies, safety boundary, and measurable acceptance criteria.
3. Initialize or continue SDD only when explicitly selected for that change.
4. Follow strict RED → GREEN → REFACTOR: add a failing behavior test first, implement the smallest passing slice, then refactor without changing behavior. Phase 1 acceptance includes the functional local/sandbox integration path, not only the deterministic test double.
5. Update traceability and run the checks in [Definition of done](docs/05-sdd/definition-of-done.md).

## Completion checks

Before declaring a documentation or implementation task complete:

- [ ] Changed files stay inside the authorized scope.
- [ ] Every capability mentioned uses a stable ID and allowed status/evidence labels.
- [ ] Internal Markdown links resolve.
- [ ] No secrets, account-specific identity, real PII/PHI, or live screenshots were added.
- [ ] No claim says the current build is compliant, production-ready, or SaaS-ready.
- [ ] Vendor entries remain `CANDIDATE`, `RESEARCH-NEEDED`, `SELECTED`, or `REJECTED`, with evidence; no silent selection.
- [ ] Tests and local proof match the claimed status.
- [ ] Capability matrix, gap register, source register, and relevant roadmap are updated.
- [ ] Engram discoveries/decisions and the session summary are saved.
