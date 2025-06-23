# metacoding CLI API Design

## Overview

The metacoding CLI provides a professional development workflow setup for Git repositories with GitHub Copilot instructions. This document defines the command-line interface, options, and behaviors.

## Global Options

All commands support these global options:

```bash
-V, --version       # Output the version number
-h, --help          # Display help for command
```

## Commands

### `metacoding init`

Initialize metacoding in the current project with interactive setup.

#### Syntax

```bash
metacoding init [options]
```

#### Options

| Option              | Alias | Type    | Default   | Description                                   |
| ------------------- | ----- | ------- | --------- | --------------------------------------------- |
| `--template <name>` | `-t`  | string  | `general` | Template to use for initialization            |
| `--force`           | `-f`  | boolean | `false`   | Overwrite existing files without confirmation |
| `--interactive`     | `-i`  | boolean | `true`    | Use interactive prompts (default)             |
| `--no-interactive`  |       | boolean | `false`   | Skip interactive prompts, use defaults        |

#### Interactive Prompts

When `--interactive` is true (default), the command prompts for:

1. **Project Name**: Defaults to current directory name
2. **Project Description**: Defaults to template-specific description
3. **Primary Technology**: Selects appropriate template if not specified
4. **GitHub Username**: For repository links (optional)
5. **Overwrite Confirmation**: If existing files detected

#### Examples

```bash
# Basic interactive setup
metacoding init

# Use specific template
metacoding init --template react

# Force overwrite existing files
metacoding init --force

# Non-interactive with defaults
metacoding init --no-interactive

# Combine options
metacoding init --template node --force
```

#### Exit Codes

- `0`: Success
- `1`: General error (invalid arguments, file system errors)
- `2`: User cancellation (Ctrl+C or declined overwrite)
- `3`: Template not found
- `4`: Git repository issues

#### Output

**Success Output:**

```
🚀 Welcome to metacoding Setup!

✅ Project configuration gathered
✅ Template files generated
✅ VS Code settings updated
✅ Git repository configured

✅ metacoding setup complete!

Next steps:
1. Restart VS Code to apply settings
2. Open GitHub Copilot Chat
3. Ask: "What are the coding standards for this project?"
4. Start coding with professional workflow guidance!

Need help? Visit https://github.com/anton-g-kulikov/metacoding
```

**Error Output:**

```
❌ Error: Template 'nonexistent' not found
Available templates: general, react, node, python

Use 'metacoding init --help' for more information.
```

---

### `metacoding update`

Update existing metacoding setup to the latest version or validate current setup.

#### Syntax

```bash
metacoding update [options]
```

#### Options

| Option              | Alias | Type     | Default | Description                           |
| ------------------- | ----- | -------- | ------- | ------------------------------------- |
| `--backup`          | `-b`  | boolean  | `true`  | Create backup before updating         |
| `--force`           | `-f`  | boolean  | `false` | Force update without confirmation     |
| `--template <name>` | `-t`  | string   | `auto`  | Update to specific template           |
| `--preserve`        | `-p`  | string[] |         | Preserve specific files from update   |
| `--dry-run`         | `-d`  | boolean  | `false` | Validate setup without making changes |
| `--strict`          | `-s`  | boolean  | `false` | Use strict validation rules           |

#### Update Process

1. **Backup Creation**: Create `.backup/` directory with current files (skipped in dry-run mode)
2. **Version Detection**: Determine current metacoding version
3. **Template Analysis**: Identify current template type
4. **Conflict Resolution**: Handle modified instruction files
5. **Settings Merge**: Update VS Code settings without overwriting custom settings
6. **Validation**: Run validation checks after update

#### Validation Mode (--dry-run)

When `--dry-run` is used, the command performs comprehensive validation without making any changes:

- **Setup Validation**: Check if metacoding is properly initialized
- **File Structure**: Verify expected files exist and are readable
- **Template Compliance**: Check if current setup matches template requirements
- **VS Code Settings**: Validate `.vscode/settings.json` configuration
- **Git Integration**: Verify git repository status if applicable

Use `--strict` with `--dry-run` for enhanced validation rules:

- Stricter file format validation
- Additional compliance checks
- More detailed reporting

#### Examples

```bash
# Standard update with backup
metacoding update

# Force update without prompts
metacoding update --force

# Update without backup
metacoding update --no-backup

# Update to specific template
metacoding update --template react

# Preserve custom instruction files
metacoding update --preserve test-runner.instructions.md

# Validation mode (dry-run) - check setup without changes
metacoding update --dry-run

# Strict validation mode
metacoding update --dry-run --strict

# Validate specific template compliance
metacoding update --dry-run --template react
```

#### Exit Codes

- `0`: Update successful / Validation passed
- `1`: Update failed / Validation failed
- `2`: User cancelled update
- `3`: No updates available / Setup not found
- `4`: Backup creation failed

#### Output

**Success Output:**

```
🔄 Updating metacoding setup...

✅ Backup created at .backup/2025-06-21_14-30-15/
✅ Template files updated
✅ VS Code settings merged
✅ Validation passed

🎉 metacoding updated successfully!

Changes:
- Updated copilot-instructions.md
- Added new test-runner.instructions.md
- Merged VS Code settings

Backup location: .backup/2025-06-21_14-30-15/
```

**Validation Output (--dry-run):**

```
🔍 Validating metacoding setup...

✅ metacoding configuration found
✅ Instruction files present and valid
✅ VS Code settings configured correctly
✅ Template compliance verified

✅ Validation passed! Setup is healthy.

Summary:
- Template: react (v1.1.0)
- Files: 5/5 present
- Settings: properly configured
- No issues detected
```

**Validation with Issues:**

```
🔍 Validating metacoding setup...

✅ metacoding configuration found
❌ Missing instruction file: test-runner.instructions.md
⚠️  VS Code setting 'github.copilot.enable' not configured
✅ Template compliance verified

❌ Validation failed with 1 error, 1 warning.

Issues found:
- Missing: test-runner.instructions.md
- Warning: VS Code Copilot not enabled

Run 'metacoding update' to fix these issues.
```

---

### `metacoding help`

Display help information for commands.

#### Syntax

```bash
metacoding help [command]
metacoding [command] --help
```

#### Examples

```bash
# General help
metacoding help
metacoding --help

# Command-specific help
metacoding help init
metacoding init --help
```

---

### `metacoding version`

Display version information.

#### Syntax

```bash
metacoding --version
metacoding -V
```

#### Output

```
1.0.0
```

---

## Error Handling

### Common Error Patterns

1. **File System Errors**

   - Permission denied
   - Disk space full
   - Path not found

2. **Configuration Errors**

   - Invalid template
   - Corrupted configuration files
   - VS Code not installed

3. **User Input Errors**
   - Invalid command options
   - Conflicting flags
   - Missing required arguments

### Error Message Format

```
❌ Error: [Brief description]
[Detailed explanation if helpful]

Suggestions:
- [Actionable step 1]
- [Actionable step 2]

Use 'metacoding [command] --help' for more information.
```

## Configuration Files

### Global Configuration

Location: `~/.config/metacoding/config.json`

```json
{
  "defaultTemplate": "general",
  "skipBackups": false,
  "githubUsername": "username",
  "preferences": {
    "autoUpdate": false,
    "telemetry": false
  }
}
```

### Project Configuration

Location: `.github/metacoding.json`

```json
{
  "template": "react",
  "version": "1.0.0",
  "customizations": {
    "projectName": "My Project",
    "description": "Project description",
    "primaryTech": "React"
  },
  "preserveFiles": ["custom-instructions.md"]
}
```

## Environment Variables

| Variable                   | Description               | Default                |
| -------------------------- | ------------------------- | ---------------------- |
| `METACODING_TEMPLATE_PATH` | Custom template directory | Built-in templates     |
| `METACODING_CONFIG_DIR`    | Configuration directory   | `~/.config/metacoding` |
| `METACODING_NO_COLOR`      | Disable colored output    | `false`                |
| `METACODING_DEBUG`         | Enable debug output       | `false`                |

## Integration APIs

### Template API

Templates can define hooks for custom behavior:

```json
{
  "name": "custom-template",
  "version": "1.0.0",
  "hooks": {
    "preInstall": "./scripts/pre-install.js",
    "postInstall": "./scripts/post-install.js"
  }
}
```

### Plugin API

Future plugin system will support:

- Custom commands
- Template extensions
- Validation rules
- Output formatters

---

**API Version**: 1.0  
**Last Updated**: June 23, 2025  
**Compatibility**: Node.js 18+
