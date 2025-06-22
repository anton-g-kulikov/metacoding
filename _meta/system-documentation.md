# metacoding System Documentation

## Project Overview

**metacoding** is a guided development methodology that leverages GitHub Copilot's custom instruction capabilities to provide structured development guidance for developers at any experience level. The project has evolved from a manual setup process to a comprehensive npm package with CLI tooling.

### Mission Statement

Transform development workflows by providing AI-guided coding standards, structured quality practices, and proven best practices that help developers build better software through step-by-step guidance.

### Key Value Propositions

- **Guided Development Experience**: GitHub Copilot becomes a knowledgeable development guide
- **Quality Standards Guidance**: Helps avoid common mistakes through structured workflows
- **Test-Driven Development**: Encourages and guides TDD practices step-by-step
- **Documentation Guidance**: Built-in standards that help keep projects maintainable

## Architecture Overview

### System Components

```
metacoding/
├── CLI Tool (Node.js/TypeScript)
│   ├── Commands (init, validate, update)
│   ├── Template System
│   ├── VS Code Integration
│   └── Project Detection
├── Template Library
│   ├── templates/general/files/
│   │   ├── copilot-instructions.md.template
│   │   └── *.instructions.md (source templates)
│   ├── React Template
│   ├── Node.js Template
│   └── Python Template
├── Generated User Structure (.github/)
│   ├── copilot-instructions.md (generated from template)
│   └── instructions/
│       ├── test-runner.instructions.md
│       ├── release.instructions.md
│       ├── docs-update.instructions.md
│       └── code-review.instructions.md
└── Documentation & Testing
    ├── Comprehensive README
    ├── System Documentation (_meta/system-documentation.md)
    ├── API Documentation (_meta/api-design.md)
    ├── Test Suite (Unit + Integration)
    └── Migration Guides
```

### Technical Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript with strict type checking
- **CLI Framework**: Commander.js v11.1.0 for command parsing
- **UI**: Inquirer.js v8.2.6 for interactive prompts, Ora v5.4.1 for spinners, Chalk v4.1.2 for colors
- **File Operations**: fs-extra v11.2.0 for enhanced file system operations
- **Testing**: Jest v29.7.0 with integration and unit tests, ts-jest for TypeScript support
- **Build**: TypeScript compiler v5.3.2 with declaration files and source maps
- **Code Quality**: ESLint v8.54.0, Prettier v3.1.0, and strict TypeScript configuration
- **Distribution**: npm registry with global installation

### Data Flow

1. **User Invocation**: `metacoding init` command execution
2. **Project Detection**: Analyze current directory structure and git status
3. **Template Selection**: Choose appropriate template based on project type
4. **Interactive Configuration**: Gather user preferences and project details
5. **File Generation**: Create `.github/` structure with customized instruction files
6. **VS Code Integration**: Update settings.json with required configurations
7. **Validation**: Verify setup completeness and provide next steps

### CLI Command Implementation

#### Implemented Commands

- **`metacoding init`**: Interactive project setup with:

  - Project configuration prompts
  - Template selection (general, react, node, python)
  - Automatic project type detection
  - VS Code settings configuration
  - Git repository validation
  - File generation with variable substitution
  - Progress indicators and user feedback

- **`metacoding --help`**: Comprehensive help system with examples
- **`metacoding --version`**: Version display from package.json

#### Additional Commands

- **`metacoding validate`**: Project setup validation (command structure implemented)
- **`metacoding update`**: Setup updates and migrations (command structure implemented)

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
- **Test Types**: Unit tests, integration tests, template validation tests
- **Coverage**: 40 test cases covering core functionality
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

  - Project configuration prompts
  - Template selection (general, react, node, python)
  - Automatic project type detection
  - VS Code settings configuration
  - Git repository validation
  - File generation with variable substitution
  - Progress indicators and user feedback

- **`metacoding --help`**: Comprehensive help system with examples
- **`metacoding --version`**: Version display from package.json

#### Additional Commands

- **`metacoding validate`**: Project setup validation (command structure complete)
- **`metacoding update`**: Setup updates and migrations (command structure complete)

## Package Distribution Architecture

### Package Configuration

- **Package Name**: `metacoding`
- **Current Version**: 1.0.0 (as specified in package.json)
- **Distribution Method**: Global npm installation (`npm install -g metacoding`)
- **Entry Point**: `bin/metacoding.js` with compiled TypeScript in `lib/` directory

### Build System

- **TypeScript Compilation**: Source in `src/` compiled to `lib/` with declaration files
- **Package Files**: Includes `bin/`, `lib/`, `templates/`, and documentation files
- **Scripts**: Build, test, lint, and publishing preparation scripts
- **Dependencies**: Production dependencies pinned for stability
- **Node.js Compatibility**: Requires Node.js 18+ and npm 8+

### Package Structure

```
metacoding/
├── bin/metacoding.js          # CLI entry point
├── lib/                       # Compiled TypeScript
│   ├── cli.js                # Main CLI logic
│   ├── commands/             # Command implementations
│   ├── services/             # Core services
│   └── types/                # Type definitions
├── templates/                # Template files
└── package.json              # Package configuration
```

## Integration Points

### GitHub Copilot Integration

- **Custom Instructions**: Leverages GitHub Copilot's instruction file system
- **Automatic Context**: Files automatically apply based on editing context
- **Workflow Enforcement**: Instructions enforce development best practices
- **Manual Attachment**: Users can manually attach specific instruction files

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
- **Plugin Architecture**: Extensible command system
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

- **typescript v5.3.2**: TypeScript compiler and type definitions
- **jest v29.7.0**: Testing framework for unit and integration tests
- **ts-jest v29.1.1**: TypeScript support for Jest
- **eslint v8.54.0**: Code linting and style enforcement
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
- **React Template**: Frontend-specific with React, hooks, and component patterns
- **Node.js Template**: Backend-specific with API, database, and server patterns
- **Python Template**: Python-specific with Django/Flask/FastAPI patterns

### Template Architecture

Each template contains:

- `template.json`: Configuration and metadata
- `copilot-instructions.md.template`: Main instruction file with variable substitution
- Instruction files: `test-runner.instructions.md`, `release.instructions.md`, `docs-update.instructions.md`, `code-review.instructions.md`

### Documentation Standards and Best Practices

#### Test Documentation Standards

The project has implemented standardized test case documentation using table format:

**Required Table Format:**

```markdown
| Test Case ID  | Description                                 | Type | Status    |
| :------------ | :------------------------------------------ | :--- | :-------- |
| AREA-TYPE-001 | Brief but descriptive test case description | Unit | Completed |
```

**Test Case Naming Conventions:**

- **Format**: `[AREA]-[TYPE]-[NUMBER]`
- **Language-Specific Area Prefixes**:
  - **React/Frontend**: COMP, HOOK, PAGE, STORE, API, UTIL, AUTH, FORM
  - **Node.js/Backend**: API, SRV, DB, MW, AUTH, ROUTE, UTIL, CONFIG
  - **Python/Django**: VIEW, MODEL, FORM, MW, AUTH, UTIL, CMD, CONFIG
  - **General**: CORE, API, UI, DB, AUTH, UTIL, CONFIG
- **Type Suffixes**: UNIT, INT, E2E
- **Sequential Numbering**: 001, 002, 003, etc.

**Examples by Language:**

- React: `COMP-UNIT-001`, `HOOK-UNIT-001`, `API-INT-001`
- Node.js: `API-UNIT-001`, `SRV-UNIT-001`, `DB-INT-001`
- Python: `VIEW-UNIT-001`, `MODEL-UNIT-001`, `AUTH-INT-001`

#### Instruction Template Standards

All instruction files follow generalized patterns:

- **Reusable Templates**: Instructions work for any project using our methodology
- **Language-Specific Guidance**: Area prefixes adapted to common patterns in each language/framework
- **Consistent Structure**: Standardized sections across all instruction types
- **Anti-Pattern Prevention**: Clear guidance on what to avoid in documentation
- **Workflow Enforcement**: 7-step mandatory development process embedded in all templates

#### Template Implementation Status

All templates are fully implemented and tested:

- **General Template**: Universal instructions for any project type
- **React Template**: Frontend-specific with React, hooks, and component patterns
- **Node.js Template**: Backend-specific with API, database, and server patterns
- **Python Template**: Python-specific with Django/Flask/FastAPI patterns

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

---

**Last Updated**: June 2025
**Document Version**: 1.2
**Review Schedule**: Monthly or with major releases
