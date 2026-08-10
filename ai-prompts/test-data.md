# AI Prompts – Test Data

Prompts used to define, generate, and validate test data for UI and API tests.

---

## Prompt — _(title)_

### Prompt

_(copy prompt)_

### AI Response Summary

_(short summary)_

### QA Validation

- _(e.g. no hardcoded secrets in repo)_
- _(e.g. data reusable across UI and API)_
- _(e.g. stable product/user anchors verified on SUT)_

### Changes Made

_(what you changed after reviewing AI)_

---

## Test data checklist

- [ ] Seeded vs dynamically registered users
- [ ] Product names / IDs for search and cart
- [ ] COD billing address payload
- [ ] `payment_method` value for API
- [ ] Negative data (invalid login, no-results search)
- [ ] Environment variables documented in `.env.example` _(when added)_
