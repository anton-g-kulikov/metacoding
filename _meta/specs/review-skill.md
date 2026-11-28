# Feature spec: Review skill

- ID prefix: REVIEW

`metacoding-review` checks a finished change before it is committed or handed off. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill reviews the diff on two separate axes: against the agreed scope, and against the repo's standards. For one ticket of a larger task, the agreed scope is the scenarios the ticket delivers, read with the task's in-scope and out-of-scope lists. It finds an unproven scenario by searching the tests for the scenario's ID, and reads the test it finds to see that it checks what the scenario's "Then" says. For a removed scenario it checks that no test carries the ID any more. After the last ticket it checks the whole change against the task spec and searches for every scenario of the task once more.

## Stories

### Developer

#### Have unproven behavior found by search

As a developer, I want the review to check scenarios against tests mechanically, so that the result does not depend on judgement.

```gherkin
Scenario: REVIEW-1 reviews a ticket against its scenarios
  Given a ticket that lists scenarios
  When the ticket is reviewed
  Then the agreed scope is those scenarios, with the task's in-scope and out-of-scope lists

Scenario: REVIEW-2 finds an unproven scenario by search
  Given a scenario whose ID no test carries
  When the scope axis runs
  Then the scenario is reported as Unproven
```
