---
name: run-toolshop-tests
description: Run Playwright Toolshop tests and export execution evidence to evidence/reports/. Use when the user asks to run tests, capture logs, export HTML reports, or update RUN-MANIFEST.
---

# Run Toolshop Tests & Export Evidence

## Prerequisites

```bash
npm install
npx playwright install chromium
```

Optional: copy `.env.example` → `.env` for URL/credential overrides.

## Commands (from package.json)

| Intent | Command |
|--------|---------|
| Smoke | `npm run test:smoke -- --workers=1` |
| Regression | `npm run test:regression -- --workers=1` |
| UI only | `npm run test:ui -- --workers=1` |
| API only | `npm run test:api` |
| Full suite | `npm test -- --workers=1` |

PowerShell: quote grep tags if needed, e.g. `--grep "@regression"`.

## Export evidence

After a run:

1. Save console log: redirect stdout/stderr to `evidence/reports/<suite>_YYYY-MM-DD.log`
2. Copy HTML report: `PrismStructure/reports/html/` → `evidence/reports/playwright-html-report_YYYY-MM-DD_<suite>/`
3. Update `evidence/reports/RUN-MANIFEST.md` with command, exit code, pass/fail counts, duration
4. Update `evidence/EXECUTION-DEMO.md` if this is a submission demo run

## View report

```bash
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_smoke
```

## Stability tips

- Use `--workers=1` on shared demo SUT to reduce lockout (`423`) and cart races.
- Prefer `buildRegistrationUser()` for auth-sensitive UI specs.
- Seeded user `customer@practicesoftwaretesting.com` — limit invalid-login repetitions.
