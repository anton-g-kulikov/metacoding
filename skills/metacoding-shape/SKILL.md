---
name: metacoding-shape
description: Shape a task before any change by interviewing the user in rounds of numbered questions with a recommended answer each, ending in a confirmed scope summary with the solution sliced into tickets, written up as a spec when the task has more than one ticket or a decision to record. Use when a request leaves decisions open, when the user asks to shape a task, to be questioned, or to clarify scope first, or when the metacoding workflow reaches its shape step.
---

# Shape

Run this interview after reading the relevant parts of the repository and before changing any code, test, or doc. Its goal is a shared understanding of the task: every question that shapes the work is either looked up by you or settled by the user.

## Facts and decisions

Sort every open question into one of two kinds.

- A **fact** can be found by looking: code, config, tests, docs, git history, tool output. Look it up yourself. Hand a long search to a subagent when the host agent supports one.
- A **decision** depends on what the user wants: behavior, scope, trade-offs, naming, priorities. Put it to the user.

Ask the user only for decisions. When a fact you looked up contradicts something the user said, raise that contradiction as a decision.

## Rounds

Decisions depend on each other: one answer opens or closes others. Work through them in rounds.

1. List the decisions that are ready, meaning they do not depend on an answer you have not heard yet.
2. Ask all of them in one message, using the question format below.
3. Wait for the answers.
4. Work out which decisions the answers opened, look up any new facts, and start the next round.

Hold a question for a later round when its wording would change with another answer in the current round.

When you cannot reach the user directly, for example when running as a subagent, return the round as your result and stop there. Continue when the answers are sent back.

## Terms

Read the project's glossary before the first round, when it has one, and use its terms in your questions.

When an answer settles what a project term means, record it in the glossary straight away: the term, its meaning in this project, and the words to avoid for it. The default place is `/_meta/glossary.md`; use the repo's own glossary if it keeps one elsewhere, and propose the file to the user if it has none. The glossary is the one file the interview writes before the scope summary is confirmed.

When the user's wording conflicts with the glossary, or one word is doing two jobs, raise it as a decision.

## Question format

Number each question and give your recommended answer with a one-line reason. Phrase the question so that "yes" accepts the recommendation. The user can then answer a whole round in one line, such as "1 yes, 2 yes, 3 the second option".

```text
Q1. <short title>
<the decision, with the options when there are several>
Recommended: <your answer>, because <one-line reason>

Q2. <short title>
...
```

Ground each recommendation in what you found in the repo: existing patterns, earlier decisions, constraints.

## What to cover

Check each area and ask only where a real decision is open.

- Goal: the problem being solved, and for whom
- Behavior: happy path, errors, edge cases, empty and limit states
- Scope: what is included and what is deliberately left out
- Interfaces: any public API, CLI, config, data shape, or UI that changes
- Compatibility: existing users, data, or callers that are affected
- Tests: which behaviors must be proven, and at which level
- Done: how the user will check the result

## Solution and tickets

When the decisions are settled, describe the solution: the approach, and each public interface, data shape, or file layout that changes. Say what a builder needs to start, and leave the code out.

Then slice the solution into tickets. A ticket is one piece that can be built, verified, reviewed, and committed on its own.

- Make each ticket a vertical slice: it goes through every layer it needs and ends in something a user or caller can observe. A piece that only adds one layer, such as a database schema with nothing that reads it, belongs in the ticket that uses it.
- Give each ticket its own success criteria and test intent.
- Order the tickets so that each builds on the ones before it.
- A small task is one ticket. Add a ticket only when the piece can be finished and checked by itself.

When there is more than one reasonable way to cut the work, put the cut to the user as a decision, with your recommended cut.

## Closing the interview

The interview is complete when both are true:

- You can name no further decision that would change what gets built, how it is sliced into tickets, or how it is tested.
- You have sent the scope summary below and the user has confirmed it.

```text
Scope summary
Goal:
Success criteria:
In scope:
Out of scope:
Solution:
Decisions made:
Assumptions:
Test intent:
Tickets:
```

Under "Tickets", number the tickets in build order and give each a title, its success criteria, and its test intent. For a one-ticket task, give the title alone: the fields above already describe it.

Under "Decisions made", put `[record]` in front of each decision that is hard to reverse, surprising without context, and a real trade-off between workable alternatives. Confirming the summary also approves writing those as decision records once the work is done.

Changing files starts after that confirmation. The confirmed summary is the agreed scope for everything that follows: the test intent seeds test-first work, and a later review checks the result against it.

Two shortcuts:

- When grounding leaves no decision open, skip the rounds: describe the solution, slice it into tickets, and send the scope summary directly.
- When the user tells you to proceed without questions, send the scope summary with every unasked decision listed under Assumptions, then continue.

## The spec

Once the user confirms the scope summary, or has told you to proceed without questions, write a spec when either is true:

- The summary has more than one ticket.
- The summary has a decision marked `[record]`.

A one-ticket task with no marked decision needs no spec. Record its confirmed summary where the repo already tracks work, such as an issue or a pull request. When the repo tracks work nowhere, the summary in the conversation is the record.

Put the spec where the repo already keeps specs or documents of that kind. When it has no such place, use `/_meta/specs/<date>-<slug>.md`, with the date as `YYYY-MM-DD`. The spec is the confirmed scope summary as one file, with a status and one section per field:

```text
# Spec: <title>

- Status: in progress

## Goal

## Success criteria

## In scope

## Out of scope

## Solution

## Decisions made

## Assumptions

## Test intent

## Tickets

- [ ] 1. <title>
  - Success criteria:
  - Test intent:
```

A one-ticket spec lists its ticket by title alone.

When the repo keeps a tracker current, such as issues or a task list, create the tickets there and link each one from the spec. Otherwise the checklist in the spec is the tracker.

When the last ticket is done, set the spec's status to done, and from then on leave the spec in place and unchanged. The spec is the record of what was agreed; facts that stay true belong in the repo's system documentation.
