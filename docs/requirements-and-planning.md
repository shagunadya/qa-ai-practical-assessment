# Requirements and Planning — Toolshop QA Automation

**Assessment:** QA AI Practical Assessment  
**Author / date:** QA lead · 2026-08-11  
**Primary AI tool:** Cursor (Agent)  
**SUT:** Toolshop v5.0 — UI `https://practicesoftwaretesting.com` · API `https://api.practicesoftwaretesting.com`  
**Related:** [`planning.md`](planning.md) · [`traceability-matrix.md`](traceability-matrix.md) · [`../FunctionalTestCase.csv`](../FunctionalTestCase.csv) · [`../exploratory-testing/exploratory-notes.md`](../exploratory-testing/exploratory-notes.md) · [`../ai-prompts/requirements-and-planning.md`](../ai-prompts/requirements-and-planning.md) (prompt iteration log)

This document defines **requirements**, **acceptance criteria**, and **planning decisions** grounded in repository artefacts and confirmed Toolshop behaviour. It does not replace automation code or execution evidence.

---

## 1. Project Overview

The **Toolshop QA Automation** project is a public GitHub repository that delivers QA artefacts for the Practice Software Testing **Toolshop v5.0** ecommerce practice application.

**Purpose:**

- Document and verify core customer journeys (registration, authentication, catalog, cart, Cash on Delivery checkout, invoices).
- Provide **manual** functional tests, **UI** automation (Playwright + Page Object Model under `PrismStructure/`), and **API** automation (Playwright `request` API).
- Capture strategy, risks, traceability, exploratory findings, AI-assisted workflow history, and **real** execution evidence under `evidence/reports/`.
- Support the QA AI Capability Assessment using **Cursor** as the primary AI engineering tool (rules in `.cursor/`, prompt chains in `ai-prompts/`).

**Architecture (preserved):**

| Layer | Location |
|-------|----------|
| Page objects | `PrismStructure/pages/` |
| API client & assertions | `PrismStructure/api/` |
| Test data | `PrismStructure/data/` |
| UI/API fixtures | `PrismStructure/fixtures/` |
| UI tests | `PrismStructure/tests/ui/smoke|regression/` |
| API tests | `PrismStructure/tests/api/smoke|regression/` |

---

## 2. System Under Test

### 2.1 Application

| Item | Value |
|------|-------|
| Name | Practice Software Testing **Toolshop** |
| Version (observed) | v5.0 (UI footer may show Angular build metadata) |
| UI URL | https://practicesoftwaretesting.com |
| API URL | https://api.practicesoftwaretesting.com |
| API docs | https://api.practicesoftwaretesting.com/api/documentation |
| Environment | **Shared public demo** — no isolated QA tenant |

### 2.2 Major business flows (confirmed)

| Flow ID | Description | Channel |
|---------|-------------|---------|
| **F-01** | User registration with profile address fields | UI + API |
| **F-02** | Login / session (account menu, profile access) | UI + API |
| **F-03** | Logout (session ends; protected routes require login) | UI |
| **F-04** | Browse/search catalog → product detail → add to cart | UI |
| **F-05** | Cart management (line items, quantity, total, empty state) | UI + API |
| **F-06** | Checkout: billing address → payment → **Cash on Delivery** | UI |
| **F-07** | Order confirmation: **two Confirm clicks** required before invoice finalizes | UI |
| **F-08** | Invoice list (**My Invoices**) and invoice detail page | UI + API |
| **F-09** | API lifecycle: register → login (Bearer) → cart → invoice (`cash-on-delivery`) | API |

**Source:** `exploratory-testing/exploratory-notes.md`, `PrismStructure/pages/`, `PrismStructure/api/ToolshopApiClient.js`.

---

## 3. Scope

### 3.1 In scope

| Area | Detail |
|------|--------|
| UI AC1 | Register → login → profile → logout |
| UI AC2 | Multi-product cart → qty update → COD checkout → double Confirm → My Invoices → invoice details |
| API AC1 | Register/login → Bearer token → create cart → add items |
| API AC2 | Products → cart → COD invoice → list invoices |
| Manual testing | 11 cases (TC-M-01 … TC-M-11) — positive, negative, edge |
| Documentation | Strategy, environments, data, traceability, limitations, AI prompts, evidence |
| Test levels | Exploratory → manual → automated smoke/regression |

### 3.2 Out of scope

| Area | Reason |
|------|--------|
| Admin operations | Not part of assessment AC paths (`docs/planning.md`) |
| **Credit card** and other non-COD payment paths | Primary coverage is Cash on Delivery only |
| Performance, load, penetration testing | Assessment boundary |
| Cross-browser (Firefox/WebKit) | Chromium only in `playwright.config.js` |
| TOTP, forgot-password, guest checkout | Not exercised in exploration or automation |
| Full OpenAPI surface | Only lifecycle endpoints used in confirmed flows |
| Fabricated execution evidence | Policy in `evidence/reports/RUN-MANIFEST.md` |

### 3.3 Currently automated

| Layer | Count | Specs |
|-------|-------|-------|
| **UI smoke** | 3 | `foundation.smoke`, `auth.smoke`, `checkout.smoke` |
| **UI regression** | 9 | TC-M-03 … TC-M-11 mapped specs |
| **API smoke** | 4 | `auth-lifecycle`, `auth`, `cart`, `products` |
| **API regression** | 5 | `register`, `duplicate-register`, `invalid-login`, `cart`, `invoice` |
| **Total automated** | **21** | See [`traceability-matrix.md`](traceability-matrix.md) §3–4 |

### 3.4 Currently manual

| Suite | Cases | Artefact |
|-------|-------|----------|
| Smoke | TC-M-01, TC-M-02 | `FunctionalTestCase.csv`, `docs/manual-test-suite.md` |
| Regression | TC-M-03 … TC-M-11 | Same |

All manual cases include preconditions, test data, steps, and expected results.

### 3.5 Not yet verified (or only partially verified)

| Item | Status |
|------|--------|
| **Full automated suite green** (D-10) | Open — historical full-suite run recorded failures (`evidence/reports/full-suite_2026-08-11_1748.log`) |
| **TC-M-09–11** in committed evidence | Specs exist; not listed in `regression_2026-08-11.log` (11 tests at time of export) |
| **Credit card checkout** | Not in scope; no automation |
| **Strict invoice format `INV-YYYY######`** | Automation uses `/INV-\d+/`; exploratory notes `INV-{digits}` — exact year-length pattern not enforced in code |
| **API negatives:** unauthenticated invoice/cart, weak-password register (422) | Documented in `manual-test-suite.md` §2.3; **not** dedicated API specs |
| **UI ↔ API invoice match (TC-M-07)** | Spec exists; **failed** in committed `regression_2026-08-11.log` |
| **Invoice detail E2E create→open** | `invoice-details.regression.spec.js` verifies **existing** seeded invoice, not create-in-session |

---

## 4. Functional Requirements

Requirements below are **confirmed** only where supported by exploration notes, automation, or manual cases. Wording reflects **observed** behaviour, not assumed product intent.

### 4.1 Registration

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-REG-01** | User can open `/auth/register` and complete `register-form` with first name, last name, date of birth, country, address fields, email, password. | `RegisterPage.js`, `exploratory-notes.md` |
| **FR-REG-02** | Successful registration navigates away from `/auth/register`. | `auth.smoke.spec.js`, `registration.regression.spec.js` |
| **FR-REG-03** | Duplicate email (e.g. existing demo user) is rejected with validation/alert; user remains on register page. | `duplicate-registration.regression.spec.js`, TC-M-04 |
| **FR-REG-04** | API `POST /users/register` returns **201** for valid dynamic body; duplicate returns **409**. | `register.api.spec.js`, `duplicate-register.api.spec.js` |

**Not confirmed in automation:** weak-password UI rejection; API **422** for breached passwords (documented only in manual catalog).

### 4.2 Login

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-LOGIN-01** | User can log in via `/auth/login` with email and password. | `LoginPage.js`, TC-M-01 |
| **FR-LOGIN-02** | Successful login shows authenticated account menu (display name). | `auth.smoke.spec.js` |
| **FR-LOGIN-03** | Invalid password shows error (e.g. “invalid email or password”); user stays on login URL. | `invalid-login.regression.spec.js`, TC-M-03 |
| **FR-LOGIN-04** | API `POST /users/login` returns **200** with `access_token` for valid credentials; **401** for wrong password. | `auth-lifecycle.smoke.api.spec.js`, `invalid-login.api.spec.js` |

**Environmental constraint:** repeated failed logins on shared demo account may cause **423** lockout (R-07).

### 4.3 Product browsing / selection

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-PROD-01** | User can search catalog (`search-query`, `search-submit`) and open product detail. | `ProductsPage.js`, `exploratory-notes.md` |
| **FR-PROD-02** | User can add product to cart from PDP (`add-to-cart`); UI waits for `POST /carts/{id}` success. | `ProductsPage.clickAddToCartAndWait()` |
| **FR-PROD-03** | API `GET /products` returns in-stock items with `id` and `name`. | `products.smoke.api.spec.js` |

**Anchored products in test data:** Combination Pliers, Pliers (`ui-test-data.js`).

### 4.4 Cart

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-CART-01** | Cart shows line items with quantity spinbuttons and cart total (`cart-total`). | `CartPage.js`, TC-M-02 |
| **FR-CART-02** | User can update line quantity; value persists after blur. | `CartPage.updateQuantity()`, `checkout.smoke.spec.js` |
| **FR-CART-03** | Empty cart shows “Your cart is empty”; Proceed (`proceed-1`) disabled or checkout blocked. | `empty-cart.regression.spec.js`, TC-M-05 |
| **FR-CART-04** | API: create cart (**201**), add items (**200**), GET cart reflects products/quantities. | `cart.smoke.api.spec.js`, `cart.api.spec.js` |

### 4.5 Quantity management

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-QTY-01** | Quantity can be changed before checkout (e.g. Product A 1 → 2). | TC-M-02, `checkout.smoke.spec.js` |
| **FR-QTY-02** | Cart total reflects quantity change (asserted > 0; optional match to invoice). | `checkout.smoke.spec.js` |

### 4.6 Checkout

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-CHK-01** | Logged-in user proceeds through checkout wizard (`proceed-*` buttons). | `CheckoutPage.clickProceedStep()` |
| **FR-CHK-02** | Billing address fields (country, postal, house number, street, city, state) can be completed. | `CheckoutPage.fillBillingAddress()` |
| **FR-CHK-03** | Checkout blocked when cart has zero items. | TC-M-05 |

### 4.7 Payment

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-PAY-01** | **Cash on Delivery** can be selected before Confirm (label/radio/combobox). | `CheckoutPage.selectCashOnDelivery()`, TC-M-08 |
| **FR-PAY-02** | After COD and Confirm, UI shows “Payment was successful” before invoice Confirm step. | `exploratory-notes.md`, `CheckoutPage.waitForPaymentSuccess()` |
| **FR-PAY-03** | API invoice uses `payment_method: cash-on-delivery`, `payment_details: {}`. | `api-test-data.js`, `invoice.api.spec.js` |

**Not in scope:** credit card, bank transfer, or other payment methods.

### 4.8 Invoice generation

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-INV-01** | UI: **two** Confirm clicks after payment success are required to finalize invoice (R-01). | `exploratory-notes.md`, `confirmOrderTwice()`, TC-M-06 |
| **FR-INV-02** | Single Confirm does not create completed invoice row in My Invoices (dynamic user). | `single-confirm.regression.spec.js` |
| **FR-INV-03** | API `POST /invoices` returns **201** with `invoice_number` matching `^INV-`, positive `total`, billing fields. | `api-assertions.js`, `invoice.api.spec.js` |

### 4.9 My Invoices

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-MINV-01** | Authenticated user can open My Invoices (`/account/invoices` or `nav-my-invoices`). | `InvoicesPage.js`, TC-M-02 |
| **FR-MINV-02** | Table lists invoices with `INV-*` number and total. | `collectInvoiceNumbers()`, `getInvoiceRowDetails()` |
| **FR-MINV-03** | New invoice appears after double Confirm (poll for invoice not in pre-checkout set). | `checkout.smoke.spec.js` |

### 4.10 Invoice details

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-DET-01** | User can open Details link → URL under `/account/invoices/`. | `InvoicesPage.openInvoiceDetails()` |
| **FR-DET-02** | Detail page shows invoice number (textbox), total, and product line items in table. | `invoice-details.regression.spec.js`, `checkout.smoke.spec.js` |

### 4.11 Profile

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-PROF-01** | Authenticated user opens profile via account menu; registered first name, last name, email visible. | `ProfilePage.js`, `auth.smoke.spec.js`, TC-M-01 |

### 4.12 Logout

| Req ID | Requirement | Evidence |
|--------|-------------|----------|
| **FR-LOGOUT-01** | User signs out via account menu (“Sign out”); Sign in navigation visible. | `BasePage.logout()`, `auth.smoke.spec.js` |
| **FR-LOGOUT-02** | After logout, direct navigation to profile redirects to login. | `logout.regression.spec.js`, TC-M-10 |

### 4.13 Relevant APIs

| Endpoint | Method | Confirmed use |
|----------|--------|---------------|
| `/users/register` | POST | Register user (201 / 409) |
| `/users/login` | POST | Obtain Bearer `access_token` (200 / 401) |
| `/products` | GET | Catalog (200) |
| `/carts` | POST | Create cart (201) |
| `/carts/{id}` | POST | Add line item (200) |
| `/carts/{id}` | GET | Verify cart contents (200) |
| User profile | GET | Billing mapping for invoice (`invoice.api.spec.js`) |
| `/invoices` | POST | Create COD invoice (201) |
| `/invoices` | GET | List user invoices (200) |

**Client:** `PrismStructure/api/ToolshopApiClient.js` · **Assertions:** `api-assertions.js`.

---

## 5. Acceptance Criteria

Criteria are **testable** and map to manual TC IDs and/or automation specs. Pass/fail of automation is **not** claimed here — see `evidence/reports/RUN-MANIFEST.md`.

### 5.1 Registration & auth

| AC ID | Given | When | Then (measurable) | Maps to |
|-------|-------|------|-------------------|---------|
| **AC-REG-01** | Unique valid registration data | User submits register form | URL does not contain `/auth/register`; register form not visible | TC-M-01, TC-M-09 |
| **AC-REG-02** | Email already registered | User submits register | Error visible; remains on `/auth/register` | TC-M-04 |
| **AC-LOGIN-01** | Valid credentials | User logs in | “My account” heading visible; account menu contains first name | TC-M-01 |
| **AC-LOGIN-02** | Valid email, wrong password | User submits login | Error contains “invalid email or password”; URL matches `/auth/login` | TC-M-03 |
| **AC-LOGOUT-01** | User logged in | User signs out | `nav-sign-in` visible; profile URL redirects to login | TC-M-01, TC-M-10 |
| **AC-PROF-01** | User logged in after register | User opens profile | First name, last name visible; email textbox value matches registration | TC-M-01 |

### 5.2 Catalog, cart, checkout

| AC ID | Given | When | Then (measurable) | Maps to |
|-------|-------|------|-------------------|---------|
| **AC-PROD-01** | In-stock product | User searches and adds to cart | `POST /carts/{id}` returns OK (UI waiter) | TC-M-02 |
| **AC-CART-01** | Two products added | User opens cart | Exactly 2 line item rows visible | TC-M-02 |
| **AC-QTY-01** | Product A qty 1 | User sets qty to 2 | Spinbutton value === 2 | TC-M-02 |
| **AC-CART-02** | Empty cart | User attempts checkout | Proceed disabled OR empty message; no payment/Confirm UI | TC-M-05 |
| **AC-PAY-01** | Product in cart, billing complete | User selects COD | `isCashOnDeliverySelected()` true; Confirm button visible | TC-M-08 |

### 5.3 Invoice & My Invoices

| AC ID | Given | When | Then (measurable) | Maps to |
|-------|-------|------|-------------------|---------|
| **AC-INV-01** | COD checkout at Confirm step | User clicks Confirm **once** | Confirm still visible; 0 invoice rows (isolated user) | TC-M-06 |
| **AC-INV-02** | Payment successful | User clicks Confirm **twice** | New `INV-*` appears in My Invoices within poll timeout | TC-M-02 |
| **AC-INV-03** | Invoice listed | User opens Details | URL `/account/invoices/`; invoice number field matches; ≥1 product row; total matches list ±0.02 | TC-M-02, TC-M-11 |
| **AC-INV-04** | UI invoice created | API `GET /invoices` with same user token | Matching `invoice_number`; totals within ±0.02 | TC-M-07 |

### 5.4 API acceptance criteria

| AC ID | Given | When | Then (measurable) | Maps to |
|-------|-------|------|-------------------|---------|
| **AC-API-01** | Valid registration body | `POST /users/register` | Status **201**; `email`, `first_name`, `last_name` match request | API smoke/regression |
| **AC-API-02** | Valid credentials | `POST /users/login` | Status **200**; `access_token` present; client token set | API smoke |
| **AC-API-03** | Bearer token | Cart create + add + GET | Cart contains expected product IDs and quantities | `cart.smoke`, `cart.api` |
| **AC-API-04** | Cart with items, valid billing | `POST /invoices` COD | Status **201**; `invoice_number` matches `^INV-`; listed in `GET /invoices` | `invoice.api` |
| **AC-API-05** | Duplicate email | `POST /users/register` | Status **409** | `duplicate-register.api` |
| **AC-API-06** | Wrong password | `POST /users/login` | Status **401**; client token null | `invalid-login.api` |

---

## 6. Risk Analysis

| Risk ID | Area | Risk | Impact | Likelihood | Severity | Mitigation | Coverage |
|---------|------|------|--------|------------|----------|------------|----------|
| **R-01** | Checkout | Invoice requires **two Confirm** clicks; asserting after one yields false pass | Critical | Medium | **Critical** | `confirmOrderTwice()`; TC-M-06 edge | TC-M-02, TC-M-06; `checkout.smoke`, `single-confirm` |
| **R-02** | Payment | COD not selected before Confirm | High | Medium | High | `selectCashOnDelivery()`; TC-M-08 | `checkout.smoke`, `cod-payment` |
| **R-03** | Cart | Line items not persisted (race) | High | Medium | High | Network waiter on add-to-cart | `checkout.smoke`, `cart.smoke`, `cart.api` |
| **R-04** | Cart | Checkout with empty cart | Medium | Low | Medium | Disabled Proceed / empty message asserts | TC-M-05; `empty-cart` |
| **R-05** | Auth | Session failure blocks flows | High | Medium | High | Dynamic users; login URL wait | TC-M-01, TC-M-09, TC-M-10; `auth.smoke` |
| **R-06** | API | Stale token on API calls | Medium | Low | Medium | Fresh login in fixtures | API fixtures |
| **R-07** | Auth | Shared demo **lockout (423)** after failed logins | High | High | High | `--workers=1`; limit invalid-login on seeded user | TC-M-03; invalid-login specs |
| **R-08** | Cart | Qty not reflected before checkout | Medium | Low | Medium | Qty assert in smoke | TC-M-02; `checkout.smoke` |
| **R-09** | Cart | Empty-cart UX varies | Low | Medium | Low | Flexible assertions (disabled OR message) | TC-M-05 |
| **R-10** | Cart | Multi-product count wrong | Medium | Low | Medium | `toHaveCount(2)` on line items | TC-M-02; `cart.api` |
| **R-11** | Auth | Registration duplicate / policy failures | Medium | Medium | Medium | Dynamic email/password; duplicate negatives | TC-M-04; duplicate specs |
| **R-12** | Auth | Invalid login no feedback | Medium | Low | Medium | Error message + URL assert | TC-M-03 |
| **R-13** | Invoice | Invoice not in My Invoices | Medium | Medium | Medium | Poll new invoice numbers | TC-M-02, TC-M-11 |
| **R-14** | Cross-channel | UI total ≠ API total | Medium | Medium | Medium | TC-M-07; `ui-api-invoice` | TC-M-07 (spec; committed run **failed**) |

**Severity scale:** Critical = blocks AC sign-off; High = major AC degradation; Medium/Low = regression or environmental.

---

## 7. Testing Priorities

| Priority | Areas | Reasoning |
|----------|-------|-----------|
| **Critical** | Double Confirm (R-01); COD checkout E2E (F-06–F-08); auth session (R-05) | Assessment AC1/AC2 depend on invoice creation and authenticated journeys |
| **High** | Cart persistence (R-03); lockout avoidance (R-07); registration/login negatives (R-11, R-12); UI↔API invoice (R-14) | Shared SUT flakiness and cross-channel integrity are common failure modes |
| **Medium** | Qty update (R-08); multi-product cart (R-10); empty cart (R-04); invoice details (TC-M-11); dedicated registration/logout specs (TC-M-09–10) | Important regression guards; partially automated |
| **Low** | Foundation wiring smoke; empty-cart UX variance (R-09); browse-only paths without checkout | Wiring or low business impact |

**Execution order (manual):** Smoke TC-M-01 → TC-M-02, then regression. TC-M-07 depends on invoice from TC-M-02 in same session (manual design).

---

## 8. Assumptions

| ID | Assumption | Basis |
|----|------------|-------|
| **A-01** | Public Toolshop demo remains available at documented URLs | `playwright.config.js`, `test-environments.md` |
| **A-02** | Seeded demo credentials in `.env.example` are acceptable SUT fixtures (not production secrets) | Assessment convention |
| **A-03** | Combination Pliers and Pliers remain in stock for test runs | `exploratory-notes.md`; may drift (L-05) |
| **A-04** | Invoice numbers match `INV-` + digits (not a stricter calendar format unless verified) | `ui-test-data.js` `numberPattern: /INV-\d+/` |
| **A-05** | API invoice create returns **201** (not OpenAPI-documented 200) | Locked in `planning.md` after live runs |
| **A-06** | Chromium Desktop Chrome profile is representative for assessment UI | `playwright.config.js` |
| **A-07** | Serial workers (`--workers=1`) reduce shared-env contention | `RUN-MANIFEST.md`, `test-environments.md` |

---

## 9. Unknowns / Verification Required

| ID | Unknown | Verification needed |
|----|---------|---------------------|
| **U-01** | Exact invoice number format (e.g. `INV-YYYY######` vs `INV-{digits}`) | Sample live invoices; tighten regex if pattern stable |
| **U-02** | Credit card and other payment methods — behaviour and selectors | Out of scope unless assessment expands |
| **U-03** | Account lockout duration and recovery on shared demo | Operational; affects TC-M-03 / seeded specs |
| **U-04** | Whether `POST /invoices` without Bearer returns **401** | Manual catalog lists; no API spec yet |
| **U-05** | API **422** for weak registration password | Documented in manual suite; not automated |
| **U-06** | Stable green run for all **21** automated tests including TC-M-09–11 | Re-run and export to `evidence/reports/` |
| **U-07** | Invoice detail E2E on **newly created** invoice (dynamic user) | TC-M-11 uses existing seeded invoice by design |
| **U-08** | Catalog product availability over time | Re-verify anchors before submission runs |

---

## 10. Traceability Approach

### 10.1 Chain

```
Requirement (FR-*) 
  → Risk (R-*) 
    → Manual test (TC-M-*) 
      → UI spec / API spec 
        → Evidence (log + HTML in evidence/reports/)
```

### 10.2 Artefacts by layer

| Layer | Document / path |
|-------|-----------------|
| Requirements | **This document** (§4 FR-*), [`planning.md`](planning.md) AC tables |
| Risks | §6 above; [`planning.md`](planning.md) §2 |
| Manual tests | [`FunctionalTestCase.csv`](../FunctionalTestCase.csv), [`manual-test-suite.md`](manual-test-suite.md) |
| UI automation | `PrismStructure/tests/ui/**/*.spec.js` |
| API automation | `PrismStructure/tests/api/**/*.api.spec.js` |
| Full matrix | [`traceability-matrix.md`](traceability-matrix.md) |
| Evidence index | [`evidence/reports/RUN-MANIFEST.md`](../evidence/reports/RUN-MANIFEST.md), [`evidence/EXECUTION-DEMO.md`](../evidence/EXECUTION-DEMO.md) |

### 10.3 Example trace (UI AC2)

| Step | Artefact |
|------|----------|
| Requirement | FR-INV-01, FR-MINV-01, FR-PAY-01 |
| Risk | R-01, R-02, R-13 |
| Manual | TC-M-02 (smoke), TC-M-06 (edge), TC-M-08 (COD guard) |
| UI auto | `checkout.smoke.spec.js`, `single-confirm.regression.spec.js`, `cod-payment.regression.spec.js` |
| API auto | `invoice.api.spec.js` (API path); `cart.api.spec.js` (multi-product) |
| Evidence | `smoke_2026-08-11.log` (checkout **passed** in smoke run per manifest); regression/UI logs record intermittent failures |

### 10.4 Maintenance rules

1. Add FR-* and AC-* entries only after exploration or failing/passing run informs behaviour.
2. Update [`traceability-matrix.md`](traceability-matrix.md) when new TC-M-* or specs are added.
3. Export real Playwright output to `evidence/reports/`; update `RUN-MANIFEST.md` — never hand-edit pass/fail.
4. Keep `planning.md` and this document aligned on scope counts (11 manual, 12 UI, 9 API specs as of 2026-08-11).

---

## Document history

| Date | Change |
|------|--------|
| 2026-08-11 | Initial requirements-and-planning baseline (post-repository audit) |

**Note:** AI prompt iteration for planning lives in [`ai-prompts/requirements-and-planning.md`](../ai-prompts/requirements-and-planning.md). Operational planning decisions remain in [`planning.md`](planning.md).
