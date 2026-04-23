# `metacoding`: Workflow Skill for Coding Agents

[![Version](https://img.shields.io/npm/v/metacoding.svg)](https://www.npmjs.com/package/metacoding)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

`metacoding` packages a cross-agent workflow skill that enforces disciplined delivery for modern coding agents. Instead of generating editor-specific instruction files, it installs vendor-specific skills for Codex, Claude Code, or Antigravity from one shared workflow bundle.

## What It Installs

Running `metacoding init` now asks which coding agent you use:

- `Codex`
- `Claude Code`
- `Antigravity`

You can also pass `--vendor codex`, `--vendor claude-code`, or `--vendor antigravity`.
For mixed-agent teams, you can use `--vendor all` to install all workspace-scoped variants.

The installed entrypoint depends on that choice:

```text
Codex:       .codex/skills/metacoding-workflow/SKILL.md
Claude Code: .claude/agents/metacoding-workflow.md
Antigravity: .agents/skills/metacoding-workflow/SKILL.md
```

The support bundle is installed alongside the entrypoint. The shared content includes:

```text
references/
  project-context.md
  workflow-rules.md
  platform-adaptation.md
  typescript.md
  javascript.md
  node.md
  react.md
  python.md
assets/templates/
  task-entry.md
  test-plan.md
  repeated-task-checklist.md
  changelog-entry.md
  project-context.md
```

For Codex, the project install looks like:

```text
.codex/skills/metacoding-workflow/
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── project-context.md
│   ├── workflow-rules.md
│   ├── platform-adaptation.md
│   ├── typescript.md
│   ├── javascript.md
│   ├── node.md
│   ├── react.md
│   └── python.md
└── assets/templates/
    ├── task-entry.md
    ├── test-plan.md
    ├── repeated-task-checklist.md
    ├── changelog-entry.md
    └── project-context.md
```

The installed skill preserves the original `metacoding` workflow intent:

1. Ground in the repo before asking questions.
2. Capture scope before changing code.
3. Define test intent before implementation.
4. Execute one bounded task at a time.
5. Verify with tests and direct checks.
6. Update docs or status artifacts that materially changed.
7. Close with a VCS handoff or completion confirmation.

## Enforced Workflow

The `metacoding-workflow` skill applies a strict operating contract for development tasks. It does not only provide prompts; it enforces an execution order and completion gates:

1. Repository grounding before planning.
2. Scope capture with success criteria and non-goals.
3. Mandatory TDD sequence.
4. Single-task execution with scope control.
5. Verification through targeted checks.
6. MECE artifact updates.
7. Explicit closure with handoff or VCS action.

### Mandatory TDD Sequence

For testable changes, the enforced order is:

1. Define and document test intent before implementation.
2. Write or identify a failing test first.
3. Implement the minimum production code to pass.
4. Refactor only after the failing-to-passing loop is complete.

### Scope and Task-Switching Rules

The skill keeps work bounded to one active task:

- Unrelated requests are queued for later.
- Related blockers are treated as subtasks only when required to finish the active task.
- Opportunistic refactors and mixed-scope edits are rejected during active implementation.

### Documentation Ownership Rules

The workflow follows MECE documentation ownership to avoid duplication:

- System documentation stays evergreen and factual.
- Task/status artifacts track temporal progress.
- Test artifacts focus on test intent and result status.
- Only the artifact that owns a concept is updated.

### Completion Criteria

A task is considered complete only when all of the following are true:

- Implemented behavior matches the agreed scope.
- Mandatory TDD was followed, or an explicit exception was recorded.
- Relevant checks were run, or an explicit limitation was recorded.
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

- `update` syncs the installed skill with the packaged version.
- `update --vendor <vendor>` syncs or validates only one installed vendor variant.
- `update --vendor all` syncs or validates all installed vendor variants explicitly.
- `update --dry-run` validates the installed skill without changing files.
- `update --force` overwrites local edits inside the installed skill directory.

## Using the Skill

After installation, point your coding agent at the installed vendor entrypoint or ask it to use the `metacoding-workflow` skill/subagent for the next task.

The skill will:

- inspect the repo before asking clarifying questions
- keep work scoped to one bounded task
- push test intent ahead of production edits
- fall back to bundled templates when the repo lacks workflow artifacts
- produce a commit-ready handoff when git actions are unavailable or out of scope

## Migration Note

This package no longer treats GitHub Copilot or Cursor instruction files as the primary product. The canonical content lives under `skills/metacoding-workflow/`, and the CLI now renders vendor-specific installs for Codex, Claude Code, or Antigravity from that shared bundle.

## Development

```bash
npm test
npm run build
```

## License

MIT