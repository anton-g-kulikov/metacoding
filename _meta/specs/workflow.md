# Feature spec: Workflow

- ID prefix: FLOW

`metacoding-workflow` takes one task from request to handoff. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The workflow skill runs seven steps in a fixed order: ground, shape, build, verify, review, update artifacts, close. It owns the order and the rules that hold between steps, and calls a companion skill for the method of the shape, build, debug and review steps, and for the retro that follows the last ticket. Steps 3 to 7 run once per ticket, with a pause for the user's go between tickets. The next ticket is the first one in the list that is not marked done and that no unfinished ticket blocks.

While grounding, the workflow reads the feature specs of the areas the task touches. In its artifact step it updates the feature spec of each area the ticket changed: it writes the ticket's scenarios into it and corrects the Solution section when the ticket changed how the area works. It does this before the ticket is marked done, so that the feature spec is part of the ticket's commit, and then checks that every scenario the ticket delivered is there with the agreed text. A task is not complete until the scenarios it delivered are in the feature specs. The layout reference says where both kinds of spec go, and the workflow creates no separate test document.

## Stories

### Developer

#### Have the workflow keep both specs current

As a developer, I want the workflow to read and update the specs itself, so that they stay true without my asking.

```gherkin
Scenario: FLOW-1 shapes with both skills
  Given a task at step 2
  Then the workflow uses metacoding-shape, then metacoding-spec
  And no file changes before the scope summary is confirmed

Scenario: FLOW-2 reads the feature specs while grounding
  Given a repo with feature specs
  When the workflow grounds a task
  Then it reads the feature specs of the areas the task touches

Scenario: FLOW-3 updates the feature spec in the ticket's commit
  Given a ticket that delivered scenarios
  When the workflow updates artifacts
  Then the feature spec holds those scenarios before the ticket is committed

Scenario: FLOW-4 says where both specs go
  Given a repo with no place for specs
  Then the layout reference names /_meta/specs/<area>.md and /_meta/specs/tasks/
  And it still creates no separate test document

Scenario: FLOW-5 does not start a blocked ticket
  Given a ticket whose blocking ticket is not done
  When the workflow picks the next ticket
  Then it takes the first ticket in the list whose blockers are all done
```
