# metacoding CLI API Reference

## Overview

The `metacoding` CLI provides commands for setting up and maintaining guided development workflows. This reference documents all user-facing commands, options, and configuration patterns.

For system architecture and implementation details, see [`system-documentation.md`](./system-documentation.md).

## Global Installation

```bash
# Install metacoding CLI globally
npm install -g metacoding

# Verify installation
metacoding --version
```

## Command Reference

### `metacoding init`

Initialize metacoding in the current project with interactive setup.

#### Syntax

```bash
metacoding init [options]
```

#### Options

| Option              | Alias | Type    | Default   | Description                                                 |
| ------------------- | ----- | ------- | --------- | ----------------------------------------------------------- |
| `--template <type>` | `-t`  | string  | `general` | Project template (general, react, node, python, typescript) |
| `--force`           | `-f`  | boolean | `false`   | Overwrite existing files without confirmation               |
| `--skip-vscode`     |       | boolean | `false`   | Skip VS Code settings configuration                         |
| `--skip-git`        |       | boolean | `false`   | Skip Git repository initialization check                    |
| `--vscode`          |       | boolean | `false`   | Set up VS Code + GitHub Copilot configuration               |
| `--cursor`          |       | boolean | `false`   | Set up Cursor IDE configuration                             |

#### Interactive Prompts

When no IDE option is specified (`--vscode` or `--cursor`), the command prompts for:

1. **AI Assistant Choice**: Choose between VS Code + GitHub Copilot or Cursor IDE
2. **Project Name**: Defaults to current directory name
3. **Project Description**: Defaults to template-specific description
4. **Project Type**: Selects appropriate template if not specified with `--template`
5. **Tech Stack**: Technology stack configuration (comma-separated)
6. **Testing Features**: Enable test automation features
7. **Release Management**: Enable release management workflow
8. **Overwrite Confirmation**: If existing metacoding files detected

#### Examples

```bash
# Interactive setup with AI assistant choice
metacoding init

# Quick VS Code + GitHub Copilot setup
metacoding init --vscode

# Quick Cursor IDE setup
metacoding init --cursor

# Specific template with Cursor IDE
metacoding init --template react --cursor

# Force overwrite existing setup
metacoding init --force --vscode

# Non-interactive with specific template
metacoding init --template python --cursor --force
```

#### Output Files

**VS Code + GitHub Copilot Setup:**

```
.github/
├── copilot-instructions.md
└── instructions/
    ├── code-review.instructions.md
    ├── docs-update.instructions.md
    ├── release.instructions.md
    └── test-runner.instructions.md

.vscode/
└── settings.json
```

**Cursor IDE Setup:**

```
workflow.cursorrules

.cursor/
└── rules/
    ├── code-review.mdc
    ├── docs-update.mdc
    ├── release.mdc
    └── test-runner.mdc
```

#### Exit Codes

- `0`: Success
- `1`: General error (invalid arguments, file system errors)
- `2`: User cancellation (Ctrl+C or declined overwrite)
- `3`: Template not found
- `4`: Git repository issues

---

### `metacoding update`

Update existing metacoding setup or validate current configuration.

#### Syntax

```bash
metacoding update [options]
```

#### Options

| Option           | Alias | Type    | Default | Description                                  |
| ---------------- | ----- | ------- | ------- | -------------------------------------------- |
| `--template <n>` | `-t`  | string  | `auto`  | Update to specific template                  |
| `--backup`       | `-b`  | boolean | `true`  | Create backup before updating                |
| `--force`        | `-f`  | boolean | `false` | Force update without confirmation            |
| `--dry-run`      | `-d`  | boolean | `false` | Validate setup without making changes        |
| `--strict`       | `-s`  | boolean | `false` | Use strict validation rules (with --dry-run) |

#### Update Process

1. **Backup Creation**: Create timestamped backup in `.backup/` directory
2. **Setup Detection**: Identify current IDE configuration (VS Code or Cursor)
3. **Template Analysis**: Determine current template type
4. **Conflict Resolution**: Handle modified instruction files with user prompts
5. **File Updates**: Update instruction files to latest template versions
6. **Validation**: Verify setup completeness after update

#### Validation Mode (--dry-run)

Performs comprehensive validation without making changes:

- **Setup Detection**: Verify metacoding is properly initialized
- **File Structure**: Check expected files exist and are readable
- **Template Compliance**: Validate current setup matches template requirements
- **IDE Configuration**: Verify AI assistant configuration

Use `--strict` with `--dry-run` for enhanced validation:

- Stricter file format validation
- Additional compliance checks
- More detailed error reporting

#### Examples

```bash
# Standard update with backup
metacoding update

# Force update without prompts
metacoding update --force

# Update to specific template
metacoding update --template react

# Validate current setup
metacoding update --dry-run

# Strict validation
metacoding update --dry-run --strict

# Update without backup
metacoding update --backup false
```

#### Exit Codes

- `0`: Update successful / Validation passed
- `1`: Update failed / Validation failed
- `2`: User cancelled update
- `3`: No updates available / Setup not found
- `4`: Backup creation failed

---

### `metacoding --help`

Display help information for all commands or specific command usage.

#### Syntax

```bash
metacoding --help
metacoding help [command]
metacoding [command] --help
```

#### Examples

```bash
# General help
metacoding --help

# Command-specific help
metacoding help init
metacoding init --help
```

---

### `metacoding --version`

Display current version information.

#### Syntax

```bash
metacoding --version
metacoding -V
```

#### Output

```
1.1.4
```

## Templates

### Available Templates

| Template     | Description                            | Primary Technologies          |
| ------------ | -------------------------------------- | ----------------------------- |
| `general`    | Universal instructions for any project | Configurable                  |
| `typescript` | Shared TypeScript patterns (component) | TypeScript, Jest              |
| `react`      | Frontend React applications            | React, TypeScript, Jest, Vite |
| `node`       | Backend Node.js applications           | Node.js, TypeScript, Express  |
| `python`     | Python applications                    | Python, FastAPI, Pytest       |

### Template Selection

Templates are selected automatically based on project detection or manually via `--template` option:

```bash
# Let metacoding detect project type
metacoding init

# Specify template explicitly
metacoding init --template react
```

### Template Composition

Templates use a composable architecture:

- **Universal files**: Always included from `general` template
- **Language-specific files**: TypeScript templates inherit shared TypeScript instructions
- **Template-specific files**: Each template provides specialized guidance

## IDE Integration

### VS Code + GitHub Copilot

#### Setup Requirements

- VS Code installed
- GitHub Copilot extension installed and authenticated
- GitHub Copilot Chat extension (recommended)

#### Generated Files

```
.github/copilot-instructions.md          # Main instruction file
.github/instructions/*.instructions.md   # Specialized instruction files
.vscode/settings.json                    # VS Code configuration
```

#### Usage Workflow

1. Open project in VS Code
2. GitHub Copilot automatically loads instructions based on file context
3. Use Copilot Chat: "What are the coding standards for this project?"
4. Follow guided development workflow

### Cursor IDE

#### Setup Requirements

- Cursor IDE installed
- Account authenticated (if using premium features)

#### Generated Files

```
workflow.cursorrules       # Main workflow rules
.cursor/rules/*.mdc       # Pattern-specific rule files
```

#### Usage Workflow

1. Open project in Cursor IDE
2. Cursor automatically loads `workflow.cursorrules`
3. Pattern-specific rules apply based on file types
4. Ask Cursor: "What is the development workflow for this project?"

## Configuration

### Environment Variables

| Variable                   | Description               | Default                |
| -------------------------- | ------------------------- | ---------------------- |
| `METACODING_TEMPLATE_PATH` | Custom template directory | Built-in templates     |
| `METACODING_CONFIG_DIR`    | Configuration directory   | `~/.config/metacoding` |
| `METACODING_NO_COLOR`      | Disable colored output    | `false`                |
| `METACODING_DEBUG`         | Enable debug output       | `false`                |

### Project Configuration

The CLI automatically creates a project configuration file at `.github/metacoding.json`:

```json
{
  "template": "react",
  "version": "1.1.4",
  "ide": "cursor",
  "customizations": {
    "projectName": "My Project",
    "description": "Project description",
    "primaryTech": "React"
  }
}
```

## Error Handling

### Common Error Patterns

#### Permission Errors

```
❌ Error: Permission denied writing to .vscode/settings.json

Suggestions:
- Check file permissions in your project directory
- Ensure VS Code is not currently editing the settings file
- Try running with appropriate permissions

Use 'metacoding init --help' for more information.
```

#### Template Not Found

```
❌ Error: Template 'invalid-template' not found

Available templates: general, react, node, python, typescript

Use 'metacoding init --help' for more information.
```

#### Git Repository Issues

```
❌ Error: Not a git repository

Suggestions:
- Initialize git repository with 'git init'
- Use --skip-git to bypass git checks

Use 'metacoding init --help' for more information.
```

### Error Exit Codes

| Exit Code | Description                 |
| --------- | --------------------------- |
| `0`       | Success                     |
| `1`       | General error               |
| `2`       | User cancellation           |
| `3`       | Template/resource not found |
| `4`       | Git or file system error    |

## Troubleshooting

### VS Code + GitHub Copilot Issues

**Problem**: GitHub Copilot not using instructions

**Solutions**:

- Verify GitHub Copilot extension is active
- Check `.github/copilot-instructions.md` exists
- Restart VS Code to refresh settings
- Manually attach instruction files in Copilot Chat

**Problem**: Settings not applying

**Solutions**:

- Check `.vscode/settings.json` syntax
- Restart VS Code
- Verify workspace trust settings

### Cursor IDE Issues

**Problem**: Rules not loading

**Solutions**:

- Verify `workflow.cursorrules` exists in project root
- Check Cursor IDE version compatibility
- Restart Cursor IDE
- Check rule file syntax

**Problem**: Pattern rules not applying

**Solutions**:

- Verify `.cursor/rules/*.mdc` files exist
- Check glob patterns in rule frontmatter
- Restart Cursor IDE
- Verify file extension matches patterns

### General Issues

**Problem**: Command not found

**Solutions**:

```bash
# Reinstall globally
npm install -g metacoding

# Check installation
which metacoding
npm list -g metacoding
```

**Problem**: Permission denied

**Solutions**:

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Use alternative installation
npx metacoding init
```

## API Integration

### Programmatic Usage

While primarily a CLI tool, metacoding can be integrated programmatically:

```javascript
// Not officially supported - use CLI interface
import { exec } from 'child_process';

exec('metacoding init --template react --force', (error, stdout, stderr) => {
  if (error) {
    console.error('Setup failed:', error);
    return;
  }
  console.log('Setup complete:', stdout);
});
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Setup metacoding
  run: |
    npm install -g metacoding
    metacoding update --dry-run --strict
```

---

**API Version**: 2.0  
**Last Updated**: June 25, 2025  
**CLI Version**: 1.1.4+  
**Node.js Compatibility**: 18+

## Related Documentation

For system architecture, implementation details, and contributing guidelines, see:

- **[System Documentation](./system-documentation.md)**: Complete system architecture and implementation details
- **[Architecture Decisions](./architecture-decisions.md)**: Record of key architectural decisions
- **[Project Task List](./project-task-list.md)**: Current development tasks and project planning

---
