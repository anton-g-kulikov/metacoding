# NPM Publishing Checklist

> **Usage Instructions:**
>
> 1. **Start New Release:** Copy this file to `_meta/releases/npm-v[TARGET-VERSION].md` with target version
> 2. **Update Assessment Date:** Fill in current date in the release file
> 3. **Track Progress:** Fill in current status for each checklist item as you work
> 4. **Complete Workflow:** Follow all phases of the publication workflow
> 5. **Finish Release:** When complete, the release file serves as permanent record
> 6. **Reset Template:** This template remains clean for the next release

**Assessment Date: 2025-06-25**

## 🔄 **ITERATION UPDATE CHECKLIST**

### 🔍 **PRE-PUBLISH VALIDATION**

#### 1. **Code Quality Gates**

- [x] All tests pass (`npm test`) - Current: **236/236** ✅
- [x] Linting passes (`npm run lint`) - Status: **✅ PASSED**
- [x] Build succeeds (`npm run build`) - Status: **✅ PASSED**
- [x] Full pipeline passes (`npm run prepublishOnly`) - Status: **✅ PASSED**
- **Notes**: All quality gates passed. JavaScript template fully integrated with CLI and project detection.

#### 2. **Version & Documentation Updates**

- [x] Version bumped in package.json (Current: **1.2.1** → Target: **1.3.0**) ✅
- [x] CHANGELOG.md updated with new release entry ✅
- [x] Breaking changes documented (if any) - None for this release
- [x] README.md updated for new features (if applicable) - JavaScript template examples added ✅
- [x] **README.md synchronization verified** - GitHub and npm versions match ✅
- [x] **Version badges in README.md updated** to reflect new version (dynamic badge) ✅
- [x] **CLI examples in README.md tested** and working correctly ✅
- **Notes**: Minor version bump for JavaScript template addition. All documentation updated.

#### 3. **Release Validation**

- [x] `npm pack` - Package created and tested locally ✅
- [x] Package size reasonable (Previous: ~50KB)
- [x] All intended files included, test files excluded ✅
- [x] Version references updated across documentation ✅
- [x] JavaScript template CLI workflow tested and working ✅
- **Notes**: Package validated and JavaScript template fully functional in CLI

## 📦 **PUBLICATION WORKFLOW**

### Phase 1: Pre-Publish Testing

```bash
npm run prepublishOnly  # Must pass: lint + test + build
npm pack               # Review package contents
```

### Phase 2: Version Management

```bash
# Update version in package.json
# Update CHANGELOG.md entry
git commit -m "chore: bump version to v1.3.0"
git tag v1.3.0
git push origin v1.3.0  # CRITICAL: Push tag to GitHub
```

### Phase 3: Publish

```bash
npm publish            # Standard publish
# OR
npm publish --access public  # For scoped packages
```

### Phase 4: Post-Publish Verification

- [ ] Package appears on npmjs.com
- [ ] Test global installation: `npm install -g metacoding`
- [ ] Test CLI functionality: `metacoding --help`
- [ ] **Verify GitHub tag exists:** Check `git ls-remote --tags origin | grep v1.3.0`
- [ ] **Create GitHub release** (recommended for professional presentation and user notifications)
- **Notes**: [Add post-publish verification results]

## 🎯 **RELEASE SUMMARY**

**Status: IN PROGRESS**

**Version:** v1.3.0  
**Release Date:** 2025-06-25  
**Features:** Complete JavaScript template with CLI and Cursor IDE compatibility  
**Breaking Changes:** None  
**npm Package:** https://www.npmjs.com/package/metacoding

- **📦 Package Published:** [Status]
- **🔖 Version:** 1.2.1 → 1.3.0
- **📊 Package Size:** [Size] KB compressed, [Size] KB unpacked
- **🗂️ Files Included:** [Number] files
- **✅ Quality Gates:** 228/228 tests passed
- **🚀 Installation:** `npm install -g metacoding`
- **🏷️ Git Tag:** [Tag status - MUST be pushed to GitHub]

## 📋 **COMMON ITERATION ISSUES**

### Test Failures

- **Issue**: New code breaks existing tests
- **Solution**: Fix tests or update test cases for new functionality
- **Prevention**: Run tests after each significant change

### Version Conflicts

- **Issue**: Forgetting to bump version or using wrong semver
- **Solution**: Follow semantic versioning strictly
- **Prevention**: Automate version bumping

### Git Tag Management

- **Issue**: Creating git tag locally but forgetting to push to GitHub
- **Solution**: Always run `git push origin v1.3.0` after creating tag
- **Prevention**: Include tag push in Phase 2 workflow script
- **Verification**: Check `git ls-remote --tags origin | grep v1.3.0`

### Documentation Lag

- **Issue**: Code changes but documentation doesn't update
- **Solution**: Update docs as part of feature development
- **Prevention**: Include doc updates in PR requirements

### Dependency Drift

- **Issue**: Dependencies become outdated between releases or version mismatches occur
- **Solution**: Review and update dependencies regularly, ensure TypeScript and ESLint versions are compatible
- **Prevention**: Set up dependency monitoring and check for compatibility warnings during lint
- **Common Example**: TypeScript version newer than @typescript-eslint supports

## 🏆 **RELEASE BEST PRACTICES**

### Before Each Release

1. Review all changes since last release
2. Test in clean environment
3. Update documentation proactively
4. Plan next iteration features

### Version Strategy

- **Patch (x.y.Z)**: Bug fixes, small improvements
- **Minor (x.Y.z)**: New features, backwards compatible
- **Major (X.y.z)**: Breaking changes, major features

### Quality Gates

- All tests must pass
- No linting errors
- Build must succeed
- Documentation must be current
- **Git tag must be pushed to GitHub remote**
- **GitHub release recommended** (enhances project professionalism)

---

## 📝 **RELEASE NOTES TEMPLATE**

```markdown
## [v1.3.0] - 2025-06-25

### Added

- Complete JavaScript template with comprehensive instruction files
- JavaScript coding standards (ES6+, modern patterns, async/await)
- JavaScript testing frameworks guidance (Jest, Mocha, Vitest)
- JavaScript documentation standards with JSDoc patterns
- Full CLI and Cursor IDE compatibility for JavaScript template
- Template manager support for loading JavaScript instruction files

### Fixed

- Template manager now properly loads JavaScript instruction files for Cursor IDE
- Fallback logic for test-runner.instructions.md in JavaScript template

### Technical

- 12 new test cases for JavaScript template functionality
- All 228 tests passing with no regressions
- Updated task documentation and test documentation
```

---

## ✅ **PERMANENTLY CONFIGURED ITEMS**

_These items are already properly set up and don't need regular checking:_

- ✅ **LICENSE**: Proper copyright (Anton Kulikov) and MIT license
- ✅ **Package Metadata**: All URLs, author info, and keywords configured
- ✅ **Package Structure**: Files field, bin entry, build output properly configured
- ✅ **Scripts**: All npm scripts (prepare, prepublishOnly, etc.) working
- ✅ **Dependencies**: Proper separation and version constraints established

_Focus your checklist energy on the iteration-specific items above!_
