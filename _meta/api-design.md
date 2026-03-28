# API Design

## CLI Surface

### `metacoding init`

Install the workflow skill into the current repository for a specific coding-agent vendor.

```bash
metacoding init [options]
```

Options:

- `--template <type>`: `general`, `typescript`, `react`, `node`, `javascript`, or `python`
- `--vendor <vendor>`: `codex`, `claude-code`, `antigravity`, or `all`
- `--force`: reinstall without confirmation

Behavior:

- asks for a vendor when `--vendor` is not provided
- installs the correct vendor-specific skill entrypoint and support bundle
- `all` installs all workspace-scoped vendor variants for mixed-agent teams
- renders `references/project-context.md` for the chosen or detected project type
- updates `.gitignore`

### `metacoding update`

Sync or validate the installed workflow skill.

```bash
metacoding update [options]
```

Options:

- `--template <type>`: override the detected project type during sync
- `--vendor <vendor>`: sync or validate one installed vendor, or `all` installed vendors explicitly
- `--backup`: create a backup before updating
- `--force`: overwrite local edits in the installed skill
- `--dry-run`: validate instead of mutating
- `--strict`: require the `.gitignore` exclusion during validation

## Installed Artifact Contract

The CLI considers the install valid when the vendor-specific required files exist.

### Codex

```text
.codex/skills/metacoding-workflow/SKILL.md
.codex/skills/metacoding-workflow/agents/openai.yaml
.codex/skills/metacoding-workflow/references/workflow-rules.md
.codex/skills/metacoding-workflow/references/platform-adaptation.md
.codex/skills/metacoding-workflow/references/project-context.md
.codex/skills/metacoding-workflow/assets/templates/task-entry.md
```

### Claude Code

```text
.claude/agents/metacoding-workflow.md
.claude/metacoding-workflow/SKILL.md
.claude/metacoding-workflow/references/workflow-rules.md
.claude/metacoding-workflow/references/platform-adaptation.md
.claude/metacoding-workflow/references/project-context.md
.claude/metacoding-workflow/assets/templates/task-entry.md
```

### Antigravity

```text
.agents/skills/metacoding-workflow/SKILL.md
.agents/skills/metacoding-workflow/references/workflow-rules.md
.agents/skills/metacoding-workflow/references/platform-adaptation.md
.agents/skills/metacoding-workflow/references/project-context.md
.agents/skills/metacoding-workflow/assets/templates/task-entry.md
```

## Conflict Semantics

During `update`, the installed skill is treated like user-editable content:

- unchanged files are overwritten with the packaged version
- changed files trigger conflict detection
- `--force` overwrites local edits
- interactive updates can keep, replace, or skip each changed file

## Non-Goals

- No editor-specific instruction-file generation
- No custom enforcement DSL
- No dependency on VS Code, Cursor, or other IDE-specific hooks
