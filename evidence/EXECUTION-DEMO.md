# Execution Demo — How to Reproduce Test Runs

**Purpose:** Assessor / reviewer quick path to **executed run artefacts** and commands used in this submission.

**Index of all runs:** [`reports/RUN-MANIFEST.md`](reports/RUN-MANIFEST.md)

---

## 1. Prerequisites

```bash
npm install
npx playwright install chromium
```

From repository root: `C:\Users\Shagun Adya\qa-ai-practical-assessment` (or your clone path).

---

## 2. Committed evidence (no local run required)

| Demo | Command (as run) | Result | Artefacts |
|------|------------------|--------|-----------|
| **Smoke suite** | `npm run test:smoke -- --workers=1` | **7/7 passed** | [`reports/smoke_2026-08-11.log`](reports/smoke_2026-08-11.log), [`reports/playwright-html-report_2026-08-11_smoke/index.html`](reports/playwright-html-report_2026-08-11_smoke/index.html) |
| **Regression suite** | `npm run test:regression -- --workers=1` | See manifest | [`reports/regression_2026-08-11.log`](reports/regression_2026-08-11.log), [`reports/playwright-html-report_2026-08-11_regression/`](reports/playwright-html-report_2026-08-11_regression/) |
| **UI layer** | `npm run test:ui -- --workers=1` | **7/9 passed** (2 failed) | [`reports/ui_2026-08-11.log`](reports/ui_2026-08-11.log), [`reports/playwright-html-report_2026-08-11_ui/`](reports/playwright-html-report_2026-08-11_ui/) |
| **Full suite (historical)** | `npm test -- --workers=1` | 10 pass / 8 fail | [`reports/full-suite_2026-08-11_1748.log`](reports/full-suite_2026-08-11_1748.log), [`reports/playwright-html-report_2026-08-11_1748/`](reports/playwright-html-report_2026-08-11_1748/) |

---

## 3. View HTML reports locally

```bash
# Smoke (green)
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_smoke

# Regression
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_regression

# UI
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_ui
```

Or open each folder’s `index.html` in a browser.

---

## 4. Re-run demo yourself

```bash
# Recommended serial runs on shared demo SUT
npm run test:smoke -- --workers=1
npm run test:regression -- --workers=1
npm run test:ui -- --workers=1
```

Export fresh evidence using the workflow in [`.cursor/skills/run-toolshop-tests/SKILL.md`](../.cursor/skills/run-toolshop-tests/SKILL.md).

---

## 5. What each suite proves

| Suite | Tests | Proves |
|-------|-------|--------|
| Smoke `@smoke` | 7 | AC1 register/login/profile/logout; AC2 COD + double Confirm + invoice details; API auth/cart/products |
| Regression `@regression` | 11 | Invalid login, duplicate register, empty cart, single Confirm, UI↔API invoice, COD, API negatives |
| UI `chromium` | 9 | All UI specs including foundation connectivity |

---

## 6. Known demo caveats

- Public Toolshop may **lock** seeded accounts after repeated invalid-login tests — see [`../docs/limitations-and-gaps.md`](../docs/limitations-and-gaps.md).
- Use `--workers=1` for reproducible demos on shared infrastructure.
- HTML report `data/` attachments appear when tests fail; green smoke report may be `index.html` only.
