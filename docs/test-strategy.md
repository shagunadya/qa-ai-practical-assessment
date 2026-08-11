# Test Strategy — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**SUT:** Toolshop v5.0 — UI `https://practicesoftwaretesting.com/` · API `https://api.practicesoftwaretesting.com`  
**Stack:** Playwright · JavaScript · Prism Framework (`PrismStructure/`)  
**Author / date:** QA lead · 2026-08-10 (updated 2026-08-11)

**Related:** [`README.md`](README.md) · [`planning.md`](planning.md) · [`test-environments.md`](test-environments.md) · [`test-data-strategy.md`](test-data-strategy.md) · [`traceability-matrix.md`](traceability-matrix.md)

**Basis:** Confirmed UI/API flows, requirement analysis, risk analysis (R-01–R-14).

---

## 1. Scope

| Layer | Confirmed coverage |
|-------|-------------------|
| **UI Flow 1** | Registration → Login → Profile verification |
| **UI Flow 2** | Browse → Multi-product cart → Quantity update → Checkout → **Cash on Delivery** → **Confirm invoice twice** → My Invoices → Verify invoice |
| **API Flow 1** | Register → Login → Bearer token → Create cart |
| **API Flow 2** | Bearer token → Get products → Add to cart → Verify cart → Generate invoice (`cash-on-delivery`) |
| **Manual** | Functional cases in `FunctionalTestCase.csv` with Smoke/Regression and scenario types |
| **Documentation** | This strategy, exploratory notes, defects, AI prompts, execution evidence |

**Automated caps:** 5–8 UI tests and 5–8 API tests (smoke + regression **combined** per layer).

**Priority risks:** R-01 (double Confirm), R-02 (COD), R-03/R-04 (cart), R-05–R-07 (auth/token/lockout), R-08/R-10 (qty/multi-product), R-13 (invoice visibility).

---

## 2. Out of scope

- Admin-only operations (DELETE resources, reports, bulk user admin)
- Non-COD payment paths as primary coverage (brief negatives only if within cap)
- Performance, load, and penetration testing
- Cross-browser beyond Chromium
- TOTP, forgot-password, guest checkout/invoice unless exploration adds value
- Full OpenAPI surface — only lifecycle endpoints for confirmed flows
- Fabricated execution evidence or placeholder test results

---

## 3. Test levels

| Level | Purpose | Artifact |
|-------|---------|----------|
| **Exploratory** | Close verify items (Confirm UX, cart linkage, demo users) | `exploratory-testing/exploratory-notes.md` |
| **Manual functional** | Broader human coverage, UX, UI↔API spot checks | `FunctionalTestCase.csv` |
| **UI automation** | Repeatable critical paths + capped negatives | `PrismStructure/tests/ui/` |
| **API automation** | Repeatable lifecycle + auth guards | `PrismStructure/tests/api/` |
| **Cross-channel check** | Invoice/cart parity (R-14) | Manual + exploratory |

---

## 4. UI testing approach

- **Framework:** Playwright Test + Page Object Model under `PrismStructure/pages/`
- **Structure:** `tests/ui/smoke/`, `tests/ui/regression/`
- **Selectors:** Prefer `data-test` (`testIdAttribute` in config)
- **Fixtures:** Authenticated session where AC2 requires login
- **Critical handling:** Checkout POM performs **two Confirm actions** before My Invoices assertion (R-01)
- **Browser:** Chromium; extended timeout on full AC2 E2E; trace/screenshot on failure only
- **Tags:** `@smoke`, `@regression` for selective runs

---

## 5. API testing approach

- **Framework:** Playwright Test `request` API + client classes in `PrismStructure/api/`
- **Structure:** `tests/api/smoke/`, `tests/api/regression/`
- **Auth:** `POST /users/login` → `Authorization: Bearer <access_token>` on protected calls
- **Happy path:** `POST /carts` → add items → `GET /carts/{cartId}` → `POST /invoices` with COD payload
- **Config:** Separate Playwright **api** project; **`workers: 1`** to reduce shared-user lockout (R-07)
- **Assertions:** Status codes and OpenAPI-documented response fields only — no invented fields

---

## 6. Manual testing approach

- Maintain **up to 8 lean cases** in `FunctionalTestCase.csv` (same cap discipline as automation)
- Columns: Suite (Smoke/Regression), Scenario (Positive/Negative/Edge), AC trace, automation mapping
- Execute exploratory and manual smoke before locking automation assertions
- Log defects in `defects/defect-report.md`; distinguish SUT quirks (double Confirm) from defects
- One manual UI↔API invoice comparison per release candidate (R-14)

---

## 7. Smoke testing strategy

**Goal:** Prove both AC paths run end-to-end in minutes.

| Suite | Target count | Content |
|-------|--------------|---------|
| UI smoke | 1–2 | AC2: login → multi-add → qty → COD → **2× Confirm** → My Invoices |
| API smoke | 2–3 | Flow 1 (register/login/cart) + Flow 2 (products/cart/invoice) |
| Manual smoke | 2 | AC1 register/login/profile; AC2 COD with 2× Confirm |

**Gate:** Smoke green before expanding regression or submission.

---

## 8. Regression testing strategy

**Goal:** Cover high risks within 5–8 cap per automated layer.

| Suite | Target count | Content |
|-------|--------------|---------|
| UI regression | 3–6 | Invalid login; empty-cart guard; single-Confirm edge (R-01) |
| API regression | 3–5 | 401 without token; invalid login; duplicate register; bad invoice payload |
| Manual regression | up to 6 | Invalid login, duplicate register, empty cart, single Confirm, browse/add, weak password |

Regression runs after smoke passes; failures triaged via `ai-prompts/automation-and-debugging.md`.

---

## 9. Positive testing

- **Definition:** Valid data, expected user journeys, success outcomes
- **Share of automation:** ~60% of UI/API cases
- **UI:** AC1 login/profile; AC2 full COD purchase with invoice proof
- **API:** 201 register, 200 login with token, 201 cart, 200 invoice with COD
- **Manual:** Happy-path variants not automated (profile fields, invoice field checks)

---

## 10. Negative testing

- **Definition:** Invalid auth, missing auth, invalid payloads, wrong preconditions
- **Share of automation:** ~30% of UI/API cases
- **UI:** Wrong password; checkout with empty cart (**verify** UX)
- **API:** Login without valid creds; invoice without Bearer token (401); register duplicate (409)
- **Guardrail:** Limit repeated failed logins on shared demo users (R-07)

---

## 11. Edge testing

- **Definition:** Boundary and application-specific behavior
- **Share:** ~10% automated + manual/exploratory
- **Must include:** Single Confirm vs double Confirm (R-01); quantity update after multi-add (R-08)
- **Optional if cap allows:** Invoice list scoped to authenticated user (R-13)
- **Exploratory:** Cart linkage UI↔API, token timing (R-06)

---

## 12. Test data strategy

Detailed data sets, reuse matrix, and dynamic generation rules: **[`test-data-strategy.md`](test-data-strategy.md)**.

Environment variables and SUT URLs: **[`test-environments.md`](test-environments.md)** §5–6.

| Data | Strategy |
|------|----------|
| **Users** | Seeded demo for UI smoke; **dynamic registration** for API and isolation-sensitive UI specs |
| **Credentials** | `.env` / `.env.example`; defaults in `PrismStructure/data/` |
| **Products** | UI: Combination Pliers, Pliers; API: runtime IDs from `GET /products` |
| **Invoice** | UI: COD + double Confirm; API: `cash-on-delivery`, profile-mapped billing |
| **Negatives** | Dedicated invalid password; duplicate email on seeded account |
| **Prompt trail** | `ai-prompts/test-data.md` (Chains DATA1–DATA5) |

---

## 13. Automation strategy

- **Caps:** 5–8 UI + 5–8 API tests total — quality over volume
- **Layout:** Prism Framework — `pages/`, `api/`, `data/`, `fixtures/`, `utils/`, `tests/`
- **Reuse:** Shared test data modules; single Confirm/double-Confirm helper for checkout
- **AI use:** Cursor for POM/spec drafts; human validates against exploration and OpenAPI
- **Quality bar:** All automated tests pass locally before push; iterative Git commits per phase
- **No scope creep:** One POM per major page; one API client per resource group

---

## 14. Execution strategy

| Phase | Activity |
|-------|----------|
| 1 | Exploratory session → update notes and test data anchors |
| 2 | Manual smoke cases → `FunctionalTestCase.csv` |
| 3 | Playwright scaffold + UI smoke |
| 4 | API smoke |
| 5 | Regression suites (within cap) |
| 6 | Final green run — UI + API |

**Commands (when implemented):** `npx playwright test --grep @smoke` · `npx playwright test --project=api` · full suite before evidence capture.

**Parallelism:** UI workers default OK; API project serial (`workers: 1`).

---

## 15. Evidence strategy

| Evidence | Location | Notes |
|----------|----------|-------|
| Console / run logs | `evidence/reports/` | Paste or export from test run |
| Playwright HTML report | `PrismStructure/reports/html/` | Generated; not hand-edited |
| Failure screenshots | `evidence/screenshots/` | From failed runs or key manual steps |
| Exploratory record | `exploratory-testing/exploratory-notes.md` | |
| AI prompt trail | `ai-prompts/` | Planning, design, debugging |
| Defects | `defects/defect-report.md` | |

**Rule:** Only real execution output — no fake or pre-filled pass results.

---

## 16. Traceability

Requirements → manual cases → automation → risks → data: **[`traceability-matrix.md`](traceability-matrix.md)**.

Planning baseline (scope, ACs, risk register): **[`planning.md`](planning.md)**.

---

## Summary

Lean, risk-based coverage of four confirmed flows under strict caps. Smoke proves AC2 (with **double Confirm**) and API lifecycle; regression targets auth, cart, and COD guards. Manual suite extends beyond automation; cross-channel checks stay exploratory/manual. Prism + Playwright keeps the codebase small and maintainable for a 5–10 hour assessment.
