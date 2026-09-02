# Audit index

Audits preserve what was observed without turning it into a product guarantee. They are evidence snapshots, not implementation specifications by themselves.

## Evidence sources

| Audit | Scope | Primary evidence |
|---|---|---|
| [Live shell and core CRM](live-shell-and-core-crm.md) | Shell, dashboard, AI workspace, inbox, contacts, pipeline, calendar, tasks | Engram #641 |
| [Live business records](live-business-records.md) | Policies, commissions, booking, analytics, documents | Engram #641 |
| [Live communications](live-communications.md) | Phone, SMS, email, identity, A2P, delivery states | Engram #643 and #642 |
| [Live insurance and quoting](live-insurance-and-quoting.md) | Quoters, Life, Medicare, ACA, Commission+ | Engram #643 |
| [Live AI, automation, campaigns, and forms](live-ai-automation-campaigns-forms.md) | unLocked AI, Agent AI, Build, underwriting, workflows, campaigns, forms | Engram #641 and #643 |
| [Live administration, settings, and organizations](live-admin-settings-organizations.md) | Settings, Agency, IMO/FMO, More, Support | Engram #642 |
| [Local current state](local-current-state.md) | Repository, routes, fixtures, persistence, tests, infrastructure, gaps | Engram #647 |
| [Unresolved evidence](unresolved-evidence.md) | Gated, blank, tenant-dependent, or unsafe states | Engram #641–#643 |

## Reading rules

- `LIVE-VERIFIED`: directly observed safely in the authenticated live UI.
- `LOCAL-VERIFIED`: verified in the current repository or local runtime.
- `PRIOR-VERIFIED`: credible older evidence not rechecked.
- `GATED`: blank, inaccessible, setup-dependent, activation-dependent, or unsafe to exercise.
- `INFERRED`: implementation requirement derived from evidence.

Tenant-specific sample counts, plan prices, balances, dates, and marketing claims are not stable contracts. Long vendor prose and account identity are intentionally omitted.

## Safe audit method

1. Use a temporary tab and read-only inspection.
2. Record route, visible hierarchy, controls, state, and settle behavior.
3. Do not send, call, quote, submit, publish, upload, export, connect, activate, save settings, delete, or affect trial/account state.
4. Mark inaccessible surfaces `GATED` rather than guessing.
5. Close only the tabs created for the audit.
6. Add capability IDs and a next-proof action in traceability docs.

## Next step

Use the [capability matrix](../02-traceability/capability-matrix.md) for implementation status and the [source register](../06-reference/source-register.md) for provenance.
