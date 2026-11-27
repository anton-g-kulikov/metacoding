# Platform Adaptation

## Missing Task Tracking

If the repo does not have a task list or status document:

- the confirmed scope summary in the conversation is the record of the task
- write a task entry in the shape of `assets/templates/task-entry.md` only when the user asks for a durable one, in the place they name

## Missing Test Documentation

If the repo does not track test intent in docs:

- the test intent in the confirmed scope summary is the record, together with the tests themselves
- leave it there; a separate test document is kept only where the repo already has one

## Missing Glossary or Decision Records

If the repo has no glossary:

- propose `/_meta/glossary.md` to the user when the first term is settled, and create it once they agree

If the repo has no decision records:

- create `/_meta/architecture-decisions.md` with the first decision the user confirmed as `[record]`

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
