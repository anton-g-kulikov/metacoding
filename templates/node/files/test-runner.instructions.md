---
description: "Node.js backend testing guidelines with API testing and cleanup procedures"
applyTo: "test/**/*.ts"
---

# Node.js Backend Testing Guidelines

## Testing Framework Setup

### Recommended Testing Stack
- **Test Runner:** Jest for comprehensive testing with TypeScript support
- **API Testing:** Supertest for HTTP endpoint testing
- **Database Testing:** In-memory databases or Docker containers for isolation
- **Mocking:** Jest mocks for external dependencies and services
- **Coverage:** Built-in Jest coverage reporting
- **Integration Testing:** Comprehensive integration test patterns for Node.js APIs

### Test Environment Configuration
```json
{
  "testEnvironment": "node",
  "coverageDirectory": "coverage",
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts"
  ],
  "testMatch": [
    "**/test/**/*.test.ts",
    "**/test/**/*.spec.ts"
  ],
  "setupFilesAfterEnv": ["<rootDir>/test/setup.ts"]
}
```

## Test Organization and Structure

### Directory Structure
```
test/
├── setup.ts                # Global test setup and configuration
├── fixtures/               # Test data and fixtures
│   ├── users.json
│   └── api-responses.json
├── helpers/                # Test utility functions
│   ├── database.ts         # Database setup/teardown helpers
│   └── api-client.ts       # API testing utilities
├── unit/                   # Unit tests for services, utilities
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/            # Integration tests for database operations
│   ├── repositories/
│   └── services/
└── api/                    # API endpoint tests
    ├── auth.test.ts
    ├── users.test.ts
    └── posts.test.ts
```

### Test File Naming Conventions
- **Unit Tests:** `<component>.test.ts` or `<component>.spec.ts`
- **Integration Tests:** `<feature>.integration.test.ts`
- **API Tests:** `<endpoint>.api.test.ts`
- **Fixtures:** `<entity>-fixture.ts` or `<entity>.json`

## Unit Testing Guidelines

### Service Layer Testing
```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test User' };
      mockUserRepository.create.mockResolvedValue(userData as User);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(userData);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const userData = { email: 'existing@example.com', name: 'Test User' };
      mockUserRepository.create.mockRejectedValue(new Error('Email already exists'));

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });
});
```

### Utility Function Testing
```typescript
describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user+tag@domain.co.uk',
      'firstname.lastname@example.org'
    ];

    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  it('should return false for invalid email addresses', () => {
    const invalidEmails = [
      'invalid-email',
      '@example.com',
      'test@',
      ''
    ];

    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
```

## API Testing Guidelines

### HTTP Endpoint Testing with Supertest
```typescript
import request from 'supertest';
import { app } from '../src/app';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database';

describe('User API', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'securepassword'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: userData.email,
        name: userData.name
      });
      expect(response.body.password).toBeUndefined();
    });

    it('should return 400 for invalid email', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.error).toContain('Invalid email');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .get(`/api/users/${user.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: user.id,
        email: user.email,
        name: user.name
      });
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/99999')
        .expect(404);
    });
  });
});
```

### Authentication Testing
```typescript
describe('Protected Routes', () => {
  let authToken: string;

  beforeEach(async () => {
    const user = await createTestUser();
    authToken = generateTestToken(user.id);
  });

  it('should access protected route with valid token', async () => {
    await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should return 401 for missing token', async () => {
    await request(app)
      .get('/api/protected')
      .expect(401);
  });

  it('should return 401 for invalid token', async () => {
    await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
```

## Database Testing

### Test Database Setup
```typescript
// test/helpers/database.ts
import { DataSource } from 'typeorm';
import { createDatabase, dropDatabase } from 'typeorm-extension';

let testDataSource: DataSource;

export async function setupTestDatabase() {
  const databaseName = `test_db_${Date.now()}`;
  
  await createDatabase({
    ifNotExist: true,
    options: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: databaseName,
    },
  });

  testDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: databaseName,
    entities: ['src/models/*.ts'],
    synchronize: true,
  });

  await testDataSource.initialize();
}

export async function cleanupTestDatabase() {
  if (testDataSource) {
    const databaseName = testDataSource.options.database as string;
    await testDataSource.destroy();
    
    await dropDatabase({
      options: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test',
        password: 'test',
        database: databaseName,
      },
    });
  }
}

export async function clearTestData() {
  if (testDataSource) {
    const entities = testDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = testDataSource.getRepository(entity.name);
      await repository.clear();
    }
  }
}
```

### Repository Testing
```typescript
describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeAll(async () => {
    await setupTestDatabase();
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await clearTestData();
  });

  it('should save and retrieve user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      hashedPassword: 'hashed_password'
    };

    const savedUser = await userRepository.save(userData);
    expect(savedUser.id).toBeDefined();

    const retrievedUser = await userRepository.findById(savedUser.id);
    expect(retrievedUser).toMatchObject(userData);
  });
});
```

## Test Data Management

### Fixtures and Factories
```typescript
// test/fixtures/user-factory.ts
export interface UserFixture {
  email: string;
  name: string;
  password: string;
}

export const createUserFixture = (overrides: Partial<UserFixture> = {}): UserFixture => ({
  email: 'test@example.com',
  name: 'Test User',
  password: 'securepassword123',
  ...overrides,
});

export const createMultipleUserFixtures = (count: number): UserFixture[] => {
  return Array.from({ length: count }, (_, index) =>
    createUserFixture({
      email: `user${index}@example.com`,
      name: `User ${index}`,
    })
  );
};
```

### Test Helpers
```typescript
// test/helpers/api-client.ts
export async function createTestUser(userData?: Partial<UserFixture>) {
  const user = createUserFixture(userData);
  const response = await request(app)
    .post('/api/users')
    .send(user);
  return response.body;
}

export function generateTestToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}
```

## Mocking and Test Doubles

### External Service Mocking
```typescript
// Mock external HTTP services
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExternalApiService', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('should fetch data from external API', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const service = new ExternalApiService();
    const result = await service.fetchData(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/data/1');
    expect(result).toEqual(mockResponse.data);
  });
});
```

### Database Mocking
```typescript
// Mock repository for unit tests
const mockUserRepository = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
} as jest.Mocked<IUserRepository>;
```

## Performance and Load Testing

### Basic Performance Tests
```typescript
describe('Performance Tests', () => {
  it('should handle concurrent requests', async () => {
    const concurrentRequests = 10;
    const promises = Array.from({ length: concurrentRequests }, () =>
      request(app)
        .get('/api/users')
        .expect(200)
    );

    const startTime = Date.now();
    await Promise.all(promises);
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
  });
});
```

## Temporary File Management and Cleanup

### Test Artifact Cleanup

#### Automated Cleanup in Tests
```typescript
// Clean up test files after each test
afterEach(async () => {
  // Clean up uploaded test files
  const uploadDir = path.join(process.cwd(), 'uploads/test');
  if (fs.existsSync(uploadDir)) {
    await fs.promises.rmdir(uploadDir, { recursive: true });
  }

  // Clear test logs
  const logDir = path.join(process.cwd(), 'logs/test');
  if (fs.existsSync(logDir)) {
    const files = await fs.promises.readdir(logDir);
    await Promise.all(
      files.map(file => fs.promises.unlink(path.join(logDir, file)))
    );
  }

  // Clear Redis test cache
  if (redisClient) {
    await redisClient.flushdb();
  }
});
```

#### Build and Coverage Cleanup
```bash
# Clean test coverage reports
rm -rf coverage/

# Clean test databases
rm -rf test-db/

# Clean temporary test files
find tmp/ -name "test-*" -type f -delete

# Clean Jest cache
npx jest --clearCache
```

### File Upload Testing Cleanup
```typescript
describe('File Upload', () => {
  const testUploadDir = path.join(process.cwd(), 'uploads/test');

  beforeEach(async () => {
    await fs.promises.mkdir(testUploadDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up all test upload files
    if (fs.existsSync(testUploadDir)) {
      await fs.promises.rmdir(testUploadDir, { recursive: true });
    }
  });

  it('should handle file upload', async () => {
    const testFilePath = path.join(__dirname, 'fixtures/test-file.txt');
    
    const response = await request(app)
      .post('/api/upload')
      .attach('file', testFilePath)
      .expect(200);

    expect(response.body.filename).toBeDefined();
    
    // Verify file was saved
    const uploadedFilePath = path.join(testUploadDir, response.body.filename);
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
  });
});
```

### Database Connection Cleanup
```typescript
// Ensure all database connections are closed
afterAll(async () => {
  // Close database connections
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
  }

  // Close Redis connections
  if (redisClient) {
    await redisClient.quit();
  }

  // Close any other persistent connections
  if (mqConnection) {
    await mqConnection.close();
  }
});
```

## Test Execution Commands

### NPM Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest test/unit",
    "test:integration": "jest test/integration",
    "test:api": "jest test/api",
    "test:clean": "rm -rf coverage/ && jest --clearCache"
  }
}
```

### Pre-commit Testing
```bash
# Run all tests before commit
npm run test

# Run with coverage check
npm run test:coverage

# Clean and run tests
npm run test:clean && npm run test
```

## Continuous Integration

### GitHub Actions Configuration
```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
        env:
          NODE_ENV: test
          DATABASE_URL: postgres://postgres:test@localhost:5432/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

## Best Practices Summary

### Test Quality
- **Write descriptive test names** that explain the scenario and expected outcome
- **Use AAA pattern** (Arrange, Act, Assert) for clear test structure
- **Test both happy path and error scenarios**
- **Keep tests independent** and avoid shared state between tests
- **Use realistic test data** that represents actual usage

### Performance
- **Run tests in parallel** where possible to reduce execution time
- **Use test databases** separate from development data
- **Mock external services** to avoid network dependencies in tests
- **Clean up resources** properly to prevent memory leaks in test runs

### Maintenance
- **Keep test code clean** and refactored like production code
- **Update tests** when requirements or APIs change
- **Regular cleanup** of test artifacts and temporary files
- **Monitor test execution time** and optimize slow tests
