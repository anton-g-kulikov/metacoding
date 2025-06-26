---
description: 'Universal code review checklist for all project types'
applyTo: '**'
---

# Universal Code Review Guidelines

## Code Review Philosophy

Code reviews are essential for maintaining code quality, sharing knowledge, and ensuring consistency across all project types. This document provides universal guidelines that apply to all languages and frameworks, with specific details deferred to language-specific instruction files.

## Language-Specific Review Guidelines

For detailed language-specific review criteria, refer to:
- **JavaScript** See `javascript.coding.instructions.md` for JavaScript-specific patterns and best practices
- **TypeScript/Node.js:** See `typescript.coding.instructions.md` for TypeScript-specific patterns and best practices
- **Python:** See `python.coding.instructions.md` for Python-specific patterns and conventions
- **React/Frontend:** See `react.coding.instructions.md` for React-specific patterns and component design

## Functionality Assessment

### Requirements and Logic

- **Requirements Compliance:** Does the code meet the specified requirements?
- **Business Logic:** Is the business logic correctly implemented and testable?
- **Edge Cases:** Are edge cases properly handled with appropriate error responses?
- **Error Scenarios:** How does the code behave with invalid inputs and failure conditions?
- **Integration Points:** Do integrations with other components work correctly?

### Input Validation and Data Handling

- **Input Sanitization:** Are all inputs properly validated and sanitized?
- **Data Type Safety:** Are data types appropriate and consistently used?
- **Boundary Conditions:** Are boundary conditions handled correctly?
- **Null/Undefined Handling:** Are null/undefined values handled appropriately?

## Code Quality and Readability

### Naming and Structure

- **Naming Conventions:** Are variables, functions, and classes named clearly using language conventions?
- **Code Structure:** Is the code well-organized and logically structured?
- **Function Size:** Are functions focused and reasonably sized (language-specific guidelines)?
- **Complexity:** Is the code unnecessarily complex or could it be simplified?
- **Consistency:** Does the code follow established project patterns and conventions?

### Documentation and Comments

- **Code Documentation:** Is the code self-documenting with appropriate language-specific documentation?
- **Comment Quality:** Are comments helpful and explain "why" not "what"?
- **API Documentation:** Are public APIs documented using language-appropriate standards?
- **Complex Logic:** Is complex business logic or algorithms explained with comments?

## Performance Considerations

### Algorithm and Data Structure Efficiency

- **Algorithm Choice:** Are appropriate algorithms and data structures used?
- **Time Complexity:** Is the time complexity appropriate for the expected data size?
- **Space Complexity:** Is memory usage efficient and appropriate?
- **Resource Management:** Are resources properly acquired and released?

### Language-Specific Performance

- **Memory Management:** Are there potential memory leaks or excessive memory usage?
- **Async Operations:** Are async operations used appropriately for I/O-bound tasks?
- **Caching Opportunities:** Are caching opportunities identified and implemented correctly?
- **Database Efficiency:** Are database queries optimized and avoid N+1 problems?

## Security Review

### Input Security

- **Input Validation:** Are all inputs properly validated and sanitized?
- **Injection Prevention:** Are injection attacks (SQL, XSS, command injection) prevented?
- **Data Sanitization:** Is user input properly escaped and sanitized?

### Authentication and Authorization

- **Authentication Checks:** Are authentication checks in place where needed?
- **Authorization Logic:** Are authorization checks appropriate for the functionality?
- **Permission Validation:** Are user permissions properly validated before actions?

### Data Protection

- **Sensitive Data:** Is sensitive data properly protected and encrypted?
- **Data Exposure:** Are there any unintentional data exposure risks?
- **Logging Security:** Is sensitive information excluded from logs?
- **Communication Security:** Is data transmission properly secured?

## Testing and Testability

### Test Coverage and Quality

- **Test Coverage:** Are there sufficient tests for the new functionality?
- **Test Types:** Are appropriate test types used (unit, integration, end-to-end)?
- **Test Quality:** Are tests meaningful and test the right behaviors?
- **Edge Case Testing:** Do tests cover edge cases and error conditions?

### Test Structure and Maintainability

- **Test Organization:** Are tests well-organized and follow project conventions?
- **Test Data:** Is test data realistic and properly managed?
- **Mock Strategy:** Are external dependencies properly mocked in unit tests?
- **Test Documentation:** Are complex test scenarios documented?

## Error Handling and Logging

### Error Management

- **Exception Handling:** Are exceptions handled appropriately using language conventions?
- **Error Messages:** Are error messages helpful for debugging and user-friendly when appropriate?
- **Error Propagation:** Is error propagation handled correctly through the call stack?
- **Graceful Degradation:** Does the system handle failures gracefully?

### Logging and Monitoring

- **Logging Strategy:** Is appropriate logging in place for debugging and monitoring?
- **Log Levels:** Are appropriate log levels used (debug, info, warn, error)?
- **Structured Logging:** Is logging structured and searchable?
- **Performance Logging:** Are performance-critical paths properly instrumented?

## Documentation and Maintenance

### Code and API Documentation

- **Self-Documenting Code:** Is the code readable and self-explanatory?
- **Public API Documentation:** Are public APIs documented with language-appropriate standards?
- **Complex Logic Documentation:** Are complex algorithms and business rules documented?

### Change Documentation

- **Breaking Changes:** Are breaking changes clearly identified and documented?
- **Migration Guides:** Are migration paths provided for breaking changes?
- **Changelog Updates:** Are user-facing changes documented in changelog?
- **Version Compatibility:** Is backward compatibility maintained where required?

## Standards Compliance

### Project Standards

- **Coding Standards:** Does the code follow project coding standards and conventions?
- **Architectural Patterns:** Are established architectural patterns followed?
- **Style Guidelines:** Does the code follow language-specific style guidelines?
- **Project Structure:** Are files organized according to project structure guidelines?

### Dependencies and Configuration

- **Dependency Management:** Are new dependencies justified and properly managed?
- **Version Constraints:** Are dependency versions appropriately constrained?
- **Configuration Handling:** Are configuration changes handled appropriately?
- **Environment Compatibility:** Does the code work across supported environments?

## Anti-Patterns and Code Smells

### Universal Anti-Patterns

- **Deep Nesting:** Excessive conditional or exception nesting
- **God Objects:** Classes or functions with too many responsibilities
- **Magic Numbers/Strings:** Hardcoded values without explanation or configuration
- **Copy-Paste Code:** Duplicated code that should be refactored into shared utilities
- **Tight Coupling:** Components that are too dependent on each other

### Resource and State Management

- **Memory Leaks:** Objects not properly cleaned up or disposed
- **Resource Leaks:** File handles, connections, or other resources not properly closed
- **State Mutation:** Inappropriate mutation of shared or immutable state
- **Global State Abuse:** Overuse of global variables or singleton patterns

### Development Hygiene Issues

- **Temporary File Pollution:** Debug files, temp outputs, or experimental code left in repository
- **Console/Debug Output:** Debug statements or logging left in production code
- **Commented Code:** Large blocks of commented-out code without explanation
- **TODO/FIXME Accumulation:** Excessive TODO comments without associated issues

## File and Repository Hygiene

### Repository Cleanliness

- **File Organization:** Are files placed in appropriate directories according to project structure?
- **Temporary Files:** Are all temporary files, debug outputs, and experimental code removed?
- **Resource Cleanup:** Has development session cleanup been performed before commit?
- **Test Artifacts:** Are temporary test files moved to appropriate locations or removed?

### Code Organization

- **Single Responsibility:** Does each file have a clear, single purpose?
- **Import Organization:** Are imports/includes organized according to language conventions?
- **Unused Code:** Is dead code and unused imports removed?
- **File Naming:** Do file names follow project conventions?

## Review Process Guidelines

### Providing Feedback

- **Constructive Approach:** Provide specific, actionable feedback
- **Explanation:** Explain reasoning behind suggested changes
- **Alternative Suggestions:** Offer alternative approaches when applicable
- **Positive Recognition:** Acknowledge well-written code and good practices
- **Focus on Code:** Keep feedback focused on code quality, not personal style

### Prioritizing Issues

- **Critical Issues:** Security vulnerabilities, functional bugs, performance issues
- **Quality Issues:** Code organization, readability, maintainability
- **Style Issues:** Formatting, naming conventions, minor style inconsistencies
- **Suggestions:** Improvements that enhance but don't fix problems

### Review Efficiency

- **Scope Management:** Keep reviews focused and appropriately sized
- **Context Understanding:** Understand the change context before reviewing
- **Tool Usage:** Use code review tools effectively
- **Time Management:** Balance thoroughness with review turnaround time

## Automated Checks Integration

### Pre-Review Automation

- **Linting:** Code passes language-specific linting rules
- **Formatting:** Code follows consistent formatting standards
- **Type Checking:** Static type checking passes (for typed languages)
- **Build Verification:** Code builds successfully
- **Test Execution:** All tests pass including new and existing ones

### Security and Quality Automation

- **Security Scanning:** Automated security vulnerability scans pass
- **Dependency Auditing:** Dependency security audits pass
- **Code Coverage:** Test coverage meets minimum thresholds
- **Performance Benchmarks:** Performance regressions are identified

## Cross-Platform and Environment Considerations

### Compatibility Review

- **Platform Independence:** Code works across supported platforms
- **Environment Variables:** Environment-specific configuration is handled properly
- **Path Handling:** File paths are handled appropriately for different OS
- **Encoding Issues:** Text encoding is handled consistently

### Deployment Considerations

- **Configuration Management:** Configuration changes are properly managed
- **Migration Requirements:** Database or data migrations are included if needed
- **Rollback Compatibility:** Changes support rollback procedures
- **Production Readiness:** Code is ready for production deployment

## Knowledge Sharing and Learning

### Educational Opportunities

- **Learning Moments:** Use reviews as teaching opportunities
- **Best Practice Sharing:** Share knowledge about best practices and patterns
- **Tool Knowledge:** Share knowledge about useful tools and techniques
- **Domain Knowledge:** Share business domain knowledge when relevant

### Documentation and Process Improvement

- **Pattern Documentation:** Document new patterns discovered during review
- **Process Feedback:** Provide feedback on review process effectiveness
- **Guideline Updates:** Suggest updates to coding guidelines based on review findings
- **Tool Improvements:** Suggest improvements to review tools and automation
