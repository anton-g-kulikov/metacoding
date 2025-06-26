---
description: 'Universal documentation maintenance guidelines for all project types'
applyTo: '**/*.md'
---

# Universal Documentation Maintenance Guidelines

## Documentation Architecture Principles

This project enforces a strict distinction between different types of documentation to ensure clarity, maintainability, and appropriate use of status indicators across all project types.

### System Documentation (Evergreen, Factual)

**Purpose:** Describes the current state of the system, architecture, and implemented features.
**Files:** README.md, architecture.md, api-design.md, system-documentation.md, code documentation
**Language:** Present tense, factual, descriptive
**Status Indicators:** ❌ **NEVER use status emojis or temporal language**
**Content Focus:** What exists now, how it works, what it does
**Examples:**

- ✅ Correct: "The authentication system uses JWT tokens"
- ❌ Incorrect: "🚧 Authentication system (in progress)"
- ✅ Correct: "The API supports the following endpoints:"
- ❌ Incorrect: "📋 Planned API endpoints:"

### Project Management Documentation (Temporal, Status-Oriented)

**Purpose:** Tracks work progress, planning, and execution status.
**Files:** project-task-list.md, sprint-planning.md, backlog.md
**Language:** Status-oriented, temporal references allowed
**Status Indicators:** ✅ **Required - use emojis and progress indicators**
**Content Focus:** What needs to be done, work progress, planning
**Examples:**

- ✅ Correct: "🚧 In Progress - Authentication system implementation"
- ✅ Correct: "✅ Completed - JWT token validation"
- ✅ Correct: "📋 Backlog - Add OAuth integration"

### User Documentation (Instructional, Current)

**Purpose:** Helps users understand how to use the system.
**Files:** Installation guides, usage examples, tutorials
**Language:** Imperative, instructional, present tense
**Status Indicators:** ⚠️ **Use sparingly** - only for actual user-facing feature status
**Content Focus:** How to use, what users can do, step-by-step guidance

### Enforcement Rules

1. **No Status Emojis in System Documentation:** Architecture, API docs, and README feature descriptions must be purely factual
2. **No Temporal Language in System Documentation:** Avoid "currently", "recently", "planned", "upcoming" in system docs
3. **Status Indicators Required in Project Management:** All task lists and project planning docs must use clear status indicators
4. **Regular Documentation Audits:** Review and remove status language that has crept into system documentation
5. **Template Compliance:** All generated documentation must follow these principles

## Documentation Quality Standards

- **Clarity:** Write clear, concise explanations appropriate for the target audience
- **Completeness:** Ensure documentation covers all necessary aspects of the project
- **Accuracy:** Verify all information is current and correct
- **Consistency:** Maintain consistent tone and formatting across all documentation
- **Accessibility:** Use clear language and proper formatting for accessibility
- **Architecture Compliance:** Follow the system vs project documentation distinction

## Repeated Documentation Tasks and Checklist Templates

For any recurring documentation process (such as release documentation, API documentation updates, documentation reviews, or similar workflows), always use a dedicated checklist template to ensure all necessary steps are followed and nothing is missed.

- **Documentation Checklist Template Principle:**
  - Maintain a template checklist file for each repeated documentation process (e.g., `release-documentation-checklist.md`, `api-docs-update-checklist.md`).
  - For each new instance (e.g., each release or major update), copy the template checklist and tag it with the relevant version or context, preserving the original template for future use.
  - Systematically work through the checklist for every instance of the repeated documentation task, marking each step as completed.
  - Proactively identify any documentation process that would benefit from a checklist and prompt the user to use or create one if it does not exist.
  - If, during execution, you or the user identify missing or unclear documentation steps, update the template checklist to improve future reliability.

**Examples of repeated documentation tasks requiring checklists:**

- Release documentation (README updates, CHANGELOG maintenance, version synchronization)
- API documentation updates (endpoint changes, parameter updates, example verification)
- Documentation reviews and audits (link checking, content verification, accessibility checks)
- Migration documentation (breaking changes, upgrade guides, compatibility notes)
- Onboarding documentation updates
- Any other documentation process with multiple required steps or risk of omission

**Agent Guidance for Documentation Tasks:**

- Always check for the existence of a documentation checklist template before starting a repeated documentation task.
- If a template does not exist, prompt the user to create one and assist in drafting it.
- When using a documentation checklist, copy it for the specific instance (e.g., `release-docs-v1.5.0.md`), and work through each step systematically.
- If new documentation steps are discovered or improvements are needed, update the template and inform the user.

## Status Indication Guidelines (For Project Management Documentation Only)

**⚠️ IMPORTANT: These guidelines apply ONLY to project management documentation (task lists, planning docs). System documentation (README, architecture, API docs) must NEVER use status indicators.**

- **Use checkboxes for task status:** `- [ ]` for incomplete, `- [x]` for complete
- **Use clear status indicators in project management docs:**
  - ✅ Complete/Implemented
  - 🚧 In Progress
  - ❌ Not Started
  - ⚠️ Needs Review
  - 🔄 Under Revision
- **Examples of correct project management documentation:**
  - ✅ Good: "🚧 In Progress - User authentication implementation"
  - ✅ Good: "Development Status" with current checkboxes
  - ✅ Good: "✅ Completed - API endpoint testing"

## Task Management Documentation Guidelines

- **Focus on current state:** Document what needs to be done, not what was recently done
- **Use project phases:** Organize by logical project phases or milestones, not completion status
- **Move completed work to changelog:** Record completed work in CHANGELOG.md, not in task lists
- **Keep task lists current:** Update completed items with current status instead of maintaining "completed" sections
- **Use descriptive section names:** Use functional names like "Core Features", "Infrastructure", "Testing" instead of "Completed Tasks"
- **Avoid temporal references:** Don't use "Recent", "Latest", "Upcoming" in section headers - they become outdated quickly

### Task ID Naming Convention

Follow the standardized task naming format for all project management documentation:

#### Required Task Format

```markdown
- [ ] **[AREA]-TASK-001: Task title** - ❌ **NOT STARTED**
  - Detailed task description and requirements
  - Implementation steps and acceptance criteria
```

#### Task ID Conventions

- **Format:** `[AREA]-TASK-[NUMBER]`
- **Area Prefixes:** Adapt to your project (CORE, API, UI, DB, AUTH, UTIL, CONFIG, DOC, CLI, TMPL, etc.)
- **Task Type:** Always use "TASK" for consistency
- **Sequential Numbering:** 001, 002, 003, etc. within each area
- **Examples:**
  - `CLI-TASK-001: Implement validate command`
  - `API-TASK-002: Add authentication middleware`
  - `DOC-TASK-003: Update README installation guide`
  - `TMPL-TASK-004: Create Python project template`

#### Task Organization Requirements

- **Functional Grouping:** Group tasks by system area/component
- **Clear Descriptions:** Provide specific, actionable task descriptions
- **Status Tracking:** Use standard status indicators (❌ NOT STARTED, 🚧 IN PROGRESS, ✅ COMPLETED)
- **Acceptance Criteria:** Include clear completion criteria in task details
- **Dependencies:** Note task dependencies and prerequisites when relevant

## README.md Standards (System Documentation)

**⚠️ README.md is system documentation - NO status indicators or temporal language allowed**

- **Project Overview:** Keep description current with latest capabilities using factual, present-tense language
- **Installation Instructions:** Verify and update installation steps with clear, current procedures
- **Usage Examples:** Ensure all code examples are tested and working, describe what they do
- **Feature Documentation:** Document all major features with examples using factual descriptions
- **Version Badges:** Keep version badges synchronized with package.json (or equivalent for other languages)
- **Links Verification:** Regularly check that all links work correctly
- **Screenshots/GIFs:** Update visual documentation when UI changes
- **Avoid Status Language:** Never use "planned", "upcoming", "in progress", or status emojis
- **Examples:**
  - ✅ Correct: "The CLI provides three commands for project setup"
  - ❌ Incorrect: "🚧 CLI commands (in development)"
  - ✅ Correct: "Authentication uses JWT tokens with refresh capability"
  - ❌ Incorrect: "Authentication system (planned for v2.0)"

## CHANGELOG.md Maintenance

- **User-Facing Changes:** Document all changes that affect users
- **Consistent Format:** Follow established changelog format (Keep a Changelog standard)
- **Categorization:** Group changes appropriately (Added, Changed, Fixed, Security, etc.)
- **Breaking Changes:** Clearly mark breaking changes
- **Migration Guides:** Provide migration guidance for breaking changes
- **Version Dating:** Include release dates in consistent format (YYYY-MM-DD)

## Code Documentation Standards

Refer to language-specific coding instruction files for detailed code documentation standards:

- **TypeScript/Node.js:** See `typescript.coding.instructions.md` for JSDoc standards
- **Python:** See `python.coding.instructions.md` for docstring standards
- **React/Frontend:** See `react.coding.instructions.md` for component documentation

### Universal Code Documentation Principles

- **Public APIs:** Always document public interfaces with appropriate documentation format
- **Complex Logic:** Add comments for complex algorithms or business logic
- **Function Documentation:** Document parameters, return values, and side effects
- **Error Conditions:** Document when and why functions might fail
- **Usage Examples:** Provide examples for non-trivial usage patterns

## API Documentation

- **Endpoint Documentation:** Keep API endpoint documentation current with implementation
- **Parameter Changes:** Update parameter descriptions for any modifications
- **Response Examples:** Provide realistic response examples
- **Error Handling:** Document error responses and status codes
- **Authentication:** Keep authentication documentation accurate
- **Versioning:** Document API versioning strategy and compatibility

## Architectural Documentation (System Documentation)

**⚠️ Architecture docs are system documentation - NO status indicators or temporal language allowed**

- **Decision Records:** Record significant architectural decisions in `/_meta` folder using factual language
- **System Overview:** Maintain high-level system architecture documentation describing current implementation
- **Data Flow:** Document data flow and process workflows as they currently exist
- **Integration Points:** Document external system integrations that are implemented
- **Performance Considerations:** Document performance implications of current design decisions
- **Examples:**
  - ✅ Correct: "The system uses a microservices architecture with three main services"
  - ❌ Incorrect: "🏗️ Microservices architecture (under development)"
  - ✅ Correct: "Data flows through the validation layer before storage"
  - ❌ Incorrect: "Data validation layer (planned implementation)"

## Code Examples and Tutorials

- **Working Examples:** Ensure all code examples compile and run in the target language
- **Complete Examples:** Provide complete, runnable examples when possible
- **Progressive Complexity:** Start with simple examples, build to complex ones
- **Error Handling:** Show proper error handling patterns for the language
- **Best Practices:** Demonstrate best practices in example code
- **Language Appropriateness:** Use idiomatic patterns for each language

## Test Documentation Standards

Follow the standardized table format for all test case documentation across all project types:

### Required Table Format

```markdown
| Test Case ID  | Description                                 | Type | Status    |
| :------------ | :------------------------------------------ | :--- | :-------- |
| AREA-TYPE-001 | Brief but descriptive test case description | Unit | Completed |
```

### Test Case ID Conventions

- **Format:** `[AREA]-[TYPE]-[NUMBER]`
- **Area Prefixes:** Adapt to your project (CORE, API, UI, DB, AUTH, UTIL, CONFIG, DOC, etc.)
- **Type Suffixes:** UNIT, INT, E2E
- **Sequential Numbering:** 001, 002, 003, etc.

### Table Organization Requirements

- **Functional Grouping:** Group test cases by system area/component
- **Consistent Formatting:** Maintain proper column alignment using pipes
- **Clear Headers:** Use descriptive section headers for test groups
- **Status Tracking:** Use simple status values: "Completed", "In Progress", "Not Started"
- **Descriptive Test Cases:** Provide clear, concise descriptions for each test case
- **Text only** Don't use emojis or bold text in the table - keep it simple and readable

## Documentation Testing

- **Link Checking:** Regularly verify all links work across all documentation
- **Code Testing:** Test all code examples in documentation using appropriate tools
- **Installation Testing:** Verify installation instructions work in clean environment
- **User Testing:** Occasionally have someone unfamiliar try following documentation
- **Cross-Platform Testing:** Verify instructions work across supported platforms

## Maintenance Schedule

- **Regular Review:** Schedule regular documentation review cycles
- **Release Updates:** Update documentation as part of release process
- **Issue Tracking:** Track documentation issues and improvements
- **Community Feedback:** Incorporate user feedback on documentation clarity
- **Automated Checks:** Use automated tools to check for broken links and outdated content

## Localization and Accessibility

- **Clear Language:** Use clear, simple language for international audiences
- **Cultural Sensitivity:** Avoid culture-specific references
- **Technical Terms:** Define technical terms when first introduced
- **Consistent Terminology:** Use consistent terminology throughout all documentation
- **Screen Reader Compatibility:** Ensure proper heading hierarchy and alt text
- **High Contrast:** Use sufficient color contrast for accessibility
