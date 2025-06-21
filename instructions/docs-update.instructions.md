---
description: "Guidelines for maintaining project documentation"
applyTo: "**/*.md"
---

# Documentation Maintenance Guidelines

## README.md Standards
- **Project Overview:** Keep description current with latest capabilities
- **Installation Instructions:** Verify and update installation steps
- **Usage Examples:** Ensure all code examples are tested and working
- **Feature Documentation:** Document all major features with examples
- **Version Badges:** Keep version badges synchronized with package.json
- **Links Verification:** Regularly check that all links work correctly
- **Screenshots/GIFs:** Update visual documentation when UI changes

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

## CHANGELOG.md Maintenance
- **User-Facing Changes:** Document all changes that affect users
- **Consistent Format:** Follow established changelog format
- **Categorization:** Group changes appropriately (Added, Changed, Fixed, etc.)
- **Breaking Changes:** Clearly mark breaking changes
- **Migration Guides:** Provide migration guidance for breaking changes

## Documentation Quality Standards
- **Clarity:** Write clear, concise explanations
- **Completeness:** Ensure documentation covers all necessary aspects
- **Accuracy:** Verify all information is current and correct
- **Consistency:** Maintain consistent tone and formatting
- **Accessibility:** Use clear language and proper formatting for accessibility

## Code Examples and Tutorials
- **Working Examples:** Ensure all code examples compile and run
- **Complete Examples:** Provide complete, runnable examples when possible
- **Progressive Complexity:** Start with simple examples, build to complex ones
- **Error Handling:** Show proper error handling in examples
- **Best Practices:** Demonstrate best practices in example code

## Documentation Testing
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
