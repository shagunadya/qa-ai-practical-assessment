# Documentation index — QA AI Practical Assessment

Central index for **strategy**, **scope**, **environments**, **test data**, and **traceability**. Use this folder before diving into automation or evidence.

| Document | Purpose | When to read |
|----------|---------|--------------|
| [`planning.md`](planning.md) | Scope, risk register (R-01–R-14), acceptance criteria, planning decisions | Start here for assessment baseline |
| [`test-strategy.md`](test-strategy.md) | Test levels, UI/API/manual approach, smoke/regression mix, execution & evidence | How we test and what we automate |
| [`test-environments.md`](test-environments.md) | SUT URLs, local setup, Playwright projects, workers, secrets, lockout risks | Before first run or CI setup |
| [`test-data-strategy.md`](test-data-strategy.md) | Data sets per scenario, static vs dynamic, UI/API modules, reuse rules | When writing or debugging tests |
| [`limitations-and-gaps.md`](limitations-and-gaps.md) | Known constraints, automation weak spots, residual submission gaps | Submission honesty review |
| [`traceability-matrix.md`](traceability-matrix.md) | Requirements → manual TC → UI/API specs → risks → data | Audits, coverage reviews |
| [`manual-test-suite.md`](manual-test-suite.md) | **Manual test cases** — steps, data, expected results; negative/edge catalog | Manual execution and assessor review |

**Related (outside `docs/`):**

| Artefact | Location |
|----------|----------|
| Manual test cases | [`../FunctionalTestCase.csv`](../FunctionalTestCase.csv) · [`manual-test-suite.md`](manual-test-suite.md) |
| Exploratory findings | [`../exploratory-testing/exploratory-notes.md`](../exploratory-testing/exploratory-notes.md) |
| Automation code | [`../PrismStructure/`](../PrismStructure/) |
| AI prompt history | [`../ai-prompts/`](../ai-prompts/) |
| Cursor rules & skills | [`.cursor/README.md`](../.cursor/README.md) |
| Execution demo | [`evidence/EXECUTION-DEMO.md`](../evidence/EXECUTION-DEMO.md) |
| Submission reflection | [`../project-info.md`](../project-info.md) |

---

## Quick answers (assessor checklist)

| Question | Answer | Doc |
|----------|--------|-----|
| What is in scope? | UI AC1/AC2, API AC1/AC2, manual CSV, docs, evidence | [`planning.md`](planning.md) §1 |
| What is the test strategy? | Exploratory → manual → UI/API automation; risk-based caps | [`test-strategy.md`](test-strategy.md) |
| Which environment do tests hit? | Public Toolshop practice site (UI + API); Chromium locally | [`test-environments.md`](test-environments.md) |
| How is test data managed? | `PrismStructure/data/` + `.env`; dynamic users for isolation | [`test-data-strategy.md`](test-data-strategy.md) |
| Where are manual cases (pos/neg/edge)? | 8 cases in CSV + readable suite doc | [`manual-test-suite.md`](manual-test-suite.md) |
| Where are limitations & gaps? | Consolidated doc | [`limitations-and-gaps.md`](limitations-and-gaps.md) |
| Where is execution evidence? | Logs + HTML in `evidence/reports/` | [`../evidence/EXECUTION-DEMO.md`](../evidence/EXECUTION-DEMO.md) |
