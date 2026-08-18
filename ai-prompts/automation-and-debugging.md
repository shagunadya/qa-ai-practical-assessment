# AI Prompts – Automation and Debugging

Prompts used to implement Playwright UI/API automation and fix failures with AI assistance.

**Stack:** Playwright, JavaScript, Prism Framework (`PrismStructure/`)  
**Session date:** 2026-08-10 (automation); 2026-08-11 (evidence export)  
**Evidence sources:** Cursor agent transcript `e46fbbcf-b766-42bf-a0e8-4d0f638e5db3`, repository files under `PrismStructure/`, test run output in `evidence/reports/`.  
**Index:** See [`README.md`](README.md) for all prompt chains.

---

## Iteration chains (this file)

| Chain | Interactions | Thread |
|-------|--------------|--------|
| **AUTO-A** — Smoke stabilize | 1 → 4 | Run smoke → fix imports/locators/POM → re-run green |
| **AUTO-B** — TC-M-02 cart race | 2 → 3 → 4 | RCA (no code) → minimal fix + checkout drift → smoke verify |
| **AUTO-C** — UI regression | 5 | TC-M-03 … TC-M-08 one-at-a-time |
| **AUTO-D** — API layer | 6 → 7 → 8 → 9 | Design (no code) → auth → cart → invoice |

```text
AUTO-A:  [1 Run smoke] ──fail──► fixes in 1 ──► [4 Re-run smoke] ──► pass
AUTO-B:  [2 RCA TC-M-02] ──► [3 Fix waiter + checkout] ──► [4 pass]
AUTO-C:  [5 TC-M-03] ──► [5 TC-M-04] ──► … ──► [5 TC-M-08] ──► 6/6 regression
AUTO-D:  [6 Design] ──► [7 Auth] ──► [8 Cart] ──► [9 Invoice] ──► API regression pass
```

Each interaction below follows: **Prompt → AI response → Outcome → QA decision → Artefacts**.

---

## Automation topics (session coverage)

- [x] `playwright.config.js` (UI + API projects)
- [x] Page Objects (`PrismStructure/pages/`)
- [x] API clients (`PrismStructure/api/`)
- [x] Fixtures and shared data (`PrismStructure/fixtures/`, `PrismStructure/data/`)
- [x] Invoice Confirm / double-confirm handling (UI)
- [x] API auth lifecycle, cart, invoice helpers

---

## Interaction 1 — Run smoke suite

### Prompt

```text
npx playwright test --grep @smoke
```

### Purpose

Execute the smoke suite and establish a baseline pass/fail state.

### AI response summary

- Quoted `@smoke` for PowerShell (`"@smoke"`).
- Fixed broken `require` paths in specs (`../../` → `../../../`).
- Fixed `LoginPage` submit locator strict-mode violation.
- Extended `RegisterPage`, `ProductsPage`, and checkout flow to match current UI.
- Re-ran with `--workers=1` due to demo-site slowness under parallel load.

### What was validated

- Smoke command runs in PowerShell when grep is quoted.
- Module resolution errors cleared after import-path fix.
- Subsequent failures moved from infrastructure to application/locator issues.

### What was correct

- PowerShell `@` handling diagnosis.
- Import depth miscalculation in nested `tests/ui/*` and `tests/api/*` specs.
- Login button strict-mode issue (multiple `Sign in` matches).

### What was incorrect or incomplete

- Initial registration flow assumed a minimal form; UI required additional profile fields (fixed later in session).
- `productB: 'Pliers'` substring risk was noted but reverted after interim use of `Bolt Cutters`.
- Some exploratory notes (e.g. empty-cart message text) did not match live UI.

### Changes made

- `PrismStructure/tests/**` import paths.
- `PrismStructure/pages/LoginPage.js`, `RegisterPage.js`, `ProductsPage.js`, `CheckoutPage.js`, `CartPage.js`, `ProfilePage.js`.
- `PrismStructure/data/ui-test-data.js` (dynamic passwords, billing fields).
- `playwright.config.js` timeout adjustment.

### Final outcome

Smoke suite reached green after iterative fixes (session reported **5/5 passing** with `--workers=1`).

### AI verdict

**Helped** — accelerated environment and locator debugging; required multiple follow-up fixes as real UI behavior emerged.

---

## Interaction 2 — Root-cause analysis (TC-M-02 cart assertion)

### Prompt

```text
A Playwright UI test has failed.

Do not modify code yet.
...
Analyze the likely root causes.
Rank the causes from most likely to least likely.
...
Do not propose a code change until the root cause is understood.
```

(Context in session: **TC-M-02** `checkout.smoke.spec.js` — expected 2 cart line items, received 1.)

### Purpose

Understand failure before changing automation code.

### AI response summary

Ranked eight hypotheses. Top causes: cart API race (`POST /carts` vs `POST /carts/{id}`), navigation resetting cart context, overly broad network waiter, shared demo-user cart state.

### What was validated

- Failure screenshot/context showed **1** cart badge and **1** line item.
- `ProductsPage.clickAddToCartAndWait()` accepted any successful `/carts` response (code review).
- Network debug script (temporary) showed separate cart create and line-item add calls.

### What was correct

- **Primary root cause:** waiter resolved on cart **create** before line-item **add** completed.
- Symptom alignment: only last product reliably persisted under race timing.
- Recommendation to inspect network before coding was appropriate.

### What was incorrect or incomplete

- Hypotheses about new cart per add and Home navigation were less likely than the network-wait race (confirmed after targeted network logging).
- Template fields (`[objective]`, `[actual]`, etc.) were not pasted; analysis inferred from session context.

### Changes made

- None at this step (analysis-only per prompt).

### Final outcome

Root cause identified; enabled a one-line waiter scope fix in `ProductsPage.js`.

### AI verdict

**Helped** — structured investigation; top-ranked cause proved accurate after network evidence.

---

## Interaction 3 — Smallest maintainable fix (TC-M-02)

### Prompt

```text
Implement the smallest maintainable fix.
```

### Purpose

Fix TC-M-02 cart accumulation failure with minimal diff.

### AI response summary

- Changed `clickAddToCartAndWait()` to wait for `POST /carts/{cartId}` only.
- Simplified `addProductsToCart()` loop (each add opens home/catalog path).
- Unblocked checkout with additional **UI drift** fixes: sign-in proceed step, billing `<select>` country, house number, payment-method dropdown, Confirm button on payment step.

### What was validated

- Cart assertion passed after waiter fix (badge showed multiple items).
- Full smoke re-run after checkout fixes: **5/5 passed** (`--workers=1`).

### What was correct

- Core fix in `ProductsPage.js` was minimal and targeted.
- Checkout updates matched observed live UI (dropdown COD, billing field order, house number required).

### What was incorrect or incomplete

- Prompt asked for smallest fix; session also applied broader checkout POM updates (necessary for green smoke, but beyond strict cart-only scope).
- Temporary `scripts/debug-cart-network.js` was created then deleted (not retained in repo).

### Changes made

- `PrismStructure/pages/ProductsPage.js` — network waiter + add loop.
- `PrismStructure/pages/CheckoutPage.js` — billing/payment flow.
- `PrismStructure/data/ui-test-data.js` — country label, `houseNumber`, product anchors.

### Final outcome

**TC-M-02 @smoke** and full smoke suite green.

### AI verdict

**Partially helped** — excellent on cart race; scope expanded into checkout remediation to complete the smoke path.

---

## Interaction 4 — Re-run smoke

### Prompt

```text
npx playwright test --grep "@smoke" --workers=1
```

### Purpose

Confirm smoke stability after fixes.

### AI response summary

Executed command; reported **5/5 passed** (~1.2 min).

### What was validated

- API smoke: login token, products catalog.
- UI smoke: TC-M-01, TC-M-02, foundation URL check.

### What was correct

- Reported pass count matched executed tests in project layout at that time.

### What was incorrect or incomplete

- Did not include later-added API smoke specs (`auth-lifecycle`, `cart`) — those were implemented afterward.

### Changes made

- None.

### Final outcome

Smoke gate green at that checkpoint.

### AI verdict

**Helped** — straightforward execution and reporting.

---

## Interaction 5 — UI regression implementation (TC-M-03 onward)

### Prompt

```text
Now implement the remaining approved UI scenarios one at a time...
Implement only the next approved test.
After implementation, explain what changed.
```

(Followed by shorthand prompts: **"implement now"** → TC-M-04; **"now"** → TC-M-05 and subsequent items.)

### Purpose

Implement approved manual cases **TC-M-03** through **TC-M-08** using existing POM/fixtures/data/tags.

### AI response summary

- **TC-M-03** (`invalid-login.regression.spec.js`): error text not in `role="alert"` — broadened `LoginPage.errorMessage`.
- **TC-M-04** (`duplicate-registration.regression.spec.js`): full registration fields + `attemptRegister()`; dynamic duplicate password.
- **TC-M-05** (`empty-cart.regression.spec.js`): post-login navigation via `productsPage.open()`; `BasePage.openCart()` fallback; flexible assertions (blank cart step vs strict empty message).
- **TC-M-06** — already passing; no code change.
- **TC-M-07** — already passing.
- **TC-M-08** — fixed `isCashOnDeliverySelected()` for payment dropdown; removed invalid `clickProceedStep()` on payment step.

### What was validated

- UI regression run: **6/6 passed** (`--workers=1`).
- Smoke re-run after regression work: **5/5 passed**.

### What was correct

- Reuse of existing patterns (fixtures, `ui-test-data`, tags).
- TC-M-05 adjustment matched real empty-cart UX (no message / no Proceed).
- TC-M-08 COD detection fix aligned with dropdown UI.

### What was incorrect or incomplete

- TC-M-05 initially assumed `Your cart is empty` text (not shown on live checkout cart step).
- `BasePage.openCart()` edit failed once before retry succeeded (transcript).
- Exploratory note on empty-cart copy did not match automation reality.

### Changes made

- `PrismStructure/tests/ui/regression/*.regression.spec.js` (TC-M-03–TC-M-08).
- `PrismStructure/pages/LoginPage.js`, `RegisterPage.js`, `BasePage.js`, `CartPage.js`, `CheckoutPage.js`.
- `PrismStructure/data/ui-test-data.js`.

### Final outcome

All eight approved UI scenarios have spec files; session-verified **smoke 5/5** and **UI regression 6/6**.

### AI verdict

**Helped** — iterative scenario delivery worked; needed UI re-validation on negative/empty-cart cases.

---

## Interaction 6 — API automation design (no code)

### Prompt

```text
We are now implementing API automation using Playwright APIRequestContext.
...
Design a minimal API automation structure.
...
Do not implement code yet.
Return the proposed structure and data flow.
```

### Purpose

Plan API layer before implementation (auth, cart, products, invoice).

### AI response summary

Proposed folder layout (`api-assertions.js`, `api-fixtures.js`), scenario matrix (API-S-01…API-R-07), token lifecycle, dynamic data rules, smoke/regression tagging — aligned with `docs/test-strategy.md` and existing `ToolshopApiClient`.

### What was validated

- Cross-check against existing `playwright.config.js` `api` project and `PrismStructure/api/ToolshopApiClient.js`.
- Confirmed 5–8 API test cap from strategy doc.

### What was correct

- Reuse of existing client and `api-test-data.js` rather than new HTTP stack.
- Dynamic token and ID handling requirements matched implementation that followed.
- Separate `api-fixtures.js` recommendation was implemented later.

### What was incorrect or incomplete

- OpenAPI listed `POST /invoices` as **200**; live API returned **201** (discovered during implementation).
- Billing geo-validation constraints were not foreseen in design doc.

### Changes made

- Documentation-only at this step (design in chat).

### Final outcome

Blueprint used for subsequent API auth, cart, and invoice work.

### AI verdict

**Helped** — sensible structure; implementation revealed API/UI validation gaps.

---

## Interaction 7 — API registration and login

### Prompt

```text
Implement the API registration and login flow using Playwright APIRequestContext.
[10 requirements including synthetic data, dynamic token, tags]
Do not implement cart or invoice functionality yet.
```

(Request submitted twice in session — second pass verified and fixed registration password rejection.)

### Purpose

Implement API Flow 1 auth foundation with shared helpers.

### AI response summary

Added `api-assertions.js`, `api-fixtures.js`, `auth-lifecycle.smoke.api.spec.js`; refactored `register.api.spec.js` and `auth.smoke.api.spec.js`; `ToolshopApiClient.clearToken()`.

### What was validated

- Register/login specs: **3/3 passed** after password fix.
- `SuperSecure@123` rejected by API with breached-password message (`422`); dynamic `Qa!Test{suffix}#9` succeeded.

### What was correct

- Token stored only on client instance after successful login.
- Assertions centralized; no hardcoded bearer strings.
- Dynamic email/password via `buildRegistrationBody()`.

### What was incorrect or incomplete

- Initial `buildRegistrationBody()` used static `SuperSecure@123` from data strategy doc — **failed** until dynamic password applied.
- First implementation pass could not run tests due to environment blocks; verified on retry.

### Changes made

- `PrismStructure/api/api-assertions.js`
- `PrismStructure/fixtures/api-fixtures.js`
- `PrismStructure/tests/api/smoke/auth-lifecycle.smoke.api.spec.js`
- `PrismStructure/data/api-test-data.js` — dynamic password
- `PrismStructure/api/ToolshopApiClient.js` — `clearToken()`

### Final outcome

API auth smoke + register regression passing.

### AI verdict

**Partially helped** — solid structure; initial password data was wrong for live API policy.

---

## Interaction 8 — API cart flow

### Prompt

```text
Implement the approved API cart flow.
[authenticate → token → create cart → products → add → verify]
Do not implement invoice generation yet.
```

### Purpose

Implement API cart lifecycle with reusable auth and assertions.

### AI response summary

Added cart assertion helpers, `fetchInStockProducts()`, `cart.smoke.api.spec.js`, refactored `cart.api.spec.js` to use `registeredUser` / `cartWithProducts` patterns via fixtures.

### What was validated

- `cart.smoke.api.spec.js` and `cart.api.spec.js`: **2/2 passed**.

### What was correct

- Dynamic `product_id` and `cart_id` from API responses.
- Status checks: products `200`, cart create `201`, add `200`, get cart `200`.
- Reuse of auth helpers from Interaction 7.

### What was incorrect or incomplete

- Brief mistaken `import()` in `ToolshopApiClient` was reverted to sync `require` pattern.

### Changes made

- `PrismStructure/api/api-assertions.js` — cart helpers
- `PrismStructure/api/ToolshopApiClient.js` — `fetchInStockProducts()`
- `PrismStructure/tests/api/smoke/cart.smoke.api.spec.js`
- `PrismStructure/tests/api/regression/cart.api.spec.js`

### Final outcome

Approved API cart flow automated and passing.

### AI verdict

**Helped** — clean extension of auth fixtures and assertions.

---

## Interaction 9 — API invoice generation

### Prompt

```text
Implement the approved API invoice generation test.
[preconditions: auth, token, cart with products]
...
Do not invent response fields.
Inspect the actual API response and only assert fields that are confirmed.
```

### Purpose

Implement COD invoice creation and list verification via API.

### AI response summary

Refactored `invoice.api.spec.js`; added `expectInvoiceCreated`, `expectInvoiceListed`, `buildInvoicePayload`, `mapProfileAddressToBilling`, `cartWithProducts` fixture, `getProfile()`. Debugged billing `422` responses via live probes.

### What was validated

- Invoice `POST` returns **201** (not OpenAPI-documented 200).
- Confirmed response fields: `id`, `invoice_number`, `invoice_date`, `user_id`, `subtotal`, `total`, billing echo fields.
- `payment_method` validated on **request payload** (not returned on create response).
- `invoicelines` not always present on create — assertions conditional.
- Billing succeeds when derived from `GET /users/me` address with string placeholders for null `state`/`postal_code`.
- `invoice.api.spec.js` + `cart.api.spec.js`: **2/2 passed**.

### What was correct

- Refusal to assert undocumented response fields (e.g. `payment_method` on response).
- Live probing identified geo-validation and status-code mismatches.
- `cartWithProducts` precondition fixture reduced duplication.

### What was incorrect or incomplete

- Early billing attempts (`TS` / US synthetic addresses) failed `422` country/city validation.
- OpenAPI status `200` vs actual `201` required assertion update.
- Multiple temporary `_probe-billing` / `_debug-invoice` specs were used and removed (not part of final suite).

### Changes made

- `PrismStructure/tests/api/regression/invoice.api.spec.js`
- `PrismStructure/api/api-assertions.js` — invoice helpers
- `PrismStructure/data/api-test-data.js` — `registrationAddress`, `mapProfileAddressToBilling`
- `PrismStructure/fixtures/api-fixtures.js` — `cartWithProducts`, extended `registrationBody`
- `PrismStructure/api/ToolshopApiClient.js` — `getProfile()`

### Final outcome

API invoice regression passing with evidence-based assertions.

### AI verdict

**Partially helped** — strong final implementation after several billing false starts; live API behavior differed from docs/strategy.

---

## Interaction 10 — Git push

### Prompt

```text
git push
```

### Purpose

Push local commits to remote.

### AI response summary

Attempted `git status` / `git branch -vv`; commands were interrupted. No push completion recorded in transcript.

### What was validated

- `git log` shows local commits (e.g. `2e4c1b3 Refactor PrismStructure page objects...`); remote sync status not confirmed in session.

### What was correct

- N/A — operation did not complete.

### What was incorrect or incomplete

- Push outcome unknown; no evidence of successful `git push` in transcript.

### Changes made

- None.

### Final outcome

**Open / unverified** — retry `git status`, `git push -u origin <branch>` manually.

### AI verdict

**Partially helped** — intent clear; execution blocked/interrupted.

---

## Debugging log

| Date | Failure | AI-assisted diagnosis | Outcome |
|------|---------|------------------------|---------|
| 2026-08-10 | PowerShell `@smoke` not recognized | Quote grep pattern | Fixed |
| 2026-08-10 | `Cannot find module` in specs | Wrong relative import depth | Fixed |
| 2026-08-10 | Login strict mode (2× Sign in) | Use `login-submit` test id only | Fixed |
| 2026-08-10 | TC-M-02 cart count 1 not 2 | Wait for `POST /carts/{id}` not `POST /carts` | Fixed |
| 2026-08-10 | Checkout billing not visible | Proceed past sign-in; country `<select>` | Fixed |
| 2026-08-10 | Country option not found | Use full label `United States of America (the)` | Fixed |
| 2026-08-10 | House number required | Add `houseNumber` to data + fill order | Fixed |
| 2026-08-10 | COD payment control not found | Payment Method dropdown + Confirm | Fixed |
| 2026-08-10 | TC-M-05 empty message missing | Assert blocked checkout, not fixed copy | Fixed |
| 2026-08-10 | TC-M-08 COD selected false | Read Payment Method dropdown value | Fixed |
| 2026-08-10 | API register `422` password | Breached-password policy; dynamic password | Fixed |
| 2026-08-10 | API invoice `422` billing | Profile-based billing + string placeholders | Fixed |
| 2026-08-10 | API invoice status mismatch | Assert `201` not `200` | Fixed |

---

## Session outcomes (repository evidence)

| Suite | Specs present | Session-verified |
|-------|---------------|------------------|
| UI smoke | `auth`, `checkout`, `foundation` | 5/5 (incl. 2 API smoke at time) |
| UI regression | TC-M-03 … TC-M-08 | 6/6 |
| API smoke | `auth`, `auth-lifecycle`, `products`, `cart` | Auth + cart verified; full API suite not run in final session |
| API regression | `register`, `invalid-login`, `duplicate-register`, `cart`, `invoice` | Cart + invoice verified |

---

## Overall assessment

| Aspect | Verdict |
|--------|---------|
| Smoke stabilization (imports, login, cart race, checkout drift) | AI **helped** |
| Root-cause analysis before fix | AI **helped** |
| UI regression one-by-one delivery | AI **helped** (needed live UI checks) |
| API design document | AI **helped** |
| API auth/cart implementation | AI **helped** |
| API invoice billing | AI **partially helped** (multiple probe cycles) |
| Git push | **Incomplete** in session |

**Key lesson:** Public demo SUT behavior (UI checkout steps, API password policy, invoice geo-validation, HTTP status codes) diverged from written strategy/OpenAPI — live runs and network inspection were required to avoid false confidence.

---

## Chain AUTO-E — Checkout smoke + full suite green (2026-08-18)

| Iteration | Prompt (summary) | AI response | Outcome | QA decision |
|-----------|------------------|-------------|---------|-------------|
| E1 | Fix failing `checkout.smoke` after assessment trim | Session re-login, step-aware billing, API in-stock products | Smoke 5/5 | Accept |
| E2 | Run full suite; regression failures on static products | `fetchInStockProducts()` in UI regression specs | 14/16 | Refine |
| E3 | Billing 422 / country code mismatch | `mapProfileToUiBilling()`, NL country normalization | 15/16 | Refine |
| E4 | Duplicate invoice rows strict mode | `invoiceRowByNumber().first()` | **16/16** full suite | Accept — evidence in `evidence/reports/full_2026-08-18.log` |
