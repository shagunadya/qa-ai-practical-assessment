# Test Strategy — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**SUT:** Toolshop v5.0 — UI `https://practicesoftwaretesting.com/` · API `https://api.practicesoftwaretesting.com`  
**Stack:** Playwright · JavaScript · Prism Framework (`PrismStructure/`)  
**Date:** 2026-08-10

---

## 1. Scope

| Layer | In scope |
|-------|----------|
| **UI Flow 1** | Registration → Login → Profile verification |
| **UI Flow 2** | Browse → Multi-product cart → Quantity update → Checkout → **Cash on Delivery** → **Confirm invoice twice** → My Invoices → Verify invoice |
| **API Flow 1** | Register → Login → Bearer token → Create cart |
| **API Flow 2** | Bearer token → Get products → Add to cart → Verify cart → Generate invoice (`cash-on-delivery`) |
| **Manual** | Functional cases in `FunctionalTestCase.csv` covering above flows with Smoke/Regression and scenario types |
| **Artifacts** | Risk/requirement analysis, test data strategy, AI prompts, execution evidence, Cursor rules |

**Test caps (automated):** ≤8 UI tests total · ≤8 API tests total (smoke + regression combined per layer).

**Priority risks addressed:** Double Confirm (R-01), COD (R-02), cart consistency (R-03, R-04), auth/token (R-05–R-07), multi-product & qty (R-08, R-10), invoice visibility (R-13).

---

## 2. Out of scope

- Admin-only API operations (DELETE resources, reports)
- Non-COD payment methods except brief negatives if capped
- Performance, load, and security penetration testing
- Cross-browser matrix beyond Chromium
- TOTP, forgot-password, guest invoice paths unless time permits
- Full OpenAPI endpoint coverage
- CI/CD beyond local green runs

---

## 3. Test levels

| Level | Role |
|-------|------|
| **Exploratory** | Close open questions → `exploratory-testing/exploratory-notes.md` |
| **Manual functional** | Broader coverage → `FunctionalTestCase.csv` |
| **UI automation** | Critical paths + selected negatives → `PrismStructure/tests/ui/` |
| **API automation** | Lifecycle + auth guards → `PrismStructure/tests/api/` |
| **Integration (UI↔API)** | Manual cross-check of cart/invoice (R-14) |

---

## 4. UI testing approach

- Playwright Test + POM under `PrismStructure/pages/`
- Prefer `data-test` selectors
- Folders: `tests/ui/smoke/`, `tests/ui/regression/`
- Fixtures for authenticated sessions
- Checkout POM: **two Confirm clicks** before invoice assertion (R-01)
- Chromium only; 120s timeout on full AC2 E2E; trace/screenshot on failure

---

## 5. API testing approach

- Playwright `request` + clients in `PrismStructure/api/`
- Folders: `tests/api/smoke/`, `tests/api/regression/`
- Login → Bearer token on protected endpoints
- Sequence: cart create → add → verify → `POST /invoices` (COD)
- Separate Playwright project; **`workers: 1`** for API (R-07)

---

## 6. Manual testing approach

- `FunctionalTestCase.csv` (~15–25 lean cases)
- Trace to AC1/AC2 and risk IDs
- Defects in `defects/defect-report.md`
- Mark automation candidates in `Automated` column

---

## 7. Smoke testing strategy

| Suite | Count | Focus |
|-------|-------|-------|
| UI smoke | 1–2 | AC2 E2E with 2× Confirm + My Invoices; optional AC1 login/profile |
| API smoke | 2–3 | Register/login/cart; products → cart → COD invoice |
| Manual smoke | 3–5 | Same paths for UX validation |

Tag `@smoke`; smoke must pass before regression expansion.

---

## 8. Regression testing strategy

| Suite | Count | Focus |
|-------|-------|-------|
| UI regression | 3–6 | Invalid login; empty cart; single Confirm edge (R-01) |
| API regression | 3–5 | 401 without token; invalid login; duplicate register; bad cart invoice |
| Manual regression | CSV remainder | Registration validation, lockout awareness, UI↔API compare |

---

## 9. Positive testing

Valid journeys and payloads; ~60% of automated cases. UI AC1/AC2 happy paths; API 200/201 with OpenAPI-compliant bodies.

---

## 10. Negative testing

Invalid auth, missing token, duplicate register, wrong checkout state; ~30% automated. Limit failed logins on shared users (R-07).

---

## 11. Edge testing

Single vs double Confirm (R-01); qty after multi-add (R-08); user-scoped invoice list (R-13); ~10% automated + manual/exploratory.

---

## 12. Test data strategy

| Data | Approach |
|------|----------|
| Users | Seeded demo for smoke or register-per-run for API — document after exploration |
| Secrets | `.env` only; never commit |
| Products | ≥2 in-stock anchors in `PrismStructure/data/` after exploration |
| Invoice | `cash-on-delivery` + `{}` payment_details; valid billing per OpenAPI |
| Negatives | Isolated credentials/data for regression only |

---

## 13. Automation strategy

≤8 UI + ≤8 API tests; Prism layout; shared data and Confirm helper; Cursor for generation with human review; iterative Git commits; all tests green at submission.

---

## 14. Execution strategy

1. Exploratory → 2. Manual CSV → 3. UI smoke → 4. API smoke → 5. Regression suites → 6. Final green run.  
UI parallel OK; API serial. Log failures in `ai-prompts/automation-and-debugging.md`.

---

## 15. Evidence strategy

| Artifact | Location |
|----------|----------|
| Run logs | `evidence/reports/` |
| HTML report | `PrismStructure/reports/html/` (generated) |
| Screenshots | `evidence/screenshots/` |
| Exploratory | `exploratory-testing/exploratory-notes.md` |
| AI trail | `ai-prompts/` |

No fabricated results — actual execution only.
