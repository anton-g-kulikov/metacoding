# Spec: Prompt upkeep

- Status: done

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
- Added on 2026-11-28, from the review of ticket 2, which found three things the index left open:
  - `workflow-rules.md`, step 7: one line that says to state explicitly that the work is complete. The old step 7 of `SKILL.md` offered "an explicit completion confirmation", and no other file said it.
  - `workflow-rules.md`, step 6: the line on the one owning artifact names `references/repository-organization.md`, as the old step 6 of `SKILL.md` did.
  - `SKILL.md`, step 3 of the index: it names both skills and no longer says when `metacoding-debug` applies. `workflow-rules.md` says that.
- Added on 2026-11-28, in ticket 3: a content test that the frontmatter of every skill parses as YAML and holds the skill's name and a description, for every vendor.
- Corrected on 2026-11-28, after the review of the whole change:
  - No tracked `lib/` file is built from `skill-manager.ts`, so none changed.
  - The line added to step 7 of `workflow-rules.md` applies in both cases, with and without VCS work. The old step 7 of `SKILL.md` offered the confirmation as a third way to close. Step 7 of the list in the README follows the new line.
  - Two facts did move from `SKILL.md` to `workflow-rules.md`, as the addition above describes, so "no text moves between the two files" under Decisions made holds only for the text of the Operating Sequence as it was.
  - The index names four companion skills, not the three that the test intent of ticket 2 says.

## Out of scope

- `workflow-rules.md`: not edited, apart from the two lines added on 2026-11-28 under In scope.
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

  Changed on 2026-11-28: step 3 of the index reads "Build test-first, with `metacoding-tdd` or `metacoding-debug`.", and two facts from the removed paragraphs were missing after all. See the additions under In scope.
- **Description.** Reword the workflow skill's description to:

  ```text
  Run one task through the full metacoding workflow: repo grounding, a scope interview, test-first building one ticket at a time, verification, review, doc updates, and a clean handoff. Use only when the user asks for the metacoding workflow, or asks for a task to be run with these gates.
  ```

  The wording may shift slightly in review; the meaning does not.

  Changed on 2026-11-28, in ticket 3. The description reads:

  ```text
  Run one task through the full metacoding workflow, from repo grounding and shaping the task with the user through mandatory TDD one ticket at a time, verification, review, and doc updates to a clean handoff. Use only when the request asks for the metacoding workflow, or for strict, gated execution of a task.
  ```

  What changed from the wording above, and why:

  - No colon followed by a space: that is not valid in an unquoted YAML value, and an agent that cannot parse the frontmatter loads the skill with no description.
  - "mandatory TDD" stays, because an install test pins it in the skill.
  - "shaping the task with the user" replaces "a scope interview": the glossary keeps "interview" for the method, not for the step.
  - "the request" replaces "the user", so that a brief written by another session counts.
  - "strict, gated execution of a task" replaces "a task to be run with these gates", which pointed at gates the first sentence did not name.

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
- [x] **2. One home for the steps**
  - Success criteria: the second success criterion above.
  - Test intent: "Steps" holds the seven names, the three companion skills and the pointer, and none of the removed sentences; the tickets and resuming sentences are still there.
- [x] **3. Narrow the workflow description**
  - Success criteria: the third success criterion above.
  - Test intent: the description states the two triggers and no longer lists feature work, bug fixes, refactors or reviews; the frontmatter still has a name and a description for every vendor.
