---
name: metacoding-review
description: Review a finished change against the agreed scope and the repo's own standards before it is committed or handed off. Use when the user asks for a review of a diff, branch, or work in progress, or when the metacoding workflow reaches its review step.
---

# Review

Review the diff of the change on two separate axes, then act on what the review finds.

## What to review

1. Pin the diff. For uncommitted work, that is the working tree against `HEAD`. For a branch, it is the branch against its merge base with the main branch. When neither fits, ask the user for the starting point.
2. Find the agreed scope: the confirmed scope summary, a task entry, an issue, or a task spec. When the change is one ticket of a larger task, the agreed scope is that ticket's success criteria and test intent, read together with the task's in-scope and out-of-scope lists. When none exists, ask the user what the change was meant to do and review against the answer.
3. Find the repo's standards: contributor and style docs, agent instruction files, lint and formatter config, and the patterns in the files next to the ones that changed.

## Who reviews

The author of a change reads it with the author's assumptions. When the host agent supports subagents, give each axis to a subagent with a fresh context that receives only the diff and that axis's inputs, and run the two in parallel. The list of code smells below is one of the standards axis's inputs. When it does not, review the diff yourself, top to bottom, one axis at a time.

## The two axes

**Scope.** Compare the diff with the agreed scope.

- Missing: something the scope asked for that the diff lacks or only half does.
- Extra: behavior or cleanup in the diff that the scope did not ask for.
- Wrong: something that looks implemented and does not behave as agreed.
- Unproven: a behavior in the test intent with no test that exercises it.

**Standards.** Compare the diff with the repo's standards.

- A break with a documented rule. Cite the file and the rule.
- A departure from how neighboring code solves the same thing.
- Leftovers: debug output, commented-out code, temporary files, stale docs for behavior that changed.
- A code smell from the list below, where the repo's documented rules and neighboring code say nothing. Where they say something, they win.

Skip anything the repo's linter or formatter already enforces.

Code smells, looked for in the diff:

- Logic duplicated that an existing helper already covers.
- A function or module that does more than one job.
- A function or module that only passes calls on, where its callers could call the target directly and nothing would get harder.
- An interface or abstract type with one implementation, which nothing swaps for another, not even a test.
- A name that does not say what the thing is or does.
- An error swallowed, or silently replaced by a default.
- Dead code: an unused parameter, branch, or export.
- A magic value repeated instead of named once.
- Input taken at a boundary (user, file, network) without a check.
- A test that asserts how the code works instead of what it does.

A smell that also breaks the agreed scope is a scope finding, and is handled as one.

## After the last ticket

When the change is the last ticket of a task with several, run the scope axis once more after the ticket's own review and before the task is closed. Pin the diff from the commit before the task's first ticket, and ask the user when you cannot tell which that is. Compare the whole change with the task spec or the scope summary: its goal, its success criteria, and its in-scope and out-of-scope lists. Tickets can each pass while the task's goal is still missed.

## Report

List findings under `Scope` and `Standards`, each with the file, the line, and one sentence on what is wrong. Keep the two lists separate, so a clean result on one axis cannot hide problems on the other. Mark a finding from the smell list as a smell. Write "No findings" under an axis that has none.

## After the report

- Fix every Missing, Wrong, and Unproven finding, and every break with a documented rule. Run the tests again.
- For each Extra finding, either remove it or ask the user whether to keep it.
- Put each smell, and anything else, to the user as a follow-up. A follow-up is fixed only when the user asks.

The review is done when each finding is fixed, accepted by the user, or listed as a follow-up.
