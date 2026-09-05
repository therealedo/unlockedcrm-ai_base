# Current infrastructure

> The current build is a fictional-data browser prototype. It is not safe for real PII/PHI, limited production use, or SaaS.

**Evidence:** `LOCAL-VERIFIED` from the current repository, Engram audit #647, renewal-foundation checks, and `DEP-AUDIT-2026-09-04`. Durable CRM persistence remains planned until the PostgreSQL renewal slice lands; target decisions below are planning, not implemented state.

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
| Tests | 15 Playwright tests plus 15 focused Vitest Foundation tests |
| Hosting integration | Vinext/Vite with OpenAI Sites and Cloudflare plugins |
| Local infrastructure orchestration | `compose.yaml` defines PostgreSQL only; `dev:foundation` coordinates Compose plus host-run API/web processes |
| API foundation | Fastify exposes liveness and explicit `MIGRATIONS_UNAVAILABLE` readiness without generated persistence imports |
| Generated deployment metadata | Wrangler output, static headers, build ID |
| Dependency audit | Full and `--omit=dev` npm audits returned zero findings on 2026-09-04 |

Package scripts retain Vinext/Vite, Wrangler, and Playwright while pinning Node.js 24.18.0 and npm 12.0.2. `dev:foundation` is locally proven to start the PostgreSQL-only Compose service plus the host Fastify and web processes. `GET /health/live` returns HTTP 200 with `{"status":"live"}`; `GET /health/ready` returns HTTP 503 with `MIGRATIONS_UNAVAILABLE` without generated Prisma assets. The repository still does not install or run the official `next` package; Prisma generation, migrations, deterministic seed, repositories, and renewal behavior remain Unit 2 work.

## Dependency-security baseline

The current lockfile is `LOCAL-VERIFIED` with Node.js 24.18.0 and npm 12.0.2: a clean `npm ci`, `npm audit --json`, and `npm audit --omit=dev --json` completed with zero reported vulnerabilities. The direct update train keeps React, Vinext, Vite/RSC, and Cloudflare/Wrangler packages on compatible patched versions.

Two root overrides, `deepmerge-ts` 8.0.1 and `mysql2` 3.23.1, are active provisional mitigations for the Prisma Foundation integration. The integrated dependency graph resolves `@prisma/config` through `deepmerge-ts` 8.0.1 and Prisma through `mysql2` 3.23.1; retain and reverify these overrides until Prisma publishes a compatible patched dependency graph.

Vinext 1.0.0-beta.9 no longer exposes `image-size` through npm's installed dependency graph, but its published bundle still contains the 2.0.2 parser and invokes it for image metadata. Current application reachability is limited to trusted build metadata; this is a residual upstream risk, not a production-safety claim. Continue to prohibit untrusted build inputs and re-evaluate on each Vinext update.

## Framework is not infrastructure

Vinext/Next.js are frontend application frameworks, Fastify is the API HTTP framework, and Vite is build tooling. Railway, Vercel, OpenAI Sites, Cloudflare, and Wrangler are hosting/runtime choices. Frameworks do not supply hosting, data, jobs, identity, or compliant operations.

Keeping Vinext/Vite for the parity UI does not require cloud infrastructure. The Foundation shell runs its browser, health-only API, PostgreSQL service, and development dependencies on the user's Windows PC.

## Configured bindings

`.openai/hosting.json` declares no D1 database or R2 object store. Generated Wrangler configuration contains no database, bucket, queue, service, or secret binding. Static headers only add immutable caching for framework assets.

## Missing application infrastructure beyond Foundation

- No application containers; Compose currently supplies only the local PostgreSQL service.
- No server-side renewal domain API, domain validation, or durable CRM behavior beyond the health shell.
- No Prisma schema, migrations, seed, or workspace-scoped repositories.
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

The pinned host toolchain, Fastify health shell, PostgreSQL-only Compose file, and closed Windows foundation launcher are `FUNCTIONAL` for the Foundation boundary and `LOCAL-VERIFIED`. `GET /health/live` returns HTTP 200 with `{"status":"live"}`, while `GET /health/ready` returns HTTP 503 with `MIGRATIONS_UNAVAILABLE`. Prisma schema, migrations, deterministic seed, repositories, and renewal routes remain `MISSING`; local readiness therefore fails honestly until Unit 2 lands. Full application containerization remains deferred. Railway is only the unvalidated preferred Phase 2 candidate, and Vercel is only an optional frontend-preview candidate; neither is current infrastructure or a Phase 1 dependency. Supabase remains optional only as a future PostgreSQL hosting provider.

Python/FastAPI is not part of the core stack. A future Python process is permitted only as an isolated worker when a proven specialized library requires it; it cannot expose a second product API or own product data.

## Maintainability constraints

| File | Approximate audit size | Risk |
|---|---:|---|
| `components/crm-app.tsx` | 3,443 lines | Shell/state/forms plus unused duplicate screens |
| `components/live-parity-pages.tsx` | 3,435 lines | Active non-root screen monolith |
| `app/globals.css` | 5,830 lines | Broad cascade and responsive coupling |

Protect parity with behavior tests before consolidating the active renderer and legacy duplicates.

## Next proof

Follow the [target architecture](target-architecture.md) and [Phase 1 roadmap](../03-roadmap/phase-1-replica.md). The next proof is Unit 2: generate Prisma, apply the initial migration, replay the deterministic synthetic seed, exercise workspace-scoped repositories, and expose the renewal GET through `dev:local`. Add object storage, mail capture, queues, or other services only with slice evidence.
