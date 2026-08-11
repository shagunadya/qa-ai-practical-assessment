# AI Prompts – Documentation and Summary

Prompts used for README, execution evidence, reflection, and submission packaging.

---

## Chain DOC1 — Project reflection (`project-info.md`)

**Goal:** Assessment Part A — AI usage, validation, responsible AI, learnings.

### Iteration DOC1.1 — Responsible AI section

| Field | Content |
|-------|---------|
| **Prompt** | Draft Responsible AI section for `project-info.md`: what was shared with AI, what was avoided, validation steps, hallucination handling, human-in-the-loop decisions, when AI was rejected. Base on `ai-prompts/` and debugging log. |
| **AI response** | Eight subsections (information shared/avoided, sensitive data, code validation, test validation, hallucinations table, human decisions, rejected recommendations). |
| **Outcome** | Section committed (`4d6d6a5`, `184e0f4`). |
| **QA decision** | **Refine** — merge with reflection; restructure to 15-section assessment format. |
| **Artefacts** | `project-info.md` §12–15 (evolved) |

### Iteration DOC1.2 — Full 15-section structure

| Field | Content |
|-------|---------|
| **Prompt** | Review entire repository and rewrite `project-info.md` using required sections: summary, tools, setup, AI context, requirements, strategy, manual design, automation, validation, test data, debugging, responsible AI, workflow, learnings. Evidence-based only. |
| **AI response** | Complete `project-info.md` with coverage counts, honest gaps (empty evidence at time, template prompts). |
| **Outcome** | Submission-ready reflection doc. |
| **QA decision** | **Accept**; fill submission date before final handoff. |
| **Artefacts** | `project-info.md` (`ca31df6`) |

---

## Chain DOC2 — README (setup & execution)

### Iteration DOC2.1 — Executor README

| Field | Content |
|-------|---------|
| **Prompt** | Create final `README.md` so a new QA engineer can install and run UI/API/smoke/regression tests. Use only verified commands from `package.json` and `playwright.config.js`. Include 22 sections per assessment checklist. |
| **AI response** | Full README with npm scripts, project structure, SUT, limitations, links to `ai-prompts/` and `evidence/`. |
| **Outcome** | README committed (`ca31df6`). |
| **QA decision** | **Accept**. |
| **Artefacts** | `README.md` |

---

## Chain DOC3 — Planning consolidation

### Iteration DOC3.1 — Planning doc with traceability

| Field | Content |
|-------|---------|
| **Prompt** | Add planning doc with scope, risks (R-01–R-14), acceptance criteria, traceability manual → automation → risks. |
| **AI response** | `docs/planning.md` with risk register, AC tables, traceability matrices, open items. |
| **Outcome** | Addresses assessor gap for centralized planning artefact. |
| **QA decision** | **Accept** and push. |
| **Artefacts** | `docs/planning.md` (`8416f6b`) |

---

## Chain DOC4 — Execution evidence export

### Iteration DOC4.1 — Run and export

| Field | Content |
|-------|---------|
| **Prompt** | Export logs + HTML report to `evidence/reports/` after full suite run. |
| **AI response** | Ran `npm test -- --workers=1`; copied log and `playwright-html-report_*` folder; added `RUN-MANIFEST.md` with command, exit code, failure summary. |
| **Outcome** | **10 passed / 8 failed** (exit 1) — seeded user lockout `423`, API timeout; honest evidence. |
| **QA decision** | **Accept** interim evidence; plan green re-run when SUT stable (D-10 in `docs/planning.md`). |
| **Artefacts** | `evidence/reports/full-suite_2026-08-11_1748.log`, `playwright-html-report_2026-08-11_1748/`, `RUN-MANIFEST.md` (`0e0224f`) |

### Iteration DOC4.2 — Gap analysis & maturity review

| Field | Content |
|-------|---------|
| **Prompt** | Perform gap analysis against assessment requirements; evaluate AI-assisted QA maturity. |
| **AI response** | Tables: Complete/Partial/Missing per deliverable; 14-area maturity scorecard. |
| **Outcome** | Identified remaining gaps: prompt templates (now backfilled), green run, Cursor rules. |
| **QA decision** | **Refine** — capture prompt iteration chains in `ai-prompts/` (this update). |
| **Artefacts** | Chat outcomes → `ai-prompts/README.md`, updated prompt logs |

---

## Submission checklist

- [x] `README.md` — setup and how to run
- [x] `project-info.md` — Part A complete (submission date optional)
- [x] `FunctionalTestCase.csv` — manual suite
- [ ] UI + API automation green (open — see evidence manifest)
- [x] `evidence/` — run logs / HTML report exported
- [x] `ai-prompts/` — prompt history with iteration chains
- [ ] `.cursor/rules/` — Cursor artifacts _(not added)_
- [x] Public repo URL shared
- [x] `docs/planning.md` — scope, risks, ACs, traceability
