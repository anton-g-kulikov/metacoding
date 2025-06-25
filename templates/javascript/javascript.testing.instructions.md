---
description: 'JavaScript testing strategies and frameworks for browser and Node.js environments'
applyTo: 'test/**/*.{js,mjs}'
---

# JavaScript Testing Guidelines

## Test Case Naming Conventions

### Test Case ID Format: `[AREA]-[TYPE]-[NUMBER]`

**JavaScript/Frontend Area Prefixes:**

- `DOM` - DOM manipulation and browser API tests
- `UI` - User interface component tests
- `EVENT` - Event handling and interaction tests
- `API_CLIENT` - API client and HTTP request tests
- `UTIL` - Utility function tests
- `CORE` - Core application logic tests
- `MODULE` - Module loading and dependency tests
- `SERVER` - Server-side JavaScript tests (Node.js)
- `CLI` - Command-line interface tests (Node.js)
- `PKG` - Package/library functionality tests

**Type Suffixes:**

- `UNIT` - Unit tests (isolated function/component testing)
- `INT` - Integration tests (component interaction testing)
- `E2E` - End-to-end tests (full user workflow testing)

**Examples:**

- `DOM-UNIT-001` - First unit test for DOM manipulation
- `UI-UNIT-001` - First unit test for UI component
- `API_CLIENT-INT-001` - First integration test for API client
- `EVENT-E2E-001` - First end-to-end event handling test

## Testing Strategy Overview

### Testing Pyramid for JavaScript

- **Unit Tests (70%):** Test individual functions and modules in isolation
- **Integration Tests (20%):** Test interactions between components
- **End-to-End Tests (10%):** Test complete user workflows in browser/environment

### Test Framework Selection

#### Primary Testing Frameworks

- **Jest:** Comprehensive testing framework for unit and integration tests
- **Vitest:** Fast alternative to Jest with native ES modules support
- **Mocha + Chai:** Flexible testing framework with assertion library
- **Cypress/Playwright:** End-to-end testing for browser applications

#### Browser Testing Tools

- **jsdom:** Simulate browser environment in Node.js for DOM testing
- **@testing-library/dom:** Simple and complete testing utilities for DOM
- **Puppeteer:** Control headless Chrome for integration testing
- **WebDriver:** Cross-browser testing automation

## Jest Testing Patterns

### Basic Test Structure

```javascript
// Basic test setup
describe('UserService', () => {
  let userService;
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = {
      users: {
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    userService = new UserService(mockDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John Doe' };
      mockDatabase.users.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDatabase.users.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = '999';
      mockDatabase.users.findById.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const userId = '123';
      const dbError = new Error('Database connection failed');
      mockDatabase.users.findById.mockRejectedValue(dbError);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
```

### Testing Async Code

```javascript
// Testing promises and async/await
describe('API Client', () => {
  let apiClient;
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    apiClient = new ApiClient('https://api.example.com');
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  it('should fetch user data successfully', async () => {
    // Arrange
    const userData = { id: 1, name: 'John' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(userData),
    });

    // Act
    const result = await apiClient.getUser(1);

    // Assert
    expect(result).toEqual(userData);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('should handle HTTP errors', async () => {
    // Arrange
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    // Act & Assert
    await expect(apiClient.getUser(999)).rejects.toThrow(
      'HTTP error! status: 404'
    );
  });

  it('should handle network errors', async () => {
    // Arrange
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValue(networkError);

    // Act & Assert
    await expect(apiClient.getUser(1)).rejects.toThrow('Network error');
  });
});
```

### Mocking and Spying

```javascript
// Module mocking
jest.mock('./logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

// Partial mocking
jest.mock('./config', () => ({
  ...jest.requireActual('./config'),
  apiUrl: 'http://test-api.example.com',
}));

// Spy on methods
describe('Analytics Service', () => {
  it('should track user actions', () => {
    const analytics = new AnalyticsService();
    const trackSpy = jest.spyOn(analytics, 'track');

    analytics.trackUserLogin('user123');

    expect(trackSpy).toHaveBeenCalledWith('user_login', { userId: 'user123' });

    trackSpy.mockRestore();
  });
});

// Timer mocking
describe('Debounced Function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

## DOM Testing with jsdom

### Testing DOM Manipulation

```javascript
/**
 * @jest-environment jsdom
 */

describe('DOM Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should create and append element', () => {
    // Arrange
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Act
    const element = createButton('Click me', 'btn-primary');
    container.appendChild(element);

    // Assert
    expect(container.children).toHaveLength(1);
    expect(container.firstChild.textContent).toBe('Click me');
    expect(container.firstChild.className).toBe('btn-primary');
  });

  it('should handle click events', () => {
    // Arrange
    const mockHandler = jest.fn();
    const button = document.createElement('button');
    button.addEventListener('click', mockHandler);
    document.body.appendChild(button);

    // Act
    button.click();

    // Assert
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should update element content', () => {
    // Arrange
    document.body.innerHTML = '<div id="counter">0</div>';
    const counter = document.getElementById('counter');

    // Act
    updateCounter(counter, 5);

    // Assert
    expect(counter.textContent).toBe('5');
  });
});
```

### Testing with @testing-library

```javascript
import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Form Component', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="login-form">
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    `;
  });

  it('should validate email input', () => {
    // Arrange
    const emailInput = screen.getByPlaceholderText('Email');

    // Act
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    // Assert
    expect(emailInput).toHaveClass('error');
  });

  it('should submit form with valid data', () => {
    // Arrange
    const mockSubmit = jest.fn();
    const form = document.getElementById('login-form');
    form.addEventListener('submit', mockSubmit);

    // Act
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Login'));

    // Assert
    expect(mockSubmit).toHaveBeenCalled();
  });
});
```

## Node.js Testing Patterns

### File System Testing

```javascript
import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

describe('File Service', () => {
  let tempDir;
  let fileService;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(tmpdir(), 'test-'));
    fileService = new FileService(tempDir);
  });

  afterEach(async () => {
    await fs.rmdir(tempDir, { recursive: true });
  });

  it('should create and read file', async () => {
    // Arrange
    const filename = 'test.txt';
    const content = 'Hello, World!';

    // Act
    await fileService.writeFile(filename, content);
    const result = await fileService.readFile(filename);

    // Assert
    expect(result).toBe(content);
  });

  it('should handle file not found error', async () => {
    // Act & Assert
    await expect(fileService.readFile('nonexistent.txt')).rejects.toThrow(
      'File not found'
    );
  });
});
```

### HTTP Server Testing

```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('API Endpoints', () => {
  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should validate required fields', async () => {
      const invalidUser = { name: 'John Doe' }; // Missing email

      await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
```

## End-to-End Testing

### Cypress Testing Patterns

```javascript
// cypress/integration/user-workflow.spec.js
describe('User Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should complete user registration', () => {
    // Fill out registration form
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('securepassword');
    cy.get('[data-testid="confirm-password-input"]').type('securepassword');

    // Submit form
    cy.get('[data-testid="register-button"]').click();

    // Verify success
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome');
  });

  it('should show validation errors for invalid data', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="register-button"]').click();

    cy.get('[data-testid="email-error"]').should(
      'contain',
      'Valid email required'
    );
  });
});
```

### Playwright Testing Patterns

```javascript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should add items to cart', async ({ page }) => {
    // Add item to cart
    await page.click('[data-testid="add-to-cart-123"]');

    // Verify cart badge
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // Navigate to cart
    await page.click('[data-testid="cart-link"]');

    // Verify item in cart
    await expect(page.locator('[data-testid="cart-item-123"]')).toBeVisible();
  });

  test('should calculate total correctly', async ({ page }) => {
    await page.click('[data-testid="add-to-cart-123"]'); // $10 item
    await page.click('[data-testid="add-to-cart-456"]'); // $15 item

    await page.click('[data-testid="cart-link"]');

    await expect(page.locator('[data-testid="cart-total"]')).toHaveText(
      '$25.00'
    );
  });
});
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/src/**/__tests__/*.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js', '!src/index.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testTimeout: 10000,
};
```

### Browser Test Configuration

```javascript
// jest.config.browser.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/test/browser-setup.js',
  ],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
```

## Test Data Management

### Test Fixtures

```javascript
// test/fixtures/users.js
export const validUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  active: true,
  createdAt: '2023-01-01T00:00:00Z',
};

export const invalidUser = {
  name: '',
  email: 'invalid-email',
};

export const userList = [
  validUser,
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    active: false,
    createdAt: '2023-01-02T00:00:00Z',
  },
];

// Test factories
export function createUser(overrides = {}) {
  return {
    ...validUser,
    id: Math.random().toString(36).substr(2, 9),
    ...overrides,
  };
}
```

### Mock Data Generators

```javascript
// test/helpers/generators.js
export function generateRandomUser() {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    active: Math.random() > 0.5,
    createdAt: new Date().toISOString(),
  };
}

export function generateUserList(count = 10) {
  return Array.from({ length: count }, generateRandomUser);
}
```

## Testing Best Practices

### Test Organization

- **Describe blocks:** Group related tests logically
- **Clear test names:** Use descriptive test names that explain the expected behavior
- **Arrange-Act-Assert:** Structure tests with clear setup, execution, and verification phases
- **One assertion per test:** Focus each test on a single behavior
- **Test isolation:** Ensure tests don't depend on each other

### Mock Strategy

- **Mock external dependencies:** Isolate units under test from external systems
- **Use real objects when possible:** Prefer real implementations for simple dependencies
- **Verify interactions:** Test that methods are called with correct parameters
- **Clean up mocks:** Reset mocks between tests to avoid interference

### Coverage Guidelines

- **Aim for high coverage:** Target 80%+ line coverage for critical code paths
- **Quality over quantity:** Focus on meaningful tests rather than coverage metrics
- **Test edge cases:** Include tests for error conditions and boundary values
- **Integration testing:** Ensure components work together correctly

### Performance Testing

```javascript
// Performance testing examples
describe('Performance Tests', () => {
  it('should process large dataset efficiently', () => {
    const largeArray = new Array(10000)
      .fill()
      .map((_, i) => ({ id: i, value: i * 2 }));

    const start = performance.now();
    const result = processLargeDataset(largeArray);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    expect(result).toHaveLength(10000);
  });

  it('should handle memory efficiently', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    const largeData = createLargeDataStructure();
    processData(largeData);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });
});
```
