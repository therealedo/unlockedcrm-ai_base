# Source register

Use this register to distinguish direct observation, local verification, prior evidence, official reference, and inference.

## Engram evidence

| Source ID | Topic | Evidence type | Scope |
|---|---|---|---|
| `#647` | `audit/local/current-baseline` | `LOCAL-VERIFIED` | Current repository, all 32 routes, data/persistence/tests/infrastructure/security gaps |
| `#641` | `audit/live/core-business` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Shell, core CRM, policies, commissions, booking, analytics, documents |
| `#643` | `audit/live/communications-insurance-tools` | `LIVE-VERIFIED`, some `GATED` | Phone, email, quoting, Life, Medicare, ACA, Build, AI, automation, campaigns, forms, Commission+ |
| `#642` | `audit/live/admin-settings-organizations` | `LIVE-VERIFIED`, some `GATED`/`PRIOR-VERIFIED` | Settings, Agency, IMO/FMO, More, Support, admin phone/email |
| `#648` | `architecture/documentation-system` | Decision | Hub/spoke docs, stable IDs/status/evidence/traceability |
| `#649` | `roadmap/phase-strategy` | Decision | Three gated phases and legal boundary |
| `#650` | `architecture/integration-strategy` | Decision | Adapter-first, replaceable vendors, product-specific gates |

## Current repository evidence

| Source | Supports |
|---|---|
| `app/page.tsx:1-6` | Root entry renders `CrmApp` |
| `app/[...slug]/page.tsx:1-6` | Catch-all entry renders `CrmApp` |
| `components/crm-app.tsx:81-170` | 32-path registry |
| `components/crm-app.tsx:219-535` | Hydration, local persistence, seven create handlers |
| `components/crm-app.tsx:753-1023` | Root/non-root handoff and Home screen |
| `components/crm-app.tsx:1069-2815` | Unused duplicate legacy screens |
| `components/crm-app.tsx:2913-3439` | Search and create dialogs |
| `components/live-parity-pages.tsx:375-465` | Active non-root router and aliases |
| `components/live-parity-pages.tsx:593-3434` | Active route screens/context sidebars |
| `lib/crm-data.ts:1-218` | Types, fixtures and storage key |
| `app/globals.css` | Shell, preferences and responsive system |
| `tests/crm.spec.ts:8-587` | 15 Playwright tests |
| `playwright.config.ts:1-21` | Chromium/viewport/server/artifact settings |
| `package.json`, `vite.config.ts`, `.openai/hosting.json` | Stack, scripts, hosting and empty bindings |

## Official external references

| Reference | Use boundary |
|---|---|
| [unLocked CRM Terms of Service](https://www.unlockedcrm.ai/terms-of-service) | Counsel review of contract/use boundary; no conclusion recorded here |
| [unLocked CRM DPA](https://unlockedcrm.ai/dpa) | Counsel/privacy review; presence is not compliance proof |
| [U.S. Copyright Office Circular 33](https://www.copyright.gov/circs/circ33.pdf) | Ideas/methods versus protected expression planning |
| [USPTO likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion) | Trademark clearance planning |
| [HHS HIPAA Security Rule resources](https://www.hhs.gov/hipaa/for-professionals/security/index.html) | Security/compliance planning, not certification |
| [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) | Commercial-email compliance planning |
| [CMS Medicare communications and marketing guidance](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-guidelines) | Medicare marketing/communications planning |
| [Telnyx A2P/10DLC quickstart](https://developers.telnyx.com/docs/messaging/10dlc/quickstart) | Messaging-registration candidate review |
| [Telnyx AI Services Addendum](https://telnyx.com/legal/ai-services-addendum) | Product-specific AI legal/data review |
| [Telnyx Acceptable Use Policy](https://telnyx.com/acceptable-use-policy) | Use/abuse gate review |
| [AWS HIPAA eligible services reference](https://aws.amazon.com/id/compliance/hipaa-eligible-services-reference/) | Service/configuration scope; not blanket compliance |
| [Cal.com availability documentation](https://cal.com/docs/availability) | Scheduling candidate research |
| [Compulife API](https://compulife.com/api/) | Commercial life quote candidate research |
| [CMS NPPES downloadable files](https://download.cms.gov/nppes/NPI_Files.html) | Public provider-data candidate |

## Source rules

- Revalidate time-sensitive legal, vendor, pricing, feature and regulatory sources before a decision.
- Do not quote long vendor prose; summarize neutrally and link.
- A visible live control does not prove backend enforcement.
- A candidate service's eligibility or agreement does not make the application compliant.
