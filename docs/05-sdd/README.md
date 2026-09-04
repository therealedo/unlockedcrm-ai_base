# Future SDD workspace

This folder prepares future specification-driven changes. **It does not create an active SDD change, OpenSpec directory, proposal, spec, design, task list, or attempt.**

## When to use SDD

Use SDD only when explicitly selected and durable proposal/spec/design/tasks materially reduce ambiguity. Small, understood, mechanical changes do not need an artificial lifecycle.

## Before starting

1. Select stable capability and gap IDs.
2. Confirm the phase gate and synthetic-data boundary.
3. Read the relevant audits and architecture decisions.
4. Fill the [change brief](../07-templates/sdd-change-brief-template.md).
5. Run [change intake](change-intake.md).
6. Establish acceptance proof and the strict TDD command before implementation.

## Expected artifact links

When Engram is the selected artifact store, use project `unlockedcrm-ai_base` and these topic keys:

- `sdd/{change}/proposal`
- `sdd/{change}/spec`
- `sdd/{change}/design`
- `sdd/{change}/tasks`
- `sdd/{change}/apply-progress`
- `sdd/{change}/verify-report`
- `sdd/{change}/archive-report`

Do not create these keys merely to describe a possible idea.

## Implementation contract

- RED → GREEN → REFACTOR is mandatory for behavior changes.
- Phase 1 core workflows persist through the Fastify Node.js REST API and PostgreSQL; browser-only hard-coded state is not functional completion.
- Phase 1 provider workflows may use deterministic provider-neutral simulators when the complete state machine, owned port, shared contract tests, persisted attempts/outcomes, and explicit boundary status are delivered.
- Real provider integration is not required until its scheduled Phase 2 slice, but vendor-gated work must retain an adapter contract, blocker, lawful substitute, and no-scraping rule.
- Every Phase 1 change must remain runnable on Windows without a cloud account and use synthetic data only.
- Every task cites capability/gap IDs and acceptance scenarios.
- Apply progress is cumulative; verification reads the complete state.
- Update traceability and sources with implementation.
- Use the [definition of done](definition-of-done.md) before archive or delivery.
