# Feature spec: Debug skill

- ID prefix: DEBUG

`metacoding-debug` finds the cause of a bug, starting from a command that reproduces it. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill reproduces the bug with one command, minimizes it, tests ranked hypotheses one at a time, and fixes the cause with a regression test. When the broken behavior is a scenario, in the agreed scope or in a feature spec, the regression test carries that scenario's ID.

## Stories

### Developer

#### Keep a fixed bug tied to its scenario

As a developer, I want the regression test linked to the behavior it protects, so that the fix stays tied to what was agreed.

```gherkin
Scenario: DEBUG-1 the regression test carries the scenario's ID
  Given a bug in behavior that the agreed scope names as a scenario
  When the fix is made
  Then the regression test carries that scenario's ID
```
