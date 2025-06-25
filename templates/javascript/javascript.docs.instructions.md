---
description: 'JavaScript documentation standards for browser and Node.js environments'
applyTo: '**/*.md'
---

# JavaScript Documentation Guidelines

## Documentation Architecture Principles

This project enforces a strict distinction between different types of documentation to ensure clarity, maintainability, and appropriate use of status indicators across all JavaScript project types.

### System Documentation (Evergreen, Factual)

**Purpose:** Describes the current state of the system, architecture, and implemented features.
**Files:** README.md, architecture.md, api-design.md, system-documentation.md, code documentation
**Language:** Present tense, factual, descriptive
**Status Indicators:** ❌ **NEVER use status emojis or temporal language**
**Content Focus:** What exists now, how it works, what it does
**Examples:**

- ✅ Correct: "The authentication module uses JWT tokens"
- ❌ Incorrect: "🚧 Authentication module (in progress)"
- ✅ Correct: "The API client supports the following endpoints:"
- ❌ Incorrect: "📋 Planned API endpoints:"

### Project Management Documentation (Temporal, Status-Oriented)

**Purpose:** Tracks work progress, planning, and execution status.
**Files:** project-task-list.md, sprint-planning.md, backlog.md
**Language:** Status-oriented, temporal references allowed
**Status Indicators:** ✅ **Required - use emojis and progress indicators**
**Content Focus:** What needs to be done, work progress, planning
**Examples:**

- ✅ Correct: "🚧 In Progress - Authentication module implementation"
- ✅ Correct: "✅ Completed - JWT token validation"
- ✅ Correct: "📋 Backlog - Add OAuth integration"

### User Documentation (Instructional, Current)

**Purpose:** Helps users understand how to use the system.
**Files:** Installation guides, usage examples, tutorials
**Language:** Imperative, instructional, present tense
**Status Indicators:** ⚠️ **Use sparingly** - only for actual user-facing feature status
**Content Focus:** How to use, what users can do, step-by-step guidance

## Documentation Quality Standards

- **Clarity:** Write clear, concise explanations appropriate for JavaScript developers
- **Completeness:** Ensure documentation covers all necessary aspects of JavaScript projects
- **Accuracy:** Verify all information is current and correct
- **Consistency:** Maintain consistent tone and formatting across all documentation
- **Accessibility:** Use clear language and proper formatting for accessibility
- **Architecture Compliance:** Follow the system vs project documentation distinction

## Task ID Naming Convention for JavaScript Projects

Follow the standardized task naming format for all project management documentation:

#### Required Task Format

```markdown
- [ ] **[AREA]-TASK-001: Task title** - ❌ **NOT STARTED**
  - Detailed task description and requirements
  - Implementation steps and acceptance criteria
```

#### JavaScript-Specific Area Prefixes

**Frontend/Browser Areas:**

- `DOM` - DOM manipulation and browser API tasks
- `UI` - User interface component tasks
- `EVENT` - Event handling and interaction tasks
- `API_CLIENT` - API client and HTTP request tasks
- `UTIL` - Utility function tasks

**Node.js/Server Areas:**

- `SERVER` - Server-side application tasks
- `CLI` - Command-line interface tasks
- `MODULE` - Module and package development tasks
- `CONFIG` - Configuration management tasks

**Universal Areas:**

- `CORE` - Core application logic tasks
- `PKG` - Package/library functionality tasks
- `DOC` - Documentation tasks
- `TEST` - Testing infrastructure tasks

**Examples:**

- `DOM-TASK-001: Implement form validation`
- `API_CLIENT-TASK-002: Add authentication headers`
- `SERVER-TASK-003: Create user authentication middleware`
- `CLI-TASK-004: Add command-line argument parsing`

## README.md Standards for JavaScript Projects

**⚠️ README.md is system documentation - NO status indicators or temporal language allowed**

### JavaScript Project README Template

````markdown
# Project Name

Brief description of what the project does and its main purpose.

## Features

- Feature 1: Description of implemented functionality
- Feature 2: Description of implemented functionality
- Feature 3: Description of implemented functionality

## Installation

### Prerequisites

- Node.js 18+ (for Node.js projects)
- Modern browser supporting ES2020+ (for browser projects)

### Install Dependencies

```bash
npm install
```
````

### Development Setup

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Usage

### Basic Example

```javascript
import { ExampleClass } from './src/example.js';

const example = new ExampleClass();
const result = example.processData(inputData);
console.log(result);
```

### API Reference

#### ExampleClass

Main class for handling data processing.

**Constructor**

- `new ExampleClass(options)` - Creates new instance with optional configuration

**Methods**

- `processData(data)` - Processes input data and returns result
- `validateInput(input)` - Validates input data format

## Configuration

Configuration options for the application:

```javascript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details

````

### Documentation Best Practices

- **Present Tense:** Describe what the project does, not what it will do
- **Working Examples:** All code examples should be tested and functional
- **Clear Instructions:** Installation and usage instructions should be step-by-step
- **API Documentation:** Document all public functions and classes
- **No Status Language:** Never use "planned", "upcoming", "in progress"

## Code Documentation Standards

### JSDoc Documentation

JavaScript projects should use JSDoc for code documentation:

```javascript
/**
 * Calculates the total price including tax
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 * @throws {Error} When basePrice or taxRate is negative
 * @example
 * const total = calculateTotalPrice(100, 0.08); // Returns 108
 * @since 1.0.0
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
 * @example
 * const userService = new UserService(database);
 * const user = await userService.getUserById('123');
 */
class UserService {
  /**
   * Creates a new UserService instance
   * @param {Object} database - Database connection instance
   * @param {Object} [options={}] - Optional configuration
   * @param {number} [options.timeout=5000] - Request timeout in milliseconds
   */
  constructor(database, options = {}) {
    this.db = database;
    this.timeout = options.timeout || 5000;
  }

  /**
   * Retrieves a user by ID
   * @async
   * @param {string} userId - The unique user identifier
   * @returns {Promise<Object|null>} User object or null if not found
   * @throws {Error} When database operation fails
   * @example
   * const user = await userService.getUserById('user123');
   * if (user) {
   *   console.log(user.name);
   * }
   */
  async getUserById(userId) {
    try {
      return await this.db.users.findById(userId);
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  }
}
````

### Module Documentation

```javascript
/**
 * @fileoverview Utility functions for data processing and validation
 * @module utils/dataProcessor
 * @requires lodash
 * @author Your Name <your.email@example.com>
 * @version 1.2.0
 */

import _ from 'lodash';

/**
 * Configuration object for data processing
 * @typedef {Object} ProcessingConfig
 * @property {boolean} strict - Enable strict validation
 * @property {number} maxItems - Maximum number of items to process
 * @property {string[]} allowedFields - Array of allowed field names
 */

/**
 * User data object
 * @typedef {Object} UserData
 * @property {string} id - Unique user identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {boolean} active - Whether user account is active
 * @property {Date} createdAt - Account creation date
 */

/**
 * Processes and validates user data
 * @param {UserData[]} users - Array of user objects to process
 * @param {ProcessingConfig} config - Processing configuration
 * @returns {UserData[]} Processed and validated user data
 * @throws {ValidationError} When validation fails in strict mode
 */
export function processUserData(users, config) {
  // Implementation details...
}
```

## Test Documentation Standards

Follow the standardized table format for all test case documentation:

### Required Table Format for JavaScript Projects

```markdown
| Test Case ID       | Description                                | Type | Status      |
| :----------------- | :----------------------------------------- | :--- | :---------- |
| DOM-UNIT-001       | Test DOM element creation and manipulation | Unit | Completed   |
| UI-UNIT-002        | Test component state management            | Unit | Completed   |
| API_CLIENT-INT-001 | Test HTTP client error handling            | Int  | In Progress |
| EVENT-E2E-001      | Test complete user interaction workflow    | E2E  | Not Started |
```

### Test Case ID Conventions for JavaScript

- **Format:** `[AREA]-[TYPE]-[NUMBER]`
- **Area Prefixes:** DOM, UI, EVENT, API_CLIENT, UTIL, CORE, MODULE, SERVER, CLI, PKG
- **Type Suffixes:** UNIT, INT, E2E
- **Sequential Numbering:** 001, 002, 003, etc.

## API Documentation

### RESTful API Documentation

```javascript
/**
 * @api {get} /api/users/:id Get User
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} name User name
 * @apiSuccess {String} email User email
 * @apiSuccess {Boolean} active User status
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "123",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "active": true
 *     }
 *
 * @apiError UserNotFound The id of the User was not found
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound",
 *       "message": "User with id 123 not found"
 *     }
 */
```

### Client Library Documentation

```javascript
/**
 * JavaScript SDK for Example API
 * @example
 * import { ExampleAPI } from '@example/api-client';
 *
 * const api = new ExampleAPI({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 *
 * const users = await api.users.list();
 * const user = await api.users.get('user123');
 */
class ExampleAPI {
  /**
   * Initialize API client
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - API authentication key
   * @param {string} [config.baseUrl='https://api.example.com'] - Base API URL
   * @param {number} [config.timeout=5000] - Request timeout in milliseconds
   */
  constructor(config) {
    // Implementation...
  }
}
```

## Package Documentation

### package.json Documentation

```json
{
  "name": "example-package",
  "version": "1.0.0",
  "description": "A comprehensive example JavaScript package",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "docs": "jsdoc src -d docs",
    "prepare": "npm run build"
  },
  "keywords": ["javascript", "library", "example"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/example-package.git"
  },
  "bugs": {
    "url": "https://github.com/username/example-package/issues"
  },
  "homepage": "https://github.com/username/example-package#readme"
}
```

## Build and Deployment Documentation

### Webpack Configuration Documentation

```javascript
/**
 * Webpack configuration for production builds
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'ExampleLibrary',
    libraryTarget: 'umd',
  },
  // Additional configuration...
};

export default config;
```

### Deployment Documentation

````markdown
## Deployment

### Environment Variables

- `NODE_ENV` - Environment mode (development, production, test)
- `API_URL` - Base URL for API endpoints
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Database connection string

### Build Process

1. Install dependencies: `npm ci`
2. Run tests: `npm test`
3. Build production bundle: `npm run build`
4. Start production server: `npm start`

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
````

## Maintenance Schedule

- **Regular Review:** Schedule monthly documentation review cycles
- **Release Updates:** Update documentation as part of release process
- **Issue Tracking:** Track documentation issues and improvements in project backlog
- **Community Feedback:** Incorporate user feedback on documentation clarity
- **Automated Checks:** Use automated tools to check for broken links and outdated content

## Accessibility Guidelines

- **Clear Language:** Use clear, simple language for international JavaScript developers
- **Code Examples:** Provide complete, runnable code examples
- **Technical Terms:** Define JavaScript-specific terms when first introduced
- **Consistent Terminology:** Use consistent terminology throughout all documentation
- **Screen Reader Compatibility:** Ensure proper heading hierarchy and alt text for diagrams
- **High Contrast:** Use sufficient color contrast for code syntax highlighting
