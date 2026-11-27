# Spec: Update keeps the init answers

- Status: in progress

## Goal

`metacoding update` keeps what the user entered at `init` instead of replacing it with detected defaults, and a strict validation failure tells the user how to fix it.

## Success criteria

- After `update`, `project-context.md` still has the project name, description, tech stack and project type that the install had before.
- `update` on an install nobody edited reports no locally edited files.
- `update --template <type>` still changes the project type, and with it the default test framework, build tool and recommended references.
- When `project-context.md` is missing, or lacks one of the four lines, `update` falls back to detection for what is missing.
- A new install's default description is "A project using the metacoding skills".
- `update --dry-run --strict` on a `.gitignore` that lacks metacoding exclusions names them and says to add those lines to `.gitignore`.
- `update` still leaves a `.gitignore` without a metacoding section unchanged.

## In scope

- `src/commands/update.ts`, `src/commands/init.ts`, `src/services/skill-manager.ts`.
- Unit tests for the update command, init command and skill manager.
- README, CHANGELOG, `_meta/api-design.md`, `_meta/system-documentation.md`.
- This task's own records: this spec and one decision record.

## Out of scope

- A separate config file for the init answers.
- Keeping hand edits to other lines of `project-context.md`. Those stay local edits that `update` asks about, as before.
- Having `update` add a `.gitignore` section.
- The dormant `_meta/project-task-list.md` and `test/test-documentation.md`.
- Pushing, a pull request, or a release.

## Solution

- `update` reads the installed `project-context.md` of each vendor and takes the values of its "Project name", "Description", "Tech stack" and "Project type" lines. A value it cannot find comes from project detection, as before.
- The project type from `--template` wins over the installed one. Test framework and build tool are derived from the resulting type, as before.
- The default description changes in `init`, and in `update`'s fallback.
- The strict error keeps its list of missing patterns and adds one sentence: add these lines to `.gitignore`.

## Decisions made

- `update` reads the init answers back from the installed `project-context.md` rather than from a separate config file. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- `update` stays hands-off for a `.gitignore` without a metacoding section; the strict error explains the fix instead.
- The description default changes for new installs only.

## Terms

None.

## Assumptions

- Each vendor's install keeps its own values; `update` does not copy them between vendors.
- Commits follow the workflow: the spec and decision record on their own first, then one commit per ticket, with a pause for the user's go between tickets.
- The rebuilt files under `lib/` that the repo tracks go into each ticket's commit.

## Test intent

Every behavior in the success criteria gets a unit test, written first and seen failing. The tickets list them.

## Tickets

- [x] **1. Update keeps the init answers**
  - Success criteria: the first five success criteria above.
  - Test intent: an install with its own name, description, tech stack and type keeps all four through `update`; an unedited install produces no conflict; `--template` overrides the type and what follows from it; a missing file and a missing line each fall back to detection; a fresh install has the new default description.
- [ ] **2. The strict error says how to fix it**
  - Success criteria: the last two success criteria above.
  - Test intent: the strict error on a `.gitignore` with no metacoding section contains the missing patterns and the instruction; `update` leaves that file unchanged.
