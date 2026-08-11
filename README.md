# QA AI Practical Assessment — Toolshop Playwright Automation

Playwright UI and API test automation for the **Practice Software Testing Toolshop**, built as part of the QA AI Capability Assessment. The project uses the **Prism Framework** layout (`PrismStructure/`) with manual test cases, strategy documentation, exploratory notes, and an AI prompt history.

**Repository:** https://github.com/shagunadya/qa-ai-practical-assessment

For assessment reflection and AI usage details, see [`project-info.md`](project-info.md).

---

## 1. Project overview

This repository delivers end-to-end QA artefacts for Toolshop v5.0:

- **Manual functional tests** — [`FunctionalTestCase.csv`](FunctionalTestCase.csv) (8 cases) · [`docs/manual-test-suite.md`](docs/manual-test-suite.md) (steps, data, expected results, negative/edge catalog)
- **UI automation** — Playwright + Page Object Model (9 automated tests)
- **API automation** — Playwright `request` API (9 automated tests)
- **Strategy, planning & traceability** — [`docs/README.md`](docs/README.md) (index): [`planning.md`](docs/planning.md), [`test-strategy.md`](docs/test-strategy.md), [`test-environments.md`](docs/test-environments.md), [`test-data-strategy.md`](docs/test-data-strategy.md), [`traceability-matrix.md`](docs/traceability-matrix.md)
- **Exploratory testing record** — `exploratory-testing/exploratory-notes.md`
- **AI-assisted workflow log** — `ai-prompts/`

Tests are tagged `@smoke` or `@regression` and run against the public practice environment (no local SUT required).

---

## 2. System Under Test

| Item | Value |
|------|-------|
| Application | Practice Software Testing **Toolshop v5.0** |
| UI URL | https://practicesoftwaretesting.com |
| API URL | https://api.practicesoftwaretesting.com |
| API documentation | https://api.practicesoftwaretesting.com/api/documentation |

The SUT is a public ecommerce practice site (registration, login, catalog, cart, Cash on Delivery checkout, invoices).

---

## 3. Assessment scope

| In scope | Out of scope |
|----------|--------------|
| UI flows: register/login/profile; multi-product cart; COD checkout; double Confirm; My Invoices | Admin-only operations |
| API flows: register/login; products; cart; invoice (`cash-on-delivery`) | Non-COD payment paths (primary coverage) |
| Manual, UI, and API automation with smoke/regression tags | Performance, load, penetration testing |
| Positive, negative, and edge scenarios | Cross-browser beyond Chromium |
| AI prompt history and responsible-use documentation | Full OpenAPI surface |

**Test caps (assessment guideline):** 5–8 automated tests per layer (UI and API, smoke + regression combined). Current counts are 9 per layer (includes a UI foundation connectivity check and an extra API smoke split). See [`docs/test-strategy.md`](docs/test-strategy.md) and [`docs/traceability-matrix.md`](docs/traceability-matrix.md).

---

## 4. Business flows

### UI Flow 1 — Registration, login, profile (TC-M-01)

Register a new user → log in → verify profile shows registered name and email.

### UI Flow 2 — COD checkout with invoice (TC-M-02)

Log in → add two in-stock products → update quantity → checkout with **Cash on Delivery** → click **Confirm twice** → verify invoice in **My Invoices**.

### API Flow 1 — Auth and cart

`POST /users/register` → `POST /users/login` (Bearer token) → `POST /carts` → add line items.

### API Flow 2 — Products, cart, invoice

`GET /products` → create cart → add items → `POST /invoices` with `payment_method: cash-on-delivery` → verify via `GET /invoices`.

### Regression highlights (manual + automated)

| ID | Scenario |
|----|----------|
| TC-M-03 | Invalid login rejected |
| TC-M-04 | Duplicate registration rejected |
| TC-M-05 | Empty cart blocks checkout |
| TC-M-06 | Single Confirm does not finalize invoice (edge) |
| TC-M-07 | UI My Invoices matches API `GET /invoices` |
| TC-M-08 | Cash on Delivery selected before Confirm |

---

## 5. Technology stack

| Component | Version / detail |
|-----------|------------------|
| Test framework | [Playwright Test](https://playwright.dev/) `^1.49.0` |
| Language | JavaScript (Node.js) |
| Structure | Prism Framework — `PrismStructure/` |
| UI browser | Chromium (Desktop Chrome profile) |
| Config | `playwright.config.js` |
| Environment | `dotenv` `^16.4.5` |
| Primary AI tool (assessment) | Cursor |

---

## 6. Repository structure

```
qa-ai-practical-assessment/
├── playwright.config.js          # Playwright config (UI + API projects)
├── package.json                  # npm scripts
├── .env.example                  # Optional environment overrides
├── FunctionalTestCase.csv        # Manual test cases (TC-M-01 … TC-M-08)
├── project-info.md               # Assessment summary and AI reflection
├── PrismStructure/
│   ├── pages/                    # Page Object Model (Login, Cart, Checkout, …)
│   ├── api/                      # ToolshopApiClient, api-assertions
│   ├── data/                     # ui-test-data.js, api-test-data.js
│   ├── fixtures/                 # test-fixtures.js, api-fixtures.js
│   ├── tests/
│   │   ├── ui/
│   │   │   ├── smoke/            # foundation, auth, checkout
│   │   │   └── regression/       # TC-M-03 … TC-M-08
│   │   └── api/
│   │       ├── smoke/            # auth, auth-lifecycle, cart, products
│   │       └── regression/       # register, login, cart, invoice, …
│   └── reports/html/             # Generated Playwright HTML report (gitignored)
├── docs/
│   ├── README.md                 # Documentation index
│   ├── planning.md               # Scope, risks, ACs
│   ├── test-strategy.md
│   ├── test-environments.md      # SUT URLs, Playwright config, workers
│   ├── test-data-strategy.md
│   ├── traceability-matrix.md    # Manual → automation → risks → data
│   └── manual-test-suite.md      # Manual cases: steps, data, pos/neg/edge
├── ai-prompts/                   # AI prompt history
├── exploratory-testing/
│   └── exploratory-notes.md
├── defects/
│   └── defect-report.md
├── .cursor/                      # Cursor rules + skills (see .cursor/README.md)
├── evidence/
│   ├── EXECUTION-DEMO.md         # How to view / re-run demo artefacts
│   └── reports/                  # Logs + HTML report copies
└── test-results/                 # Playwright run artefacts (gitignored)
```

---

## 7. Prerequisites

- **Node.js** — required to run Playwright (local development used Node v24.15.0; any current LTS should work)
- **npm** — ships with Node.js
- **Network access** — tests call the public Toolshop UI and API URLs
- **Git** — to clone the repository

No database, Docker, or local application server is required.

---

## 8. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/shagunadya/qa-ai-practical-assessment.git
cd qa-ai-practical-assessment
npm install
```

Install Playwright browser binaries (required before the first UI test run):

```bash
npx playwright install
```

To install only Chromium (matches the configured UI project):

```bash
npx playwright install chromium
```

---

## 9. Environment configuration

Configuration is optional. Defaults in `playwright.config.js` point to the public Toolshop environment.

Copy the example file and edit if needed:

**Linux / macOS:**

```bash
cp .env.example .env
```

**Windows (Command Prompt or PowerShell):**

```bat
copy .env.example .env
```

| Variable | Purpose | Default (if unset) |
|----------|---------|-------------------|
| `UI_BASE_URL` | UI `baseURL` | `https://practicesoftwaretesting.com` |
| `API_BASE_URL` | API project `baseURL` | `https://api.practicesoftwaretesting.com` |
| `TOOLSHOP_UI_EMAIL` | Seeded UI login | `customer@practicesoftwaretesting.com` |
| `TOOLSHOP_UI_PASSWORD` | Seeded UI password | `welcome01` |
| `TOOLSHOP_API_EMAIL` | API login email | Same as UI seeded user |
| `TOOLSHOP_API_PASSWORD` | API login password | Same as UI seeded user |

**Important:** Never commit `.env`. It is listed in `.gitignore`. Demo credentials are public SUT fixtures documented in `docs/test-data-strategy.md`.

---

## 10. Test data

Test data lives in shared modules (not hardcoded in individual specs):

| Module | Contents |
|--------|----------|
| `PrismStructure/data/ui-test-data.js` | Seeded user, product names, billing address, `buildRegistrationUser()` |
| `PrismStructure/data/api-test-data.js` | Endpoints, `buildRegistrationBody()`, `buildInvoicePayload()`, profile billing mapping |

**Key values:**

| Data | Value / strategy |
|------|------------------|
| Seeded UI user | `customer@practicesoftwaretesting.com` / `welcome01` |
| Dynamic registration | `john.doe.{timestamp}@example.com`, password `Qa!Test{timestamp}#9` |
| Product anchors (UI) | **Combination Pliers**, **Pliers** |
| API product IDs | Resolved at runtime from `GET /products` |
| Payment method | UI: `Cash on Delivery` · API: `cash-on-delivery` |
| Invoice Confirm (UI) | **Two clicks** required before invoice is created |

Full data rules: [`docs/test-data-strategy.md`](docs/test-data-strategy.md).

---

## 11. Run Smoke tests

Smoke tests are tagged `@smoke` in spec files.

**All smoke tests (UI + API):**

```bash
npm run test:smoke
```

Equivalent direct command:

```bash
npx playwright test --grep @smoke
```

**UI smoke only:**

```bash
npx playwright test --project=chromium --grep @smoke
```

**API smoke only:**

```bash
npx playwright test --project=api --grep @smoke
```

| Suite | Specs |
|-------|-------|
| UI smoke (3) | `foundation.smoke.spec.js`, `auth.smoke.spec.js`, `checkout.smoke.spec.js` |
| API smoke (4) | `auth.smoke.api.spec.js`, `auth-lifecycle.smoke.api.spec.js`, `cart.smoke.api.spec.js`, `products.smoke.api.spec.js` |

> **PowerShell note:** If you invoke `npx playwright` directly and `@smoke` is misinterpreted, quote the grep value: `npx playwright test --grep "@smoke"`. The `npm run` scripts do not require extra quoting.

---

## 12. Run Regression tests

Regression tests are tagged `@regression`.

**All regression tests (UI + API):**

```bash
npm run test:regression
```

Equivalent direct command:

```bash
npx playwright test --grep @regression
```

**UI regression only:**

```bash
npx playwright test --project=chromium --grep @regression
```

**API regression only:**

```bash
npx playwright test --project=api --grep @regression
```

| Suite | Specs |
|-------|-------|
| UI regression (9) | `invalid-login`, `duplicate-registration`, `empty-cart`, `single-confirm`, `ui-api-invoice`, `cod-payment`, `registration`, `logout`, `invoice-details` |
| API regression (5) | `register`, `duplicate-register`, `invalid-login`, `cart`, `invoice` |

---

## 13. Run UI tests

Run all UI tests (smoke + regression) in the **chromium** project:

```bash
npm run test:ui
```

Equivalent direct command:

```bash
npx playwright test --project=chromium
```

The `chromium` project ignores `**/api/**` tests (`playwright.config.js`). UI tests use `data-test` attributes (`testIdAttribute: 'data-test'`).

---

## 14. Run API tests

Run all API tests in the **api** project:

```bash
npm run test:api
```

Equivalent direct command:

```bash
npx playwright test --project=api
```

The API project matches `**/api/**/*.api.spec.js`, uses `API_BASE_URL` as `baseURL`, and runs with **`workers: 1`** to reduce contention on shared demo accounts.

---

## 15. Generate/view reports

### Run full suite

```bash
npm test
```

Equivalent:

```bash
npx playwright test
```

### View HTML report

After any test run, open the report:

```bash
npm run report
```

Equivalent:

```bash
npx playwright show-report PrismStructure/reports/html
```

**Report settings** (`playwright.config.js`):

- Reporters: `list` (console) + `html`
- HTML output folder: `PrismStructure/reports/html`
- Traces: `on-first-retry`
- Screenshots: `only-on-failure`
- Test output directory: `test-results/`

Both `PrismStructure/reports/html/` and `test-results/` are gitignored; reports are generated locally after each run.

---

## 16. Evidence location

| Artefact | Location | Status |
|----------|----------|--------|
| Playwright HTML report | `PrismStructure/reports/html/` | Generated on test run (`npm run report` to view) |
| Failure screenshots & traces | `test-results/` | Generated on failure |
| Submission evidence | `evidence/reports/` | Log + HTML export + `RUN-MANIFEST.md` (see `docs/test-strategy.md` §15) |
| Exploratory record | `exploratory-testing/exploratory-notes.md` | Populated |
| AI session log | `ai-prompts/automation-and-debugging.md` | Populated |

Only real execution output should be added to `evidence/` — do not commit hand-edited pass/fail results.

---

## 17. Manual test cases

Manual cases are in [`FunctionalTestCase.csv`](FunctionalTestCase.csv):

| Suite | Count | IDs |
|-------|-------|-----|
| Smoke | 2 | TC-M-01, TC-M-02 |
| Regression | 6 | TC-M-03 … TC-M-08 |
| **Total** | **8** | |

Columns include scenario type (Positive / Negative / Edge), priority, risk IDs, preconditions, steps, and expected results. Automated specs map to these IDs (e.g. `checkout.smoke.spec.js` → TC-M-02).

---

## 18. AI workflow

This assessment used **Cursor** as the primary AI tool. The workflow was:

1. **Requirements analysis** — assessment scope and risks before coding (`ai-prompts/requirements-and-planning.md`)
2. **Exploratory testing** — manual SUT walkthrough to lock selectors and flows
3. **Strategy & manual design** — `docs/`, `FunctionalTestCase.csv`
4. **Automation design gate** — API structure approved before implementation
5. **Incremental implementation** — one scenario at a time with Playwright runs after each change
6. **Evidence-based debugging** — root-cause analysis before fixes (see debugging log)
7. **Documentation** — prompt history and reflection in `ai-prompts/`, `project-info.md`

**Principle:** AI output was treated as a draft. Playwright runs, screenshots, and live API responses were the acceptance gate. See [`project-info.md`](project-info.md) §12–15 for responsible AI usage and learnings.

---

## 19. Prompt history

| File | Contents |
|------|----------|
| [`ai-prompts/requirements-and-planning.md`](ai-prompts/requirements-and-planning.md) | Assessment analysis, repo bootstrap, planning decisions |
| [`ai-prompts/test-design.md`](ai-prompts/test-design.md) | Test design template (checklist) |
| [`ai-prompts/test-data.md`](ai-prompts/test-data.md) | Test data prompt template (checklist) |
| [`ai-prompts/automation-and-debugging.md`](ai-prompts/automation-and-debugging.md) | **10 documented automation/debugging interactions** |
| [`ai-prompts/documentation-and-summary.md`](ai-prompts/documentation-and-summary.md) | Submission checklist |

---

## 20. Exploratory testing

Session notes: [`exploratory-testing/exploratory-notes.md`](exploratory-testing/exploratory-notes.md)

**Date:** 2026-08-10

**Key findings used by automation:**

- `data-test` selectors for forms, cart, and navigation
- Product anchors: **Combination Pliers**, **Pliers**
- Invoice requires **two Confirm clicks** (R-01)
- COD API value: `cash-on-delivery`
- Seeded user: `customer@practicesoftwaretesting.com` / `welcome01`

---

## 21. Defects

Defect log: [`defects/defect-report.md`](defects/defect-report.md)

**Current status:** Template only — **0 defects logged**. The double-Confirm invoice behaviour is documented as intentional SUT behaviour (risk R-01), not a defect.

---

## 22. Known limitations

Full list: [`docs/limitations-and-gaps.md`](docs/limitations-and-gaps.md). Summary:

| Limitation | Detail |
|------------|--------|
| **Shared demo environment** | Public Toolshop; lockout (`423`) and cart pollution — use `--workers=1` and dynamic users |
| **Assessment test cap** | Guideline 5–8/layer; repo has 12 UI + 9 API tests |
| **Chromium only** | No Firefox/WebKit projects |
| **No CI pipeline** | Local runs only |
| **Execution evidence** | Committed under `evidence/reports/` — see [`evidence/EXECUTION-DEMO.md`](evidence/EXECUTION-DEMO.md) |
| **Live SUT drift** | UI/API behaviour adjusted after live runs — see `ai-prompts/automation-and-debugging.md` |
| **Cursor config** | [`.cursor/rules/`](.cursor/rules/) and [`.cursor/skills/`](.cursor/skills/) |
| **Full suite green** | Smoke 7/7 evidenced; full 18-test suite may fail on shared env (honest logs retained) |

---

## Quick reference — npm scripts

All scripts are defined in [`package.json`](package.json):

| Command | What it runs |
|---------|----------------|
| `npm test` | `playwright test` — full suite (UI + API) |
| `npm run test:smoke` | `playwright test --grep @smoke` |
| `npm run test:regression` | `playwright test --grep @regression` |
| `npm run test:ui` | `playwright test --project=chromium` |
| `npm run test:api` | `playwright test --project=api` |
| `npm run report` | `playwright show-report PrismStructure/reports/html` |
