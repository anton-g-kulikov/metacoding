# NPM Publishing Checklist - v2.0.1

**Assessment Date: 2026-03-28**

## 🔄 **ITERATION UPDATE CHECKLIST**

### 🔍 **PRE-PUBLISH VALIDATION**

#### 1. **Code Quality Gates**

- [x] All tests pass (`npm test`) - Current: **31/31**
- [x] Linting passes (`npm run lint`)
- [x] Build succeeds (`npm run build`)
- [x] Full pipeline passes (`npm run prepublishOnly`)
- **Notes**: Patch release after removing the final stale legacy service from the 2.x codebase. `prepublishOnly` now completes cleanly again.

#### 2. **Version & Documentation Updates**

- [x] Version bumped in package.json (**2.0.0** → **2.0.1**)
- [x] CHANGELOG.md updated with new release entry
- [x] Breaking changes reviewed (none beyond 2.0.0)
- [x] README changes reviewed (no additional changes required)
- [x] CLI examples verified
- **Notes**: This is a patch release for release-surface cleanup, not a product-direction change. CLI install/update flow was re-verified in a throwaway repo.

#### 3. **Release Validation**

- [x] `npm pack --dry-run` reviewed
- [x] Package size reasonable (**37.5 kB** compressed / **154.5 kB** unpacked)
- [x] All intended files included, obsolete files excluded
- [x] CLI smoke test passes in a throwaway project
- **Notes**: The `2.0.1` tarball contains 61 files and no `assistant-adapter` artifacts. Throwaway repo validation passed for `init --vendor codex --template typescript --force` followed by `update --vendor codex --dry-run`.

## 📦 **PUBLICATION WORKFLOW**

### Phase 1: Pre-Publish Testing

```bash
npm run prepublishOnly
env npm_config_cache=/tmp/metacoding-npm-cache npm pack --dry-run
```

### Phase 2: Version Management

```bash
git commit -m "chore: prepare v2.0.1 release"
git tag v2.0.1
git push origin main
git push origin v2.0.1
```

### Phase 3: Publish

```bash
npm publish --access public
```

### Phase 4: Post-Publish Verification

- [ ] Package appears on npmjs.com
- [ ] Test global installation: `npm install -g metacoding`
- [ ] Test CLI functionality: `metacoding --help`
- [ ] Verify GitHub tag exists: `git ls-remote --tags origin v2.0.1`
- [ ] Create GitHub release

## 🎯 **RELEASE SUMMARY**

**Status: READY FOR GIT RELEASE**

**Version:** v2.0.1  
**Release Date:** 2026-03-28  
**Features:** Patch release to remove the final stale legacy assistant-adapter build surface  
**Breaking Changes:** None  
**npm Package:** https://www.npmjs.com/package/metacoding

- **📦 Package Published:** Pending
- **🔖 Version:** 2.0.0 → 2.0.1
- **📊 Package Size:** 37.5 kB compressed, 154.5 kB unpacked
- **🗂️ Files Included:** 61 files
- **✅ Quality Gates:** 31/31 tests passed
- **🏷️ Git Tag:** Pending
