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

It installs five skills into that agent's skills folder:

```text
Codex:       .codex/skills/
Claude Code: .claude/skills/
Antigravity: .agents/skills/
```

| Skill | Role |
| --- | --- |
| `metacoding-workflow` | The orchestrator. Takes one task from request to handoff and calls the other four at the right step |
| `metacoding-shape` | Settles open decisions with you and ends in a confirmed scope summary |
| `metacoding-tdd` | Builds the change test-first, one behavior at a time |
| `metacoding-review` | Checks the finished change against the agreed scope and the repo's standards |
| `metacoding-debug` | Finds the cause of a bug, starting from a command that reproduces it |

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
│   │   ├── platform-adaptation.md
│   │   ├── typescript.md
│   │   ├── javascript.md
│   │   ├── node.md
│   │   ├── react.md
│   │   └── python.md
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
└── metacoding-debug/
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
6. Update the docs that materially changed, and write the decision records the scope summary marked.
7. Close with a VCS handoff or completion confirmation.

## Enforced Workflow

The `metacoding-workflow` skill applies a strict operating contract for development tasks. It does not only provide prompts; it enforces an execution order and completion gates:

1. Repository grounding before planning.
2. Shaping: a scope interview that ends in a confirmed scope summary.
3. Mandatory TDD sequence.
4. Verification through targeted checks.
5. Review against scope and standards.
6. MECE artifact updates.
7. Explicit closure with handoff or VCS action.

The task stays bounded throughout: one active task, with unrelated requests queued.

### Shaping

Before any file changes, `metacoding-shape` interviews you about the task:

- It looks up facts itself (code, config, tests, docs, git history) and asks you only for decisions.
- It asks in rounds of numbered questions, each with a recommended answer, so you can reply with "1 yes, 2 yes, 3 the second option".
- Each round's answers decide which questions come next.
- It describes the solution and slices it into tickets. Each ticket is a vertical slice that can be built, verified, reviewed, and committed on its own, with its own success criteria and test intent. A small task stays one ticket.
- It closes with a scope summary (goal, success criteria, in and out of scope, solution, decisions, assumptions, test intent, tickets) and waits for your confirmation.

If you tell it to proceed without questions, it lists the unasked decisions as assumptions in the scope summary and continues.

### Mandatory TDD Sequence

For testable changes, `metacoding-tdd` enforces this order:

1. List the behaviors the change must prove, starting from the test intent in the scope summary.
2. Take one behavior: write its test and watch it fail.
3. Implement the minimum production code to pass.
4. Move to the next behavior. Refactor only after the listed behaviors are green.

Tests go through public interfaces, and expected values come from a source other than the code under test.

### Review

Before closing, `metacoding-review` checks the diff on two separate axes:

- **Scope:** anything missing, extra, wrong, or unproven compared with the confirmed scope summary.
- **Standards:** breaks with the repo's documented rules, departures from neighbouring code, and leftovers such as debug output.

Where the agent supports subagents, each axis is reviewed in a fresh context that sees only the diff and what that axis compares it with.

### Debugging

For a bug with an unknown cause, `metacoding-debug` replaces the build step. It builds one command that reproduces the bug, minimizes it, tests ranked hypotheses one at a time, and fixes the cause with a regression test.

### Scope and Task-Switching Rules

The skill keeps work bounded to one active task:

- Unrelated requests are queued for later.
- Related blockers are treated as subtasks only when required to finish the active task.
- Opportunistic refactors and mixed-scope edits are rejected during active implementation.

### Documentation Ownership Rules

The workflow follows MECE documentation ownership to avoid duplication:

- System documentation stays evergreen and factual.
- Only the artifact that owns a concept is updated.

It keeps two documents that make the next session better informed:

- **Glossary** (`/_meta/glossary.md`): the project's own terms, one line each. The agent reads it while grounding, and the interview adds a term when its meaning is settled.
- **Decision records** (`/_meta/architecture-decisions.md`): written only for a decision that is hard to reverse, surprising without context, and a real trade-off. The scope summary marks them with `[record]`, so confirming the summary approves writing them.

It does not create a task list or a test documentation file. Task status and test intent live in the confirmed scope summary, the issue or pull request, the tests, and version control. A repo that already keeps either file gets it updated as before.

### Completion Criteria

A task is considered complete only when all of the following are true:

- Implemented behavior matches the agreed scope.
- Mandatory TDD was followed, or an explicit exception was recorded.
- Relevant checks were run, or an explicit limitation was recorded.
- Review findings were fixed, accepted, or listed as follow-ups.
- Changed artifacts were updated, or a conscious deferral was documented.
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

- `update` syncs the installed skills with the packaged version, and adds any packaged skill the install lacks.
- `update --vendor <vendor>` syncs or validates only one installed vendor variant.
- `update --vendor all` syncs or validates all installed vendor variants explicitly.
- `update --dry-run` validates the installed skills without changing files.
- `update --force` overwrites local edits inside the installed skill directories.

## Using the Skill

After installation, point your coding agent at the installed vendor entrypoint or ask it to use the `metacoding-workflow` skill for the next task. In Claude Code you can also type `/metacoding-workflow`, or a companion skill such as `/metacoding-shape` or `/metacoding-review` when you want only that step.

The skill will:

- inspect the repo, then interview you on the open decisions with a recommended answer for each
- wait for you to confirm the scope summary before changing files
- keep work scoped to one bounded task
- build test-first, one behavior at a time
- review the diff against the agreed scope before closing
- read the project glossary and decision records, and keep them current
- work with the task and test records the repo already has, without creating new ones
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