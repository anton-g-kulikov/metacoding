---
description: 'React-specific testing guidelines and standards'
applyTo: 'test/**/*.{tsx,jsx,ts,js}'
---

# React Testing Standards

## Test Case Naming Conventions

### Test Case ID Format: `[AREA]-[TYPE]-[NUMBER]`

**React/Frontend Area Prefixes:**

- `COMP` - React component tests
- `HOOK` - Custom hooks tests
- `PAGE` - Page/Route component tests
- `FORM` - Form validation and submission tests
- `UI` - UI interaction and behavior tests
- `STORE` - State management tests (Redux/Zustand/Context)
- `API` - Frontend API client tests
- `A11Y` - Accessibility compliance tests
- `PERF` - Performance and optimization tests
- `UTIL` - Frontend utility function tests

**Type Suffixes:**

- `UNIT` - Unit tests (isolated component testing)
- `INT` - Integration tests (component interaction testing)
- `E2E` - End-to-end tests (full user workflow testing)

**Examples:**

- `COMP-UNIT-001` - First unit test for React Component
- `HOOK-UNIT-001` - First unit test for Custom Hook
- `PAGE-E2E-001` - First end-to-end test for Page Component
- `FORM-INT-001` - First integration test for Form Component

## Testing Framework Stack

- **Primary Framework:** Jest with React Testing Library
- **Component Testing:** @testing-library/react for component behavior testing
- **User Interaction:** @testing-library/user-event for realistic user interactions
- **Mocking:** Jest built-in mocking for modules and dependencies
- **Snapshot Testing:** Use sparingly, prefer behavioral tests

## Component Testing Guidelines

### Test Structure

- **Arrange-Act-Assert:** Clear test structure with setup, action, and verification
- **Test Behavior, Not Implementation:** Focus on what the component does, not how
- **User-Centric Tests:** Test from the user's perspective using accessible queries
- **Isolation:** Each test should be independent and not rely on other tests

### Testing Patterns

```typescript
// Good: Testing behavior
test('displays error message when form submission fails', async () => {
  render(<ContactForm onSubmit={jest.fn().mockRejectedValue(new Error())} />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
});

// Bad: Testing implementation details
test('calls setState when button is clicked', () => {
  const component = shallow(<MyComponent />);
  component.find('button').simulate('click');
  expect(component.state('clicked')).toBe(true);
});
```

## Query Priorities

1. **Accessible Queries (Preferred):**

   - `getByRole()` - Primary choice for interactive elements
   - `getByLabelText()` - Form inputs with labels
   - `getByPlaceholderText()` - Form inputs with placeholders
   - `getByText()` - Non-interactive text content

2. **Semantic Queries:**

   - `getByAltText()` - Images with alt text
   - `getByTitle()` - Elements with title attributes

3. **Test ID Queries (Last Resort):**
   - `getByTestId()` - Only when semantic queries aren't sufficient

## React-Specific Testing Scenarios

### Component Lifecycle and State

- **State Changes:** Test state transitions triggered by user interactions
- **Effect Testing:** Verify useEffect behavior with proper cleanup
- **Context Testing:** Test components that consume React Context
- **Custom Hooks:** Test custom hooks in isolation using renderHook

### Async Operations

- **API Calls:** Mock API responses and test loading/success/error states
- **User Interactions:** Use waitFor() for async state updates
- **Suspense:** Test Suspense boundaries and fallback components
- **Error Boundaries:** Test error boundary behavior with error states

### Form Testing

- **Form Validation:** Test client-side validation messages
- **Form Submission:** Test successful and failed form submissions
- **Field Interactions:** Test input changes, selections, and clearing
- **Accessibility:** Ensure form labels and error associations work correctly

## Mock Strategies

### Component Mocking

```typescript
// Mock child components that aren't relevant to the test
jest.mock('./ComplexChild', () => {
  return function MockedComplexChild({ title }: { title: string }) {
    return <div data-testid="mocked-complex-child">{title}</div>;
  };
});
```

### API Mocking

```typescript
// Use MSW (Mock Service Worker) for API mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'John Doe' }]));
  })
);
```

## Performance Testing

- **Render Performance:** Use React DevTools Profiler for performance testing
- **Memory Leaks:** Test component cleanup and event listener removal
- **Large Lists:** Test virtualization and pagination performance
- **Bundle Size:** Monitor component bundle impact with bundler analysis

## Testing File Organization

```
/test
  /components
    /common           # Reusable component tests
    /pages            # Page component tests
    /forms            # Form component tests
  /hooks              # Custom hook tests
  /utils              # Utility function tests
  /fixtures
    /api-responses    # Mock API response data
    /component-props  # Common component prop fixtures
```

## React Testing Anti-Patterns

- **Avoid Shallow Rendering:** Use full rendering with React Testing Library
- **Don't Test Implementation Details:** Focus on user-observable behavior
- **Avoid Snapshot Testing Everything:** Use snapshots sparingly for stable UI
- **Don't Mock React Itself:** Mock external dependencies, not React features
- **Avoid Testing Library Internals:** Don't test useState, useEffect directly

## Accessibility Testing

- **Screen Reader Testing:** Ensure components work with assistive technology
- **Keyboard Navigation:** Test keyboard-only navigation patterns
- **ARIA Attributes:** Verify proper ARIA labels and roles
- **Color Contrast:** Test component readability across different themes
- **Focus Management:** Test focus trapping and restoration in modals/dialogs

## Test Data Management

- **Factory Functions:** Create reusable test data generators
- **Realistic Data:** Use realistic data that matches production scenarios
- **Edge Cases:** Test with empty states, long text, special characters
- **Internationalization:** Test with different locales and text lengths

## CI/CD Integration

- **Visual Regression:** Use tools like Chromatic for visual testing
- **Cross-Browser Testing:** Test across different browsers and devices
- **Performance Budgets:** Set performance thresholds for components
- **Bundle Analysis:** Monitor bundle size impact of new components
