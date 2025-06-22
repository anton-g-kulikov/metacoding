# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-21

### Added

- **NPM Package Distribution**: Complete transformation from manual file copying to professional npm package
- **Interactive CLI Tool**: `metacoding` command with init, validate, and update subcommands
- **Template System**: Configurable templates for different project types (general, react, node, python)
- **Project Detection**: Automatic detection of project type, tech stack, and existing configuration
- **VS Code Integration**: Automatic VS Code settings configuration for GitHub Copilot
- **Interactive Setup**: Guided project configuration with prompts for project details
- **TypeScript Implementation**: Full TypeScript codebase with comprehensive type definitions
- **Test Suite**: Unit and integration tests with >80% coverage target
- **Professional CLI Experience**: Color output, progress indicators, and helpful error messages

### Changed

- **Installation Method**: From manual file download to simple `npm install -g metacoding`
- **Setup Process**: From 6-step manual process to single `metacoding init` command
- **User Experience**: From error-prone manual setup to guided, validated automation
- **Template Processing**: Dynamic variable substitution for project-specific customization
- **File Management**: Automatic directory creation, file validation, and conflict resolution

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

## [Unreleased]

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

### Enhanced

- Code quality through mandatory TDD approach
- Documentation accuracy with status-transparent language
- Team collaboration with consistent workflow enforcement
- Risk mitigation through incremental, tested changes

## [1.0.0] - 2025-06-21

### Added

- Initial project structure
- Core documentation files
- Basic instruction templates
