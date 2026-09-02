# Working agreements

These agreements keep multi-session work safe, reviewable, and evidence-based.

## Start every work session

1. Read [the documentation hub](../README.md).
2. Search Engram project `unlockedcrm-ai_base` for the relevant audit, decision, or prior change.
3. Confirm the capability ID, current status, target phase, and allowed files.
4. Confirm whether the task is read-only, documentation-only, a functional Phase 1 development slice, or approved Phase 2 hardening.
5. Define proof before editing.

## Evidence hierarchy

Use the most current applicable evidence, not the most convenient:

1. Current repository/runtime verification (`LOCAL-VERIFIED`)
2. Current safe live observation (`LIVE-VERIFIED`)
3. Earlier credible observation (`PRIOR-VERIFIED`)
4. Explicitly unavailable state (`GATED`)
5. Requirement derived from other evidence (`INFERRED`)

Do not convert marketing copy into a technical guarantee. Do not convert a visible control into proof of a secure backend.

## Safety and data

- Synthetic fixtures only in Phase 1.
- Never store live credentials, exports, screenshots, account IDs, balances, or referral values.
- Keep deterministic test doubles for unit/contract tests, but do not use them as the Phase 1 exit substitute.
- Phase 1 runtime paths use self-hosted development services or lawful sandbox/test adapters where feasible, with synthetic data and explicitly owned test numbers, inboxes, calendars, buckets, and accounts.
- Require explicit adapter configuration, destination allowlists, and a safe dry-run/preflight before any Phase 1 test side effect or Phase 2 production side effect.
- For a vendor/activation gate, preserve the blocker, implement the owned adapter contract, and use the strongest lawful substitute; never scrape or bypass a gate.
- Treat PHI, PII, recordings, messages, documents, eligibility, policy, and commission data as sensitive by default.

## Implementation discipline

- Work by stable capability ID, not by vague page name.
- Prefer owned domain interfaces with provider adapters.
- Keep user data separate from deployable application artifacts.
- Implement state families together: loading, empty, populated, validation, error, permission-denied, connection-required, and destructive confirmation.
- Use strict RED → GREEN → REFACTOR for behavior changes.
- Update traceability and docs in the same reviewable work unit.

## Live research discipline

- Read-only and minimally invasive.
- Do not exercise actions that send, publish, bill, export, upload, connect, activate, delete, change settings, or affect trial/account state.
- Note viewport, route, settle time, state, and whether navigation was a fresh load or SPA transition.
- Redact identity and tenant-specific values.
- Mark blank/setup/activation states `GATED`; never infer their internals.

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
| Behavior/status | Capability matrix and gap register |
| New live/local evidence | Relevant audit and source register |
| Architecture/vendor decision | Infrastructure doc and vendor register |
| Phase/scope decision | Governance and roadmap |
| SDD change | Change brief, linked capability IDs, completion evidence |

## Stop conditions

Stop and request an explicit decision when:

- the task would cross a phase gate;
- real PII/PHI or production credentials would be needed;
- an external side effect is not safely reversible;
- vendor legal/security/BAA/data-use terms are unclear;
- live evidence is gated and implementation would require invention;
- public work would reuse protected expression or branding;
- proof contradicts the current documentation source of truth.
