# NPM Publishing Checklist

> **Usage Instructions:**
>
> 1. **Start New Release:** Copy this file to `_meta/releases/npm-v[TARGET-VERSION].md` with target version
> 2. **Update Assessment Date:** Fill in current date in the release file
> 3. **Track Progress:** Fill in current status for each checklist item as you work
> 4. **Complete Workflow:** Follow all phases of the publication workflow
> 5. **Finish Release:** When complete, the release file serves as permanent record
> 6. **Reset Template:** This template remains clean for the next release

**Assessment Date: 2025-06-26**

## 🔄 **ITERATION UPDATE CHECKLIST**

### 🔍 **PRE-PUBLISH VALIDATION**

#### 1. **Code Quality Gates**

- [x] All tests pass (`npm test`) - Current: **245/245**
- [ ] Linting passes (`npm run lint`) - Status: **[PENDING]**
- [x] Build succeeds (`npm run build`) - Status: **PASSED**
- [ ] Full pipeline passes (`npm run prepublishOnly`)
- **Notes**: [Add notes about test results, build status, and any issues resolved]

#### 2. **Version & Documentation Updates**

- [ ] Version bumped in package.json (Current: **1.4.1** → Target: **1.4.2**)
- [x] CHANGELOG.md updated with new release entry
- [ ] Breaking changes documented (if any)
- [ ] README.md updated for new features (if applicable)
- [ ] **README.md synchronization verified** - GitHub and npm versions match
- [ ] **Version badges in README.md updated** to reflect new version
- [ ] **CLI examples in README.md tested** and working correctly
- **Notes**: [Add notes about version change, features, and documentation updates]

#### 3. **Release Validation**

- [ ] `npm pack` - Review package contents
- [ ] Package size reasonable (Current size: **[SIZE]** KB)
- [ ] All intended files included, test files excluded
- [ ] Version references updated across documentation
- **Notes**: [Add notes about package validation and contents]

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
git commit -m "chore: bump version to vX.Y.Z"
git tag vX.Y.Z
git push origin vX.Y.Z  # CRITICAL: Push tag to GitHub
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
- [ ] **Verify GitHub tag exists:** Check `git ls-remote --tags origin | grep vX.Y.Z`
- [ ] **Create GitHub release** (recommended for professional presentation and user notifications)
- **Notes**: [Add post-publish verification results]

## 🎯 **RELEASE SUMMARY**

**Status: [IN PROGRESS / COMPLETED]**

**Version:** [vX.Y.Z]  
**Release Date:** [YYYY-MM-DD]  
**Features:** [Brief description of key features]  
**Breaking Changes:** [None / List changes]  
**npm Package:** https://www.npmjs.com/package/metacoding

- **📦 Package Published:** [Status]
- **🔖 Version:** [Previous] → [Current]
- **📊 Package Size:** [Size] KB compressed, [Size] KB unpacked
- **🗂️ Files Included:** [Number] files
- **✅ Quality Gates:** [X]/[Y] tests passed
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
- **Solution**: Always run `git push origin vX.Y.Z` after creating tag
- **Prevention**: Include tag push in Phase 2 workflow script
- **Verification**: Check `git ls-remote --tags origin | grep vX.Y.Z`

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
## [vX.Y.Z] - YYYY-MM-DD

### Added

- New feature descriptions

### Changed

- Changes to existing functionality

### Fixed

- Bug fixes and corrections

### Security

- Security improvements

### Breaking Changes

- Any breaking changes with migration guidance
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
