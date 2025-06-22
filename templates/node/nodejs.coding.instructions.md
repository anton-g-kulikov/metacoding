---
description: 'Node.js backend development coding standards and best practices'
applyTo: 'src/**/*.{ts,js}'
---

# Node.js Backend Development Guidelines

## Core Node.js Principles

- **Event Loop Awareness:** Understand the event loop and avoid blocking operations
- **Asynchronous Programming:** Use async/await for I/O operations, avoid callback hell
- **Module System:** Leverage ES modules with proper import/export patterns
- **Process Management:** Handle process signals and graceful shutdowns
- **Error Handling:** Implement comprehensive error handling with proper stack traces

## API Development Standards

### RESTful API Design

- **Resource-Based URLs:** Use nouns for endpoints (`/users`, `/orders`, not `/getUsers`)
- **HTTP Methods:** Use appropriate HTTP verbs (GET, POST, PUT, DELETE, PATCH)
- **Status Codes:** Return meaningful HTTP status codes (200, 201, 400, 401, 404, 500)
- **Consistent Response Format:** Standardize API response structure
- **Versioning:** Implement API versioning (`/api/v1/users`)

```typescript
// Good: RESTful endpoint structure
app.get('/api/v1/users/:id', async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(404).json({ error: 'User not found', success: false });
  }
});
```

### Middleware Architecture

- **Authentication Middleware:** Centralize auth logic in reusable middleware
- **Validation Middleware:** Validate request data before processing
- **Error Handling Middleware:** Implement global error handling
- **Logging Middleware:** Log requests, responses, and errors
- **Rate Limiting:** Protect APIs from abuse

```typescript
// Example middleware pattern
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // Verify token logic
  next();
};
```

## Database Integration

### Connection Management

- **Connection Pooling:** Use connection pools for database connections
- **Transaction Handling:** Implement proper transaction management
- **Migration Strategy:** Use database migrations for schema changes
- **Environment Configuration:** Separate configs for dev/staging/production

### ORM/Query Builder Best Practices

- **Model Relationships:** Define clear model relationships
- **Query Optimization:** Avoid N+1 queries, use eager loading appropriately
- **Data Validation:** Validate data at the model level
- **Soft Deletes:** Implement soft deletes for audit trails

```typescript
// Example with proper transaction handling
async function transferFunds(fromId: string, toId: string, amount: number) {
  const transaction = await db.transaction();
  try {
    await accountService.debit(fromId, amount, { transaction });
    await accountService.credit(toId, amount, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

## Security Best Practices

### Input Validation and Sanitization

- **Schema Validation:** Use libraries like Joi, Yup, or Zod for input validation
- **SQL Injection Prevention:** Use parameterized queries or ORM
- **XSS Prevention:** Sanitize user inputs and use Content Security Policy
- **CORS Configuration:** Configure CORS appropriately for your use case

### Authentication and Authorization

- **JWT Implementation:** Implement secure JWT token handling
- **Password Security:** Use bcrypt for password hashing
- **Rate Limiting:** Implement rate limiting for login attempts
- **Session Management:** Secure session handling and cleanup

```typescript
// Example secure password handling
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

## Performance Optimization

### Caching Strategies

- **Redis Integration:** Use Redis for session storage and caching
- **HTTP Caching:** Implement proper HTTP caching headers
- **Database Caching:** Cache frequently accessed database queries
- **CDN Integration:** Use CDNs for static assets

### Memory Management

- **Memory Leak Prevention:** Monitor and prevent memory leaks
- **Garbage Collection:** Understand V8 garbage collection
- **Stream Processing:** Use streams for large data processing
- **Worker Threads:** Utilize worker threads for CPU-intensive tasks

## Error Handling and Logging

### Comprehensive Error Handling

- **Global Error Handler:** Implement application-wide error handling
- **Custom Error Classes:** Create specific error types for different scenarios
- **Error Reporting:** Integrate with error tracking services (Sentry, etc.)
- **Graceful Degradation:** Handle service failures gracefully

```typescript
// Example custom error classes
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DatabaseError extends Error {
  constructor(
    message: string,
    public query?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### Structured Logging

- **Log Levels:** Use appropriate log levels (error, warn, info, debug)
- **Structured Format:** Use JSON logging for machine readability
- **Request Correlation:** Implement request ID correlation
- **Performance Logging:** Log response times and performance metrics

## Environment and Configuration

### Environment Management

- **Environment Variables:** Use .env files for configuration
- **Configuration Validation:** Validate configuration at startup
- **Secrets Management:** Secure handling of API keys and secrets
- **Multi-Environment Support:** Support dev/staging/production configs

### Deployment Considerations

- **Health Checks:** Implement health check endpoints
- **Graceful Shutdown:** Handle SIGTERM and SIGINT signals
- **Process Monitoring:** Use PM2 or similar for process management
- **Container Optimization:** Optimize Docker images for Node.js

```typescript
// Example graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await server.close();
  await database.disconnect();
  process.exit(0);
});
```

## Testing Strategies

### API Testing

- **Integration Tests:** Test complete request/response cycles
- **Contract Testing:** Verify API contracts and schemas
- **Load Testing:** Test performance under load
- **Security Testing:** Test for common vulnerabilities

### Mocking and Stubbing

- **Database Mocking:** Mock database calls in unit tests
- **External Service Mocking:** Mock third-party API calls
- **Time Mocking:** Mock dates and times for consistent testing
- **Environment Mocking:** Mock environment variables

## Package Management

### Dependency Management

- **Lock Files:** Always commit package-lock.json
- **Security Audits:** Regular npm audit and vulnerability checks
- **Version Pinning:** Pin critical dependencies to specific versions
- **Dev Dependencies:** Separate development and production dependencies

### Performance Dependencies

- **Bundle Analysis:** Analyze bundle size and dependencies
- **Tree Shaking:** Ensure unused code is eliminated
- **Critical Path:** Optimize critical path dependencies
- **Lazy Loading:** Implement lazy loading where appropriate

## Monitoring and Observability

### Application Monitoring

- **Metrics Collection:** Collect application and business metrics
- **Performance Monitoring:** Monitor response times and throughput
- **Error Tracking:** Track and alert on errors
- **Custom Dashboards:** Create dashboards for key metrics

### Debugging Tools

- **Node.js Debugger:** Use built-in debugging tools
- **Memory Profiling:** Profile memory usage and leaks
- **CPU Profiling:** Identify performance bottlenecks
- **Distributed Tracing:** Implement distributed tracing for microservices
