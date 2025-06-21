---
description: "Node.js backend code review checklist with API and security focus"
applyTo: "**"
---

# Node.js Backend Code Review Focus Areas

## Workflow and Process Review

### Development Workflow Compliance
- **7-Step Workflow:** Is the mandatory development workflow being followed?
- **Test-Driven Development:** Are tests written before implementation?
- **Documentation Updates:** Are all documentation changes included?
- **Task Management:** Are tasks properly tracked and updated?
- **Quality Gates:** Are all quality checks passing before moving to next step?

### Code Review Process
- **Workflow Enforcement:** Ensure the team follows the mandatory 7-step development process
- **Step Completion:** Verify each workflow step is completed before proceeding
- **Documentation Currency:** Confirm all documentation is up to date
- **Test Coverage:** Validate comprehensive test coverage exists
- **Commit Quality:** Check that commits follow conventional format and include all related files

## Functionality Assessment
- **Requirements Compliance:** Does the code meet the specified requirements?
- **API Design:** Are endpoints well-designed and follow RESTful principles?
- **Business Logic:** Is the business logic correctly implemented and separated from HTTP concerns?
- **Edge Cases:** Are edge cases properly handled, especially for API inputs?
- **Error Scenarios:** How does the code behave with invalid inputs and network failures?
- **Integration Points:** Do integrations with databases and external services work correctly?

## Node.js-Specific Code Quality

### Architecture and Organization
- **Layer Separation:** Are controllers, services, and repositories properly separated?
- **Middleware Usage:** Are middleware functions used appropriately for cross-cutting concerns?
- **Route Organization:** Are routes well-organized and grouped logically?
- **Dependency Injection:** Are dependencies properly injected and testable?
- **Module Structure:** Are modules well-structured with clear exports and imports?

### Async Programming
- **Async/Await Usage:** Are async operations using async/await instead of callbacks?
- **Promise Handling:** Are promises properly handled with appropriate error catching?
- **Event Loop:** Does the code avoid blocking the event loop with synchronous operations?
- **Parallel Operations:** Are independent async operations run in parallel when possible?

### Error Handling
- **Centralized Error Handling:** Is there a centralized error handling middleware?
- **HTTP Status Codes:** Are appropriate HTTP status codes used for different error types?
- **Error Messages:** Are error messages informative but not exposing sensitive information?
- **Async Error Handling:** Are async operations properly wrapped in try-catch blocks?

## API Development Review

### Endpoint Design
- **RESTful Design:** Do endpoints follow REST principles?
- **HTTP Methods:** Are appropriate HTTP methods used (GET, POST, PUT, DELETE)?
- **URL Structure:** Are URLs well-structured and consistent?
- **Request/Response Format:** Are request and response formats consistent and well-documented?
- **API Versioning:** Is API versioning strategy implemented correctly?

### Request Handling
- **Input Validation:** Are all inputs validated before processing?
- **Parameter Parsing:** Are query parameters and request bodies parsed correctly?
- **Content-Type Handling:** Are different content types handled appropriately?
- **File Uploads:** Are file uploads handled securely with proper validation?

### Response Management
- **Response Formatting:** Are responses consistently formatted?
- **Status Codes:** Are HTTP status codes used correctly?
- **Headers:** Are appropriate headers set for caching, security, etc.?
- **Pagination:** Is pagination implemented for list endpoints?

## Security Review

### Authentication and Authorization
- **Authentication Implementation:** Is authentication properly implemented and secure?
- **Token Management:** Are JWTs or other tokens handled securely?
- **Session Management:** Is session management secure if used?
- **Role-Based Access:** Is role-based access control properly implemented?
- **Permission Checks:** Are permission checks in place for all protected endpoints?
- **Authorization Logic:** Are authorization checks appropriate and comprehensive?

### Input Security
- **Input Validation:** Are all inputs properly validated and sanitized?
- **SQL Injection:** Are database queries protected against injection attacks?
- **XSS Protection:** Are outputs properly escaped to prevent XSS?
- **CSRF Protection:** Is CSRF protection implemented where needed?
- **Rate Limiting:** Is rate limiting implemented to prevent abuse?

### Data Protection
- **Sensitive Data:** Is sensitive data properly encrypted or hashed?
- **Environment Variables:** Are secrets stored in environment variables?
- **Data Exposure:** Is sensitive data accidentally exposed in logs or responses?
- **CORS Configuration:** Is CORS properly configured for the application needs?

## Database and Performance Review

### Database Operations
- **Query Optimization:** Are database queries optimized with appropriate indexes?
- **N+1 Problem:** Are N+1 query problems avoided?
- **Connection Management:** Are database connections properly managed and closed?
- **Transaction Usage:** Are database transactions used appropriately?
- **Migration Scripts:** Are database migrations safe and reversible?

### Performance Considerations
- **Caching Strategy:** Is caching implemented where appropriate?
- **Memory Usage:** Are there potential memory leaks or excessive memory usage?
- **CPU-Intensive Operations:** Are CPU-intensive operations offloaded appropriately?
- **Response Times:** Are response times reasonable for API endpoints?
- **Resource Cleanup:** Are resources (connections, file handles) properly cleaned up?

## Testing and Testability

### Test Coverage
- **Unit Tests:** Are there sufficient unit tests for services and utilities?
- **Integration Tests:** Are API endpoints covered by integration tests?
- **Test Quality:** Do tests cover both happy paths and error scenarios?
- **Mock Usage:** Are external dependencies properly mocked in tests?
- **Test Data:** Are test fixtures and factories used appropriately?

### Testability
- **Dependency Injection:** Is code structured to allow easy dependency injection for testing?
- **Pure Functions:** Are business logic functions pure and easily testable?
- **Isolation:** Can components be tested in isolation?
- **Test Environment:** Are tests isolated from each other and external dependencies?

## Temporary File Management and Cleanup

### File and Resource Management
- **File Upload Cleanup:** Are temporary uploaded files cleaned up after processing?
- **Log File Rotation:** Are log files rotated and old logs cleaned up?
- **Cache Cleanup:** Are cached files and data cleaned up when no longer needed?
- **Process Resources:** Are process resources (PID files, sockets) cleaned up on shutdown?
- **Database Connections:** Are database connections properly closed?
- **Resource cleanup:** Ensure all resources are properly cleaned and disposed

### Build and Development Artifacts
- **Build Directory Cleanup:** Are build artifacts (`dist/`, `build/`) excluded from version control?
- **Test Artifacts:** Are test coverage reports and temporary test files cleaned up?
- **Node Modules:** Is `node_modules/` properly excluded from version control?
- **Environment Files:** Are `.env` files with secrets excluded from version control?

### Memory and Resource Leaks
- **Event Listener Cleanup:** Are event listeners properly removed to prevent memory leaks?
- **Timer Cleanup:** Are intervals and timeouts properly cleared?
- **Stream Cleanup:** Are file and network streams properly closed?
- **Worker Process Cleanup:** Are worker processes and child processes properly terminated?

## Configuration and Deployment

### Environment Management
- **Configuration:** Is configuration properly externalized using environment variables?
- **Secret Management:** Are secrets managed securely and not committed to version control?
- **Environment Separation:** Are different environments (dev, staging, prod) properly configured?
- **Default Values:** Are sensible default values provided for configuration?

### Deployment Readiness
- **Health Checks:** Are health check endpoints implemented?
- **Graceful Shutdown:** Does the application handle shutdown signals gracefully?
- **Process Management:** Is the application ready for process managers (PM2, Docker)?
- **Monitoring:** Are appropriate metrics and logging in place?

## Common Node.js Anti-Patterns to Flag

### Performance Anti-Patterns
- **Blocking Operations:** Synchronous file I/O or CPU-intensive operations on main thread
- **Callback Hell:** Nested callbacks instead of async/await
- **Memory Leaks:** Unclosed connections, retained references, growing event listeners
- **Inefficient Algorithms:** O(n²) operations on large datasets

### Security Anti-Patterns
- **Eval Usage:** Using `eval()` or similar dynamic code execution
- **Prototype Pollution:** Unsafe object property assignment
- **Path Traversal:** Unsanitized file paths allowing directory traversal
- **Regex DoS:** Vulnerable regular expressions that can cause DoS

### Architecture Anti-Patterns
- **God Controllers:** Controllers handling too many responsibilities
- **Direct Database Access:** Controllers directly accessing database instead of using services
- **Circular Dependencies:** Modules that depend on each other circularly
- **Global State:** Relying on global variables for application state

## Review Process Guidelines

### Constructive Feedback
- **Security First:** Prioritize security issues over other concerns
- **Performance Impact:** Consider the performance implications of changes
- **Scalability:** Think about how the code will perform under load
- **Maintainability:** Ensure code is readable and maintainable
- **API Consistency:** Maintain consistency across API endpoints

### Backend-Specific Considerations
- **Database Impact:** Consider the impact of changes on database performance
- **API Breaking Changes:** Flag any breaking changes to API contracts
- **Dependency Updates:** Review new dependencies for security and compatibility
- **Error Handling:** Ensure comprehensive error handling throughout the stack
- **Monitoring:** Ensure adequate logging and monitoring capabilities

## Automated Checks to Verify

### Code Quality
- **ESLint:** Code passes linting rules with no errors
- **TypeScript:** TypeScript compilation succeeds without errors
- **Prettier:** Code follows formatting standards
- **Tests:** All tests pass including unit, integration, and API tests

### Security Scans
- **Dependency Vulnerabilities:** No known vulnerabilities in dependencies
- **Static Analysis:** Security static analysis passes (Snyk, etc.)
- **Secret Detection:** No secrets or credentials in code

### Performance Checks
- **Build Performance:** Build completes in reasonable time
- **Bundle Size:** Bundle size is within acceptable limits
- **Memory Usage:** No obvious memory leaks in test runs
- **Load Testing:** API endpoints perform well under expected load

### Documentation
- **API Documentation:** OpenAPI/Swagger documentation is up to date
- **README:** Installation and setup instructions are current
- **Changelog:** User-facing changes are documented
