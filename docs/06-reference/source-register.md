# Source register

Use this register to keep direct observation, local verification, approved planning, official reference, and inference distinct.

## Audits and prior decisions

| Source ID | Topic | Evidence type | Scope |
|---|---|---|---|
| `#647` | `audit/local/current-baseline` | `LOCAL-VERIFIED` | Current repository, 32 registered routes/30 effective screens, data/persistence/tests/infrastructure/security gaps |
| `#641` | `audit/live/core-business` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Shell, CRM, policies, commissions, booking, analytics, documents |
| `#643` | `audit/live/communications-insurance-tools` | `LIVE-VERIFIED`, some `GATED` | Phone, email, quoting, Life, Medicare, ACA, Build, AI, automation, campaigns, forms, Commission+ |
| `#642` | `audit/live/admin-settings-organizations` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Settings, Agency, IMO/FMO, More, Support, admin phone/email |
| `#648` | `architecture/documentation-system` | Prior decision | Hub/spoke docs and stable traceability |
| `#649` | `roadmap/phase-strategy` | Prior decision, superseded where this plan differs | Original three-phase boundary |
| `#650` | `architecture/integration-strategy` | Prior decision, refined | Adapter-first/vendor gates; simulators now satisfy Phase 1 external edges |
| `PLAN-2026-09-02` | Owner-approved architecture and phase pivot | Owner decision | Online-first single workspace; Vinext/Vite retained; Fastify on Node.js 24, PostgreSQL/Prisma, workspace seams; Railway preferred Phase 2 candidate; Vercel preview-only; Python core API rejected; hosted Phase 2; clean-room control plane Phase 3; native/offline deferred |
| `PLAN-DOCKER-2026-09-02` | Owner-approved Windows development topology | Owner decision | Host-run Vinext/Vite and Node.js/Fastify with exact Node/npm pins; Docker Desktop + Docker Compose for PostgreSQL and later slice-required infrastructure; one planned root startup command; no cloud required; full app containerization deferred pending measured parity problems |
| `DEP-AUDIT-2026-09-04` | Dependency-security baseline | `LOCAL-VERIFIED` | Clean npm install; full and `--omit=dev` audits returned zero findings after the React/Vinext/Vite/Cloudflare update train; provisional Prisma overrides and the residual Vinext bundled-parser caveat remain explicit |

When a prior decision conflicts with `PLAN-2026-09-02`, the current governance and roadmap documents control. Historical audit observations remain unchanged.

## Current repository evidence

| Source | Supports |
|---|---|
| `package.json` and `package-lock.json` | React 19.2.8, Vinext 1.0.0-beta.9, Vite 8.0.16, Cloudflare Vite plugin 1.51.1, Wrangler 4.120.0, and Workers Types 5.20260801.1 are locked; full and `--omit=dev` npm audits returned zero findings on Node.js 24.18.0/npm 12.0.2; `engines.node` still allows `>=22.13.0`, `packageManager` is absent, and no combined startup script exists |
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
| `components/live-parity-pages.tsx:375-465` | Active non-root router and aliases |
| `components/live-parity-pages.tsx:593-3434` | Active route screens/context sidebars |
| `lib/crm-data.ts:1-218` | Types, fixtures, and browser storage key |
| `app/globals.css` | Shell, preference, and responsive system |
| `tests/crm.spec.ts:8-587` | 15 Playwright tests |
| `playwright.config.ts:1-21` | Chromium/viewport/server/artifact settings |
| Repository file inventory (2026-09-02) | No Dockerfile or Compose configuration at decision-recording time |

These paths prove current implementation only. The root `deepmerge-ts` and `mysql2` overrides are provisional for the approved incoming Prisma Foundation integration and are not active dependencies on the current main graph. Docker/Compose orchestration, Fastify, the Node.js 24 API, exact Node/npm pins, the combined root startup command, PostgreSQL, Prisma, workers, workspace scopes, Railway/Vercel deployment, real adapters, and PWA remain planned or missing until separately `LOCAL-VERIFIED`.

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
