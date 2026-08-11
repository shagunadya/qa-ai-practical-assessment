# Limitations, Constraints & Residual Gaps

**Assessment:** QA AI Practical Assessment  
**SUT:** Toolshop v5.0 (public practice environment)  
**Author / date:** QA lead · 2026-08-11  
**Related:** [`planning.md`](planning.md) · [`traceability-matrix.md`](traceability-matrix.md) §8 · [`../evidence/EXECUTION-DEMO.md`](../evidence/EXECUTION-DEMO.md)

This document consolidates **known limitations** (constraints we accept) and **residual gaps** (open items at submission).

---

## 1. Environmental limitations

| ID | Limitation | Impact | Mitigation |
|----|------------|--------|------------|
| L-01 | **Shared public SUT** — no isolated QA tenant | Parallel runs contend on demo users and catalog | `--workers=1`; dynamic registration; limit invalid-login on seeded user |
| L-02 | **Account lockout (`423`)** after failed logins | Smoke/regression flake on `customer@…` specs | API `workers: 1`; dynamic users for auth tests; document in evidence |
| L-03 | **Demo cart pollution** — stale line items on seeded user | Invoice total may not match current cart | New-invoice detection via `collectInvoiceNumbers()`; conditional cart-total assert |
| L-04 | **Network / timeout** on live API | Intermittent `ETIMEDOUT` | Retry runs; serial workers |
| L-05 | **Catalog drift** — products out of stock | Add-to-cart failures | Anchors in `exploratory-notes.md`; re-verify Combination Pliers / Pliers |

---

## 2. Technical / scope limitations

| ID | Limitation | Detail |
|----|------------|--------|
| L-06 | **Chromium only** | No Firefox/WebKit projects in `playwright.config.js` |
| L-07 | **No CI pipeline** | Tests run locally; no GitHub Actions workflow |
| L-08 | **Assessment test cap** | Guideline 5–8 tests/layer; repo has **9 UI + 9 API** (foundation smoke + split API auth) |
| L-09 | **COD-only checkout** | Non-COD payment paths not covered |
| L-10 | **Partial OpenAPI surface** | Lifecycle endpoints for confirmed flows only |
| L-11 | **Live SUT vs docs drift** | OpenAPI status codes, billing geo-rules, UI double Confirm differ from written strategy — adjusted after live runs |
| L-12 | **API password policy** | Breached-password rejection; dynamic passwords in `buildRegistrationBody()` |
| L-13 | **Gitignored live reports** | `PrismStructure/reports/html/` regenerated locally; committed copies under `evidence/reports/` |

---

## 3. Automation limitations (known weak spots)

| Area | Limitation | Risk | Planned / partial fix |
|------|------------|------|------------------------|
| TC-M-02 UI | Cart total ↔ invoice total assert conditional on clean cart | R-14 partial | Stronger when new invoice matches cart total |
| TC-M-07 UI | Relies on `findInvoiceByTotal` | Shared state | Dynamic user in regression spec |
| Seeded-user UI specs | Lockout under parallel workers | R-07 | Prefer dynamic users or serial runs |
| `isCashOnDeliverySelected()` | Fallback may pass on visibility not selection | R-02 | TC-M-08 manual + regression guard |
| Full suite green | Not all 18 tests pass on every shared-env run | D-10 | Smoke **7/7** evidenced; full suite historical 10/18 |

See [`traceability-matrix.md`](traceability-matrix.md) §8 for coverage gaps.

---

## 4. AI / process limitations

| ID | Limitation | Detail |
|----|------------|--------|
| L-14 | **Cursor token budget** | Assessment expects mindful AI use; large refactors deferred |
| L-15 | **Exploration notes age** | Selectors/flows verified 2026-08-10; re-verify after major SUT releases |
| L-16 | **Prompt logs are reconstructed** | `ai-prompts/` chains summarize sessions; not verbatim chat exports |

---

## 5. Residual gaps (submission checklist)

| Gap | Status | Notes |
|-----|--------|-------|
| Cursor rules | **Closed** | `.cursor/rules/` — core + Playwright conventions |
| Cursor skills | **Closed** | `.cursor/skills/` — run tests + debug |
| Execution evidence | **Partial** | Smoke **7/7** green + HTML in `evidence/reports/`; regression/UI demo runs exported |
| Full suite green (18/18) | **Open** | Historical full run 10/18 — lockout/network; re-run when SUT stable |
| CI/CD | **Open** | Out of assessment scope |
| Cross-browser | **Open** | Out of assessment scope |
| `.cursor/rules` in assessor brief | **Met** | See [`.cursor/README.md`](../.cursor/README.md) |

---

## 6. What is explicitly not a defect

| Behaviour | Documented as |
|-----------|----------------|
| Invoice requires **two Confirm** clicks | Intentional SUT quirk — R-01, `exploratory-notes.md` |
| Double Confirm edge case TC-M-06 | Regression spec `single-confirm.regression.spec.js` |

Defect log: [`../defects/defect-report.md`](../defects/defect-report.md) — **0 defects** logged.

---

## 7. Honesty statement

Deliverables reflect **real execution** where noted in `evidence/reports/RUN-MANIFEST.md`. Failed or partial runs are retained (e.g. full-suite 2026-08-11) alongside green smoke evidence — not replaced with fabricated passes.
