# Release v1.4.0 - Universal GitIgnore Handling

**Release Date:** December 26, 2024  
**Type:** Minor Release  
**NPM Package:** [metacoding@1.4.0](https://www.npmjs.com/package/metacoding)  

## Release Overview

This release standardizes gitignore handling across all templates by implementing a universal approach focused on AI assistant instruction file exclusions.

## Key Changes

### 🔄 Universal GitIgnore Management
- **Consolidated Approach**: Removed all template-specific .gitignore files
- **AI Assistant Focus**: GitIgnore patterns now exclusively target AI assistant instruction files:
  - `.github/copilot-instructions.md`
  - `.github/instructions/`
  - `.cursorrules`
  - `.cursor/`
- **Append-Only Logic**: Patterns are appended to user's existing .gitignore when not already present
- **Template Cleanup**: Removed empty `/files` directories from all templates

### 🧹 Template Structure Cleanup
- Removed template-specific .gitignore files from:
  - `templates/general/files/.gitignore`
  - `templates/javascript/files/.gitignore`
  - `templates/node/files/.gitignore`
  - `templates/python/files/.gitignore`
  - `templates/react/files/.gitignore`
  - `templates/typescript/files/.gitignore`
- Removed empty `/files` directories from all templates
- Updated tests to reflect new template structure

## Breaking Changes

⚠️ **Template Structure Changes**
- Templates no longer include template-specific .gitignore files
- Empty `/files` directories have been removed from all templates
- Users upgrading existing projects may need to manually manage template-specific gitignore patterns

## Technical Implementation

### GitIgnoreManager Updates
- Enhanced `getAIAssistantPatterns()` to return universal patterns
- Implemented append-only logic for existing .gitignore files
- Simplified pattern management and reduced duplication

### Test Updates
- Updated TMPL-UNIT-031 to expect absence of `/files` directories
- Modified JavaScript template tests to reflect new structure
- All 236 tests passing after changes

## Migration Guide

### For New Projects
No action required - new projects will automatically use the universal gitignore approach.

### For Existing Projects
If you have template-specific gitignore patterns in your project:
1. Review your current .gitignore file
2. Add any template-specific patterns manually if needed
3. The universal AI assistant patterns will be appended automatically on next update

## Quality Assurance

- ✅ All tests passing (236/236)
- ✅ Template structure validated
- ✅ GitIgnore functionality tested
- ✅ Breaking changes documented
- ✅ Migration guide provided

## Package Contents

```
metacoding@1.4.0
├── bin/metacoding.js          # CLI entry point
├── lib/                       # Compiled TypeScript
├── src/                       # Source TypeScript
├── templates/                 # Template files (cleaned up structure)
├── package.json              # v1.4.0
├── README.md                 # Updated documentation
└── CHANGELOG.md              # Release notes
```

## Installation

```bash
npm install -g metacoding@1.4.0
```

## Verification

After installation, verify the release:

```bash
metacoding --version  # Should output 1.4.0
metacoding init       # Test universal gitignore handling
```

## Next Steps

This release sets the foundation for:
- Simplified template maintenance
- Consistent gitignore behavior across all projects
- Focus on AI assistant integration patterns

## Repository Information

- **GitHub**: https://github.com/antonkulikov/metacoding
- **Issues**: https://github.com/antonkulikov/metacoding/issues
- **NPM**: https://www.npmjs.com/package/metacoding
