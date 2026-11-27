# Workflow Rules

## Operating Sequence

1. Ground in the repository.
   - Read the relevant code, config, tests, docs, and `references/repository-organization.md` first.
   - Read the project map, `.metacoding/project.md`, when the repo has one, and use the places it names, as `references/repository-organization.md` describes.
   - When the repo has no project map, tell the user in one line that the `metacoding-onboard` skill can record where the repo keeps its tracker, specs, glossary, and decision records, then carry on with the task.
   - Read the glossary and the decision records when the repo has them, and use the glossary's terms.
   - Look for a spec whose status is in progress, where `references/repository-organization.md` says specs go. When the request continues that task, resume it as the Tickets section describes.
   - Look up every fact you can find yourself, so the user is asked only for decisions.
2. Shape the task: interview the user and capture task scope.
   - Use the `metacoding-shape` skill: ask the open decisions in numbered rounds, each with a recommended answer.
   - Then use the `metacoding-spec` skill: describe the solution and slice it into tickets.
   - When the solution adds a module or changes an interface, design that part with the `metacoding-design` skill before the scope summary is sent.
   - Close with the scope summary: goal, success criteria, in and out of scope, solution, decisions, terms, assumptions, test intent, and the tickets the solution is sliced into.
   - Wait for the user to confirm the scope summary before changing any file.
   - Once the summary is confirmed, the `metacoding-spec` skill writes the settled terms to the glossary and the decisions marked `[record]` to the decision records, and a spec when the task needs one.
   - For a task that needs none, record the confirmed scope where the repo already tracks work: an issue, a pull request, or an existing task file, in the shape of `assets/templates/task-entry.md`. Where it tracks work nowhere, the confirmed summary in the conversation is the record.
   - When VCS work is in scope, commit those records on their own before the build starts, so that a ticket's commit holds only that ticket's work. A confirmed change to a spec in progress is committed the same way.
3. Build test-first.
   - Use the `metacoding-tdd` skill: one behavior at a time, a failing test before each piece of production code.
   - Take the test intent from the ticket being built, or from the scope summary when the task is one ticket.
   - Use the `metacoding-design` skill when the interface to test through is unclear or does not exist yet, and when restructuring once the behaviors are green.
   - For a bug whose cause is unknown, use the `metacoding-debug` skill for this step.
   - Keep to the confirmed scope: no unrelated features, cleanup, or opportunistic refactors.
   - Add blocking related work as a subtask; defer unrelated work.
4. Verify.
   - Run the smallest relevant checks first, then broader checks when justified.
   - Confirm observable behavior, not just compiler success.
5. Review.
   - Use the `metacoding-review` skill on the diff: one pass against the agreed scope, one against the repo's standards. For a task with more than one ticket, the agreed scope is the ticket, as the skill describes.
   - Act on its findings as the skill describes: it says which are fixed and which go to the user. Then rerun the checks from step 4.
6. Update artifacts using MECE documentation rules.
   - Refresh docs, task/status notes, changelog entries, or operational notes only when they materially changed.
   - Update the one artifact that owns the concept instead of duplicating the same information, as `references/repository-organization.md` describes.
   - Amend a decision record the build proved wrong, as the `metacoding-spec` skill describes.
   - Handle specs, tickets, and test records as `references/repository-organization.md` describes.
   - Keep system docs evergreen and free of task status.
7. Close the loop.
   - If VCS work is in scope, produce or perform a clean commit-ready summary.
   - If VCS work is out of scope, provide a concise handoff with verification status and remaining risks.
   - Either way, state explicitly that the work is complete.

## Tickets

A task with more than one ticket repeats steps 3 to 7 for each ticket, in the order of the scope summary.

- Build, verify, and review one ticket before starting the next.
- In step 5 of the last ticket, the `metacoding-review` skill also checks the whole change against the spec.
- In step 6, mark the ticket done where the tickets are tracked, so that a tick in the spec's checklist is part of the ticket's commit. With the last ticket, mark the spec done, as the `metacoding-spec` skill describes.
- Close each ticket on its own in step 7: commit it or hand it off, and report what was done.
- After every ticket but the last, wait for the user's go before starting the next one.
- After the last ticket is closed, use the `metacoding-retro` skill once for the task. It proposes lasting changes for the task's mistakes, and the user decides which are made. Those changes come after the last ticket and are not part of the task's spec, which stays done.

A one-ticket task runs the sequence once, against the scope summary. When it has a spec, step 6 marks its ticket and the spec done in the same way. Its retro follows the close of that one ticket.

### Resuming a task

A session can end before a task's last ticket is done. When grounding finds a spec in progress and the request continues its task, resume the task from the spec:

- The spec is the agreed scope. Skip step 2.
- Start at the first ticket that is not marked done where the tickets are tracked, and follow the rules above from there, including the wait before each next ticket.
- When the request changes what the spec agreed, settle the change first, as the `metacoding-spec` skill describes for a spec in progress.
- Ask the user which task to work on when more than one spec is in progress, or when you cannot tell whether the request belongs to the spec.

## Scope Control

- When the user asks for something unrelated during a task, say what is unfinished in the active ticket, then do what they decide: queue the request for later, or pause the task and switch.
- Record a queued request where the repo tracks work. Where it tracks work nowhere, name it in the report that closes the ticket.
- Pause at a ticket boundary: finish the active ticket first. In a one-ticket task, that is the whole task.
- When the user wants the switch at once, set the unfinished work aside so it stays out of the new task's changes, such as on a branch or in a stash. Note what is done and what is left where the tickets are tracked, and leave the ticket not marked done.
- A paused task with a spec continues as the Resuming a task section describes.
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
- after the last ticket is closed, the retro has run and its lessons, if any, have been put to the user
