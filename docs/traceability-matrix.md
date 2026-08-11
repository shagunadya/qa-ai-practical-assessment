# Traceability Matrix — Requirements to Tests

**Assessment:** QA AI Practical Assessment  
**SUT:** Toolshop v5.0  
**Author / date:** QA lead · 2026-08-11  
**Related:** [`planning.md`](planning.md) · [`FunctionalTestCase.csv`](../FunctionalTestCase.csv) · [`test-data-strategy.md`](test-data-strategy.md)

This matrix links **assessment flows**, **manual cases**, **automation**, **risks**, and **test data** in one place for assessor review.

**Legend:** ✅ = covered · ⚠️ = partial · — = not applicable

---

## 1. Assessment flows → deliverables

| Flow ID | Description | Manual | UI auto | API auto | Strategy | Data |
|---------|-------------|--------|---------|----------|----------|------|
| **UI-AC1** | Register → login → profile | TC-M-01 | `auth.smoke.spec.js` | `auth-lifecycle.smoke.api.spec.js` | [`test-strategy.md`](test-strategy.md) §4 | [`test-data-strategy.md`](test-data-strategy.md) §1 |
| **UI-AC2** | Multi-product COD + 2× Confirm + My Invoices | TC-M-02 | `checkout.smoke.spec.js` | ⚠️ cart/invoice in API suite | §4, §7 | §2, §5–8 |
| **API-AC1** | Register/login → Bearer → cart | — | — | `auth.smoke`, `auth-lifecycle`, `cart.smoke` | §5 | §1, §9 |
| **API-AC2** | Products → cart → invoice (COD) | — | — | `products.smoke`, `invoice.api` | §5 | §5–9 |

---

## 2. Manual test case matrix

| TC ID | Scenario ID | Scenario type | Suite | Manual | UI spec | API spec | Risks | Data sets |
|-------|-------------|---------------|-------|--------|---------|----------|-------|-----------|
| TC-M-01 | SC-AC1-REG-LOGIN-PROFILE | Positive | Smoke | ✅ | `ui/smoke/auth.smoke.spec.js` | `api/smoke/auth-lifecycle.smoke.api.spec.js` | R-05, R-11 | Registration §1 |
| TC-M-02 | SC-AC2-COD-DOUBLE-CONFIRM | Positive | Smoke | ✅ | `ui/smoke/checkout.smoke.spec.js` | ⚠️ `cart.smoke`, `invoice.api` (lifecycle) | R-01–R-04, R-08, R-10, R-13 | §2, §5–8 |
| TC-M-03 | SC-LOGIN-INVALID-PWD | Negative | Regression | ✅ | `ui/regression/invalid-login.regression.spec.js` | `api/regression/invalid-login.api.spec.js` | R-07, R-12 | Invalid login §3 |
| TC-M-04 | SC-REG-DUPLICATE-EMAIL | Negative | Regression | ✅ | `ui/regression/duplicate-registration.regression.spec.js` | `api/regression/duplicate-register.api.spec.js` | R-11 | Duplicate §4 |
| TC-M-05 | SC-CART-EMPTY-CHECKOUT | Negative | Regression | ✅ | `ui/regression/empty-cart.regression.spec.js` | — | R-04, R-09 | Valid user §2 |
| TC-M-06 | SC-INV-SINGLE-CONFIRM | Edge | Regression | ✅ | `ui/regression/single-confirm.regression.spec.js` | — | R-01 | §2, §5, §7–8 |
| TC-M-07 | SC-UI-API-INVOICE-MATCH | Positive | Regression | ✅ | `ui/regression/ui-api-invoice.regression.spec.js` | `api/regression/invoice.api.spec.js` | R-13, R-14 | §2, §8–9 |
| TC-M-08 | SC-COD-PAYMENT-SELECTED | Negative | Regression | ✅ | `ui/regression/cod-payment.regression.spec.js` | — | R-02 | §2, §5, §7 |

Source: [`FunctionalTestCase.csv`](../FunctionalTestCase.csv) · Full steps and negative/edge catalog: [`manual-test-suite.md`](manual-test-suite.md).

---

## 3. UI automation matrix (all specs)

| Spec file | Tag | Maps to manual | Assessment flow | Primary risks |
|-----------|-----|----------------|-----------------|---------------|
| `foundation.smoke.spec.js` | `@smoke` | — (wiring) | — | — |
| `auth.smoke.spec.js` | `@smoke` | TC-M-01 | UI-AC1 | R-05, R-11 |
| `checkout.smoke.spec.js` | `@smoke` | TC-M-02 | UI-AC2 | R-01–R-04, R-08, R-10, R-13 |
| `invalid-login.regression.spec.js` | `@regression` | TC-M-03 | — | R-07, R-12 |
| `duplicate-registration.regression.spec.js` | `@regression` | TC-M-04 | — | R-11 |
| `empty-cart.regression.spec.js` | `@regression` | TC-M-05 | — | R-04, R-09 |
| `single-confirm.regression.spec.js` | `@regression` | TC-M-06 | — | R-01 |
| `ui-api-invoice.regression.spec.js` | `@regression` | TC-M-07 | — | R-13, R-14 |
| `cod-payment.regression.spec.js` | `@regression` | TC-M-08 | — | R-02 |

**Count:** 9 UI specs (includes 1 foundation connectivity check; assessment cap note in [`planning.md`](planning.md) §1).

---

## 4. API automation matrix (all specs)

| Spec file | Tag | Maps to manual / flow | Primary risks |
|-----------|-----|----------------------|---------------|
| `auth-lifecycle.smoke.api.spec.js` | `@smoke` | TC-M-01 / API-AC1 | R-05, R-11 |
| `auth.smoke.api.spec.js` | `@smoke` | API-AC1 (seeded login) | R-05, R-07 |
| `cart.smoke.api.spec.js` | `@smoke` | API-AC1 | R-03, R-10 |
| `products.smoke.api.spec.js` | `@smoke` | API-AC2 | — |
| `register.api.spec.js` | `@regression` | TC-M-01 pattern | R-11 |
| `invalid-login.api.spec.js` | `@regression` | TC-M-03 | R-07, R-12 |
| `duplicate-register.api.spec.js` | `@regression` | TC-M-04 | R-11 |
| `cart.api.spec.js` | `@regression` | TC-M-02 (multi-product) | R-03, R-10 |
| `invoice.api.spec.js` | `@regression` | TC-M-07 / API-AC2 | R-13, R-14 |

**Count:** 9 API specs (assessment cap note in [`planning.md`](planning.md) §1).

---

## 5. Risk → test coverage

| Risk ID | Description | Manual | UI | API |
|---------|-------------|--------|----|----|
| R-01 | Double Confirm required | TC-M-02, TC-M-06 | `checkout.smoke`, `single-confirm` | — |
| R-02 | COD must be selected | TC-M-02, TC-M-08 | `checkout.smoke`, `cod-payment` | `invoice.api` |
| R-03 | Cart persistence / race | TC-M-02 | `checkout.smoke` | `cart.smoke`, `cart.api` |
| R-04 | Empty cart checkout | TC-M-05 | `empty-cart` | — |
| R-05 | Auth/session failure | TC-M-01 | `auth.smoke` | `auth-lifecycle`, `auth.smoke` |
| R-06 | Token timing | — | — | Fixtures (fresh login) |
| R-07 | Demo lockout (423) | TC-M-03 | `invalid-login` | `invalid-login` |
| R-08 | Qty update before checkout | TC-M-02 | `checkout.smoke` | `cart.api` |
| R-09 | Empty-cart UX variance | TC-M-05 | `empty-cart` | — |
| R-10 | Multi-product cart | TC-M-02 | `checkout.smoke` | `cart.smoke`, `cart.api` |
| R-11 | Registration failures | TC-M-01, TC-M-04 | `auth.smoke`, `duplicate-registration` | `register`, `duplicate-register` |
| R-12 | Invalid login feedback | TC-M-03 | `invalid-login` | `invalid-login` |
| R-13 | Invoice in My Invoices | TC-M-02 | `checkout.smoke` | `invoice.api` |
| R-14 | UI ↔ API invoice match | TC-M-07 | `ui-api-invoice` | `invoice.api` |

Full risk definitions: [`planning.md`](planning.md) §2.

---

## 6. Test data → manual TC

| Data set (see `test-data-strategy.md`) | TC-M-01 | TC-M-02 | TC-M-03 | TC-M-04 | TC-M-05 | TC-M-06 | TC-M-07 | TC-M-08 |
|----------------------------------------|---------|---------|---------|---------|---------|---------|---------|---------|
| §1 Registration | ✅ | | | | | | | |
| §2 Seeded user | | ✅ | | | ✅ | ✅ | ✅ | ✅ |
| §3 Invalid login | | | ✅ | | | | | |
| §4 Duplicate register | | | | ✅ | | | | |
| §5 Products | | ✅ | | | | ✅ | | ✅ |
| §6 Cart qty | | ✅ | | | | | | |
| §7 Checkout / COD | | ✅ | | | | ✅ | | ✅ |
| §8 Invoice capture | | ✅ | | | | ✅ | ✅ | |
| §9 API payloads | | | | | | | ✅ | |

Code modules: `PrismStructure/data/ui-test-data.js`, `api-test-data.js`.

---

## 7. Documentation traceability

| Activity | Prompt chain | Artefact |
|----------|--------------|----------|
| Requirements analysis | Chain P1 | `ai-prompts/requirements-and-planning.md` |
| UI flow inventory | Chain P3 | `exploratory-notes.md`, this matrix §1–2 |
| API mapping | Chain P4 | `test-strategy.md` §5, `api/` client |
| Test design | Chain TD1–TD3 | `FunctionalTestCase.csv` |
| Test data | Chain DATA1–DATA5 | `test-data-strategy.md`, `PrismStructure/data/` |
| Automation | Chain AUTO-A–D | `PrismStructure/tests/` |
| Strategy & environments | — | `docs/` (this folder) |
| Evidence | Chain DOC4 | `evidence/reports/` |

---

## 8. Coverage gaps (honest)

| Gap | Impact | Planned action |
|-----|--------|----------------|
| TC-M-02 qty/total not fully asserted in UI automation | Medium | Extend `checkout.smoke` assertions |
| TC-M-07 UI spec may not assert total | Medium | Align with manual expected result |
| Seeded-user specs under lockout | High | Dynamic users or skip on `423` |
| Full suite green (D-10) | Submission gate | Re-run when SUT stable — [`planning.md`](planning.md) §3.1 |
