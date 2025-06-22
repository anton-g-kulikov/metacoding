---
description: 'Universal release process for all project types'
applyTo: 'package.json,setup.py,pyproject.toml,Cargo.toml'
---

# Universal Release Process Guidelines

## Pre-Release Validation

### Code Quality Verification

1. **Test Suite:** Verify all tests pass using project-appropriate test runner
2. **Build Verification:** Ensure clean build without errors using project build system
3. **Linting:** Check code quality standards using project linter configuration
4. **Dependencies:** Review and update dependencies if needed
5. **Security Audit:** Run security audit using language-appropriate tools

### Language-Specific Pre-Release Steps

For detailed language-specific release steps, refer to:

- **TypeScript/Node.js:** `npm test`, `npm run build`, `npm audit`
- **Python:** `pytest`, `python -m build`, `pip-audit` or `safety check`
- **React/Frontend:** `npm test`, `npm run build`, `npm run lint`

## Version Management

### Semantic Versioning

Follow SemVer (Semantic Versioning) principles across all project types:

- **MAJOR (X.0.0):** Breaking changes that require user action
- **MINOR (0.X.0):** New features that are backward compatible
- **PATCH (0.0.X):** Bug fixes that are backward compatible

### Version Consistency

1. **Primary Version File:** Update version in main project file:
   - Node.js: `package.json`
   - Python: `setup.py`, `pyproject.toml`, or `__version__.py`
   - Rust: `Cargo.toml`
   - Other languages: Follow language conventions
2. **Cross-File Consistency:** Ensure version matches across all relevant files
3. **Breaking Changes:** Document breaking changes prominently in changelog

## Documentation Updates

### README.md Updates

1. **Version Badges:** Update version badges to match project version
2. **Installation Instructions:** Refresh installation instructions if needed
3. **Feature Descriptions:** Update feature descriptions for new capabilities
4. **Link Verification:** Verify all links and examples work correctly
5. **Language-Specific Updates:** Update language-specific installation commands

### API Documentation

- **Interface Changes:** Update API documentation for any interface changes
- **Compatibility Notes:** Document backward compatibility information
- **Migration Guides:** Provide migration guidance for breaking changes

## Changelog Management

### Entry Structure

Create new section in CHANGELOG.md with:

1. **Release Header:** Version number matching project version file
2. **Release Date:** Date in YYYY-MM-DD format
3. **Grouped Changes:** Organize by standard categories:
   - **Added:** New features
   - **Changed:** Changes in existing functionality
   - **Deprecated:** Soon-to-be removed features
   - **Removed:** Now removed features
   - **Fixed:** Bug fixes
   - **Security:** Security vulnerability fixes

### Entry Guidelines

- **User Impact Focus:** Write from user perspective, not technical implementation
- **Descriptive but Brief:** 1-2 lines per change explaining user impact
- **Issue References:** Include issue/PR numbers when applicable: `(#123)`
- **Breaking Changes:** Highlight with ⚠️ or **BREAKING:** prefix
- **Migration Information:** Include migration steps for breaking changes

## Git Operations

### Commit and Tagging

1. **Stage Changes:** Add all release-related changes (version files, changelog, docs)
2. **Commit Message:** Use consistent format: `chore: bump version to vX.Y.Z`
3. **Create Tag:** Tag the commit with version:
   - Git: `git tag vX.Y.Z`
   - Follow project conventions for tag naming
4. **Push Changes:** Push commits and tags: `git push && git push --tags`

### Branch Management

- **Release Branches:** Use release branches for complex release processes
- **Hotfix Handling:** Follow established branching strategy for hotfixes
- **Merge Strategy:** Use consistent merge strategy (merge commits vs. squash)

## Platform-Specific Release Steps

### Package Registry Publishing

**Node.js/npm:**

```bash
npm publish
# Or for scoped packages: npm publish --access public
```

**Python/PyPI:**

```bash
python -m build
twine upload dist/*
```

**GitHub Releases:**

1. **Create Release:** Create GitHub release with tag matching project version
2. **Release Title:** Use format: `vX.Y.Z - [Brief description]`
3. **Release Notes:** Copy relevant sections from CHANGELOG.md
4. **Asset Uploads:** Include built artifacts if applicable

### Registry-Specific Considerations

- **Package Validation:** Verify package content before publishing
- **Permissions:** Ensure proper publishing permissions are configured
- **Registry Status:** Check target registry availability before publishing

## Post-Release Verification

### Publication Verification

1. **Registry Confirmation:** Verify package published correctly to target registry
2. **Installation Test:** Test installation from registry in clean environment
3. **Version Verification:** Confirm published version matches expected version
4. **Metadata Check:** Verify package metadata is correct

### Documentation and Communication

1. **Documentation Links:** Ensure all documentation links work correctly
2. **Update Notifications:** Notify relevant stakeholders of release
3. **Community Communication:** Post to relevant community channels if applicable
4. **Monitor Issues:** Watch for immediate issues reported by users

## Release Monitoring

### Immediate Post-Release

- **Download/Install Metrics:** Monitor initial adoption metrics
- **Error Monitoring:** Watch for error reports from new version
- **User Feedback:** Monitor support channels for user feedback
- **Dependency Issues:** Watch for reports of dependency conflicts

### Issue Response

- **Rapid Response:** Establish process for rapid response to critical issues
- **Hotfix Process:** Have clear process for emergency hotfixes
- **Communication Plan:** Prepare communication strategy for critical issues
- **Rollback Preparedness:** Know how to rollback if necessary

## Rollback and Emergency Procedures

### Rollback Planning

- **Git Revert:** Know how to revert problematic releases
- **Registry Management:** Understand registry policies for unpublishing
- **User Communication:** Prepare communication strategy for rollbacks
- **Data Migration:** Plan for any data migration rollbacks if applicable

### Emergency Release Process

- **Hotfix Workflow:** Streamlined process for critical security fixes
- **Testing Requirements:** Minimum testing requirements for emergency releases
- **Approval Process:** Expedited approval process for critical fixes
- **Communication Protocol:** Emergency communication procedures

## Release Automation

### CI/CD Integration

- **Automated Testing:** All tests must pass before release
- **Automated Building:** Automated build process for release artifacts
- **Automated Publishing:** Consider automated publishing for appropriate project types
- **Release Notes Generation:** Automate generation of release notes from changelog

### Quality Gates

- **Test Coverage:** Minimum test coverage requirements
- **Security Scanning:** Automated security vulnerability scanning
- **Dependency Auditing:** Automated dependency security auditing
- **Performance Benchmarks:** Performance regression testing

## Multi-Language Project Considerations

### Coordinated Releases

- **Version Synchronization:** Keep versions synchronized across language components
- **Testing Integration:** Test all language components together
- **Documentation Coordination:** Ensure documentation covers all language components
- **Compatibility Matrix:** Document compatibility between different language versions

### Release Coordination

- **Release Orchestration:** Coordinate release timing across components
- **Dependency Management:** Manage dependencies between language components
- **Testing Strategy:** Test integration between language components
- **Communication:** Coordinate communication across different language communities

## Compliance and Legal

### License Compliance

- **License Verification:** Ensure all dependencies comply with project license
- **License Updates:** Update license information for new dependencies
- **Attribution:** Provide proper attribution for third-party components

### Security and Privacy

- **Security Review:** Review security implications of changes
- **Privacy Impact:** Assess privacy impact of new features
- **Compliance Requirements:** Meet relevant compliance requirements (GDPR, HIPAA, etc.)

## Release Metrics and Analytics

### Success Metrics

- **Adoption Rate:** Track adoption of new version
- **Error Rate:** Monitor error rates in new version
- **Performance Metrics:** Track performance of new version
- **User Satisfaction:** Gather user feedback on new features

### Continuous Improvement

- **Release Retrospectives:** Conduct retrospectives after major releases
- **Process Refinement:** Continuously improve release process
- **Tool Evaluation:** Regularly evaluate and improve release tooling
- **Documentation Updates:** Keep release documentation current with process changes
