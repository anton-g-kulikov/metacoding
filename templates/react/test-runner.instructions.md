---
description: 'React/Frontend testing guidelines and workflow'
applyTo: 'test/**/*'
---

# React/Frontend Test Execution Guidelines

## Pre-Commit Testing Workflow

- **Run all tests before committing changes:** Use `npm test` or `yarn test`
- **Ensure tests pass in both development and CI environments**
- **Fix failing tests before proceeding with commits**
- **Run specific test suites for targeted changes when appropriate**
- **Verify test coverage meets project standards**

## Test Development Standards

- **New Features:** Ensure all new React components have corresponding unit tests
- **Test Coverage:** Aim for high coverage of critical functionality paths
- **Test Documentation:** Follow standardized table format in `test/test-documentation.md` for all test cases
- **Test Organization:** Group related tests with clear hierarchy and descriptive names
- **React-Specific Patterns:** Follow React Testing Library patterns and best practices

## React/Frontend Testing Guidelines

For detailed React testing frameworks and patterns, refer to:

- **React Testing Library:** Component testing with user-centric approach
- **Jest:** Unit testing framework with snapshot testing
- **Cypress/Playwright:** End-to-end testing for user workflows
- **Storybook:** Component documentation and visual testing

## Test Case Documentation Format

All test cases must be documented using the standardized table format:

```markdown
| Test Case ID  | Description                                 | Type | Status    |
| :------------ | :------------------------------------------ | :--- | :-------- |
| AREA-TYPE-001 | Brief but descriptive test case description | Unit | Completed |
```

## React/Frontend Test Case Naming Conventions

### Test Case ID Format: `[AREA]-[TYPE]-[NUMBER]`

**React/Frontend Area Prefixes:**

- `COMP` - React component tests
- `HOOK` - Custom hooks tests
- `PAGE` - Page/Route component tests
- `UTIL` - Frontend utility function tests
- `STORE` - State management tests (Redux/Zustand/Context)
- `API` - Frontend API client tests
- `FORM` - Form validation and submission tests
- `UI` - UI interaction and behavior tests
- `A11Y` - Accessibility compliance tests
- `PERF` - Performance and optimization tests

**Type Suffixes:**

- `UNIT` - Unit tests (isolated component testing)
- `INT` - Integration tests (component interaction testing)
- `E2E` - End-to-end tests (full user workflow testing)

**Examples:**

- `COMP-UNIT-001` - First unit test for React Component
- `HOOK-UNIT-001` - First unit test for Custom Hook
- `PAGE-E2E-001` - First end-to-end test for Page Component
- `FORM-INT-001` - First integration test for Form Component

### Test Method Naming

Use React-specific naming conventions:

- **Component Tests:** `ComponentName_scenario_expectedOutcome`
- **Hook Tests:** `useHookName_scenario_expectedOutcome`
- **Consistent Pattern:** Always include what's being tested, the scenario, and expected result

## React-Specific Test Data Management

- **Component Props:** Use realistic props that match production data
- **Mock Data:** Create mock data that represents actual API responses
- **User Events:** Simulate realistic user interactions (clicks, typing, navigation)
- **Async Operations:** Properly test loading states and async data fetching
- **Temporary File Cleanup:** Clean up all temporary test files, screenshots, and debug outputs after test execution
- **Mock Cleanup:** Properly reset mocks between tests to avoid test pollution

## Test File Hygiene

- **No Orphaned Files:** Remove temporary test files created during debugging or development
- **Debug Output Cleanup:** Remove console output statements and debug files before committing
- **Test Artifact Management:** Ensure test screenshots, coverage reports, and logs are properly managed
- **Resource Management:** Properly dispose of DOM elements, event listeners, and other test resources
- **Documentation Updates:** Remove temporary test documentation and move useful content to proper locations

## React Component Testing Patterns

### Component Unit Tests

- **Render Testing:** Verify components render without crashing
- **Props Testing:** Test component behavior with different prop combinations
- **State Testing:** Test component state changes and updates
- **Event Testing:** Test user interaction handling
- **Snapshot Testing:** Maintain component structure consistency

### Custom Hook Testing

- **Hook Logic:** Test hook functionality in isolation
- **State Management:** Test hook state updates and side effects
- **Dependencies:** Test hook behavior with different dependencies
- **Error Handling:** Test hook error scenarios and recovery

### Integration Testing

- **Component Interaction:** Test how components work together
- **Data Flow:** Test data passing between parent and child components
- **Context Providers:** Test components within context providers
- **Router Integration:** Test routing and navigation behavior

### End-to-End Testing

- **User Workflows:** Test complete user journeys through the application
- **Cross-Browser:** Test functionality across different browsers
- **Responsive Design:** Test application behavior on different screen sizes
- **Performance:** Test application performance under load

## Common React Testing Anti-Patterns to Avoid

- **Testing Implementation Details:** Focus on user behavior, not internal state
- **Shallow Rendering:** Prefer full rendering with React Testing Library
- **Overmocking:** Mock only external dependencies, not internal components
- **Snapshot Overuse:** Use snapshots sparingly for UI consistency checks
- **Ignoring Accessibility:** Always test for accessibility compliance
