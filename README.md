# `metacoding`: Workflow Skill for Coding Agents

[![Version](https://img.shields.io/npm/v/metacoding.svg)](https://www.npmjs.com/package/metacoding)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

`metacoding` packages a cross-agent workflow skill that enforces disciplined delivery for modern coding agents. Instead of generating editor-specific instruction files, it installs vendor-specific skills for Codex, Claude Code, or Antigravity from one shared set of skills.

## What It Installs

Running `metacoding init` asks which coding agent you use:

- `Codex`
- `Claude Code`
- `Antigravity`

You can also pass `--vendor codex`, `--vendor claude-code`, or `--vendor antigravity`.
For mixed-agent teams, you can use `--vendor all` to install all workspace-scoped variants.

It installs these skills into that agent's skills folder:

```text
Codex:       .codex/skills/
Claude Code: .claude/skills/
Antigravity: .agents/skills/
```

| Skill | Role |
| --- | --- |
| `metacoding-workflow` | The orchestrator. Takes one task from request to handoff and calls `metacoding-shape`, `metacoding-tdd`, `metacoding-review`, `metacoding-debug` and `metacoding-design` at the right step |
| `metacoding-shape` | Settles open decisions with you and ends in a confirmed scope summary |
| `metacoding-tdd` | Builds the change test-first, one behavior at a time |
| `metacoding-review` | Checks the finished change against the agreed scope and the repo's standards |
| `metacoding-debug` | Finds the cause of a bug, starting from a command that reproduces it |
| `metacoding-design` | Decides the shape of code: module depth, interfaces, and seams |
| `metacoding-onboard` | Run once per repo. Records where the repo keeps its tracker, specs, glossary and decision records in a project map, `.metacoding/project.md` |

Each companion skill also works on its own, so you can ask for only an interview, only a review, or only a diagnosis.

For Codex, the project install looks like:

```text
.codex/skills/
├── metacoding-workflow/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── references/
│   │   ├── project-context.md
│   │   ├── workflow-rules.md
│   │   ├── repository-organization.md
│   │   └── platform-adaptation.md
│   └── assets/templates/
│       ├── task-entry.md
│       ├── repeated-task-checklist.md
│       ├── changelog-entry.md
│       └── project-context.md
├── metacoding-shape/
│   ├── SKILL.md
│   └── agents/openai.yaml
├── metacoding-tdd/
│   ├── SKILL.md
│   └── agents/openai.yaml
├── metacoding-review/
│   ├── SKILL.md
│   └── agents/openai.yaml
├── metacoding-debug/
│   ├── SKILL.md
│   └── agents/openai.yaml
├── metacoding-design/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── metacoding-onboard/
    ├── SKILL.md
    └── agents/openai.yaml
```

Claude Code and Antigravity get the same folders without the Codex-only `agents/openai.yaml` files.

The workflow skill runs these steps in order:

1. Ground in the repo and look up facts before asking questions.
2. Shape the task: interview the user on open decisions and confirm scope before changing code (`metacoding-shape`).
3. Build test-first (`metacoding-tdd`, or `metacoding-debug` for a bug with an unknown cause).
4. Verify with tests and direct checks.
5. Review the diff against the scope and the repo's standards (`metacoding-review`).
6. Update the docs that materially changed, and amend a decision record the build proved wrong.
7. Close with a commit or a handoff, and say explicitly that the work is complete.

Steps 3 to 7 run once per ticket. Each ticket is ticked off and closed on its own, and the workflow reports and waits for your go before the next. When the workflow commits, the records that shaping writes are committed on their own before the first ticket, so a ticket's commit holds only that ticket's work. When a new session is asked to continue a task whose spec is still in progress, it starts at the first ticket not yet done, without shaping the task again.

## Enforced Workflow

The `metacoding-workflow` skill applies a strict operating contract for development tasks. It does not only provide prompts; it enforces an execution order and completion gates:

1. Repository grounding before planning.
2. Shaping: a scope interview that ends in a confirmed scope summary.
3. Mandatory TDD sequence.
4. Verification through targeted checks.
5. Review against scope and standards.
6. MECE artifact updates.
7. Explicit closure with handoff or VCS action.

The task stays bounded throughout: one active task, built one ticket at a time.

### Shaping

Before any file changes, `metacoding-shape` interviews you about the task:

- It looks up facts itself (code, config, tests, docs, git history) and asks you only for decisions.
- It asks in rounds of numbered questions, each with a recommended answer, so you can reply with "1 yes, 2 yes, 3 the second option".
- Each round's answers decide which questions come next.
- It describes the solution and slices it into tickets. Each ticket is a vertical slice that can be built, verified, reviewed, and committed on its own, with its own success criteria and test intent. A small task stays one ticket.
- It closes with a scope summary (goal, success criteria, in and out of scope, solution, decisions, terms, assumptions, test intent, tickets) and waits for your confirmation.
- Nothing is written before you confirm. Once you do, it writes the settled terms to the glossary and the marked decisions to the decision records. A task with more than one ticket, or with a decision worth recording, is also written up as a spec; a smaller task gets none.
- While a spec is in progress, a change to what it agreed is put to you as a decision and written into the spec, with its date, before it is built.

If you tell it to proceed without questions, it lists the unasked decisions as assumptions in the scope summary and continues; your instruction counts as the confirmation.

### Mandatory TDD Sequence

For testable changes, `metacoding-tdd` enforces this order:

1. List the behaviors the change must prove, starting from the test intent of the ticket being built, or of the scope summary for a one-ticket task.
2. Take one behavior: write its test and watch it fail.
3. Implement the minimum production code to pass.
4. Move to the next behavior. Refactor only after the listed behaviors are green.

Tests go through public interfaces, and expected values come from a source other than the code under test. Test doubles replace only what is outside your control, such as the network or the clock; the skill prefers a real or in-memory stand-in to a mock that checks calls, and shows a good and a bad example.

### Review

Before closing, `metacoding-review` checks the diff on two separate axes:

- **Scope:** anything missing, extra, wrong, or unproven compared with the agreed scope: the ticket's success criteria and test intent, or the scope summary of a one-ticket task.
- **Standards:** breaks with the repo's documented rules, departures from neighboring code, and leftovers such as debug output. Where the repo's own standards say nothing, it also checks a fixed list of code smells, and reports those to you as follow-ups instead of fixing them.

Where the agent supports subagents, each axis is reviewed in a fresh context that sees only the diff and what that axis compares it with.

For the last ticket of a task with several, the scope axis runs once more on the whole change against the spec, because tickets can each pass while the task's goal is still missed. The spec is then marked done.

### Code Design

`metacoding-design` decides the shape of code. The workflow uses it in two places: while shaping, when the solution adds a module or changes an interface, and while building, when the interface to test through is unclear or the code is restructured after the tests are green.

- It uses four terms with fixed meanings: module, interface, depth, and seam.
- It prefers a deep module, one with a lot of behavior behind a small interface, and counts everything a caller must know as the interface.
- It puts a seam, a place where one part can be swapped for another, only where something varies or is outside your control, and it tests through the interface.
- For an interface that will be hard to change, it sketches two or three shapes and puts the choice to you with a recommendation.

Three of its seven rules come with a good and a bad example. The examples are pseudocode, and the rules name no language.

### Debugging

For a bug with an unknown cause, `metacoding-debug` replaces the build step. It builds one command that reproduces the bug, minimizes it, tests ranked hypotheses one at a time, and fixes the cause with a regression test. It keeps a raw capture from a real system out of the repo, and masks credentials and personal data in whatever it shows, writes into the repo, or commits.

### Onboarding

`metacoding-onboard` is run once per repo, not once per task. It records where the repo keeps its tracker, specs, glossary and decision records, so that later sessions read the answer instead of working it out again:

- It looks at what the repo already has, then asks you one round of numbered questions with a recommended place for each.
- Once you confirm, it writes the answers to the project map, `.metacoding/project.md`, a file you commit with the repo.
- It records the places and creates none of them. A glossary or a specs folder that does not exist yet is created when a task first needs it.
- If you agree, it adds one line that points to the project map in the instruction file your agent loads at every start, such as `CLAUDE.md` or `AGENTS.md`. It adds the line only to a file the repo already has.
- It closes by telling you how to work from here: what it wrote, how to start a task, and what each installed metacoding skill is for.
- Run it again when a place moves: it shows the current project map and asks what changed.

The workflow reads the project map while grounding, and `metacoding-shape` reads it before its first round. In a repo with no project map, the workflow says so in one line and carries on.

### Scope and Task-Switching Rules

The skill keeps work bounded to one active task:

- When you ask for something unrelated mid-task, the workflow says what is unfinished and you decide: queue the request, or pause the task at a ticket boundary and switch. If you want the switch at once, it sets the unfinished work aside and notes what is left.
- Related blockers are treated as subtasks only when required to finish the active task.
- Opportunistic refactors and mixed-scope edits are rejected during active implementation.

### Documentation Ownership Rules

The workflow follows MECE documentation ownership to avoid duplication:

- System documentation stays evergreen and factual.
- Only the artifact that owns a concept is updated.

It keeps three kinds of document that make the next session better informed:

- **Glossary** (`/_meta/glossary.md`): the project's own terms, one line each. The agent reads it while grounding. A term settled during shaping is listed in the scope summary and written once you confirm it.
- **Decision records** (`/_meta/architecture-decisions.md`): written only for a decision that is hard to reverse, surprising without context, and a real trade-off. The scope summary marks them with `[record]`, and they are written once you confirm it, before the build. If the build proves one wrong, the entry is amended.
- **Specs** (`/_meta/specs/<date>-<slug>.md`): the confirmed scope summary of a task with more than one ticket or a decision marked `[record]`. The tickets are a checklist in the spec unless the repo has a tracker, and a finished spec stays as the record of what was agreed.

These are the default places. Where the project map names a place, that place is used instead. For a place it has no line for, and in a repo with no project map, a repo that already keeps specs keeps its own place for them, and one that keeps a tracker current gets the tickets there. The workflow does not create a test documentation file: test intent lives in the scope summary, the spec, and the tests. A repo that already keeps one gets it updated as before.

### Completion Criteria

A task is considered complete only when all of the following are true:

- Implemented behavior matches the agreed scope.
- Mandatory TDD was followed, or an explicit exception was recorded.
- Relevant checks were run, or an explicit limitation was recorded.
- Review findings were fixed, accepted, or listed as follow-ups.
- Changed artifacts were updated, or a conscious deferral was documented.
- Every ticket is closed and, when the task has a spec, the spec is marked done.
- The handoff includes outcome, verification status, and remaining risks.

## CLI

### Install

```bash
npm install -g metacoding
cd your-project
metacoding init
```

`init` remains interactive for project metadata such as project name, description, and tech stack. Use `--vendor` and `--template` to preselect those parts of the setup flow.

Common options:

- `metacoding init --vendor codex`
- `metacoding init --vendor claude-code`
- `metacoding init --vendor antigravity`
- `metacoding init --vendor all`
- `metacoding init --template react`
- `metacoding init --template typescript`
- `metacoding init --template node`
- `metacoding init --template javascript`
- `metacoding init --template python`
- `metacoding init --force`

### Sync or Validate

```bash
metacoding update
metacoding update --dry-run
metacoding update --dry-run --strict
metacoding update --force
```

- `update` syncs the installed skills with the packaged version, and adds any packaged skill the install lacks. It also removes files that an earlier version installed and this one no longer ships, after backing them up; files you added are kept.
- `update` keeps the project name, description, tech stack and project type you entered at `init`. `update --template <type>` changes the project type.
- `update --vendor <vendor>` syncs or validates only one installed vendor variant.
- `update --vendor all` syncs or validates all installed vendor variants explicitly.
- `update --dry-run` validates the installed skills without changing files.
- `update --dry-run --strict` also fails when `.gitignore` lacks a metacoding exclusion pattern. The error names the missing patterns for you to add; `update` does not add a metacoding section to a `.gitignore` that has none.
- `update --force` overwrites local edits inside the installed skill directories.

## Using the Skill

After installation, ask your coding agent to run the `metacoding-onboard` skill once. Then point it at the installed vendor entrypoint or ask it to use the `metacoding-workflow` skill for the next task. In Claude Code you can also type `/metacoding-workflow`, or a companion skill such as `/metacoding-shape` or `/metacoding-review` when you want only that step.

The workflow skill will:

- inspect the repo, then interview you on the open decisions with a recommended answer for each
- wait for you to confirm the scope summary before changing files
- keep work scoped to one bounded task
- build test-first, one behavior at a time
- build a task with several tickets one ticket at a time, and wait for your go between tickets
- review the diff against the agreed scope before closing
- read the project glossary and decision records, and keep them current
- write a spec for a task with more than one ticket or a decision marked `[record]`
- produce a commit-ready handoff when git actions are unavailable or out of scope

## Migration Notes

### Claude Code: subagent to skill

Versions up to 2.0.1 installed the Claude Code variant as a subagent (`.claude/agents/metacoding-workflow.md` plus `.claude/metacoding-workflow/`). A subagent reports back to the main conversation and cannot question you directly, so the scope interview could not run as intended. The variant is now a regular skill under `.claude/skills/metacoding-workflow/`, which runs in the main conversation.

Run `metacoding update` in a project with the old layout to migrate it. The update backs up the old files to `.backup/`, installs the skill, and removes the subagent files.

### Editor instruction files

This package no longer treats GitHub Copilot or Cursor instruction files as the primary product. The canonical content lives under `skills/`, one folder per skill, and the CLI now renders vendor-specific installs for Codex, Claude Code, or Antigravity from those shared skills.

## Development

```bash
npm test
npm run build
```

## License

MIT