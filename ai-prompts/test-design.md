# AI Prompts – Test Design

Prompts used to design manual and automated test cases (smoke, regression, positive, negative, edge).

**SUT:** Practice Software Testing Toolshop  
**Caps:** ≤8 UI automated, ≤8 API automated (smoke + regression combined per layer)  
**Deliverables:** `FunctionalTestCase.csv`, `docs/planning.md`, `PrismStructure/tests/`

---

## Chain TD1 — Exploratory findings → manual suite

**Goal:** Convert exploration into a lean manual suite with risk traceability.

### Iteration TD1.1 — Draft case list from exploration

| Field | Content |
|-------|---------|
| **Prompt** | After completing `exploratory-testing/exploratory-notes.md`, draft up to 8 manual functional test cases covering UI AC1 (register/login/profile), UI AC2 (COD checkout + double Confirm + My Invoices), and regression guards (invalid login, duplicate register, empty cart, single Confirm edge, UI↔API invoice match, COD selected). Include Smoke/Regression, Positive/Negative/Edge, and risk IDs R-01–R-14 where applicable. Do not write automation yet. |
| **AI response** | Proposed 8 cases TC-M-01 … TC-M-08: 2 smoke (positive), 6 regression (4 negative, 1 edge, 1 positive cross-channel). Mapped risks per case (e.g. R-01 on TC-M-02/06, R-07 on TC-M-03). |
| **Outcome** | Draft rows aligned with exploration (double Confirm, COD, product anchors Combination Pliers / Pliers). |
| **QA decision** | **Refine** — tighten steps/expected results from live walkthrough; defer automation mapping. |
| **Artefacts** | Draft → `FunctionalTestCase.csv` |

### Iteration TD1.2 — Lock steps and expected results

| Field | Content |
|-------|---------|
| **Prompt** | Review each draft case against `exploratory-notes.md`. Add preconditions (demo user, empty cart start), test data placeholders (`{unique}` email), and observable pass criteria (invoice_number shape, error text for login). |
| **AI response** | Updated CSV columns: Preconditions, Test Data, Steps, Expected Result, TC Type, Suite, Priority, Risk. |
| **Outcome** | **8 cases** finalized with scenario IDs (SC-AC1-REG-LOGIN-PROFILE, SC-AC2-COD-DOUBLE-CONFIRM, etc.). |
| **QA decision** | **Accept** manual suite; proceed to automation shortlist (Chain TD2). |
| **Artefacts** | `FunctionalTestCase.csv` (committed) |

### Iteration TD1.3 — Cap alignment (2026-08-18)

| Field | Content |
|-------|---------|
| **Prompt** | Evaluator audit: manual/UI/API counts must stay within 5–8 per layer. Consolidate overlapping cases. |
| **AI response** | Removed TC-M-09–11 from CSV (logout covered in TC-M-01; invoice details in TC-M-02). Removed duplicate UI/API specs (`foundation`, `registration`, `logout`, `invoice-details`, `auth.smoke.api`). |
| **Outcome** | **8 manual**, **8 UI**, **8 API** automated tests. |
| **QA decision** | **Accept** — traceability updated in `docs/traceability-matrix.md`. |
| **Artefacts** | `FunctionalTestCase.csv`, `PrismStructure/tests/` |

---

## Chain TD2 — Smoke / regression classification & cap

**Goal:** Assign suites and keep automation within 5–8 per layer.

### Iteration TD2.1 — Classify manual vs automation priority

| Field | Content |
|-------|---------|
| **Prompt** | From the 8 manual cases, which should be automated first for smoke vs regression? Respect 5–8 combined cap per UI and API layer. |
| **AI response** | **Smoke (UI):** TC-M-01, TC-M-02. **Regression (UI):** TC-M-03 … TC-M-08. **API smoke:** auth lifecycle, products, cart. **API regression:** register, invalid login, duplicate register, cart (2 products), invoice COD. |
| **Outcome** | Tag strategy `@smoke` / `@regression` defined in `docs/test-strategy.md`. |
| **QA decision** | **Accept** with note: add `foundation.smoke` wiring check (extra UI smoke); API auth split into `auth.smoke` + `auth-lifecycle.smoke` (9 tests/layer — document cap variance). |
| **Artefacts** | `docs/test-strategy.md` §6–8 |

### Iteration TD2.2 — Positive / negative / edge balance

| Field | Content |
|-------|---------|
| **Prompt** | Verify manual suite includes positive, negative, and edge scenarios per assessment brief. |
| **AI response** | Manual: 3 positive, 4 negative, 1 edge. Automation mirrors negatives via TC-M-03–08 specs; API adds register/invoice positives. |
| **Outcome** | Balance documented in `docs/planning.md` §3. |
| **QA decision** | **Accept** — no additional manual cases; API explicit edge deferred (single Confirm is UI-only). |
| **Artefacts** | `docs/planning.md` |

---

## Chain TD3 — Manual → automation traceability

**Goal:** Map each manual TC to Playwright specs.

### Iteration TD3.1 — UI mapping

| Field | Content |
|-------|---------|
| **Prompt** | Map TC-M-01 … TC-M-08 to `PrismStructure/tests/ui/` spec files. Use `describe` block names with TC IDs. One scenario per approved iteration during implementation. |
| **AI response** | Mapping table: TC-M-01 → `auth.smoke.spec.js`, TC-M-02 → `checkout.smoke.spec.js`, TC-M-03–08 → matching `*.regression.spec.js` files. |
| **Outcome** | All 8 manual cases have UI automation counterparts (+ `foundation.smoke.spec.js`). |
| **QA decision** | **Accept** mapping; implement via Chain AUTO-C in `automation-and-debugging.md`. |
| **Artefacts** | `PrismStructure/tests/ui/`, `docs/planning.md` §4.1 |

### Iteration TD3.2 — API mapping

| Field | Content |
|-------|---------|
| **Prompt** | Map API AC1/AC2 flows to smoke/regression specs without duplicating every manual UI case. |
| **AI response** | API-AC1: `auth-lifecycle`, `auth.smoke`, `cart.smoke`, `register.regression`. API-AC2: `products.smoke`, `cart.regression`, `invoice.regression`. Negatives: `invalid-login`, `duplicate-register`. |
| **Outcome** | 9 API specs tagged; traceability in `docs/planning.md` §4.2. |
| **QA decision** | **Accept**; implement via Chain AUTO-D. |
| **Artefacts** | `PrismStructure/tests/api/` |

---

## Test design checklist

- [x] UI flow inventory (registration, login, browse, cart, COD, invoice)
- [x] API lifecycle mapping (auth, products, cart, invoice)
- [x] Manual → automation mapping in `FunctionalTestCase.csv` and `docs/planning.md`
- [x] Final UI smoke/regression shortlist (9 — includes foundation)
- [x] Final API smoke/regression shortlist (9)
