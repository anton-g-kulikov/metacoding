---
description: 'TypeScript/Node.js coding standards and conventions'
applyTo: '**/*.ts'
---

# TypeScript/Node.js Coding Standards

## Language and Framework Preferences

- **Primary Language:** TypeScript for all code files
- **Code Style:** Follow project's ESLint/Prettier configuration
- **Target Compatibility:** Node.js 18+, TypeScript 4.9+
- **Module System:** ES modules (import/export)

## Code Quality Guidelines

- **Type Safety:** Use strict TypeScript configuration with `strict: true`
- **Type Annotations:** Explicit types for function parameters and return values
- **Interface Design:** Prefer interfaces over type aliases for object shapes
- **Generic Constraints:** Use generic constraints to ensure type safety
- **Null Safety:** Use strict null checks and optional chaining

## Naming Conventions

- **Files:** Use kebab-case for file names (e.g., `user-service.ts`)
- **Classes:** PascalCase (e.g., `UserService`, `DatabaseConnection`)
- **Functions/Methods:** camelCase (e.g., `getUserById`, `validateInput`)
- **Variables:** camelCase (e.g., `userId`, `isValid`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Interfaces:** PascalCase with 'I' prefix (e.g., `IUserRepository`)
- **Types:** PascalCase (e.g., `UserData`, `ConfigOptions`)
- **Enums:** PascalCase (e.g., `UserRole`, `HttpStatus`)

## TypeScript-Specific Best Practices

### Type Definitions

```typescript
// ✅ Good: Explicit interface definitions
interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Good: Generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// ❌ Bad: Using 'any' type
const userData: any = getUserData();
```

### Error Handling

```typescript
// ✅ Good: Typed error handling
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Good: Result pattern for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeOperation(): Promise<Result<UserData>> {
  try {
    const data = await fetchUserData();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### Async/Await Patterns

```typescript
// ✅ Good: Proper async/await usage
async function processUsers(userIds: string[]): Promise<UserData[]> {
  const users = await Promise.all(
    userIds.map((id) => userService.findById(id))
  );
  return users.filter((user): user is UserData => user !== null);
}

// ❌ Bad: Mixing promises and async/await
async function badExample() {
  return someAsyncOperation().then((result) => {
    return processResult(result);
  });
}
```

### Module Organization

```typescript
// ✅ Good: Barrel exports in index.ts
export { UserService } from './user-service';
export { DatabaseConnection } from './database-connection';
export type { UserData, CreateUserRequest } from './types';

// ✅ Good: Single responsibility per file
// user-service.ts
export class UserService {
  constructor(private repository: IUserRepository) {}

  async createUser(data: CreateUserRequest): Promise<UserData> {
    // Implementation
  }
}
```

## Node.js-Specific Guidelines

### File System Operations

```typescript
// ✅ Good: Async file operations with proper error handling
import { promises as fs } from 'fs';
import { join } from 'path';

async function readConfigFile(
  filename: string
): Promise<Record<string, unknown>> {
  try {
    const configPath = join(process.cwd(), 'config', filename);
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read config file ${filename}: ${error.message}`);
  }
}
```

### Environment Configuration

```typescript
// ✅ Good: Type-safe environment variables
interface EnvironmentConfig {
  port: number;
  databaseUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
}

function getEnvironmentConfig(): EnvironmentConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const databaseUrl = process.env.DATABASE_URL;
  const nodeEnv = process.env.NODE_ENV as EnvironmentConfig['nodeEnv'];

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return { port, databaseUrl, nodeEnv: nodeEnv || 'development' };
}
```

### Logging and Debugging

```typescript
// ✅ Good: Structured logging
interface LogContext {
  userId?: string;
  requestId?: string;
  operation: string;
}

class Logger {
  info(message: string, context: LogContext): void {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...context,
      })
    );
  }

  error(message: string, error: Error, context: LogContext): void {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        ...context,
      })
    );
  }
}
```

## Performance Considerations

### Memory Management

```typescript
// ✅ Good: Streaming large data sets
import { Transform } from 'stream';

class DataProcessor extends Transform {
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    // Process chunk by chunk instead of loading everything into memory
    const processed = this.processChunk(chunk);
    callback(null, processed);
  }
}

// ✅ Good: Cleaning up resources
class DatabaseConnection {
  private connection: Connection | null = null;

  async connect(): Promise<void> {
    this.connection = await createConnection();
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
```

### Caching Strategies

```typescript
// ✅ Good: Simple in-memory cache with TTL
class CacheService<T> {
  private cache = new Map<string, { data: T; expires: number }>();

  set(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || entry.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
}
```

## Testing Patterns

### Unit Testing with Jest

```typescript
// ✅ Good: Type-safe mocking
interface MockUserRepository extends IUserRepository {
  findById: jest.MockedFunction<IUserRepository['findById']>;
  save: jest.MockedFunction<IUserRepository['save']>;
}

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    userService = new UserService(mockRepository);
  });

  it('should return user when found', async () => {
    // Arrange
    const userData: UserData = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    };
    mockRepository.findById.mockResolvedValue(userData);

    // Act
    const result = await userService.getUserById('123');

    // Assert
    expect(result).toEqual(userData);
    expect(mockRepository.findById).toHaveBeenCalledWith('123');
  });
});
```

## Security Best Practices

### Input Validation

```typescript
import { z } from 'zod';

// ✅ Good: Schema-based validation
const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

type CreateUserRequest = z.infer<typeof CreateUserSchema>;

function validateCreateUserRequest(data: unknown): CreateUserRequest {
  try {
    return CreateUserSchema.parse(data);
  } catch (error) {
    throw new ValidationError(
      'Invalid user data',
      'request',
      'VALIDATION_FAILED'
    );
  }
}
```

### SQL Injection Prevention

```typescript
// ✅ Good: Parameterized queries
async function getUserByEmail(email: string): Promise<UserData | null> {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await database.query(query, [email]);
  return result.rows[0] || null;
}

// ❌ Bad: String concatenation
async function badGetUserByEmail(email: string): Promise<UserData | null> {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const result = await database.query(query);
  return result.rows[0] || null;
}
```

## Common TypeScript Anti-Patterns to Avoid

- **Using `any` type:** Always prefer specific types or `unknown`
- **Ignoring compiler errors:** Address TypeScript errors, don't suppress them
- **Overusing `as` assertions:** Use type guards and proper type narrowing
- **Not defining return types:** Always specify return types for functions
- **Mixing CommonJS and ES modules:** Stick to ES modules consistently
- **Not using strict mode:** Always enable strict TypeScript configuration
- **Mutating props or parameters:** Prefer immutable patterns
- **Not handling promise rejections:** Always handle async operation failures
