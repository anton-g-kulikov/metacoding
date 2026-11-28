# Feature spec: Spec skill

- ID prefix: SPEC

`metacoding-spec` turns a task's settled decisions into an agreed scope and writes the records. This file holds the stories settled since 2026-11-28. Behavior from before that date is not listed.

## Solution

The skill starts from decisions that are already settled. It writes behavior a role can observe as stories grouped by role, each with Given/When/Then scenarios that carry an ID; a task without such behavior gets success criteria and test intent instead. It names a test seam for each story: the public interface its scenarios are tested through, preferring an interface that already exists and the highest one that works. It then describes the solution and slices it into tickets. Each ticket is a vertical slice that names the scenarios it delivers and the tickets that block it; a ticket that delivers no scenario has success criteria and test intent of its own. A ticket with more than five scenarios is split. A wide refactor is the exception to vertical slices: it is sliced as add the new form beside the old, move the callers in batches, remove the old form. It sends a scope summary and waits for the user to confirm it. A decision that is still open goes back to the shape skill.

On confirmation it writes the settled terms to the glossary, the decisions the summary marked to the decision records, and a task spec when the task has more than one ticket or a marked decision. A task spec is the record of one task, kept under `/_meta/specs/tasks/` and frozen once the task is done.

A feature spec is the living document of one feature area, kept at `/_meta/specs/<area>.md`, with an ID prefix, a Solution section, and the stories by role. It is not written on confirmation: a ticket's scenarios go into it when the ticket is done. A changed scenario replaces the old text under its ID, and a removed one is deleted together with its test. The first ticket that delivers a scenario in an area starts that area's feature spec, with no stories for older behavior. A new scenario's ID uses the prefix its feature spec states and the number one above the highest any spec holds for that prefix. A repo that keeps either kind of document elsewhere keeps its own place.

Paths to source and test files, and code, stay out of both kinds of document, because they go stale as the code changes. A feature spec holds none, and a task spec holds such paths only under In scope. A path that is part of the behavior, such as a folder the product writes to, may be named. A short snippet that states an interface is the exception.

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

Scenario: SPEC-10 agrees the test seams
  Given a task with stories
  When the agent sends the scope summary
  Then it names for each story the public interface its scenarios are tested through
  And it prefers an existing interface and the highest one that works
```

#### Keep a record of the task and a living document of the feature

As a developer, I want what a feature does today in one place, so that I do not piece it together from old task records.

```gherkin
Scenario: SPEC-5 writes the task spec under tasks/
  Given a confirmed summary with more than one ticket or a marked decision
  When the records are written
  Then the task spec is at /_meta/specs/tasks/<date>-<slug>.md, or the repo's own place

Scenario: SPEC-6 gives a feature spec one place and one format
  Given a feature area
  When its feature spec is written
  Then it is at /_meta/specs/<area>.md, or the repo's own place
  And it has an ID prefix, a Solution section, and stories by role in gherkin blocks

Scenario: SPEC-7 writes a finished ticket's scenarios into the feature spec
  Given a ticket whose tests pass
  When the ticket is closed
  Then its scenarios are in the feature spec of their area
  And this holds whether or not the task has a task spec

Scenario: SPEC-8 starts a feature spec with the first task in its area
  Given a feature area with no feature spec
  When a task delivers its first scenario there
  Then the feature spec is created with that task's stories only

Scenario: SPEC-9 changes and removes scenarios in place
  Given a task that changes one scenario and removes another
  When the ticket is closed
  Then the changed scenario keeps its ID with the new text
  And the removed one leaves the feature spec together with its test

Scenario: SPEC-11 keeps paths to code, and code, out
  Given a task spec or a feature spec
  When it is written
  Then a feature spec holds no path to a source or test file and no code
  And a task spec holds such paths only under In scope
  And either may hold a short snippet that states an interface
```

#### Get tickets I can check one at a time

As a developer, I want small tickets that say what blocks them, so that each is quick to review and I can see which are independent.

```gherkin
Scenario: SPEC-12 states what each ticket delivers and what blocks it
  Given a solution sliced into tickets
  Then each ticket lists the scenario IDs it delivers
  And it names the tickets that must be done first, or none

Scenario: SPEC-13 splits a ticket with more than five scenarios
  Given a ticket that would deliver six scenarios
  Then it is split, unless a piece could not be checked on its own

Scenario: SPEC-14 slices a wide refactor in three stages
  Given one mechanical change that breaks many callers at once
  Then the tickets add the new form beside the old, move callers in batches, and remove the old form last
```
