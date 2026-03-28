# NPM Publishing Checklist - v2.0.0

> **Usage Instructions:**
>
> 1. **Start New Release:** Copy this file to `_meta/releases/npm-v[TARGET-VERSION].md` with target version
> 2. **Update Assessment Date:** Fill in current date in the release file
> 3. **Track Progress:** Fill in current status for each checklist item as you work
> 4. **Complete Workflow:** Follow all phases of the publication workflow
> 5. **Finish Release:** When complete, the release file serves as permanent record
> 6. **Reset Template:** This template remains clean for the next release

**Assessment Date: 2026-03-28**

## 🔄 **ITERATION UPDATE CHECKLIST**

### 🔍 **PRE-PUBLISH VALIDATION**

#### 1. **Code Quality Gates**

- [x] All tests pass (`npm test`) - Current: **31/31**
- [x] Linting passes (`npm run lint`) - Status: **✅ Passed**
- [x] Build succeeds (`npm run build`) - Status: **✅ Passed**
- [x] Full pipeline passes (`npm run prepublishOnly`)
- **Notes**: Core quality gates passed after the v2 skill migration and release-prep fixes.

#### 2. **Version & Documentation Updates**

- [x] Version bumped in package.json (Current: **1.4.3** → Target: **2.0.0**)
- [x] CHANGELOG.md updated with new release entry
- [x] Breaking changes documented
- [x] README.md updated for new features
- [x] **README.md synchronization verified** - GitHub and npm versions match
- [x] **README badges / package metadata reviewed** (dynamic npm badge remains correct)
- [x] **CLI examples in README.md tested** and working correctly
- **Notes**: Release documents now describe vendor-specific skills, `all` vendor mode, and the v2 migration. README now explicitly notes that `init` stays interactive for project metadata even when `--vendor` or `--template` is provided.

#### 3. **Release Validation**

- [x] `npm pack` - Review package contents
- [x] Package size reasonable (Current size: **36.4** KB compressed / **150.6** KB unpacked)
- [x] All intended files included, test files excluded
- [x] Version references updated across documentation
- [x] CLI smoke test passes in a throwaway project
- **Notes**: `env npm_config_cache=/tmp/metacoding-npm-cache npm pack --dry-run` validated package contents using an isolated npm cache to avoid local cache permission issues. A throwaway repo install/update smoke test passed for `--vendor all`, validating `.codex`, `.claude`, and `.agents` workspace installs.

## 📦 **PUBLICATION WORKFLOW**

### Phase 1: Pre-Publish Testing

```bash
npm run prepublishOnly  # Must pass: lint + test + build
npm_config_cache=/tmp/metacoding-npm-cache npm pack --dry-run
```

### Phase 2: Version Management

```bash
# package.json updated to 2.0.0
# CHANGELOG.md updated with the 2.0.0 entry
git commit -m "chore: prepare v2.0.0 release"
git tag v2.0.0
git push origin v2.0.0  # CRITICAL: Push tag to GitHub
```

### Phase 3: Publish

```bash
npm publish
# OR
npm publish --access public
```

### Phase 4: Post-Publish Verification

- [ ] Package appears on npmjs.com
- [ ] Test global installation: `npm install -g metacoding`
- [ ] Test CLI functionality: `metacoding --help`
- [ ] **Verify GitHub tag exists:** Check `git ls-remote --tags origin | grep v2.0.0`
- [ ] **Create GitHub release** (recommended for professional presentation and user notifications)
- **Notes**: Post-publish verification remains pending until the actual npm publish and tag push occur.

## 🎯 **RELEASE SUMMARY**

**Status: READY TO PUBLISH**

**Version:** v2.0.0  
**Release Date:** 2026-03-28  
**Features:** Vendor-specific workflow skills for Codex, Claude Code, and Antigravity, plus `all` team mode  
**Breaking Changes:** Replaces the legacy Copilot/Cursor instruction-file product with vendor-specific skills  
**npm Package:** https://www.npmjs.com/package/metacoding

- **📦 Package Published:** Pending
- **🔖 Version:** 1.4.3 → 2.0.0
- **📊 Package Size:** 36.4 KB compressed, 150.6 KB unpacked
- **🗂️ Files Included:** 61 files
- **✅ Quality Gates:** 31/31 tests passed
- **🚀 Installation:** `npm install -g metacoding`
- **🏷️ Git Tag:** Pending - MUST be pushed to GitHub
