# metacoding System Documentation

## Project Overview

**metacoding** is a guided development methodology that provides structured development guidance for developers at any experience level through multiple AI coding assistants. The project has evolved from a manual setup process to a comprehensive npm package with CLI tooling that supports GitHub Copilot, Claude Code, Codex/OpenAI, and Gemini Code Assist.

### Mission Statement

Transform development workflows by providing AI-guided coding standards, structured quality practices, and proven best practices that help developers build better software through step-by-step guidance across multiple AI assistant platforms.

### Key Value Propositions

- **Multi-Assistant Support**: Works with GitHub Copilot, Claude Code, Codex/OpenAI, and Gemini Code Assist
- **Guided Development Experience**: AI assistants become knowledgeable development guides
- **Quality Standards Guidance**: Helps avoid common mistakes through structured workflows
- **Test-Driven Development**: Encourages and guides TDD practices step-by-step
- **Documentation Guidance**: Built-in standards that help keep projects maintainable
- **Canonical Workflow**: Single source of truth for development process shared across all assistants

## Architecture Overview

### System Components

```
metacoding/
├── CLI Tool (Node.js/TypeScript)
│   ├── Commands (init, update)
│   ├── Template System (6 templates)
│   ├── Multi-Assistant Support (Copilot, Claude Code, Codex, Gemini)
│   ├── IDE Integration (VS Code, Cursor, IntelliJ)
│   └── Project Detection
├── Template Library
│   ├── templates/general/files/
│   │   ├── copilot-instructions.md.template
│   │   └── *.instructions.md (source templates)
│   ├── templates/assistants/
│   │   ├── CLAUDE.md (Claude Code adapter template)
│   │   ├── AGENTS.md (Codex/OpenAI adapter template)
│   │   └── GEMINI.md (Gemini Code Assist adapter template)
│   ├── TypeScript Template (shared component)
│   ├── React Template
│   ├── Node.js Template
│   ├── Python Template
│   └── JavaScript Template
├── Canonical Workflow System
│   └── workflow/core.md (single source of truth for 7-step workflow)
├── Generated User Structure
│   ├── GitHub Copilot Setup (.github/ + .vscode/settings.json)
│   │   ├── copilot-instructions.md (generated from template)
│   │   └── instructions/
│   │       ├── test-runner.instructions.md
│   │       ├── release.instructions.md
│   │       ├── docs-update.instructions.md
│   │       └── code-review.instructions.md
│   ├── Claude Code Setup (IDE or Terminal)
│   │   └── CLAUDE.md (project instructions format)
│   ├── Codex/OpenAI Setup (Terminal)
│   │   └── AGENTS.md (system message format)
│   ├── Gemini Code Assist Setup (IDE)
│   │   └── GEMINI.md (style guide format)
│   └── Cursor IDE Setup (.cursor/rules/)
│       └── .cursor/rules/
│           ├── workflow.mdc
│           ├── test-runner.mdc
│           ├── release.mdc
│           ├── docs-update.mdc
│           └── code-review.mdc
└── Documentation & Testing
    ├── Comprehensive README
    ├── Migration Guides
    └── 253 Test Cases
```

### Technical Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript with strict type checking
- **CLI Framework**: Commander.js v11.1.0 for command parsing
- **UI**: Inquirer.js v8.2.6 for interactive prompts, Ora v5.4.1 for spinners, Chalk v4.1.2 for colors
- **File Operations**: fs-extra v11.2.0 for enhanced file system operations, glob v10.3.10 for pattern matching
- **Configuration**: YAML v2.3.4 for configuration file parsing
- **Testing**: Jest v29.7.0 with integration and unit tests, ts-jest v29.1.1 for TypeScript support
- **Build**: TypeScript compiler v5.8.3 with declaration files and source maps
- **Code Quality**: ESLint v8.54.0 with @typescript-eslint v8.0.0, Prettier v3.1.0, and strict TypeScript configuration
- **Distribution**: npm registry with global installation

### Data Flow

1. **User Invocation**: `metacoding init` command execution
2. **Environment Choice**: User selects IDE or Terminal environment
3. **IDE/Assistant Selection**:
   - IDE environment: Choose IDE (VS Code, Cursor, IntelliJ) and assistants (Copilot, Claude Code, Codex, Gemini, or All)
   - Terminal environment: Choose assistants (Claude Code, Codex, Gemini, or All)
4. **Project Detection**: Analyze current directory structure and git status
5. **Template Selection**: Choose appropriate template based on project type
6. **Interactive Configuration**: Gather user preferences and project details
7. **File Generation**:
   - Create assistant configuration files (CLAUDE.md, AGENTS.md, GEMINI.md, copilot-instructions.md)
   - Generate instruction files with customized content
   - Populate files with canonical workflow from workflow/core.md
8. **IDE Integration**: Configure selected IDE (VS Code settings or Cursor rules)
9. **Validation**: Verify setup completeness and provide next steps

### CLI Command Implementation

#### Available Commands

- **`metacoding init`**: Interactive project setup with:

  - Environment choice (IDE or Terminal)
  - Assistant selection (GitHub Copilot, Claude Code, Codex/OpenAI, Gemini Code Assist, or All)
  - IDE selection for IDE environment (VS Code, Cursor, IntelliJ)
  - Project configuration prompts
  - Template selection (general, react, node, python, typescript, javascript)
  - Automatic project type detection
  - IDE-specific settings configuration
  - Git repository validation
  - File generation with variable substitution
  - Progress indicators and user feedback

- **`metacoding update`**: Setup updates and migrations with:

  - Template updates to latest version
  - Conflict resolution with user prompts
  - Backup creation before changes
  - Validation mode with `--dry-run` flag
  - Strict validation with `--strict` flag
  - Template switching with `--template` option

- **`metacoding --help`**: Comprehensive help system with examples
- **`metacoding --version`**: Version display from package.json

## Development Workflow

### Development Process

The project follows its own metacoding methodology:

1. **Task Planning**: All tasks documented in `_meta/project-task-list.md`
2. **Test-Driven Development**: Tests written before implementation
3. **Documentation-First**: Features documented before coding
4. **Quality Gates**: All tests must pass before task completion
5. **Incremental Commits**: Regular commits with conventional commit messages

### Test Architecture

- **Framework**: Jest v29.7.0 with ts-jest for TypeScript support
- **Test Types**: Unit tests, integration tests, template validation tests, assistant adapter tests
- **Coverage**: 253 test cases covering core functionality, CLI commands, services, and multi-assistant support
- **Structure**: Tests organized in `/test/unit/` and `/test/integration/` directories
- **Fixtures**: Temporary directories for safe file system testing

### Release and Version Management

- **Versioning**: Semantic versioning (SemVer) with package.json as source of truth
- **Build Process**: TypeScript compilation to `lib/` directory with declaration files
- **Distribution**: npm registry with global installation pattern
- **Documentation**: Changelog maintenance with user-facing change tracking

## Implementation Architecture

### CLI Command Structure

#### Implemented Commands

- **`metacoding init`**: Interactive project setup

  - Environment choice (IDE or Terminal)
  - Assistant selection (GitHub Copilot, Claude Code, Codex/OpenAI, Gemini Code Assist, or All)
  - IDE selection for IDE environment (VS Code, Cursor, IntelliJ)
  - Project configuration prompts
  - Template selection (general, react, node, python, typescript, javascript)
  - Automatic project type detection
  - IDE-specific settings configuration
  - Git repository validation
  - File generation with variable substitution
  - Progress indicators and user feedback
  - **Options**: `--template <type>`, `--environment <ide|terminal>`, `--ide <vscode|cursor|intellij>`, `--assistants <copilot|claude|codex|gemini|all>`, `--force`, `--skip-vscode`, `--skip-git`, `--vscode` (legacy), `--cursor` (legacy)

- **`metacoding --help`**: Comprehensive help system with examples
- **`metacoding --version`**: Version display from package.json

- **`metacoding update`**: Setup updates and migrations with:
  - Template updates to latest version
  - Conflict resolution with user prompts
  - Backup creation before changes
  - Validation mode with `--dry-run` flag (replaces separate validate command)
  - Strict validation with `--strict` flag
  - Template switching with `--template` option
  - Force mode with `--force` flag
  - **Options**: `--template <type>`, `--backup`, `--dry-run`, `--strict`, `--force`

## Package Distribution Architecture

### Package Configuration

- **Package Name**: `metacoding`
- **Current Version**: 1.1.4 (as specified in package.json)
- **Distribution Method**: Global npm installation (`npm install -g metacoding`)
- **Entry Point**: `bin/metacoding.js` with compiled TypeScript in `lib/` directory

### Build System

- **TypeScript Compilation**: Source in `src/` compiled to `lib/` with declaration files
- **Package Files**: Includes `bin/`, `lib/`, `templates/`, and documentation files
- **Scripts**: Build, test, lint, and publishing preparation scripts
- **Dependencies**: Production dependencies pinned for stability
- **Node.js Compatibility**: Requires Node.js 18+ and npm 8+

### Current Package Statistics

- **Latest Version**: 1.4.3 (published June 2025)
- **Package Size**: ~134 KB compressed, ~537 KB unpacked
- **File Count**: Includes CLI, services, templates, and assistant adapters
- **NPM URL**: https://www.npmjs.com/package/metacoding
- **Global Installation**: `npm install -g metacoding@1.4.3`
- **Key Features**: Multi-assistant support (Copilot, Claude Code, Codex, Gemini), 6 project templates, IDE integration (VS Code, Cursor, IntelliJ), canonical workflow system

### Package Structure

```
metacoding/
├── bin/metacoding.js          # CLI entry point
├── lib/                       # Compiled TypeScript
│   ├── cli.js                # Main CLI logic
│   ├── commands/             # Command implementations
│   ├── services/             # Core services
│   │   ├── assistant-adapter.js  # Multi-assistant support
│   │   ├── template-manager.js   # Template system
│   │   ├── vscode.js            # VS Code integration
│   │   └── cursor.js            # Cursor IDE integration
│   └── types/                # Type definitions
├── templates/                # Template files
│   ├── general/             # Universal template
│   ├── react/               # React template
│   ├── node/                # Node.js template
│   ├── python/              # Python template
│   ├── typescript/          # TypeScript shared component
│   ├── javascript/          # JavaScript template
│   └── assistants/          # Assistant adapter templates
│       ├── CLAUDE.md        # Claude Code adapter
│       ├── AGENTS.md        # Codex/OpenAI adapter
│       └── GEMINI.md        # Gemini Code Assist adapter
├── workflow/                # Canonical workflow
│   └── core.md             # Single source of truth for workflow
└── package.json            # Package configuration
```

## Integration Points

### Multi-Assistant Support Architecture

**metacoding** implements a comprehensive adapter architecture to support multiple AI coding assistants, each with its own configuration format and terminology.

#### Supported Assistants

- **GitHub Copilot**: VS Code extension using `.github/copilot-instructions.md`
- **Claude Code**: Terminal or IDE using `CLAUDE.md` with "project instructions" terminology
- **Codex/OpenAI**: Terminal using `AGENTS.md` with "system message" terminology
- **Gemini Code Assist**: VS Code/IntelliJ extension using `GEMINI.md` with "style guide" terminology

#### Canonical Workflow System

All assistant adapters share a single source of truth for the 7-step development workflow:

- **Source**: `workflow/core.md` contains the canonical workflow documentation
- **Substitution**: Each assistant adapter template includes `{{WORKFLOW_CONTENT}}` placeholder
- **Vocabulary Adaptation**: Same workflow semantics, terminology adapted for each assistant:
  - GitHub Copilot: Uses standard "instructions" language
  - Claude Code: Uses "project instructions" and "configuration" language
  - Codex/OpenAI: Uses "system message" and "instruction" language
  - Gemini Code Assist: Uses "style rule" and "configuration rule" language

#### Assistant Adapter Templates

Located in `templates/assistants/`:

- **CLAUDE.md**: Claude Code configuration with project instructions format
- **AGENTS.md**: Codex/OpenAI configuration with system message format
- **GEMINI.md**: Gemini Code Assist configuration with style guide format

Each template includes:

- Assistant-specific terminology and structure
- Variable placeholders (PROJECT_NAME, TECH_STACK, ENVIRONMENT, PROJECT_TYPE)
- Canonical workflow content with vocabulary adaptation
- Setup instructions and common commands
- Validation reminders

#### Assistant Adapter Service

The `AssistantAdapterService` handles all assistant configuration generation:

- **File Generation**: Creates appropriate configuration files based on user selections
- **Variable Substitution**: Replaces placeholders with project-specific values
- **Workflow Integration**: Injects canonical workflow content from workflow/core.md
- **Migration Detection**: Identifies existing assistant configurations for migration

#### CLI Integration

The init command implements a two-tiered selection flow:

1. **Environment Selection**:

   - IDE: Full IDE setup with VS Code, Cursor, or IntelliJ
   - Terminal: Terminal-based assistants only (Claude Code, Codex, Gemini)

2. **Assistant Selection** (based on environment):
   - IDE + VS Code: All assistants (Copilot, Claude Code, Codex, Gemini, or All)
   - IDE + Cursor: Cursor rules only (legacy support)
   - IDE + IntelliJ: Gemini Code Assist + optional others
   - Terminal: Claude Code, Codex, Gemini, or All

#### Backward Compatibility

- Legacy `--vscode` and `--cursor` flags still supported
- Existing Copilot setups continue to work
- Migration detection prompts for updating old configurations

### GitHub Copilot Integration

- **Custom Instructions**: Leverages GitHub Copilot's instruction file system
- **Automatic Context**: Files automatically apply based on editing context
- **Workflow Enforcement**: Instructions enforce development best practices
- **Manual Attachment**: Users can manually attach specific instruction files

### Cursor IDE Integration

- **Rule System**: Uses Cursor's `.cursorrules` and `.mdc` rule files
- **Workflow Rules**: Generates `workflow.cursorrules` from instruction content
- **Pattern-Specific Rules**: Creates `.cursor/rules/*.mdc` files with glob patterns
- **Content Transformation**: Converts VS Code references to Cursor IDE terminology
- **Non-Intrusive Setup**: Uses `workflow.cursorrules` to respect existing user configurations

### VS Code Integration

- **Settings Automation**: Automatically configures required VS Code settings
- **File Structure**: Creates proper `.github/` folder structure
- **Extension Support**: Ensures GitHub Copilot extension compatibility

### Git Integration

- **Repository Detection**: Identifies git repositories and status
- **Gitignore Management**: Creates appropriate .gitignore entries
- **Commit Message Standards**: Enforces conventional commit format

## Performance Considerations

### CLI Performance

- **Startup Time**: Optimized for sub-second command startup
- **Memory Usage**: Minimal memory footprint for CLI operations
- **File I/O**: Efficient file system operations with proper error handling
- **Network**: No network dependencies for core functionality

### Scalability

- **Template System**: Designed for easy addition of new templates
- **Modular Architecture**: Service-oriented design enables easy extension
- **Configuration**: JSON-based configuration for flexibility

## Security Considerations

### Input Validation

- **User Input**: All user inputs validated and sanitized
- **File Paths**: Safe file system operations with path validation
- **Template Variables**: Secure variable substitution

### File System Security

- **Path Traversal**: Protection against directory traversal attacks
- **Permission Checks**: Appropriate file system permission handling
- **Atomic Operations**: Safe file creation and modification

## Dependencies and Third-Party Libraries

### Production Dependencies

- **commander v11.1.0**: CLI argument parsing and command management
- **inquirer v8.2.6**: Interactive command-line prompts
- **ora v5.4.1**: Terminal spinners for long-running operations
- **chalk v4.1.2**: Terminal string styling and colors
- **fs-extra v11.2.0**: Enhanced file system operations
- **glob v10.3.10**: File pattern matching utilities
- **yaml v2.3.4**: YAML parsing and serialization

### Development Dependencies

- **typescript v5.8.3**: TypeScript compiler and type definitions
- **jest v29.7.0**: Testing framework for unit and integration tests
- **ts-jest v29.1.1**: TypeScript support for Jest
- **eslint v8.54.0**: Code linting and style enforcement
- **@typescript-eslint v8.0.0**: TypeScript-specific ESLint rules and parser
- **prettier v3.1.0**: Code formatting
- **@types/\***: Type definitions for TypeScript support

### Dependency Management

- **Version Pinning**: All dependencies use exact or compatible versions
- **Security Audits**: Regular npm audit checks
- **License Compatibility**: All dependencies use permissive licenses

## Troubleshooting and Support

### Common Issues

1. **GitHub Copilot Not Responding**: Settings configuration or extension issues
2. **Permission Errors**: File system permission problems
3. **Template Issues**: Template generation or variable substitution failures
4. **VS Code Integration**: Settings not applying or extension conflicts

### Support Channels

- **GitHub Issues**: Primary support channel for bugs and feature requests
- **Documentation**: Comprehensive troubleshooting in README
- **Community**: User discussions and community support

## Template System Documentation

### Available Templates

- **General Template**: Universal instructions for any project type
- **TypeScript Template**: Shared TypeScript instructions (composition component)
- **React Template**: Frontend-specific with React, hooks, and component patterns
- **Node.js Template**: Backend-specific with API, database, and server patterns
- **Python Template**: Python-specific with Django/Flask/FastAPI patterns
- **JavaScript Template**: Modern JavaScript with ES6+ patterns and npm ecosystem

### Template Architecture

Each template contains:

- `template.json`: Configuration and metadata
- `copilot-instructions.md.template`: Main instruction file with variable substitution (for GitHub Copilot)
- Instruction files: `test-runner.instructions.md`, `release.instructions.md`, `docs-update.instructions.md`, `code-review.instructions.md`
- Language-specific instruction files (e.g., `react.coding.instructions.md`, `typescript.testing.instructions.md`)

### Multi-Assistant Template Processing

When generating files for multiple assistants:

1. **Template Selection**: User selects project template (general, react, node, python, typescript, javascript)
2. **Assistant Selection**: User selects which assistants to configure (Copilot, Claude, Codex, Gemini, or All)
3. **File Generation**: System generates appropriate configuration files:
   - GitHub Copilot: `.github/copilot-instructions.md` + instruction files
   - Claude Code: `CLAUDE.md` with project-specific content
   - Codex/OpenAI: `AGENTS.md` with system message format
   - Gemini Code Assist: `GEMINI.md` with style guide format
4. **Workflow Injection**: Canonical workflow from `workflow/core.md` injected into all assistant configs
5. **Variable Substitution**: Project-specific values (name, tech stack, environment) substituted in all files

## Instruction File Architecture

### Composable Instruction System

The metacoding project implements a sophisticated composable instruction file architecture that eliminates duplication while maintaining single sources of truth for different types of development guidance.

### Architecture Structure

```
/templates/
├── general/                    # Universal instruction files
│   ├── copilot-instructions.md
│   ├── code-review.instructions.md
│   ├── docs-update.instructions.md
│   ├── release.instructions.md
│   ├── test-runner.instructions.md
│   ├── files/
│   │   └── .gitignore          # Universal .gitignore patterns
│   └── template.json
├── typescript/                 # Shared TypeScript instructions (composition component)
│   ├── typescript.coding.instructions.md
│   ├── typescript.docs.instructions.md
│   ├── typescript.testing.instructions.md
│   └── template.json
├── node/                      # Node.js-specific instructions + TypeScript inheritance
│   ├── nodejs.coding.instructions.md
│   ├── nodejs.docs.instructions.md
│   ├── nodejs.testing.instructions.md
│   └── template.json
├── react/                     # React-specific instructions + TypeScript inheritance
│   ├── react.coding.instructions.md
│   ├── react.docs.instructions.md
│   ├── react.testing.instructions.md
│   └── template.json
└── python/                    # Python-specific instructions only
    ├── python.coding.instructions.md
    ├── python.docs.instructions.md
    ├── python.testing.instructions.md
    └── template.json
```

### Template Composition Logic

The `TemplateManager` implements intelligent template composition:

1. **Universal Files**: Always loaded from `/templates/general/` for all templates
2. **Language-Specific Composition**: TypeScript-using templates (Node.js, React) automatically inherit TypeScript instructions from `/templates/typescript/`
3. **Template-Specific Files**: Each template provides its own specialized instruction files
4. **Exclusion Logic**: Shared components like `/typescript/` are excluded from standalone template listings

### File Loading Hierarchy

For each template, files are loaded in this order:

1. **Universal instructions** from `/templates/general/`
2. **Shared language instructions** (if applicable) from `/templates/typescript/`
3. **Template-specific instructions** from the template's own directory

### Example: Node.js Template File Loading

When loading the Node.js template, the system includes:

- **Universal files** (5): copilot-instructions.md, code-review.instructions.md, docs-update.instructions.md, release.instructions.md, test-runner.instructions.md
- **TypeScript files** (3): typescript.coding.instructions.md, typescript.docs.instructions.md, typescript.testing.instructions.md
- **Node.js-specific files** (3): nodejs.coding.instructions.md, nodejs.docs.instructions.md, nodejs.testing.instructions.md

**Total: 11 instruction files** providing comprehensive, non-duplicated guidance.

### Benefits of This Architecture

- **Single Source of Truth**: TypeScript instructions exist only in `/templates/typescript/`
- **Maintainability**: Changes to universal or shared instructions automatically propagate
- **Composability**: Templates can inherit shared instruction sets
- **Extensibility**: Easy to add new shared instruction components
- **Clean Separation**: Each template directory contains only template-specific files
- **No Duplication**: Eliminates the previous duplication of TypeScript files across multiple templates

### Verification and Testing

The architecture includes comprehensive testing to ensure:

- Template manager correctly excludes shared components from available templates
- Node.js and React templates properly inherit TypeScript instructions
- Python template correctly excludes TypeScript instructions
- All file loading works correctly through the composition system
- Service integration tests validate the complete workflow

## Contributing Guidelines

### Code Contributions

1. **Fork Repository**: Create personal fork for development
2. **Feature Branches**: Use descriptive branch names
3. **Test Requirements**: All new code must include tests
4. **Documentation**: Update documentation for new features
5. **Code Review**: All changes require review before merge

### Documentation Contributions

1. **Clarity**: Write clear, concise explanations
2. **Examples**: Include working code examples
3. **Completeness**: Cover all aspects of features
4. **Consistency**: Follow established documentation patterns

## Recent Enhancements

### Multi-Assistant Support (v1.4.x)

- **Expanded Assistant Coverage**: Added support for Claude Code, Codex/OpenAI, and Gemini Code Assist alongside GitHub Copilot
- **Canonical Workflow System**: Implemented single source of truth workflow in `workflow/core.md` shared across all assistant adapters
- **Adapter Architecture**: Created specialized configuration templates for each assistant with vocabulary adaptation
- **CLI Enhancement**: New environment and assistant selection flow with `--environment`, `--ide`, and `--assistants` flags
- **Migration Support**: Automatic detection of existing configurations with migration prompts
- **AssistantAdapterService**: New service for generating and managing multi-assistant configurations

### IDE Integration Improvements

- **IntelliJ Support**: Added IntelliJ IDEA as supported IDE choice for Gemini Code Assist
- **Cursor IDE Modernization**: Updated Cursor rules file structure to modern `.cursor/rules/*.mdc` format
- **VS Code Settings**: Enhanced VS Code settings configuration for GitHub Copilot

### Template System Enhancements

- **JavaScript Template**: Added comprehensive JavaScript template with ES6+ patterns
- **Template Composition**: Improved TypeScript instruction sharing across React and Node.js templates
- **Six Total Templates**: general, react, node, python, typescript (shared), javascript

### Testing and Quality

- **Comprehensive Test Coverage**: 253 test cases covering all functionality
- **Assistant Adapter Tests**: New test suites for multi-assistant file generation
- **Integration Tests**: End-to-end tests for all CLI workflows
- **Jest Linting**: Resolved all ESLint issues in test files

---

**Last Updated**: October 2025
**Document Version**: 2.0
**Review Schedule**: Monthly or with major releases

## Related Documentation

- **[API Reference](./api-design.md)**: Complete CLI command reference, usage examples, and troubleshooting
- **[Architecture Decisions](./architecture-decisions.md)**: Record of key architectural decisions
- **[Project Task List](./project-task-list.md)**: Current development tasks and project planning

---
