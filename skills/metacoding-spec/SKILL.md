---
name: metacoding-spec
description: Turn a task's settled decisions into a scope summary with the solution sliced into tickets, get the user's confirmation, and then write the records, which are the glossary terms, the decision records, and a task spec when the task has more than one ticket or a decision to record. It also holds the format of the feature specs, the living documents of user stories per feature area. Use when the decisions are settled and the task is to be built, when the user asks for a task spec, user stories, a scope summary, or tickets, when a finished ticket's scenarios go into a feature spec, or when the metacoding workflow reaches its shape step.
---

# Spec

Turn a task's settled decisions into an agreed scope before changing any code, test, or doc: write the behavior as stories, name their test seams, describe the solution, slice it into tickets, and get the user to confirm the scope summary. Then write the records.

## Start from settled decisions

Work from what is already settled: the decisions summary of the `metacoding-shape` skill, or what you and the user agreed earlier in the conversation. Do not ask the user again for a decision that is already settled.

When a decision that would change what gets built or how it is tested is still open, settle it first with the `metacoding-shape` skill, which puts it to the user with a recommended answer. The one decision this skill asks itself is how to cut the work into tickets, because that question only exists once the solution does.

## The project map

When the repo has a project map, `.metacoding/project.md`, read it before writing the scope summary. The `metacoding-onboard` skill writes it, and it names where this repo keeps its tracker, its specs, its glossary, and its decision records.

Where the project map names a place, use that place wherever this skill reads or writes the glossary, a decision record, a task spec, or a ticket, and create it there when it does not exist yet. The tracker line says where this repo tracks work. A line that says none is an answer too: the repo tracks work nowhere, and the checklist in the task spec is the tracker.

The default places and the rules for a repo's own place, below, apply only to a place the project map has no line for, and to a repo with no project map.

## Stories

Describe a task that adds or changes behavior a role can observe as stories, whatever its size. A role is a kind of user. Use the role's name from the glossary, or from the terms settled for this task.

Group the stories by role, and within a role by feature area: a part of the product a user would name, such as a command or a screen. Write each story as one sentence, followed by its scenarios:

```text
<Role>

<Feature area>: <story title>
As a <role>, I want <what>, so that <why>.

Scenario: <ID> <title>
  Given <the starting state>
  When <what the role does>
  Then <what the role can observe>
```

- A scenario is one case of the story: the happy path, an error, an edge. Its "Then" names something the role can observe, so that a test can check it. When a scenario needs more than one Given, When, or Then, start each further line with "And".
- Give each scenario an ID: the prefix of its feature area, a hyphen, and a number, such as `UPDATE-4`. The prefix is a short name for the area in capitals. Use the one the area's feature spec states, or the one a task spec still in progress uses for the area, and choose one for an area that has none yet.
- A new scenario takes the number one above the highest that the area's feature spec or any task spec holds for that prefix, whether the task spec is in progress or done.
- List the scenarios the task adds, changes, or removes, and leave the area's other scenarios out. A scenario the task changes keeps its ID: write "(changed)" after its title. For a scenario the task removes, give its ID and title with "(removed)" after the title. For a bug fix that restores what an existing scenario already says, list that scenario as it stands, with "(restored)" after its title.
- The scenarios stand in place of success criteria and test intent: they are what the task must deliver and what its tests must prove.

A task that changes no behavior a role can observe, such as a refactor, tooling, or docs, has no stories. Give it success criteria and test intent instead.

## Test seams

A test seam is the public interface a story's scenarios are tested through: a function, a CLI command, an HTTP route, a rendered component. Name one for each story, so that the user agrees to it before any test exists.

Choose the seam in this order:

1. Take an interface that already exists before proposing a new one.
2. Among those, take the highest one that works for the story: the one closest to what the role does. A story about a command is tested through the command, not through a function the command calls.
3. Between two that are equally high, take the one the repo's tests already use.

Give stories that can share a seam the same one. When a story needs a seam that does not exist yet, say so, and describe it in the solution.

A task without stories has no story to name a seam for. Name one for each behavior in its test intent, choosing it by the same three steps.

## Solution and tickets

Describe the solution: the approach, and each public interface or data shape that changes. Say what a builder needs to start. Keep code and paths to files out of it, as the Paths and code section describes.

Then slice the solution into tickets. A ticket is one piece that can be built, verified, reviewed, and committed on its own.

- Make each ticket a vertical slice: it goes through every layer it needs and ends in something a user or caller can observe. A piece that only adds one layer, such as a database schema with nothing that reads it, belongs in the ticket that uses it.
- Give each ticket the scenarios it delivers. A scenario the task changes or removes belongs to the ticket that changes or removes it. A ticket that delivers no scenario, such as one stage of a wide refactor, gets success criteria and test intent of its own.
- A small task is one ticket. Add a ticket only when the piece can be finished and checked by itself.
- Split a ticket that would deliver more than five scenarios, unless a piece could not be finished and checked by itself.
- Say what blocks each ticket: the tickets that must be done before it can start, or none. Do not name a ticket only because it comes earlier.
- Order the tickets so that each comes after the tickets that block it.

A wide refactor is the exception to vertical slices. It is one mechanical change, such as renaming a shared symbol, that breaks many callers at once. No part of it can be committed alone with the repo's tests and build still passing. Slice it in three stages:

1. In one ticket, add the new form beside the old one, so that nothing breaks.
2. Move the callers over in batches, one ticket for each batch, each blocked by the ticket of stage 1. Size a batch by where the callers live, such as one package or one folder, so that it can be reviewed in one sitting. The tests and the build keep passing because the old form is still there.
3. Remove the old form in a ticket of its own, blocked by every batch.

When there is more than one reasonable way to cut the work, put the cut to the user as a decision, with your recommended cut.

## The scope summary

The scope is agreed when both are true:

- You can name no further decision that would change what gets built, how it is sliced into tickets, or how it is tested.
- You have sent the scope summary below and the user has confirmed it.

```text
Scope summary
Goal:
In scope:
Out of scope:
Solution:
Stories:
Test seams:
Decisions made:
Terms:
Assumptions:
Tickets:
```

Under "Stories", give the stories as the Stories section describes. A task without stories has "Success criteria:" and "Test intent:" where "Stories:" is.

Under "Test seams", name the seam for each story, as the Test seams section describes.

Under "Tickets", number the tickets in build order and give each a title, the IDs of the scenarios it delivers, and the tickets that block it, or "none". A ticket that delivers no scenario, as every ticket of a task without stories, gives its success criteria and its test intent where the scenario IDs are. For a one-ticket task, give the title alone: the fields above already describe it.

Under "Decisions made", put `[record]` in front of each decision that is hard to reverse, surprising without context, and a real trade-off between workable alternatives. Confirming the summary also approves writing those as decision records.

Under "Terms", list each term that was settled, with its meaning and the words to avoid. When the repo has no glossary yet, propose creating one there, by default at `/_meta/glossary.md`: confirming the summary approves it.

Changing files starts after that confirmation. The confirmed summary is the agreed scope for everything that follows: the tickets are built one at a time, each ticket's scenarios, or its test intent, seed its test-first work, and reviews check each ticket and then the whole change against the summary.

When the user told you to proceed without questions, send the scope summary with every unasked decision listed under Assumptions, then continue. That instruction stands in for the confirmation.

## Records written on confirmation

Once the scope summary is confirmed, write these records before any other file changes:

- **Terms.** Add each term listed under Terms to the glossary, or correct its entry: the term, its meaning in this project, and the words to avoid for it. The default place is `/_meta/glossary.md`; use the repo's own glossary if it keeps one elsewhere.
- **Decisions.** Write each decision marked `[record]` to the decision records: the date, the decision, the alternatives considered, and why this one won. The default place is `/_meta/architecture-decisions.md`; use the repo's own place if it keeps decision records elsewhere. If the build later proves a recorded decision wrong, amend the entry: keep its original text and add what changed and why.
- **The task spec.** Write it when the task needs one, as the next section describes.

No feature spec is written now. Feature specs are written ticket by ticket, as the Feature specs section describes.

## The task spec

Write a task spec when either is true:

- The summary has more than one ticket.
- The summary has a decision marked `[record]`.

A one-ticket task with no marked decision needs no task spec. Record its confirmed summary where the repo already tracks work, such as an issue or a pull request. When the repo tracks work nowhere, the summary in the conversation is the record.

Put the task spec where the repo already keeps task specs or documents of that kind. When it has no such place, use `/_meta/specs/tasks/<date>-<slug>.md`, with the date as `YYYY-MM-DD`. The task spec is the confirmed scope summary as one file, with a status and one section per field. Under `## Stories`, lay the stories out as a feature spec does: a heading for each role, a heading for each story, the story's sentence, and its scenarios in a `gherkin` block.

```text
# Task spec: <title>

- Status: in progress

## Goal

## In scope

## Out of scope

## Solution

## Stories

## Test seams

## Decisions made

## Terms

## Assumptions

## Tickets

- [ ] 1. <title>
  - Delivers:
  - Blocked by:
```

A one-ticket task spec lists its ticket by title alone.

The task spec of a task without stories has `## Success criteria` and `## Test intent` where `## Stories` is, and each of its tickets gives its success criteria and test intent where "Delivers" is.

When the repo keeps a tracker current, such as issues or a task list, create the tickets there, link each one from the task spec, and record what blocks a ticket with the tracker's own blocking links, or in the ticket's text where the tracker has none. Otherwise the checklist in the task spec is the tracker: tick a ticket when it is done.

While the task spec is in progress, a change to what it agreed is a decision for the user. Once they confirm it, write the change into the task spec with its date before building it.

When the last ticket is done, set the task spec's status to done, and from then on leave the task spec in place and unchanged. The task spec is the record of what was agreed. What a feature area does now belongs in its feature spec, and other facts that stay true belong in the repo's system documentation.

## Feature specs

A feature spec is the living document of one feature area: how the area works today, and the stories of each role. A task spec records what one task agreed and is then left alone; a feature spec is corrected whenever a task changes the area's behavior.

Put a feature spec where the repo already keeps documents of that kind. When it has no such place, use `/_meta/specs/<area>.md`. Name the area as the scope summary names it, and write that name in lower case with hyphens for the file. Give the feature spec this format:

````text
# Feature spec: <area>

- ID prefix: <PREFIX>

<what the area is for, in a sentence or two>

## Solution

<how the area works today: its approach, its interfaces, and its rules>

## Stories

### <Role>

#### <story title>

As a <role>, I want <what>, so that <why>.

```gherkin
Scenario: <ID> <title>
  Given <the starting state>
  When <what the role does>
  Then <what the role can observe>
```
````

The Solution section says how this one area works today. What spans areas, such as structure, internals, and technical guidance, stays in the repo's system documentation.

Write a ticket's scenarios into the feature spec of their area when the ticket is done: after its tests pass, and before it is committed or handed off. Do this whether or not the task has a task spec. The feature spec then says only what is built and has a test.

- Add a new scenario to the `gherkin` block of its story. Add a new story, with its sentence and its own block, under its role.
- Replace a scenario the ticket changed: the new text goes under the same ID.
- Delete a scenario the ticket removed, and a story that has no scenario left. The tests that carried the scenario's ID were deleted in the same ticket, during the build.
- Leave out the "(changed)", "(removed)" and "(restored)" marks. They belong to the scope summary. A restored scenario is already in the feature spec and stays as it is.
- Correct the Solution section when the ticket changed how the area works. A ticket that delivers no scenario still does this, when the area has a feature spec.

When the area has no feature spec yet, create it with the stories of this ticket only; later tickets add theirs. Do not write stories for behavior that was there before. Say so after the sentence on what the area is for: the file holds the stories settled since the day it was created.

When the repo already keeps its scenarios somewhere else, such as feature files that a test runner executes, those are its feature specs. Keep them there, follow their own conventions for names and IDs, and write no second copy.

## Paths and code

Paths to source and test files, and code, go stale as the code changes, so keep them out of task specs and feature specs:

- A feature spec holds no path to a source or test file and no code. It has to stay true when files move.
- A task spec holds such paths only under In scope, where the review checks the change against them. It holds no code.
- Name a module or an interface by its name, not by the file it lives in.
- A path that is part of the behavior, such as a file the product reads or a folder it writes to, is not meant here. Name it wherever the behavior is described.
- The exception is a snippet of a few lines that states an interface a user or a caller sees, such as a command line or a data shape, where prose would be less exact. Task specs and feature specs may both hold such snippets.
