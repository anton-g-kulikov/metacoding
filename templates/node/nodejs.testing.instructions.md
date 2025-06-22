---
description: 'Node.js backend testing strategies and frameworks'
applyTo: 'test/**/*.{ts,js}'
---

# Node.js Backend Testing Guidelines

## Testing Strategy Overview

### Testing Pyramid for Node.js Backend

- **Unit Tests (70%):** Test individual functions and modules in isolation
- **Integration Tests (20%):** Test interactions between components
- **End-to-End Tests (10%):** Test complete user workflows through APIs
- **Contract Tests:** Verify API contracts and external service interactions

### Test Framework Selection

- **Primary Framework:** Jest for unit and integration testing
- **API Testing:** Supertest for HTTP endpoint testing
- **Database Testing:** Test containers or in-memory databases
- **Mocking:** Jest mocks for external dependencies
- **Load Testing:** Artillery or k6 for performance testing

## Unit Testing Best Practices

### Test Structure and Organization

- **Test File Naming:** Use `.test.ts` or `.spec.ts` suffix
- **Test Grouping:** Group related tests using `describe` blocks
- **Test Isolation:** Each test should be independent and idempotent
- **Test Data:** Use factories or builders for test data creation
- **Test Cleanup:** Clean up resources after each test

```typescript
// Example test structure
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    userService = new UserService(mockRepository);
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = UserFactory.build();
      mockRepository.save.mockResolvedValue(userData);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
    });

    it('should throw ValidationError for invalid email', async () => {
      // Arrange
      const invalidUserData = UserFactory.build({ email: 'invalid-email' });

      // Act & Assert
      await expect(userService.createUser(invalidUserData)).rejects.toThrow(
        ValidationError
      );
    });
  });
});
```

### Mocking Strategies

- **External Dependencies:** Mock all external services and databases
- **File System Operations:** Mock file system interactions
- **Time-Dependent Code:** Mock dates and timers
- **Environment Variables:** Mock configuration and environment
- **HTTP Requests:** Mock external API calls

```typescript
// Example mocking patterns
jest.mock('fs-extra');
jest.mock('../services/email-service');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockEmailService = EmailService as jest.MockedClass<typeof EmailService>;

describe('FileProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.readFile.mockResolvedValue('file content');
  });
});
```

## Integration Testing

### Database Testing

- **Test Database:** Use separate test database or test containers
- **Transaction Rollback:** Rollback transactions after each test
- **Seed Data:** Create consistent test data sets
- **Migration Testing:** Test database migrations
- **Performance Testing:** Test query performance

```typescript
// Example database integration test
describe('UserRepository Integration', () => {
  let repository: UserRepository;
  let connection: Connection;

  beforeAll(async () => {
    connection = await createTestConnection();
    repository = new UserRepository(connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true); // Reset database
  });

  it('should save and retrieve user correctly', async () => {
    // Arrange
    const userData = UserFactory.build();

    // Act
    const savedUser = await repository.save(userData);
    const retrievedUser = await repository.findById(savedUser.id);

    // Assert
    expect(retrievedUser).toEqual(savedUser);
  });
});
```

### API Endpoint Testing

- **HTTP Testing:** Use Supertest for endpoint testing
- **Authentication Testing:** Test auth middleware and permissions
- **Validation Testing:** Test request validation and error responses
- **Response Format:** Verify response structure and data types
- **Status Code Testing:** Test all possible HTTP status codes

```typescript
// Example API endpoint test
describe('POST /api/v1/users', () => {
  let app: Application;

  beforeAll(() => {
    app = createTestApp();
  });

  it('should create user with valid data', async () => {
    // Arrange
    const userData = UserFactory.build();

    // Act
    const response = await request(app)
      .post('/api/v1/users')
      .send(userData)
      .expect(201);

    // Assert
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
  });

  it('should return 400 for invalid email', async () => {
    // Arrange
    const invalidData = UserFactory.build({ email: 'invalid' });

    // Act
    const response = await request(app)
      .post('/api/v1/users')
      .send(invalidData)
      .expect(400);

    // Assert
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## End-to-End Testing

### Full Workflow Testing

- **User Scenarios:** Test complete user journeys
- **Multi-Service Testing:** Test interactions between services
- **Real Database:** Use real database for E2E tests
- **External Services:** Use real or staging external services
- **Browser Testing:** Test web interfaces if applicable

### Authentication and Authorization Testing

- **Login Flows:** Test complete authentication flows
- **Token Management:** Test token generation and validation
- **Permission Testing:** Test role-based access control
- **Session Management:** Test session creation and cleanup
- **Security Testing:** Test for common security vulnerabilities

## Performance Testing

### Load Testing Strategies

- **Baseline Performance:** Establish performance baselines
- **Stress Testing:** Test system limits and breaking points
- **Spike Testing:** Test sudden load increases
- **Volume Testing:** Test with large amounts of data
- **Endurance Testing:** Test sustained load over time

```javascript
// Example Artillery load test configuration
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: 'User Creation Flow'
    weight: 70
    flow:
      - post:
          url: '/api/v1/users'
          json:
            email: '{{ $randomEmail() }}'
            name: '{{ $randomString() }}'
      - think: 1

  - name: 'User Retrieval'
    weight: 30
    flow:
      - get:
          url: '/api/v1/users/{{ userId }}'
```

### Database Performance Testing

- **Query Performance:** Test slow query detection
- **Connection Pool Testing:** Test connection pool limits
- **Transaction Performance:** Test transaction overhead
- **Index Effectiveness:** Test query optimization
- **Data Volume Testing:** Test with production-like data volumes

## Test Data Management

### Test Factories and Builders

- **Data Factories:** Create consistent test data
- **Builder Pattern:** Flexible test data creation
- **Realistic Data:** Use realistic but not real user data
- **Data Relationships:** Handle related entity creation
- **Data Cleanup:** Ensure test data doesn't leak between tests

```typescript
// Example test factory
export class UserFactory {
  static build(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static buildMany(count: number, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}
```

### Database Seeding and Fixtures

- **Seed Scripts:** Create consistent database states
- **Fixture Management:** Manage test fixture lifecycle
- **Data Isolation:** Prevent test data interference
- **Cleanup Strategies:** Efficient test cleanup procedures
- **Snapshot Testing:** Use database snapshots for complex scenarios

## Security Testing

### Authentication Testing

- **Token Validation:** Test JWT token validation
- **Password Security:** Test password hashing and validation
- **Brute Force Protection:** Test rate limiting and account lockout
- **Session Security:** Test session hijacking prevention
- **Multi-Factor Authentication:** Test MFA implementation

### Authorization Testing

- **Role-Based Access:** Test different user roles and permissions
- **Resource Access:** Test access to protected resources
- **Privilege Escalation:** Test prevention of privilege escalation
- **Cross-Tenant Access:** Test multi-tenant isolation
- **API Security:** Test API authentication and authorization

### Vulnerability Testing

- **Input Validation:** Test for injection attacks
- **Cross-Site Scripting:** Test XSS prevention
- **Cross-Site Request Forgery:** Test CSRF protection
- **Dependency Scanning:** Test for vulnerable dependencies
- **Security Headers:** Test security header implementation

## Test Environment Management

### Environment Isolation

- **Test Containers:** Use Docker containers for isolation
- **Environment Variables:** Manage test-specific configuration
- **Service Mocking:** Mock external services appropriately
- **Database Isolation:** Separate test databases
- **Network Isolation:** Isolate test network traffic

### Continuous Integration Testing

- **Pipeline Integration:** Run tests in CI/CD pipelines
- **Parallel Testing:** Run tests in parallel for speed
- **Test Reporting:** Generate comprehensive test reports
- **Coverage Reporting:** Track and report test coverage
- **Failure Analysis:** Analyze and debug test failures

### Test Monitoring and Metrics

- **Test Performance:** Monitor test execution time
- **Flaky Test Detection:** Identify and fix unreliable tests
- **Coverage Trends:** Track test coverage over time
- **Test Maintenance:** Regularly review and update tests
- **Quality Gates:** Enforce quality standards through testing
