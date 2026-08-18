# Execution Evidence — Run Manifest

**Repo:** qa-ai-practical-assessment  
**SUT:** https://practicesoftwaretesting.com · https://api.practicesoftwaretesting.com  
**Demo guide:** [`../EXECUTION-DEMO.md`](../EXECUTION-DEMO.md)

---

## Latest runs (2026-08-18)

| Suite | Command | Exit | Result | Duration | Log | HTML report |
|-------|---------|------|--------|----------|-----|-------------|
| **Smoke** | `npm run test:smoke -- --workers=1` | 0 | **5/5 passed** | ~57s | [`smoke_2026-08-18.log`](smoke_2026-08-18.log) | [`playwright-html-report_2026-08-18_smoke/`](playwright-html-report_2026-08-18_smoke/index.html) |

### Smoke notes (2026-08-18)

- `checkout.smoke.spec.js` stabilized: session re-login after cart clear, step-aware billing, API in-stock product pick, invoice list via account menu.
- Shared demo SUT: `Combination Pliers` can show out of stock — checkout smoke uses `fetchInStockProducts(2)` at runtime.

---

## Previous runs (2026-08-11)

| Suite | Command | Exit | Result | Duration | Log | HTML report |
|-------|---------|------|--------|----------|-----|-------------|
| **Smoke** | `npm run test:smoke -- --workers=1` | 0 | **7/7 passed** | ~1 min | [`smoke_2026-08-11.log`](smoke_2026-08-11.log) | [`playwright-html-report_2026-08-11_smoke/`](playwright-html-report_2026-08-11_smoke/index.html) |
| **Regression** | `npm run test:regression -- --workers=1` | 1 | **10/11 passed** | ~1.5 min | [`regression_2026-08-11.log`](regression_2026-08-11.log) | [`playwright-html-report_2026-08-11_regression/`](playwright-html-report_2026-08-11_regression/index.html) |
| **UI** | `npm run test:ui -- --workers=1` | 1 | **7/9 passed** (2 failed) | ~3.8 min | [`ui_2026-08-11.log`](ui_2026-08-11.log) | [`playwright-html-report_2026-08-11_ui/`](playwright-html-report_2026-08-11_ui/index.html) |

### UI failure summary

| Spec | Likely cause |
|------|----------------|
| `checkout.smoke.spec.js` (TC-M-02) | Shared demo cart / invoice timing |
| `ui-api-invoice.regression.spec.js` (TC-M-07) | Invoice total match on dynamic user |

### Regression failure summary

| Spec | Likely cause |
|------|----------------|
| `ui-api-invoice.regression.spec.js` (TC-M-07) | Invoice total not found / timing on shared demo — see log |

### UI run note

See [`ui_2026-08-11.log`](ui_2026-08-11.log) for pass/fail breakdown. Serial run on shared SUT; invalid-login and seeded-user specs may fail under lockout.

---

## Historical runs

| Suite | Command | Exit | Result | Artefacts |
|-------|---------|------|--------|-----------|
| Full suite | `npm test -- --workers=1` | 1 | 10 pass / 8 fail | [`full-suite_2026-08-11_1748.log`](full-suite_2026-08-11_1748.log), [`playwright-html-report_2026-08-11_1748/`](playwright-html-report_2026-08-11_1748/index.html) |

---

## View reports

```bash
npx playwright show-report evidence/reports/playwright-html-report_2026-08-18_smoke
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_smoke
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_regression
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_ui
```

---

## Honesty policy

Only **real** Playwright output is stored here. Failed runs are kept alongside green smoke evidence. Do not hand-edit pass/fail in logs or HTML.
