# Cursor Configuration — QA AI Practical Assessment

Project-level **rules** and **skills** for Cursor Agent when working in this repository.

## Rules (`.cursor/rules/`)

| Rule | Scope | Purpose |
|------|-------|---------|
| [`qa-assessment-core.mdc`](rules/qa-assessment-core.mdc) | Always apply | Assessment scope, evidence discipline, security, doc pointers |
| [`playwright-prism.mdc`](rules/playwright-prism.mdc) | `PrismStructure/**/*` | POM layout, tags, API conventions, assertion patterns |

## Skills (`.cursor/skills/`)

| Skill | Use when |
|-------|----------|
| [`run-toolshop-tests`](skills/run-toolshop-tests/SKILL.md) | Running tests, exporting logs/HTML to `evidence/reports/` |
| [`toolshop-qa-debug`](skills/toolshop-qa-debug/SKILL.md) | Diagnosing lockout, double Confirm, invoice/API billing failures |

Skills are loaded by the agent when tasks match their descriptions (same mechanism as user-level skills under `~/.cursor/skills/`).

## Related artefacts

- Prompt iteration history: [`../ai-prompts/README.md`](../ai-prompts/README.md)
- Limitations & residual gaps: [`../docs/limitations-and-gaps.md`](../docs/limitations-and-gaps.md)
- Execution demo index: [`../evidence/EXECUTION-DEMO.md`](../evidence/EXECUTION-DEMO.md)
