# metacoding NPM Package - Test Documentation

## Overview

This document tracks test cases for the metacoding npm package CLI tool, following test-driven development (TDD) practices in accordance with our own documentation guidelines.

## Test Status Summary

✅ **All tests passing** (21/21)  
✅ **React template implementation completed** - All React template tests passing  
✅ **Branding update completed** - All references updated from "MetaCoding" to "metacoding"  
✅ **Folder structure updated** - Renamed meta/ to \_meta/ for better organization  
✅ **Documentation standards implemented** - Following our own guidelines for clarity and completeness  
✅ **Node.js template implementation completed** - All Node.js backend template tests passing, CLI integration verified

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

### Test Cases for React Template Implementation

#### Template Structure Tests

- **Test Case**: React template directory creation
  - **Input**: `templates/react/` directory structure
  - **Expected Output**: Directory contains template.json and files/ subdirectory
  - **Status**: ✅ Implemented and passing

#### Template Configuration Tests

- **Test Case**: React template.json validation
  - **Input**: React template configuration file
  - **Expected Output**: Valid JSON with React-specific metadata
  - **Status**: ✅ Implemented and passing

#### React Instruction Files Tests

- **Test Case**: React-specific Copilot instructions generation
  - **Input**: React template with variables
  - **Expected Output**: Generated React-focused instruction files
  - **Status**: ✅ Implemented and passing

#### Template Manager Integration Tests

- **Test Case**: React template detection and selection
  - **Input**: Project with package.json containing React dependencies
  - **Expected Output**: React template automatically suggested/selected
  - **Status**: ✅ Implemented and passing

#### CLI Integration Tests

- **Test Case**: Init command with React template selection
  - **Input**: `metacoding init` with React project type selection
  - **Expected Output**: React-specific instruction files generated in .github/
  - **Status**: ✅ Implemented and passing

## Node.js Template Test Cases

### Test Cases for Node.js/Backend Template Implementation

#### Template Structure Tests

- **Test Case**: Node.js template directory creation
  - **Input**: `templates/nodejs/` directory structure
  - **Expected Output**: Directory contains template.json and files/ subdirectory with all instruction files
  - **Status**: ✅ Implemented and passing

#### Template Configuration Tests

- **Test Case**: Node.js template.json validation
  - **Input**: Node.js template configuration file
  - **Expected Output**: Valid JSON with Node.js-specific VS Code settings and metadata
  - **Status**: ✅ Implemented and passing

#### Node.js Instruction Files Tests

- **Test Case**: Node.js-specific Copilot instructions generation

  - **Input**: Node.js template with backend-specific variables
  - **Expected Output**: Generated Node.js-focused instruction files with API development patterns
  - **Status**: ✅ Implemented and passing

- **Test Case**: Backend-specific code review instructions

  - **Input**: Node.js code review template
  - **Expected Output**: Instructions include API security, database optimization, and server performance checks
  - **Status**: ✅ Implemented and passing

- **Test Case**: Node.js test runner instructions
  - **Input**: Node.js test runner template
  - **Expected Output**: Instructions include Jest/Mocha patterns, API testing, and temporary file cleanup
  - **Status**: ✅ Implemented and passing

#### Template Manager Integration Tests

- **Test Case**: Node.js template detection and selection
  - **Input**: Project with package.json containing Node.js/Express dependencies
  - **Expected Output**: Node.js template automatically suggested/selected
  - **Status**: ✅ Implemented and passing

#### CLI Integration Tests

- **Test Case**: Init command with Node.js template selection
  - **Input**: `metacoding init` with Node.js/Backend project type selection
  - **Expected Output**: Node.js-specific instruction files generated in .github/instructions/
  - **Status**: ✅ Implemented and passing

#### Workflow Enforcement Tests

- **Test Case**: 7-step mandatory workflow in Node.js template
  - **Input**: Node.js template Copilot instructions
  - **Expected Output**: All instruction files enforce the mandatory development workflow
  - **Status**: ✅ Implemented and passing

#### File Management Tests

- **Test Case**: Temporary file cleanup instructions for Node.js
  - **Input**: Node.js template instruction files
  - **Expected Output**: Comprehensive guidance for cleaning Node.js build artifacts, logs, and temporary files
  - **Status**: ✅ Implemented and passing

---

_Last Updated: June 22, 2025_  
_Next Review: After implementing Python template or additional CLI features_
