# Evidence, capability, and status model

This model makes every claim traceable across sessions and prevents visual similarity from being mistaken for functional or production readiness.

## Stable capability IDs

Format: `CAP-<FAMILY>-<NNN>`.

Families:

| Code | Family |
|---|---|
| `SHELL` | Global navigation, search, personalization, overlays |
| `CRM` | Dashboard, contacts, pipeline, tasks, calendar, inbox |
| `BIZ` | Policies, commissions, booking, analytics, documents |
| `COMMS` | Phone, SMS, email |
| `QUOTE` | Product quoting and saved quotes |
| `INS` | Life, Medicare, ACA workflows |
| `AI` | General, voice, quoting, underwriting, build |
| `AUTO` | Automations, campaigns, forms |
| `ADMIN` | Settings, agency, organizations, support |
| `PLAT` | Auth, data, jobs, files, observability, updates |

Rules:

- IDs are never renumbered or reused.
- Aliases share an effective-screen note but retain route-specific IDs.
- Split a capability only when acceptance criteria and ownership genuinely diverge.
- Record deprecated IDs rather than deleting them from history.

## Implementation statuses

| Status | Meaning | Minimum proof |
|---|---|---|
| `FUNCTIONAL` | Intended boundary works end to end | Current test/runtime proof for that boundary |
| `PARTIAL` | Meaningful behavior works; required parts are incomplete | Current proof plus an explicit gap |
| `MOCK` | UI/simulation exists without the real dependency | Current local rendering/interaction proof |
| `MISSING` | No meaningful local implementation | Source/runtime check |
| `BLOCKED` | An explicit evidence, access, safety, or dependency gate prevents completion | Named blocker and safe next proof |

`FUNCTIONAL` is boundary-specific. Phase 1 requires an end-to-end functional development path through a local service or lawful sandbox/test adapter where feasible. Deterministic test doubles prove isolated behavior but cannot alone earn Phase 1 `FUNCTIONAL`. A vendor-gated path may remain `BLOCKED` only with an owned adapter contract, documented blocker, and strongest lawful substitute.

## Evidence statuses

| Status | Meaning | Required note |
|---|---|---|
| `LIVE-VERIFIED` | Direct safe observation in the authenticated live UI | Audit/source ID, route, state, date |
| `LOCAL-VERIFIED` | Current repository or local runtime evidence | File/symbol/test/route |
| `PRIOR-VERIFIED` | Earlier credible evidence not current | Source ID/date and recheck need |
| `GATED` | Blank, unavailable, setup/activation dependent, or unsafe to exercise | Gate reason; no invented behavior |
| `INFERRED` | Requirement/implication derived from evidence | Inputs and assumption |

Multiple evidence labels may support one capability; list the strongest current label first.

## Priority

| Priority | Meaning |
|---|---|
| `P0` | Safety, data loss, security, legal, or phase-gate blocker |
| `P1` | Core workflow or high-parity blocker |
| `P2` | Important completeness, usability, or operational gap |
| `P3` | Refinement, optimization, or low-impact parity detail |

## State transition rules

- `MISSING → MOCK`: representative synthetic interface/state exists.
- `MOCK → PARTIAL`: meaningful owned behavior persists or coordinates locally.
- `PARTIAL → FUNCTIONAL`: all acceptance criteria for the named phase boundary pass.
- Any status → `BLOCKED`: only when a named gate prevents safe proof or implementation.
- `BLOCKED` never implies failure; it preserves epistemic honesty.
- A live UI observation cannot by itself promote a local status.
- A Phase 1 `FUNCTIONAL` capability can still need Phase 2 hardening for production credentials, encryption, authorization, recovery, observability, capacity, rotation, migration safety, and limited-real-use approval.

## Evidence record template

| Field | Required content |
|---|---|
| Capability | Stable ID and name |
| Status | One implementation status |
| Evidence | One or more evidence statuses |
| Source | Audit observation, file/symbol, test, or official reference |
| Scope | Live, local synthetic, local production, or public SaaS |
| Date | ISO date for time-sensitive evidence |
| Next proof | Smallest safe action that can change confidence/status |

## Review rule

If two sources disagree, do not silently choose one. Record the discrepancy in [Unresolved evidence](../01-audits/unresolved-evidence.md), preserve both sources, and define a safe recheck.
