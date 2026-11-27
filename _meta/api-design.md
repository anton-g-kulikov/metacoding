# API Design

## CLI Surface

### `metacoding init`

Install the workflow skill and its four companion skills into the current repository for a specific coding-agent vendor.

```bash
metacoding init [options]
```

Options:

- `--template <type>`: `general`, `typescript`, `react`, `node`, `javascript`, or `python`
- `--vendor <vendor>`: `codex`, `claude-code`, `antigravity`, or `all`
- `--force`: reinstall without confirmation

Behavior:

- asks for a vendor when `--vendor` is not provided
- installs all five skills into the vendor's skills folder
- `all` installs all workspace-scoped vendor variants for mixed-agent teams
- renders `references/project-context.md` for the chosen or detected project type
- adds the metacoding section to `.gitignore`, or fills in the patterns an existing section lacks

### `metacoding update`

Sync or validate the installed skills.

```bash
metacoding update [options]
```

Options:

- `--template <type>`: override the detected project type during sync
- `--vendor <vendor>`: sync or validate one installed vendor, or `all` installed vendors explicitly
- `--backup`: create a backup before updating
- `--force`: overwrite local edits in the installed skills
- `--dry-run`: validate instead of mutating
- `--strict`: with `--dry-run`, also require every metacoding exclusion pattern in `.gitignore`, and name the ones that are missing

Behavior:

- adds any packaged skill the install lacks
- migrates the 2.0.x Claude Code subagent layout to the skill layout, removing the old files once they are backed up
- removes the files an earlier version installed and this one no longer ships, once they are backed up, and a skill folder they leave empty
- fills in the patterns an existing metacoding `.gitignore` section lacks
- `--dry-run` fails with a migration hint when only the old Claude Code layout is present

## Installed Artifact Contract

The CLI considers the install valid when the vendor-specific required files exist: a fixed set in the workflow skill, plus the `SKILL.md` of each companion skill and, for Codex, the `agents/openai.yaml` of every skill.

### Codex

```text
.codex/skills/metacoding-workflow/SKILL.md
.codex/skills/metacoding-workflow/agents/openai.yaml
.codex/skills/metacoding-workflow/references/workflow-rules.md
.codex/skills/metacoding-workflow/references/platform-adaptation.md
.codex/skills/metacoding-workflow/references/project-context.md
.codex/skills/metacoding-workflow/assets/templates/task-entry.md
.codex/skills/metacoding-shape/SKILL.md
.codex/skills/metacoding-shape/agents/openai.yaml
.codex/skills/metacoding-tdd/SKILL.md
.codex/skills/metacoding-tdd/agents/openai.yaml
.codex/skills/metacoding-review/SKILL.md
.codex/skills/metacoding-review/agents/openai.yaml
.codex/skills/metacoding-debug/SKILL.md
.codex/skills/metacoding-debug/agents/openai.yaml
```

For Codex, each skill's `agents/openai.yaml` must also define `interface.display_name` and `interface.default_prompt`.

### Claude Code

```text
.claude/skills/metacoding-workflow/SKILL.md
.claude/skills/metacoding-workflow/references/workflow-rules.md
.claude/skills/metacoding-workflow/references/platform-adaptation.md
.claude/skills/metacoding-workflow/references/project-context.md
.claude/skills/metacoding-workflow/assets/templates/task-entry.md
.claude/skills/metacoding-shape/SKILL.md
.claude/skills/metacoding-tdd/SKILL.md
.claude/skills/metacoding-review/SKILL.md
.claude/skills/metacoding-debug/SKILL.md
```

### Antigravity

```text
.agents/skills/metacoding-workflow/SKILL.md
.agents/skills/metacoding-workflow/references/workflow-rules.md
.agents/skills/metacoding-workflow/references/platform-adaptation.md
.agents/skills/metacoding-workflow/references/project-context.md
.agents/skills/metacoding-workflow/assets/templates/task-entry.md
.agents/skills/metacoding-shape/SKILL.md
.agents/skills/metacoding-tdd/SKILL.md
.agents/skills/metacoding-review/SKILL.md
.agents/skills/metacoding-debug/SKILL.md
```

## Conflict Semantics

During `update`, the installed skills are treated like user-editable content:

- unchanged files are overwritten with the packaged version
- changed files trigger conflict detection
- `--force` overwrites local edits
- interactive updates can keep, replace, or skip each changed file

## Non-Goals

- No editor-specific instruction-file generation
- No custom enforcement DSL
- No dependency on VS Code, Cursor, or other IDE-specific hooks
