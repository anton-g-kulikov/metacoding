---
description: 'Modern JavaScript coding standards and best practices for browser and Node.js environments'
applyTo: 'src/**/*.{js,mjs}'
---

# Modern JavaScript Development Guidelines

## Language and Framework Preferences

- **Primary Language:** Modern JavaScript (ES6+/ES2020+)
- **Code Style:** Follow project's ESLint/Prettier configuration
- **Target Compatibility:** Node.js 18+, modern browsers (ES2020+)
- **Module System:** ES modules (import/export) preferred over CommonJS

## Core JavaScript Principles

- **Modern Syntax:** Use ES6+ features (arrow functions, destructuring, async/await)
- **Immutability:** Prefer immutable patterns and functional programming concepts
- **Async Programming:** Use async/await for asynchronous operations, avoid callback hell
- **Error Handling:** Implement comprehensive error handling with try/catch blocks
- **Performance:** Consider performance implications of operations and memory usage

## Naming Conventions

- **Files:** Use kebab-case for file names (e.g., `user-service.js`, `api-client.js`)
- **Classes:** PascalCase (e.g., `UserService`, `ApiClient`)
- **Functions/Methods:** camelCase (e.g., `getUserById`, `validateInput`)
- **Variables:** camelCase (e.g., `userId`, `isValid`, `userProfile`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`, `API_BASE_URL`)
- **Private Methods:** Prefix with underscore (e.g., `_validateData`, `_handleError`)

## Modern JavaScript Best Practices

### ES6+ Features and Patterns

```javascript
// ✅ Good: Use const/let instead of var
const API_URL = 'https://api.example.com';
let userCount = 0;

// ✅ Good: Arrow functions for concise syntax
const users = data.map((user) => user.name);
const filteredUsers = users.filter((user) => user.active);

// ✅ Good: Destructuring assignment
const {
  name,
  email,
  address: { city },
} = user;
const [first, second, ...rest] = items;

// ✅ Good: Template literals
const message = `Welcome ${user.name}, you have ${count} notifications`;

// ✅ Good: Spread operator
const newUser = { ...existingUser, status: 'active' };
const mergedArray = [...array1, ...array2];
```

### Async/Await Patterns

```javascript
// ✅ Good: Async/await with proper error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error; // Re-throw to allow caller to handle
  }
}

// ✅ Good: Promise.all for concurrent operations
async function fetchMultipleUsers(userIds) {
  try {
    const userPromises = userIds.map((id) => fetchUserData(id));
    const users = await Promise.all(userPromises);
    return users;
  } catch (error) {
    console.error('Failed to fetch multiple users:', error);
    throw error;
  }
}
```

### Functional Programming Patterns

```javascript
// ✅ Good: Pure functions
const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price, 0);

// ✅ Good: Higher-order functions
const withRetry =
  (fn, maxAttempts = 3) =>
  async (...args) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

// ✅ Good: Composition and chaining
const processUsers = (users) =>
  users
    .filter((user) => user.active)
    .map((user) => ({
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
```

## Browser-Specific Development

### DOM Manipulation Best Practices

```javascript
// ✅ Good: Modern DOM querying
const userElement = document.querySelector('[data-user-id="123"]');
const allButtons = document.querySelectorAll('.btn');

// ✅ Good: Event delegation
document.addEventListener('click', (event) => {
  if (event.target.matches('.btn-submit')) {
    handleSubmit(event);
  }
});

// ✅ Good: Modern event handling
const button = document.getElementById('submit-btn');
button.addEventListener('click', async (event) => {
  event.preventDefault();
  await handleFormSubmission();
});
```

### Web APIs and Browser Features

```javascript
// ✅ Good: Fetch API with error handling
async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// ✅ Good: Local storage with error handling
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}
```

## Node.js-Specific Development

### Module Patterns

```javascript
// ✅ Good: ES module exports
export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
};

export class UserService {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    return await this.db.users.findById(id);
  }
}

export default UserService;

// ✅ Good: Named imports
import { config } from './config.js';
import UserService from './user-service.js';
```

### File System and Path Operations

```javascript
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Good: ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Good: Async file operations
async function readConfigFile(filename) {
  try {
    const configPath = path.join(__dirname, 'config', filename);
    const data = await fs.readFile(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read config file ${filename}:`, error);
    return null;
  }
}
```

## Error Handling Patterns

### Comprehensive Error Management

```javascript
// ✅ Good: Custom error classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// ✅ Good: Error boundary patterns
async function withErrorHandling(operation, context = '') {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${context}:`, error);

    // Re-throw known errors
    if (error instanceof ValidationError || error instanceof ApiError) {
      throw error;
    }

    // Wrap unknown errors
    throw new Error(`Unexpected error in ${context}: ${error.message}`);
  }
}
```

## Security Best Practices

### Input Validation and Sanitization

```javascript
// ✅ Good: Input validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

// ✅ Good: Data validation with schema
function validateUserData(userData) {
  const errors = [];

  if (!userData.name || typeof userData.name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!validateEmail(userData.email)) {
    errors.push('Valid email address is required');
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  return {
    name: sanitizeInput(userData.name),
    email: userData.email.toLowerCase(),
  };
}
```

## Performance Optimization

### Efficient Data Operations

```javascript
// ✅ Good: Efficient array operations
const processLargeDataset = (items) => {
  // Use for...of for better performance with large arrays
  const results = [];
  for (const item of items) {
    if (item.active) {
      results.push(transformItem(item));
    }
  }
  return results;
};

// ✅ Good: Debouncing for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ✅ Good: Memoization for expensive operations
function memoize(fn) {
  const cache = new Map();
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

## Build Tools and Development Workflow

### Package.json Best Practices

```javascript
// ✅ Good: Well-structured package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write src/**/*.js"
  }
}
```

### Environment Configuration

```javascript
// ✅ Good: Environment configuration
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.production.com',
    debug: false,
  },
  test: {
    apiUrl: 'http://localhost:3001/api',
    debug: false,
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

## Anti-Patterns to Avoid

### Common JavaScript Pitfalls

```javascript
// ❌ Bad: Callback hell
getData(function (a) {
  getMoreData(a, function (b) {
    getEvenMoreData(b, function (c) {
      // Nested callbacks are hard to maintain
    });
  });
});

// ❌ Bad: Modifying function parameters
function updateUser(user) {
  user.lastUpdated = new Date(); // Mutates input parameter
  return user;
}

// ❌ Bad: Using var and global variables
var globalCounter = 0; // Avoid var and globals
function incrementCounter() {
  globalCounter++; // Side effects are hard to track
}

// ❌ Bad: Not handling promise rejections
fetch('/api/data'); // Unhandled promise

// ❌ Bad: Mixing async patterns
async function mixedPatterns() {
  const data = await fetch('/api/data');
  data.then((result) => {
    // Don't mix async/await with .then()
    console.log(result);
  });
}
```

## Documentation Standards

### JSDoc Documentation

```javascript
/**
 * Calculates the total price including tax
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 * @throws {Error} When basePrice or taxRate is negative
 * @example
 * const total = calculateTotalPrice(100, 0.08); // Returns 108
 */
function calculateTotalPrice(basePrice, taxRate) {
  if (basePrice < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be non-negative');
  }
  return basePrice * (1 + taxRate);
}

/**
 * User service for managing user data
 * @class
 */
class UserService {
  /**
   * Creates a new UserService instance
   * @param {Object} database - Database connection instance
   */
  constructor(database) {
    this.db = database;
  }

  /**
   * Retrieves a user by ID
   * @param {string} userId - The unique user identifier
   * @returns {Promise<Object|null>} User object or null if not found
   * @async
   */
  async getUserById(userId) {
    try {
      return await this.db.users.findById(userId);
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return null;
    }
  }
}
```
