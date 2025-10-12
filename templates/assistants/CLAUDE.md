# {{PROJECT_NAME}} - Development Guidelines for Claude Code

This file provides project instructions for Claude Code to ensure consistent development practices and workflow adherence.

## Project Overview

{{PROJECT_DESCRIPTION}}

**Project Goals:**

- Provide robust development workflow and best practices
- Ensure code quality and maintainability standards
- Enable efficient team collaboration and knowledge sharing

**Tech Stack:** {{TECH_STACK}}

## Development Environment

**Working in:** {{ENVIRONMENT_TYPE}} environment
**Project Type:** {{PROJECT_DOMAIN}} development

## Core Development Workflow

**CRITICAL: Follow this strict 7-step workflow for ALL development tasks.**

### Step 1: Task Understanding and Planning

- Begin by thoroughly reading project documentation and exploring the codebase
- Measure your uncertainty level (scale 1.0 to 0.1) before proceeding
- If uncertainty > 0.1, continue research before asking clarifying questions
- Present implementation outline and get explicit user confirmation
- **Documentation-first principle:** No implementation until documentation is complete

### Step 2: Task Management

- Add all tasks to `/_meta/project-task-list.md` BEFORE implementation
- Use standardized naming: `[AREA]-TASK-[NUMBER]` format
- Mark tasks "In Progress" with clear descriptions
- Break complex tasks into smaller, manageable subtasks

### Step 3: Test-Driven Development (TDD)

- Document test cases in `/test/test-documentation.md` FIRST
- Define expected behavior, inputs, outputs, and edge cases
- Implement tests after documentation is complete
- Verify test failure (red phase), then implement code (green phase)

### Step 4: Implementation and Verification

- Write production code to make tests pass
- Run all tests (new and existing)
- Get user confirmation that implementation meets requirements
- Refactor while maintaining test coverage

### Step 5: Documentation and Status Updates

- Update all relevant documentation
- Mark completed tasks in `/_meta/project-task-list.md`
- Update test documentation status
- Update `CHANGELOG.md` with user-facing changes

### Step 6: Version Control

- Commit changes with conventional commit messages
- Include tests, documentation, and code together
- Write descriptive commit messages explaining what and why
- Keep commits atomic (one complete feature per commit)

### Step 7: Workflow Completion Check

- Verify all workflow requirements are satisfied
- Ensure tests pass, documentation is current, code is committed
- Complete current workflow before starting new tasks

## Workflow Enforcement Rules

### Documentation-First Principle

**MANDATORY: Document first, execute second for ALL development work.**

- Never begin coding until corresponding documentation is complete
- Task documentation required in `/_meta/project-task-list.md`
- Test documentation required in `/test/test-documentation.md`
- User must explicitly approve plan, scope, and consequences

### Single-Task Focus

**MANDATORY: One change at a time - never mix tasks.**

- Never work on multiple unrelated tasks simultaneously
- When new requests arise:
  - **Blocking requests:** Add as subtask to current work
  - **Non-blocking requests:** Add to task list, complete current workflow first
- Politely redirect users who try to switch tasks mid-workflow

### Quality Gates

- Complete every step in order - no shortcuts
- Focus on one task at a time until fully complete
- TDD approach is mandatory - no skipping tests
- All documentation must be current
- No uncommitted changes - commit before moving on

## Project Commands

# Common Commands

- `npm run build`: {{BUILD_COMMAND}}
- `npm test`: {{TEST_COMMAND}}
- `npm run lint`: {{LINT_COMMAND}}
- `npm run typecheck`: {{TYPECHECK_COMMAND}}

# Development Workflow

- Always run tests after making changes
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Prefer running single tests during development for performance
- Run full test suite before committing

## Code Style Guidelines

- {{CODE_STYLE_GUIDELINES}}
- Follow language-specific conventions defined in instruction files
- Use meaningful variable and function names
- Keep functions focused and reasonably sized
- Prefer early returns over deep nesting
- Add comments for complex business logic

## Testing Instructions

- Write tests before implementing features (TDD)
- Cover edge cases and error conditions
- Use realistic test data and fixtures
- Mock external dependencies appropriately
- Maintain high test coverage for critical functionality

## Repository Structure

```
{{REPOSITORY_STRUCTURE}}
```

## Important Notes

- **Temporary files:** Always clean up debug files, temporary outputs, and experimental code
- **File organization:** Keep source code in appropriate directories, never in project root
- **Error handling:** Implement comprehensive error handling with proper logging
- **Performance:** Consider performance implications in all implementations
- **Security:** Follow secure coding practices, validate inputs, sanitize outputs

## Validation Reminder

After setup, test these instructions by asking:
**"What is the development workflow for this project?"**

The assistant should reference the 7-step workflow and demonstrate understanding of the documentation-first principle and single-task focus enforcement.
