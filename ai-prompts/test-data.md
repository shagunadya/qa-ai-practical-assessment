# AI Prompts – Test Data

Prompts used to define, generate, and validate test data for UI and API tests.

**Modules:** `PrismStructure/data/ui-test-data.js`, `PrismStructure/data/api-test-data.js`  
**Strategy doc:** `docs/test-data-strategy.md`

---

## Chain DATA1 — Exploration anchors → static data modules

**Goal:** Lock stable UI/API data from exploration before automation.

### Iteration DATA1.1 — Product and demo user anchors

| Field | Content |
|-------|---------|
| **Prompt** | From `exploratory-notes.md`, define static test data for UI: seeded user, two in-stock product names, COD label, billing address fields, invalid login password. Centralize in `ui-test-data.js`. |
| **AI response** | Proposed `seededUser` (`customer@practicesoftwaretesting.com` / `welcome01`), `products.productA/B` (Combination Pliers, Pliers), `checkout.billingAddress`, `invalidLogin.password` = `wrongpassword`. |
| **Outcome** | Data module scaffold matches exploration selectors and labels. |
| **QA decision** | **Accept** anchors; use env overrides via `.env.example` for credentials. |
| **Artefacts** | `PrismStructure/data/ui-test-data.js`, `docs/test-data-strategy.md` §2–7 |

### Iteration DATA1.2 — API endpoints and invoice payload template

| Field | Content |
|-------|---------|
| **Prompt** | Mirror UI data in `api-test-data.js`. Add endpoints map, `payment_method: cash-on-delivery`, synthetic billing template for invoice POST. |
| **AI response** | `endpoints` object, `invoice.paymentMethod`, `buildInvoicePayload(cartId)`, shared seeded user from UI module. |
| **Outcome** | API client uses single data source for paths and COD enum. |
| **QA decision** | **Accept**; validate against live API in Chain DATA4. |
| **Artefacts** | `PrismStructure/data/api-test-data.js` |

---

## Chain DATA2 — Dynamic registration (UI + API)

**Goal:** Avoid duplicate email conflicts on repeated runs.

### Iteration DATA2.1 — UI dynamic user builder

| Field | Content |
|-------|---------|
| **Prompt** | TC-M-01 and TC-M-06 need unique users. Add `buildRegistrationUser(suffix)` with dynamic email and password. |
| **AI response** | `john.doe.{timestamp}@example.com`, password `Qa!Test{suffix}#9`, full address fields for extended registration form. |
| **Outcome** | `auth.smoke.spec.js` and `single-confirm.regression.spec.js` use dynamic users. |
| **QA decision** | **Accept** for UI registration paths. |
| **Artefacts** | `ui-test-data.js` — `buildRegistrationUser()` |

### Iteration DATA2.2 — API `buildRegistrationBody()`

| Field | Content |
|-------|---------|
| **Prompt** | API register tests need the same uniqueness pattern. Export `buildRegistrationBody()` for fixtures. |
| **AI response** | Same email/password pattern; `registrationBody` fixture adds `address`, `phone`, `dob` for API register payload. |
| **Outcome** | `api-fixtures.js` `registeredUser` fixture uses dynamic body. |
| **QA decision** | **Refine** — see Chain DATA3 (password policy). |
| **Artefacts** | `api-test-data.js`, `api-fixtures.js` |

---

## Chain DATA3 — API password policy (breached-password 422)

**Goal:** Fix registration failures against live API password rules.

### Iteration DATA3.1 — Static password rejected

| Field | Content |
|-------|---------|
| **Prompt** | `POST /users/register` returns 422 with breached-password message when using `SuperSecure@123` from strategy doc. Diagnose and fix test data only. |
| **AI response** | Identified HIBP-style rejection on common passwords; recommended dynamic high-entropy password per run. |
| **Outcome** | Register specs failed until password updated. |
| **QA decision** | **Accept** dynamic password in `buildRegistrationBody()`; keep `SuperSecure@123` only in CSV as manual reference text. |
| **Artefacts** | `api-test-data.js` — `Qa!Test{suffix}#9` |

### Iteration DATA3.2 — Verify register + login chain

| Field | Content |
|-------|---------|
| **Prompt** | Re-run API auth specs after password fix. |
| **AI response** | `auth-lifecycle.smoke.api.spec.js` and `register.api.spec.js` passed. |
| **Outcome** | **Pass** on 2026-08-10 session. |
| **QA decision** | **Accept** — document in `automation-and-debugging.md` Interaction 7. |
| **Artefacts** | Debugging log row: API register `422` password |

---

## Chain DATA4 — Invoice billing geo-validation

**Goal:** Satisfy `POST /invoices` billing rules on live API.

### Iteration DATA4.1 — Generic synthetic billing fails

| Field | Content |
|-------|---------|
| **Prompt** | Invoice API test returns 422 on billing fields. Inspect error body; do not invent fields. |
| **AI response** | Geo-validation errors on country/city combinations; generic US/TS templates from strategy doc insufficient. |
| **Outcome** | Multiple probe cycles (temporary specs, not in repo). |
| **QA decision** | **Reject** static `invoice.billing` for API; try profile-derived billing. |

### Iteration DATA4.2 — Profile-based billing mapping

| Field | Content |
|-------|---------|
| **Prompt** | Use `GET /users/me` address from registered user; map to invoice billing payload with placeholders for null state/postal. |
| **AI response** | Added `mapProfileAddressToBilling()`, `getProfile()` on client; invoice spec loads profile before `createInvoice`. |
| **Outcome** | `invoice.api.spec.js` passed (201 + list verify). |
| **QA decision** | **Accept** — update `docs/test-data-strategy.md` reuse matrix mentally via planning doc. |
| **Artefacts** | `api-test-data.js`, `ToolshopApiClient.getProfile()`, `invoice.api.spec.js` |

---

## Chain DATA5 — Environment configuration

### Iteration DATA5.1 — Document env vars

| Field | Content |
|-------|---------|
| **Prompt** | Document optional env overrides for URLs and demo credentials without committing secrets. |
| **AI response** | `.env.example` with `UI_BASE_URL`, `API_BASE_URL`, `TOOLSHOP_*_EMAIL/PASSWORD` empty placeholders. |
| **Outcome** | `playwright.config.js` loads `.env`; defaults to public Toolshop URLs. |
| **QA decision** | **Accept**. |
| **Artefacts** | `.env.example`, `.gitignore` for `.env` |

---

## Test data checklist

- [x] Seeded vs dynamically registered users
- [x] Product names / IDs for search and cart (names UI; IDs runtime API)
- [x] COD billing address payload (UI static; API profile-mapped)
- [x] `payment_method` value for API (`cash-on-delivery`)
- [x] Negative data (invalid login, duplicate email)
- [x] Environment variables documented in `.env.example`
