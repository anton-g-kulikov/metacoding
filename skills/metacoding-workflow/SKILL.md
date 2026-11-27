---
name: metacoding-workflow
description: Run one task through the full metacoding workflow, from repo grounding and shaping the task with the user through mandatory TDD one ticket at a time, verification, review, and doc updates to a clean handoff. Use only when the request asks for the metacoding workflow, or for strict, gated execution of a task.
---

# Metacoding Workflow

This skill takes one task from request to handoff. It owns the order of the steps and the rules that hold between them. Companion skills own the method of single steps, or of one part of a step, and each also works on its own:

| Skill | What it does |
| --- | --- |
| `metacoding-shape` | Settles open decisions with the user and ends in a confirmed scope summary |
| `metacoding-tdd` | Builds the change test-first, one behavior at a time |
| `metacoding-debug` | Finds the cause of a bug from a command that reproduces it |
| `metacoding-review` | Checks the finished change against the scope and the repo's standards |
| `metacoding-design` | Decides the shape of code: module depth, interfaces, and seams |

One more skill, `metacoding-onboard`, is run once per repo instead of once per task. It records where the repo keeps its tracker, specs, glossary, and decision records in the project map, `.metacoding/project.md`.

Load a companion skill by name with your agent's skill mechanism. If your agent cannot load skills by name, read `../<skill-name>/SKILL.md`, which is installed next to this skill's folder.

## Start Here

1. Read `references/project-context.md` first.
2. Read `references/workflow-rules.md` for the operating contract.
3. Read `references/repository-organization.md` before planning or editing.
4. Read `references/platform-adaptation.md` if the repo lacks task docs, test docs, or git context.

## Steps

The steps, in order. What each one requires is in the Operating Sequence of `references/workflow-rules.md`.

1. Ground in the repo.
2. Shape, with `metacoding-shape`.
3. Build test-first, with `metacoding-tdd` or `metacoding-debug`.
4. Verify.
5. Review, with `metacoding-review`.
6. Update artifacts.
7. Close.

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
