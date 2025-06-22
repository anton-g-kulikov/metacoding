# metacoding NPM Package - Test Documentation

## Overview

This document tracks test cases for the metacoding npm package CLI tool, following test-driven development (TDD) practices in accordance with our own documentation guidelines.

## Current Test Status

- **Test Suite Status**: All tests passing (40/40)
- **Template Coverage**: React, Node.js, Python, General templates tested
- **CLI Integration**: All commands tested end-to-end
- **Code Quality**: TypeScript compilation and linting passing

## Testing Strategy

Our testing approach follows the architecture decisions documented in `_meta/architecture-decisions.md`:

- **Unit tests** for individual services and utilities (filesystem, template management)
- **Integration tests** for complete command workflows (init command end-to-end)
- **Temporary directories** for safe file system testing
- **Mock implementations** for external dependencies (VS Code settings)
- **Jest framework** with TypeScript support for type safetyg NPM Package - Test Documentation

## Overview

This document tracks test cases for the metacoding npm package CLI tool, following test-driven development (TDD) practices.

## Test Status Summary

✅ **All tests passing** (12/12)  
✅ **Branding update completed** - All references updated from "MetaCoding" to "metacoding"  
✅ **Folder structure updated** - Renamed meta/ to \_meta/ for better organization

## React Template Test Cases

### Template Structure Tests

- [ ] React template directory validation
  - **Scope**: `templates/react/` directory structure
  - **Requirements**: Directory contains template.json and files/ subdirectory
  - **Status**: ✅ Implemented and passing

### Template Configuration Tests

- [ ] React template.json validation
  - **Scope**: React template configuration file
  - **Requirements**: Valid JSON with React-specific metadata
  - **Status**: ✅ Implemented and passing

### React Instruction Files Tests

- [ ] React-specific Copilot instructions generation
  - **Scope**: React template with variables
  - **Requirements**: Generated React-focused instruction files
  - **Status**: ✅ Implemented and passing

### Template Manager Integration Tests

- [ ] React template detection and selection
  - **Scope**: Project with package.json containing React dependencies
  - **Requirements**: React template automatically suggested/selected
  - **Status**: ✅ Implemented and passing

### CLI Integration Tests

- [ ] Init command with React template selection
  - **Scope**: `metacoding init` with React project type selection
  - **Requirements**: React-specific instruction files generated in .github/
  - **Status**: ✅ Implemented and passing

## Node.js Template Test Cases

### Template Structure Tests

- [ ] Node.js template directory validation
  - **Scope**: `templates/node/` directory structure
  - **Requirements**: Directory contains template.json and files/ subdirectory with all instruction files
  - **Status**: ✅ Implemented and passing

### Template Configuration Tests

- [ ] Node.js template.json validation
  - **Scope**: Node.js template configuration file
  - **Requirements**: Valid JSON with Node.js-specific VS Code settings and metadata
  - **Status**: ✅ Implemented and passing

### Node.js Instruction Files Tests

- [ ] Node.js-specific Copilot instructions generation
  - **Scope**: Node.js template with backend-specific variables
  - **Requirements**: Generated Node.js-focused instruction files with API development patterns
  - **Status**: ✅ Implemented and passing

- [ ] Backend-specific code review instructions
  - **Scope**: Node.js code review template
  - **Requirements**: Instructions include API security, database optimization, and server performance checks
  - **Status**: ✅ Implemented and passing

- [ ] Node.js test runner instructions
  - **Scope**: Node.js test runner template
  - **Requirements**: Instructions include Jest/Mocha patterns, API testing, and temporary file cleanup
  - **Status**: ✅ Implemented and passing

### Template Manager Integration Tests

- [ ] Node.js template detection and selection
  - **Scope**: Project with package.json containing Node.js/Express dependencies
  - **Requirements**: Node.js template automatically suggested/selected
  - **Status**: ✅ Implemented and passing

### CLI Integration Tests

- [ ] Init command with Node.js template selection
  - **Scope**: `metacoding init` with Node.js/Backend project type selection
  - **Requirements**: Node.js-specific instruction files generated in .github/instructions/
  - **Status**: ✅ Implemented and passing

### Workflow Enforcement Tests

- [ ] 7-step mandatory workflow in Node.js template
  - **Scope**: Node.js template Copilot instructions
  - **Requirements**: All instruction files enforce the mandatory development workflow
  - **Status**: ✅ Implemented and passing

### File Management Tests

- [ ] Temporary file cleanup instructions for Node.js
  - **Scope**: Node.js template instruction files
  - **Requirements**: Comprehensive guidance for cleaning Node.js build artifacts, logs, and temporary files
  - **Status**: ✅ Implemented and passing

## Python Template Test Cases

### Template Structure Tests

- [ ] Python template directory validation
  - **Scope**: `templates/python/` directory structure
  - **Requirements**: Directory contains template.json and files/ subdirectory with all instruction files
  - **Status**: ✅ Implemented and passing

### Template Configuration Tests

- [ ] Python template.json validation
  - **Scope**: Python template configuration file
  - **Requirements**: Valid JSON with Python-specific VS Code settings and metadata
  - **Status**: ✅ Implemented and passing

### Python Instruction Files Tests

- [ ] Python-specific Copilot instructions generation
  - **Scope**: Python template with Django/Flask/FastAPI-specific variables
  - **Requirements**: Generated Python-focused instruction files with web framework patterns
  - **Status**: ✅ Implemented and passing

- [ ] Python-specific code review instructions
  - **Scope**: Python code review template
  - **Requirements**: Instructions include Django security, ORM optimization, and Python performance checks
  - **Status**: ✅ Implemented and passing

- [ ] Python test runner instructions
  - **Scope**: Python test runner template
  - **Requirements**: Instructions include pytest patterns, Django testing, and temporary file cleanup
  - **Status**: ✅ Implemented and passing

### Template Manager Integration Tests

- [ ] Python template detection and selection
  - **Scope**: Project with requirements.txt or pyproject.toml containing Python/Django dependencies
  - **Requirements**: Python template automatically suggested/selected
  - **Status**: ✅ Implemented and passing

### CLI Integration Tests

- [ ] Init command with Python template selection
  - **Scope**: `metacoding init` with Python/Backend project type selection
  - **Requirements**: Python-specific instruction files generated in .github/instructions/
  - **Status**: ✅ Implemented and passing

### Workflow Enforcement Tests

- [ ] Python template 7-step workflow enforcement
  - **Scope**: Python template Copilot instructions
  - **Requirements**: All instruction files enforce the mandatory development workflow
  - **Status**: ✅ Implemented and passing

### File Management Tests

- [ ] Python temporary file cleanup instructions
  - **Scope**: Python template instruction files
  - **Requirements**: Comprehensive guidance for cleaning Python artifacts, virtual environments, and cache files
  - **Status**: ✅ Implemented and passing

## Documentation Test Cases

### README.md Quality Tests

- [ ] README.md formatting and structure validation
  - **Scope**: Current README.md file
  - **Requirements**: Proper markdown formatting, version badges, working TOC, consistent headers
  - **Status**: ✅ Implemented and passing

- [ ] README.md post-manual-setup completeness check
  - **Scope**: Updated README.md without manual setup instructions
  - **Requirements**: Clear prerequisites, enhanced troubleshooting, comprehensive FAQ
  - **Status**: ✅ Implemented and passing

- [ ] README.md code block formatting validation
  - **Scope**: README.md markdown formatting after content reorganization
  - **Requirements**: Clean code blocks, proper section separation, no broken syntax
  - **Status**: ✅ Implemented and passing

- [ ] README.md template options and inline code formatting
  - **Scope**: Installation guide and CLI command formatting
  - **Requirements**: Template options in installation, inline code format, improved readability
  - **Status**: ✅ Implemented and passing

- [ ] README.md duplication removal validation
  - **Scope**: CLI section redundancy elimination
  - **Requirements**: No duplicate init information, focused CLI section structure
  - **Status**: ✅ Implemented and passing

- [ ] README.md messaging consistency check
  - **Scope**: Project messaging throughout documentation
  - **Requirements**: Consistent "Guided Development Workflow" messaging, inclusive language
  - **Status**: ✅ Implemented and passing

### CLI Messaging Tests

- [ ] CLI help output validation
  - **Scope**: Main CLI description
  - **Requirements**: Shows "Guided Development Workflow for GitHub Copilot"
  - **Status**: ✅ Implemented and passing

- [ ] Init command messaging validation
  - **Scope**: Default project description and success messages
  - **Requirements**: Uses "guided development project" and "guided workflow support"
  - **Status**: ✅ Implemented and passing

- [ ] Codebase messaging consistency check
  - **Scope**: All source files
  - **Requirements**: No references to "professional" workflow remain
  - **Status**: ✅ Implemented and passing
