# Current infrastructure

> The current build is a fictional-data browser prototype. It is not safe for real PII/PHI, limited production use, or SaaS.

**Evidence:** `LOCAL-VERIFIED` from the current repository and Engram audit #647. Target decisions below are planning, not implemented state.

## Verified current stack

| Layer | Current implementation |
|---|---|
| UI/runtime | React 19.2.6 through Vinext 1.0.0-beta.5 |
| Build | Vite 8 and TypeScript 5.9 |
| Web runtime requirement | Node 22.13 or newer |
| Toolchain pinning | `engines.node` is `>=22.13.0`; `package-lock.json` exists; no `packageManager` or exact Node/npm pin |
| Routing | Root and catch-all entries render one client `CrmApp`; navigation uses custom `pushState` handling |
| Persistence | One browser `localStorage` JSON object |
| Styling | One large global CSS file plus mostly unused generated UI components |
| Tests | 15 Playwright tests, Chromium only |
| Hosting integration | Vinext/Vite with OpenAI Sites and Cloudflare plugins |
| Local infrastructure orchestration | None; no Dockerfile, Compose configuration, or local PostgreSQL service |
| Generated deployment metadata | Wrangler output, static headers, build ID |

Package scripts invoke `vinext dev`, `vinext build`, Wrangler for the generated server bundle, and Playwright. The repository does not install or run the official `next` package, pin an exact Node/npm toolchain, or expose a command that starts infrastructure plus both application processes.

## Framework is not infrastructure

Vinext/Next.js are frontend application frameworks, Fastify is the selected target backend HTTP framework, and Vite is build tooling. Railway, Vercel, OpenAI Sites, Cloudflare, and Wrangler are hosting/runtime choices. Frameworks do not supply hosting, data, jobs, identity, or compliant operations.

Keeping Vinext/Vite for the parity UI does not require cloud infrastructure. Phase 1 can run its browser, planned API, PostgreSQL, and development dependencies on the user's Windows PC.

## Configured bindings

`.openai/hosting.json` declares no D1 database or R2 object store. Generated Wrangler configuration contains no database, bucket, queue, service, or secret binding. Static headers only add immutable caching for framework assets.

## Missing application infrastructure

- No Dockerfile, Docker Compose configuration, or reproducible local service profile.
- No server-side CRM API or validation.
- No PostgreSQL database, Prisma schema, migrations, or workspace-scoped repositories.
- No secure authentication, MFA, fixed-role enforcement, or centralized request identity.
- No object storage, scanning boundary, durable worker, scheduler, outbox/inbox, or webhook ingress.
- No phone/SMS, delivered email, calendar, quote/enrollment, commission sync, AI/voice, or OCR adapter implementation.
- No server audit/event model, consent/suppression enforcement, retention, deletion, or scoped export.
- No secret/key management, observability, backup/restore, signed upgrades, or incident runbooks.
- No web manifest, service worker, or offline synchronization; the current application is not a PWA.

## Approved target direction

| Time | Planned change |
|---|---|
| Phase 1 | Keep the current parity UI; pin exact Node.js 24 LTS/npm versions; run Vinext/Vite and Fastify on the Windows host; use Docker Desktop + Docker Compose for infrastructure starting with PostgreSQL; add Prisma with reviewed custom SQL escape hatches, bounded TypeScript workers, workspace seams, complete synthetic workflows, and one root startup command |
| Phase 1 provider boundaries | Use deterministic provider-neutral simulators with owned ports, setup/disconnect/failure/retry states, contract tests, and synthetic audit/events; do not present hard-coded cards as functionality |
| Phase 2 | Run an explicit Railway deployment spike, then decide whether to host the persistent Fastify API, bounded workers, and PostgreSQL there; if promoted, add production identity, encryption, backup/restore, observability, upgrades, operations, and selected real providers; Vercel remains preview-only |
| Phase 3 | Build the clean-room public product and a separate SaaS control plane; the control plane may call product APIs/events but must not access CRM product tables directly |

Fastify, the Node.js API, Docker/Compose orchestration, local PostgreSQL, exact Node/npm pins, and the combined root startup command are not implemented. The selected Phase 1 topology runs Vinext/Vite and Fastify directly on the Windows host while Compose manages PostgreSQL and later slice-required infrastructure. Full application containerization is deferred unless measured environment-parity problems justify it. Railway is only the unvalidated preferred Phase 2 candidate, and Vercel is only an optional frontend-preview candidate; neither is current infrastructure or a Phase 1 dependency. Supabase remains optional only as a future PostgreSQL hosting provider.

Python/FastAPI is not part of the core stack. A future Python process is permitted only as an isolated worker when a proven specialized library requires it; it cannot expose a second product API or own product data.

## Maintainability constraints

| File | Approximate audit size | Risk |
|---|---:|---|
| `components/crm-app.tsx` | 3,443 lines | Shell/state/forms plus unused duplicate screens |
| `components/live-parity-pages.tsx` | 3,435 lines | Active non-root screen monolith |
| `app/globals.css` | 5,830 lines | Broad cascade and responsive coupling |

Protect parity with behavior tests before consolidating the active renderer and legacy duplicates.

## Next proof

Follow the [target architecture](target-architecture.md) and [Phase 1 roadmap](../03-roadmap/phase-1-replica.md). The first infrastructure proof pins exact Node.js 24 LTS/npm versions, starts PostgreSQL through Docker Desktop + Docker Compose, and uses one root command to check/start infrastructure plus the host-run UI and API before migration, seed, health, and tests. Add object storage, mail capture, queues, or other services only with slice evidence.
