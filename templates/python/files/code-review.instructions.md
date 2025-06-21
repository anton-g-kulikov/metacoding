---
description: 'Python backend code review checklist with Django/Flask/FastAPI focus'
applyTo: '**/*.py'
---

# Python Backend Code Review Focus Areas

## Python Language and Framework Assessment

### Code Quality and Pythonic Patterns

- **PEP 8 Compliance:** Does the code follow Python style guidelines?
- **Type Hints:** Are type hints used appropriately for function parameters and returns?
- **Docstrings:** Are docstrings present for classes, functions, and modules?
- **Python Idioms:** Does the code use Pythonic patterns (list comprehensions, context managers, etc.)?
- **Import Organization:** Are imports organized properly (standard library, third-party, local)?
- **Virtual Environment:** Is the project using virtual environments correctly?

### Django-Specific Review Points

- **Model Design:** Are models properly structured with appropriate fields and relationships?
- **Migration Safety:** Are database migrations safe and reversible?
- **View Logic:** Are views handling only HTTP logic, delegating business logic to services?
- **Template Security:** Are templates using proper escaping and CSRF protection?
- **Admin Configuration:** Is Django admin configured securely and efficiently?
- **Settings Management:** Are settings properly organized by environment?

### Flask/FastAPI-Specific Review Points

- **Application Factory:** Is the application using the factory pattern correctly?
- **Blueprint Organization:** Are blueprints used for modular code organization?
- **Request Handling:** Are request validation and serialization handled properly?
- **Error Handling:** Are custom error handlers implemented for different HTTP errors?
- **Configuration Management:** Is configuration handled securely across environments?
- **Extension Integration:** Are Flask extensions or FastAPI dependencies configured correctly?

## Security Review for Python Applications

### Authentication and Authorization

- **Password Security:** Are passwords hashed using secure algorithms (bcrypt, scrypt)?
- **Session Management:** Are sessions handled securely with proper timeouts?
- **JWT Implementation:** Are JWT tokens implemented with proper signing and validation?
- **Permission Classes:** Are Django permission classes or Flask decorators used correctly?
- **CSRF Protection:** Is CSRF protection enabled for state-changing operations?
- **CORS Configuration:** Are CORS settings configured appropriately for the application?

### Input Validation and Data Security

- **Form Validation:** Are Django forms or serializers validating all inputs?
- **SQL Injection Prevention:** Is the ORM used properly to prevent SQL injection?
- **XSS Prevention:** Are user inputs properly escaped in templates?
- **File Upload Security:** Are file uploads validated and stored securely?
- **Environment Variables:** Are secrets stored in environment variables, not code?
- **Database Security:** Are database connections and queries secure?

## Performance and Scalability Review

### Database Optimization

- **Query Efficiency:** Are database queries optimized (select_related, prefetch_related)?
- **N+1 Query Prevention:** Are N+1 queries identified and resolved?
- **Database Indexing:** Are appropriate database indexes defined?
- **Migration Performance:** Do migrations handle large datasets efficiently?
- **Connection Pooling:** Is database connection pooling configured properly?
- **Raw SQL Usage:** Is raw SQL avoided where ORM can be used safely?

### Caching and Performance

- **Caching Strategy:** Are appropriate caching mechanisms implemented (Redis, Memcached)?
- **View Caching:** Are expensive views cached appropriately?
- **Static Files:** Are static files served efficiently?
- **Async Implementation:** Are async views used where I/O operations are performed?
- **Background Tasks:** Are long-running operations moved to background tasks (Celery)?
- **Pagination:** Is pagination implemented for large datasets?

## Testing and Quality Assurance

### Test Coverage and Quality

- **Test Types:** Are unit, integration, and functional tests present?
- **Test Organization:** Are tests organized by functionality and easy to understand?
- **Factory Usage:** Are test factories (factory_boy) used for test data creation?
- **Mock Usage:** Are external dependencies properly mocked in tests?
- **Database Testing:** Are database operations tested with test databases?
- **API Testing:** Are API endpoints tested with proper assertions?

### Testing Frameworks and Tools

- **pytest Configuration:** Is pytest configured correctly with appropriate plugins?
- **Coverage Reporting:** Is test coverage measured and reported?
- **Test Fixtures:** Are test fixtures used appropriately for setup and teardown?
- **Parameterized Tests:** Are parameterized tests used for multiple test scenarios?
- **Integration Testing:** Are third-party integrations tested appropriately?
- **Performance Testing:** Are performance-critical paths tested for scalability?

## Error Handling and Logging

### Exception Handling

- **Specific Exceptions:** Are specific exception types caught rather than bare except clauses?
- **Error Response Format:** Are API error responses consistent and informative?
- **Graceful Degradation:** Does the application handle failures gracefully?
- **Custom Exceptions:** Are custom exception classes defined for domain-specific errors?
- **Error Recovery:** Are there appropriate recovery mechanisms for transient errors?
- **User-Friendly Messages:** Are error messages helpful for both developers and users?

### Logging and Monitoring

- **Logging Configuration:** Is logging configured appropriately for different environments?
- **Log Levels:** Are appropriate log levels used (DEBUG, INFO, WARNING, ERROR)?
- **Structured Logging:** Is structured logging used for easier parsing and analysis?
- **Sensitive Data:** Are sensitive data excluded from logs?
- **Performance Logging:** Are performance metrics logged for monitoring?
- **Error Tracking:** Is error tracking configured (Sentry, Rollbar)?

## Deployment and Environment Configuration

### Environment Management

- **Environment Variables:** Are all configuration values externalized to environment variables?
- **Settings Organization:** Are settings organized by environment (dev, staging, production)?
- **Secret Management:** Are secrets managed securely and not committed to version control?
- **Docker Configuration:** Are Docker configurations optimized for Python applications?
- **Dependency Management:** Are dependencies pinned to specific versions in requirements.txt?
- **Environment Isolation:** Are different environments properly isolated?

### Production Readiness

- **WSGI/ASGI Configuration:** Is the WSGI/ASGI server configured correctly for production?
- **Static File Serving:** Are static files configured for production serving?
- **Database Configuration:** Is the database configured for production workloads?
- **Monitoring Setup:** Are monitoring and alerting configured for production?
- **Backup Strategy:** Is a backup strategy implemented for data protection?
- **Health Checks:** Are health check endpoints implemented for load balancers?

## Temporary File Management and Cleanup

### Python Artifact cleanup

- **Bytecode Files:** Are `__pycache__` directories and `.pyc` files cleaned up?
- **Build Artifacts:** Are `build/`, `dist/`, and `*.egg-info/` directories managed?
- **Test Artifacts:** Are test coverage files and pytest cache cleaned up?
- **Log File Rotation:** Are application logs rotated and old logs cleaned up?
- **Media File cleanup:** Are temporary uploaded files cleaned up appropriately?
- **Virtual Environment cleanup:** Are old virtual environments removed when not needed?

### Cleanup Automation

- **Scheduled cleanup:** Are cleanup tasks scheduled appropriately?
- **Disk Space Monitoring:** Is disk space monitored to prevent storage issues?
- **Temporary File Management:** Are temporary files created and cleaned up properly?
- **Session cleanup:** Are expired sessions cleaned up from the database?
- **Cache Expiration:** Are cache entries expired and cleaned up appropriately?
- **Log Retention:** Are log retention policies implemented and enforced?

## Workflow and Process Review

### Development Workflow Compliance

- **7-Step Workflow:** Does the implementation follow the mandatory 7-step development workflow?
- **Test-Driven Development:** Were tests written before implementation (TDD approach)?
- **Documentation Updates:** Is all documentation current and accurate?
- **Task Management:** Are tasks properly tracked and status updated?
- **Code Review Process:** Has the code been properly reviewed before merging?
- **Version Control:** Are commits atomic and well-documented?

### Quality Gates and Standards

- **Coding Standards:** Does the code follow established Python and framework-specific standards?
- **Security Standards:** Are security best practices followed throughout?
- **Performance Standards:** Does the code meet performance requirements?
- **Testing Standards:** Is test coverage adequate and tests meaningful?
- **Documentation Standards:** Is documentation comprehensive and up-to-date?
- **Deployment Standards:** Is the code ready for production deployment?

## Framework-Specific Anti-Patterns

### Django Anti-Patterns to Flag

- **Fat Models:** Models with too much business logic
- **Fat Views:** Views handling business logic instead of delegating
- **Circular Imports:** Apps importing from each other inappropriately
- **Direct DB Access:** Bypassing Django ORM without good reason
- **Missing Migrations:** Schema changes without corresponding migrations
- **Hardcoded URLs:** Using hardcoded URLs instead of reverse() or url names

### Flask/FastAPI Anti-Patterns to Flag

- **Global State:** Using global variables for application state
- **No Application Factory:** Not using factory pattern for app creation
- **Missing Error Handling:** No custom error handlers for different scenarios
- **Blocking Operations:** Synchronous operations in async contexts
- **No Request Validation:** Missing input validation and serialization
- **Poor Configuration:** Configuration mixed with application code

## Review Process Guidelines

### Constructive Python-Specific Feedback

- **Framework Best Practices:** Suggest framework-specific improvements
- **Python Idioms:** Recommend more Pythonic approaches
- **Security Improvements:** Flag security vulnerabilities specific to Python/Django/Flask
- **Performance Optimizations:** Suggest Python-specific performance improvements
- **Testing Improvements:** Recommend better testing strategies for Python applications
- **Documentation:** Ensure Python docstring conventions are followed

### Review Checklist

- **Code Quality:** Pythonic, PEP 8 compliant, well-documented
- **Security:** Input validation, authentication, authorization, SQL injection prevention
- **Performance:** Database optimization, caching, async where appropriate
- **Testing:** Comprehensive test coverage with appropriate testing strategies
- **Deployment:** Production-ready configuration and environment management
- **cleanup:** Proper temporary file and resource management
