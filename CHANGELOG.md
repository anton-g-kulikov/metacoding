# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2024-12-26

### Added

- **Enhanced Workflow Instructions**: Comprehensive workflow guidance for AI agents
  - **Detailed Step Progression**: Added clear step-by-step workflow with automatic continuation
  - **Single-Task Focus Enforcement**: Enhanced scope creep management with proper response templates  
  - **Documentation-First Principle**: Made documentation completion mandatory before implementation
  - **Quality Gates**: Added workflow completion checks and quality assurance measures
  - **Repeated Task Checklist Guidance**: Added template-based approach for recurring processes

### Changed

- **Improved Copilot Instructions Template**: Enhanced workflow enforcement and consistency
  - **Automatic Step Progression**: Added "After completing Step X" guidance for each workflow step
  - **Enhanced Scope Management**: Improved blocking vs non-blocking request handling
  - **Confirmation Gates**: Enhanced user approval requirements before proceeding
  - **Task Documentation Requirements**: Strengthened mandatory documentation-first workflow

### Technical

- **Template Improvements**: All instruction templates now include enhanced repeated task sections
- **Test Coverage**: Added comprehensive test coverage for workflow enhancement features
- **Documentation**: Updated all language-specific instruction templates with checklist guidance

## [1.4.0] - 2024-12-26

### Changed

- **Universal GitIgnore Handling**: Standardized gitignore management across all templates
  - **Unified Approach**: Removed template-specific .gitignore files in favor of universal patterns
  - **AI Assistant Focus**: GitIgnore patterns now focus exclusively on AI assistant instruction files
  - **Append-Only Logic**: GitIgnore patterns are appended to user's existing .gitignore when not present
  - **Template Cleanup**: Removed empty /files directories from all templates after gitignore consolidation

### Breaking Changes

- **Template Structure**: Templates no longer include template-specific .gitignore files
- **Files Directory**: Removed empty /files directories from all language templates

## [1.3.0] - 2024-12-26

### Added

- **JavaScript Template Support**: Complete JavaScript project template with modern development standards
  - **ES6+ Standards**: Modern JavaScript coding conventions with async/await patterns
  - **Node.js Integration**: Runtime considerations and npm ecosystem best practices
  - **Testing Framework Support**: Comprehensive guidance for Jest, Mocha, and Vitest
  - **Build Tool Integration**: Webpack, Vite, and other modern build tool considerations
  - **Browser Compatibility**: Cross-browser development guidelines and polyfill strategies
  - **CLI and Cursor IDE Compatibility**: Full support for both VS Code + GitHub Copilot and Cursor IDE workflows

### Enhanced

- **Template Manager**: Improved instruction file loading with proper JavaScript support
- **Test Coverage**: Expanded test suite with 12 JavaScript template-specific tests
- **Documentation**: Updated system documentation with JavaScript template capabilities

## [1.2.1] - 2025-01-09

### Changed

- Updated package dependencies and documentation
- Improved code quality and test coverage maintenance
- Enhanced npm publishing workflow

## [1.2.0] - 2025-06-25

### Added

- **Cursor IDE Support**: Complete integration with Cursor IDE for AI-assisted development
  - **New CLI Flags**: Added `--vscode` and `--cursor` flags for direct AI assistant setup
  - **Interactive AI Selection**: Interactive prompts to choose between VS Code + GitHub Copilot or Cursor IDE
  - **Cursor File Generation**: Automatic generation of `workflow.cursorrules` and `.cursor/rules/*.mdc` files
  - **Content Transformation**: Smart conversion of VS Code instruction content for Cursor IDE compatibility
  - **Template Variable Substitution**: Dynamic replacement of project variables in generated Cursor workflows
  - **Non-Intrusive Approach**: Uses `workflow.cursorrules` to respect existing user `.cursorrules` configurations
  - **Safe Installation**: Conflict detection and backup functionality for existing files
  - **Cross-Platform Support**: Full compatibility across different operating systems
  - **Comprehensive Testing**: 56 new tests covering CLI integration, end-to-end workflows, and unit functionality

### Changed

- **Multi-AI Assistant Support**: Updated CLI and documentation to support both GitHub Copilot and Cursor IDE workflows
- **Enhanced Template System**: Extended TemplateManager to support multiple AI assistant file formats
- **Updated Documentation**: Comprehensive updates to README.md, API documentation, and troubleshooting guides
- **CLI Interface**: Enhanced `metacoding init` command with AI assistant selection prompts and validation

### Technical Details

- **New Services**: Added CursorService for Cursor-specific file management and content transformation
- **File Structure Support**: Added support for `.mdc` (Markdown + Code) file format with proper frontmatter
- **Template Integration**: Enhanced template system to generate appropriate files for chosen AI assistant
- **Error Handling**: Robust error handling for conflicting flags and invalid configurations
- **Documentation Architecture**: Maintains clear separation between system documentation and Cursor-specific guides

## [1.1.4] - 2025-06-23

### Added

- **Automatic .gitignore Management**: New GitIgnoreManager service ensures AI coding assistant files are excluded from version control
  - **Append-Only Strategy**: Preserves existing user .gitignore configurations while adding essential exclusions
  - **Minimal Pattern Focus**: Only excludes files that metacoding actually creates (not broad AI assistant patterns)
  - **Template Integration**: Simplified to single general .gitignore template for all project types
  - **Init Command Integration**: Automatically updates .gitignore during project setup
  - **Essential Exclusions**:
    - `.github/copilot-instructions.md`
    - `.github/instructions/`
    - `.vscode/copilot-instructions.md`
    - `.idea/copilot-instructions.md`
  - **Clear Section Marker**: Uses `# metacoding: AI coding assistant exclusions` for easy identification
  - **Duplicate Detection**: Skips adding patterns that already exist in the file

### Changed

- **Template System Simplification**: Removed redundant template-specific .gitignore files in favor of unified approach
- **Architecture Documentation**: Added ADR-007 documenting .gitignore handling strategy and design decisions

## [1.1.3] - 2025-06-23

### Changed

- **README.md Synchronization**: Updated README.md to match current CLI implementation
  - Removed references to deprecated `validate` command (functionality now integrated into `update --dry-run`)
  - Updated CLI examples to reflect actual available commands (`init` and `update`)
  - Enhanced troubleshooting section with correct command usage
  - Synchronized npm package documentation with GitHub repository version

## [1.1.2] - 2024-12-19

### Added

- **Update Command**: Complete `metacoding update` command implementation with validation and conflict resolution
  - **Validation Mode**: Added `--dry-run` flag for comprehensive setup validation without making changes
  - **Strict Validation**: Added `--strict` flag for enhanced validation rules and detailed reporting
  - Automatic template detection from existing project files and configuration
  - Safe backup system with timestamped full directory backup for complete rollback protection
  - Simple conflict resolution: user chooses to keep their version (saved as `user.filename`) or replace with template
  - No interactive diff - clean, user-controlled choices only
  - Force mode for automated updates without conflict prompts
  - Complete integration with existing template system and VS Code settings
  - Comprehensive error handling, progress feedback, and validation reporting
  - **Removed**: Separate `validate` command - all validation integrated into `update --dry-run`

## [1.1.1] - 2025-06-22

### Fixed

- **General Template TypeScript Support**: Fixed issue where selecting TypeScript with general template loaded all language-specific instruction files instead of only TypeScript files
- **Template System**: Updated loadInstructionFiles method to properly filter instruction files based on technology choices
- **Build Configuration**: Fixed TypeScript configuration to exclude test files from production build

### Changed

- **Package Build**: Improved TypeScript compilation configuration for cleaner npm package output

## [1.1.0] - 2025-06-22

### Added

- **Mandatory Development Workflow**: 7-step enforced process for all development tasks
  - Task understanding and planning with user confirmation
  - Task management with status tracking
  - Test-Driven Development (TDD) approach
  - Implementation and verification steps
  - Documentation and status updates
  - Version control requirements
  - Workflow completion checks
- **Status Transparency Guidelines**: Documentation standards for clear status indication
  - Prohibition of "planned" or "to-do" in titles and headers
  - Standardized status indicators (✅ 🚧 ❌ ⚠️ 🔄)
  - Checkbox format for task status tracking
  - Present-tense headers reflecting current state
- **Workflow Enforcement Rules**: Quality gates and violation handling procedures
- **Enhanced Role and Persona**: Updated to emphasize strict workflow adherence
- **Instruction File Architecture**: Implemented composable instruction system eliminating duplication
  - Created shared TypeScript instruction component for Node.js and React templates
  - Established single source of truth for universal instruction files
  - Built template inheritance system for automatic instruction composition
  - Achieved clean separation of concerns with maintainable architecture

### Changed

- **Main Template**: Updated `copilot-instructions.md` with comprehensive workflow section
- **Documentation Instructions**: Enhanced `docs-update.instructions.md` with status guidelines
- **README**: Expanded to include workflow details and status transparency standards
- **File Structure**: Added `/_meta` and `/test` directories for task and test documentation

### Fixed

- **Template Architecture Duplication**: Eliminated duplication of TypeScript instruction files across templates
  - Removed duplicated files from `/general/`, `/node/`, and `/react/` templates
  - Implemented single source of truth principle for shared instruction components
  - Fixed maintenance overhead from keeping multiple copies of identical files synchronized

### Enhanced

- **Template Inheritance System**: Implemented composable instruction file architecture
  - Node.js and React templates now automatically inherit TypeScript instructions
  - Template loading follows hierarchical order: universal → shared language → template-specific
  - Template manager excludes shared components from standalone template selection
- **Maintainability**: Architectural improvements reduce long-term maintenance burden
  - Changes to shared instructions automatically propagate to dependent templates
  - Clean separation of concerns with each directory containing only relevant files
  - Single source of truth for all TypeScript-related development guidance
- **Code Quality**: Mandatory TDD approach with comprehensive workflow enforcement
- **Documentation Standards**: Status-transparent language and clear architectural documentation
- **Team Collaboration**: Consistent workflow enforcement across all development tasks
- **Risk Mitigation**: Incremental, tested changes with proper validation gates

## [1.0.0] - 2025-06-21

### Added

- **NPM Package Distribution**: Complete transformation from manual file copying to professional npm package
- **Interactive CLI Tool**: `metacoding` command with init, validate, and update subcommands
- **Template System**: Configurable templates for different project types (general, react, node, python)
- **Project Detection**: Automatic detection of project type, tech stack, and existing configuration
- **VS Code Integration**: Automatic VS Code settings configuration for GitHub Copilot
- **Interactive Setup**: Guided project configuration with prompts for project details
- **TypeScript Implementation**: Full TypeScript codebase with comprehensive type definitions
- **Test Suite**: Unit and integration tests with >80% coverage target achieved
- **Professional CLI Experience**: Color output, progress indicators, and helpful error messages

### Changed

- **Installation Method**: From manual file download to simple `npm install -g metacoding`
- **Setup Process**: From 6-step manual process to single `metacoding init` command
- **User Experience**: From error-prone manual setup to guided, validated automation
- **Template Processing**: Dynamic variable substitution for project-specific customization
- **File Management**: Automatic directory creation, file validation, and conflict resolution

### Fixed

- **Template Architecture**: Updated all tests to match current template directory structure
- **File Organization**: Removed obsolete `/files/` subdirectories from template structure
- **Test Coverage**: All 13 test suites and 140 tests now pass with comprehensive coverage
- **Naming Conventions**: Updated test expectations to match actual instruction file names

### Technical Details

- **Dependencies**: Commander.js for CLI, Inquirer for prompts, Chalk for colors, fs-extra for file operations
- **Build System**: TypeScript compilation with source maps and declarations
- **Testing**: Jest test framework with coverage reporting
- **Code Quality**: ESLint, Prettier, and strict TypeScript configuration
- **Distribution**: Professional npm package with proper semver and release management

### Breaking Changes

- **Installation**: Manual setup method is deprecated in favor of npm package
- **File Structure**: Templates now use `{{VARIABLE}}` syntax instead of `[placeholder]` format

### Migration Guide

Existing manual installations can be migrated by:

1. Installing the npm package: `npm install -g metacoding`
2. Running `metacoding validate` to check current setup
3. Running `metacoding update` to migrate to latest format
