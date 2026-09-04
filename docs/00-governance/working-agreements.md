# Working agreements

These agreements keep multi-session work safe, reviewable, and evidence-based.

## Start every work session

1. Read [the documentation hub](../README.md).
2. Search project memory for relevant audits or decisions when permitted.
3. Confirm capability ID, owned/provider boundary, current status, target phase, and allowed files.
4. Confirm whether work is read-only, documentation-only, Phase 1 core/simulator work, Phase 2 hosted/integration hardening, or Phase 3 clean-room work.
5. Define proof before editing.

## Evidence hierarchy

1. Current repository/runtime verification (`LOCAL-VERIFIED`)
2. Current safe live observation (`LIVE-VERIFIED`)
3. Earlier credible observation (`PRIOR-VERIFIED`)
4. Explicitly unavailable state (`GATED`)
5. Requirement or plan derived from evidence (`INFERRED`)

Do not convert marketing copy, visible controls, target architecture, or technology selection into proof of implementation.

## Safety and data

- Phase 1 uses synthetic fixtures only and must run locally without cloud infrastructure.
- Never store live credentials, exports, screenshots, account IDs, balances, or referral values.
- External-provider workflows use deterministic simulators by default. Real test adapters require explicit scope and owned test destinations.
- A simulator must implement the owned port, state machine, failures/retries, contract tests, and synthetic audit/events; hard-coded UI is insufficient.
- Production credentials, customer destinations, PII/PHI, and real vendor side effects remain prohibited until Phase 2 approval.
- Preserve vendor/activation blockers; never scrape or bypass access controls.
- Treat PHI, PII, recordings, messages, documents, eligibility, policy, and commission data as sensitive by default.

## Implementation discipline

- Work by stable capability ID and explicit boundary.
- Preserve the Vinext/Vite parity UI unless a demonstrated blocker triggers a framework decision.
- Put domain/application logic in a separate Fastify-based Node.js 24 LTS TypeScript modular monolith; use REST/JSON and PostgreSQL through workspace-scoped repositories.
- Use Docker Desktop + Docker Compose for Windows development infrastructure. Start with PostgreSQL and add supporting services only for the slice that needs them.
- Run Vinext/Vite and Node.js/Fastify directly on the Windows host by default. Pin exact Node.js 24 LTS and npm versions; defer full application containerization until measured environment-parity problems justify it.
- Do not add Python/FastAPI to the core API. Permit Python only as an isolated worker after a proven specialized-library need, with a narrow job/port contract and no data authority.
- Operate one seeded workspace while enforcing `workspace_id` ownership on business data/jobs/files/events/audit records.
- Centralize synthetic request identity/authorization context; externalize configuration and secrets.
- Keep the Phase 3 control plane separate from product tables.
- Implement loading, empty, populated, validation, error, permission, disconnected, retry, and destructive-confirmation states together.
- Use strict RED → GREEN → REFACTOR for behavior changes.
- Update traceability and docs with implementation.

## Local Windows proof

Phase 1 proof includes a documented clean setup, migration/seed, start, health, and test path on the user's Windows PC. Docker Desktop + Docker Compose must reproduce the required local infrastructure, beginning with PostgreSQL. One planned root startup command must check/start Compose plus the host-run UI and API rather than requiring many manual service commands. Railway, Vercel, other cloud accounts, and hosted services cannot be prerequisites. A network-required PWA shell may be tested, but offline data mutation/sync is out of scope.

## Live research discipline

- Read-only and minimally invasive.
- Do not exercise actions that send, publish, bill, export, upload, connect, activate, delete, change settings, or affect trial/account state.
- Record route, viewport, settle time, tenant prerequisites, and navigation method.
- Redact identity and tenant-specific values.
- Mark blank/setup/activation states `GATED`.

## Git discipline

- Conventional Commits only.
- No AI or coauthor attribution.
- No force push.
- No credentials or live data in history.
- Keep implementation, tests, traceability, and docs together.

## Documentation ownership

| Change | Required documentation |
|---|---|
| Route or nested view | Route map and capability matrix |
| Workflow/provider status | Capability matrix and gap register |
| New evidence | Relevant audit and source register |
| Architecture/vendor decision | Infrastructure doc and vendor register |
| Phase/scope decision | Governance and roadmap |
| SDD change | Change brief, capability IDs, completion evidence |

## Stop conditions

Stop for an explicit decision when work would cross a phase gate, require real data/production credentials, create an unapproved external side effect, depend on unclear legal/vendor terms, invent gated behavior, mix the SaaS control plane into product tables, or reuse protected expression publicly.
