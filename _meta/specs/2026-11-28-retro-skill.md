# Spec: Retro skill

- Status: in progress

## Goal

Give metacoding a way to turn a task's mistakes into lasting changes, so the same mistake is prevented, or caught earlier, in the next task.

## Success criteria

- `init` and `update` install and validate `metacoding-retro` for Codex, Claude Code and Antigravity, with `agents/openai.yaml` for Codex.
- The skill works on its own and states: what it reads, the three-part bar, the kinds of change in order of preference, where a rule goes, that it never edits an installed metacoding skill, the proposal format, what happens after the user's answer, and that it keeps no log.
- The workflow runs it once per task after the last ticket is closed, and the Completion Standard names it.
- The layout reference and the platform-adaptation reference name `/_meta/coding-standards.md` as the default home for a repo's standards.
- README, CHANGELOG, `_meta/api-design.md` and `_meta/system-documentation.md` list the new skill.
- `npx jest`, `npm run lint` and `npm run build` pass, and `lib/` is rebuilt and committed with the `src/` change.

## In scope

- New: `skills/metacoding-retro/SKILL.md` and `skills/metacoding-retro/agents/openai.yaml`.
- `src/services/skill-manager.ts` (one line) and the rebuilt `lib/`.
- `skills/metacoding-workflow/SKILL.md`: one table row and the count of companions.
- `skills/metacoding-workflow/references/workflow-rules.md`: one rule in Tickets, one line in the Completion Standard.
- `skills/metacoding-workflow/references/repository-organization.md` and `references/platform-adaptation.md`: the standards file.
- Tests: `test/unit/skill-content.test.ts`, `test/unit/update-command.test.ts`, and `test/unit/skill-manager.test.ts` if it needs it.
- README, CHANGELOG, `_meta/api-design.md`, `_meta/system-documentation.md`.
- This task's records: this spec, the glossary, one decision record, and the backlog with "Retro" removed.
- Added on 2026-11-28, found while building and reviewing ticket 1 and kept because the skill needs them to hold in use:
  - The retro skill: expect few lessons; read the repo's existing checks before proposing one; how to word a rule; where a glossary term or a decision record goes; the most costly mistake first; when to recommend "skip"; continue when a subagent's answers are sent back; one commit per applied lesson when commits are in scope; a closing report.
  - The never-edit rule holds even when a repo commits its installed metacoding skills.
  - The workflow rules: a one-ticket task's retro follows the close of that ticket, and the retro's changes are not part of the task's spec.
  - README: a "Retro" section, a line in "Completion Criteria", and a bullet in the list of what the skill will do.
  - CHANGELOG: the retro in the line on what the orchestrator calls.
- Added on 2026-11-28, confirmed by the user before ticket 2: the layout reference says a glossary term and a decision record reach their files only through a confirmed scope summary. Ticket 2 adds the retro as a second route to both rules, so the layout reference and the retro skill agree. The README's list of the documents the workflow keeps is updated to match.

## Out of scope

- Any edit to `metacoding-review`, `metacoding-shape`, `metacoding-tdd` or `metacoding-debug`.
- Lessons about speed, tool cost, or tidying instruction files.
- A retro log.
- A "Standards" line in the onboarding project map, `.metacoding/project.md`. That is a follow-up once the onboarding branch is merged.
- Creating `/_meta/coding-standards.md` in this repo, unless the retro run at the end of this task proposes it and the user approves.
- Rebasing onto the other branches, pushing, a pull request, a release.

## Solution

A sixth skill, `metacoding-retro`, in these parts:

1. **What to read.** The review findings that had to be fixed, the user's corrections, changes to the spec made mid-build, amended decision records, and checks that failed for a reason that could have been foreseen. In a session that no longer has the conversation: the spec, the task's commits, and a question to the user about what went wrong.
2. **The bar.** A mistake is a lesson only when all three are true: it cost rework or was caught late; it would likely happen again in another task; a concrete change would prevent it or catch it earlier.
3. **The cause, then the change.** For each lesson, say why nothing stopped the mistake, then pick the first kind of change that fits: an automated check; a fix to an existing rule or doc; a new rule; a glossary term or decision record; a step in a repeated-task checklist.
4. **Where a rule goes.** Look for the home the repo already has and fix the rule in place. When the repo has no standards file, propose creating `/_meta/coding-standards.md`.
5. **Installed metacoding skills are never edited.** A lesson about them becomes a rule in the repo's standards, or a drafted issue text when the skill itself is at fault. A skill the repo tracks in git is edited like any other file.
6. **The proposals.** A numbered list, each lesson with the evidence, the change, where it goes, and "do" or "skip" recommended. "Nothing worth keeping" when no mistake passes the bar. Without a user to ask, the list is returned as the result.
7. **After the answer.** An approved text edit is applied and committed on its own. An approved check is built test-first when it is small, and is seen failing on the original mistake. Anything larger is queued where the repo tracks work, or named in the report where it tracks work nowhere.

The workflow calls the skill from the Tickets section of the workflow rules, once per task after the last ticket is closed. It is not an eighth step: steps 3 to 7 run once per ticket, and the retro runs once per task.

## Decisions made

- A sixth skill, the fifth companion, named `metacoding-retro`.
- It runs on request, and from the workflow once per task after the last ticket.
- It looks only for mistakes that cost rework or were caught late.
- A lesson must pass the three-part bar.
- Kinds of change, in order of preference: check, fix to an existing rule, new rule, glossary term or decision record, checklist step.
- No file changes without the user's answer to the numbered proposals.
- `[record]` A new rule defaults to `/_meta/coding-standards.md`, not to an agent instruction file such as `CLAUDE.md` or `AGENTS.md`. Recorded in `_meta/architecture-decisions.md` on 2026-11-28.
- The retro never edits an installed metacoding skill.
- No retro log. A skipped proposal may come up again in a later session.
- `metacoding-review` stays unchanged: it already reads the repo's contributor and style docs.
- The new retro is run on this task after the last ticket, as its first real use.

## Terms

- **Retro**: looking back at a finished task to turn its mistakes into lasting changes. Avoid: retrospective, post-mortem.
- **Lesson**: a mistake that passed the retro's bar, together with the change proposed for it. Avoid: finding, learning, takeaway.

## Assumptions

- The records (this spec, the glossary, the decision record, the backlog) are committed on their own first, then one commit per ticket, with a pause for the user's go between the two tickets.
- Three other branches each add a skill (`metacoding-onboard`, `metacoding-spec`, `metacoding-design`). Counts in the docs are changed to what is true on this branch, and the merge settles the final number.
- The durable-specs branch renames "spec" to "task spec". Whichever branch merges second adjusts the wording.
- `src/commands/update.ts` needs no edit, because it builds its required-file list from the skill list. Checked in ticket 1.
- The installed skills in the main checkout's `.claude/skills` are not refreshed from this unmerged branch.

## Test intent

One content test per rule, written first and seen failing, each tied to its heading. Installer behavior is tested through `init` and `update`. The tickets list the cases.

## Tickets

- [x] **1. The retro skill, installed and called by the workflow**
  - Success criteria: the first, second, third and fifth success criteria above.
  - Test intent: `update` adds the skill to an install that lacks it and reports the right count of missing files per vendor; the skill text states each of the seven parts under its own heading; it does not point at `references/` or `assets/`; the Codex metadata has a display name and a default prompt; the Tickets section says to run the retro once after the last ticket, and the Completion Standard names it.
- [ ] **2. A home for standards in the layout**
  - Success criteria: the fourth success criterion above.
  - Test intent: the layout reference lists `/_meta/coding-standards.md` among the document homes and says what it holds; the platform-adaptation reference says to propose the file when the repo has no standards file, and to create it once the user approves. Added on 2026-11-28: the layout reference's rules for decision records and for the glossary each name the retro as a second route.
