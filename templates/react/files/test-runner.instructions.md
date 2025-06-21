---
description: 'Instructions for running and maintaining React tests'
applyTo: '**/*.test.{ts,tsx,js,jsx}'
---

# React Test Execution Guidelines

## React Testing Setup

- Use React Testing Library for component testing
- Run tests with Jest: `npm test` or `yarn test`
- Use `@testing-library/jest-dom` for enhanced assertions
- Configure MSW (Mock Service Worker) for API mocking when needed

## Component Testing Standards

- **Component Tests:** Test component behavior, not implementation details
- **User-Centric Testing:** Test from the user's perspective using accessible queries
- **Props Testing:** Verify components handle all prop variations correctly
- **Event Testing:** Test user interactions (clicks, form submissions, keyboard events)
- **Conditional Rendering:** Test all conditional rendering paths

## React Test File Management

### Component Test Cleanup

- **Debug Components:** Remove temporary test components and debug wrappers after testing
- **Mock Component Organization:** Move reusable mock components to `/test/__mocks__/` directory
- **Test Fixture Management:** Organize React component test data in `/test/fixtures/components/`
- **Snapshot Cleanup:** Remove outdated or unnecessary snapshot files regularly

### Testing Environment Hygiene

- **Test Output Cleanup:** Clean up test coverage reports, debug logs, and temporary test files
- **Mock API Cleanup:** Organize temporary API mocks into proper mock service structure
- **Test Media Cleanup:** Remove temporary images, videos, or assets used only for testing
- **Debug Test Removal:** Remove console.log, debug renders, and temporary test utilities

## React Testing Best Practices

```javascript
// Good: Test behavior, not implementation
test('displays error message when form submission fails', async () => {
  render(<LoginForm onSubmit={failingSubmit} />);

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Login failed');
});

// Avoid: Testing implementation details
test('sets isLoading state to true when submitting', () => {
  // This tests internal state, not user-visible behavior
});
```

## Testing Queries Priority

1. **getByRole** - Most accessible and user-focused
2. **getByLabelText** - Good for form inputs
3. **getByText** - For non-interactive text elements
4. **getByTestId** - Last resort for complex components

## Hook Testing

- **Custom Hooks:** Test custom hooks using `@testing-library/react-hooks`
- **Hook Isolation:** Test hooks independently of components when possible
- **Hook Dependencies:** Test all dependency arrays and side effects
- **Hook Error Handling:** Test error scenarios and edge cases

## State Management Testing

- **Context Providers:** Test context providers with realistic component trees
- **Redux/Zustand:** Test actions, reducers, and selectors independently
- **Async State:** Test loading states, success states, and error states
- **State Updates:** Verify state updates trigger appropriate re-renders

## Integration Testing Patterns

- **Component Trees:** Test realistic component hierarchies
- **Data Flow:** Test props passing and state lifting patterns
- **Router Integration:** Test routing behavior and navigation
- **API Integration:** Mock API calls and test data fetching components

## E2E Testing with React

- **User Flows:** Test complete user journeys (login, checkout, etc.)
- **Cross-Browser:** Test on multiple browsers and devices
- **Performance:** Monitor and test Core Web Vitals
- **Accessibility:** Test with screen readers and keyboard navigation

## Test Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── UserCard/
│       ├── UserCard.tsx
│       └── UserCard.test.tsx
├── hooks/
│   ├── useUserData.ts
│   └── useUserData.test.ts
└── __tests__/
    ├── integration/
    └── e2e/
```

## Mock Strategies for React

- **Component Mocks:** Mock child components in unit tests
- **API Mocks:** Use MSW for realistic API mocking
- **Router Mocks:** Mock React Router for navigation testing
- **External Libraries:** Mock third-party libraries appropriately

## Performance Testing

- **Render Performance:** Use React Profiler to identify slow components
- **Bundle Size:** Monitor component bundle impact
- **Memory Leaks:** Test for memory leaks in long-running components
- **Async Operations:** Test cleanup of async operations on unmount

## Accessibility Testing

- **ARIA Testing:** Test ARIA labels and roles
- **Keyboard Navigation:** Test keyboard accessibility
- **Screen Reader:** Test with screen reader simulation
- **Color Contrast:** Verify sufficient color contrast ratios

## Common React Testing Pitfalls

- **Testing Implementation:** Focus on behavior, not internal state
- **Sync/Async Confusion:** Use async/await for async operations
- **Missing Cleanup:** Clean up timers, subscriptions, and event listeners
- **Over-Mocking:** Don't mock everything; test realistic scenarios
- **Snapshot Overuse:** Use snapshots sparingly, prefer specific assertions
