# Glossary

| Term | Meaning in this repository |
|---|---|
| A2P/10DLC | U.S. application-to-person messaging registration/lifecycle; not merely a UI badge |
| Adapter | Replaceable implementation of an owned provider-neutral interface |
| BAA | Business Associate Agreement; scope and product coverage require legal review |
| Capability ID | Stable `CAP-<FAMILY>-<NNN>` traceability identifier |
| Clean room | Independent implementation from approved neutral specifications, with source/expression separation and provenance |
| DNC | Do-not-call/suppression state requiring enforceable policy |
| Durable job | Persisted, idempotent work that survives restart and supports retry/reconciliation |
| Effective screen | Unique renderer; aliases may expose multiple paths to one screen |
| Evidence status | `LIVE-VERIFIED`, `LOCAL-VERIFIED`, `PRIOR-VERIFIED`, `GATED`, or `INFERRED` |
| Deterministic test double | Isolated automated-test implementation; required for tests but not a substitute for Phase 1 end-to-end local/sandbox proof |
| Gated | Unavailable, blank, setup/activation-dependent, or deliberately unsafe to exercise |
| HIPAA-ready | Not a current claim; requires applicable safeguards, agreements, operations and independent review |
| IMO/FMO | Insurance marketing organization hierarchy represented in the live workspace |
| Implementation status | `FUNCTIONAL`, `PARTIAL`, `MOCK`, `MISSING`, or `BLOCKED` |
| Local production readiness | Phase 2 limited-use security/operations boundary, not public SaaS readiness |
| MAPD | Medicare Advantage plan including prescription drug coverage |
| NPPES/NPI | CMS provider enumeration system and National Provider Identifier data |
| PHI/PII | Protected health/personal information; prohibited in Phase 1 |
| Provider port | Owned interface used by domain logic; implemented by deterministic test doubles, local services, or vendor sandbox/production adapters |
| QLE | Qualifying life event used in ACA enrollment eligibility contexts |
| RPO/RTO | Recovery-point and recovery-time objectives |
| SOA | Medicare Scope of Appointment workflow/document |
| Synthetic data | Fictional, non-identifying records safe for tests and demonstrations |
| Tenant isolation | Enforced separation across every query, job, file, cache, webhook, search, AI tool and export |
| T65 | Turning-65 Medicare workflow window |
| Unwired | Visible live cue that a dependency/integration is not connected |
