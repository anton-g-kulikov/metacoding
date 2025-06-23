# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
