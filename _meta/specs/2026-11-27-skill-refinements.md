# Spec: Skill refinements

- Status: done

## Goal

Close the five small gaps the comparison with Matt Pocock's skills found in the skills this branch introduces, before the branch goes to a pull request.

## Success criteria

- `metacoding-tdd` has a section on test doubles: replace only what is outside your control, prefer a real or in-memory stand-in over a mock that checks calls, never replace the code under test or this codebase's own modules, with one good and one bad example.
- `metacoding-debug` says to mask credentials and personal data before a captured request, payload or log is shown, saved or committed, and to keep raw captures out of the repo.
- `metacoding-review` has a fixed list of code smells that it applies to whatever the repo's own standards leave open, and reports them as follow-ups for the user instead of fixing them.
- Scope Control in the workflow rules says what to do when the user asks for something unrelated mid-task: say what is unfinished, then queue the request or pause the task at a ticket boundary, as the user decides.
- `templates/` and `workflow/` are gone from the repo, the docs no longer mention them as kept, and the published package's file list is unchanged.

## In scope

- `skills/metacoding-tdd/SKILL.md`, `skills/metacoding-debug/SKILL.md`, `skills/metacoding-review/SKILL.md`, `skills/metacoding-workflow/references/workflow-rules.md`.
- Content tests in `test/unit/skill-content.test.ts`.
- Deleting `templates/` and `workflow/`.
- README, CHANGELOG, `_meta/system-documentation.md`.
- This task's records: this spec, and the backlog with this group removed.
- Added on 2026-11-27, in ticket 4: the one line of `skills/metacoding-workflow/SKILL.md` that said to queue unrelated requests, so that it agrees with Scope Control.
- Added on 2026-11-27, found in the ticket reviews and kept because each success criterion needs them to hold in use:
  - tdd: check calls only when the call itself is the behavior.
  - debug: replay the raw capture from outside the repo; replace each secret with a made-up value of the same shape and rerun to confirm the masked version still fails; never print a secret in a temporary log line; a file the user supplied is not deleted.
  - review: the smell list is named as an input of the standards reviewer; a smell that breaks the agreed scope is a scope finding; the wording "fix what it finds" became "act on what it finds" in the review skill, its Codex prompt, the workflow skill and the workflow rules.
  - Scope Control: a queued request is recorded; the one-ticket case is stated; a switch at once sets the unfinished work aside and notes what is left.
- Added on 2026-11-27, in ticket 5: the `.gitignore` rule that only served `templates/`.

## Out of scope

- The other backlog items, including the rest of prompt upkeep.
- The historical mentions of the old folders in `_meta/project-task-list.md` and `_meta/agent-support-expansion.md`.
- Installer code.
- Pushing, a pull request, or a release.

## Solution

- **tdd**: a "Test doubles" section after "What a good test looks like". The existing line stays as the rule; the section adds the how and two short examples.
- **debug**: a rule in phase 1, where captures are made, and a line in the clean-up phase that raw captures are deleted.
- **review**: a short list under the standards axis, each item one line: duplicated logic an existing helper covers; a function or module doing more than one job; names that do not say what the thing does; errors swallowed or silently defaulted; dead code; repeated magic values; unchecked input at a boundary; a test that asserts how the code works instead of what it does. The repo's documented rules and neighboring code win over the list. Findings from it go under Standards, marked as smells, and to the user as follow-ups.
- **Scope Control**: "Reject task switching" is replaced by the instruction in the success criteria, pointing to the resume rule for how a paused task continues.
- **Legacy folders**: delete both, and drop the "retained as historical migration input" sentence from the system documentation.

## Decisions made

- The smell list always applies to what the repo leaves open, and its findings are follow-ups, never automatic fixes.
- The user decides whether to queue or switch; the agent does not refuse.
- The secrets rule covers personal data as well as credentials.

## Terms

None.

## Assumptions

- Commits follow the workflow: this spec and the backlog update on their own first, then one commit per ticket, with a pause for the user's go between tickets.
- After the last ticket, this repo's own `.claude/skills` install is refreshed. Git ignores it.

## Test intent

One content test per new rule, written first and seen failing. The tickets list them.

## Tickets

- [x] **1. Test doubles in metacoding-tdd**
  - Success criteria: the first success criterion above.
  - Test intent: the skill has the section; it states the three rules; it shows a good and a bad example.
- [x] **2. Secrets in metacoding-debug**
  - Success criteria: the second success criterion above.
  - Test intent: phase 1 states the masking rule and names credentials and personal data; the clean-up phase says raw captures are deleted.
- [x] **3. Code smells in metacoding-review**
  - Success criteria: the third success criterion above.
  - Test intent: the standards axis lists the smells; it says the repo's own standards win; "After the report" sends smells to the user as follow-ups.
- [x] **4. Switching tasks in Scope Control**
  - Success criteria: the fourth success criterion above.
  - Test intent: the section no longer says "Reject task switching"; it states the new instruction and points to the resume rule.
- [x] **5. Remove the legacy folders**
  - Success criteria: the fifth success criterion above.
  - Test intent: no new test. Checked by the full suite, the build, and the file list of `npm pack --dry-run` before and after.
