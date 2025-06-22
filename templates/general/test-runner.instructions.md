---
description: 'Universal testing guidelines and workflow for all project types'
applyTo: 'test/**/*'
---

# Universal Test Execution Guidelines

## Pre-Commit Testing Workflow

- **Run all tests before committing changes:** Use project-appropriate test command
- **Ensure tests pass in both development and CI environments**
- **Fix failing tests before proceeding with commits**
- **Run specific test suites for targeted changes when appropriate**
- **Verify test coverage meets project standards**

## Test Development Standards

- **New Features:** Ensure all new features have corresponding unit tests
- **Test Coverage:** Aim for high coverage of critical functionality paths
- **Test Documentation:** Follow standardized table format in `test/test-documentation.md` for all test cases
- **Test Organization:** Group related tests with clear hierarchy and descriptive names
- **Language-Specific Patterns:** Follow testing patterns appropriate for the project language

## Language-Specific Testing Guidelines

For detailed testing frameworks and patterns, refer to language-specific instruction files:

- **TypeScript/Node.js:** See `typescript.coding.instructions.md` for Jest patterns and best practices
- **Python:** See `python.coding.instructions.md` for pytest patterns and fixtures
- **React/Frontend:** See `react.coding.instructions.md` for React Testing Library and component testing

## Test Case Documentation Format

All test cases must be documented using the standardized table format across all project types:

```markdown
| Test Case ID  | Description                                 | Type | Status    |
| :------------ | :------------------------------------------ | :--- | :-------- |
| AREA-TYPE-001 | Brief but descriptive test case description | Unit | Completed |
```

## Universal Test Case Naming Conventions

### Test Case ID Format: `[AREA]-[TYPE]-[NUMBER]`

**Area Prefixes (adapt to your project):**

- `CORE` - Core application logic tests
- `API` - API/Service layer tests
- `UI` - User interface component tests
- `DB` - Database/Data layer tests
- `AUTH` - Authentication/Authorization tests
- `UTIL` - Utility function tests
- `CONFIG` - Configuration management tests
- `DOC` - Documentation Quality tests
- `E2E` - End-to-End workflow tests
- `INT` - Integration tests

**Type Suffixes:**

- `UNIT` - Unit tests (isolated component testing)
- `INT` - Integration tests (component interaction testing)
- `E2E` - End-to-end tests (full workflow testing)

**Examples:**

- `CORE-UNIT-001` - First unit test for Core Logic
- `API-UNIT-001` - First unit test for API Layer
- `DB-INT-001` - First integration test for Database
- `E2E-WF-001` - First end-to-end workflow test

### Test Method Naming

Use language-appropriate naming conventions:

- **TypeScript/JavaScript:** `methodName_scenario_expectedOutcome`
- **Python:** `test_method_name_scenario_expected_outcome`
- **Consistent Pattern:** Always include what's being tested, the scenario, and expected result

## Test Data Management

- **Fixtures:** Update test fixtures when data structures change
- **Realistic Data:** Use realistic data in integration tests to catch real-world issues
- **Mock Strategy:** Mock external dependencies in unit tests for isolation
- **Test Environment:** Use separate test environment/database for integration tests
- **Temporary File Cleanup:** Clean up all temporary test files, debug outputs, and mock data after test execution
- **Fixture Organization:** Move reusable test data to `/test/fixtures/` directory for proper organization

## Test File Hygiene

- **No Orphaned Files:** Remove temporary test files created during debugging or development
- **Debug Output Cleanup:** Remove console output statements and debug files before committing
- **Test Artifact Management:** Ensure test screenshots, logs, and reports are properly managed or cleaned up
- **Resource Management:** Properly dispose of file handles, database connections, and other test resources
- **Documentation Updates:** Remove temporary test documentation and move useful content to proper locations

## Test Types and Patterns

### Unit Tests

- **Purpose:** Test individual functions, methods, and components in isolation
- **Scope:** Single unit of functionality
- **Dependencies:** Mock all external dependencies
- **Speed:** Fast execution (milliseconds per test)
- **Coverage:** Focus on logic branches and edge cases

### Integration Tests

- **Purpose:** Test feature workflows and component interactions
- **Scope:** Multiple components working together
- **Dependencies:** Use real implementations where practical
- **Speed:** Moderate execution time
- **Coverage:** Focus on interface contracts and data flow

### End-to-End Tests

- **Purpose:** Test complete user scenarios and workflows
- **Scope:** Full application stack
- **Dependencies:** Real or production-like environment
- **Speed:** Slower execution time
- **Coverage:** Focus on user journeys and critical paths

## Performance Testing

- **Test Execution Speed:** Keep unit tests fast (language-specific timing guidelines in coding instructions)
- **Parallel Execution:** Structure tests to run safely in parallel
- **Resource Cleanup:** Ensure proper cleanup of test resources and temporary data
- **Memory Management:** Monitor and prevent memory leaks in long-running test suites
- **CI/CD Optimization:** Consider test execution time in continuous integration

## Test Maintenance

- **Regular Review:** Periodically review and refactor outdated tests
- **Documentation:** Document complex test scenarios and their purposes
- **Continuous Updates:** Update tests when requirements or APIs change
- **Test Quality:** Apply the same code quality standards to test code as production code
- **Update test-documentation.md:** Add new test cases to the appropriate table section
- **Status Tracking:** Update test status as development progresses
- **Table Format:** Maintain consistent table formatting and column alignment
- **ID Assignment:** Assign sequential IDs within each area (AREA-TYPE-001, AREA-TYPE-002, etc.)

## Cross-Platform Testing Considerations

- **Environment Consistency:** Ensure tests pass across development environments
- **Path Handling:** Use appropriate path handling for different operating systems
- **Dependency Versions:** Account for version differences across environments
- **Resource Availability:** Handle different resource constraints across platforms

## Test Automation and CI/CD

- **Automated Test Execution:** All tests must run automatically in CI/CD pipeline
- **Test Result Reporting:** Generate and store test reports for analysis
- **Failure Notification:** Immediate notification for test failures
- **Coverage Reporting:** Track and report test coverage over time
- **Quality Gates:** Use test results as quality gates for deployments

## Security Testing

- **Input Validation Testing:** Test with malicious and edge-case inputs
- **Authentication Testing:** Verify authentication mechanisms work correctly
- **Authorization Testing:** Ensure proper access controls
- **Data Protection Testing:** Verify sensitive data handling
- **Vulnerability Testing:** Include security-focused test cases

## Error Handling and Edge Case Testing

- **Boundary Conditions:** Test at the edges of valid input ranges
- **Error Scenarios:** Test error handling and recovery mechanisms
- **Network Failures:** Test behavior during network connectivity issues
- **Resource Exhaustion:** Test behavior under resource constraints
- **Invalid Input:** Test with malformed or unexpected input data

## Test Documentation and Reporting

- **Test Case Purpose:** Document why each test exists and what it validates
- **Test Setup Requirements:** Document any special setup or configuration needed
- **Known Issues:** Document known test limitations or flaky behaviors
- **Test Metrics:** Track test execution time, coverage, and success rates
- **Regular Reporting:** Generate regular test health reports

## Best Practices for Test Development

- **Test Independence:** Each test should be able to run independently
- **Descriptive Names:** Use clear, descriptive names for tests and test groups
- **Single Assertion Focus:** Each test should focus on one specific behavior
- **Arrange-Act-Assert Pattern:** Structure tests with clear setup, execution, and validation phases
- **Test Data Isolation:** Avoid test data conflicts between different test runs
- **Maintainable Tests:** Write tests that are easy to understand and modify
