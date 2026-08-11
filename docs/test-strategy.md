# Test Strategy — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**SUT:** Toolshop v5.0 — UI `https://practicesoftwaretesting.com` · API `https://api.practicesoftwaretesting.com`  
**Stack:** Playwright · JavaScript · Prism Framework (`PrismStructure/`)  
**Primary AI tool:** Cursor (Agent)  
**Author / date:** QA lead · 2026-08-11 (strategy revision)

**Related:** [`requirements-and-planning.md`](requirements-and-planning.md) · [`planning.md`](planning.md) · [`test-environments.md`](test-environments.md) · [`test-data-strategy.md`](test-data-strategy.md) · [`traceability-matrix.md`](traceability-matrix.md) · [`limitations-and-gaps.md`](limitations-and-gaps.md)

This strategy describes **how** the repository tests Toolshop. It is based on confirmed application behaviour (`exploratory-testing/exploratory-notes.md`), implemented automation (`PrismStructure/tests/`), and documented evidence (`evidence/reports/`). It does not claim infrastructure or test levels that are not present in the repo.

---

## 1. Test Objectives

| Objective | How addressed |
|-----------|----------------|
| **Verify assessment acceptance paths** | UI AC1 (register/login/profile/logout) and UI AC2 (COD checkout, double Confirm, My Invoices, invoice details); API AC1 (auth + cart) and API AC2 (products + COD invoice) |
| **Provide repeatable automation** | 12 UI specs + 9 API specs under Playwright with `@smoke` / `@regression` tags |
| **Document human coverage** | 11 manual cases in `FunctionalTestCase.csv` and `docs/manual-test-suite.md` (positive, negative, edge) |
| **Manage risk on shared SUT** | Risk register R-01–R-14; prioritise double Confirm, COD, cart, auth lockout, invoice visibility |
| **Enable assessor review** | Traceability matrix, real execution logs/HTML in `evidence/reports/`, AI prompt history in `ai-prompts/` |
| **Use AI responsibly** | Cursor for drafting; human validation via exploration and test runs (`project-info.md`) |

**Non-objectives:** Performance testing, security pen-testing, cross-browser matrix, full OpenAPI coverage, or a green full-suite guarantee on every shared-env run (see §12 Exit criteria, §15 Limitations).

---

## 2. Scope

### 2.1 Functional scope (in scope)

| ID | Flow | Channels | Primary artefacts |
|----|------|----------|-------------------|
| **UI-AC1** | Register → login → profile → logout | UI | TC-M-01, TC-M-09, TC-M-10; `auth.smoke.spec.js`, `registration.regression.spec.js`, `logout.regression.spec.js` |
| **UI-AC2** | Browse → cart → qty → COD checkout → **2× Confirm** → My Invoices → invoice details | UI | TC-M-02, TC-M-11; `checkout.smoke.spec.js`, `invoice-details.regression.spec.js` |
| **API-AC1** | Register/login → Bearer token → cart lifecycle | API | `auth-lifecycle.smoke.api.spec.js`, `auth.smoke.api.spec.js`, `cart.smoke.api.spec.js`, `register.api.spec.js`, `cart.api.spec.js` |
| **API-AC2** | Products → cart → COD invoice → list invoices | API | `products.smoke.api.spec.js`, `invoice.api.spec.js` |
| **Negatives / edge** | Invalid login, duplicate register, empty cart, single Confirm, COD selection, UI↔API invoice | Manual + partial automation | TC-M-03 … TC-M-08 |
| **Documentation & evidence** | Strategy, data, environments, prompts, limitations | Repo | `docs/`, `ai-prompts/`, `evidence/` |

### 2.2 Automation inventory (current)

| Layer | Smoke | Regression | Total |
|-------|-------|------------|-------|
| UI | 3 (`foundation`, `auth`, `checkout`) | 9 | **12** |
| API | 4 | 5 | **9** |
| **Total automated** | 7 grep `@smoke` | 14 grep `@regression` | **21** |

Assessment guideline: 5–8 tests per layer (smoke + regression combined). Current counts **exceed** the guideline; documented in [`limitations-and-gaps.md`](limitations-and-gaps.md) L-08.

### 2.3 Manual inventory (current)

| Suite | Cases |
|-------|-------|
| Smoke | TC-M-01, TC-M-02 |
| Regression | TC-M-03 … TC-M-11 |
| **Total manual** | **11** |

---

## 3. Out of Scope

| Area | Reason |
|------|--------|
| **Unit tests** | No unit-test framework or `*.test.js` modules under application code — not implemented |
| **Admin operations** | Not part of customer AC paths |
| **Credit card and non-COD payments** | Primary coverage is Cash on Delivery only |
| **Performance, load, penetration testing** | Assessment boundary |
| **Cross-browser** (Firefox, WebKit) | Chromium only in `playwright.config.js` |
| **TOTP, forgot-password, guest checkout** | Not explored or automated |
| **Full OpenAPI surface** | Only endpoints used in confirmed lifecycle flows |
| **Dedicated QA/staging environment** | Single public practice SUT (see §9) |
| **CI/CD pipeline** | Not present in repository |
| **Fabricated execution evidence** | Policy: real Playwright output only |

---

## 4. Testing Levels

Only levels **actually used** in this repository are listed. Levels not implemented are explicitly marked.

| Level | Implemented? | Purpose in this project | Artefact |
|-------|--------------|-------------------------|----------|
| **Unit** | **No** | Not used — no isolated tests for POM methods, utilities, or API client functions | — |
| **API (service)** | **Yes** | Validate REST lifecycle, status codes, response fields via Playwright `request` | `PrismStructure/tests/api/` |
| **UI (component/page)** | **Yes** | Validate storefront flows via browser automation + POM | `PrismStructure/tests/ui/` |
| **Integration** | **Partial** | UI spec compares My Invoices to API `GET /invoices` (TC-M-07); API invoice uses profile billing from `GET` user profile | `ui-api-invoice.regression.spec.js`, `invoice.api.spec.js` |
| **End-to-end (UI)** | **Yes** | Full journeys: register→profile→logout; login→cart→COD→invoice→details | `auth.smoke.spec.js`, `checkout.smoke.spec.js` |
| **Manual functional** | **Yes** | Human-readable cases with steps, data, expected results | `FunctionalTestCase.csv`, `manual-test-suite.md` |
| **Manual exploratory** | **Yes** | Session-based discovery before automation; selector and behaviour anchors | `exploratory-testing/exploratory-notes.md` |

**Not implemented:** separate contract-testing layer, visual regression, accessibility audit suite, or dedicated mobile view tests.

---

## 5. Test Types

| Type | Definition | Implemented? | Examples in repo |
|------|------------|--------------|------------------|
| **Smoke** | Fast critical-path proof | **Yes** | UI: `auth.smoke`, `checkout.smoke`; API: `auth-lifecycle`, `auth`, `cart`, `products` — tagged `@smoke` |
| **Regression** | Broader guards after smoke | **Yes** | UI: invalid login, duplicate register, empty cart, single Confirm, COD, registration, logout, invoice details, UI↔API; API: register, duplicate, invalid login, cart, invoice — `@regression` |
| **Functional** | Behaviour matches requirements | **Yes** | Positive paths TC-M-01, TC-M-02, TC-M-09–11; API lifecycle specs |
| **Negative** | Invalid input or wrong preconditions | **Partial** | UI: TC-M-03, TC-M-04, TC-M-05, TC-M-08; API: 401 login, 409 duplicate — **not** automated: API 401 without token, API 422 weak password (documented in `manual-test-suite.md` §2.3 only) |
| **Edge / boundary** | Application-specific boundaries | **Yes** | TC-M-06 single Confirm vs double Confirm (R-01); qty 1→2 in TC-M-02 |
| **API** | HTTP contract and payload checks | **Yes** | All `*.api.spec.js` under `PrismStructure/tests/api/` |
| **Exploratory** | Unscripted discovery | **Yes** (documented) | `exploratory-notes.md` — **not** automated as a separate suite |

**Tagging:** `npm run test:smoke` → `--grep @smoke`; `npm run test:regression` → `--grep @regression` (`package.json`).

---

## 6. Risk-Based Strategy

High-risk areas receive **deeper or duplicated** coverage (manual + automation + exploration). Mapping uses risk IDs from [`planning.md`](planning.md) §2.

| Risk | Area | Why prioritised | Deeper coverage |
|------|------|-----------------|-----------------|
| **R-01** | Double Confirm required | False pass if invoice asserted after one click | `confirmOrderTwice()`; TC-M-02 smoke + TC-M-06 edge |
| **R-02** | COD must be selected | Wrong payment invalidates invoice | `checkout.smoke`, `cod-payment.regression`, API `cash-on-delivery` |
| **R-03** | Cart persistence | Wrong cart breaks checkout | Network waiter on add-to-cart; line-count asserts |
| **R-05, R-07** | Auth / lockout | Blocks all logged-in flows | Dynamic users; API `workers: 1`; limit invalid-login on seeded user |
| **R-13, R-14** | Invoice visibility / UI↔API match | Core AC2 proof | `checkout.smoke`, `invoice-details`, `ui-api-invoice`, `invoice.api` |

**Lower priority (lighter automation):** R-09 empty-cart UX variance (flexible asserts); foundation wiring smoke (non-business).

**Strategy rule:** Add automation for a risk only after exploratory confirmation; prefer one strong spec over many shallow duplicates unless manual TC requires separation (e.g. TC-M-09–11).

---

## 7. UI Automation Strategy

### 7.1 Stack and layout

| Item | Implementation |
|------|----------------|
| **Framework** | Playwright Test `^1.49.0` |
| **Language** | JavaScript (Node.js) |
| **Structure** | Prism Framework — `PrismStructure/pages/`, `tests/ui/smoke|regression/` |
| **Config** | `playwright.config.js` — `chromium` project, `testIdAttribute: 'data-test'` |
| **Imports** | `test` / `expect` from `fixtures/test-fixtures.js` (not `@playwright/test` directly in UI specs) |

### 7.2 Page Object Model

- All pages extend `BasePage` (`PrismStructure/pages/BasePage.js`).
- One class per major surface: `LoginPage`, `RegisterPage`, `ProfilePage`, `ProductsPage`, `CartPage`, `CheckoutPage`, `InvoicesPage`.
- Checkout encapsulates **double Confirm** in `confirmOrderTwice()` (R-01).

### 7.3 Fixtures

`test-fixtures.js` provides: `registerPage`, `loginPage`, `profilePage`, `productsPage`, `cartPage`, `checkoutPage`, `invoicesPage`, `seededCredentials`, `apiClient`.

### 7.4 Locators

| Priority | Approach | Example |
|----------|----------|---------|
| 1 | `data-test` (`testIdAttribute`) | `register-form`, `login-submit`, `proceed-1` |
| 2 | Role + accessible name | `getByRole('button', { name: /^confirm$/i })` |
| 3 | Text / label fallbacks | Sign out, Cash on Delivery |

Documented in `exploratory-notes.md` and `.cursor/rules/playwright-prism.mdc`.

### 7.5 Assertions

- URL navigation (`not.toHaveURL`, `waitForURL`).
- Visible state (`toBeVisible`, `toContainText`, `toHaveValue`).
- Cart: line count, quantity spinbutton value, cart total > 0.
- Invoice: poll for new `INV-*`; row details; detail page fields (`invoiceNumberField`, `invoiceTotalField`).
- Conditional asserts when shared cart may pollute totals (documented in limitations).

### 7.6 Test isolation

| Technique | Use |
|-----------|-----|
| **Dynamic registration** | `buildRegistrationUser()` for auth-sensitive specs |
| **Seeded user** | UI smoke checkout (TC-M-02) — shared state risk |
| **Invoice before/after sets** | `collectInvoiceNumbers()` + filter new invoices |
| **Cart clear** | `CartPage.clearLineItems()` where needed |
| **Serial runs** | `--workers=1` recommended for evidence on shared SUT |

**Gap:** No global auth storage or per-test database reset — isolation depends on dynamic users and public SUT behaviour.

### 7.7 Wait strategy

| Pattern | Where |
|---------|--------|
| Playwright auto-wait on actions | Default clicks/fills |
| `waitForURL` | After login, register, invoice detail navigation |
| `waitForResponse` | Add-to-cart `POST /carts/{id}` |
| `expect.poll` | New invoice appearance (up to 45–60s) |
| `waitForPaymentSuccess` | “Payment was successful” before Confirm |
| Extended `test.setTimeout(120000)` | Full checkout E2E |

Trace: `on-first-retry`; screenshot: `only-on-failure`.

### 7.8 Reusability

- Shared data: `ui-test-data.js`.
- Shared checkout flow: `completeCashOnDeliveryCheckout()`, `confirmOrderTwice()`.
- Invoice helpers: `collectInvoiceNumbers()`, `findInvoiceByTotal()`, `getDetailPageAmounts()`.
- No duplicate POM copies — extend existing pages only.

---

## 8. API Strategy

### 8.1 Client structure

| Component | Path | Role |
|-----------|------|------|
| **ToolshopApiClient** | `PrismStructure/api/ToolshopApiClient.js` | register, login, products, cart, profile, invoices |
| **api-assertions.js** | `PrismStructure/api/api-assertions.js` | Reusable status + body checks |
| **api-test-data.js** | Endpoints, payloads, `buildRegistrationBody()`, `buildInvoicePayload()` |
| **api-fixtures.js** | `apiClient`, `registrationBody`, `registeredUser`, `cartWithProducts` |

### 8.2 Authentication

1. `POST /users/login` → read `access_token`.
2. Client stores token; `authHeaders()` sends `Authorization: Bearer …`.
3. Registration tests use dynamic body; login follows register in same spec where needed.

### 8.3 Request validation

- Payloads built from `api-test-data.js` — billing mapped from profile (`mapProfileAddressToBilling`) after live geo-validation failures with synthetic-only billing.
- Invoice payload includes `payment_method: cash-on-delivery`, `payment_details: {}`, dynamic `cart_id`.

### 8.4 Status code assertions

| Endpoint | Expected (confirmed) |
|----------|-------------------|
| `POST /users/register` (valid) | **201** |
| `POST /users/register` (duplicate) | **409** |
| `POST /users/login` (valid) | **200** |
| `POST /users/login` (invalid) | **401** |
| `POST /carts` | **201** |
| `POST /carts/{id}` | **200** |
| `GET /products`, `GET /carts/{id}`, `GET /invoices` | **200** |
| `POST /invoices` (COD) | **201** |

**Not automated:** 401 on protected routes without token; 422 weak password / invalid invoice body (listed in manual catalog only).

### 8.5 Response body assertions

`api-assertions.js` validates only **observed** fields: user ids/emails, `access_token`, cart `id`, product `in_stock`, invoice `invoice_number` (`^INV-`), totals, billing fields, line items when present.

### 8.6 Negative testing (implemented)

| Scenario | Spec |
|----------|------|
| Wrong password | `invalid-login.api.spec.js` |
| Duplicate register | `duplicate-register.api.spec.js` |

### 8.7 Data setup / cleanup

| Pattern | Detail |
|---------|--------|
| **Setup** | Register dynamic user per test/fixture; create cart; resolve product IDs from `GET /products` |
| **Cleanup** | **No explicit teardown** — relies on unique emails and public SUT; tokens cleared in client where implemented |
| **Parallelism** | API project `workers: 1` in `playwright.config.js` (R-07) |

**Gap:** No API to reset demo account cart or invoices; shared-state mitigation is test design, not cleanup hooks.

---

## 9. Environment Strategy

**This project has only one test environment for the SUT** plus a local execution context.

| Environment | Exists? | URL / location | Used for |
|-------------|---------|--------------|----------|
| **Practice Toolshop (public)** | **Yes** — sole SUT | UI: `https://practicesoftwaretesting.com` · API: `https://api.practicesoftwaretesting.com` | All manual, UI, and API tests |
| **Local Playwright runner** | **Yes** | Developer machine; Node + Chromium | Executing tests |
| **Evidence store** | **Yes** (repo folder) | `evidence/reports/` | Committed run logs and HTML copies |
| **Staging / UAT / QA tenant** | **No** | — | Not available |
| **CI runner** | **No** | — | Not configured |

Overrides: `.env` / `.env.example` (`UI_BASE_URL`, `API_BASE_URL`, credential keys). Full detail: [`test-environments.md`](test-environments.md).

**Future improvement (not implemented):** GitHub Actions workflow; dedicated isolated tenant; scheduled smoke against practice SUT.

---

## 10. Test Data Strategy

Summary below; full matrices in [`test-data-strategy.md`](test-data-strategy.md).

### 10.1 User data

| Type | Source | Notes |
|------|--------|-------|
| Seeded demo user | `ui-test-data.js` / env | UI smoke checkout, invoice-details |
| Dynamic user | `buildRegistrationUser()` | Registration, logout, single-confirm, UI↔API |
| Invalid login | `invalidLogin` object | Wrong password on seeded email |
| Duplicate register | `duplicateRegistration` | Seeded email |

### 10.2 Product data

| Type | Source |
|------|--------|
| UI names | `Combination Pliers`, `Pliers` — static in `ui-test-data.js` |
| API IDs | Resolved at runtime from `GET /products` (in-stock filter) |

### 10.3 Cart data

| Field | Value |
|-------|-------|
| Initial qty | `1` |
| Updated qty (TC-M-02) | `2` |
| `cart_id` | Dynamic from `POST /carts` |

### 10.4 Payment data

| Channel | Value |
|---------|-------|
| UI label | `Cash on Delivery` |
| API enum | `cash-on-delivery` |
| `payment_details` | `{}` |

### 10.5 API payloads

Built in `api-test-data.js`: registration body, invoice payload with profile-derived billing, endpoint map.

### 10.6 Dynamic data

Emails, API passwords, tokens, cart IDs, invoice numbers, product IDs — generated per run (see test-data-strategy § “Values to generate dynamically”).

### 10.7 Data isolation

- Prefer dynamic registration for tests that mutate auth state.
- Limit TC-M-03 invalid-login runs on seeded user (R-07).
- API serial workers reduce parallel contention.

### 10.8 Secrets handling

- `.env` gitignored; defaults are **public SUT fixtures** loaded via `process.env` in data modules.
- Never commit real secrets; see `.env.example` for key names only.

---

## 11. Entry Criteria

| # | Criterion |
|---|-----------|
| E-01 | SUT URLs reachable (UI and API) |
| E-02 | `npm install` and `npx playwright install chromium` completed |
| E-03 | Exploratory notes available for selectors and double-Confirm behaviour |
| E-04 | Manual cases drafted in `FunctionalTestCase.csv` for flows under test |
| E-05 | Test data anchors verified (in-stock products, seeded user login) |
| E-06 | `.env` configured if overriding defaults (optional) |

---

## 12. Exit Criteria

| # | Criterion | Current status (honest) |
|---|-----------|-------------------------|
| X-01 | Smoke suite `@smoke` passes with exported evidence | **Met** — `smoke_2026-08-11.log` records **7/7 passed** (`RUN-MANIFEST.md`) |
| X-02 | Regression suite passes | **Partial** — `regression_2026-08-11.log` records **10/11** (`ui-api-invoice` failed) |
| X-03 | Full suite (`npm test`) exit code 0 | **Open (D-10)** — historical full-suite **10 pass / 8 fail** |
| X-04 | Manual smoke cases executed or mapped to passing automation | Met via TC-M-01/02 automation + CSV |
| X-05 | Traceability matrix current | Met — `traceability-matrix.md` includes TC-M-01–11 |
| X-06 | Evidence in `evidence/reports/` with `RUN-MANIFEST.md` | Met — smoke green; regression/UI partial |
| X-07 | TC-M-09–11 included in committed regression evidence | **Gap** — specs exist; not in `regression_2026-08-11.log` (11 tests at export time) |
| X-08 | Known limitations documented | Met — `limitations-and-gaps.md` |

**Release gate for assessment:** X-01 + documentation deliverables; full green suite (X-03) remains aspirational on shared SUT.

---

## 13. Defect Management

| Item | Implementation |
|------|----------------|
| **Log location** | `defects/defect-report.md` |
| **Current state** | **Template only** — no logged defects (counts zero) |
| **SUT quirks vs defects** | Double Confirm documented as **risk R-01**, not a defect |
| **Automation failures** | Triaged in `ai-prompts/automation-and-debugging.md`; environmental causes noted in `RUN-MANIFEST.md` |
| **Severity scale** | Critical / High / Medium / Low (template in defect report) |

**Process:** Log reproducible SUT issues with steps, expected/actual, evidence path. Do not file defects for documented shared-env lockout without SUT change.

**Gap:** No Jira/GitHub Issues integration; no defect SLA workflow.

---

## 14. Execution and Reporting

### 14.1 Commands

| Intent | Command |
|--------|---------|
| Full suite | `npm test` |
| UI only | `npm run test:ui` |
| API only | `npm run test:api` |
| Smoke | `npm run test:smoke -- --workers=1` |
| Regression | `npm run test:regression -- --workers=1` |
| Open HTML report | `npm run report` (local `PrismStructure/reports/html`) |

### 14.2 Reporting outputs

| Output | Default path | Committed copy |
|--------|--------------|----------------|
| List reporter | Terminal | `evidence/reports/*.log` |
| HTML report | `PrismStructure/reports/html/` | `evidence/reports/playwright-html-report_*/` |
| Screenshots | `test-results/` on failure | Some embedded in HTML report `data/` |
| Run index | — | `evidence/reports/RUN-MANIFEST.md` |
| Demo guide | — | `evidence/EXECUTION-DEMO.md` |

### 14.3 Evidence rules

1. Only **real** Playwright output — no hand-edited pass/fail.
2. Failed runs retained alongside green smoke evidence.
3. Re-export HTML after significant spec changes.

### 14.4 Recommended execution order

1. Exploratory refresh (if catalog changed)  
2. `npm run test:smoke -- --workers=1`  
3. `npm run test:regression -- --workers=1`  
4. `npm run test:api`  
5. Update `RUN-MANIFEST.md`

---

## 15. Known Limitations

Consolidated list; see [`limitations-and-gaps.md`](limitations-and-gaps.md) for IDs L-01–L-16.

### 15.1 Environmental

| Limitation | Impact |
|------------|--------|
| Single shared public SUT | Cart pollution, lockout (`423`), flaky seeded-user tests |
| No data reset API | Cannot guarantee clean cart/invoice state |
| Catalog drift | Anchored products may go out of stock |

### 15.2 Technical / scope

| Limitation | Impact |
|------------|--------|
| Chromium only | No cross-browser confidence |
| No CI | Reproducibility depends on local runs |
| Test count exceeds assessment cap | 12 UI + 9 API specs |
| COD-only | Credit card not covered |
| No unit tests | POM/helpers validated only via E2E/API |

### 15.3 Automation weak spots

| Area | Gap |
|------|-----|
| Invoice number format | `/INV-\d+/` only — not strict `INV-YYYY######` |
| TC-M-07 UI↔API | Committed regression run **failed** |
| TC-M-11 | Verifies **existing** seeded invoice, not create→detail E2E |
| API negatives | No automated 401-without-token or 422 weak-password specs |
| `isCashOnDeliverySelected()` | May pass on visibility fallback (R-02 partial) |

### 15.4 Future improvements (not implemented)

- GitHub Actions CI with `--workers=1` smoke on schedule  
- API negative specs for 401/422 documented in manual catalog  
- Stricter invoice regex after live pattern confirmation  
- Re-run full 21-test suite and commit green evidence (D-10)  
- Populate `defects/defect-report.md` when true SUT defects found  

---

## Traceability

| Need | Document |
|------|----------|
| Requirements (FR/AC) | [`requirements-and-planning.md`](requirements-and-planning.md) |
| Risks R-01–R-14 | [`planning.md`](planning.md) §2 |
| Manual ↔ automation ↔ data | [`traceability-matrix.md`](traceability-matrix.md) |
| Environments | [`test-environments.md`](test-environments.md) |
| Data detail | [`test-data-strategy.md`](test-data-strategy.md) |

---

## Document history

| Date | Change |
|------|--------|
| 2026-08-10 | Initial test strategy |
| 2026-08-11 | Full revision: 15-section structure, honest levels/gaps, current spec counts |
