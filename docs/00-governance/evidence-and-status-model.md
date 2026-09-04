# Evidence, capability, and status model

This model prevents visual similarity, simulated providers, and planned architecture from being mistaken for functional or production evidence.

## Stable capability IDs

Format: `CAP-<FAMILY>-<NNN>`.

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
| `PLAT` | API, identity, data, jobs, files, observability, updates |

IDs are never renumbered or reused. Split an owned workflow from its external provider boundary when their acceptance criteria or status diverge.

## Implementation statuses

| Status | Meaning | Minimum proof |
|---|---|---|
| `FUNCTIONAL` | The explicitly named boundary works end to end | Current API/runtime/test proof for that boundary |
| `PARTIAL` | Meaningful behavior works but required behavior remains | Current proof plus an explicit gap |
| `MOCK` | A deterministic simulator or representative UI exists without the real dependency | Current interaction/contract proof and explicit simulated boundary |
| `MISSING` | No meaningful local implementation | Source/runtime check |
| `BLOCKED` | An evidence, access, safety, or dependency gate prevents safe progress | Named blocker and safe next proof |

A Phase 1 owned workflow may be `FUNCTIONAL` while its external provider boundary is `MOCK`. Record both statuses or use separate capability IDs. A hard-coded card without persisted behavior, state transitions, or contract-backed effects remains `MOCK`.

Provider-neutral simulators can satisfy the Phase 1 provider boundary when they implement the owned contract, all required states, deterministic contract tests, and synthetic events/audit. They never prove real vendor integration.

## Evidence statuses

| Status | Meaning | Required note |
|---|---|---|
| `LIVE-VERIFIED` | Direct safe observation in the authenticated live UI | Audit/source, route, state, date |
| `LOCAL-VERIFIED` | Current repository or local runtime evidence | File/symbol/test/route |
| `PRIOR-VERIFIED` | Earlier credible evidence not current | Source/date and recheck need |
| `GATED` | Blank, unavailable, setup/activation-dependent, or unsafe to exercise | Gate reason; no invented behavior |
| `INFERRED` | Requirement or implication derived from evidence | Inputs and assumption |

Planned technology is not `LOCAL-VERIFIED` implementation. Label it `INFERRED` or as an explicit owner decision until runtime evidence exists.

## Priority

| Priority | Meaning |
|---|---|
| `P0` | Safety, data loss, security, legal, or phase-gate blocker |
| `P1` | Core workflow or high-parity blocker |
| `P2` | Important completeness, usability, or operational gap |
| `P3` | Refinement, optimization, or low-impact parity detail |

## State transition rules

- `MISSING → MOCK`: representative deterministic interface/state exists.
- `MOCK → PARTIAL`: meaningful owned behavior persists or coordinates.
- `PARTIAL → FUNCTIONAL`: every acceptance criterion for the named boundary passes.
- Any status → `BLOCKED`: only when a named gate prevents safe proof or implementation.
- Live UI evidence cannot promote local implementation status.
- Phase 1 functional core may still need Phase 2 production security, hosting, and real providers.
- Phase 3 tenant/control-plane readiness is never inferred from Phase 1 `workspace_id` seams.

## Evidence record template

| Field | Required content |
|---|---|
| Capability | Stable ID and name |
| Boundary | Owned workflow / provider adapter / product data plane / control plane |
| Status | One implementation status |
| Evidence | One or more evidence statuses |
| Source | Audit, file/symbol, test, official reference, or owner decision |
| Scope | Live / Phase 1 local synthetic / Phase 2 hosted single-workspace / Phase 3 SaaS |
| Date | ISO date for time-sensitive evidence |
| Next proof | Smallest safe action that can change confidence/status |

## Review rule

When sources disagree, record the discrepancy in [Unresolved evidence](../01-audits/unresolved-evidence.md). Preserve direct observations; add planning changes as separately labeled decisions.
