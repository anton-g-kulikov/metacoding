# Platform Adaptation

## Missing Task Tracking

If the repo does not have a task list or status document:

- create or propose a lightweight task entry using `assets/templates/task-entry.md`
- keep it local to the repo’s conventions instead of forcing a fixed filename

## Missing Test Documentation

If the repo does not track test intent in docs:

- capture expected behavior in the implementation plan, PR notes, or a repo-appropriate test artifact
- adapt `assets/templates/test-plan.md` when a durable artifact is useful

## Missing Git Context

If git is unavailable, intentionally out of scope, or the user does not want commits:

- do not block the task
- finish with a commit-ready handoff that lists changed files, verification status, and follow-up steps

## Missing Changelog or Release Notes

If the repo does not maintain a changelog:

- do not create one gratuitously
- instead summarize user-visible impact in the final handoff unless the user asked for a durable release artifact

## Agent Portability

This skill is vendor-neutral by design.

- Use native planning, testing, or VCS tools when available.
- Do not depend on editor-specific instruction hooks.
- Preserve the workflow intent even if the host agent’s tools differ.
