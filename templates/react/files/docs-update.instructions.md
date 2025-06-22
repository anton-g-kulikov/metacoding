---
description: 'Guidelines for maintaining project documentation'
applyTo: '**/*.md'
---

# Documentation Maintenance Guidelines

## Documentation Quality Standards

- **Clarity:** Write clear, concise explanations
- **Completeness:** Ensure documentation covers all necessary aspects
- **Accuracy:** Verify all information is current and correct
- **Consistency:** Maintain consistent tone and formatting
- **Accessibility:** Use clear language and proper formatting for accessibility
- **Status Transparency:** Use checkboxes and clear status indicators instead of planning-based language

## Status Indication Guidelines

- **Never use "planned" or "to-do" in titles or headers:** These create outdated documentation
- **Never use time-based status sections:** Avoid "Recently Completed", "Latest Updates", "Recent Changes" sections that become stale
- **Never use completion-based headers:** Avoid "Completed Tasks", "Finished Items", "Done" sections - use current status instead
- **Use checkboxes for task status:** `- [ ]` for incomplete, `- [x]` for complete
- **Use clear status indicators:**
  - ✅ Complete/Implemented
  - 🚧 In Progress
  - ❌ Not Started
  - ⚠️ Needs Review
  - 🔄 Under Revision
- **Reflect current state in headers:** Use present tense and current status
- **Examples of good vs bad headers:**
  - ❌ Bad: "Recently Completed Tasks"
  - ❌ Bad: "Latest Updates"
  - ❌ Bad: "Finished Features"
  - ✅ Good: "Development Status" with current checkboxes
  - ❌ Bad: "Planned Authentication Features"
  - ✅ Good: "Authentication Features" with status checkboxes
  - ❌ Bad: "TODO: API Documentation"
  - ✅ Good: "API Documentation Status" with clear indicators
- **Keep status current:** Update status indicators as work progresses
- **Use consistent status symbols:** Maintain the same symbols across all documentation
- **Update completed items:** Move completed tasks to changelog or update with current status - don't keep "completed" sections

## Task Management Documentation

- **Focus on current state:** Document what needs to be done, not what was recently done
- **Use project phases:** Organize by logical project phases or milestones, not completion status
- **Move completed work to changelog:** Record completed work in CHANGELOG.md, not in task lists
- **Keep task lists current:** Update completed items with current status instead of maintaining "completed" sections
- **Use descriptive section names:** Use functional names like "Core Features", "Infrastructure", "Testing" instead of "Completed Tasks"
- **Avoid temporal references:** Don't use "Recent", "Latest", "Upcoming" in section headers - they become outdated quickly

## README.md Standards

- **Project Overview:** Keep description current with latest capabilities
- **Installation Instructions:** Verify and update installation steps
- **Usage Examples:** Ensure all code examples are tested and working
- **Feature Documentation:** Document all major features with examples
- **Version Badges:** Keep version badges synchronized with package.json
- **Links Verification:** Regularly check that all links work correctly
- **Screenshots/GIFs:** Update visual documentation when UI changes

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

## Architectural Documentation

- **Decision Records:** Record significant architectural decisions in `/meta` folder
- **System Overview:** Maintain high-level system architecture documentation
- **Data Flow:** Document data flow and process workflows
- **Integration Points:** Document external system integrations
- **Performance Considerations:** Document performance implications of design decisions

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
- **Area Prefixes (React/Frontend):** COMP, HOOK, PAGE, STORE, API, UTIL, AUTH, FORM, DOC, E2E, INT
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
