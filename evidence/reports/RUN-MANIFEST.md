# Execution Evidence — Smoke Suite Run

| Field | Value |
|-------|-------|
| **Date** | 2026-08-11 |
| **Command** | `npm run test:smoke -- --workers=1` |
| **Playwright** | via `package.json` → `playwright test --grep @smoke` |
| **Exit code** | 0 |
| **Result** | **7 passed** / 0 failed |
| **Duration** | ~1.1 minutes |

## Artefacts in this folder

| File / folder | Description |
|---------------|-------------|
| `smoke_2026-08-11.log` | Console output from green smoke run |
| `playwright-html-report_2026-08-11_smoke/` | Playwright HTML report (`index.html` + `data/`) |
| `full-suite_2026-08-11_1748.log` | Prior full-suite run (10 pass / 8 fail) |
| `playwright-html-report_2026-08-11_1748/` | Prior full-suite HTML report |

## View HTML report locally

```bash
npx playwright show-report evidence/reports/playwright-html-report_2026-08-11_smoke
```

Or open `playwright-html-report_2026-08-11_smoke/index.html` in a browser.

## Note

Smoke suite green after assertion hardening (registration, logout, double Confirm, invoice details). Full regression suite not re-run in this export — see prior manifest for full-suite status.
