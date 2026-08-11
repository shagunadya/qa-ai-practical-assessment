---
name: toolshop-qa-debug
description: Debug failing Toolshop Playwright tests using known SUT quirks, lockout, and invoice flows. Use when tests fail, flake, or need RCA on checkout/auth/API invoice.
---

# Toolshop QA Debugging

## First steps

1. Read failure screenshot/trace in `test-results/` or evidence HTML report.
2. Check `ai-prompts/automation-and-debugging.md` for prior RCAs (Chains AUTO-A–D).
3. Verify SUT reachable: UI and API base URLs in `playwright.config.js`.

## Common failures

| Symptom | Likely cause | Mitigation |
|---------|--------------|------------|
| Login timeout / `423` | Demo account lockout | Dynamic user; `--workers=1`; wait for unlock |
| Invoice not in My Invoices | Single Confirm only (R-01) | `confirmOrderTwice()` — two clicks after payment success |
| Cart total ≠ invoice total | Shared demo cart pollution | New invoice detection via `collectInvoiceNumbers()`; avoid assuming first table row |
| API register `422` password | Breached-password policy | `buildRegistrationBody()` dynamic password |
| API invoice `422` billing | Geo-validation | `mapProfileAddressToBilling()` from `GET /users/me` |
| Empty cart checkout | Expected (TC-M-05) | Assert blocked proceed, not payment step |

## UI checkout sequence

1. Billing → Proceed → COD → Confirm (payment) → **Payment successful**
2. Confirm (invoice) → **Confirm again** → invoice created
3. My Invoices / Details for line-item verification

## API invoice

- Status **201** on create; list via `GET /invoices`
- `payment_method`: `cash-on-delivery`

## Document fixes

Log prompt → response → outcome in `ai-prompts/automation-and-debugging.md` when AI assists debugging.
