---
description: "Step-by-step release process automation"
applyTo: "package.json"
---

# Release Process Checklist

## Pre-Release Validation
1. **Test Suite:** Verify all tests pass: `npm test`
2. **Build Verification:** Ensure clean build without errors: `npm run build`
3. **Linting:** Check code quality standards: `npm run lint`
4. **Dependencies:** Review and update dependencies if needed
5. **Security Audit:** Run security audit: `npm audit`

## Version Management
1. **Semantic Versioning:** Update version in package.json following SemVer:
   - **MAJOR:** Breaking changes (X.0.0)
   - **MINOR:** New features, backward compatible (0.X.0)
   - **PATCH:** Bug fixes, backward compatible (0.0.X)
2. **Version Consistency:** Ensure version matches across all relevant files
3. **Breaking Changes:** Document breaking changes prominently in changelog

## Documentation Updates
1. **README.md Updates:**
   - Update version badges to match package.json version
   - Refresh installation instructions if needed
   - Update feature descriptions for new capabilities
   - Verify all links and examples work correctly
2. **API Documentation:** Update API docs for any interface changes

## Changelog Management
1. **Add New Entry:** Create new section in CHANGELOG.md with:
   - Release version number (matching package.json)
   - Release date in YYYY-MM-DD format
   - Grouped changes by category:
     - **Added:** New features
     - **Changed:** Changes in existing functionality
     - **Deprecated:** Soon-to-be removed features
     - **Removed:** Now removed features
     - **Fixed:** Bug fixes
     - **Security:** Security vulnerability fixes
2. **Entry Guidelines:**
   - Keep entries brief but descriptive (1-2 lines per change)
   - Focus on user impact rather than technical implementation
   - Reference issue/PR numbers when applicable: `(#123)`
   - Highlight breaking changes with ⚠️ or **BREAKING:**

## Git Operations
1. **Commit Changes:** Stage all release-related changes
2. **Commit Message:** Use format: `chore: bump version to vX.Y.Z`
3. **Create Tag:** Tag the commit with version number: `git tag vX.Y.Z`
4. **Push Changes:** Push commits and tags: `git push && git push --tags`

## GitHub Release
1. **Create Release:** Create GitHub release with tag matching package.json version
2. **Release Title:** Use format: `vX.Y.Z - [Brief description]`
3. **Release Notes:** 
   - Copy relevant sections from CHANGELOG.md
   - Include installation instructions
   - Highlight major changes and breaking changes
   - Thank contributors if applicable

## Post-Release Verification
1. **Package Registry:** Verify package published correctly (if applicable)
2. **Installation Test:** Test installation from registry in clean environment
3. **Documentation Links:** Ensure all documentation links work correctly
4. **Monitor Issues:** Watch for any immediate issues reported by users

## Rollback Plan
- **Git Revert:** Know how to revert problematic releases
- **Package Unpublish:** Understand package registry policies for unpublishing
- **Communication:** Prepare communication strategy for critical issues
