# Feature spec: TDD skill

- ID prefix: TDD

`metacoding-tdd` builds a change test-first, one behavior at a time. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill lists the behaviors the change must prove, then takes them one at a time: a test that fails first, the least code that makes it pass, the next behavior. The list starts from the scenarios of the ticket being built, or from its test intent in a task without stories. The test that proves a scenario carries the scenario's ID in its name, or in a comment or tag where a name cannot hold it. Tests for lower-level cases carry no ID. When a ticket changes a scenario its tests change with it, and when it removes one they are deleted.

## Stories

### Developer

#### Know which test proves which scenario

As a developer, I want each scenario's test to carry its ID, so that a search for the ID finds the proof.

```gherkin
Scenario: TDD-1 starts from the ticket's scenarios
  Given a ticket that lists scenarios
  When the build starts
  Then the list of behaviors to prove starts from those scenarios

Scenario: TDD-2 names the test after the scenario
  Given a scenario with an ID
  When its test is written
  Then the test carries the ID in its name, or in a comment or tag where a name cannot
  And lower-level tests may be added without an ID
```
