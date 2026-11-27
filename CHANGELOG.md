# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Companion skills, installed next to `metacoding-workflow` and usable on their own:
  - `metacoding-shape`: a scope interview that separates facts (the agent looks them up) from decisions (the user answers), asks in rounds of numbered questions with a recommended answer each, and closes with a summary of the decisions, terms and assumptions. It writes no file, so it can be used as a plain interview
  - `metacoding-spec`: turns the settled decisions into a scope summary, gets it confirmed, and writes the records. The summary states the solution and the tickets it is sliced into; each ticket is a vertical slice
  - `metacoding-tdd`: test-first building, one behavior at a time, with guidance on what a good test looks like and on test doubles
  - `metacoding-review`: a two-axis review of the diff against the confirmed scope and the repo's standards, with a fixed list of code smells for what those standards leave open, two of them about the shape of the code: a function or module that only passes calls on, and an interface or abstract type with one implementation that nothing swaps for another
  - `metacoding-debug`: reproduce-first diagnosis that ends in a regression test and a fix, and masks credentials and personal data in what it captures
  - `metacoding-design`: code-design guidance with four terms (module, interface, depth, seam) and seven rules on deep modules, small interfaces and where a seam belongs. The workflow uses it when a solution adds a module or changes an interface, when the interface to test through is unclear or missing, and when code is restructured after its tests are green. Run on its own, it proposes an interface for new code or lists candidates for change in existing code, and changes no file
  - `metacoding-retro`: after the last ticket of a task, or on request, it turns the mistakes that cost rework and would happen again into lessons, proposes one lasting change for each (a check before a rule), and changes nothing until the user answers. A new rule goes where the repo keeps its standards, and an installed metacoding skill is never edited
- `metacoding-onboard`, a skill run once per repo. It looks for where the repo keeps its tracker, specs, glossary and decision records, asks one round of numbered questions with a recommended place for each, and writes the answers to a project map at `.metacoding/project.md` once the user confirms. It records the places and creates none of them. With the user's yes, it adds a one-line pointer to the project map in an instruction file the repo already has, such as `CLAUDE.md` or `AGENTS.md`
- The workflow reads the project map while grounding, and `metacoding-shape` reads it before its first round. Where it names a place for the tracker, the specs, the glossary or the decision records, that place is used, and created there when a task first needs it. A place it has no line for falls back to the repo's own place, or to the `/_meta` default
- In a repo with no project map, the workflow says in one line that `metacoding-onboard` can record the places, then carries on
- `metacoding-onboard` closes by telling the user how to work from here: what it wrote, how to start a task, and what each installed metacoding skill is for, taken from each skill's own description
- The "Next steps" that `metacoding init` prints say to run `metacoding-onboard` first, before any task
- A default home for a repo's coding standards at `/_meta/coding-standards.md`: the rules that no automated check enforces. `metacoding-retro` proposes the file with the first new rule when the repo keeps its standards nowhere, and a retro can also add a glossary term or a decision record
- User stories in the scope summary: `metacoding-spec` writes behavior a role can observe as stories grouped by role, each with Given/When/Then scenarios, in place of success criteria and test intent. Each scenario has an ID made of its feature area's prefix and a number, and each ticket names the scenarios it delivers. A task without such behavior keeps success criteria and test intent. A role is settled in the interview like any other term
- A review step in the workflow, between verification and artifact updates
- Ticket-by-ticket building: the workflow runs build, verify, review, artifact updates and close once per ticket, ticks the ticket off, and waits for the user's go before the next. For the last ticket, the review also checks the whole change against the task spec
- Resuming a task: grounding looks for a task spec still in progress, and a request that continues its task starts at the first ticket not yet done, with the task spec as the agreed scope
- A change to a task spec in progress is confirmed by the user and written into the task spec, with its date, before it is built
- The records that shaping writes (glossary terms, decision records, the task spec) are committed on their own before the build, when VCS work is in scope. So is a confirmed change to a task spec in progress
- A project glossary at `/_meta/glossary.md`: read while grounding. A term settled during shaping is listed in the scope summary and written once the summary is confirmed
- A bar for decision records in `/_meta/architecture-decisions.md` (hard to reverse, surprising without context, a real trade-off). The scope summary marks qualifying decisions with `[record]`, and they are written once the summary is confirmed
- Feature specs at `/_meta/specs/<area>.md`: the living document of one feature area, with an ID prefix, a Solution section that says how the area works today, and its stories by role with their scenarios in `gherkin` blocks. When a ticket is done, its scenarios are written into the feature spec of their area; a changed scenario replaces the old text under its ID, and a removed one leaves with its test. A feature spec starts with the first task that delivers a scenario in its area, with no backfill
- The workflow reads the feature specs of the areas a task touches while grounding and updates them in its artifact step, before the ticket is marked done, so that the change to a feature spec is part of its ticket's commit. A task is not complete until the scenarios it delivered are in the feature specs
- Task specs at `/_meta/specs/tasks/<date>-<slug>.md`: `metacoding-spec` writes the confirmed scope summary as a task spec when a task has more than one ticket or a decision marked `[record]`. The tickets are a checklist in the task spec unless the repo already has a tracker
- A plugin install for Claude Code: the repo is a plugin and its own marketplace, so Claude Code installs the skills from it without the CLI. The plugin has the version of the npm package
- A plugin install for Codex and for Antigravity, from the same repo and with the same version. Both follow the agents' documentation and are not yet tried on a real install

### Changed

- `metacoding-workflow` is now an orchestrator: it keeps the step order, grounding, verification, artifact rules and close-out, and calls the companion skills for the shape, build, debug and review steps, and for the retro that follows the last ticket
- `metacoding init` and `metacoding update` install and sync every packaged skill; `update` adds the skills an existing install lacks
- The `.gitignore` section now uses `metacoding-*/` patterns per agent so it covers every skill
- **Claude Code now installs as a skill** at `.claude/skills/metacoding-workflow/` instead of a subagent at `.claude/agents/metacoding-workflow.md` with a support bundle in `.claude/metacoding-workflow/`. A subagent cannot question the user directly, which blocked the scope interview
- `metacoding update` migrates the old Claude Code layout: it backs up the subagent files, installs the skill, removes the old files, and adds the new path to an existing metacoding `.gitignore` section
- `metacoding update --dry-run` fails with a migration hint when only the old Claude Code layout is present
- `metacoding init` and `metacoding update` fill in exclusion patterns that an existing metacoding `.gitignore` section lacks
- The workflow now waits for the user to confirm the scope summary before any file changes, instead of confirming only broad or risky changes
- The workflow no longer refuses to switch tasks. When the user asks for something unrelated mid-task, it says what is unfinished and the user decides: queue the request, or pause the task at a ticket boundary and switch. For a switch at once, it sets the unfinished work aside and notes what is left
- `metacoding update --dry-run` requires the `SKILL.md` of every skill and, for Codex, checks the `agents/openai.yaml` of every skill instead of the workflow skill's alone, and names a file that is not valid YAML
- `metacoding update --dry-run --strict` fails when `.gitignore` lacks any metacoding exclusion pattern, including when there is no `.gitignore`, and names the missing patterns for the user to add. It used to check only for the section header
- `metacoding update` removes the files an earlier version installed and this one no longer ships (`assets/templates/test-plan.md`, `references/interview.md`, the five language references, and the files of `metacoding-interview/`), once they are backed up. Files you added next to them are kept
- The description of `metacoding-workflow`, which an agent reads to decide when to load the skill, applies only when the user asks for the metacoding workflow or for a task to be run with its gates. It used to name feature work, bug fixes, refactors and reviews, which matched almost any coding request
- CLI help and messages say "skills" where they said "workflow skill"
- The default project description for a new install is "A project using the metacoding skills"
- Installs skip `.DS_Store` files
- `task-entry.md` now carries the scope summary fields, including the stories
- The confirmed scope of a task that needs no task spec is recorded where the repo already tracks work; otherwise the confirmed summary in the conversation is the record
- The workflow skill reads `references/project-context.md` only when it exists. Without the file, it finds the project's type, tech stack, and test and build commands in the repo, so the skills work in a plugin install
- The workflow skill says that a companion skill's name carries the plugin's prefix in a plugin install, such as `metacoding:metacoding-shape`

### Removed

- `skills/vendor-templates/claude-agent.md.template`, the Claude Code subagent entrypoint
- The prescribed `/_meta/project-task-list.md` and `/test/test-documentation.md`. A repo that already keeps either still gets it updated; the workflow no longer creates them. A task that needs one gets a task spec instead
- The `test-plan.md` template. Scenarios, or the test intent of a task without stories, now live in the scope summary. `metacoding update` removes the copy an existing install has
- The five language references (`references/typescript.md`, `javascript.md`, `node.md`, `react.md` and `python.md`) and the "Recommended References" section of `project-context.md`. The references restated the workflow rules in general terms, and the section repeated a list the skill already holds. `metacoding update` removes the copies an existing install has
- The legacy `templates/` and `workflow/` folders from the 1.x instruction-file generator, which the package does not ship

### Fixed

- `metacoding update` keeps the project name, description, tech stack and project type entered at `init`. It used to rebuild `project-context.md` from detected defaults, which replaced those answers and reported the file as locally edited on every update
- `metacoding update` no longer reports an untouched `node` install as locally edited; `init` and `update` disagreed about its default build tool

## [2.0.1] - 2026-03-28

### Fixed

- Removed the last legacy `assistant-adapter` service that was still compiled during `prepublishOnly`
- Restored a clean 2.x build surface so `npm run build` and `npm publish` no longer pull in obsolete multi-assistant types

## [2.0.0] - 2026-03-28

### Added

- Vendor-specific workflow skill installs for Codex, Claude Code, and Antigravity
- `--vendor all` support for mixed-agent team repositories
- Shared workflow skill references for repository organization, mandatory TDD, and MECE documentation
- Release-prep checklist entry for the 2.0.0 migration

### Changed

- Reframed `metacoding` from editor instruction-file generation to a cross-agent workflow skill package
- `metacoding init` now installs vendor-specific skill layouts instead of `.github` or `.cursor` instruction files
- `metacoding update` now syncs installed vendor skill bundles instead of regenerating IDE-specific outputs
- Project context generation now hard-links workflow and repository-organization references
- Package publish surface now ships `skills/` instead of `templates/`
- Package entrypoints now point to `lib/cli.js` and `lib/cli.d.ts`

### Removed

- Cursor, VS Code, and template-manager installation paths from the active product
- Legacy editor-specific generation tests and services
- Obsolete optional `vscode` peer dependency metadata

### Breaking Changes

- This release replaces the previous Copilot/Cursor instruction-file product with vendor-specific workflow skills
- `metacoding init --vscode`, `metacoding init --cursor`, and the previous `.github` / `.cursor` generation model are no longer supported
- Consumers relying on the old package `main`/`types` entrypoints should treat v2 as a breaking upgrade and use the CLI surface

### Migration

- Reinstall repositories with `metacoding init --vendor <vendor>` or `metacoding init --vendor all`
- Treat workspace skill directories as the new source of repo-local agent guidance:
  - `.codex/skills/metacoding-workflow/`
  - `.claude/agents/metacoding-workflow.md` and `.claude/metacoding-workflow/`
  - `.agents/skills/metacoding-workflow/`

## [1.5.1] - 2025-10-12

### Changed

- Removed 26 obsolete Cursor integration tests (17 e2e + 9 integration tests)
- Improved test organization and reduced test suite maintenance burden
- All tests now reflect new multi-assistant architecture from v1.5.0

### Technical Notes

- Test suite reduced from 260 to 234 tests (all passing at 100%)
- Removed legacy `.cursor/rules/` directory structure tests
- AssistantAdapterService behavior fully validated in remaining test suites

## [1.5.0] - 2025-10-12

### Added

- **Multi-Assistant Support**: Expanded support beyond GitHub Copilot to include Claude Code, Codex/OpenAI, and Gemini Code Assist

  - **Claude Code Integration**: Added `CLAUDE.md` configuration file with "project instructions" terminology
  - **Codex/OpenAI Integration**: Added `AGENTS.md` configuration file with "system message" format
  - **Gemini Code Assist Integration**: Added `GEMINI.md` configuration file with "style guide" format
  - **Environment Selection**: New two-tiered selection flow (IDE vs Terminal, then assistant choice)
  - **IntelliJ IDEA Support**: Added IntelliJ as supported IDE for Gemini Code Assist

- **Canonical Workflow System**: Implemented single source of truth for development workflow

  - **workflow/core.md**: Canonical 7-step development workflow shared across all assistants
  - **Vocabulary Adaptation**: Same workflow semantics with assistant-specific terminology
  - **Template Integration**: All assistant adapters reference canonical workflow content

- **AssistantAdapterService**: New service for multi-assistant configuration management

  - **File Generation**: Creates appropriate configuration files based on user selections
  - **Variable Substitution**: Replaces placeholders with project-specific values (name, tech stack, environment)
  - **Migration Detection**: Identifies existing assistant configurations for migration
  - **Workflow Injection**: Injects canonical workflow content into all assistant configs

- **Enhanced CLI Options**: New command-line flags for flexible setup

  - `--environment <ide|terminal>`: Specify IDE or Terminal environment
  - `--ide <vscode|cursor|intellij>`: Select IDE for IDE environment
  - `--assistants <copilot|claude|codex|gemini|all>`: Choose which assistants to configure
  - Backward compatibility maintained with legacy `--vscode` and `--cursor` flags

- **JavaScript Template**: Added comprehensive JavaScript template with ES6+ patterns (6 total templates now)

### Changed

- **CLI Flow Enhancement**: Redesigned init command with environment-based assistant selection
- **Template System**: Enhanced to support multi-assistant file generation
- **System Documentation**: Updated comprehensive system documentation to reflect multi-assistant architecture
- **Package Structure**: Added templates/assistants/ directory and workflow/ directory

### Technical

- Added assistant adapter templates in `templates/assistants/` directory
- Implemented AssistantAdapterService with comprehensive file generation logic
- Updated InitCommand with getEnvironmentChoice(), getIdeChoice(), getAssistantChoices() methods
- Enhanced TypeScript types with AssistantType, AssistantConfig interfaces
- Comprehensive test coverage: 253 test cases (218 passing, 35 requiring migration to new system)

### Documentation

- Updated system documentation with Multi-Assistant Support Architecture section
- Enhanced README with multi-assistant setup instructions
- Added canonical workflow documentation in workflow/core.md
- Updated package distribution documentation

## [1.4.3] - 2025-06-26

### Fixed

- Fixed critical bug where `metacoding init --cursor` was creating both `.github` and `.cursor` files instead of only `.cursor` files
- Cursor IDE initialization now properly skips `.github` file creation when `ideChoice` is `'cursor'`
- Added `ideChoice` parameter to `ProjectConfig` interface for conditional file creation
- Improved IDE choice validation and template processing logic

### Changed

- Enhanced IDE choice handling in `TemplateManager.loadInstructionFiles()` method
- Updated `InitCommand` to pass IDE choice through project configuration
- Comprehensive test coverage for IDE choice functionality (253/253 tests passing)

### Technical

- Added conditional file creation based on IDE choice (VS Code: `.github` only, Cursor: skip `.github` files)
- Fixed template manager to handle IDE-specific file generation properly
- Ensured Cursor setup only creates `.cursor/rules/*.mdc` files as intended

- **Cursor IDE File Creation Bug**: Fixed `metacoding init --cursor` incorrectly creating both `.github` and `.cursor` files
  - **IDE-Specific Generation**: Cursor setup now only creates `.cursor/rules/*.mdc` files, not `.github` instruction files
  - **VS Code Compatibility**: VS Code setup (default) continues to only create `.github` instruction files
  - **Conditional Logic**: Added `ideChoice` parameter to control file generation based on selected IDE
  - **Backward Compatibility**: Existing VS Code setups remain unaffected by changes
  - **Comprehensive Testing**: Added unit, integration, and E2E tests to prevent regression

## [1.4.2] - 2024-12-26

### Fixed

- **Cursor Workflow Rules Generation**: Fixed workflow.mdc file generation to only include copilot-instructions.md content
  - **Single Source Logic**: workflow.mdc now mirrors only the general copilot-instructions.md template instead of merging all instruction files
  - **Deduplication**: Eliminated duplicate content that was causing the workflow.mdc file to be unnecessarily large
  - **Clean Output**: Reduced workflow.mdc file size and complexity while maintaining all essential workflow guidance
  - **Pattern-Specific Rules**: Preserved existing logic for generating pattern-specific .mdc files (e.g., typescript.mdc, python.mdc)

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
