# Manual Test Suite — Practice Software Testing Toolshop

**Assessment:** QA AI Practical Assessment  
**Author / date:** QA lead · 2026-08-11  
**SUT:** https://practicesoftwaretesting.com  
**Machine-readable source:** [`FunctionalTestCase.csv`](../FunctionalTestCase.csv)  
**Related:** [`traceability-matrix.md`](traceability-matrix.md) · [`test-data-strategy.md`](test-data-strategy.md) · [`../exploratory-testing/exploratory-notes.md`](../exploratory-testing/exploratory-notes.md)

---

## 1. Suite summary

| Metric | Count |
|--------|-------|
| **Total manual cases** | 11 |
| **Smoke** | 2 (TC-M-01, TC-M-02) |
| **Regression** | 9 (TC-M-03 … TC-M-11) |
| **Positive** | 6 |
| **Negative** | 4 |
| **Edge** | 1 |

All cases include **preconditions**, **test data**, **numbered steps**, and **observable expected results**.

---

## 2. Scenario type coverage

| Scenario type | Definition | Manual TCs | What is exercised |
|---------------|------------|------------|-------------------|
| **Positive** | Valid data; happy-path user journeys | TC-M-01, TC-M-02, TC-M-07, TC-M-09, TC-M-10, TC-M-11 | Register/login/profile/logout; full COD purchase; UI↔API invoice; registration; session end; invoice details |
| **Negative** | Invalid input or wrong preconditions | TC-M-03, TC-M-04, TC-M-05, TC-M-08 | Wrong password; duplicate email; empty-cart checkout; COD not selected |
| **Edge** | Application-specific boundary behaviour | TC-M-06 | Single Confirm vs required double Confirm (R-01) |
| **Boundary (within positive)** | Limits on valid flows | TC-M-02 (qty 1→2) | Quantity update before checkout (R-08) |

### 2.1 Negative test catalog

| TC ID | Invalid condition | Input data | Expected system behaviour |
|-------|-------------------|------------|---------------------------|
| TC-M-03 | Wrong password | `wrongpassword` with valid email | Login rejected; error shown; no session |
| TC-M-04 | Duplicate email on register | `customer@practicesoftwaretesting.com` | Registration blocked; conflict/validation message |
| TC-M-05 | Checkout with empty cart | Zero line items | Proceed disabled or blocked; no payment/Confirm |
| TC-M-08 | COD not explicitly selected | Payment step without COD | COD must be selected before Confirm is allowed |

**Guardrail (R-07):** Run TC-M-03 at most **once per session** on the shared demo account to avoid lockout (`423`).

### 2.2 Edge and boundary catalog

| TC ID | Boundary / edge | Input | Expected behaviour |
|-------|-----------------|-------|-------------------|
| TC-M-06 | Invoice Confirm clicks | Exactly **1** Confirm click | Invoice **not** finalized in My Invoices |
| TC-M-02 | Cart quantity | Update Product A qty **1 → 2** | Line total and cart total reflect change before checkout |
| TC-M-05 | Empty cart | **0** products | Checkout cannot complete |
| TC-M-02 | Multi-product cart | **2** distinct products | Two line items before checkout (R-10) |

### 2.3 API-only negatives (documented; automated, not separate manual rows)

| Scenario | Data | Expected | Automation |
|----------|------|----------|------------|
| Weak registration password | `short1` | HTTP 422 | `register.api.spec.js` |
| Login without Bearer token | — | HTTP 401 on protected routes | API regression specs |
| Invalid invoice payload | Missing `cart_id` | HTTP 422 | `invoice.api.spec.js` |

---

## 3. Smoke suite

### TC-M-01 — Register, login, verify profile, and logout

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-AC1-REG-LOGIN-PROFILE |
| **Type** | Positive |
| **Suite** | Smoke |
| **Priority** | High |
| **Risks** | R-05, R-11 |
| **UI automation** | `PrismStructure/tests/ui/smoke/auth.smoke.spec.js` |

**Preconditions**

- Toolshop UI is reachable.
- Registration page loads.
- Email used is not already registered.

**Test data**

| Field | Value |
|-------|-------|
| First name | `John` |
| Last name | `Doe` |
| Email | `john.doe.{unique}@example.com` (e.g. suffix = timestamp) |
| Password | `SuperSecure@123` |

**Steps**

1. Open the registration page.
2. Enter first name, last name, email, and password.
3. Submit registration.
4. Open the login page.
5. Log in with the same email and password.
6. Open profile from the account menu (`nav-profile`).
7. Open account menu and click **Sign out**.

**Expected results**

- Registration completes without error.
- Login succeeds; account menu shows authenticated state (e.g. display name).
- Profile shows first name **John**, last name **Doe**, and email matching registration.
- After Sign out, **Sign in** is visible and profile requires login again.

**Pass criteria:** Registration, login, profile, and logout behaviours observed.

**UI automation:** `PrismStructure/tests/ui/smoke/auth.smoke.spec.js`, `registration.regression.spec.js`, `logout.regression.spec.js`

---

### TC-M-02 — Multi-product cart, quantity update, COD, double Confirm, My Invoices

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-AC2-COD-DOUBLE-CONFIRM |
| **Type** | Positive (includes quantity boundary) |
| **Suite** | Smoke |
| **Priority** | Critical |
| **Risks** | R-01, R-02, R-03, R-04, R-08, R-10, R-13 |
| **UI automation** | `PrismStructure/tests/ui/smoke/checkout.smoke.spec.js` |

**Preconditions**

- User can log in.
- Cart is empty at start.
- Products **Combination Pliers** and **Pliers** are in stock.

**Test data**

| Field | Value |
|-------|-------|
| Email | `customer@practicesoftwaretesting.com` |
| Password | `welcome01` |
| Product A | Combination Pliers |
| Product B | Pliers |
| Quantity update | Product A: 1 → **2** |
| Payment | Cash on Delivery |
| Billing street | Synthetic Street |
| Billing city | Testville |
| Billing state | Florida |
| Billing country | United States of America (the) |
| Postal code | 1234AA |

**Steps**

1. Log in with test credentials.
2. From home/catalog, add **Combination Pliers** and **Pliers** to cart.
3. Open cart; verify **two** line items.
4. Change Combination Pliers quantity to **2**; verify line total and cart total increase.
5. Click Proceed to checkout.
6. Complete billing/address fields as required.
7. Select **Cash on Delivery**.
8. Complete payment step until **Confirm** is visible.
9. Click **Confirm once** — verify invoice is **not** yet finalized (Confirm still required or no new row in My Invoices).
10. Click **Confirm** a **second** time.
11. Open **My Invoices**.
12. Record `invoice_number` and order **total** for the new invoice.
13. Click **Details** on the new invoice row.
14. Verify invoice number, product line items, and total on the detail page.

**Expected results**

- Cart shows two products before checkout.
- Quantity change reflected in totals before checkout.
- COD selected; checkout reaches Confirm step.
- After **second** Confirm, My Invoices shows new invoice with `INV-*` number and total consistent with pre-checkout cart.
- Invoice **detail** page lists both products and a total matching the list row / cart.

**Pass criteria:** Invoice visible in My Invoices only after second Confirm; totals consistent; detail page verified.

**UI automation:** `checkout.smoke.spec.js`, `invoice-details.regression.spec.js`

---

## 4. Regression suite — negative cases

### TC-M-03 — Login rejected with incorrect password

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-LOGIN-INVALID-PWD |
| **Type** | Negative |
| **Priority** | Medium |
| **Risks** | R-12, R-07 |

**Test data:** Email `customer@practicesoftwaretesting.com` · Password `wrongpassword`

**Steps**

1. Open login page.
2. Enter valid email and incorrect password.
3. Submit login.
4. Attempt to open profile without logging in.

**Expected results:** Login fails; error message displayed; user remains logged out; profile not accessible.

---

### TC-M-04 — Registration rejected for duplicate email

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-REG-DUPLICATE-EMAIL |
| **Type** | Negative |
| **Risks** | R-11 |

**Test data:** Jane Doe · Email `customer@practicesoftwaretesting.com` · Password `SuperSecure@123`

**Steps**

1. Open registration page.
2. Enter valid names, **existing** email, valid password.
3. Submit registration.

**Expected results:** Registration does not succeed; validation or conflict feedback shown; user cannot log in with new password unless it was the original account password.

---

### TC-M-05 — Checkout blocked when cart is empty

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-CART-EMPTY-CHECKOUT |
| **Type** | Negative (boundary: zero items) |
| **Risks** | R-04, R-09 |

**Test data:** Logged in as `customer@practicesoftwaretesting.com` / `welcome01` · Empty cart

**Steps**

1. Log in.
2. Open cart; confirm **zero** line items (`Your cart is empty` or equivalent).
3. Attempt checkout via Proceed (`proceed-1`) or equivalent.

**Expected results:** Checkout blocked — Proceed disabled, empty-cart message shown, or redirect without payment/Confirm. No invoice created.

---

### TC-M-08 — Cash on Delivery required before Confirm

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-COD-PAYMENT-SELECTED |
| **Type** | Negative |
| **Risks** | R-02 |

**Test data:** Seeded user · One in-stock product (e.g. Combination Pliers) · COD label **Cash on Delivery**

**Steps**

1. Log in; add one product to cart.
2. Proceed through checkout to payment step.
3. Verify COD is available; select **Cash on Delivery** if not pre-selected.
4. Reach Confirm step.
5. **Before** clicking Confirm, verify payment method shows Cash on Delivery.

**Expected results:** COD selected before Confirm; payment indicator shows Cash on Delivery (or `cash-on-delivery`) prior to Confirm.

---

## 5. Regression suite — edge and cross-channel

### TC-M-06 — Single Confirm does not finalize invoice (edge)

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-INV-SINGLE-CONFIRM |
| **Type** | Edge |
| **Priority** | High |
| **Risks** | R-01 |

**Preconditions:** Isolated user recommended (dynamic user from TC-M-01 or dedicated account) to avoid polluting smoke data.

**Test data:** One in-stock product · Cash on Delivery · **Confirm clicks = 1**

**Steps**

1. Log in.
2. Add one product; checkout with COD to Confirm step.
3. Click **Confirm exactly once**.
4. Open My Invoices **without** second Confirm.

**Expected results:** No new completed invoice row for this order, **or** UI still requires second Confirm. Documents R-01 (double Confirm is required behaviour, not a defect).

---

### TC-M-07 — UI My Invoices matches API invoice list

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-UI-API-INVOICE-MATCH |
| **Type** | Positive (cross-channel) |
| **Risks** | R-13, R-14 |

**Preconditions:** TC-M-02 completed in same session; `invoice_number` and total recorded.

**Test data:** Same user as TC-M-02 · API `https://api.practicesoftwaretesting.com`

**Steps**

1. Note `invoice_number` and total from TC-M-02 My Invoices.
2. `POST /users/login` → obtain `access_token`.
3. `GET /invoices` with `Authorization: Bearer {token}`.
4. Find entry matching TC-M-02 `invoice_number`.
5. Compare API `total` to UI total.

**Expected results:** Matching `invoice_number`; API total equals UI total (formatting differences only); invoice belongs to authenticated user only.

---

### TC-M-09 — Registration creates account with working login

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-REG-NEW-USER |
| **Type** | Positive |
| **Priority** | High |
| **Risks** | R-05, R-11 |
| **UI automation** | `PrismStructure/tests/ui/regression/registration.regression.spec.js` |

**Test data:** Dynamic user via `buildRegistrationUser()` — unique email and password.

**Steps**

1. Open registration page; complete all required fields.
2. Submit registration.
3. Log in with new credentials (if not auto-signed-in).
4. Open profile.

**Expected results:** Registration leaves `/auth/register`; login succeeds; profile shows registered name and email.

---

### TC-M-10 — Logout ends authenticated session

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-LOGOUT |
| **Type** | Positive |
| **Priority** | High |
| **Risks** | R-05 |
| **UI automation** | `PrismStructure/tests/ui/regression/logout.regression.spec.js` |

**Test data:** Dynamic user (register + login).

**Steps**

1. Log in; verify account menu shows user name.
2. Open account menu → **Sign out**.
3. Navigate directly to `/account/profile`.

**Expected results:** **Sign in** visible after logout; profile URL redirects to login; login form shown.

---

### TC-M-11 — Invoice detail page verification

| Field | Value |
|-------|-------|
| **Scenario ID** | SC-INV-DETAILS |
| **Type** | Positive |
| **Priority** | High |
| **Risks** | R-13, R-14 |
| **UI automation** | `PrismStructure/tests/ui/regression/invoice-details.regression.spec.js` |

**Preconditions:** Seeded user logged in; at least one invoice exists in My Invoices (from prior checkout on shared demo account).

**Test data:** Seeded user `customer@practicesoftwaretesting.com` / `welcome01`.

**Steps**

1. Log in and open **My Invoices**.
2. Select the newest invoice row (`INV-*`).
3. Click **Details**.
4. Verify invoice number, product line item(s), and total on the detail page.

**Expected results:** Detail URL under `/account/invoices/`; invoice number visible; product shown; total matches list row / cart total.

---

## 6. Execution notes

| Topic | Guidance |
|-------|----------|
| **Order** | Run smoke (TC-M-01, TC-M-02) before regression. TC-M-07 depends on TC-M-02. |
| **Demo lockout** | Limit invalid login on seeded user; wait or use dynamic users if `423` / account locked. |
| **Data freshness** | Use `{unique}` email for TC-M-01; re-verify in-stock products if catalog changes. |
| **Evidence** | Record pass/fail per TC; attach screenshots for manual runs in `evidence/screenshots/` if required. |

---

## 7. Traceability

| Manual TC | UI automation | API automation |
|-----------|---------------|----------------|
| TC-M-01 | `auth.smoke.spec.js` | `auth-lifecycle.smoke.api.spec.js` |
| TC-M-02 | `checkout.smoke.spec.js` | `cart.smoke`, `invoice.api` (lifecycle) |
| TC-M-03 … TC-M-11 | Matching `*.regression.spec.js` | See [`traceability-matrix.md`](traceability-matrix.md) §2 |
| TC-M-09 | `registration.regression.spec.js` | — |
| TC-M-10 | `logout.regression.spec.js` | — |
| TC-M-11 | `invoice-details.regression.spec.js` | — |
