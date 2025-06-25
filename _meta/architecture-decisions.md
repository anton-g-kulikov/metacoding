# Architecture Decision Records

## ADR-001: CLI Tool Architecture

**Date**: June 21, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

We needed to choose the architecture for the metacoding CLI tool to replace the manual 6-step setup process with a single command experience.

### Decision

We chose a Node.js/TypeScript CLI architecture with the following components:

- **Commander.js** for command parsing and help generation
- **Inquirer.js** for interactive user prompts
- **Template system** with variable substitution
- **Service-oriented architecture** with separate concerns

### Consequences

**Positive:**

- Cross-platform compatibility (Windows, Mac, Linux)
- Rich ecosystem of CLI libraries
- TypeScript provides type safety and better developer experience
- Easy to test with Jest framework
- npm distribution model familiar to developers

**Negative:**

- Requires Node.js runtime
- Package size larger than native binary
- Startup time slightly slower than compiled languages

### Alternatives Considered

- **Go CLI**: Faster startup, single binary, but less familiar ecosystem
- **Python CLI**: Good libraries, but distribution challenges
- **Bash Scripts**: Simple but limited cross-platform support

---

## ADR-002: Template System Design

**Date**: June 21, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

We needed a flexible template system to support different project types (React, Node.js, Python) while maintaining consistency in instruction files.

### Decision

We implemented a JSON-based template system with:

- **Template.json** metadata files defining template properties
- **Variable substitution** using `{{variable}}` syntax
- **File copying** with dynamic content generation
- **Modular template structure** for easy extension

### Consequences

**Positive:**

- Easy to add new templates
- Non-technical users can create templates
- Clear separation between template logic and content
- Supports complex variable substitution

**Negative:**

- JSON limitation for complex logic
- Template validation needed
- Version management complexity

### Alternatives Considered

- **Handlebars/Mustache**: More powerful but added complexity
- **Hard-coded templates**: Simpler but less flexible
- **Scripted templates**: More powerful but harder to create

---

## ADR-003: VS Code Settings Integration

**Date**: June 21, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

We needed to automatically configure VS Code settings for GitHub Copilot custom instructions without manual user intervention.

### Decision

We implemented automatic VS Code settings.json modification with:

- **Settings detection** in both user and workspace levels
- **Merge strategy** that preserves existing settings
- **Backup creation** before modifications
- **Validation** of required settings

### Consequences

**Positive:**

- Zero-configuration user experience
- Preserves existing user settings
- Works with both workspace and global settings
- Provides rollback capability

**Negative:**

- VS Code specific implementation
- Potential conflicts with other extensions
- Settings file parsing complexity

### Alternatives Considered

- **Manual instructions**: Simpler but poor user experience
- **VS Code extension**: More integrated but distribution complexity
- **Configuration prompts**: More control but worse UX

---

## ADR-004: Project Structure and Naming

**Date**: June 21, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

We needed to establish consistent naming conventions and folder structure that follows industry standards while being descriptive.

### Decision

We adopted the following structure and naming:

- **Package name**: `metacoding` (lowercase, matches CLI command)
- **Folder structure**: `_meta/` for project docs, `test/` for tests
- **Branding**: "metacoding" throughout (not "MetaCoding")
- **File naming**: kebab-case for files, camelCase for code

### Consequences

**Positive:**

- Consistent with npm naming conventions
- Modern lowercase branding approach
- Clear separation of meta-documentation
- Follows Node.js ecosystem standards

**Negative:**

- Required comprehensive rebranding effort
- `_meta/` folder less conventional than `docs/`
- Breaking change from original "MetaCoding" branding

### Alternatives Considered

- **MetaCoding branding**: Original choice but inconsistent with package name
- **docs/ folder**: More standard but less descriptive
- **meta/ folder**: Original choice but less visually distinct

---

## ADR-005: Testing Strategy

**Date**: June 21, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

We needed a comprehensive testing strategy that covers CLI functionality, file system operations, and user interactions.

### Decision

We implemented a multi-layer testing approach:

- **Unit tests** for individual services and utilities
- **Integration tests** for command workflows
- **Temporary directories** for file system testing
- **Mock implementations** for external dependencies
- **Jest framework** with TypeScript support

### Consequences

**Positive:**

- High confidence in CLI functionality
- Safe refactoring with test coverage
- Automated regression detection
- Documentation through test cases

**Negative:**

- Test setup complexity for file system operations
- Mocking overhead for external dependencies
- Test maintenance burden

### Alternatives Considered

- **End-to-end testing only**: Simpler but less granular
- **Manual testing**: Faster development but error-prone
- **Different test frameworks**: Mocha, Vitest considered but Jest more established

---

## ADR-006: Instruction File Architecture Abstraction

**Date**: June 22, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

The original template system had significant duplication of instruction files across templates. TypeScript-specific instruction files were duplicated in `/general/`, `/node/`, and `/react/` templates, violating the single source of truth principle and creating maintenance overhead.

### Decision

We implemented a composable instruction file architecture with:

- **Universal instruction files** in `/templates/general/` for all project types
- **Shared language-specific components** in `/templates/typescript/` for TypeScript-using templates
- **Template-specific files** in individual template directories
- **Template inheritance system** where Node.js and React automatically inherit TypeScript instructions
- **Exclusion logic** to prevent shared components from appearing as standalone templates

### Architecture Structure

```
/templates/
├── general/          # Universal instructions (all templates)
├── typescript/       # Shared TypeScript component (Node.js + React)
├── node/            # Node.js-specific + inherits TypeScript
├── react/           # React-specific + inherits TypeScript
└── python/          # Python-specific only
```

### Implementation Details

The `TemplateManager` loads files in hierarchical order:

1. Universal files from `/templates/general/`
2. Language-specific shared files (TypeScript) for applicable templates
3. Template-specific files from the template directory

### Consequences

**Positive:**

- **Single source of truth**: TypeScript instructions exist only in `/templates/typescript/`
- **Maintainability**: Changes to shared instructions automatically propagate
- **Composability**: Templates can inherit multiple instruction sets
- **Clean separation**: Each directory contains only relevant files
- **Extensibility**: Easy to add new shared instruction components

**Negative:**

- **Increased complexity**: Template loading logic more sophisticated
- **Template dependencies**: Templates now have implicit dependencies on shared components
- **Testing overhead**: More complex scenarios to test inheritance

### Verification Results

- Node.js template loads 11 files (5 universal + 3 TypeScript + 3 Node.js-specific)
- React template correctly inherits TypeScript instructions
- Python template correctly excludes TypeScript instructions
- Template manager excludes shared components from available templates list
- All tests passing with comprehensive coverage of inheritance scenarios

### Alternatives Considered

- **Keep duplication**: Simpler but violates DRY principle and creates maintenance burden
- **Symlinks**: Platform-dependent and Git compatibility issues
- **Single mega-template**: Less flexible and harder to customize
- **External references**: More complex dependency management

---

## ADR-007: .gitignore Handling Strategy

**Date**: June 23, 2025  
**Status**: Accepted  
**Deciders**: Development Team

### Context

The metacoding CLI generates `.github/copilot-instructions.md` files that should not be committed to version control. However, many users already have existing `.gitignore` files with their own patterns. We needed to decide how to handle .gitignore updates without disrupting existing user configurations.

### Decision

We implemented an **append-only strategy** for .gitignore handling:

- **Check for existing .gitignore**: Detect if `.gitignore` already exists in target project
- **Preserve existing content**: Never modify or overwrite existing .gitignore patterns
- **Append with clear markers**: Add metacoding patterns with section comments for easy identification
- **Template inclusion**: Provide .gitignore templates for new projects via template system
- **Comprehensive patterns**: Include patterns for GitHub Copilot, VSCode, JetBrains, and other AI coding assistants

### Implementation Pattern

```gitignore
# Existing user content remains untouched

# metacoding: AI coding assistant exclusions
.github/copilot-instructions.md
.vscode/extensions/github.copilot*/
.idea/copilot/
```

### Consequences

**Positive:**

- **Non-destructive**: Preserves all existing user configurations
- **Transparent**: Clear section markers show what metacoding added
- **Reversible**: Users can easily identify and remove metacoding additions
- **Safe**: Zero risk of breaking existing ignore patterns
- **Automatic**: Works for both new projects (via templates) and existing projects

**Negative:**

- **Potential duplication**: May add duplicate patterns if users already have similar rules
- **File size growth**: Appends content rather than merging intelligently
- **Manual cleanup**: Users must manually remove duplicates if desired

### Alternatives Considered

- **Smart merge strategy**: More complex, higher risk of edge cases and conflicts
- **Template-only strategy**: Doesn't solve problem for existing metacoding users
- **Overwrite strategy**: Risk of data loss and user frustration
- **Interactive prompts**: Poor user experience, breaks automation

### Validation Requirements

- Test with existing .gitignore files containing various patterns
- Verify patterns effectively exclude generated files
- Ensure templates create appropriate .gitignore files for new projects
- Test cross-platform path handling (Windows vs Unix)

### Future Considerations

- Consider smart duplicate detection in future versions
- Monitor user feedback for pain points
- Evaluate option for .gitignore cleanup command

---

## ADR-006: Cursor IDE Support Integration

**Date**: June 24, 2025  
**Status**: Proposed  
**Deciders**: Development Team

### Context

Users have requested support for Cursor IDE, an AI-first code editor that competes with VS Code + GitHub Copilot. We need to decide how to integrate Cursor support while maintaining our existing GitHub Copilot functionality and ensuring a clean user experience.

### Decision

We will implement Cursor IDE support using a **binary choice architecture** with the following principles:

#### Core Architecture Decisions

1. **Single Editor Choice**: Users choose either "VS Code + GitHub Copilot" OR "Cursor IDE" during setup - no "both" option
2. **Content Reuse**: Same instruction file content, different file locations and formats for each editor
3. **Non-Intrusive File Naming**: Use `workflow.cursorrules` instead of `.cursorrules` to respect existing user configurations
4. **User-Controlled Setup**: Explicit choice during init, no automatic IDE detection

#### File Structure Mapping

**VS Code + GitHub Copilot Setup:**

```
.github/instructions/copilot-instructions.md
.github/instructions/[language].coding.instructions.md
.github/instructions/docs-update.instructions.md
.github/instructions/code-review.instructions.md
.vscode/settings.json
```

**Cursor IDE Setup:**

```
workflow.cursorrules (copy of copilot-instructions.md)
.cursor/rules/[language]-coding.mdc
.cursor/rules/docs-update.mdc
.cursor/rules/code-review.mdc
.cursor/rules/test-runner.mdc
```

#### Implementation Strategy

1. **Extend Init Command**: Add AI setup choice prompt to existing `metacoding init` workflow
2. **Create CursorService**: New service class for Cursor-specific file management and transformations
3. **Template Integration**: Extend existing TemplateManager to support both file mapping strategies
4. **Safe Installation**: Conflict detection, backup mechanisms, and user consent workflows

### Consequences

**Positive:**

- **Respects User Choice**: Clear binary decision between competing AI coding solutions
- **Non-Destructive**: `workflow.cursorrules` doesn't override existing user `.cursorrules` files
- **Content Consistency**: Same high-quality instruction content for both editors
- **Minimal Code Duplication**: Reuses existing template system and instruction files
- **Future Extensible**: Architecture supports adding other AI editors easily
- **Safe Operation**: Backup and conflict detection prevents data loss

**Negative:**

- **Increased Complexity**: Additional service layer and file transformation logic
- **Testing Overhead**: Need to test both VS Code and Cursor workflows
- **Documentation Burden**: Need to document both setup paths clearly
- **Maintenance**: Updates to instructions need to work for both editors

### Alternatives Considered

#### Alternative 1: "Both" Option

Allow users to install both VS Code and Cursor configurations simultaneously.

**Rejected because:**

- Users don't actually use both editors simultaneously
- Creates confusion and unnecessary complexity
- Teams typically standardize on one editor
- Increases maintenance burden without real value

#### Alternative 2: Override `.cursorrules`

Use standard `.cursorrules` file instead of `workflow.cursorrules`.

**Rejected because:**

- Would override existing user configurations
- Not respectful of user's custom rules
- Could cause data loss if user has existing setup
- Goes against safe installation principles

#### Alternative 3: Automatic IDE Detection

Detect which IDE is installed and configure automatically.

**Rejected because:**

- Many users have both VS Code and Cursor installed
- Removes user agency in choosing their preferred workflow
- IDE detection is unreliable and platform-dependent
- Users should explicitly choose their development environment

#### Alternative 4: Separate CLI Commands

Create `metacoding init-cursor` and `metacoding init-vscode` commands.

**Rejected because:**

- Fragments the user experience
- Requires users to know which command to use upfront
- Less discoverable than integrated choice
- Complicates help documentation

### Implementation Details

#### File Content Transformation

**Main Workflow File (`workflow.cursorrules`):**

```markdown
# Development Workflow Rules

# Generated by metacoding v1.1.4

# Source: copilot-instructions.md

[FULL CONTENT OF copilot-instructions.md]
```

**Pattern-Specific Rules (`.cursor/rules/*.mdc`):**

```markdown
---
description: TypeScript coding standards and best practices
globs: ['**/*.ts', '**/*.tsx']
alwaysApply: false
---

# Generated by metacoding v1.1.4

[CONTENT FROM typescript.coding.instructions.md]
```

#### User Experience Flow

```bash
metacoding init

✨ Setting up development environment...
📋 Project type: general
🛠️  Technologies: typescript

🤖 Choose your AI coding setup:
   [1] VS Code + GitHub Copilot
   [2] Cursor IDE

Choose setup [1]: 2

Installing Cursor IDE rules...
✅ workflow.cursorrules created
✅ .cursor/rules/ directory created
✅ Pattern-specific rules installed

ℹ️  Your existing .cursorrules file (if any) remains untouched.
   You can edit workflow.cursorrules or merge rules as needed.
```

### Success Criteria

- [ ] Users can choose between VS Code + Copilot and Cursor IDE during init
- [ ] Existing user configurations are never overwritten
- [ ] Same instruction content quality for both editors
- [ ] Safe installation with conflict detection and backups
- [ ] Clear documentation for both setup paths
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

### Risks and Mitigations

**Risk**: Users confused about which files to edit  
**Mitigation**: Clear documentation about file purposes and generated file headers

**Risk**: Generated files conflict with existing user setup  
**Mitigation**: Comprehensive conflict detection and backup mechanisms

**Risk**: Maintenance burden of supporting two editors  
**Mitigation**: Shared instruction content and template system minimize duplication

**Risk**: Users expect "both" option that doesn't exist  
**Mitigation**: Clear messaging about single editor choice and rationale in documentation

---
