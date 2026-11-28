# System Documentation

## Overview

`metacoding` is now a vendor-aware skill-packaging CLI. Its job is to install and sync vendor-specific workflow skills for modern coding agents, not to generate editor-specific instruction files. The same skills can also be installed as a plugin, without the CLI; see Plugin Install below.

The canonical source of truth lives in [`skills/`](../skills), one folder per skill. `metacoding-workflow` is the orchestrator; `metacoding-shape`, `metacoding-tdd`, `metacoding-review`, `metacoding-debug`, `metacoding-design`, and `metacoding-retro` are its companions and also work on their own. The workflow skill says at which step each companion is used. No companion calls another, and none points at a file that only the workflow skill ships. `metacoding-onboard` is run once per repo: it writes the project map, `.metacoding/project.md`, which says where the repo keeps its tracker, specs, glossary and decision records. The agent writes that file; the CLI neither creates nor reads it.

## Runtime Flow

### `metacoding init`

1. Detect the current project name, type, and tech stack.
2. Ask which agent vendor the user wants: Codex, Claude Code, Antigravity, or all supported workspace variants.
3. Generate a project-specific `references/project-context.md` for the workflow skill.
4. Install every packaged skill into the selected vendor's skills folder, or into all three when `all` is selected.
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
├── metacoding-retro/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── metacoding-onboard/
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

A CLI install always adds this file to the workflow skill:

```text
<skills folder>/metacoding-workflow/references/project-context.md
```

That file is generated per project from the answers given at `init`. The workflow skill reads it when it exists. Without it, the skill finds the project's type, tech stack, and test and build commands in the repo, so the skills also work in a plugin install.

## Plugin Install

The repo root is also a plugin for Claude Code, Codex and Antigravity, so each of them can install the skills from this repository without the CLI. Each agent reads the `skills/` folder at the plugin root. No manifest lists the skills, so every folder under `skills/` ships. An agent lists each skill with the plugin's prefix, such as `metacoding:metacoding-shape`.

```text
.claude-plugin/
├── plugin.json        # Claude Code plugin manifest
└── marketplace.json   # makes the repo a Claude Code marketplace; its one entry points at the repo root
plugin.json            # Codex plugin manifest; Codex reads a root manifest only when its `$schema` is an agent-plugins.org one
.agents/plugins/
└── marketplace.json   # makes the repo a Codex marketplace; its one entry points at the repo's git address
.antigravity-plugin/
└── plugin.json        # Antigravity plugin manifest; Antigravity installs from the GitHub address and needs no marketplace
```

Every manifest carries the version of `package.json` and the same description, and a test fails when one differs. Claude Code updates a plugin install when that version changes, not on every commit.

The Codex and Antigravity files follow those agents' documentation and have not been run on a real install.

Check a change to the Claude Code files with:

```bash
claude plugin validate --strict .
claude plugin validate --strict .claude-plugin/plugin.json
claude --plugin-dir . plugin details metacoding
```

The first checks the marketplace file, the second the plugin manifest, and the third lists the skills Claude Code finds.

Antigravity has `agy plugin validate <dir>` for its manifest. Codex's documentation names no validate command; `codex plugin marketplace list` shows whether Codex can read the marketplace.

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
- npm publishing now ships `skills/` instead of `templates/`.
