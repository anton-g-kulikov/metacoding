---
description: 'Automated code review checklist'
applyTo: '**'
---

# Code Review Focus Areas

## React-Specific Functionality Assessment

- **Component Props:** Are prop interfaces well-defined and type-safe?
- **State Management:** Is state handled appropriately (local vs global)?
- **Effect Dependencies:** Are useEffect dependencies complete and accurate?
- **Event Handlers:** Are event handlers properly memoized when needed?
- **Conditional Rendering:** Are all rendering paths tested and accessible?

## React Component Quality

- **Single Responsibility:** Does each component have a single, clear purpose?
- **Component Size:** Are components reasonably sized and focused?
- **Props Design:** Are props minimal, well-typed, and follow interface patterns?
- **Hook Usage:** Are hooks used correctly and following Rules of Hooks?
- **JSX Quality:** Is JSX readable, semantic, and properly structured?

## React Performance Considerations

- **Re-render Optimization:** Are unnecessary re-renders prevented with memo/callback?
- **Bundle Size:** Do imports follow tree-shaking best practices?
- **Lazy Loading:** Are code splitting opportunities identified and implemented?
- **Memory Leaks:** Are effects cleaned up properly on unmount?
- **Key Props:** Are list items using stable, unique keys?

## React Security and Accessibility

- **XSS Prevention:** Is user input properly sanitized in JSX?
- **ARIA Compliance:** Are interactive elements properly labeled?
- **Semantic HTML:** Are semantic HTML elements used instead of generic divs?
- **Keyboard Navigation:** Are all interactive elements keyboard accessible?
- **Focus Management:** Is focus handled correctly for dynamic content?

## React Testing Quality

- **Component Testing:** Are components tested using React Testing Library?
- **User-Focused Tests:** Do tests verify user behavior rather than implementation?
- **Hook Testing:** Are custom hooks tested independently?
- **Integration Testing:** Are component interactions tested realistically?
- **Accessibility Testing:** Are accessibility features included in tests?

## React File and Component Hygiene

- **Component Cleanup:** Are temporary/experimental React components removed from the codebase?
- **JSX Debug Elements:** Are debug divs, temporary styling, and console.log statements removed?
- **Unused Imports:** Are unused React imports, hooks, and component imports cleaned up?
- **Mock Component Removal:** Are temporary mock components moved to proper mock directories or removed?
- **Storybook Integration:** Are useful component experiments moved to Storybook stories?
- **Style Experiments:** Are temporary CSS/styled-component experiments cleaned up or properly organized?

## React-Specific Anti-Patterns to Flag

- **Direct State Mutation:** Mutating state objects directly instead of using setState
- **Missing Keys:** Using array indices or missing keys in lists
- **Inline Object Creation:** Creating objects/functions in render without memoization
- **useEffect Overuse:** Using useEffect when derived state would suffice
- **Props Drilling:** Passing props through multiple levels unnecessarily
- **God Components:** Components handling too many concerns

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
