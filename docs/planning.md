# QA Planning — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**Author / date:** QA lead · 2026-08-10  
**SUT:** Toolshop — UI `https://practicesoftwaretesting.com` · API `https://api.practicesoftwaretesting.com`  
**Related docs:** [`test-strategy.md`](test-strategy.md) · [`test-data-strategy.md`](test-data-strategy.md) · [`../FunctionalTestCase.csv`](../FunctionalTestCase.csv) · [`../exploratory-testing/exploratory-notes.md`](../exploratory-testing/exploratory-notes.md)

This document is the **planning baseline**: scope, risks, acceptance criteria, and traceability from requirements → manual cases → automation.

---

## 1. Scope

### 1.1 In scope

| ID | Flow | Channels | Primary artefact |
|----|------|----------|------------------|
| **UI-AC1** | Register → login → profile verification | UI | TC-M-01; `auth.smoke.spec.js` |
| **UI-AC2** | Browse → multi-product cart → qty update → COD checkout → **double Confirm** → My Invoices | UI | TC-M-02; `checkout.smoke.spec.js` |
| **API-AC1** | Register/login → Bearer token → create cart → add items | API | `auth-lifecycle.smoke.api.spec.js`, `cart.smoke.api.spec.js` |
| **API-AC2** | Products → cart → verify → invoice (`cash-on-delivery`) | API | `products.smoke.api.spec.js`, `invoice.api.spec.js` |
| **Manual** | Smoke + regression functional cases (positive, negative, edge) | Manual | `FunctionalTestCase.csv` (8 cases) |
| **Documentation** | Strategy, data, prompts, evidence, reflection | Repo | `docs/`, `ai-prompts/`, `evidence/`, `project-info.md` |

**Automation guideline:** 5–8 UI tests and 5–8 API tests (smoke + regression **combined** per layer). Current implementation: 9 UI + 9 API (includes foundation connectivity check and split API auth smoke).

**Test levels:** Exploratory → manual CSV → UI/API automation (see [`test-strategy.md`](test-strategy.md) §3).

### 1.2 Out of scope

- Admin-only operations (bulk delete, reports, user admin)
- Non-COD payment paths as primary coverage
- Performance, load, penetration testing
- Cross-browser beyond Chromium
- TOTP, forgot-password, guest checkout (unless added later)
- Full OpenAPI surface — lifecycle endpoints for confirmed flows only
- Fabricated or hand-edited pass/fail evidence

---

## 2. Risk register

Risks informed planning, manual suite design, and automation priorities. Severity reflects impact on assessment AC paths.

| ID | Risk | Area | Impact | Mitigation (planned / implemented) | Covered by |
|----|------|------|--------|--------------------------------------|------------|
| **R-01** | Invoice requires **two Confirm** clicks; single Confirm does not finalize | UI checkout | Critical — false pass if invoice asserted too early | `CheckoutPage.confirmOrderTwice()`; TC-M-06 edge case | TC-M-02, TC-M-06; `checkout.smoke`, `single-confirm.regression` |
| **R-02** | Wrong or missing **Cash on Delivery** selection before Confirm | UI checkout | High — invoice/payment invalid | `selectCashOnDelivery()`; assert COD selected (TC-M-08) | TC-M-02, TC-M-08; `checkout.smoke`, `cod-payment.regression` |
| **R-03** | Cart line items not persisted (UI/API race) | Cart | High — wrong cart state | Network waiter on `POST /carts/{cartId}`; verify line counts | TC-M-02; `checkout.smoke` |
| **R-04** | Checkout allowed with **empty cart** | Cart / checkout | Medium — invalid orders | Blocked checkout assertions; clear cart helper | TC-M-05; `empty-cart.regression` |
| **R-05** | Auth/session failure blocks all logged-in flows | Auth | High | Dynamic registration for isolation; login URL wait | TC-M-01; `auth.smoke`, `auth-lifecycle.smoke.api` |
| **R-06** | Token timing / stale session on API calls | API auth | Medium | Fresh login per API fixture; `clearToken()` teardown | API fixtures; exploratory notes |
| **R-07** | **Shared demo account lockout** after failed logins (`423`) | Auth | High — smoke/regression flake | API `workers: 1`; limit invalid-login on seeded user; prefer dynamic users | TC-M-03; `invalid-login` specs; strategy guardrails |
| **R-08** | Quantity update not reflected before checkout | Cart | Medium | `updateQuantity()` + cart line assertions (manual); qty in TC-M-02 steps | TC-M-02; `checkout.smoke` |
| **R-09** | Empty-cart UX varies (message vs disabled Proceed) | UI | Low — assertion brittleness | Flexible blocked-checkout assertions (exploration-driven) | TC-M-05; `empty-cart.regression` |
| **R-10** | Multi-product cart incorrect (count, merge) | Cart | Medium | Two distinct products; `toHaveCount(2)` on line items | TC-M-02; `checkout.smoke`, `cart.api.regression` |
| **R-11** | Registration failure (duplicate email, weak password) | Auth | Medium | Dynamic email/password; duplicate negative | TC-M-01, TC-M-04; `auth.smoke`, `duplicate-registration` specs |
| **R-12** | Invalid login not rejected / no error feedback | Auth | Medium | Assert error message and remain on login URL | TC-M-03; `invalid-login` UI/API specs |
| **R-13** | Invoice not visible in **My Invoices** for owning user | Invoice | Medium | Assert `INV-*` after double Confirm | TC-M-02; `checkout.smoke` |
| **R-14** | **UI ↔ API invoice mismatch** (number, total) | Cross-channel | Medium | TC-M-07 manual; `ui-api-invoice.regression` + API `GET /invoices` | TC-M-07; `ui-api-invoice.regression`, `invoice.api.regression` |

---

## 3. Acceptance criteria

### 3.1 Assessment deliverables (release gate)

| # | Criterion | Evidence location | Status |
|---|-----------|-------------------|--------|
| D-01 | Public Git repo with Playwright + Prism automation | GitHub `master` | Met |
| D-02 | Manual functional test cases (smoke/regression, pos/neg/edge) | `FunctionalTestCase.csv` | Met (8 cases) |
| D-03 | UI automation with POM | `PrismStructure/tests/ui/`, `pages/` | Met |
| D-04 | API automation (Playwright `request`) | `PrismStructure/tests/api/`, `api/` | Met |
| D-05 | Test data strategy documented | `docs/test-data-strategy.md`, `PrismStructure/data/` | Met |
| D-06 | AI prompt history + debugging log | `ai-prompts/` | Partial (planning + automation complete; design/data/doc templates open) |
| D-07 | Execution evidence (real runs) | `evidence/reports/` | Met (log + HTML export; see `RUN-MANIFEST.md`) |
| D-08 | Exploratory testing record | `exploratory-testing/exploratory-notes.md` | Met |
| D-09 | Responsible AI / project reflection | `project-info.md` | Met |
| D-10 | **All automated tests pass** on final submission run | Playwright exit code 0 | **Open** — evidence run recorded failures (lockout/network); re-run when SUT stable |

### 3.2 UI acceptance criteria (functional)

| AC | Given | When | Then (pass) |
|----|-------|------|-------------|
| **UI-AC1** | Valid unique registration data | User registers, logs in, opens profile | Profile shows registered name and email (TC-M-01) |
| **UI-AC2** | Logged-in user, two in-stock products | User updates qty, COD checkout, **Confirms twice** | My Invoices shows new `INV-*` for order (TC-M-02) |
| **UI-AC3** | Valid email, wrong password | User attempts login | Error shown; user remains logged out (TC-M-03) |
| **UI-AC4** | Duplicate email on register | User submits registration | Registration rejected; stays on register (TC-M-04) |
| **UI-AC5** | Logged-in user, empty cart | User attempts checkout | Checkout blocked; no payment/Confirm step (TC-M-05) |
| **UI-AC6** | Logged-in user, one product, COD to Confirm | User clicks Confirm **once** | Invoice not finalized in My Invoices (TC-M-06) |
| **UI-AC7** | Invoice created in UI session | Same user calls API `GET /invoices` | Matching `invoice_number` (and total per manual case) (TC-M-07) |
| **UI-AC8** | Product in cart, checkout in progress | User reaches payment step | Cash on Delivery selected before Confirm (TC-M-08) |

### 3.3 API acceptance criteria (functional)

| AC | Given | When | Then (pass) |
|----|-------|------|-------------|
| **API-AC1** | Valid registration body | `POST /users/register` | `201`; user fields match request |
| **API-AC2** | Valid credentials | `POST /users/login` | `200`; `access_token` returned |
| **API-AC3** | Bearer token | `POST /carts`, add items, `GET /carts/{id}` | Cart contains expected products/quantities |
| **API-AC4** | Cart with items, valid billing | `POST /invoices` (`cash-on-delivery`) | `201`; `invoice_number` matches `INV-*` pattern; listed in `GET /invoices` |
| **API-AC5** | Duplicate email | `POST /users/register` | `409` conflict |
| **API-AC6** | Wrong password | `POST /users/login` | `401` (or `423` if account locked — environment risk R-07) |
| **API-AC7** | In-stock catalog | `GET /products` | At least two in-stock products available |

---

## 4. Traceability

### 4.1 Manual → automation → risks

| Manual TC | Type | Suite | Scenario ID | UI automation spec | API automation spec | Primary risks |
|-----------|------|-------|-------------|-------------------|---------------------|---------------|
| TC-M-01 | Positive | Smoke | SC-AC1-REG-LOGIN-PROFILE | `ui/smoke/auth.smoke.spec.js` | `api/smoke/auth-lifecycle.smoke.api.spec.js` | R-05, R-11 |
| TC-M-02 | Positive | Smoke | SC-AC2-COD-DOUBLE-CONFIRM | `ui/smoke/checkout.smoke.spec.js` | _(partial — cart/invoice in API suite)_ | R-01–R-04, R-08, R-10, R-13 |
| TC-M-03 | Negative | Regression | SC-LOGIN-INVALID-PWD | `ui/regression/invalid-login.regression.spec.js` | `api/regression/invalid-login.api.spec.js` | R-07, R-12 |
| TC-M-04 | Negative | Regression | SC-REG-DUPLICATE-EMAIL | `ui/regression/duplicate-registration.regression.spec.js` | `api/regression/duplicate-register.api.spec.js` | R-11 |
| TC-M-05 | Negative | Regression | SC-CART-EMPTY-CHECKOUT | `ui/regression/empty-cart.regression.spec.js` | — | R-04, R-09 |
| TC-M-06 | Edge | Regression | SC-INV-SINGLE-CONFIRM | `ui/regression/single-confirm.regression.spec.js` | — | R-01 |
| TC-M-07 | Positive | Regression | SC-UI-API-INVOICE-MATCH | `ui/regression/ui-api-invoice.regression.spec.js` | `api/regression/invoice.api.spec.js` (API path) | R-13, R-14 |
| TC-M-08 | Negative | Regression | SC-COD-PAYMENT-SELECTED | `ui/regression/cod-payment.regression.spec.js` | — | R-02 |

### 4.2 Assessment flows → automation (API)

| Flow | Smoke specs | Regression specs |
|------|-------------|------------------|
| API-AC1 Auth + cart | `auth.smoke.api.spec.js`, `auth-lifecycle.smoke.api.spec.js`, `cart.smoke.api.spec.js` | `register.api.spec.js`, `cart.api.spec.js` |
| API-AC2 Products + invoice | `products.smoke.api.spec.js` | `invoice.api.spec.js` |
| API negatives | — | `invalid-login.api.spec.js`, `duplicate-register.api.spec.js` |

### 4.3 UI automation extras (no manual TC ID)

| Spec | Tag | Purpose |
|------|-----|---------|
| `ui/smoke/foundation.smoke.spec.js` | `@smoke` | Wiring check — baseURL responds (not an AC scenario) |

### 4.4 Documentation & process traceability

| Planning activity | Artefact |
|-------------------|----------|
| Requirements analysis | `ai-prompts/requirements-and-planning.md` (Prompt 01) |
| Exploratory testing | `exploratory-testing/exploratory-notes.md` |
| Test strategy & data | `docs/test-strategy.md`, `docs/test-data-strategy.md` |
| Automation / debugging | `ai-prompts/automation-and-debugging.md` |
| Execution evidence | `evidence/reports/` |
| Submission summary | `project-info.md`, `README.md` |

---

## 5. Planning decisions (locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Payment method | Cash on Delivery only | Assessment AC focus |
| UI selectors | `data-test` (`testIdAttribute`) | Toolshop convention; recorded in exploration |
| API auth | Bearer JWT from `POST /users/login` | OpenAPI scheme |
| Layout | `PrismStructure/` (POM, api client, fixtures, data) | Assessment / Prism expectation |
| API parallelism | `workers: 1` on API project | Mitigate R-07 on shared demo users |
| Invoice Confirm (UI) | Two clicks required | Confirmed in exploration (R-01) |
| API invoice status | Assert `201` on create | Live behaviour vs OpenAPI `200` |
| Registration password (API) | Dynamic `Qa!Test{suffix}#9` | Breached-password policy on static passwords |

---

## 6. Open items

| Item | Owner action |
|------|----------------|
| Final green full-suite run (D-10) | Re-run `npm test -- --workers=1` when demo account unlocked; update `evidence/reports/` |
| Backfill AI prompt templates | Complete `ai-prompts/test-design.md`, `test-data.md`, `documentation-and-summary.md` |
| Test-count cap | Trim `foundation.smoke` or redundant API auth smoke, or document assessor-approved count |
| Seeded-user tests under lockout | Refactor TC-M-02/03/05/07/08 and `auth.smoke.api` to dynamic users or skip when `423` |

---

## 7. Sign-off checklist (planning complete)

- [x] Scope and out-of-scope defined
- [x] Risks R-01–R-14 mapped to tests and mitigations
- [x] Acceptance criteria for UI, API, and deliverables documented
- [x] Traceability: manual TC ↔ automation ↔ risks
- [x] Exploratory findings incorporated (`exploratory-notes.md`)
- [ ] Final automated suite green with exported evidence (pending stable SUT)
