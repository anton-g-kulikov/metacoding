# System Documentation

## Overview

`metacoding` is now a vendor-aware skill-packaging CLI. Its job is to install and sync vendor-specific workflow skills for modern coding agents, not to generate editor-specific instruction files.

The canonical source of truth lives in [`skills/metacoding-workflow`](/Users/antonkulikov/Projects/metacoding/skills/metacoding-workflow).

## Runtime Flow

### `metacoding init`

1. Detect the current project name, type, and tech stack.
2. Ask which agent vendor the user wants: Codex, Claude Code, Antigravity, or all supported workspace variants.
3. Generate a project-specific `references/project-context.md`.
4. Install the selected vendor-specific entrypoint plus the shared support bundle, or all three variants when `all` is selected.
5. Update `.gitignore` so installed skill artifacts and backups stay out of version control.

### `metacoding update`

1. Validate that the skill is already installed.
2. Detect installed vendor variants, or target one explicit vendor with `--vendor`.
3. Optionally back up the installed vendor files into `.backup/<timestamp>/`.
4. Rebuild the packaged file set for the current project context.
5. Detect local edits inside the installed vendor skill.
6. Resolve conflicts interactively or overwrite them with `--force`.
7. Sync the installed vendor skill to the packaged version.

## Packaged Skill Structure

```text
skills/metacoding-workflow/
├── SKILL.md
├── agents/openai.yaml
├── references/
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

## Installed Vendor Layouts

### Codex

```text
.codex/skills/metacoding-workflow/
```

### Claude Code

```text
.claude/agents/metacoding-workflow.md
.claude/metacoding-workflow/
```

### Antigravity

```text
.agents/skills/metacoding-workflow/
```

The installed copy always adds:

```text
.codex/skills/metacoding-workflow/references/project-context.md
```

That file is generated per project and points the agent to the right language references.

## Core Services

- `src/services/skill-manager.ts`
  - Reads the packaged workflow bundle.
  - Renders vendor-specific install layouts.
  - Generates project-specific installation files.
  - Installs and enumerates vendor installs.
- `src/services/project-detector.ts`
  - Detects project type and tech stack using lightweight repo heuristics.
- `src/services/gitignore-manager.ts`
  - Appends a metacoding section to `.gitignore`.
- `src/services/backup.ts`
  - Creates timestamped backups and prunes old ones.
- `src/services/conflict-resolution.ts`
  - Detects local edits and resolves update conflicts.

## Migration Notes

- `.github/copilot-instructions.md` and Cursor rule generation are no longer part of the active product.
- The old `templates/` directory is retained only as historical migration input, not as the packaged distribution surface.
- npm publishing now ships `skills/` instead of `templates/`.
