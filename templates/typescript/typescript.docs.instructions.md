---
description: 'TypeScript/Node.js-specific documentation standards and JSDoc patterns'
applyTo: '**/*.{ts,js}'
language: 'typescript'
---

# TypeScript/Node.js Documentation Standards

## JSDoc Documentation Standards

### Function Documentation

````typescript
/**
 * Retrieves user information by ID with caching support.
 *
 * This function first checks the cache for existing user data before
 * making a database query. If the user is not found in cache, it queries
 * the database and stores the result in cache for future requests.
 *
 * @param userId - The unique identifier for the user
 * @param options - Configuration options for the retrieval
 * @param options.useCache - Whether to use cached data if available (default: true)
 * @param options.cacheTimeout - Cache timeout in milliseconds (default: 300000)
 * @returns Promise that resolves to user data or null if not found
 *
 * @throws {ValidationError} When userId format is invalid
 * @throws {DatabaseConnectionError} When database connection fails
 *
 * @example
 * ```typescript
 * // Basic usage
 * const user = await getUserById('123');
 *
 * // With options
 * const user = await getUserById('123', {
 *   useCache: false,
 *   cacheTimeout: 600000
 * });
 *
 * // Error handling
 * try {
 *   const user = await getUserById('invalid-id');
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log('Invalid user ID format');
 *   }
 * }
 * ```
 *
 * @since 1.2.0
 * @see {@link User} for user data structure
 * @see {@link UserRepository.findById} for underlying database query
 */
async function getUserById(
  userId: string,
  options: GetUserOptions = {}
): Promise<User | null> {
  // Implementation here
}
````

### Class Documentation

````typescript
/**
 * Service for managing user data with caching and validation.
 *
 * The UserService provides a high-level interface for user operations,
 * including automatic caching, input validation, and error handling.
 * All operations are logged for debugging and monitoring purposes.
 *
 * @example
 * ```typescript
 * const userService = new UserService({
 *   repository: new UserRepository(database),
 *   cache: new RedisCache(),
 *   logger: new Logger('UserService')
 * });
 *
 * // Create a new user
 * const user = await userService.createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * // Retrieve user with caching
 * const foundUser = await userService.getUserById(user.id);
 * ```
 *
 * @public
 * @since 1.0.0
 */
export class UserService {
  /**
   * User repository for database operations.
   * @private
   */
  private readonly repository: UserRepository;

  /**
   * Cache instance for storing frequently accessed user data.
   * @private
   */
  private readonly cache: CacheService;

  /**
   * Logger instance for service operations.
   * @private
   */
  private readonly logger: Logger;

  /**
   * Creates a new UserService instance.
   *
   * @param dependencies - Service dependencies
   * @param dependencies.repository - Repository for user data persistence
   * @param dependencies.cache - Cache service for performance optimization
   * @param dependencies.logger - Logger for operation tracking
   *
   * @throws {Error} When required dependencies are not provided
   */
  constructor(dependencies: UserServiceDependencies) {
    if (!dependencies.repository) {
      throw new Error('UserRepository is required');
    }

    this.repository = dependencies.repository;
    this.cache = dependencies.cache;
    this.logger = dependencies.logger || new NullLogger();
  }

  /**
   * Creates a new user with validation and duplicate checking.
   *
   * @param userData - Data for the new user
   * @returns Promise resolving to the created user with generated ID
   *
   * @throws {ValidationError} When user data is invalid
   * @throws {DuplicateEmailError} When email already exists
   *
   * @example
   * ```typescript
   * const newUser = await userService.createUser({
   *   name: 'Jane Doe',
   *   email: 'jane@example.com',
   *   preferences: { theme: 'dark' }
   * });
   * ```
   */
  async createUser(userData: CreateUserData): Promise<User> {
    // Implementation here
  }
}
````

### Interface and Type Documentation

````typescript
/**
 * Configuration options for user retrieval operations.
 *
 * @public
 */
export interface GetUserOptions {
  /**
   * Whether to use cached data if available.
   * @defaultValue true
   */
  useCache?: boolean;

  /**
   * Cache timeout in milliseconds.
   * @defaultValue 300000 (5 minutes)
   */
  cacheTimeout?: number;

  /**
   * Additional fields to include in the response.
   * @defaultValue []
   */
  includeFields?: Array<'preferences' | 'metadata' | 'lastLogin'>;
}

/**
 * User data structure returned by the API.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   createdAt: new Date('2023-01-01T00:00:00Z'),
 *   updatedAt: new Date('2023-06-01T12:00:00Z'),
 *   isActive: true,
 *   preferences: {
 *     theme: 'dark',
 *     notifications: true
 *   }
 * };
 * ```
 *
 * @public
 */
export interface User {
  /** Unique identifier for the user (UUID v4 format) */
  id: string;

  /** Full name of the user */
  name: string;

  /**
   * Email address (unique across all users)
   * @format email
   */
  email: string;

  /** Timestamp when the user was created */
  createdAt: Date;

  /** Timestamp when the user was last updated */
  updatedAt: Date;

  /**
   * Whether the user account is active
   * @defaultValue true
   */
  isActive: boolean;

  /**
   * User preferences and settings
   * @optional
   */
  preferences?: UserPreferences;
}

/**
 * Discriminated union type for different user roles.
 *
 * @example
 * ```typescript
 * function handleUser(user: UserRole) {
 *   switch (user.type) {
 *     case 'admin':
 *       // user.permissions is available here
 *       console.log('Admin permissions:', user.permissions);
 *       break;
 *     case 'member':
 *       // user.membershipLevel is available here
 *       console.log('Membership level:', user.membershipLevel);
 *       break;
 *     case 'guest':
 *       // user.expiresAt is available here
 *       console.log('Guest expires at:', user.expiresAt);
 *       break;
 *   }
 * }
 * ```
 */
export type UserRole =
  | { type: 'admin'; permissions: string[] }
  | { type: 'member'; membershipLevel: 'basic' | 'premium' }
  | { type: 'guest'; expiresAt: Date };
````

### Error Class Documentation

````typescript
/**
 * Error thrown when user validation fails.
 *
 * This error includes detailed information about which validation
 * rules failed and can be used to provide specific feedback to users.
 *
 * @example
 * ```typescript
 * try {
 *   await userService.createUser(invalidData);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.log('Validation failed:', error.details);
 *     error.details.forEach(detail => {
 *       console.log(`${detail.field}: ${detail.message}`);
 *     });
 *   }
 * }
 * ```
 *
 * @public
 */
export class ValidationError extends Error {
  /**
   * Detailed information about validation failures.
   * Each entry contains the field name and specific error message.
   */
  public readonly details: ValidationDetail[];

  /**
   * Error code for programmatic handling.
   * @defaultValue 'VALIDATION_ERROR'
   */
  public readonly code: string = 'VALIDATION_ERROR';

  /**
   * Creates a new ValidationError.
   *
   * @param message - High-level error message
   * @param details - Specific validation failure details
   */
  constructor(message: string, details: ValidationDetail[]) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }

  /**
   * Returns a formatted string of all validation errors.
   *
   * @returns Multi-line string with each validation error on a separate line
   */
  getFormattedDetails(): string {
    return this.details
      .map((detail) => `${detail.field}: ${detail.message}`)
      .join('\n');
  }
}
````

### Module and Namespace Documentation

````typescript
/**
 * @fileoverview User management utilities and services.
 *
 * This module provides a comprehensive set of tools for managing user data,
 * including validation, caching, and database operations. It follows the
 * repository pattern for data access and includes extensive error handling.
 *
 * @example
 * ```typescript
 * import { UserService, ValidationError } from './user-module';
 *
 * const userService = new UserService(dependencies);
 *
 * try {
 *   const user = await userService.createUser(userData);
 *   console.log('User created:', user.id);
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error('Validation failed:', error.getFormattedDetails());
 *   }
 * }
 * ```
 *
 * @author Development Team <dev@example.com>
 * @since 1.0.0
 * @version 2.1.0
 */

/**
 * Namespace containing user-related utility functions.
 *
 * @namespace UserUtils
 */
export namespace UserUtils {
  /**
   * Validates email format using RFC 5322 compliant regex.
   *
   * @param email - Email address to validate
   * @returns True if email format is valid
   *
   * @example
   * ```typescript
   * if (UserUtils.isValidEmail('user@example.com')) {
   *   console.log('Valid email format');
   * }
   * ```
   */
  export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generates a display name from user data.
   *
   * @param user - User object
   * @returns Formatted display name
   *
   * @internal
   */
  export function getDisplayName(user: Pick<User, 'name' | 'email'>): string {
    return user.name || user.email.split('@')[0];
  }
}
````

### API Route Documentation

````typescript
/**
 * @fileoverview User API routes and handlers.
 *
 * This module defines REST API endpoints for user management operations.
 * All endpoints require authentication except for user registration.
 *
 * @version 2.0.0
 */

import { Router, Request, Response } from 'express';

/**
 * User-related API endpoints.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { userRoutes } from './routes/user-routes';
 *
 * const app = express();
 * app.use('/api/users', userRoutes);
 * ```
 */
export const userRoutes = Router();

/**
 * GET /api/users/:id - Retrieve user by ID.
 *
 * @route GET /api/users/:id
 * @param {string} id - User ID (UUID format)
 * @returns {User} User object if found
 * @returns {404} Not found if user doesn't exist
 * @returns {400} Bad request if ID format is invalid
 *
 * @example
 * ```bash
 * curl -X GET /api/users/123e4567-e89b-12d3-a456-426614174000 \
 *   -H "Authorization: Bearer YOUR_TOKEN"
 * ```
 *
 * @example Response
 * ```json
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "createdAt": "2023-01-01T00:00:00.000Z",
 *   "isActive": true
 * }
 * ```
 */
userRoutes.get('/:id', async (req: Request, res: Response) => {
  // Implementation here
});

/**
 * POST /api/users - Create a new user.
 *
 * @route POST /api/users
 * @param {CreateUserData} body - User data for creation
 * @returns {User} Created user object with generated ID
 * @returns {400} Bad request if validation fails
 * @returns {409} Conflict if email already exists
 *
 * @example Request Body
 * ```json
 * {
 *   "name": "Jane Doe",
 *   "email": "jane@example.com",
 *   "preferences": {
 *     "theme": "dark",
 *     "notifications": true
 *   }
 * }
 * ```
 */
userRoutes.post('/', async (req: Request, res: Response) => {
  // Implementation here
});
````

### Configuration and Constants Documentation

````typescript
/**
 * @fileoverview Application configuration and constants.
 *
 * This module contains all configuration values and constants used
 * throughout the application. Values are loaded from environment
 * variables with sensible defaults for development.
 */

/**
 * Database configuration settings.
 *
 * @example
 * ```typescript
 * import { DatabaseConfig } from './config';
 *
 * const connection = new DatabaseConnection(DatabaseConfig);
 * ```
 */
export const DatabaseConfig = {
  /**
   * Database connection URL.
   * @env DATABASE_URL
   * @defaultValue 'postgresql://localhost:5432/myapp_dev'
   */
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/myapp_dev',

  /**
   * Maximum number of database connections in pool.
   * @env DB_POOL_SIZE
   * @defaultValue 10
   */
  poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),

  /**
   * Connection timeout in milliseconds.
   * @env DB_TIMEOUT
   * @defaultValue 30000
   */
  timeout: parseInt(process.env.DB_TIMEOUT || '30000', 10),
} as const;

/**
 * User validation constants.
 *
 * These constants define the validation rules for user data
 * and are used throughout the application for consistency.
 */
export const UserValidation = {
  /** Minimum length for user names */
  NAME_MIN_LENGTH: 2,

  /** Maximum length for user names */
  NAME_MAX_LENGTH: 100,

  /** Maximum length for email addresses */
  EMAIL_MAX_LENGTH: 254,

  /** Regex pattern for valid email format */
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** List of reserved usernames that cannot be used */
  RESERVED_NAMES: ['admin', 'root', 'system', 'api'] as const,
} as const;
````

## Node.js Specific Documentation

### Process and Environment Documentation

````typescript
/**
 * @fileoverview Process management and graceful shutdown handling.
 *
 * This module handles process lifecycle events and ensures graceful
 * shutdown of the application with proper cleanup of resources.
 */

/**
 * Graceful shutdown manager for Node.js applications.
 *
 * Handles SIGINT and SIGTERM signals to ensure clean shutdown
 * with proper cleanup of database connections, file handles, and
 * other resources.
 *
 * @example
 * ```typescript
 * const shutdownManager = new GracefulShutdown();
 *
 * shutdownManager.addHandler('database', async () => {
 *   await database.disconnect();
 * });
 *
 * shutdownManager.addHandler('server', async () => {
 *   await server.close();
 * });
 *
 * shutdownManager.start();
 * ```
 */
export class GracefulShutdown {
  /**
   * Map of cleanup handlers by name.
   * @private
   */
  private handlers = new Map<string, () => Promise<void>>();

  /**
   * Whether shutdown process has started.
   * @private
   */
  private isShuttingDown = false;

  /**
   * Adds a cleanup handler for a named resource.
   *
   * @param name - Unique name for the handler
   * @param handler - Async function to clean up the resource
   *
   * @throws {Error} If handler name already exists
   */
  addHandler(name: string, handler: () => Promise<void>): void {
    if (this.handlers.has(name)) {
      throw new Error(`Handler '${name}' already exists`);
    }
    this.handlers.set(name, handler);
  }
}
````

### Stream Documentation

````typescript
/**
 * Custom transform stream for processing large datasets.
 *
 * This stream processes data in chunks to handle large files
 * efficiently without loading everything into memory at once.
 *
 * @example
 * ```typescript
 * import fs from 'fs';
 * import { DataProcessor } from './data-processor';
 *
 * const processor = new DataProcessor({
 *   batchSize: 1000,
 *   transform: (chunk) => chunk.toUpperCase()
 * });
 *
 * fs.createReadStream('input.txt')
 *   .pipe(processor)
 *   .pipe(fs.createWriteStream('output.txt'));
 * ```
 */
export class DataProcessor extends Transform {
  /**
   * Number of items to process in each batch.
   * @private
   */
  private readonly batchSize: number;

  /**
   * Function to transform each data chunk.
   * @private
   */
  private readonly transformFn: (chunk: string) => string;

  /**
   * Creates a new DataProcessor stream.
   *
   * @param options - Processor configuration
   * @param options.batchSize - Number of items per batch
   * @param options.transform - Function to transform each chunk
   */
  constructor(options: DataProcessorOptions) {
    super({ objectMode: true });
    this.batchSize = options.batchSize || 100;
    this.transformFn = options.transform || ((x) => x);
  }
}
````

## README and Package Documentation

### Package.json Documentation Guidelines

```json
{
  "name": "user-management-service",
  "version": "2.1.0",
  "description": "Comprehensive user management service with caching, validation, and REST API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "docs": "typedoc src --out docs"
  },
  "keywords": [
    "user-management",
    "authentication",
    "rest-api",
    "typescript",
    "caching"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/user-management-service.git"
  },
  "bugs": {
    "url": "https://github.com/username/user-management-service/issues"
  },
  "homepage": "https://github.com/username/user-management-service#readme"
}
```

### TypeDoc Configuration

```javascript
// typedoc.json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "excludePrivate": true,
  "excludeProtected": false,
  "excludeInternal": false,
  "categorizeByGroup": true,
  "sort": ["source-order"],
  "kindSortOrder": [
    "Module",
    "Namespace",
    "Enum",
    "Class",
    "Interface",
    "Function",
    "Variable"
  ],
  "theme": "default",
  "readme": "README.md",
  "includeVersion": true
}
```
