# AI Prompts – Requirements and Planning

Iterative prompts used to understand Toolshop, extract assessment requirements, and draft the test plan.

**Primary AI tool:** Cursor  
**SUT:** Practice Software Testing Toolshop v5.0  
**Repo:** https://github.com/shagunadya/qa-ai-practical-assessment  
**Assessment start:** 2026-08-10

---

## Prompt 01 — Assessment Analysis

### Prompt

You are assisting me as a QA engineer completing an AI-assisted QA capability assessment.

Before generating any code, understand the assessment requirements and help me plan the work.

System Under Test:
Practice Software Testing Toolshop
https://practicesoftwaretesting.com/

Assessment requirements:
- Use Playwright with the Prism Framework
- Use Cursor as the primary AI tool
- Cover UI and API testing
- Create manual functional test cases
- Categorize tests as Smoke or Regression
- Include positive, negative and edge scenarios
- Maximum 5–8 test cases for each test type
- Create UI automation
- Create API automation using Playwright
- Document test data strategy
- Document AI prompt history
- Document AI-assisted debugging
- Include execution evidence
- All final automated tests should pass
- Use iterative Git commits
- Keep AI usage within the monthly Cursor limit

Do NOT create or modify files yet.

Analyze and provide:
1. Assessment objectives
2. SUT scope
3. Required deliverables
4. UI testing scope
5. API testing scope
6. Manual testing scope
7. Automation scope
8. Documentation scope
9. Constraints
10. Risks
11. Questions or application behavior that must be verified before implementation

Separate:
- Confirmed requirements
- Assumptions
- Items requiring application exploration

Keep the analysis concise and QA-focused.

### AI Response Summary

Produced a planning baseline covering objectives, SUT scope (Toolshop UI + API ecommerce lifecycle), 12 deliverables, and capped automation scope (UI AC1/AC2, API AC1/AC2). Identified constraints (Playwright, Prism, Cursor, green runs, iterative Git). Flagged risks: invoice Confirm quirk, shared demo account lockout (423), API parallelism on shared users. Separated confirmed requirements, assumptions (`PrismStructure/` layout, ≤8 UI + ≤8 API automated tests), and nine pre-implementation exploration items (COD flow, OpenAPI invoice sequence, demo accounts).

### QA Validation

- Checked assessment requirements — deliverables, smoke/regression, scenario types, documentation, execution evidence, and Cursor artifacts align with the exercise brief.
- Verified SUT — UI `https://practicesoftwaretesting.com/`, API `https://api.practicesoftwaretesting.com`, Sprint 5 / v5.0 Toolshop; COD checkout and invoice flows in scope.
- Verified technology requirements — Playwright for UI and API, Prism Framework (`PrismStructure/`), Cursor as primary AI tool; Node v24.15.0 / npm 11.12.1 confirmed locally.
- Verified test-count limitation — 5–8 cap applies to automated suites; manual suite can be broader; smoke + regression combined per UI and API layer (interpretation flagged for guide confirmation).

### Changes Made

- Held implementation — no code or scaffold until SUT exploration closes open questions (double Confirm, COD steps, demo users).
- Recorded ambiguous **5–8** interpretation explicitly; will confirm against participant guide before locking test shortlists.
- Deferred UI/API flow inventory and OpenAPI mapping to Prompt 02–03 after manual walkthrough and Swagger review.
- Added planning decisions table (COD-only, `data-test` selectors, Bearer JWT, API `workers: 1`) and tracked open questions in this file.
- Created `ai-prompts/requirements-and-planning.md` as the first assessment artifact instead of starting automation.

---

### Entry 2 — Repository bootstrap

- **Prompt:** Create `qa-ai-practical-assessment` as a public GitHub repo, clone locally, open in Cursor.
- **AI Response (summary):**
  - Created public repo: https://github.com/shagunadya/qa-ai-practical-assessment
  - Cloned to `C:\Users\Shagun Adya\qa-ai-practical-assessment`
  - Opened folder in Cursor; verified `node v24.15.0`, `npm 11.12.1`, empty repo on `master` with no commits.
- **Validation Notes:**
  - Environment ready for scaffold phase.
  - Next logical commit: repo structure + this planning artifact.

---

### Entry 3 — UI flow inventory (planned)

- **Prompt:**
  ```
  Analyze https://practicesoftwaretesting.com/ as a QA engineer.

  Identify the main testable ecommerce flows covering:
  - Registration
  - Login and profile
  - Product browsing and search
  - Cart and quantity updates
  - Checkout using Cash on Delivery
  - Invoice generation and verification

  Categorize the flows as Smoke or Regression. Include positive, negative, and edge scenarios.
  Keep the scope suitable for 5–8 UI automated tests.
  ```
- **AI Response (summary):** _(pending — run after SUT exploration)_
- **Validation Notes:** Defer until manual walkthrough of COD checkout and invoice Confirm behavior.

---

### Entry 4 — OpenAPI / API lifecycle mapping (planned)

- **Prompt:**
  ```
  From Toolshop OpenAPI (api.practicesoftwaretesting.com/docs?api-docs.json),
  map endpoints for AC1 (auth, cart) and AC2 (products, cart verify, invoice).
  List required fields, auth scheme, and error codes for negative API tests.
  Cap automated API design to 5–8 tests (smoke + regression).
  ```
- **AI Response (summary):** _(pending — run after Swagger/OpenAPI review)_
- **Validation Notes:** Cross-check UI network tab during checkout against mapped API sequence.

---

## Planning decisions locked so far

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Payment method | Cash on Delivery only | Assessment AC focus |
| UI selectors | `data-test` (`testIdAttribute`) | Toolshop convention |
| API auth | Bearer JWT from `POST /users/login` | OpenAPI `apiAuth` scheme |
| Automation layout | `PrismStructure/` | Prism Framework expectation |
| Demo data anchor | Explore first; likely Thor Hammer + seeded customer | Stability after exploration |
| API parallelism | Prefer `workers: 1` for API project | Avoid shared-user lockout |

---

## Open questions (track before automation)

1. Must invoice **Confirm** be clicked twice on UI? What status after first click?
2. Exact COD checkout step order and `payment_method` value for API.
3. Org interpretation of **5–8** — per suite layer vs per smoke/regression split.
4. Safe demo accounts and lockout threshold after failed logins.
5. Stable no-results search query for negative UI/API tests.

---

## Next prompts (planned sequence)

1. SUT exploration notes → update `docs/requirement-risk-analysis.md`
2. Manual suite design → `FunctionalTestCase.csv` (15–25 cases, map top picks to automation)
3. Prism scaffold + `playwright.config.js` (UI + API projects)
4. UI POMs and capped smoke/regression specs
5. API clients and capped smoke/regression specs
6. Green run + `execution-reports/` evidence
7. Debug/reflection entries in `ai-prompts/debugging.md`
