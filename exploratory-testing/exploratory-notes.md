# Exploratory Testing Notes

**SUT:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com  
**Tester:** _(name)_  
**Date(s):** _(fill during exploration)_

---

## Session goals

- [ ] Registration and login flows
- [ ] Browse, search, product detail
- [ ] Cart and quantity updates
- [ ] Checkout — Cash on Delivery
- [ ] Invoice generation and My Invoices
- [ ] Map UI actions to API calls (network tab)

---

## Observations by area

### Registration

_(notes, validations, quirks)_

### Login and profile

_(notes, display name, error messages)_

### Browse and search

_(stable product names, no-results query, filters)_

### Cart

_(add/update qty, totals, empty cart)_

### Checkout (COD)

_(step order, address entry, payment method selection)_

### Invoice

_(Confirm button behavior, status transitions, My Invoices list)_

### API (Swagger / network)

_(endpoints, auth, required fields, error codes)_

---

## Selector notes

_(useful `data-test` attributes, fragile elements)_

---

## Questions resolved / still open

| # | Question | Answer / status |
|---|----------|-----------------|
| 1 | Must Confirm be clicked twice? | _(pending)_ |
| 2 | COD `payment_method` value for API? | _(pending)_ |
| 3 | Safe demo accounts / lockout rules? | _(pending)_ |

---

## Ideas for manual and automated tests

_(bullets to feed `FunctionalTestCase.csv` and automation shortlists)_
