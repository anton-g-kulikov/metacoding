---
description: 'Node.js backend documentation standards and API documentation guidelines'
applyTo: '**/*.md'
---

# Node.js Backend Documentation Guidelines

## API Documentation Standards

### OpenAPI/Swagger Documentation

- **Schema Definition:** Define complete API schemas using OpenAPI 3.0+
- **Interactive Documentation:** Provide interactive API documentation
- **Code Examples:** Include request/response examples in multiple languages
- **Authentication Documentation:** Document all authentication methods
- **Error Response Documentation:** Document all possible error responses

```yaml
# Example OpenAPI schema
paths:
  /api/v1/users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
```

### Endpoint Documentation

- **Purpose Description:** Clearly describe what each endpoint does
- **Request Parameters:** Document all query parameters, path parameters, and request body
- **Response Format:** Document response structure and data types
- **Status Codes:** List all possible HTTP status codes and their meanings
- **Rate Limiting:** Document rate limiting rules and headers

### Authentication Documentation

- **Token Format:** Document JWT structure and claims
- **Authorization Flow:** Describe OAuth or other auth flows
- **Scope Documentation:** Document API scopes and permissions
- **Token Refresh:** Document token refresh procedures
- **Security Headers:** Document required security headers

## Database Documentation

### Schema Documentation

- **Entity Relationship Diagrams:** Visual representation of database schema
- **Table Descriptions:** Purpose and usage of each table
- **Column Documentation:** Data types, constraints, and relationships
- **Index Documentation:** Performance-critical indexes
- **Migration History:** Document major schema changes

### Data Flow Documentation

- **CRUD Operations:** Document create, read, update, delete patterns
- **Transaction Boundaries:** Document transaction scopes
- **Data Validation Rules:** Business rules and constraints
- **Audit Trail:** Document audit and logging mechanisms
- **Backup and Recovery:** Document backup strategies

## Environment and Deployment Documentation

### Configuration Documentation

- **Environment Variables:** Complete list with descriptions and examples
- **Configuration Files:** Document all configuration files and their purpose
- **Secrets Management:** Document how secrets are handled
- **Feature Flags:** Document feature flag configurations
- **Third-Party Services:** Document external service dependencies

```markdown
## Environment Variables

| Variable     | Description                | Example                             | Required |
| ------------ | -------------------------- | ----------------------------------- | -------- |
| DATABASE_URL | Database connection string | postgresql://user:pass@localhost/db | Yes      |
| JWT_SECRET   | Secret key for JWT tokens  | your-secret-key                     | Yes      |
| REDIS_URL    | Redis connection string    | redis://localhost:6379              | No       |
```

### Deployment Documentation

- **Build Process:** Document build and compilation steps
- **Docker Configuration:** Document container setup and requirements
- **Health Checks:** Document health check endpoints and criteria
- **Scaling Considerations:** Document horizontal and vertical scaling
- **Monitoring Setup:** Document monitoring and alerting configuration

## Error Handling Documentation

### Error Response Format

- **Consistent Structure:** Standardize error response format
- **Error Codes:** Document custom error codes and meanings
- **Localization:** Document multi-language error message support
- **Debug Information:** Document debug info inclusion in development
- **Error Recovery:** Document error recovery strategies

```typescript
// Example error response format
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}
```

### Troubleshooting Guides

- **Common Issues:** Document frequently encountered problems
- **Debug Steps:** Step-by-step debugging procedures
- **Log Analysis:** How to interpret logs and error messages
- **Performance Issues:** Common performance problems and solutions
- **Service Dependencies:** Troubleshooting external service issues

## Performance Documentation

### Performance Benchmarks

- **Response Time Targets:** Document expected response times
- **Throughput Metrics:** Document expected requests per second
- **Resource Usage:** Document memory and CPU usage patterns
- **Database Performance:** Document query performance expectations
- **Caching Strategies:** Document caching implementations and TTLs

### Optimization Guidelines

- **Profiling Tools:** Document profiling and monitoring tools
- **Bottleneck Identification:** Common performance bottlenecks
- **Optimization Techniques:** Proven optimization strategies
- **Load Testing:** Document load testing procedures
- **Capacity Planning:** Guidelines for scaling decisions

## Security Documentation

### Security Architecture

- **Threat Model:** Document potential security threats
- **Security Controls:** Document implemented security measures
- **Vulnerability Management:** Document security update procedures
- **Penetration Testing:** Document security testing procedures
- **Compliance Requirements:** Document regulatory compliance needs

### Security Configuration

- **HTTPS Configuration:** SSL/TLS setup and best practices
- **CORS Configuration:** Cross-origin resource sharing setup
- **Security Headers:** Required security headers and their purposes
- **Input Validation:** Document validation rules and sanitization
- **Rate Limiting:** Document rate limiting implementation

## Development Workflow Documentation

### Code Organization

- **Project Structure:** Document folder and file organization
- **Module Dependencies:** Document internal module relationships
- **Design Patterns:** Document architectural patterns used
- **Code Style:** Document coding standards and conventions
- **Git Workflow:** Document branching and commit strategies

### Development Setup

- **Prerequisites:** Required tools and versions
- **Installation Steps:** Step-by-step setup instructions
- **Database Setup:** Local database configuration
- **Environment Setup:** Development environment configuration
- **IDE Configuration:** Recommended IDE settings and extensions

### Testing Documentation

- **Test Structure:** Document test organization and naming
- **Test Data:** Document test fixtures and data setup
- **Mocking Strategies:** Document mocking patterns
- **Coverage Requirements:** Document test coverage targets
- **CI/CD Integration:** Document automated testing in pipelines

## Monitoring and Observability Documentation

### Metrics Documentation

- **Business Metrics:** Key business indicators to track
- **Technical Metrics:** System performance metrics
- **Custom Metrics:** Application-specific metrics
- **Alert Thresholds:** When to alert on metric values
- **Dashboard Configuration:** Key dashboards and their purposes

### Logging Documentation

- **Log Levels:** When to use each log level
- **Log Format:** Structured logging format and fields
- **Log Correlation:** Request tracking and correlation
- **Log Retention:** Log storage and retention policies
- **Log Analysis:** Common log analysis patterns

## Runbook Documentation

### Operational Procedures

- **Deployment Procedures:** Step-by-step deployment process
- **Rollback Procedures:** How to rollback failed deployments
- **Backup Procedures:** Database and file backup processes
- **Disaster Recovery:** Recovery procedures for major incidents
- **Maintenance Windows:** Planned maintenance procedures

### Incident Response

- **On-Call Procedures:** Who to contact during incidents
- **Escalation Matrix:** When and how to escalate issues
- **Communication Templates:** Incident communication templates
- **Post-Incident Reviews:** How to conduct post-mortems
- **Knowledge Base:** Common issues and their solutions
