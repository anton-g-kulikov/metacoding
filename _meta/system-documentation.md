# System Documentation

## Overview

`metacoding` is now a vendor-aware skill-packaging CLI. Its job is to install and sync vendor-specific workflow skills for modern coding agents, not to generate editor-specific instruction files.

The canonical source of truth lives in [`skills/`](../skills), one folder per skill. `metacoding-workflow` is the orchestrator; `metacoding-shape`, `metacoding-tdd`, `metacoding-review`, and `metacoding-debug` are its companions and also work on their own.

## Runtime Flow

### `metacoding init`

1. Detect the current project name, type, and tech stack.
2. Ask which agent vendor the user wants: Codex, Claude Code, Antigravity, or all supported workspace variants.
3. Generate a project-specific `references/project-context.md` for the workflow skill.
4. Install all five skills into the selected vendor's skills folder, or into all three when `all` is selected.
5. Update `.gitignore` so installed skill artifacts and backups stay out of version control. An existing metacoding section only gains the patterns it lacks.

### `metacoding update`

1. Validate that the skills are already installed.
2. Detect installed vendor variants, or target one explicit vendor with `--vendor`.
3. Optionally back up the installed skill folders into `.backup/<timestamp>/`.
4. Rebuild the packaged file set. The project name, description, tech stack and project type come from the installed `references/project-context.md` of each vendor, or from the one in the 2.0.x Claude Code bundle when that layout is being migrated; a name, tech stack or project type it lacks comes from project detection, a missing description gets the default, and `--template` overrides the project type.
5. Detect local edits inside the installed skills.
6. Resolve conflicts interactively or overwrite them with `--force`.
7. Sync the installed skills to the packaged version, adding any packaged skill the install lacks.
8. Remove the files an earlier version installed and this one no longer ships, once they are backed up, and a skill folder they leave empty. The list names single files and is fixed in `src/services/skill-manager.ts`, so files the user added are never touched.
9. For Claude Code, migrate the 2.0.x subagent layout: remove `.claude/agents/metacoding-workflow.md` and `.claude/metacoding-workflow/` once they are backed up.
10. Add the exclusion patterns that an existing metacoding `.gitignore` section lacks.

`metacoding update --dry-run` changes nothing. It checks the required files listed in [`api-design.md`](api-design.md) and fails when only the old Claude Code layout is present. With `--strict` it also fails when `.gitignore` lacks a metacoding exclusion pattern.

## Packaged Skill Structure

```text
skills/
├── metacoding-workflow/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── references/
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

## Installed Vendor Layouts

Each vendor gets one folder per skill inside its skills folder:

```text
Codex:       .codex/skills/metacoding-*/
Claude Code: .claude/skills/metacoding-*/
Antigravity: .agents/skills/metacoding-*/
```

Only the Codex install includes the `agents/openai.yaml` files.

The installed workflow skill always adds:

```text
<skills folder>/metacoding-workflow/references/project-context.md
```

That file is generated per project and points the agent to the right language references.

## Core Services

- `src/services/skill-manager.ts`
  - Holds the list of packaged skills and reads them from `skills/`.
  - Renders vendor-specific install layouts.
  - Generates project-specific installation files, and reads the init answers back from an installed project context.
  - Holds the default description and the default test framework and build tool per project type.
  - Installs and enumerates vendor installs.
  - Detects and removes the 2.0.x Claude Code subagent layout.
  - Lists and removes the files an earlier version installed and this one no longer ships.
- `src/services/project-detector.ts`
  - Detects project type and tech stack using lightweight repo heuristics.
- `src/services/gitignore-manager.ts`
  - Appends a metacoding section to `.gitignore`, or fills in the patterns an existing section lacks.
  - Lists the exclusion patterns a `.gitignore` lacks, for strict validation.
- `src/services/backup.ts`
  - Creates timestamped backups and prunes old ones.
- `src/services/conflict-resolution.ts`
  - Detects local edits and resolves update conflicts.

## Migration Notes

- `.github/copilot-instructions.md` and Cursor rule generation are no longer part of the active product.
- The old `templates/` directory is retained only as historical migration input, not as the packaged distribution surface.
- npm publishing now ships `skills/` instead of `templates/`.
