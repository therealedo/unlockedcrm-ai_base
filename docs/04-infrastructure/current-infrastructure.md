# Current infrastructure

> The current build is a fictional-data browser prototype plus local synthetic renewal GET and task-completion POST routes. It is not safe for real PII/PHI, limited production use, or SaaS.

**Evidence:** `LOCAL-VERIFIED` from the current repository, Engram audit #647, renewal-foundation checks, `DEP-AUDIT-2026-09-04`, `UNIT2A-2026-09-06`, `UNIT2B-2026-09-07`, `UNIT2C-2026-09-07`, and `UNIT4A-2026-09-07`. Other views and mutations remain browser-authoritative.

## Verified current stack

| Layer | Current implementation |
|---|---|
| UI/runtime | React 19.2.8 through Vinext 1.0.0-beta.9 |
| Build | Vite 8.0.16 and TypeScript 5.9 |
| Web runtime requirement | Node 24.18.0 |
| Toolchain pinning | `.node-version`, `engines.node`, and `packageManager` pin Node 24.18.0/npm 12.0.2 |
| Routing | Root and catch-all entries render one client `CrmApp`; navigation uses custom `pushState` handling |
| Persistence | One browser `localStorage` JSON object |
| Styling | One large global CSS file plus mostly unused generated UI components |
| Tests | 16 Playwright tests plus focused Vitest Foundation/API contracts; E2E owns isolated PostgreSQL/API/web startup and cleanup |
| Hosting integration | Vinext/Vite with OpenAI Sites and Cloudflare plugins |
| Local infrastructure orchestration | `compose.yaml` defines PostgreSQL only; `npm run dev` validates the development DSN and runs generate/migrate/seed before host API/web; `dev:foundation` remains available |
| API foundation | Fastify exposes liveness/readiness plus local renewal GET and atomic task-completion POST routes; Foundation mode remains generation-independent and reports `MIGRATIONS_UNAVAILABLE` readiness |
| Generated deployment metadata | Wrangler output, static headers, build ID |
| Dependency audit | Full and `--omit=dev` npm audits returned zero findings on 2026-09-04 |

Package scripts retain Vinext/Vite, Wrangler, and Playwright while pinning Node.js 24.18.0 and npm 12.0.2. `npm run dev` is locally proven to run PostgreSQL readiness, generate/migrate/seed, and the host Fastify/web processes. `GET /health/live`, local `GET /health/ready`, and the workspace-scoped renewal GET return HTTP 200. Prisma generation/connectivity, migration, deterministic seed, and scoped repository are `LOCAL-VERIFIED`; Foundation readiness still returns HTTP 503 `MIGRATIONS_UNAVAILABLE` by design.

`npm run test:e2e` uses only project `unlockedcrm-renewal-test`, database port 54330, test-only API port 4310, and web port 4173. It validates the exact test DSN before effects, generates, migrates, seeds, waits for both servers, runs Playwright without reusing listeners, then terminates owned process trees and removes only the isolated Compose container/network. The development database and volumes are not reset or removed.

## Dependency-security baseline

The current lockfile is `LOCAL-VERIFIED` with Node.js 24.18.0 and npm 12.0.2: a clean `npm ci`, `npm audit --json`, and `npm audit --omit=dev --json` completed with zero reported vulnerabilities. The direct update train keeps React, Vinext, Vite/RSC, and Cloudflare/Wrangler packages on compatible patched versions.

Two inherited root overrides, `deepmerge-ts` 8.0.1 and `mysql2` 3.23.1, remain provisional. Prisma 7.10.0 generation and the isolated runtime harness pass with them, but that bounded proof does not establish broader compatibility for later migrations or deployment.

Vinext 1.0.0-beta.9 no longer exposes `image-size` through npm's installed dependency graph, but its published bundle still contains the 2.0.2 parser and invokes it for image metadata. Current application reachability is limited to trusted build metadata; this is a residual upstream risk, not a production-safety claim. Continue to prohibit untrusted build inputs and re-evaluate on each Vinext update.

## Framework is not infrastructure

Vinext/Next.js are frontend application frameworks, Fastify is the API HTTP framework, and Vite is build tooling. Railway, Vercel, OpenAI Sites, Cloudflare, and Wrangler are hosting/runtime choices. Frameworks do not supply hosting, data, jobs, identity, or compliant operations.

Keeping Vinext/Vite for the parity UI does not require cloud infrastructure. The local shell runs its web server, renewal read/command API, PostgreSQL service, and development dependencies on the user's Windows PC.

## Configured bindings

`.openai/hosting.json` declares no D1 database or R2 object store. Generated Wrangler configuration contains no database, bucket, queue, service, or secret binding. Static headers only add immutable caching for framework assets.

## Missing application infrastructure beyond Foundation

- No application containers; Compose currently supplies only the local PostgreSQL service.
- Browser API authority is limited to policy-list renewal rows and linked contact detail; broader views and mutations remain browser-owned, and the domain API remains limited to renewal GET and task-completion POST routes.
- Prisma migration, reviewed SQL constraints, a completion-aware exact-state seed classifier, domain assembly, workspace-scoped repository, and immutable audits feed both routes. The completion command conditionally updates one task and appends one exact audit in a transaction.
- No secure authentication, MFA, fixed-role enforcement, or centralized request identity.
- No object storage, scanning boundary, durable worker, scheduler, outbox/inbox, or webhook ingress.
- No phone/SMS, delivered email, calendar, quote/enrollment, commission sync, AI/voice, or OCR adapter implementation.
- No server audit/event model, consent/suppression enforcement, retention, deletion, or scoped export.
- No secret/key management, observability, backup/restore, signed upgrades, or incident runbooks.
- No web manifest, service worker, or offline synchronization; the current application is not a PWA.

## Approved target direction

| Time | Planned change |
|---|---|
| Phase 1 | Extend the implemented pinned host processes and PostgreSQL-only Foundation with Prisma migrations/seed, reviewed SQL escape hatches, bounded TypeScript workers, workspace seams, and complete synthetic workflows |
| Phase 1 provider boundaries | Use deterministic provider-neutral simulators with owned ports, setup/disconnect/failure/retry states, contract tests, and synthetic audit/events; do not present hard-coded cards as functionality |
| Phase 2 | Run an explicit Railway deployment spike, then decide whether to host the persistent Fastify API, bounded workers, and PostgreSQL there; if promoted, add production identity, encryption, backup/restore, observability, upgrades, operations, and selected real providers; Vercel remains preview-only |
| Phase 3 | Build the clean-room public product and a separate SaaS control plane; the control plane may call product APIs/events but must not access CRM product tables directly |

The pinned host toolchain, Fastify health shell, PostgreSQL-only Compose file, and closed Windows launcher are `FUNCTIONAL` for the implemented boundary and `LOCAL-VERIFIED`. Prisma generation/connectivity, migration, deterministic seed, and scoped repository are `LOCAL-VERIFIED`; renewal GET, atomic completion POST, and persistence-aware readiness remain `PARTIAL` because broader mutations and browser authority are missing. Cross-platform host support is owner-deferred, and no production readiness is implied.

Python/FastAPI is not part of the core stack. A future Python process is permitted only as an isolated worker when a proven specialized library requires it; it cannot expose a second product API or own product data.

## Maintainability constraints

| File | Approximate audit size | Risk |
|---|---:|---|
| `components/crm-app.tsx` | 3,443 lines | Shell/state/forms plus unused duplicate screens |
| `components/live-parity-pages.tsx` | 3,435 lines | Active non-root screen monolith |
| `app/globals.css` | 5,830 lines | Broad cascade and responsive coupling |

Protect parity with behavior tests before consolidating the active renderer and legacy duplicates.

## Next proof

Follow the [target architecture](target-architecture.md) and [Phase 1 roadmap](../03-roadmap/phase-1-replica.md). Units 4–5 next move browser authority and prove cross-surface consistency. Add services only with slice evidence.
