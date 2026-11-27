# Spec: Prompt upkeep

- Status: in progress

## Goal

Remove three kinds of dead weight from the skill text: the steps described twice, five language references that say nothing specific, and a workflow description that matches any coding request.

## Success criteria

- The five language references are gone from the package, from "Start Here", and from `project-context.md`. `metacoding update` removes them from an existing install after backing them up.
- `workflow-rules.md` is the only place that says what each step requires. "Steps" in the workflow `SKILL.md` is an index: seven step names, the companion skill each one uses, and a pointer.
- The workflow skill's description applies only when the user asks for the metacoding workflow or for a task to be run with its gates.
- `npx jest`, `npm run lint` and `npm run build` pass after every ticket.

## In scope

- `skills/metacoding-workflow`: `SKILL.md`, the five language files, `assets/templates/project-context.md`.
- `src/services/skill-manager.ts`, and the tracked `lib/` files rebuilt from it.
- Tests: `skill-content`, `skill-manager`, `update-command`.
- README, CHANGELOG (under Unreleased), `_meta/system-documentation.md`.
- This task's records: this spec, and the backlog with the prompt upkeep item removed.

## Out of scope

- `workflow-rules.md`: not edited.
- The Codex default prompt and "Rules Between Steps", which also repeat parts of the steps.
- The companion skills' descriptions, and any user-invoked-only flag.
- Refreshing the installed skills in the main checkout's `.claude/skills`; that waits until this branch is merged.
- Pushing, a pull request, a release.

## Solution

- **Language references.** Delete the five files and step 5 of "Start Here". Remove the "Recommended References" section from the project-context template and `getRecommendedReferences` from the skill manager. Add the five files to the skill manager's retired-files list, which `update` already uses to remove `test-plan.md`. Project type stays: it still sets the default test framework and build tool.
- **Steps.** Replace the seven paragraphs under "Steps" in `SKILL.md` with an index:

  ```text
  The steps, in order. What each one requires is in the Operating Sequence of `references/workflow-rules.md`.

  1. Ground in the repo.
  2. Shape, with `metacoding-shape`.
  3. Build test-first, with `metacoding-tdd`, or with `metacoding-debug` when the task is a bug whose cause is unknown.
  4. Verify.
  5. Review, with `metacoding-review`.
  6. Update artifacts.
  7. Close.
  ```

  The two sentences after the list, on tickets and resuming, stay as they are. Nothing in the removed paragraphs is missing from `workflow-rules.md` or from the companion skill that owns it.
- **Description.** Reword the workflow skill's description to:

  ```text
  Run one task through the full metacoding workflow: repo grounding, a scope interview, test-first building one ticket at a time, verification, review, doc updates, and a clean handoff. Use only when the user asks for the metacoding workflow, or asks for a task to be run with these gates.
  ```

  The wording may shift slightly in review; the meaning does not.

## Decisions made

- `workflow-rules.md` owns the steps; `SKILL.md` keeps an index. No text moves between the two files, so branches that edit steps 1 and 2 in `workflow-rules.md` are not disturbed.
- The Codex default prompt and "Rules Between Steps" stay as they are.
- The language references are dropped, not merged or filled. Most of their bullets restate the workflow rules, and the repo's own conventions found while grounding outrank generic advice.
- "Recommended References" and the code behind it are removed: without the language files the section would be a third copy of a list that "Start Here" and "Required References" already hold.
- No skill is user-invoked only; the workflow description is narrowed instead. The facts behind this, from the vendors' documentation on 2026-11-27:
  - Claude Code: `disable-model-invocation: true` in the `SKILL.md` frontmatter. The description leaves the model's context, the user types `/name`, and a call by the model is blocked. A companion marked this way could not be loaded by the workflow skill, and a brief written by another session that says to invoke the workflow skill may be blocked too.
  - Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. The skill is left out of the model's list; `$name` still works. `SKILL.md` has no field for it.
  - Antigravity: `disable-model-invocation` is documented for plugin skills and not confirmed for workspace skills in `.agents/skills/`.
  - The installer would not need vendor-specific code for either flag: Claude Code ignores frontmatter fields it does not know, and `agents/openai.yaml` is installed for Codex only.

None is marked `[record]`: each is easy to reverse.

## Terms

None.

## Assumptions

- Commits follow the workflow: this spec and the backlog update on their own first, then one commit per ticket, with a pause for the user's go between tickets.
- The branch is rebased onto `main` before any pull request. Tickets 1 and 2 edit `SKILL.md`, which other branches also edit.

## Test intent

Each ticket starts with a failing test. Assertions that pin sentences being removed are deleted with the text; the same sentences stay pinned in `workflow-rules.md`.

## Tickets

- [x] **1. Drop the language references**
  - Success criteria: the first success criterion above.
  - Test intent: no vendor install ships a language file or mentions one; `project-context.md` has no "Recommended References" section; `update` removes the five files from an existing install and backs them up.
- [ ] **2. One home for the steps**
  - Success criteria: the second success criterion above.
  - Test intent: "Steps" holds the seven names, the three companion skills and the pointer, and none of the removed sentences; the tickets and resuming sentences are still there.
- [ ] **3. Narrow the workflow description**
  - Success criteria: the third success criterion above.
  - Test intent: the description states the two triggers and no longer lists feature work, bug fixes, refactors or reviews; the frontmatter still has a name and a description for every vendor.
