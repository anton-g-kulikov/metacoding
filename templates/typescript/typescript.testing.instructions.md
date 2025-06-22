---
description: 'TypeScript/Node.js-specific testing patterns and frameworks'
applyTo: 'test/**/*.{ts,js}'
language: 'typescript'
---

# TypeScript/Node.js Testing Standards

## Testing Framework and Setup

### Primary Testing Framework: Jest

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Test Case Naming Conventions

**Area Prefixes for Node.js/Backend:**

- `API` - API endpoint tests
- `SRV` - Service layer tests
- `DB` - Database/Data layer tests
- `MW` - Middleware tests
- `ROUTE` - Routing logic tests
- `AUTH` - Authentication/Authorization tests
- `UTIL` - Utility function tests
- `CONFIG` - Configuration management tests
- `CORE` - Core business logic tests
- `INT` - Integration tests
- `E2E` - End-to-end tests

**Examples:**

- `API-UNIT-001` - First unit test for API endpoints
- `SRV-UNIT-001` - First unit test for Service layer
- `DB-INT-001` - First integration test for Database
- `E2E-FLOW-001` - First end-to-end workflow test

## Unit Testing Patterns

### Service Layer Testing

```typescript
// test/unit/user-service.test.ts
import { UserService } from '../../src/services/user-service';
import { UserRepository } from '../../src/repositories/user-repository';
import { User } from '../../src/types/user';

// Mock the repository
jest.mock('../../src/repositories/user-repository');
const MockUserRepository = UserRepository as jest.MockedClass<
  typeof UserRepository
>;

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository =
      new MockUserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      // Arrange
      const userId = '123';
      const expectedUser: User = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = '999';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId)).rejects.toThrow(
        'User not found'
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});
```

### API Endpoint Testing

```typescript
// test/unit/user-controller.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { UserService } from '../../src/services/user-service';

// Mock the service
jest.mock('../../src/services/user-service');
const MockUserService = UserService as jest.MockedClass<typeof UserService>;

describe('User Controller', () => {
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    mockUserService = new MockUserService() as jest.Mocked<UserService>;
    // Inject mock into controller if using dependency injection
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/:id', () => {
    it('should return user when valid id provided', async () => {
      // Arrange
      const userId = '123';
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      // Assert
      expect(response.body).toEqual(mockUser);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user not found', async () => {
      // Arrange
      const userId = '999';
      mockUserService.getUserById.mockRejectedValue(
        new Error('User not found')
      );

      // Act
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);

      // Assert
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 400 when invalid id format', async () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act
      const response = await request(app)
        .get(`/api/users/${invalidId}`)
        .expect(400);

      // Assert
      expect(response.body).toEqual({ error: 'Invalid user ID format' });
    });
  });
});
```

### Utility Function Testing

```typescript
// test/unit/string-utils.test.ts
import { capitalize, slugify, truncate } from '../../src/utils/string-utils';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should not change already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! @World#')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longString = 'This is a very long string that should be truncated';
      expect(truncate(longString, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short strings', () => {
      const shortString = 'Short';
      expect(truncate(shortString, 20)).toBe('Short');
    });
  });
});
```

## Integration Testing

### Database Integration Testing

```typescript
// test/integration/user-repository.test.ts
import { UserRepository } from '../../src/repositories/user-repository';
import { DatabaseConnection } from '../../src/database/connection';
import { User } from '../../src/types/user';

describe('UserRepository Integration', () => {
  let userRepository: UserRepository;
  let db: DatabaseConnection;

  beforeAll(async () => {
    // Setup test database
    db = new DatabaseConnection(process.env.TEST_DATABASE_URL);
    await db.connect();
    userRepository = new UserRepository(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await db.query('DELETE FROM users');
  });

  describe('findById', () => {
    it('should find existing user', async () => {
      // Arrange
      const userData: Omit<User, 'id'> = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const createdUser = await userRepository.create(userData);

      // Act
      const foundUser = await userRepository.findById(createdUser.id);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should return null for non-existent user', async () => {
      // Act
      const foundUser = await userRepository.findById('999');

      // Assert
      expect(foundUser).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new user with generated id', async () => {
      // Arrange
      const userData: Omit<User, 'id'> = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      // Act
      const createdUser = await userRepository.create(userData);

      // Assert
      expect(createdUser).toMatchObject(userData);
      expect(createdUser.id).toBeDefined();
      expect(typeof createdUser.id).toBe('string');
    });

    it('should enforce unique email constraint', async () => {
      // Arrange
      const userData: Omit<User, 'id'> = {
        name: 'John Doe',
        email: 'duplicate@example.com',
      };
      await userRepository.create(userData);

      // Act & Assert
      await expect(userRepository.create(userData)).rejects.toThrow(
        'Email already exists'
      );
    });
  });
});
```

### API Integration Testing

```typescript
// test/integration/user-api.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { DatabaseConnection } from '../../src/database/connection';

describe('User API Integration', () => {
  let db: DatabaseConnection;

  beforeAll(async () => {
    db = new DatabaseConnection(process.env.TEST_DATABASE_URL);
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.query('DELETE FROM users');
  });

  describe('POST /api/users', () => {
    it('should create new user and return 201', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject(userData);
      expect(response.body.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      // Arrange
      const invalidData = {
        name: 'John Doe',
        // Missing email
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body.error).toContain('email is required');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      // Arrange
      const users = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
      ];

      for (const user of users) {
        await request(app).post('/api/users').send(user);
      }

      // Act
      const response = await request(app).get('/api/users').expect(200);

      // Assert
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(users[0]);
      expect(response.body[1]).toMatchObject(users[1]);
    });
  });
});
```

## Mocking Strategies

### External Service Mocking

```typescript
// test/mocks/external-api.ts
import nock from 'nock';

export const mockExternalAPI = {
  mockUserLookup: (userId: string, userData: any) => {
    return nock('https://api.external-service.com')
      .get(`/users/${userId}`)
      .reply(200, userData);
  },

  mockUserLookupError: (userId: string, statusCode: number = 500) => {
    return nock('https://api.external-service.com')
      .get(`/users/${userId}`)
      .reply(statusCode, { error: 'External service error' });
  },

  cleanup: () => {
    nock.cleanAll();
  },
};

// Usage in tests
describe('External Service Integration', () => {
  afterEach(() => {
    mockExternalAPI.cleanup();
  });

  it('should handle external API success', async () => {
    // Arrange
    const userId = '123';
    const userData = { id: userId, name: 'John Doe' };
    mockExternalAPI.mockUserLookup(userId, userData);

    // Act & Assert
    const result = await externalService.getUser(userId);
    expect(result).toEqual(userData);
  });
});
```

### File System Mocking

```typescript
// test/unit/file-service.test.ts
import fs from 'fs/promises';
import { FileService } from '../../src/services/file-service';

// Mock fs module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(() => {
    fileService = new FileService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('readConfig', () => {
    it('should read and parse JSON config file', async () => {
      // Arrange
      const configData = { host: 'localhost', port: 3000 };
      const configJson = JSON.stringify(configData);
      mockFs.readFile.mockResolvedValue(configJson);

      // Act
      const result = await fileService.readConfig('/path/to/config.json');

      // Assert
      expect(result).toEqual(configData);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        '/path/to/config.json',
        'utf8'
      );
    });

    it('should handle file read errors', async () => {
      // Arrange
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      // Act & Assert
      await expect(
        fileService.readConfig('/nonexistent/config.json')
      ).rejects.toThrow('File not found');
    });
  });
});
```

## Async Testing Patterns

### Promise Testing

```typescript
// test/unit/async-service.test.ts
import { AsyncService } from '../../src/services/async-service';

describe('AsyncService', () => {
  let asyncService: AsyncService;

  beforeEach(() => {
    asyncService = new AsyncService();
  });

  describe('processData', () => {
    it('should process data asynchronously', async () => {
      // Arrange
      const inputData = ['item1', 'item2', 'item3'];

      // Act
      const result = await asyncService.processData(inputData);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toContain('processed');
    });

    it('should handle processing errors', async () => {
      // Arrange
      const invalidData = [null, undefined];

      // Act & Assert
      await expect(asyncService.processData(invalidData)).rejects.toThrow(
        'Invalid data provided'
      );
    });
  });

  describe('processWithTimeout', () => {
    it('should complete within timeout', async () => {
      // Arrange
      const data = 'test data';
      const timeout = 1000;

      // Act
      const startTime = Date.now();
      const result = await asyncService.processWithTimeout(data, timeout);
      const endTime = Date.now();

      // Assert
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(timeout);
    });

    it('should timeout for long operations', async () => {
      // Arrange
      const data = 'long processing data';
      const shortTimeout = 100;

      // Act & Assert
      await expect(
        asyncService.processWithTimeout(data, shortTimeout)
      ).rejects.toThrow('Operation timed out');
    });
  });
});
```

### Event Emitter Testing

```typescript
// test/unit/event-service.test.ts
import { EventService } from '../../src/services/event-service';

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    eventService = new EventService();
  });

  afterEach(() => {
    eventService.removeAllListeners();
  });

  describe('user events', () => {
    it('should emit user created event', (done) => {
      // Arrange
      const userData = { id: '123', name: 'John Doe' };

      // Act
      eventService.on('user:created', (data) => {
        // Assert
        expect(data).toEqual(userData);
        done();
      });

      eventService.createUser(userData);
    });

    it('should handle multiple listeners', () => {
      // Arrange
      const userData = { id: '123', name: 'John Doe' };
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      eventService.on('user:created', listener1);
      eventService.on('user:created', listener2);

      // Act
      eventService.createUser(userData);

      // Assert
      expect(listener1).toHaveBeenCalledWith(userData);
      expect(listener2).toHaveBeenCalledWith(userData);
    });
  });
});
```

## Performance Testing

### Benchmark Testing

```typescript
// test/performance/string-utils.perf.test.ts
import { performance } from 'perf_hooks';
import { processLargeString } from '../../src/utils/string-utils';

describe('String Utils Performance', () => {
  const PERFORMANCE_THRESHOLD = 100; // milliseconds

  describe('processLargeString', () => {
    it('should process large string within performance threshold', () => {
      // Arrange
      const largeString = 'x'.repeat(1000000); // 1MB string

      // Act
      const startTime = performance.now();
      const result = processLargeString(largeString);
      const endTime = performance.now();

      // Assert
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(PERFORMANCE_THRESHOLD);
    });
  });
});
```

## Test Utilities and Helpers

### Test Data Factories

```typescript
// test/factories/user-factory.ts
import { User } from '../../src/types/user';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, index) =>
      this.create({
        ...overrides,
        email: `test${index}@example.com`,
      })
    );
  }
}

// Usage in tests
describe('User Service', () => {
  it('should process multiple users', () => {
    const users = UserFactory.createMany(5);
    expect(users).toHaveLength(5);
    expect(users[0].email).toBe('test0@example.com');
  });
});
```

### Custom Matchers

```typescript
// test/matchers/custom-matchers.ts
export const customMatchers = {
  toBeValidUser(received: any) {
    const pass =
      typeof received === 'object' &&
      typeof received.id === 'string' &&
      typeof received.name === 'string' &&
      typeof received.email === 'string' &&
      received.email.includes('@');

    return {
      message: () => `Expected ${received} to be a valid user object`,
      pass,
    };
  },
};

// Setup in test files
expect.extend(customMatchers);

// Usage
describe('User Service', () => {
  it('should return valid user', () => {
    const user = userService.getUser('123');
    expect(user).toBeValidUser();
  });
});
```
