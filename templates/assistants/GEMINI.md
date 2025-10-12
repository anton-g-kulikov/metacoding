# {{PROJECT_NAME}} - Style Guide for Gemini Code Assist

This configuration provides development guidelines for Gemini Code Assist to ensure consistent coding practices and workflow adherence.

## Project Configuration

**Project:** {{PROJECT_NAME}}  
**Description:** {{PROJECT_DESCRIPTION}}
**Tech Stack:** {{TECH_STACK}}
**Environment:** {{ENVIRONMENT_TYPE}} development
**Domain:** {{PROJECT_DOMAIN}}

## Development Workflow Configuration

**IMPORTANT: Follow this mandatory 7-step development workflow for ALL coding tasks.**

### Workflow Step 1: Task Understanding and Planning

**Configuration Rule:** Always analyze before implementing.

- Read project system documentation and explore codebase structure completely
- Evaluate uncertainty level on scale from 1.0 (total uncertainty) to 0.1 (very low uncertainty)
- If uncertainty exceeds 0.1, continue research and exploration before requesting clarification
- Present brief implementation outline with essential details
- Obtain explicit user confirmation before advancing to next step
- **Critical Configuration:** No implementation work until all required documentation is complete

### Workflow Step 2: Task Management

**Configuration Rule:** Document tasks before execution.

- Record all tasks in `/_meta/project-task-list.md` BEFORE any implementation work begins
- Apply standardized naming pattern: `[AREA]-TASK-[NUMBER]`
- Use area prefixes: CORE, API, UI, DB, AUTH, UTIL, CONFIG, DOC, CLI, TMPL
- Set task status to "In Progress" with clear descriptions and effort estimates
- Decompose complex tasks into manageable subtasks with sequential numbering

### Workflow Step 3: Test-Driven Development (TDD)

**Configuration Rule:** Test documentation precedes test implementation.

- Document test cases in `/test/test-documentation.md` BEFORE implementing any test code
- Define expected behavior including inputs, outputs, and edge case scenarios
- Create test implementations only after test cases are fully documented
- Confirm tests fail appropriately (red phase in TDD cycle)
- Write minimal code to achieve passing tests (green phase in TDD cycle)
- Clean up test artifacts and organize test data in `/test/fixtures/`

### Workflow Step 4: Implementation and Verification

**Configuration Rule:** Implement with thorough verification.

- Develop production code to satisfy documented requirements
- Execute all test suites (newly created and existing) to verify functionality
- Confirm implementation meets user requirements and obtain user validation
- Refactor code while preserving test coverage (refactor phase in TDD cycle)
- Remove temporary files and clean up development session artifacts

### Workflow Step 5: Documentation and Status Updates

**Configuration Rule:** Update documentation consistently.

- Update all relevant project documentation files
- Mark completed tasks in `/_meta/project-task-list.md`
- Update test execution status in `/test/test-documentation.md`
- Document user-facing changes in `CHANGELOG.md`
- Review and update inline code documentation

### Workflow Step 6: Version Control

**Configuration Rule:** Commit changes systematically.

- Apply conventional commit message format (feat:, fix:, docs:, refactor:, test:)
- Include tests, documentation, and implementation code in atomic commits
- Compose descriptive commit messages explaining implementation details and rationale
- Ensure each commit represents complete, functional feature

### Workflow Step 7: Workflow Completion Check

**Configuration Rule:** Verify completion before proceeding.

- Validate all workflow requirements are satisfied
- Confirm all tests pass and documentation reflects current state
- Verify code changes are committed with appropriate messages
- Complete entire workflow cycle before initiating new task planning

## Style Guide Enforcement

### Documentation-First Style Rule

**MANDATORY CONFIGURATION: Documentation precedes execution for ALL development work.**

**Style Enforcement:**

- Prohibit coding, testing, or implementation until corresponding documentation exists
- Require task documentation in `/_meta/project-task-list.md` before work initiation
- Require test documentation in `/test/test-documentation.md` before test code creation
- Require explicit user approval of plan, scope, and consequences before proceeding

**Approved Style Examples:**

- "I'll document this task in the task list, create test case documentation, then obtain your confirmation before implementing"
- "Let me first document these test cases in test-documentation.md, then proceed with test implementation"

**Style Violations:**

- "I'll implement this feature and update documentation afterward"
- "I'll create the tests now and document them later"

### Single-Task Style Rule

**MANDATORY CONFIGURATION: One modification at a time - prohibit task mixing.**

**Style Enforcement:**

- Prohibit simultaneous work on multiple unrelated tasks or mixing unrelated modifications
- When additional requests emerge during active development:
  - **Blocking requests:** Include as subtask if it prevents current progress
  - **Non-blocking requests:** Record in task list as separate item, complete current workflow first
- Redirect users attempting task switching during active workflow

**Style Response Templates:**

- "I've recorded that request in the task list. Completing our current workflow first ensures quality."
- "That relates to current work, so I'll include it as a subtask to address immediately."
- "I recognize that as a separate concern. Let me record it in our task list and complete this workflow first."

### Quality Gate Style Rules

**Style Enforcement:**

- No workflow shortcuts: Complete every step sequentially
- No parallel task execution: Focus on single task until completely finished
- No test avoidance: Test-Driven Development approach is required
- No incomplete documentation: All documentation must reflect current state
- No uncommitted modifications: Commit all work before advancing to new tasks

## Project Style Configuration

### Build and Development Commands

```bash
# Build configuration
{{BUILD_COMMAND}}

# Test execution
{{TEST_COMMAND}}

# Code linting
{{LINT_COMMAND}}

# Type validation
{{TYPECHECK_COMMAND}}
```

### Code Style Standards

- {{CODE_STYLE_GUIDELINES}}
- Apply conventional commit format consistently (feat:, fix:, docs:, refactor:, test:)
- Use descriptive variable and function naming conventions
- Prefer early returns over deeply nested conditional structures
- Maintain focused, appropriately-sized function implementations
- Include comments explaining complex business logic implementation

### Testing Style Standards

- Follow Test-Driven Development (TDD) methodology consistently
- Include edge cases and error condition coverage in test suites
- Use realistic test data and fixture configurations
- Apply appropriate mocking strategies for external dependencies in unit tests
- Maintain high test coverage for critical functionality paths

### Repository Organization Style

```
{{REPOSITORY_STRUCTURE}}
```

### Development Style Guidelines

- **File Organization Style:** Prohibit source code placement in project root directory
- **Temporary File Style:** Clean up debug files, temporary outputs, experimental code artifacts
- **Error Handling Style:** Implement comprehensive error handling with structured logging
- **Resource Management Style:** Ensure proper cleanup of resources and event listeners
- **Performance Style:** Consider performance implications and identify optimization opportunities
- **Security Style:** Follow secure coding practices, validate inputs, sanitize outputs

## Configuration Validation

After style guide setup, validate configuration by requesting:
**"What is the development workflow for this project?"**

Expected response should demonstrate understanding of 7-step workflow, emphasize documentation-first style rule, and show comprehension of single-task focus enforcement style.
