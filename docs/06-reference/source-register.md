# Source register

Use this register to keep direct observation, local verification, approved planning, official reference, and inference distinct.

## Audits and prior decisions

| Source ID | Topic | Evidence type | Scope |
|---|---|---|---|
| `#647` | `audit/local/current-baseline` | `LOCAL-VERIFIED` | Current repository, 32 registered routes/30 effective screens, data/persistence/tests/infrastructure/security gaps |
| `#641` | `audit/live/core-business` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Shell, CRM, policies, commissions, booking, analytics, documents |
| `CONTACT-INTAKE-2026-09-08` | [Generic Create Contact audit](../01-audits/live-generic-create-contact.md) | `LIVE-VERIFIED` visible UI; `LOCAL-VERIFIED` code inspection; owner planning decision; selector/mutation limits `GATED` | Engram #1576 live form/menu, #1575 local comparison, #1567 approved generic birth-date/gender/tag field categories with AI/workflow deferred; no exact-schema or implementation approval; gender/tag choices and save/provider/backend validation remain unverified |
| `#643` | `audit/live/communications-insurance-tools` | `LIVE-VERIFIED`, some `GATED` | Phone, email, quoting, Life, Medicare, ACA, Build, AI, automation, campaigns, forms, Commission+ |
| `#642` | `audit/live/admin-settings-organizations` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Settings, Agency, IMO/FMO, More, Support, admin phone/email |
| `#648` | `architecture/documentation-system` | Prior decision | Hub/spoke docs and stable traceability |
| `#649` | `roadmap/phase-strategy` | Prior decision, superseded where this plan differs | Original three-phase boundary |
| `#650` | `architecture/integration-strategy` | Prior decision, refined | Adapter-first/vendor gates; simulators now satisfy Phase 1 external edges |
| `PLAN-2026-09-02` | Owner-approved architecture and phase pivot | Owner decision | Online-first single workspace; Vinext/Vite retained; Fastify on Node.js 24, PostgreSQL/Prisma, workspace seams; Railway preferred Phase 2 candidate; Vercel preview-only; Python core API rejected; hosted Phase 2; clean-room control plane Phase 3; native/offline deferred |
| `PLAN-DOCKER-2026-09-02` | Owner-approved Windows development topology | Owner decision | Host-run Vinext/Vite and Node.js/Fastify with exact Node/npm pins; Docker Desktop + Docker Compose for PostgreSQL and later slice-required infrastructure; one planned root startup command; no cloud required; full app containerization deferred pending measured parity problems |
| `DEP-AUDIT-2026-09-04` | Dependency-security baseline | `LOCAL-VERIFIED` | Historical clean npm install and zero-finding full/production audits after the React/Vinext/Vite/Cloudflare update train; superseded for Prisma reachability by `UNIT2A-2026-09-06`; the Vinext bundled-parser caveat remains explicit |
| `UNIT2A-2026-09-06` | Prisma generation and isolated PostgreSQL test harness | `LOCAL-VERIFIED` | Pinned Prisma/client/adapter 7.10.0 and pg 8.23.0; generate-first API checks; exact 54330 test DSN; adapter query; bounded Compose cleanup without volume deletion; no migration, seed, repository, or CRM route |
| `UNIT2B-2026-09-07` | Deterministic renewal persistence | `LOCAL-VERIFIED` | Initial migration, fixed seed replay/drift refusal, composite workspace constraints, partial uniqueness, immutable audit trigger, scoped repository, exact migration/seed commands, and bounded isolated PostgreSQL cleanup; no CRM route or browser authority change |
| `UNIT2B-FIX-2026-09-07` | Open-renewal read regression | `LOCAL-VERIFIED` | Tests-first isolated PostgreSQL/API proof: completed/absent tasks retain the open renewal, pending tasks take priority over completed history, and task-history audits remain scoped; nullable task assembly preserves relationship checks; no GET, completion command, or UI wiring |
| `UNIT2C-2026-09-07` | Renewal GET and local persistence startup | `LOCAL-VERIFIED` | Strict-TDD isolated PostgreSQL proof for GET 200/empty/400/404/503, persisted audit metadata, latest-event/null `asOf`, server-controlled identity, DSN-first startup, migrate/seed order, readiness, restart/no-op, and bounded cleanup; no POST or browser authority |
| `UNIT3A-2026-09-07` | Completion-aware seed classifier | `LOCAL-VERIFIED` | Strict-TDD pure and isolated PostgreSQL proof accepts only all-six-identities-absent initialization, exact pending replay, or exact completed replay with one valid completion event and shared timestamp; partial, extra, invalid-identity, timestamp, relationship, source, label, date, or audit drift refuses before writes; no POST or browser authority |
| `UNIT3B-2026-09-07` | Atomic renewal task completion | `LOCAL-VERIFIED` | Strict-TDD contract, isolated PostgreSQL, Fastify injection, and protected development restart proof: exact 400/404/409/503 errors, ignored untrusted identity headers, conditional task version update, open renewal, one immutable audit, and stable replay/concurrency version, timestamp, and event identity; browser authority remains unchanged |
| `UNIT4A-2026-09-07` | Isolated browser persistence harness | `LOCAL-VERIFIED` | Strict-TDD Windows runner owns isolated Compose PostgreSQL, generate/migrate/seed, test-only Fastify on 4310, Vinext on 4173, readiness, Playwright, and bounded cleanup; seeded renewal GET succeeds through the relative web proxy; development data and UI authority remain unchanged |
| `UNIT4B-2026-09-07` | Shared renewal reads and storage fence | `LOCAL-VERIFIED` | Validated workspace GET drives policy-list renewal rows and linked contact detail with loading, empty, error, retry, and not-found states; fixed server IDs are fenced from hydration and serialization while unrelated local records/preferences remain |
| `UNIT4C-2026-09-07` | Managed policy detail and Renewal Dashboard reads | `LOCAL-VERIFIED` | Exact stable-ID policy detail and current-graph dashboard rows/counts reuse the validated GET cache with route-aware empty, not-found, error, retry, and no-legacy-fallback behavior; rich detail, urgency, progress, filters, completion UI, and other projections remain missing |
| `UNIT4D-2026-09-07` | Home, Tasks, and Analytics Audit renewal reads | `LOCAL-VERIFIED` | Seven GET-consuming views reuse one validated cache across six canonical stable-ID-linked surfaces; exact renewal-only counts, loading/empty/error/retry, reload/storage separation, and preserved local prototype records are proven; completion UI/refetch remains pending |
| `UNIT5-2026-09-07` | Managed renewal completion/refetch | `LOCAL-VERIFIED` | Exact POST validation, disabled in-flight action, ambiguous same-version retry, confirmed-POST GET-only recovery, six-surface completion/open-renewal/one-audit consistency, storage clearing, reload, new-context durability, and isolated PostgreSQL cleanup |
| `CONTACT-FOUNDATION-2026-09-08` | Generic contact persistence foundation | `LOCAL-VERIFIED` | Strict-TDD isolated PostgreSQL proof for additive nullable contact fields, bounded ORIGINAL tags, idempotency receipt storage, Avery backfill, collision-checked Mara/Eli seeds, ordinary-row/event coexistence, protected-subgraph drift refusal, immutable contact events, and one shared Prisma lifecycle; no generic contact API/UI activation |
| `CONTACT-READS-2026-09-08` | Generic contact list/detail API | `LOCAL-VERIFIED` | Strict-TDD contract and isolated PostgreSQL proof for centralized authorization, exact errors, stable summary ordering, canonical tag/date detail projection, and production POST 404/no-write behavior; browser readers and creation remain unchanged |
| `CONTACT-NORMALIZATION-2026-09-08` | Generic contact dormant create boundary | `LOCAL-VERIFIED` | Strict-TDD proof for normalization, atomic contact/tag/event/receipt persistence, replay/conflict races, provenance, and rollback through a test-only registrar; production POST, browser cutover, and create activation remain absent |
| `CONTACT-READ-CLIENT-2026-09-09` | Dormant generic contact read client | `LOCAL-VERIFIED` | Strict-TDD unit proof for exact list/detail response validation, operation-scoped errors, abortable transport, API-native selectors, and safe route matching; no active caller or runtime responsiveness claim, browser authority unchanged, production POST 404 |

When a prior decision conflicts with `PLAN-2026-09-02`, the current governance and roadmap documents control. Historical audit observations remain unchanged.

## Current repository evidence

| Source | Supports |
|---|---|
| `package.json` and `package-lock.json` | React 19.2.8, Vinext 1.0.0-beta.9, Vite 8.0.16, Cloudflare Vite plugin 1.51.1, Wrangler 4.120.0, and Workers Types 5.20260801.1 are locked; full and `--omit=dev` npm audits returned zero findings on pinned Node.js 24.18.0/npm 12.0.2; `npm run dev` maps to `dev:local` for persistence startup; `dev:foundation` retains the explicit health-only path |
| Installed Vinext 1.0.0-beta.9 package inspection | The published bundle still contains and invokes `image-size` 2.0.2 for build-time image metadata even though npm no longer exposes the dependency edge; current use is limited to trusted build inputs and does not prove production safety |
| `vite.config.ts` | Vinext, OpenAI Sites, and Cloudflare Vite plugins |
| `.openai/hosting.json` | No D1 or R2 application-data binding |
| generated `dist/server/wrangler.json` audit | No database, bucket, queue, service, or secret bindings at audit time |
| `app/page.tsx:1-6` | Root entry renders `CrmApp` |
| `app/[...slug]/page.tsx:1-6` | Catch-all entry renders `CrmApp` |
| `components/crm-app.tsx:81-170` | 32-path registry |
| `components/crm-app.tsx:219-535` | Hydration, local persistence, seven create handlers |
| `components/crm-app.tsx:753-1023` | Root/non-root handoff and Home screen |
| `components/crm-app.tsx:1069-2815` | Unused duplicate legacy screens |
| `components/crm-app.tsx:2913-3439` | Search and create dialogs |
| `components/live-parity-pages.tsx` | Active non-root router, managed contact/policy/dashboard/task/audit renderers, shared validated link controls, other route screens, and context sidebars |
| `lib/{crm-route,renewal-workflow-client,renewal-workflow-selectors}.ts`; `hooks/use-renewal-workflow.ts` | Validated read/completion clients, exact-ID projections, shared cache invalidation, refetch, abort, and retry state |
| `lib/crm-data.ts:1-218` | Types, fixtures, and browser storage key |
| `app/globals.css` | Shell, preference, and responsive system |
| `tests/crm.spec.ts` | Browser proof for six managed surfaces, completion/refetch recovery, reload/storage separation, new-context durability, and no fallback |
| `playwright.config.ts`; `scripts/api-check.mjs`; `api/test/playwright-server.ts` | Dedicated Chromium base URL plus isolated PostgreSQL/API/web E2E lifecycle, exact test-DSN guard, readiness, and bounded owned-resource cleanup |
| Repository file inventory (2026-09-02) | No Dockerfile or Compose configuration at decision-recording time |
| `compose.yaml`; `api/src/{app,config,server}.ts`; `api/test/*`; `scripts/orchestrate.{mjs,test.ts}` | Foundation plus persistence-aware Windows startup, health/read API, canonical launcher/cleanup, and local verification evidence (`LOCAL-VERIFIED`) |
| `api/prisma/{schema.prisma,seed.ts,migrations/*}`; `api/src/{modules/renewals,plugins}/*`; `api/test/{domain,repository.pg,contact-foundation.pg}.test.ts` | Renewal persistence plus the additive generic-contact schema, safe fixed-subgraph classifier, bounded seeds, shared Prisma lifecycle, and immutable audit evidence (`LOCAL-VERIFIED`) |

These paths prove current implementation only. The renewal graph, generic-contact foundation/read API, and dormant atomic create/receipt persistence boundary are `LOCAL-VERIFIED`; production POST registration and UI activation remain inactive. Broader mutations, workers, hosted deployment, real adapters, and PWA remain planned or missing.

## Official external references

| Reference | Use boundary |
|---|---|
| [unLocked CRM Terms of Service](https://www.unlockedcrm.ai/terms-of-service) | Counsel review of contract/use boundary; no conclusion recorded |
| [unLocked CRM DPA](https://unlockedcrm.ai/dpa) | Counsel/privacy review; presence is not compliance proof |
| [U.S. Copyright Office Circular 33](https://www.copyright.gov/circs/circ33.pdf) | Ideas/methods versus protected expression planning |
| [USPTO likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion) | Trademark-clearance planning |
| [HHS HIPAA Security Rule resources](https://www.hhs.gov/hipaa/for-professionals/security/index.html) | Security planning, not certification |
| [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) | Commercial-email planning |
| [CMS Medicare communications and marketing guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines) | Medicare communications planning |
| [Telnyx A2P/10DLC quickstart](https://developers.telnyx.com/docs/messaging/10dlc/quickstart) | Messaging-registration candidate review |
| [Telnyx AI Services Addendum](https://telnyx.com/legal/ai-services-addendum) | Product-specific AI/data review |
| [Telnyx Acceptable Use Policy](https://telnyx.com/acceptable-use-policy) | Use/abuse gate review |
| [AWS HIPAA eligible services reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) | Service/configuration scope; not blanket compliance |
| [Cal.com availability documentation](https://cal.com/docs/availability) | Scheduling candidate research |
| [Compulife API](https://compulife.com/api/) | Commercial life-quote candidate research |
| [CMS NPPES downloadable files](https://download.cms.gov/nppes/NPI_Files.html) | Public provider-data candidate |
| [Docker Desktop installation on Windows](https://docs.docker.com/desktop/setup/install/windows-install/) | Selected local-development prerequisite and Windows/WSL/license review; not implementation proof |
| [Docker Compose](https://docs.docker.com/compose/) | Selected local multi-service orchestration reference; not proof that a Compose profile exists |
| [Fastify latest documentation](https://fastify.dev/docs/latest/) | Selected target HTTP framework reference; not implementation proof |
| [Railway Fastify deployment guide](https://docs.railway.com/guides/fastify) | Candidate deployment mechanics for a Fastify service; project spike still required |
| [Railway services](https://docs.railway.com/services) | Persistent/scheduled service candidate model for API and workers |
| [Railway PostgreSQL](https://docs.railway.com/databases/postgresql) | Candidate managed PostgreSQL topology; not backup/security/compliance approval |
| [Railway backups](https://docs.railway.com/volumes/backups) | Platform backup behavior and limitations to verify in project restore drills |
| [Railway healthchecks](https://docs.railway.com/deployments/healthchecks) | Deployment-time health behavior; continuous monitoring remains project-owned |
| [Vercel preview deployments](https://vercel.com/academy/svelte-on-vercel/preview-deployments) | Optional frontend-preview workflow only |

## Source rules

- Revalidate time-sensitive legal, vendor, pricing, feature, framework, and regulatory claims.
- Do not quote long vendor prose or copy proprietary UI expression.
- A visible control does not prove backend enforcement.
- A selected target does not prove current implementation.
- A workspace seam does not prove tenant isolation.
- An eligible service or signed agreement does not make the application compliant.
