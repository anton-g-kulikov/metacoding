---
name: metacoding-spec
description: Turn a task's settled decisions into a scope summary with the solution sliced into tickets, get the user's confirmation, and then write the records, which are the glossary terms, the decision records, and a spec when the task has more than one ticket or a decision to record. Use when the decisions are settled and the task is to be built, when the user asks for a spec, a scope summary, or tickets, or when the metacoding workflow reaches its shape step.
---

# Spec

Turn a task's settled decisions into an agreed scope before changing any code, test, or doc: write the behavior as stories, describe the solution, slice it into tickets, and get the user to confirm the scope summary. Then write the records.

## Start from settled decisions

Work from what is already settled: the decisions summary of the `metacoding-shape` skill, or what you and the user agreed earlier in the conversation. Do not ask the user again for a decision that is already settled.

When a decision that would change what gets built or how it is tested is still open, settle it first with the `metacoding-shape` skill, which puts it to the user with a recommended answer. The one decision this skill asks itself is how to cut the work into tickets, because that question only exists once the solution does.

## The project map

When the repo has a project map, `.metacoding/project.md`, read it before writing the scope summary. The `metacoding-onboard` skill writes it, and it names where this repo keeps its tracker, its specs, its glossary, and its decision records.

Where the project map names a place, use that place wherever this skill reads or writes the glossary, a decision record, a spec, or a ticket, and create it there when it does not exist yet. The tracker line says where this repo tracks work. A line that says none is an answer too: the repo tracks work nowhere, and the checklist in the spec is the tracker.

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
- Give each scenario an ID: the prefix of its feature area, a hyphen, and a number, such as `UPDATE-4`. The prefix is a short name for the area in capitals. Use the one the area's scenarios already carry in the repo's specs, and choose one for a new area.
- A new scenario takes the number one above the highest its area has used, counting a spec that is still in progress.
- List the scenarios the task adds or changes, and leave the area's other scenarios out. A scenario the task changes keeps its ID: write "(changed)" after its title.
- The scenarios stand in place of success criteria and test intent: they are what the task must deliver and what its tests must prove.

A task that changes no behavior a role can observe, such as a refactor, tooling, or docs, has no stories. Give it success criteria and test intent instead.

## Solution and tickets

Describe the solution: the approach, and each public interface, data shape, or file layout that changes. Say what a builder needs to start, and leave the code out.

Then slice the solution into tickets. A ticket is one piece that can be built, verified, reviewed, and committed on its own.

- Make each ticket a vertical slice: it goes through every layer it needs and ends in something a user or caller can observe. A piece that only adds one layer, such as a database schema with nothing that reads it, belongs in the ticket that uses it.
- Give each ticket the scenarios it delivers.
- Order the tickets so that each builds on the ones before it.
- A small task is one ticket. Add a ticket only when the piece can be finished and checked by itself.

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
Decisions made:
Terms:
Assumptions:
Tickets:
```

Under "Stories", give the stories as the Stories section describes. A task without stories has "Success criteria:" and "Test intent:" where "Stories:" is.

Under "Tickets", number the tickets in build order and give each a title and the IDs of the scenarios it delivers. In a task without stories, give each its success criteria and its test intent. For a one-ticket task, give the title alone: the fields above already describe it.

Under "Decisions made", put `[record]` in front of each decision that is hard to reverse, surprising without context, and a real trade-off between workable alternatives. Confirming the summary also approves writing those as decision records.

Under "Terms", list each term that was settled, with its meaning and the words to avoid. When the repo has no glossary yet, propose creating one there, by default at `/_meta/glossary.md`: confirming the summary approves it.

Changing files starts after that confirmation. The confirmed summary is the agreed scope for everything that follows: the tickets are built one at a time, each ticket's scenarios, or its test intent, seed its test-first work, and reviews check each ticket and then the whole change against the summary.

When the user told you to proceed without questions, send the scope summary with every unasked decision listed under Assumptions, then continue. That instruction stands in for the confirmation.

## Records written on confirmation

Once the scope summary is confirmed, write these records before any other file changes:

- **Terms.** Add each term listed under Terms to the glossary, or correct its entry: the term, its meaning in this project, and the words to avoid for it. The default place is `/_meta/glossary.md`; use the repo's own glossary if it keeps one elsewhere.
- **Decisions.** Write each decision marked `[record]` to the decision records: the date, the decision, the alternatives considered, and why this one won. The default place is `/_meta/architecture-decisions.md`; use the repo's own place if it keeps decision records elsewhere. If the build later proves a recorded decision wrong, amend the entry: keep its original text and add what changed and why.
- **The spec.** Write it when the task needs one, as the next section describes.

## The spec

Write a spec when either is true:

- The summary has more than one ticket.
- The summary has a decision marked `[record]`.

A one-ticket task with no marked decision needs no spec. Record its confirmed summary where the repo already tracks work, such as an issue or a pull request. When the repo tracks work nowhere, the summary in the conversation is the record.

Put the spec where the repo already keeps specs or documents of that kind. When it has no such place, use `/_meta/specs/<date>-<slug>.md`, with the date as `YYYY-MM-DD`. The spec is the confirmed scope summary as one file, with a status and one section per field:

```text
# Spec: <title>

- Status: in progress

## Goal

## In scope

## Out of scope

## Solution

## Stories

## Decisions made

## Terms

## Assumptions

## Tickets

- [ ] 1. <title>
  - Delivers:
```

A one-ticket spec lists its ticket by title alone.

The spec of a task without stories has `## Success criteria` and `## Test intent` where `## Stories` is, and each of its tickets gives its success criteria and test intent where "Delivers" is.

When the repo keeps a tracker current, such as issues or a task list, create the tickets there and link each one from the spec. Otherwise the checklist in the spec is the tracker: tick a ticket when it is done.

While the spec is in progress, a change to what it agreed is a decision for the user. Once they confirm it, write the change into the spec with its date before building it.

When the last ticket is done, set the spec's status to done, and from then on leave the spec in place and unchanged. The spec is the record of what was agreed; facts that stay true belong in the repo's system documentation.
