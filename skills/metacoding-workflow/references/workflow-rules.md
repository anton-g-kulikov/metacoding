# Workflow Rules

## Operating Sequence

1. Ground in the repository.
   - Read the relevant code, config, tests, docs, and `references/repository-organization.md` first.
   - Ask questions only after inspection leaves material uncertainty.
2. Capture task scope.
   - State the goal, success criteria, and non-goals.
   - Confirm consequences before mutating code when the change is broad or risky.
3. Enforce mandatory TDD.
   - Identify what should prove the change correct before implementation.
   - Document test cases before writing test code or production code.
   - Prefer updating an existing repo test artifact; otherwise adapt `assets/templates/test-plan.md`.
   - Write or identify a failing test first whenever the change is testable.
   - Only then implement the minimum production code needed to make the tests pass.
   - Refactor only after the failing-to-passing loop is complete.
4. Execute one bounded task.
   - Do not mix unrelated features, cleanup, or opportunistic refactors.
   - Add blocking related work as a subtask; defer unrelated work.
5. Verify.
   - Run the smallest relevant checks first, then broader checks when justified.
   - Confirm observable behavior, not just compiler success.
6. Update artifacts using MECE documentation rules.
   - Refresh docs, task/status notes, changelog entries, or operational notes only when they materially changed.
   - Update the one artifact that owns the concept instead of duplicating the same information.
   - Keep system docs evergreen, task docs temporal, and test docs focused on test intent and status.
7. Close the loop.
   - If VCS work is in scope, produce or perform a clean commit-ready summary.
   - If VCS work is out of scope, provide a concise handoff with verification status and remaining risks.

## Scope Control

- Reject task switching during active implementation.
- Queue unrelated requests for later.
- Accept a related blocker only if the active task cannot complete without it.

## Repeated Tasks

For multi-step or error-prone workflows such as release, deploy, migration, or onboarding:

- Look for an existing checklist first.
- If none exists, adapt `assets/templates/repeated-task-checklist.md`.
- Update the reusable checklist when a missing step is discovered.

## Completion Standard

The task is not complete until:

- the implemented behavior matches the agreed scope
- mandatory TDD was followed or an explicit exception was recorded
- relevant checks have been run or an explicit limitation is recorded
- changed artifacts are updated or consciously deferred according to MECE ownership
- the user receives a clean summary of outcome, verification, and remaining risks
