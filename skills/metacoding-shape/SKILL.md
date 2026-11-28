---
name: metacoding-shape
description: Interview the user about a task before any change, in rounds of numbered questions with a recommended answer each, ending in a summary of the settled decisions, terms and assumptions. Use when a request leaves decisions open, when the user asks to shape a task, to be questioned, or to clarify scope first, or when the metacoding workflow reaches its shape step.
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

## The project map

When the repo has a project map, `.metacoding/project.md`, read it before the first round. The `metacoding-onboard` skill writes it, and it names where this repo keeps its tracker, its specs, its glossary, and its decision records. Read the glossary at the place it names.

## Terms

Read the project's glossary before the first round, when it has one, and use its terms in your questions.

When an answer settles what a project term means, note the term, its meaning in this project, and the words to avoid for it, and list it under Terms in the decisions summary. The `metacoding-spec` skill writes them to the glossary once its scope summary is confirmed.

A role is a term too: the kind of user a behavior is for. When an answer names who a behavior is for and the glossary has no such role, note it and list it under Terms, like any other term.

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

## Closing the interview

The interview is complete when you can name no further decision that would change what gets built or how it is tested. Then send the decisions summary:

```text
Decisions summary
Goal:
Decisions made:
Terms:
Assumptions:
```

- Under "Decisions made", list each decision the user settled, one line each.
- Under "Terms", list the terms you noted during the interview.
- Under "Assumptions", list what you took as given without asking.

This skill writes no file. What follows depends on why the interview was run:

- When the task is to be built, continue with the `metacoding-spec` skill. It turns these decisions into a scope summary with the solution and its tickets, gets the user's confirmation, and writes the records. Changing files starts only after that confirmation.
- When the user asked only to be questioned, stop here. The decisions summary in the conversation is the result.

Two shortcuts:

- When reading the repo leaves no decision open, skip the rounds and send the decisions summary directly.
- When the user tells you to proceed without questions, list every unasked decision under Assumptions and continue without waiting for answers.
