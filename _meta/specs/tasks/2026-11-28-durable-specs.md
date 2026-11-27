# Task spec: Durable specs with user stories

- Status: in progress

This task spec is written in the format the task introduces: stories with scenarios in place of success criteria and test intent, a Test seams section, and tickets that name what they deliver and what blocks them.

## Goal

A repo that uses the skills gets living documentation of what each feature does, as user stories by role, with every scenario tied to the test that proves it. Along the way, tickets gain blocking edges and a size rule, and the interview becomes usable on its own.

## In scope

- `skills/metacoding-spec/` (new) and `skills/metacoding-shape/`.
- `skills/metacoding-tdd/SKILL.md`, `skills/metacoding-review/SKILL.md`, one line of `skills/metacoding-debug/SKILL.md`.
- `skills/metacoding-workflow/`: the skill, `workflow-rules.md`, `repository-organization.md`, `platform-adaptation.md`, `task-entry.md`, the Codex prompt.
- `src/services/skill-manager.ts` and the rebuilt `lib/`.
- `test/unit/skill-content.test.ts`, `skill-manager.test.ts`, `update-command.test.ts`.
- README, CHANGELOG, the skill lists in `_meta/api-design.md` and `_meta/system-documentation.md`.
- This repo's records: the glossary, the decision records, the backlog, and `_meta/specs/`.

## Out of scope

- Reading or writing the onboarding project map.
- Building tickets in parallel.
- Backfilling stories or IDs for behavior that exists today, here or in any repo.
- A Gherkin runner, or a CLI command that checks IDs against tests.
- The 1.x leftovers `_meta/project-task-list.md` and `test/test-documentation.md`.
- Pushing, a pull request, or a release.

## Solution

- **Two skills for step 2.** `metacoding-shape` keeps the interview and ends in a list of decisions, terms and assumptions. `metacoding-spec` turns settled decisions into the scope summary, gets it confirmed, and owns every written record and its default place.
- **The scope summary** lists stories in place of success criteria and test intent, and gains a "Test seams" field. A task that changes nothing a role can observe keeps the two prose fields.
- **Task spec.** What was called the spec, renamed, at `/_meta/specs/tasks/<date>-<slug>.md`. Same threshold, still frozen when done. It holds the stories as agreed.
- **Feature spec.** One per feature area at `/_meta/specs/<area>.md`: an ID prefix, a Solution section that says how the area works today, and the stories by role with their scenarios in `gherkin` blocks. A ticket's scenarios are written into it when the ticket is done, in the ticket's commit.
- **IDs.** A scenario's ID is its area's prefix plus the next free number. The test that proves it carries the ID in its name, or in a comment or tag where a name cannot hold it.
- **Tickets** list the scenario IDs they deliver and the tickets that block them.
- **The workflow** reads the feature specs of the areas a task touches while grounding, and updates them in its artifact step.

## Stories

### Developer

#### Shape skill: be questioned without starting a build

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

#### Spec skill: see the behavior as stories before it is built

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

#### Spec skill: keep a record of the task and a living document of the feature

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

Scenario: SPEC-11 keeps file paths and code out
  Given a spec being written
  Then a feature spec holds no file path and no code
  And a task spec holds paths only under In scope
  And either may hold a short snippet that states an interface
```

#### Spec skill: get tickets I can check one at a time

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

#### TDD skill: know which test proves which scenario

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

Scenario: TDD-3 tests through the agreed seam
  Given a scope summary that names a test seam for the story
  When a scenario's test is written
  Then it goes through that interface
```

#### Review skill: have unproven behavior found by search

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

#### Debug skill: keep a fixed bug tied to its scenario

As a developer, I want the regression test linked to the behavior it protects, so that the fix stays tied to what was agreed.

```gherkin
Scenario: DEBUG-1 the regression test carries the scenario's ID
  Given a bug in behavior that the agreed scope names as a scenario
  When the fix is made
  Then the regression test carries that scenario's ID
```

#### Workflow: have the workflow keep both specs current

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

### CLI user

#### Skill install: get the new skill with the others

As a CLI user, I want every packaged skill installed, so that the workflow finds the skills it names.

```gherkin
Scenario: INSTALL-1 installs the spec skill
  Given a project
  When I install or update the skills for any agent
  Then metacoding-spec is installed with the other skills
```

## Test seams

- **All Developer stories:** the installed text of the skills, as `SkillManager.generateInstallationFiles` returns it for an agent. This is the seam the content tests already use. It proves the rule is in the installed skill, not that an agent obeys it.
- **The CLI user story:** the same call, checking which skill folders it installs.

## Decisions made

- Two kinds of spec: a frozen task spec and a living feature spec per feature area, updated per ticket. Recorded in `_meta/architecture-decisions.md`.
- A scenario is tied to its test by an ID in the test's name. Recorded in `_meta/architecture-decisions.md`.
- The interview and the spec writing are two skills, `metacoding-shape` and `metacoding-spec`. Recorded in `_meta/architecture-decisions.md`.
- Feature specs are filed by feature area, with roles as headings.
- Roles are glossary terms.
- Workflow step 2 stays one step, and steps 3 to 7 keep their numbers.
- A ticket is split above five scenarios.
- Every task that changes behavior a role can observe has stories, whatever its size; a refactor, tooling or docs task has none.
- This task sets only the default places and keeps the rule that the repo's own place wins.
- This task uses the format it introduces.

## Terms

Task spec, feature spec, feature area, role, story, scenario, test seam, and the roles Developer and CLI user, as defined in `_meta/glossary.md`. The entry for Shape is corrected there.

## Assumptions

- This repo gets seven feature areas: shape skill, spec skill, TDD skill, review skill, debug skill, workflow, skill install. Each feature spec holds only this task's stories.
- The records go in first, on their own: the glossary, the decision records, this task spec, and the backlog item removed. Then one commit per ticket, with a pause for the user's go after each.
- The three done specs move to `_meta/specs/tasks/` in ticket 3. Only their relative links change.
- Existing content tests keep their names. They are re-pointed where text moves to the new skill.
  - Changed on 2026-11-28, in ticket 1: eight existing tests were renamed, because their names said the shape skill does what the spec skill now does. No test was given an ID it did not have.
  - Changed on 2026-11-28, in ticket 2: one more existing test was renamed, because its name said tickets carry criteria and test intent where they now name the scenarios they deliver.
  - Changed on 2026-11-28, in ticket 3: the names of existing tests that said "spec" now say "task spec", as the rename requires.
- README and CHANGELOG are updated in each ticket, under "Unreleased". The version stays 2.0.1.
- A new scenario takes the number one above the highest in its feature spec and in any task spec in progress.
  - Changed on 2026-11-28, in ticket 3: done task specs count too. A removed scenario leaves the feature spec, so counting only the feature spec could hand its number out again.
- The onboarding branch says to take the default places from `metacoding-shape`. After this branch they live in `metacoding-spec`, so whichever merges second re-points them.
- The main checkout's installed `.claude/skills` is not refreshed by this task, because other sessions work there.

## Tickets

- [x] **1. Shape interviews, spec writes**
  - Delivers: SHAPE-1, SHAPE-2, SPEC-1, FLOW-1, INSTALL-1
  - Blocked by: none
- [x] **2. Stories in the scope summary**
  - Delivers: SHAPE-3, SPEC-2, SPEC-3, SPEC-4
  - Blocked by: 1
- [x] **3. Task specs and feature specs**
  - Delivers: SPEC-5, SPEC-6, SPEC-7, SPEC-8, SPEC-9
  - Blocked by: 2
- [ ] **4. The workflow keeps both specs current**
  - Delivers: FLOW-2, FLOW-3, FLOW-4
  - Blocked by: 3
- [ ] **5. Tests carry scenario IDs**
  - Delivers: TDD-1, TDD-2, REVIEW-1, REVIEW-2, DEBUG-1
  - Blocked by: 2
- [ ] **6. Test seams, and no paths in specs**
  - Delivers: SPEC-10, SPEC-11, TDD-3
  - Blocked by: 2
- [ ] **7. Ticket rules**
  - Delivers: SPEC-12, SPEC-13, SPEC-14, FLOW-5
  - Blocked by: 2
