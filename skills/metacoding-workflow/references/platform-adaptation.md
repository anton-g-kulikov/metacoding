# Platform Adaptation

These fallbacks come after the project map, `.metacoding/project.md`: where it names a tracker, a glossary, or a place for specs or decision records, that answer stands, as `references/repository-organization.md` describes.

## Missing Task Tracking

If the repo has no tracker, such as issues or a task list it keeps current:

- the tickets of a spec are a checklist in the spec, which goes to `/_meta/specs/<date>-<slug>.md` unless the repo keeps specs elsewhere
- for a task that needs no spec, the confirmed scope summary in the conversation is the record
- write a task entry in the shape of `assets/templates/task-entry.md` only when the user asks for a durable one, in the place they name

## Missing Test Documentation

If the repo does not track test intent in docs:

- the test intent in the confirmed scope summary, and in the spec when the task has one, is the record, together with the tests themselves
- leave it there; a separate test document is kept only where the repo already has one

## Missing Glossary or Decision Records

If the repo has no glossary:

- propose `/_meta/glossary.md` in the scope summary that lists the first settled term, and create it once the summary is confirmed

If the repo has no decision records:

- create `/_meta/architecture-decisions.md` with the first decision the user confirmed as `[record]`

## Missing Coding Standards

If the repo has no file that holds its standards, such as a contributor doc, a style doc, or an agent instruction file:

- propose `/_meta/coding-standards.md` with the first new rule a retro puts to the user, and create it with the first rule the user approves
- leave it uncreated until there is a rule to put in it

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
