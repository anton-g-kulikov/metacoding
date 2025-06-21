---
description: "Automated code review checklist"
applyTo: "**"
---

# Code Review Focus Areas

## Functionality Assessment
- **Requirements Compliance:** Does the code meet the specified requirements?
- **Edge Cases:** Are edge cases properly handled?
- **Error Scenarios:** How does the code behave with invalid inputs?
- **Business Logic:** Is the business logic correctly implemented?
- **Integration Points:** Do integrations with other components work correctly?

## Code Quality and Readability
- **Naming Conventions:** Are variables, functions, and classes named clearly?
- **Code Structure:** Is the code well-organized and logically structured?
- **Function Size:** Are functions focused and reasonably sized (< 50 lines)?
- **Complexity:** Is the code unnecessarily complex or could it be simplified?
- **Comments:** Are comments helpful and explain "why" not "what"?
- **Consistency:** Does the code follow established project patterns?

## Performance Considerations
- **Algorithm Efficiency:** Are appropriate algorithms and data structures used?
- **Memory Usage:** Are there potential memory leaks or excessive memory usage?
- **Database Queries:** Are database queries optimized and avoid N+1 problems?
- **Async Operations:** Are async operations used appropriately for I/O?
- **Caching:** Are caching opportunities identified and implemented correctly?
- **Resource Management:** Are resources properly acquired and released?

## Security Review
- **Input Validation:** Are all inputs properly validated and sanitized?
- **Authentication:** Are authentication checks in place where needed?
- **Authorization:** Are authorization checks appropriate for the functionality?
- **Data Exposure:** Is sensitive data properly protected?
- **Injection Attacks:** Are SQL injection and other injection attacks prevented?
- **Encryption:** Is sensitive data encrypted appropriately?

## Testing and Testability
- **Test Coverage:** Are there sufficient tests for the new functionality?
- **Test Quality:** Are tests meaningful and test the right things?
- **Testability:** Is the code structured to be easily testable?
- **Mocking:** Are external dependencies properly mocked in tests?
- **Integration Tests:** Are integration points covered by appropriate tests?
- **Regression Protection:** Do tests protect against known regression issues?

## Error Handling and Logging
- **Exception Handling:** Are exceptions handled appropriately?
- **Error Messages:** Are error messages helpful for debugging?
- **Logging:** Is appropriate logging in place for debugging and monitoring?
- **Graceful Degradation:** Does the system handle failures gracefully?
- **Recovery:** Are there appropriate recovery mechanisms?

## Documentation and Maintenance
- **Code Documentation:** Is the code self-documenting or properly commented?
- **API Documentation:** Are public APIs documented with JSDoc?
- **Breaking Changes:** Are breaking changes clearly identified and documented?
- **Migration Guides:** Are migration paths provided for breaking changes?
- **Changelog Updates:** Are user-facing changes documented in changelog?

## Standards Compliance
- **Coding Standards:** Does the code follow project coding standards?
- **Architectural Patterns:** Are established architectural patterns followed?
- **Dependency Management:** Are new dependencies justified and properly managed?
- **Configuration:** Are configuration changes handled appropriately?
- **Version Compatibility:** Is backwards compatibility maintained where required?

## Common Anti-Patterns to Flag
- **Deep Nesting:** Excessive if/else or try/catch nesting
- **God Objects:** Classes or functions with too many responsibilities
- **Magic Numbers:** Hardcoded values without explanation
- **Copy-Paste Code:** Duplicated code that should be refactored
- **Tight Coupling:** Components that are too dependent on each other
- **Memory Leaks:** Objects not properly cleaned up
- **Temporary File Pollution:** Leaving debug files, temp outputs, or experimental code in repository
- **Blocking Operations:** Synchronous operations that could block the main thread

## Review Process Guidelines
- **Constructive Feedback:** Provide specific, actionable feedback
- **Explain Reasoning:** Explain why changes are needed
- **Suggest Alternatives:** Offer alternative approaches when applicable
- **Acknowledge Good Work:** Recognize well-written code and good practices
- **Focus on Code:** Keep feedback focused on code, not personal
- **Prioritize Issues:** Distinguish between critical issues and suggestions

## Automated Checks to Verify
- **Linting:** Code passes linting rules
- **Formatting:** Code follows formatting standards
- **Type Checking:** TypeScript compilation succeeds without errors
- **Tests:** All tests pass including new and existing ones
- **Build:** Code builds successfully
- **Security Scans:** Automated security scans pass

## File and Repository Hygiene
- **Temporary Files:** Are all temporary files, debug outputs, and experimental code removed?
- **File Organization:** Are files placed in appropriate directories according to project structure?
- **Cleanup Verification:** Has development session cleanup been performed before commit?
- **Test Fixtures:** Are temporary test files moved to appropriate `/test/fixtures/` location?
- **Repository State:** Is the repository in a clean state without orphaned files?
