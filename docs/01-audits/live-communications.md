# Live communications audit

**Evidence:** `LIVE-VERIFIED` unless marked. Sources: Engram #643 and #642. No call, message, email, number purchase, domain connection, recording, export, or save was initiated.

## Communication model

The live product separates:

- personal one-to-one email through connected inboxes;
- bulk delivery through sending domains/providers;
- SMS/voice identity, consent, routing, calling, recordings, voicemail, and A2P registration;
- a unified CRM activity/conversation projection.

Do not hide these boundaries behind one generic “send” adapter.

## Phone suite

Secondary views:

| View | Observed state and major controls |
|---|---|
| Phone Numbers | Numbers, pools, verified caller IDs; refresh/add; empty setup |
| Power Dialer | New session, keyboard-oriented dialing/disposition workflow; no session started |
| AI Receptionist | Disabled; five-step voice, data collection, actions, hours, instructions setup |
| Messaging | Compliance, analytics, restriction history; opt-out reminder and regional restriction settings |
| AI Auto-Reply | Disabled; review-before-send guidance, instructions, booking link |
| Scripts | Product/recruiting folders, search/type filter, create/view/edit |
| Voice | Recording/transcription, voicemail/text-back, dispositions, forwarding, SIP |
| Call Identity | Contact-card asset/identity inputs, first-call toggle, preview, metrics; no generation |
| Call Recordings | Recordings, coaching, export; filters and empty table |
| Voicemail | Greetings, drops, inbox, transcript fields; empty state |
| A2P Trust Center | Not started; brand, campaign/use case, linked numbers; registration warnings |
| Analytics | DID/call/answer/burnout metrics; empty 30-day state |
| Settings | Country, timeout, timezone, waiting/ID, rotation, spam/security, screen pop, campaigns, quiet hours |

Audit #642 saw several phone views with little or no content while #643 later observed substantive panels. Preserve route timing and tenant state when rechecking rather than treating this as a contradiction.

## Email suite

| View | Observed state and major controls |
|---|---|
| Email Delivery | Setup required; add domain, publish SPF/DKIM/MX, verify DNS |
| Dedicated Domain | Empty domain list and add action |
| Dedicated IP | Request flow; high-volume/warmup/reputation guidance |
| SMTP | Default delivery service, configuration/DNS actions, representative delivery stats |
| Gmail SMTP | Host/port/user/app password/from/reply/BCC fields; Google two-step prerequisite |
| Reply & Forward | `GATED`; route rendered no substantive panel |
| Analytics | Date range and CSV export; empty state |
| Risk | Reputation, spam, bounce, complaints, blacklist, domain health, Postmaster connection |
| Bounce | Empty bounce/complaint/unsubscribe activity |

Visible sample rates, domains, delivery percentages, and reputation values were tenant UI evidence, not guarantees and are intentionally not adopted as defaults.

## Phase boundaries

### Phase 1

- Functional inbox, thread, call, SMS, voicemail, recording, and delivery workflows through local services or authorized sandbox/test accounts.
- Test traffic is synthetic and restricted to explicitly owned numbers, inboxes, domains, and accounts.
- Explicit disconnected/setup/pending/approved/rejected/restricted states plus real test callbacks, retries, and reconciliation.
- Consent, DNC, quiet-hours, unsubscribe, bounce, complaint, and recording state machines enforced on the development path.
- Deterministic test doubles remain for automated tests but do not replace the end-to-end proof.
- A vendor gate requires an adapter contract, documented blocker, and strongest lawful simulator/test substitute; never scrape or bypass.

### Phase 2

- Harden the proven adapters with production credentials only after product-specific legal/security/BAA/conduit gates.
- Add credential vault/rotation, production webhook verification, capacity, rate/cost controls, retained audit, monitoring, backup/recovery and runbooks.
- Validate production recording/transcription consent and retention, domain reputation/suppression, and A2P/10DLC registration lifecycle before limited real use.

Telnyx is only a candidate. Product-specific [10DLC requirements](https://developers.telnyx.com/docs/messaging/10dlc/quickstart), the [AI Services Addendum](https://telnyx.com/legal/ai-services-addendum), and [Acceptable Use Policy](https://telnyx.com/acceptable-use-policy) require separate review. BAA/conduit treatment, recording/transcription, AI, consent, A2P/10DLC, retention, and data use remain gates.
