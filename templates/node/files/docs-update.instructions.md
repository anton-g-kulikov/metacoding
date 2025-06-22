---
description: 'Guidelines for maintaining project documentation'
applyTo: '**/*.md'
---

# Documentation Maintenance Guidelines

## Documentation Architecture Principles

This project enforces a strict distinction between different types of documentation to ensure clarity, maintainability, and appropriate use of status indicators.

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

- **Clarity:** Write clear, concise explanations
- **Completeness:** Ensure documentation covers all necessary aspects
- **Accuracy:** Verify all information is current and correct
- **Consistency:** Maintain consistent tone and formatting
- **Accessibility:** Use clear language and proper formatting for accessibility
- **Architecture Compliance:** Follow the system vs project documentation distinction

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
- **Examples of incorrect system documentation:**
  - ❌ Bad: "🚧 Authentication Features" (in README.md)
  - ❌ Bad: "Authentication system (planned)" (in architecture.md)
  - ❌ Bad: "📋 API Endpoints" (in api-design.md)

## Task Management Documentation Guidelines

- **Focus on current state:** Document what needs to be done, not what was recently done
- **Use project phases:** Organize by logical project phases or milestones, not completion status
- **Move completed work to changelog:** Record completed work in CHANGELOG.md, not in task lists
- **Keep task lists current:** Update completed items with current status instead of maintaining "completed" sections
- **Use descriptive section names:** Use functional names like "Core Features", "Infrastructure", "Testing" instead of "Completed Tasks"
- **Avoid temporal references:** Don't use "Recent", "Latest", "Upcoming" in section headers - they become outdated quickly

## README.md Standards (System Documentation)

**⚠️ README.md is system documentation - NO status indicators or temporal language allowed**

- **Project Overview:** Keep description current with latest capabilities using factual, present-tense language
- **Installation Instructions:** Verify and update installation steps with clear, current procedures
- **Usage Examples:** Ensure all code examples are tested and working, describe what they do
- **Feature Documentation:** Document all major features with examples using factual descriptions
- **Version Badges:** Keep version badges synchronized with package.json
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
- **Consistent Format:** Follow established changelog format
- **Categorization:** Group changes appropriately (Added, Changed, Fixed, etc.)
- **Breaking Changes:** Clearly mark breaking changes
- **Migration Guides:** Provide migration guidance for breaking changes

## Code Documentation

- **JSDoc Comments:** Update JSDoc comments when changing public APIs
- **Inline Comments:** Add comments for complex logic, not obvious code
- **Function Documentation:** Document parameters, return values, and side effects
- **Class Documentation:** Explain class purpose, responsibilities, and usage patterns
- **Type Documentation:** Document complex TypeScript types and interfaces

## API Documentation

- **Endpoint Documentation:** Keep API endpoint documentation current
- **Parameter Changes:** Update parameter descriptions for any modifications
- **Response Examples:** Provide realistic response examples
- **Error Handling:** Document error responses and status codes
- **Authentication:** Keep authentication documentation accurate

## Architectural Documentation (System Documentation)

**⚠️ Architecture docs are system documentation - NO status indicators or temporal language allowed**

- **Decision Records:** Record significant architectural decisions in `/meta` folder using factual language
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

- **Working Examples:** Ensure all code examples compile and run
- **Complete Examples:** Provide complete, runnable examples when possible
- **Progressive Complexity:** Start with simple examples, build to complex ones
- **Error Handling:** Show proper error handling in examples
- **Best Practices:** Demonstrate best practices in example code

## Test Documentation Standards

Follow the standardized table format for all test case documentation:

### Required Table Format

```markdown
| Test Case ID  | Description                                 | Type | Status    |
| :------------ | :------------------------------------------ | :--- | :-------- |
| AREA-TYPE-001 | Brief but descriptive test case description | Unit | Completed |
```

### Test Case ID Conventions

- **Format:** `[AREA]-[TYPE]-[NUMBER]`
- **Area Prefixes (Node.js/Backend):** API, SRV, DB, MW, AUTH, ROUTE, UTIL, CONFIG, DOC, E2E, INT
- **Type Suffixes:** UNIT, INT, E2E
- **Sequential Numbering:** 001, 002, 003, etc.

### Table Organization Requirements

- **Functional Grouping:** Group test cases by system area/component
- **Consistent Formatting:** Maintain proper column alignment using pipes
- **Clear Headers:** Use descriptive section headers (e.g., "Template System", "CLI Commands")
- **Status Tracking:** Use simple status values: "Completed", "In Progress", "Not Started"

### Documentation Testing

- **Link Checking:** Regularly verify all links work
- **Code Testing:** Test all code examples in documentation
- **Installation Testing:** Verify installation instructions work in clean environment
- **User Testing:** Occasionally have someone unfamiliar try following docs

## Maintenance Schedule

- **Regular Review:** Schedule regular documentation review cycles
- **Release Updates:** Update documentation as part of release process
- **Issue Tracking:** Track documentation issues and improvements
- **Community Feedback:** Incorporate user feedback on documentation clarity

## Localization Considerations

- **Clear English:** Use clear, simple English for international audiences
- **Cultural Sensitivity:** Avoid culture-specific references
- **Technical Terms:** Define technical terms when first introduced
- **Consistent Terminology:** Use consistent terminology throughout
