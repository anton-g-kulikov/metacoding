# Feature spec: Shape skill

- ID prefix: SHAPE

`metacoding-shape` interviews the user about a task before any change. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill is an interview. It sorts every open question into a fact, which the agent looks up, or a decision, which goes to the user. Decisions are asked in rounds of numbered questions, each with a recommended answer. The interview ends in a decisions summary: the goal, the decisions made, the terms settled, and the assumptions. A role, the kind of user a behavior is for, is settled as a term. The skill writes no file. A task that is to be built continues in the spec skill.

## Stories

### Developer

#### Be questioned without starting a build

As a developer, I want the interview on its own, so that I can settle decisions before I commit to building.

```gherkin
Scenario: SHAPE-1 ends in a decisions summary
  Given I asked only to be questioned
  When no decision is left open
  Then the agent sends the decisions, terms and assumptions, and writes no file

Scenario: SHAPE-2 hands over to the spec skill
  Given the task is to be built
  When the interview is complete
  Then the agent continues with metacoding-spec, which gets the scope summary confirmed

Scenario: SHAPE-3 settles a role as a term
  Given an answer names who a behavior is for
  When the glossary has no such role
  Then the role is listed under Terms with its meaning
```
