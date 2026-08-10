# Exploratory Testing Notes

**SUT:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com  
**Tester:** Shagun Adya  
**Date(s):** 2026-08-10

---

## Session goals

- [x] Registration and login flows
- [x] Browse, search, product detail
- [x] Cart and quantity updates
- [x] Checkout — Cash on Delivery
- [x] Invoice generation and My Invoices
- [x] Map UI actions to API calls (network tab)

---

## Observations by area

### Registration

- `data-test`: `register-form`, `first-name`, `last-name`, `email`, `password`, `register-submit`
- Valid pattern: `john.doe.{unique}@example.com` + `SuperSecure@123`
- Duplicate email (`customer@practicesoftwaretesting.com`) shows alert; stays on register URL

### Login and profile

- `data-test`: `login-form`, `email`, `password`, `login-submit`
- Role fallback: `getByRole('textbox', { name: /email/i })` works when submit flaky
- Seeded user: `customer@practicesoftwaretesting.com` / `welcome01`
- Display name in account menu: **Jane Doe**
- Profile nav: `nav-profile` under `nav-menu`

### Browse and search

- `data-test`: `search-query`, `search-submit`, `product-name`, `product-{id}` on cards
- Locked in-stock anchors: **Combination Pliers**, **Pliers**
- PDP add: `add-to-cart` or button `Add to cart`

### Cart

- `data-test`: `proceed-1`, `cart-total`, `nav-cart`, line `product-name`
- Qty: spinbutton in product row; blur after fill
- Empty cart message: `Your cart is empty`; `proceed-1` disabled when empty

### Checkout (COD)

- Billing labels: Street, City, State, Country, Postal/Zip
- Synthetic billing used in automation: Synthetic Street, Testville, Florida, United States, 1234AA
- COD label: **Cash on Delivery** (radio/label)
- Success message before Confirm: `Payment was successful`
- Confirm button: role `button`, name `Confirm`

### Invoice

- **Confirm must be clicked twice** before invoice is created (R-01)
- Single Confirm leaves user on success step; new user has **0** invoice rows
- My Invoices: `nav-my-invoices`, table rows with `INV-{digits}`

### API (Swagger / network)

- `POST /users/register`, `POST /users/login` → `access_token`
- `GET /products`, `POST /carts`, `POST /carts/{id}`, `POST /invoices`, `GET /invoices`
- COD: `payment_method: cash-on-delivery`, `payment_details: {}`
- Duplicate register: **409**; invalid login: **401**

---

## Selector notes

| Area | Stable | Fragile / fallback |
|------|--------|-------------------|
| Login submit | `login-submit` | `button` name `/sign in/i` |
| Add to cart | `add-to-cart` | `Add to cart` button |
| Profile link | `nav-profile` | link `/profile|account/i` |

---

## Questions resolved / still open

| # | Question | Answer / status |
|---|----------|-----------------|
| 1 | Must Confirm be clicked twice? | **Yes** — required for invoice (R-01) |
| 2 | COD `payment_method` value for API? | **`cash-on-delivery`** |
| 3 | Safe demo accounts / lockout rules? | Use `customer@…` once per session for invalid login (R-07); prefer dynamic register for isolation |

---

## Ideas for manual and automated tests

- TC-M-01–M-08 mapped in `FunctionalTestCase.csv` and Playwright specs under `PrismStructure/tests/`
