# Execution Evidence — Full Suite Run

| Field | Value |
|-------|-------|
| **Date** | 2026-08-11 |
| **Command** | `npm test -- --workers=1` |
| **Playwright** | via `package.json` → `playwright test` |
| **Exit code** | 1 (failures present) |
| **Result** | **10 passed**, **8 failed** (18 total) |
| **Duration** | ~5.6 minutes |

## Artefacts in this folder

| File / folder | Description |
|---------------|-------------|
| `full-suite_2026-08-11_1748.log` | Console output from the run |
| `playwright-html-report_2026-08-11_1748/` | Copy of Playwright HTML report (`index.html` + `data/`) |

## View HTML report locally

```bash
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_1748
```

Or open `playwright-html-report_2026-08-11_1748/index.html` in a browser.

## Failure summary (from log)

| Area | Likely cause |
|------|----------------|
| API `auth.smoke`, `invalid-login.regression` | Seeded user login — HTTP **423** (account locked) |
| API `cart.smoke` | `GET /products` — **ETIMEDOUT** (transient network) |
| UI tests using `customer@practicesoftwaretesting.com` | Login timeout / lockout message on UI |
| UI `invalid-login` (TC-M-03) | Expected invalid-credentials message not shown (lockout state) |

## Note

This is **real execution output** from the public Toolshop practice environment. It does not represent a fully green submission run. Re-run after demo account recovery or switch seeded-user tests to dynamic registration before claiming “all tests pass.”
