# metacoding NPM Package - Test Documentation

## Testing Framework and Setup

**Testing Framework**: Jest  
**Test Runner**: npm test  
**Coverage Target**: >80% for core functionality  
**Test Environment**: Node.js 18+

## Test Categories

### 1. CLI Command Tests

#### `metacoding init` Command

- **Test Case ID**: CLI-INIT-001
- **Description**: Successfully initialize metacoding in empty directory
- **Input**: Empty directory, default options
- **Expected Output**:
  - `.github/` folder created
  - `copilot-instructions.md` file created with template content
  - `.github/instructions/` folder with all instruction files
  - Success message displayed
- **Status**: ✅ Complete

- **Test Case ID**: CLI-INIT-002
- **Description**: Interactive template selection
- **Input**: User selects React template via CLI prompts
- **Expected Output**: React-specific instruction files and customizations
- **Status**: ✅ Complete

- **Test Case ID**: CLI-INIT-003
- **Description**: Handle existing files gracefully
- **Input**: Directory with existing `.github/copilot-instructions.md`
- **Expected Output**: Prompt for overwrite confirmation, respect user choice
- **Status**: ✅ Complete

#### `metacoding validate` Command

- **Test Case ID**: CLI-VALIDATE-001
- **Description**: Validate correct metacoding setup
- **Input**: Properly configured metacoding project
- **Expected Output**: All checks pass, success message
- **Status**: ❌ Not Started

- **Test Case ID**: CLI-VALIDATE-002
- **Description**: Detect missing instruction files
- **Input**: Project missing `test-runner.instructions.md`
- **Expected Output**: Validation error with specific missing file
- **Status**: ❌ Not Started

#### `metacoding update` Command

- **Test Case ID**: CLI-UPDATE-001
- **Description**: Update existing setup to latest version
- **Input**: Older version of metacoding setup
- **Expected Output**: Files updated, changelog displayed
- **Status**: ❌ Not Started

### 2. Template System Tests

#### Template Loading and Processing

- **Test Case ID**: TEMPLATE-001
- **Description**: Load general template successfully
- **Input**: Template name "general"
- **Expected Output**: Correct template files loaded with placeholders
- **Status**: ❌ Not Started

- **Test Case ID**: TEMPLATE-002
- **Description**: Process template placeholders
- **Input**: Template with `[project name]` placeholder, user input "MyApp"
- **Expected Output**: Placeholder replaced with "MyApp" in output files
- **Status**: ❌ Not Started

#### Template Validation

- **Test Case ID**: TEMPLATE-VALIDATION-001
- **Description**: Validate template structure
- **Input**: Template missing required instruction file
- **Expected Output**: Template validation error
- **Status**: ❌ Not Started

### 3. VS Code Integration Tests

#### Settings Configuration

- **Test Case ID**: VSCODE-001
- **Description**: Update VS Code settings automatically
- **Input**: Project without VS Code settings
- **Expected Output**: `.vscode/settings.json` created with required settings
- **Status**: ❌ Not Started

- **Test Case ID**: VSCODE-002
- **Description**: Merge with existing VS Code settings
- **Input**: Project with existing `.vscode/settings.json`
- **Expected Output**: metacoding settings merged without overwriting existing
- **Status**: ❌ Not Started

### 4. File System Operations Tests

#### File Creation and Management

- **Test Case ID**: FS-001
- **Description**: Create directory structure safely
- **Input**: Nested directory path that doesn't exist
- **Expected Output**: All directories created without errors
- **Status**: ❌ Not Started

- **Test Case ID**: FS-002
- **Description**: Handle file permission errors
- **Input**: Attempt to write to read-only directory
- **Expected Output**: Graceful error handling with helpful message
- **Status**: ❌ Not Started

### 5. Error Handling Tests

#### Invalid Input Handling

- **Test Case ID**: ERROR-001
- **Description**: Handle invalid template name
- **Input**: `metacoding init --template nonexistent`
- **Expected Output**: Clear error message, list of available templates
- **Status**: ❌ Not Started

- **Test Case ID**: ERROR-002
- **Description**: Handle interrupted setup process
- **Input**: User cancels during interactive setup
- **Expected Output**: Clean exit, no partial files created
- **Status**: ❌ Not Started

### 6. Integration Tests

#### End-to-End Workflow

- **Test Case ID**: E2E-001
- **Description**: Complete project setup workflow
- **Input**: Empty directory, full interactive setup
- **Expected Output**: Fully configured metacoding project, VS Code ready
- **Status**: ❌ Not Started

- **Test Case ID**: E2E-002
- **Description**: Validate and update workflow
- **Input**: Initialize project, make changes, validate, update
- **Expected Output**: All operations complete successfully
- **Status**: ❌ Not Started

## Test Fixtures and Sample Data

### Sample Projects

- **Empty Project**: Completely empty directory
- **Existing VS Code Project**: Project with `.vscode/` folder
- **Git Repository**: Project with `.git/` folder
- **Partial metacoding**: Project with some but not all metacoding files

### Template Test Data

- **Valid Templates**: All supported project types (general, react, node, python)
- **Invalid Templates**: Malformed template files, missing required files
- **Custom Templates**: User-created template examples

## Testing Setup Requirements

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for repository testing
- VS Code for integration testing (optional)

### Test Environment Setup

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testNamePattern="CLI Commands"

# Run integration tests
npm run test:integration
```

## Continuous Integration

### GitHub Actions Workflow

- **Test on Node.js versions**: 18, 20, 21
- **Test on OS**: Ubuntu, Windows, macOS
- **Coverage reporting**: Upload to Codecov
- **Lint and format checks**: ESLint and Prettier

### Quality Gates

- All tests must pass
- Coverage >= 80%
- No linting errors
- TypeScript compilation successful

## Test Status Summary

| Category            | Total Tests | Passing | Failing | Not Started |
| ------------------- | ----------- | ------- | ------- | ----------- |
| CLI Commands        | 6           | 3       | 0       | 3           |
| Template System     | 3           | 2       | 0       | 1           |
| VS Code Integration | 2           | 0       | 0       | 2           |
| File System         | 2           | 2       | 0       | 0           |
| Error Handling      | 2           | 0       | 0       | 2           |
| Integration         | 2           | 1       | 0       | 1           |
| **Total**           | **17**      | **8**   | **0**   | **9**       |

---

_Last Updated: June 21, 2025_  
_Next Review: After implementing core CLI functionality_
