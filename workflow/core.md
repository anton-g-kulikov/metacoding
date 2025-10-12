# Canonical Development Workflow

This document contains the canonical 7-step development workflow that serves as the foundation for all AI coding assistant adapters in the metacoding system.

## Core Development Workflow

### Mandatory Development Process

**ALL development tasks must follow this strict workflow to ensure code quality, proper testing, and comprehensive documentation.**

**General Instruction:**

- The agent must always proceed through all workflow steps in order, without stopping or waiting for reminders, unless explicit user confirmation is required by the workflow. After completing each step, immediately continue to the next, ensuring the workflow is fully completed for every task.

### Step 1: Task Understanding and Planning

- **Always start with clarification:**
  - Begin by thoroughly reading the project system documentation, reviewing the project folders and files structure, and examining the most important code sections.
  - Measure your own uncertainty level regarding the user's initial query or answers on a scale from 1 (total uncertainty) to 0.1 (very low uncertainty).
  - If your uncertainty is greater than 0.1, continue reading documentation and exploring the project and codebase before asking clarifying questions.
  - If, after 5 clarification attempts, your uncertainty remains above 0.1, explicitly state this and propose a research plan before proceeding.
- **Provide implementation outline:** Present the shortest possible outline of the implementation plan with key details
- **Get explicit confirmation:** Wait for user confirmation before proceeding
- **Clarify scope:** Ensure both parties understand what will be implemented and what won't
- **Document first, execute second:** No implementation work begins until all required documentation is complete
- **Mandatory confirmation gates:** User must explicitly approve the plan, scope, and consequences before any work begins

**After completing Step 1:**

- Immediately proceed to Step 2 (Task Management) once user confirmation is received and documentation is complete.

### Step 2: Task Management

- **Document before executing:** Add corresponding task(s) to `/_meta/project-task-list.md` BEFORE any implementation work
- **Use standardized task naming:** Follow the `[AREA]-TASK-[NUMBER]` format for all tasks
  - **Area Prefixes:** Use appropriate prefixes (CORE, API, UI, DB, AUTH, UTIL, CONFIG, DOC, CLI, TMPL, etc.)
  - **Examples:** `CLI-TASK-001: Implement validate command`, `DOC-TASK-002: Update API documentation`
- **Set task status:** Mark tasks as "In Progress" with clear descriptions and status indicators
- **Break down complex tasks:** Split large tasks into smaller, manageable subtasks with sequential numbering
- **Estimate effort:** Provide realistic time/complexity estimates
- **Task documentation requirement:** Every task must be documented in the task list before work begins

**After completing Step 2:**

- Immediately proceed to Step 3 (Test-Driven Development) and ensure all test cases are documented before writing any test code.

### Step 3: Test-Driven Development (TDD)

- **Document test cases first:** Write test cases in `/test/test-documentation.md` BEFORE implementing any tests
- **Define expected behavior:** Clearly specify inputs, outputs, and edge cases in documentation
- **Only then implement tests:** Create actual test files after test cases are documented
- **Verify test failure:** Run tests to confirm they fail appropriately (red phase)
- **Then implement code:** Write the minimum code needed to make tests pass (green phase)
- **Clean up test artifacts:** Remove temporary test files, move useful test data to `/test/fixtures/`
- **Test documentation requirement:** All test cases must be documented before any test code is written

**After completing Step 3:**

- Immediately proceed to Step 4 (Implementation and Verification) and implement the required functionality.

### Step 4: Implementation and Verification

- **Write production code:** Implement the actual functionality
- **Run all tests:** Ensure all tests pass, including new and existing ones
- **Verify functionality:** Confirm the implementation meets requirements
- **Get user confirmation:** User must test the result and confirm it meets expectations
- **Refactor if needed:** Clean up code while maintaining test coverage (refactor phase)
- **File cleanup:** Remove all temporary files, debug outputs, and experimental code created during development

**After completing Step 4:**

- Immediately proceed to Step 5 (Documentation and Status Updates) and update all relevant documentation and status indicators.

### Step 5: Documentation and Status Updates

- **Update all documentation:** Follow documentation maintenance guidelines
- **Update task status:** Mark completed tasks in `/_meta/project-task-list.md`
- **Update test documentation:** Record test status in `/test/test-documentation.md`
- **Update CHANGELOG.md:** Document user-facing changes
- **Review code documentation:** Ensure code documentation is current

**After completing Step 5:**

- Immediately proceed to Step 6 (Version Control) and commit all changes with proper messages.

### Step 6: Version Control

- **Commit changes:** Use conventional commit messages
- **Include all related files:** Ensure tests, documentation, and code are committed together
- **Write descriptive commit messages:** Explain what was implemented and why
- **Keep commits atomic:** Each commit should represent a complete, working feature

**After completing Step 6:**

- Immediately proceed to Step 7 (Workflow Completion Check) and verify that all workflow requirements are satisfied.

### Step 7: Workflow Completion Check

- **Mandatory workflow completion:** User must complete the entire workflow before moving to next task
- **Incremental development:** Remind users to finish current workflow before starting new tasks
- **Repository hygiene:** Ensure codebase, documentation, and repository remain up-to-date
- **Quality gates:** All tests must pass, documentation must be current, and code must be committed

**After completing Step 7:**

- Confirm that the workflow is fully complete and only then allow planning or starting a new task. Never stop at an intermediate step unless user confirmation is explicitly required by the workflow.

## Workflow Enforcement Rules

### Documentation-First Principle

**MANDATORY: Document first, execute second for ALL development work.**

- **No Implementation Without Documentation:** Never begin any coding, testing, or implementation work until corresponding documentation is complete
- **Task Documentation Required:** Every task must be added to `/_meta/project-task-list.md` before work begins
- **Test Documentation Required:** All test cases must be documented in `/test/test-documentation.md` before writing any test code
- **Confirmation Gates:** User must explicitly confirm understanding of plan, scope, and consequences before proceeding

### Single-Task Focus Enforcement

**MANDATORY: One change at a time - never mix tasks in one iteration.**

- **No Task Mixing:** Never work on two different tasks simultaneously or mix unrelated changes in one iteration
- **Scope Creep Management:** When additional requests arise during active work, use proper scope management
- **Task-Switching Prevention:** Politely but firmly redirect users who try to switch tasks mid-workflow

### Quality Gates

- **No shortcuts:** Every step must be completed in order
- **No parallel tasks:** Focus on one task at a time until fully complete
- **No skipping tests:** TDD approach is mandatory
- **No incomplete documentation:** All documentation must be current
- **No uncommitted changes:** All work must be committed before moving on

## Repeated Tasks and Checklist Templates

For any recurring, high-risk, or multi-step process, always use a dedicated checklist template to ensure all necessary steps are followed and nothing is missed.

- **Checklist Template Principle:** Maintain template checklists for each repeated process
- **Examples:** npm package publishing, GitHub release process, major/minor version updates
- **Agent Guidance:** Check for checklist templates before starting repeated tasks

## Benefits of This Workflow

- **Higher code quality:** TDD ensures robust, well-tested code
- **Better documentation:** Always current and comprehensive
- **Reduced technical debt:** Incremental approach prevents accumulation of shortcuts
- **Improved maintainability:** Clear task tracking and documentation
- **Team collaboration:** Consistent approach enables better teamwork
- **Risk mitigation:** Small, tested changes reduce deployment risks
