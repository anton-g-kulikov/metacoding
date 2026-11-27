# Feature spec: Spec skill

- ID prefix: SPEC

`metacoding-spec` turns a task's settled decisions into an agreed scope and writes the records. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill starts from decisions that are already settled. It writes behavior a role can observe as stories grouped by role, each with Given/When/Then scenarios that carry an ID; a task without such behavior gets success criteria and test intent instead. It then describes the solution and slices it into tickets, each naming the scenarios it delivers. It sends a scope summary and waits for the user to confirm it. On confirmation it writes the settled terms to the glossary, the decisions the summary marked to the decision records, and a spec when the task has more than one ticket or a marked decision. A decision that is still open goes back to the shape skill.

## Stories

### Developer

#### See the behavior as stories before it is built

As a developer, I want the agreed scope written as stories with scenarios, so that I confirm behavior and not prose.

```gherkin
Scenario: SPEC-1 starts from settled decisions
  Given decisions already settled in the conversation
  When the agent uses metacoding-spec
  Then it writes the scope summary without asking them again
  And it sends any decision still open to metacoding-shape

Scenario: SPEC-2 lists stories by role
  Given a task that changes behavior a role can observe
  When the agent sends the scope summary
  Then it lists stories grouped by role, each with Given/When/Then scenarios
  And these stand in place of success criteria and test intent

Scenario: SPEC-3 keeps plain criteria for a task without stories
  Given a refactor, tooling or docs task
  When the agent sends the scope summary
  Then it gives success criteria and test intent, and no stories

Scenario: SPEC-4 gives each scenario an ID
  Given a feature area with scenarios up to UPDATE-3
  When a task adds one scenario and changes UPDATE-2
  Then the new one is UPDATE-4 and the changed one stays UPDATE-2
```
