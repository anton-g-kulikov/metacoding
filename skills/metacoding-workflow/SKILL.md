---
name: metacoding-workflow
description: Run a task through the full metacoding workflow, from repo grounding and a scope interview through mandatory TDD, verification, review, and MECE doc updates to a clean handoff. Use this skill for feature work, bug fixes, refactors, or reviews where the user wants strict, gated execution with single-task focus rather than ad hoc coding.
---

# Metacoding Workflow

This skill takes one task from request to handoff. It owns the order of the steps and the rules that hold between them. Four companion skills own the method of single steps, and each also works on its own:

| Skill | What it does |
| --- | --- |
| `metacoding-shape` | Settles open decisions with the user and ends in a confirmed scope summary |
| `metacoding-tdd` | Builds the change test-first, one behavior at a time |
| `metacoding-debug` | Finds the cause of a bug from a command that reproduces it |
| `metacoding-review` | Checks the finished change against the scope and the repo's standards |

Load a companion skill by name with your agent's skill mechanism. If your agent cannot load skills by name, read `../<skill-name>/SKILL.md`, which is installed next to this skill's folder.

## Start Here

1. Read `references/project-context.md` first.
2. Read `references/workflow-rules.md` for the operating contract.
3. Read `references/repository-organization.md` before planning or editing.
4. Read `references/platform-adaptation.md` if the repo lacks task docs, test docs, or git context.

## Steps

1. **Ground in the repo.** Read the code, config, tests, and docs the task touches, including the glossary and decision records when the repo has them, and any spec still in progress. Look up facts yourself, so the user is asked only for decisions.
2. **Shape.** Use `metacoding-shape`. Changing files starts only after the user confirms its scope summary; the skill then writes the settled terms, the marked decision records, and a spec when the task needs one.
3. **Build test-first.** Use `metacoding-tdd`: mandatory TDD, a failing test before each piece of production code. When the task is a bug whose cause is unknown, use `metacoding-debug` for this step; it ends in a regression test and a fix.
4. **Verify.** Run the smallest relevant checks first, then broader checks when justified. Confirm the behavior a user would observe, beyond a clean compile.
5. **Review.** Use `metacoding-review` on the diff, and act on what it finds.
6. **Update artifacts.** Update the one document that owns each concept that changed, and amend any decision record the build proved wrong, following `references/repository-organization.md`.
7. **Close.** Finish with a commit, a commit-ready handoff, or an explicit completion confirmation, as `references/workflow-rules.md` describes.

Steps 3 to 7 run once per ticket, with a pause for the user's go between tickets, as the Tickets section of `references/workflow-rules.md` describes. When the request continues a task that an earlier session left unfinished, the task resumes from its spec at the first ticket not yet done, as the same section describes.

## Rules Between Steps

- Work one bounded task at a time. An unrelated request is queued, or the task is paused, as the user decides and as Scope Control in `references/workflow-rules.md` describes; take on a related blocker only as a subtask the active task needs.
- Skip TDD only when the user accepts the exception, and record the reason.
- If git actions are unavailable or out of scope, stop at a clean handoff.
- Work with the artifacts the repo has. `references/platform-adaptation.md` says what to do when one is missing.

## Bundled Templates

- `assets/templates/task-entry.md`: the shape of a task record, for a repo that already tracks work in files or a user who asks for one
- `assets/templates/repeated-task-checklist.md`: for a recurring multi-step procedure the repo has no checklist for
- `assets/templates/changelog-entry.md`: for a repo that keeps a changelog

Keep the workflow strict, but adapt the exact artifact shape to the repository you are working in.
