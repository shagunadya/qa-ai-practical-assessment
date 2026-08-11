# Project Info — QA AI Capability Exercise

## AI Tool & Workflow

| Item | Detail |
|------|--------|
| Primary AI tool(s) | Cursor |
| Models / modes used | _(e.g. Composer, Auto)_ |
| Assessment start date | 2026-08-10 |
| Submission date | _(fill on submit)_ |

### How I use AI in this project

_(Describe planning, test design, automation, debugging, documentation.)_

### Strengths observed

_(What worked well with AI-assisted QA.)_

### Gaps / limitations

_(Where AI output needed correction or manual verification.)_

- Static test-data assumptions (e.g. `SuperSecure@123`, OpenAPI status codes) often disagreed with the live SUT.
- UI and API behaviour required re-validation through Playwright runs, screenshots, and targeted probes — not documentation alone.
- See `ai-prompts/automation-and-debugging.md` for per-interaction verdicts (helped / partially helped / incomplete).

---

## Responsible AI

This section describes how AI was used for the **QA AI Capability Exercise**, aligned with assessment deliverables (prompt history, debugging log, green automated tests) and the workflow recorded in `ai-prompts/`.

### 1. What information was provided to AI

| Category | Examples shared with Cursor |
|----------|----------------------------|
| Assessment brief | Playwright + Prism scope, smoke/regression caps (5–8 per layer), UI + API + manual deliverables, documentation and evidence requirements |
| Repository context | `PrismStructure/` code, `FunctionalTestCase.csv`, `docs/test-strategy.md`, `docs/test-data-strategy.md`, `exploratory-testing/exploratory-notes.md` |
| SUT references | Public UI/API URLs, OpenAPI/Swagger references, approved scenario IDs (TC-M-01 … TC-M-08) |
| Failure artefacts | Playwright error output, `error-context.md`, failure screenshots, relevant spec and Page Object excerpts |
| Execution feedback | Pass/fail results from `npx playwright test` (including `--grep "@smoke"` and `--workers=1`) |
| Intentional constraints | Prompts such as “do not modify code yet”, “implement only the next test”, “do not implement invoice yet”, “do not invent response fields” |

Public **demo credentials** used by the SUT (`customer@practicesoftwaretesting.com` / `welcome01`) were referenced as test fixtures in data modules and strategy docs — they are documented demo accounts, not private credentials.

### 2. What information was intentionally not provided

| Not shared | Reason |
|------------|--------|
| `.env` contents or local overrides | Credentials load from env when set; `.env` is gitignored and documented only via `.env.example` |
| Hardcoded bearer tokens or session cookies | Tokens are obtained at runtime via `POST /users/login` |
| Real personal data | Registration uses synthetic names/emails (`john.doe.{timestamp}@example.com`) |
| Production or employer systems | Scope limited to the public Toolshop practice environment |
| Unrelated repositories or proprietary code | Implementation stayed within this assessment repo |

External reference implementations (e.g. third-party GitHub examples) were **not** fed into AI when fetch was declined or blocked; fixes relied on live API/UI behaviour instead.

### 3. How sensitive data was handled

- **Synthetic data by default** — shared modules in `PrismStructure/data/` use generated emails and dynamic passwords (`Qa!Test{timestamp}#9`).
- **No secrets in repo** — `.env.example` documents optional env vars; demo passwords in data files are public SUT examples called out in `docs/test-data-strategy.md`.
- **Runtime tokens only** — `ToolshopApiClient` stores `access_token` in memory for the test session; nothing is pasted into prompts or committed.
- **No additional secret-scanning tooling** was added for this exercise; control was procedural (review before commit, no `.env` in git).

### 4. How generated code was validated

| Step | What I did |
|------|------------|
| Execute tests | Ran Playwright locally (`npx playwright test`, `--grep "@smoke"` / `@regression`, `--project=api`, `--workers=1` where needed) |
| Inspect failures | Used HTML reports, screenshots, and Playwright `error-context.md` to confirm locators and assertions |
| Confirm against exploration | Cross-checked selectors, checkout steps, and product anchors with `exploratory-testing/exploratory-notes.md` |
| Network evidence | For TC-M-02 cart race, verified `/carts` vs `/carts/{id}` calls before applying the waiter fix |
| Live API behaviour | For invoice billing, used probe runs to read real `422` messages and adjusted payloads (see debugging log) |
| Code review | Kept changes in existing Prism patterns (POM, `ToolshopApiClient`, shared `api-assertions.js`, fixtures) |

Generated code was **not** accepted on first draft when runs failed or contradicted observed behaviour.

### 5. How generated test cases were validated

- **Traceability** — Automated specs map to approved IDs in `FunctionalTestCase.csv` (e.g. TC-M-02 smoke, TC-M-03–TC-M-08 regression).
- **Tagging** — `@smoke` / `@regression` and Positive / Negative / Edge classification applied per strategy.
- **Business assertions** — Assertions target user-visible outcomes (login error text, cart line counts, invoice number shape, COD selected) rather than implementation details.
- **API field discipline** — Invoice assertions were limited to fields confirmed in live `POST /invoices` and `GET /invoices` responses; undocumented fields (e.g. `payment_method` on create response) were not asserted.
- **Cap discipline** — UI and API automated counts kept within the 5–8 per-layer guideline in `docs/test-strategy.md`.

Manual cases in `FunctionalTestCase.csv` were authored/reviewed separately; AI assisted automation mapping, not replacement of exploratory findings.

### 6. How hallucinations or incorrect assumptions were handled

| AI assumption | How it was caught | Resolution |
|---------------|-------------------|------------|
| Cart waiter on any `/carts` response | Stable “1 item not 2” failure; network logging | Wait for `POST /carts/{cartId}` only |
| Checkout UI unchanged since notes | Billing/payment step failures | Updated `CheckoutPage` for sign-in proceed, country `<select>`, house number, COD dropdown |
| `SuperSecure@123` valid for API register | `422` breached-password message | Dynamic password in `buildRegistrationBody()` |
| `POST /invoices` returns `200` (OpenAPI) | Live response status `201` | Assert `201` in `expectInvoiceCreated` |
| Generic US billing addresses valid | Repeated `422` geo-validation errors | Profile-based billing via `GET /users/me` + `mapProfileAddressToBilling()` |
| Empty cart shows “Your cart is empty” | Screenshot: blank cart step | Relaxed assertions to blocked checkout / no payment step |
| `payment_method` on invoice response | Field absent in create body | Assert COD on **request payload** only |

When AI output conflicted with execution results, **the run result and screenshots took precedence** over docs or model suggestions.

### 7. Human-in-the-loop decisions

- **Plan before code** — Requirements analysis and API structure design completed with explicit “do not implement yet” prompts.
- **Diagnose before fix** — TC-M-02 failure analyzed with a ranked root-cause prompt before any code change.
- **Incremental delivery** — UI regression implemented one approved scenario at a time; API split into auth → cart → invoice phases.
- **Scope gates** — I deferred cart/invoice API work until auth was stable and rejected broad refactors (“do not redesign the framework”).
- **Evidence logging** — Session outcomes captured in `ai-prompts/automation-and-debugging.md` for assessor review.
- **Git discipline** — Iterative commits per phase (per assessment requirement); commit/push verified manually when IDE operations timed out.

### 8. When AI recommendations were rejected

| Situation | Decision |
|-----------|----------|
| Root-cause analysis requested | **No code changes** until investigation completed |
| API automation design pass | **No implementation** until structure approved |
| External GitHub source fetch for invoice examples | **Skipped** — relied on live API probes and OpenAPI already in repo |
| One-off `node` HTTPS probes (Auto-review block) | **Not used** — used Playwright tests and temporary probe specs instead |
| Asserting undocumented API response fields | **Rejected** — only confirmed fields asserted |
| Strict empty-cart copy assertion | **Rejected** after UI showed blank cart step without message |
| `clickProceedStep()` on payment step (TC-M-08) | **Rejected** — payment step uses **Confirm**, not Proceed |
| Hardcoded `product_id`, `cart_id`, or bearer tokens | **Rejected** — dynamic resolution only |

---

## Application Under Test

| Item | Detail |
|------|--------|
| Application | Practice Software Testing Toolshop v5.0 |
| UI URL | https://practicesoftwaretesting.com/ |
| API URL | https://api.practicesoftwaretesting.com |
| API docs | https://api.practicesoftwaretesting.com/api/documentation |

### Project summary

_(Brief description of scope: registration, login, browse/search, cart, COD checkout, invoice.)_

### Out of scope

_(Admin, non-COD payment methods, etc.)_

---

## Technology Stack

| Item | Detail |
|------|--------|
| Test framework | Playwright Test |
| Language | JavaScript |
| Structure | Prism Framework (`PrismStructure/`) |
| UI browser | Chromium _(default)_ |
| Repo | https://github.com/shagunadya/qa-ai-practical-assessment |

---

## Test Coverage Summary

| Layer | Smoke | Regression | Total (cap 5–8) |
|-------|-------|------------|-----------------|
| Manual (`FunctionalTestCase.csv`) | _(count)_ | _(count)_ | _(count)_ |
| UI automation | _(count)_ | _(count)_ | _(count)_ |
| API automation | _(count)_ | _(count)_ | _(count)_ |

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| _(e.g. invoice Confirm quirk)_ | _(planned handling)_ |
| _(e.g. shared demo account lockout)_ | _(planned handling)_ |

---

## Reflection

_(Short reflection on AI-assisted workflow and growth areas.)_
