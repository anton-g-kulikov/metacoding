---
name: metacoding-workflow
description: Enforce the metacoding workflow for modern coding agents. Use this skill for feature work, bug fixes, refactors, or reviews that require strict workflow execution, mandatory TDD, MECE documentation structure, single-task focus, verification, and a clean VCS handoff or completion confirmation.
---

# Metacoding Workflow

Use this skill when the user wants disciplined execution rather than ad hoc coding.

## Start Here

1. Read `references/project-context.md` first.
2. Read `references/workflow-rules.md` for the operating contract.
3. Read `references/repository-organization.md` before planning or editing.
4. Read `references/platform-adaptation.md` if the repo lacks task docs, test docs, or git context.
5. Load only the language reference that matches the task:
   - `references/typescript.md`
   - `references/javascript.md`
   - `references/node.md`
   - `references/react.md`
   - `references/python.md`

## Core Rules

1. Ground in the repo before asking clarifying questions.
2. Capture scope, success criteria, and constraints before changing code.
3. Enforce mandatory TDD: document test intent, write or identify failing tests first, then implement production code.
4. Work one bounded task at a time.
5. Verify changes with tests and direct checks.
6. Maintain MECE documentation: update the correct artifact without duplicating the same concept across multiple docs.
7. Close with a commit-ready handoff, an actual VCS action, or an explicit completion confirmation.

## Enforcement

- Do not skip directly to coding when repo inspection can reduce uncertainty.
- Do not bypass TDD unless the user explicitly accepts the exception and the reason is recorded.
- Do not switch to unrelated work mid-task. Queue it for later.
- If a new blocker is required to finish the active task, treat it as a subtask.
- If git actions are unavailable or out of scope, stop at a clean handoff instead of forcing a commit.
- If repo artifacts are missing, bootstrap them from `assets/templates/` before implementation or explicitly propose them.
- Keep repository organization and documentation structure aligned with `references/repository-organization.md`.

## Bundled Templates

Use these templates when the repo does not already provide an equivalent artifact:

- `assets/templates/task-entry.md`
- `assets/templates/test-plan.md`
- `assets/templates/repeated-task-checklist.md`
- `assets/templates/changelog-entry.md`

Keep the workflow strict, but adapt the exact artifact shape to the repository you are working in.
