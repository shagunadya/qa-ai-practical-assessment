# Test Environments — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**Author / date:** QA lead · 2026-08-11  
**Related:** [`test-strategy.md`](test-strategy.md) · [`test-data-strategy.md`](test-data-strategy.md) · [`planning.md`](planning.md)

This document defines **where** tests run, **how** Playwright is configured, and **what** environmental risks affect reliability.

---

## 1. Environment overview

| Environment | Role | Used by | Notes |
|-------------|------|---------|-------|
| **Practice Toolshop (public)** | System under test (SUT) | All manual, UI, and API automation | Shared multi-tenant demo; no dedicated QA tenant |
| **Local runner** | Developer / CI machine | Playwright Test | Node.js + npm; Chromium for UI |
| **Evidence store** | Run artefacts (repo) | Submission only | `evidence/reports/` — logs and HTML exports |

There is **no separate staging or UAT environment** for this assessment. All automated tests target the public practice URLs unless overridden via `.env`.

---

## 2. SUT endpoints

| Service | Default URL | Override (`.env`) | OpenAPI / docs |
|---------|-------------|-------------------|----------------|
| **UI** | `https://practicesoftwaretesting.com` | `UI_BASE_URL` | Live Angular storefront (Toolshop v5.0) |
| **API** | `https://api.practicesoftwaretesting.com` | `API_BASE_URL` | Swagger: `…/docs?api-docs.json` (v5.0.0) |

**Version:** Sprint 5 / Toolshop v5.0 (per assessment brief and exploration).

**Network:** Tests require outbound HTTPS. No VPN or corporate proxy assumed.

---

## 3. Local test runner

### 3.1 Prerequisites

| Item | Requirement | Verified |
|------|-------------|----------|
| Node.js | LTS or current (project tested on **v24.15.0**) | `ai-prompts/requirements-and-planning.md` |
| npm | **11.12.1** (session) | Same |
| Browsers | Chromium via `npx playwright install chromium` | Playwright default |
| Git | Clone public repo | `master` branch |

Install dependencies from repo root:

```bash
npm install
npx playwright install chromium
```

### 3.2 Configuration files

| File | Purpose |
|------|---------|
| `playwright.config.js` | Projects, `baseURL`, timeouts, reporters |
| `.env` | Optional URL and credential overrides (not committed) |
| `.env.example` | Documented variable names and defaults |
| `package.json` | npm scripts: `test:ui`, `test:api`, `test:smoke`, `test:regression`, `report` |

`dotenv` loads `.env` at config startup (`playwright.config.js`).

---

## 4. Playwright projects

| Project | `testMatch` | `baseURL` | Browser | Workers |
|---------|-------------|-----------|---------|---------|
| **chromium** | `**/tests/**` except `**/api/**` | `UI_BASE_URL` | Desktop Chrome | Default (parallel, ~6 locally) |
| **api** | `**/api/**/*.api.spec.js` | `API_BASE_URL` | N/A (`request` API) | **1** (serial) |

**Rationale for API `workers: 1`:** Shared demo accounts (`customer@practicesoftwaretesting.com`) lock after repeated failed logins (**HTTP 423**). Serial API runs reduce parallel contention (risk **R-07** in [`planning.md`](planning.md)).

**UI parallelism:** Default parallel workers are acceptable for most UI specs; specs using the **seeded demo user** can still flake under lockout — prefer dynamic registration where possible.

### 4.1 Timeouts and diagnostics

| Setting | Value | Notes |
|---------|-------|-------|
| Test timeout | 60s | Full AC2 checkout may need headroom |
| Trace | `on-first-retry` | On failure investigation |
| Screenshot | `only-on-failure` | |
| Video | Off | Keep evidence lean |
| HTML report | `PrismStructure/reports/html` | `npm run report` to open |

---

## 5. Credentials and secrets

| Variable | Purpose | Default if unset |
|----------|---------|------------------|
| `TOOLSHOP_UI_EMAIL` | Seeded UI login | `customer@practicesoftwaretesting.com` |
| `TOOLSHOP_UI_PASSWORD` | Seeded UI login | `welcome01` |
| `TOOLSHOP_API_EMAIL` | API login | Same as UI seeded user |
| `TOOLSHOP_API_PASSWORD` | API login | Same as UI |

**Rules:**

1. Never commit `.env` (listed in `.gitignore`).
2. Public demo credentials are **SUT fixtures**, not production secrets — still load via env in code (`PrismStructure/data/`).
3. Registration and API lifecycle tests use **dynamic emails/passwords** (`buildRegistrationUser`, `buildRegistrationBody`) to avoid duplicate-email conflicts and breached-password rejection.

---

## 6. Data environment coupling

Test data is **environment-specific** to the public Toolshop catalog:

| Data type | Environment dependency | Mitigation |
|-----------|------------------------|------------|
| Product names (UI) | In-stock catalog | Anchors: Combination Pliers, Pliers — verify in [`exploratory-notes.md`](../exploratory-testing/exploratory-notes.md) |
| Product IDs (API) | Resolved at runtime via `GET /products` | Dynamic lookup in specs |
| Invoice billing (API) | Geo-validation on live API | Profile-derived billing via `GET /users/me` — see [`test-data-strategy.md`](test-data-strategy.md) §9 |
| Seeded user state | Shared account cart/lockout | Dynamic users for register flows; limit invalid-login runs |

Full data rules: [`test-data-strategy.md`](test-data-strategy.md).

---

## 7. Execution commands (by environment intent)

| Intent | Command | Project / filter |
|--------|---------|------------------|
| Full suite | `npm test` | All projects |
| UI only | `npm run test:ui` | `chromium` |
| API only | `npm run test:api` | `api` |
| Smoke | `npm run test:smoke` | `@smoke` grep |
| Regression | `npm run test:regression` | `@regression` grep |
| Stable evidence run | `npm test -- --workers=1` | Reduces UI+API contention |

PowerShell: quote grep tags, e.g. `npx playwright test --grep "@regression"`.

---

## 8. Environmental risks

| ID | Risk | Symptom | Mitigation |
|----|------|---------|------------|
| R-07 | Demo account lockout | UI login failure; API **423** | API `workers: 1`; dynamic registration; avoid repeated invalid-login on seeded user |
| Catalog drift | Product out of stock | Add-to-cart failures | Re-verify anchors in exploration; API filters in-stock |
| Network / timeout | `ETIMEDOUT` on API | Intermittent API project failures | Retry run; `--workers=1` for evidence |
| Shared cart state | Stale cart on seeded user | Wrong line counts | Clear cart helpers; prefer isolated users for checkout |

See full risk register: [`planning.md`](planning.md) §2.

---

## 9. Evidence capture (environment output)

| Output | Default path | Exported copy |
|--------|--------------|---------------|
| Console log | Terminal | `evidence/reports/*.log` |
| HTML report | `PrismStructure/reports/html/` | `evidence/reports/playwright-html-report_*/` |
| Run manifest | — | `evidence/reports/RUN-MANIFEST.md` |

Evidence reflects **real runs** against the practice environment — see [`test-strategy.md`](test-strategy.md) §15.

---

## 10. Future / out of scope

- Dedicated QA tenant or data reset API
- Cross-browser matrix (Firefox, WebKit)
- CI pipeline with scheduled runs against practice SUT
- Performance / load environments
