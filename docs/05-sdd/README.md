# Future SDD workspace

This folder prepares future specification-driven changes. **It does not create an active SDD change, OpenSpec directory, proposal, spec, design, task list, or attempt.**

## When to use SDD

Use SDD only when explicitly selected and durable proposal/spec/design/tasks will materially reduce ambiguity. Small understood documentation or mechanical changes do not need an artificial SDD lifecycle.

## Before starting a change

1. Select stable capability IDs from the [capability matrix](../02-traceability/capability-matrix.md).
2. Confirm phase prerequisites and safety boundary.
3. Read the relevant audits and gaps.
4. Fill the [change brief template](../07-templates/sdd-change-brief-template.md).
5. Run [change intake](change-intake.md).
6. Establish acceptance proof and strict TDD command before implementation.

## Expected artifact links

When Engram is the selected artifact store, use project `unlockedcrm-ai_base` and topic keys:

- `sdd/{change}/proposal`
- `sdd/{change}/spec`
- `sdd/{change}/design`
- `sdd/{change}/tasks`
- `sdd/{change}/apply-progress`
- `sdd/{change}/verify-report`
- `sdd/{change}/archive-report`

Do not create these keys merely to document a possible idea.

## Implementation contract

- RED → GREEN → REFACTOR is mandatory for behavior changes.
- Phase 1 uses synthetic data but requires functional local services and lawful sandbox/test adapters end to end. Deterministic test doubles remain mandatory for automated tests and cannot substitute for integration proof.
- A vendor/activation-gated task must deliver the owned adapter contract, documented blocker, and strongest lawful substitute without scraping or bypassing access controls.
- Every task cites capability IDs and acceptance scenarios.
- Apply progress is cumulative; verification reads the complete state.
- Update traceability and sources with implementation.
- Use [Definition of done](definition-of-done.md) before archive/delivery.
