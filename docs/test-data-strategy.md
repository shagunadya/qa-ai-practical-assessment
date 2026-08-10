# Test Data Strategy — Practice Software Testing Toolshop

**Basis:** Approved manual suite (`FunctionalTestCase.csv`), OpenAPI 5.0.0, risks R-01–R-14  
**Principles:** Synthetic data only · No real PII · No secrets in repo · UI/API shared modules in `PrismStructure/data/` (when automation added)

---

## Storage & configuration

| Item | Location | Notes |
|------|----------|-------|
| Static anchors | `PrismStructure/data/ui-test-data.js`, `api-test-data.js` | After exploration locks product names/IDs |
| Runtime secrets | `.env` (from `.env.example`) | Demo credentials only — never commit `.env` |
| Exploration anchors | `exploratory-testing/exploratory-notes.md` | Product names, billing field labels, Confirm UX |

**Environment variables (planned):**

| Variable | Purpose |
|----------|---------|
| `UI_BASE_URL` | `https://practicesoftwaretesting.com` |
| `API_BASE_URL` | `https://api.practicesoftwaretesting.com` |
| `TOOLSHOP_UI_EMAIL` | Seeded UI login |
| `TOOLSHOP_UI_PASSWORD` | Seeded UI login |
| `TOOLSHOP_API_EMAIL` | API login (may match UI) |
| `TOOLSHOP_API_PASSWORD` | API login |

---

## 1. Registration data

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `first_name` | Valid new user (TC-M-01) | `John` | Valid | Both | Static in data module |
| `last_name` | Valid new user | `Doe` | Valid | Both | Static |
| `email` | Unique registrant | `john.doe.{suffix}@example.com` | Valid | Both | **Dynamic** — suffix = `Date.now()` or random 6-digit |
| `password` | Meets OpenAPI rules | `SuperSecure@123` | Valid | Both | Static (public test pattern, not a production secret) |
| `dob` | Only if UI requires | `1970-01-01` | Valid | Both | Static optional — **verify** UI form |

**Invalid registration (deferred to API automation / not in manual CSV):** password `short1` (too weak) — use for API 422 if automated.

**Maps to:** TC-M-01 (valid), TC-M-04 (duplicate uses existing email, not this set).

---

## 2. Valid user (seeded demo)

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `email` | Smoke / regression login | `customer@practicesoftwaretesting.com` | Valid | Both | Static — OpenAPI login example |
| `password` | Paired with seeded email | `welcome01` | Valid | Both | Static — OpenAPI login example |
| `display_name` | UI profile assertion | _(record during exploration)_ | Valid | UI | Static after exploration |

**Usage:** TC-M-02, TC-M-05, TC-M-07, TC-M-08 (primary smoke path). Prefer for UI smoke to avoid register dependency.

**Isolation:** TC-M-06 may use `customer2@practicesoftwaretesting.com` — **verify** exists and password during exploration; or reuse email from TC-M-01 dynamic registration.

---

## 3. Invalid user (login negative)

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `email` | Known existing account | `customer@practicesoftwaretesting.com` | Valid email, invalid combo | Both | Static |
| `password` | Wrong credential | `wrongpassword` | Invalid | Both | Static |

**Guardrail (R-07):** Run TC-M-03 **once per session** on shared demo; API regression invalid-login on **dynamic registered user** when automating.

**Maps to:** TC-M-03.

---

## 4. Duplicate registration data

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `email` | Already registered | `customer@practicesoftwaretesting.com` | Invalid for register | Both | Static |
| `first_name` / `last_name` | Otherwise valid body | `Jane` / `Doe` | Valid fields | Both | Static |
| `password` | Otherwise valid | `SuperSecure@123` | Valid | Both | Static |

**API expectation:** `409` duplicate conflict (OpenAPI). **UI:** verify message during exploration.

**Maps to:** TC-M-04.

---

## 5. Product selection data

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `product_name_a` | UI browse/add (TC-M-02) | _(anchor from exploration)_ | Valid | UI primary | Static after exploration |
| `product_name_b` | Second line item | _(second in-stock product)_ | Valid | UI primary | Static after exploration |
| `product_id_a` | API cart add | _(from `GET /products` response)_ | Valid | API primary | **Dynamic** — resolve at runtime from products API |
| `product_id_b` | Second API line | _(second product id)_ | Valid | API | **Dynamic** |
| `search_query` | Optional browse | _(if tests use search — not in manual CSV)_ | Valid | UI | Static optional |

**Rule:** Lock two in-stock anchors in `exploratory-notes.md` before execution. UI uses **names**; API uses **ids** from same products.

**Maps to:** TC-M-02, TC-M-06, TC-M-08.

---

## 6. Cart quantity data

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `initial_quantity` | Add to cart | `1` | Valid | Both | Static |
| `updated_quantity` | Qty change (TC-M-02) | `2` | Valid | Both | Static |
| `cart_id` | API cart lifecycle | `01HH…` (ULID shape) | Valid | API | **Dynamic** — from `POST /carts` response |

**Invalid (automation regression only):** quantity `0` or above stock — **verify** max during exploration.

**Maps to:** TC-M-02 (qty update), API Flow 2.

---

## 7. Checkout data (UI)

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `payment_method_label` | UI COD selection | `Cash on Delivery` | Valid | UI | Static — **verify** exact label |
| `payment_method_api` | API enum value | `cash-on-delivery` | Valid | API | Static — OpenAPI enum |
| Billing fields | Address step | _(record during exploration)_ | Valid | UI | Static after exploration |

**Empty cart:** No checkout data — cart must be empty (TC-M-05).

**Maps to:** TC-M-02, TC-M-05, TC-M-06, TC-M-08.

---

## 8. Invoice data

| Field | Purpose | Example | Valid/Invalid | UI + API | Generation |
|-------|---------|---------|---------------|----------|------------|
| `invoice_number` | UI ↔ API match (TC-M-07) | `INV-2022000002` (shape from OpenAPI) | Valid | Both | **Dynamic** — captured from UI after TC-M-02 or from `POST /invoices` |
| `total` | Cross-channel compare | Numeric total from UI | Valid | Both | **Dynamic** — captured same session |
| `confirm_clicks` | Invoice generation | `2` | Valid | UI | Static — confirmed app behavior |

**Single-Confirm edge:** `confirm_clicks = 1` (TC-M-06) — expect no finalized invoice in My Invoices.

**Maps to:** TC-M-02, TC-M-06, TC-M-07.

---

## 9. API payload data

### Login — `POST /users/login`

| Field | Example | Valid/Invalid | Generation |
|-------|---------|---------------|------------|
| `email` | Same as valid user or dynamic register email | Valid | Static or dynamic |
| `password` | `welcome01` or registration password | Valid | Static |

**Response (dynamic):** `access_token`, `token_type` (`Bearer`), `expires_in` — store for subsequent calls.

### Register — `POST /users/register`

| Field | Example | Valid/Invalid | Generation |
|-------|---------|---------------|------------|
| Body | Same as registration data set §1 | Valid | Dynamic email |

### Cart — `POST /carts` / `POST /carts/{id}`

| Field | Example | Valid/Invalid | Generation |
|-------|---------|---------------|------------|
| `product_id` | From products API | Valid | Dynamic |
| `quantity` | `1` or `2` | Valid | Static |

### Invoice — `POST /invoices`

| Field | Example | Valid/Invalid | Generation |
|-------|---------|---------------|------------|
| `billing_street` | `Synthetic Street` | Valid | Static synthetic |
| `billing_city` | `Testville` | Valid | Static |
| `billing_state` | `Test State` | Valid | Static |
| `billing_country` | `TS` | Valid | Static — **verify** accepted country code |
| `billing_postal_code` | `1234AA` | Valid | Static |
| `payment_method` | `cash-on-delivery` | Valid | Static |
| `payment_details` | `{}` | Valid | Static empty object |
| `cart_id` | From cart create | Valid | **Dynamic** |

**Header:** `Authorization: Bearer {access_token}` — **dynamic** from login.

**Invalid invoice (API regression):** missing `cart_id` or empty billing field → expect `422`.

---

## Reuse matrix (manual TC → data sets)

| TC ID | Data sets used |
|-------|----------------|
| TC-M-01 | Registration §1 |
| TC-M-02 | Valid user §2, products §5, cart qty §6, checkout §7, invoice §8 |
| TC-M-03 | Invalid user §3 |
| TC-M-04 | Duplicate registration §4 |
| TC-M-05 | Valid user §2 (empty cart) |
| TC-M-06 | Valid user §2 (isolated), products §5, checkout §7, invoice §8 (1× confirm) |
| TC-M-07 | Valid user §2, invoice §8 (captured), API payload §9 |
| TC-M-08 | Valid user §2, products §5, checkout §7 |

---

## Values to generate dynamically during automation

| Value | Why dynamic | Source |
|-------|-------------|--------|
| Registration `email` | Avoid 409 duplicate | `timestamp` / random suffix |
| `access_token` | Expires; per session | `POST /users/login` |
| `cart_id` | Per cart lifecycle | `POST /carts` |
| `product_id`(s) | Stock/catalog drift | `GET /products` (filter `in_stock` if available) |
| `invoice_number` | Per order | UI capture or `POST /invoices` response |
| `total` / `subtotal` | Per order | Response or UI capture |
| Optional: entire registered user | API parallel isolation | Register per API test worker |

**Keep static:** COD payment method value, billing synthetic address template, seeded demo user for UI smoke, invalid password string, duplicate email for negative register.

---

## Rules

1. Never commit `.env` or real personal data.
2. Public demo credentials (`customer@…` / `welcome01`) are **SUT fixtures** — load from env, not scattered in specs.
3. Resolve product anchors once after exploration; fail fast if out of stock.
4. API tests: fresh login + cart per test when using shared demo users.
5. UI smoke: prefer seeded user; API smoke: register-per-run or dedicated demo per worker.
