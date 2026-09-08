# Generic Create Contact audit

**Audit date:** 2026-09-08. **Scope:** Phase 1 generic intake only, `CAP-CRM-105` / `GAP-CRM-001`. Bounded read-only observation is complete, with explicit selector and mutation gates below. The live form differs from the local approximation; local creation remains `PARTIAL` and browser-owned.

**Sources:** Engram #1576 (`LIVE-VERIFIED` visible UI, with limits below), #1575 (`LOCAL-VERIFIED` code inspection only), and owner scope decision #1567. This snapshot refines the [historical contact audit](live-shell-and-core-crm.md#contacts); it is not a schema or implementation approval.

## Visible live intake

Read-only inspection used agent-created temporary Brave tabs at `/contacts` in the authenticated application. After a connection interruption and owner reconnection, a fresh tab reproduced the same blank form. No form values were entered or submitted. The final temporary tab closed successfully; the managed-tab inventory was empty, and the user-owned tab was left untouched.

| Area | Direct observation |
|---|---|
| Entry | The generic action is labeled Create Contact. Separate ACA, Medicare, and Life actions carry Beta labels; those actions and the template action were not opened. |
| Identity and channels | First and last name have required markers. Email and phone fields appear with guidance requiring at least one channel. This is visible guidance, not executed validation proof. |
| Additional fields | Date of birth has month/day/year controls and a calendar affordance. Gender starts unselected; notes and Add tags are present. |
| Workflow | Defaults to Do not enroll. The opened menu showed only that selected choice in this account; available enrollments and workflow behavior are not established. |
| Assistance | Contact Assist exposes text, attachment, and AI-fill affordances. The blank Fill contact action is disabled; none was exercised. |
| Create action | The blank form exposes Create contact without a disabled marker. No submission or resulting error/success state was inspected. |
| Not observed | No product-type/product-interest or lead-source field appeared in the inspected generic form. |

## Difference from current local code

These are repository findings, not newly executed runtime tests.

| Boundary | Current local implementation |
|---|---|
| Entry routing | All four Medicare/Life/ACA/Other choices open the same generic modal; the chosen type is discarded (`components/live-parity-pages.tsx:776-783`). |
| Fields | The modal includes names, email, phone, product, source, notes, and workflow, but no birth-date, gender, or tag inputs (`components/crm-app.tsx:3175-3227`). |
| Validation | Names are HTML-required and email uses `type=email`. The handler trims names/channels and silently returns when a name or both channels are absent (`components/crm-app.tsx:339-346`). |
| Stored result | Creation assigns a browser UUID and retains product/source but discards notes/workflow. The contact graph remains in localStorage (`components/crm-app.tsx:347-370,254-273`; `lib/crm-data.ts:1-16`). |

## Evidence limits and next proof

- `GATED` / unverified: submit validation, malformed/duplicate inputs, save success/failure, persistence, workflow enrollment, AI fill, and attachments. None may be inferred from visible controls.
- `GATED`: gender options and tag-menu contents. Supported read-only control inspection returned stale/detached actions; refreshed state still showed both controls collapsed. No option enum, tag catalog, or selection behavior is inferred.
- Calendar behavior and responsive sizes were not tested.
- Specialized insurance intake and households/family trees remain outside the owner-approved first intake slice. No existing record, account setting, integration, or trial state was changed.

## Approved planning scope

Owner decision #1567 includes birth date, gender, and tags in the proposed first generic intake slice, alongside the baseline names, email, phone, and notes. AI assist and workflow enrollment remain deferred. This approves field categories only, not implementation, an exact schema, or provider behavior.

Gender options, the tag catalog and selection behavior remain unverified; the tag-management boundary and exact synthetic schema remain unplanned. Product/source fields are not implicitly authorized. A subsequent proposal must make these boundaries explicit without inventing live behavior.

Implementation coverage and remaining proof belong in the [capability matrix](../02-traceability/capability-matrix.md) and [gap register](../02-traceability/gap-register.md). Provenance is recorded in the [source register](../06-reference/source-register.md).
