# metacoding NPM Package - Test Documentation

## Overview

This document tracks test cases for the metacoding npm package CLI tool, following test-driven development (TDD) practices in accordance with our own documentation guidelines.

**Status Summary:**

- Total test cases: 40
- Completed: 40 (100%)
- Template Coverage: React, Node.js, Python, General templates tested
- CLI Integration: All commands tested end-to-end
- Code Quality: TypeScript compilation and linting passing

## Testing Strategy

Our testing approach follows the architecture decisions documented in `_meta/architecture-decisions.md`:

- **Unit tests** for individual services and utilities (filesystem, template management)
- **Integration tests** for complete command workflows (init command end-to-end)
- **Temporary directories** for safe file system testing
- **Mock implementations** for external dependencies (VS Code settings)
- **Jest framework** with TypeScript support for type safety

## Test Areas and Cases

### 1. Template System (`templates/`)

| Test Case ID  | Description                                       | Type | Status    |
| :------------ | :------------------------------------------------ | :--- | :-------- |
| TMPL-UNIT-001 | React template directory validation               | Unit | Completed |
| TMPL-UNIT-002 | React template.json validation                    | Unit | Completed |
| TMPL-UNIT-003 | React-specific Copilot instructions generation    | Unit | Completed |
| TMPL-UNIT-004 | Node.js template directory validation             | Unit | Completed |
| TMPL-UNIT-005 | Node.js template.json validation                  | Unit | Completed |
| TMPL-UNIT-006 | Node.js-specific Copilot instructions generation  | Unit | Completed |
| TMPL-UNIT-007 | Node.js backend-specific code review instructions | Unit | Completed |
| TMPL-UNIT-008 | Node.js test runner instructions                  | Unit | Completed |
| TMPL-UNIT-009 | Python template directory validation              | Unit | Completed |
| TMPL-UNIT-010 | Python template.json validation                   | Unit | Completed |
| TMPL-UNIT-011 | Python-specific Copilot instructions generation   | Unit | Completed |
| TMPL-UNIT-012 | Python-specific code review instructions          | Unit | Completed |
| TMPL-UNIT-013 | Python test runner instructions                   | Unit | Completed |
| TMPL-UNIT-014 | General template directory validation             | Unit | Completed |
| TMPL-UNIT-015 | General template.json validation                  | Unit | Completed |
| TMPL-UNIT-016 | General-specific Copilot instructions generation  | Unit | Completed |

### 2. Template Manager Service (`src/services/template-manager.ts`)

| Test Case ID  | Description                              | Type | Status    |
| :------------ | :--------------------------------------- | :--- | :-------- |
| TMGR-UNIT-001 | React template detection and selection   | Unit | Completed |
| TMGR-UNIT-002 | Node.js template detection and selection | Unit | Completed |
| TMGR-UNIT-003 | Python template detection and selection  | Unit | Completed |
| TMGR-UNIT-004 | General template fallback selection      | Unit | Completed |
| TMGR-UNIT-005 | Template variable substitution           | Unit | Completed |
| TMGR-UNIT-006 | Template file processing                 | Unit | Completed |

### 3. CLI Commands (`src/commands/`)

| Test Case ID | Description                                  | Type        | Status    |
| :----------- | :------------------------------------------- | :---------- | :-------- |
| CLI-UNIT-001 | Init command with React template selection   | Unit        | Completed |
| CLI-UNIT-002 | Init command with Node.js template selection | Unit        | Completed |
| CLI-UNIT-003 | Init command with Python template selection  | Unit        | Completed |
| CLI-UNIT-004 | Init command with General template selection | Unit        | Completed |
| CLI-UNIT-005 | Update command validation                    | Unit        | Completed |
| CLI-UNIT-006 | Validate command execution                   | Unit        | Completed |
| CLI-INT-001  | Complete init workflow end-to-end            | Integration | Completed |

### 4. Filesystem Service (`src/services/filesystem.ts`)

| Test Case ID | Description                            | Type | Status    |
| :----------- | :------------------------------------- | :--- | :-------- |
| FS-UNIT-001  | File creation in temporary directories | Unit | Completed |
| FS-UNIT-002  | Directory structure creation           | Unit | Completed |
| FS-UNIT-003  | File content validation                | Unit | Completed |
| FS-UNIT-004  | File permission handling               | Unit | Completed |
| FS-UNIT-005  | Error handling for invalid paths       | Unit | Completed |

### 5. Workflow Enforcement Tests

| Test Case ID | Description                                   | Type | Status    |
| :----------- | :-------------------------------------------- | :--- | :-------- |
| WF-UNIT-001  | 7-step mandatory workflow in React template   | Unit | Completed |
| WF-UNIT-002  | 7-step mandatory workflow in Node.js template | Unit | Completed |
| WF-UNIT-003  | 7-step mandatory workflow in Python template  | Unit | Completed |
| WF-UNIT-004  | 7-step mandatory workflow in General template | Unit | Completed |

### 6. Documentation Quality Tests

| Test Case ID | Description                                   | Type | Status    |
| :----------- | :-------------------------------------------- | :--- | :-------- |
| DOC-UNIT-001 | README.md formatting and structure validation | Unit | Completed |
| DOC-UNIT-002 | README.md messaging consistency check         | Unit | Completed |
| DOC-UNIT-003 | CLI help output validation                    | Unit | Completed |
| DOC-UNIT-004 | Init command messaging validation             | Unit | Completed |
| DOC-UNIT-005 | Codebase messaging consistency check          | Unit | Completed |
