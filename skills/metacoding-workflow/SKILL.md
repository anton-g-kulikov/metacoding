---
name: metacoding-workflow
description: Run a task through the full metacoding workflow, from repo grounding and a scope interview through mandatory TDD, verification, review, and MECE doc updates to a clean handoff. Use this skill for feature work, bug fixes, or refactors where the user wants strict, gated execution with single-task focus rather than ad hoc coding.
---

# Metacoding Workflow

This skill takes one task from request to handoff. It owns the order of the steps and the rules that hold between them. Four companion skills own the method of single steps, and each also works on its own:

| Skill | What it does |
| --- | --- |
| `metacoding-interview` | Settles open decisions with the user and ends in a confirmed scope summary |
| `metacoding-tdd` | Builds the change test-first, one behavior at a time |
| `metacoding-debug` | Finds the cause of a bug from a command that reproduces it |
| `metacoding-review` | Checks the finished change against the scope and the repo's standards |

Load a companion skill by name with your agent's skill mechanism. If your agent cannot load skills by name, read `../<skill-name>/SKILL.md`, which is installed next to this skill's folder.

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

## Steps

1. **Ground in the repo.** Read the code, config, tests, and docs the task touches. Look up facts yourself, so the user is asked only for decisions.
2. **Interview.** Use `metacoding-interview`. Changing files starts only after the user confirms its scope summary.
3. **Build test-first.** Use `metacoding-tdd`: mandatory TDD, a failing test before each piece of production code. When the task is a bug whose cause is unknown, use `metacoding-debug` for this step; it ends in a regression test and a fix.
4. **Verify.** Run the smallest relevant checks first, then broader checks when justified. Confirm the behavior a user would observe, beyond a clean compile.
5. **Review.** Use `metacoding-review` on the diff, and fix what it finds.
6. **Update artifacts.** Update the one document that owns each concept that changed, following the MECE rules in `references/repository-organization.md`.
7. **Close.** Finish with a commit, a commit-ready handoff, or an explicit completion confirmation, as `references/workflow-rules.md` describes.

Work through the steps in order and continue to the next one without waiting, except where a step waits for the user.

## Rules Between Steps

- Work one bounded task at a time. Queue unrelated requests for later; take on a related blocker only as a subtask the active task needs.
- Skip TDD only when the user accepts the exception, and record the reason.
- If git actions are unavailable or out of scope, stop at a clean handoff.
- If repo artifacts are missing, bootstrap them from `assets/templates/` before implementation or propose them.

## Bundled Templates

Use these templates when the repo does not already provide an equivalent artifact:

- `assets/templates/task-entry.md`
- `assets/templates/test-plan.md`
- `assets/templates/repeated-task-checklist.md`
- `assets/templates/changelog-entry.md`

Keep the workflow strict, but adapt the exact artifact shape to the repository you are working in.
