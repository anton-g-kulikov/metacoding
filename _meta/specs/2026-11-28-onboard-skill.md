# Spec: Onboard skill

- Status: in progress

## Goal

A coding agent records once where a repo keeps its tracker, specs, glossary and decision records, so later sessions read that instead of working it out again.

## Success criteria

1. `metacoding init` and `metacoding update` install `metacoding-onboard` for all three agents, and `update --dry-run` fails when its `SKILL.md` is missing.
2. Run in a repo, the skill looks for the four places, asks one round of numbered questions with a recommended place for each, and writes `.metacoding/project.md` only after the user confirms.
3. In an empty folder it recommends the `/_meta` defaults, with the checklist in each spec as the tracker.
4. Run again, it shows the current project map, asks what changed, and rewrites it after the user confirms.
5. It creates none of the places it records.
6. With the user's yes, it adds a one-line pointer to the project map in the instruction file the agent loads at the start of every session, when the repo has one. When the repo has none, it says so and creates none.
7. The workflow reads the project map while grounding. Where a line names a place, the workflow and `metacoding-shape` use it. For a missing line or a missing file, the rules that held before this task apply.
8. In a repo with no project map, the workflow says in one line that `metacoding-onboard` can record the places, then carries on with the task.
9. The skill closes with a getting-started note for the user: what was recorded, how to start a task, and what each other installed metacoding skill is for.
10. `metacoding init` prints one line that says to run the skill first.
11. This repo has its own project map, committed.

## In scope

- New: `skills/metacoding-onboard/` (`SKILL.md` and `agents/openai.yaml`).
- Skill text: `skills/metacoding-workflow/SKILL.md`, its `references/workflow-rules.md`, `references/repository-organization.md` and `references/platform-adaptation.md`, and the lines of `skills/metacoding-shape/SKILL.md` that name the default places.
- Installer: the skill list in `src/services/skill-manager.ts`, the "Next steps" text in `src/commands/init.ts`, and the rebuilt tracked files under `lib/`.
- Tests: the content tests, and the unit tests for the skill manager, `update` and `init`.
- Docs: README, CHANGELOG, `_meta/api-design.md`, `_meta/system-documentation.md`.
- This task's records: this spec, one decision record, two glossary terms, the backlog with this item removed, and this repo's `.metacoding/project.md`.
- Added on 2026-11-28, found in the review of ticket 1 and kept because the success criteria need them to hold in use:
  - The skill takes the default places and the question format from `metacoding-shape` instead of stating them again, so each keeps one home.
  - The skill says the project map is committed when the user has commits made, and otherwise tells them it is waiting.
  - The pointer question is part of step 2, the instruction file is part of what step 1 looks for, and a re-run offers the pointer when the instruction file lacks it.
  - README gets an Onboarding section next to the sections of the other skills.
- Added on 2026-11-28, found in the review of ticket 2 and kept because criterion 7 needs them to hold in use:
  - The tracker line says where the repo tracks work, and a line that says none means it tracks work nowhere. The layout reference and `metacoding-shape` both say so, so that a task with no spec and a queued request have one answer.
- Added on 2026-11-28, found in the review of ticket 3:
  - The skill closes every run with how to work from here, not only the first. The project map is committed while the installed skills are not, so a teammate on a fresh clone runs the skill in a repo that already has a project map, and would otherwise be told nothing.
  - The line in `init`'s next steps comes after the step that shows where the skills are installed, and says "first, before any task".
  - The glossary entry for Onboarding names getting started as the word for introducing a person, and calls onboarding the main job of the skill.

## Out of scope

- A walk-through skill for the user.
- Other facts in the project map, such as the test, lint and build commands.
- Moving the `init` answers out of `references/project-context.md`. That belongs to the distribution task.
- Creating an instruction file for the pointer in a repo that has none.
- The CLI reading or validating the project map.
- Pushing, a pull request, or a release.

## Solution

- The project map is one file, `.metacoding/project.md`, with four labelled lines:

  ```text
  # Project map

  Where this repo keeps its records. Written by the `metacoding-onboard` skill; run it again to change a line.

  - Tracker: <GitHub issues, a file path, or none: the checklist in each spec>
  - Specs: <folder>
  - Glossary: <file>
  - Decision records: <file or folder>
  ```

- The onboard skill owns the file's path and format. The other skills only say to read it.
- The skill looks first (an existing glossary, a decisions folder, a specs folder, the git remote, a task file), then asks one round in the question format `metacoding-shape` uses, then writes.
- The pointer is one line that gives the path only, so the four places are stored in the project map alone. The skill text names the instruction file by what it is ("the instruction file your agent loads at the start of every session"), with `CLAUDE.md` and `AGENTS.md` as examples.
- `references/repository-organization.md` and `references/platform-adaptation.md` keep their rules as the fallback, after the project map.
- `metacoding-shape` reads the project map itself, so it also works when run alone.
- The getting-started note takes each skill's purpose from that skill's own description, so the onboard skill keeps no second list of skills.

## Decisions made

- The project map is a committed file of its own at `.metacoding/project.md`, read by path. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- Onboarding is a separate skill, not part of grounding, and it is for the agent, not the user.
- One skill covers an existing repo and an empty folder.
- It records the four places only, and creates none of them.
- A repo with no project map keeps working by the rules that held before.
- The pointer is offered as a question in the onboarding round, added only to an instruction file the repo already has.
- Getting started is the close of the skill; `init` prints one line.
- Skill names read like verbs: `metacoding-onboard`, not `metacoding-onboarding`.
- The work is cut into four tickets, so that the skill can be installed and checked before any other skill depends on its file.

## Terms

Onboarding and project map, as defined in [glossary.md](../glossary.md).

## Assumptions

- The branch is `feat/onboard-skill`, created from `main`.
- The records are committed on their own first, then one commit per ticket, with a pause for the user's go between tickets.
- Other branches that add a skill will conflict with this one in the lists of skills. That is resolved when they merge.
- Before ticket 4, this repo's own `.claude/skills` install is refreshed with `metacoding update`. Git ignores it.
- Ticket 4 includes the real onboarding round with the user, for this repo.

## Test intent

One content test per rule in the skill text, written first and seen failing, with heading guards. Unit tests for the packaging and for the `init` line. The tickets list them.

## Tickets

- [x] **1. The onboard skill writes the project map**
  - Success criteria: criteria 1 to 6, and criterion 8.
  - Test intent: the skill is in the skill list and in every agent's install; `update --dry-run` fails without its `SKILL.md`; the skill text states the path, the four lines, look then ask then write on confirmation, the empty-folder defaults, the re-run, that it creates nothing, and the pointer with its two limits; the workflow rules give the one-line pointer to the skill when a repo has no project map.
- [x] **2. The skills use the places the project map names**
  - Success criteria: criterion 7.
  - Test intent: grounding reads the project map; the layout and adaptation references put it before their own rules; shape writes terms, decisions and the spec where it says, and falls back when a line or the file is missing.
- [x] **3. Getting started**
  - Success criteria: criteria 9 and 10.
  - Test intent: the skill's close names what it tells the user and takes each skill's purpose from its description; `init` prints the line.
- [ ] **4. Onboard this repo**
  - Success criteria: criterion 11.
  - Test intent: no new test. Checked by running the installed skill here and reading the committed file against the repo.
