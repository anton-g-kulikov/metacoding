# Workflow Rules

## Operating Sequence

1. Ground in the repository.
   - Read the relevant code, config, tests, docs, and `references/repository-organization.md` first.
   - Look up every fact you can find yourself, so the user is asked only for decisions.
2. Interview the user and capture task scope.
   - Use the `metacoding-interview` skill: ask the open decisions in numbered rounds, each with a recommended answer.
   - Close with the scope summary: goal, success criteria, in and out of scope, decisions, assumptions, test intent.
   - Wait for the user to confirm the scope summary before changing any file.
   - Record the confirmed scope in the repo's task artifact, or adapt `assets/templates/task-entry.md`.
3. Build test-first.
   - Use the `metacoding-tdd` skill: one behavior at a time, a failing test before each piece of production code.
   - Record the test intent in an existing repo test artifact; otherwise adapt `assets/templates/test-plan.md`.
   - For a bug whose cause is unknown, use the `metacoding-debug` skill for this step.
   - Keep to the confirmed scope: no unrelated features, cleanup, or opportunistic refactors.
   - Add blocking related work as a subtask; defer unrelated work.
4. Verify.
   - Run the smallest relevant checks first, then broader checks when justified.
   - Confirm observable behavior, not just compiler success.
5. Review.
   - Use the `metacoding-review` skill on the diff: one pass against the confirmed scope, one against the repo's standards.
   - Fix its findings and rerun the checks from step 4.
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
- the review's findings are fixed, accepted by the user, or listed as follow-ups
- changed artifacts are updated or consciously deferred according to MECE ownership
- the user receives a clean summary of outcome, verification, and remaining risks
