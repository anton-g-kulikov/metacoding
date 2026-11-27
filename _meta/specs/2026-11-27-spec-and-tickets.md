# Spec: Spec and tickets

- Status: in progress

## Goal

Shape ends in a documented solution that is sliced into tickets, so the agreed scope survives the session and the workflow builds it one ticket at a time.

## Success criteria

- `metacoding-shape` closes with a scope summary that also states the solution and the tickets, and works the same when run on its own.
- When the task has more than one ticket or any `[record]` decision, shape writes a spec after the user confirms.
- Decision records are written when the summary is confirmed, and amended at step 6 if the build proved one wrong.
- The workflow runs build, verify, review, artifacts, and close once per ticket, and waits for the user's go between tickets.
- Review checks each ticket against its own criteria, and the whole change against the spec after the last ticket.

## In scope

- Skill text: `metacoding-shape`, `metacoding-workflow` (skill, `workflow-rules.md`, `repository-organization.md`, `platform-adaptation.md`, `agents/openai.yaml`), `metacoding-tdd`, `metacoding-review`.
- Content tests in `test/unit/skill-content.test.ts`.
- README and CHANGELOG.
- This repo's own records for this change: this spec, the decision records, the glossary.

## Out of scope

- Installer code. The spec format lives inside the shape skill, so no packaged file is added.
- A separate test document, the `task-entry.md` template, and `_meta/project-task-list.md`.
- The follow-ups from the review of the companion-skills change, and cleanup of stale files on `update`.

## Solution

- A spec is one file at `/_meta/specs/<date>-<slug>.md`, or the repo's own place: the scope summary, a Solution section, and the tickets.
- A ticket is a vertical slice with its own success criteria and test intent. Tickets go in the repo's tracker when it has one, otherwise as a checklist in the spec.
- A finished spec stays in place, marked done and frozen. Lasting facts still move to the system docs.
- Below the threshold (one ticket, no `[record]` decision), the scope summary is recorded as before: where the repo tracks work, otherwise in the conversation.

## Decisions made

- Specs and tickets are created even in a repo that tracks work nowhere. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- Decision records are written at the end of shape, not after the build. Recorded in [architecture-decisions.md](../architecture-decisions.md).
- The unit is called "ticket"; "slice" stays a verb and the quality bar.
- Slicing is part of `metacoding-shape`, not a new skill.
- The workflow pauses between tickets.

## Assumptions

- No source or installer test changes are needed. If one turns out to be, it is raised before it is made.
- The change runs through the workflow itself: one ticket at a time, test-first, pausing after each.

## Test intent

One content test per behavior in the success criteria, written first and seen failing. The existing test that asserts "Create neither" changes in ticket 2 to assert the new rule: specs and tickets are created, a separate test document still is not.

## Tickets

- [x] **1. Shape ends in a solution and tickets**
  - Success criteria: the scope summary has Solution and Tickets fields; the skill defines a ticket as a vertical slice with its own success criteria and test intent; a small task stays one ticket.
  - Test intent: the shape skill's summary block carries both fields; the skill text states the ticket definition and the one-ticket rule; the workflow rules list the same summary fields.
- [x] **2. Shape writes the spec**
  - Success criteria: the skill states the threshold, the spec's format and location, and where tickets live; the layout reference prescribes `/_meta/specs/` and no longer forbids new task records.
  - Test intent: the shape skill names the threshold and `/_meta/specs/`; the layout reference lists specs and keeps "no separate test document"; the adaptation reference covers a repo without a tracker.
- [ ] **3. Decision records at the end of shape**
  - Success criteria: shape writes `[record]` decisions on confirmation; step 6 amends a record the build proved wrong.
  - Test intent: the shape skill and the layout reference say records are written when the summary is confirmed; the workflow rules say step 6 amends.
- [ ] **4. The workflow runs per ticket**
  - Success criteria: steps 3 to 7 run once per ticket and the workflow waits between tickets; TDD takes the ticket's test intent; review checks each ticket and, after the last, the whole change against the spec.
  - Test intent: the workflow skill and rules state the loop and the pause; the TDD skill names the ticket's test intent; the review skill names the final pass against the spec.
