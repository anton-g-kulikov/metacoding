---
description: "Instructions for running and maintaining tests"
applyTo: "test/**/*.ts"
---

# Test Execution Guidelines

## Pre-Commit Testing
- Run all tests before committing changes: `npm test`
- Ensure tests pass in both development and CI environments
- Fix failing tests before proceeding with commits
- Run specific test suites for targeted changes when appropriate

## Test Development Standards
- **New Features:** Ensure all new features have corresponding unit tests
- **Test Coverage:** Aim for high coverage of critical functionality paths
- **Test Names:** Use descriptive names that explain the scenario and expected outcome
  - Format: `methodName_scenario_expectedOutcome`
  - Example: `getUserById_userExists_returnsUserObject`
- **Test Organization:** Group related tests in describe blocks with clear hierarchy

## Test Data Management
- **Fixtures:** Update test fixtures when data structures change
- **Realistic Data:** Use realistic data in integration tests to catch real-world issues
- **Mock Strategy:** Mock external dependencies in unit tests for isolation
- **Test Database:** Use separate test database/environment for integration tests
- **Temporary File Cleanup:** Clean up all temporary test files, debug outputs, and mock data after test execution
- **Fixture Organization:** Move reusable test data to `/test/fixtures/` directory for proper organization

## Test File Hygiene
- **No Orphaned Files:** Remove temporary test files created during debugging or development
- **Debug Output Cleanup:** Remove console.log statements and debug files before committing
- **Test Artifact Management:** Ensure test screenshots, logs, and reports are properly managed or cleaned up
- **Resource Management:** Properly dispose of file handles, database connections, and other test resources

## Test Types and Patterns
- **Unit Tests:** Test individual functions, methods, and components in isolation
- **Integration Tests:** Test feature workflows and component interactions
- **End-to-End Tests:** Test complete user scenarios and workflows
- **Regression Tests:** Add tests for previously fixed bugs to prevent recurrence

## Performance Testing
- **Test Execution Speed:** Keep unit tests fast (under 100ms each when possible)
- **Parallel Execution:** Structure tests to run safely in parallel
- **Resource Cleanup:** Ensure proper cleanup of test resources and temporary data
- **Memory Management:** Monitor and prevent memory leaks in long-running test suites

## Test Maintenance
- **Regular Review:** Periodically review and refactor outdated tests
- **Documentation:** Document complex test scenarios and their purposes
- **Continuous Updates:** Update tests when requirements or APIs change
- **Test Quality:** Apply the same code quality standards to test code as production code
