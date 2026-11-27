# Workflow Rules

## Operating Sequence

1. Ground in the repository.
   - Read the relevant code, config, tests, docs, and `references/repository-organization.md` first.
   - Read the glossary and the decision records when the repo has them, and use the glossary's terms.
   - Look up every fact you can find yourself, so the user is asked only for decisions.
2. Shape the task: interview the user and capture task scope.
   - Use the `metacoding-shape` skill: ask the open decisions in numbered rounds, each with a recommended answer.
   - Close with the scope summary: goal, success criteria, in and out of scope, solution, decisions, terms, assumptions, test intent, and the tickets the solution is sliced into.
   - Wait for the user to confirm the scope summary before changing any file.
   - Once the summary is confirmed, the skill writes the settled terms to the glossary and the decisions marked `[record]` to the decision records, and a spec when the task needs one.
   - For a task that needs none, record the confirmed scope where the repo already tracks work: an issue, a pull request, or an existing task file, in the shape of `assets/templates/task-entry.md`. Where it tracks work nowhere, the confirmed summary in the conversation is the record.
3. Build test-first.
   - Use the `metacoding-tdd` skill: one behavior at a time, a failing test before each piece of production code.
   - Take the test intent from the ticket being built, or from the scope summary when the task is one ticket.
   - For a bug whose cause is unknown, use the `metacoding-debug` skill for this step.
   - Keep to the confirmed scope: no unrelated features, cleanup, or opportunistic refactors.
   - Add blocking related work as a subtask; defer unrelated work.
4. Verify.
   - Run the smallest relevant checks first, then broader checks when justified.
   - Confirm observable behavior, not just compiler success.
5. Review.
   - Use the `metacoding-review` skill on the diff: one pass against the agreed scope, one against the repo's standards. For a task with more than one ticket, the agreed scope is the ticket, as the skill describes.
   - Fix its findings and rerun the checks from step 4.
6. Update artifacts using MECE documentation rules.
   - Refresh docs, task/status notes, changelog entries, or operational notes only when they materially changed.
   - Update the one artifact that owns the concept instead of duplicating the same information.
   - Amend a decision record the build proved wrong, as the `metacoding-shape` skill describes.
   - Handle specs, tickets, and test records as `references/repository-organization.md` describes.
   - Keep system docs evergreen and free of task status.
7. Close the loop.
   - If VCS work is in scope, produce or perform a clean commit-ready summary.
   - If VCS work is out of scope, provide a concise handoff with verification status and remaining risks.

## Tickets

A task with more than one ticket repeats steps 3 to 7 for each ticket, in the order of the scope summary.

- Build, verify, and review one ticket before starting the next.
- In step 5 of the last ticket, the `metacoding-review` skill also checks the whole change against the spec.
- In step 6, mark the ticket done where the tickets are tracked, so that a tick in the spec's checklist is part of the ticket's commit. With the last ticket, mark the spec done, as the `metacoding-shape` skill describes.
- Close each ticket on its own in step 7: commit it or hand it off, and report what was done.
- After every ticket but the last, wait for the user's go before starting the next one.

A one-ticket task runs the sequence once, against the scope summary. When it has a spec, step 6 marks its ticket and the spec done in the same way.

## Scope Control

- Reject task switching during active implementation.
- Queue unrelated requests for later.
- Accept a related blocker only if the active task cannot complete without it.

## Repeated Tasks

For multi-step or error-prone workflows such as release, deploy, migration, or onboarding:

- Look for an existing checklist first.
- If none exists, adapt `assets/templates/repeated-task-checklist.md`.
- Update the reusable checklist when a missing step is discovered.

## Completion Standard

The task is not complete until:

- the implemented behavior matches the agreed scope
- mandatory TDD was followed or an explicit exception was recorded
- relevant checks have been run or an explicit limitation is recorded
- the review's findings are fixed, accepted by the user, or listed as follow-ups
- changed artifacts are updated or consciously deferred according to MECE ownership
- every ticket is closed and, when the task has a spec, the spec is marked done
- the user receives a clean summary of outcome, verification, and remaining risks
