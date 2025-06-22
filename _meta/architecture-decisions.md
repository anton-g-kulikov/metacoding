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

## Future ADRs

### Planned Decisions

- **ADR-007**: Multi-IDE support architecture
- **ADR-008**: Plugin system design
- **ADR-009**: Web-based template generator integration
- **ADR-010**: Enterprise features and team collaboration

---

**Document Maintenance**: Update this file when making significant architectural decisions. Link to relevant GitHub discussions and issues where applicable.
