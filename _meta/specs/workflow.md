# Feature spec: Workflow

- ID prefix: FLOW

`metacoding-workflow` takes one task from request to handoff. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The workflow skill runs seven steps in a fixed order: ground, shape, build, verify, review, update artifacts, close. It owns the order and the rules that hold between steps, and calls a companion skill for the method of the shape, build, debug and review steps. Steps 3 to 7 run once per ticket, with a pause for the user's go between tickets.

## Stories

### Developer

#### Have the workflow keep both specs current

As a developer, I want the workflow to read and update the specs itself, so that they stay true without my asking.

```gherkin
Scenario: FLOW-1 shapes with both skills
  Given a task at step 2
  Then the workflow uses metacoding-shape, then metacoding-spec
  And no file changes before the scope summary is confirmed
```
