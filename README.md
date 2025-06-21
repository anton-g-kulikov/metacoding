# GitHub Copilot Instructions Template

A comprehensive template for configuring GitHub Copilot with project-specific instructions and automated development workflows.

## Overview

This repository provides a complete setup for enhancing GitHub Copilot's effectiveness through:

- **Main Template** (`copilot-instructions.md`): General coding standards and project guidelines
- **Specialized Instructions** (`instructions/`): Task-specific automation for common development routines

## 🚀 Quick Start

### Step 1: Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com/)
- Install the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- Ensure you have an active GitHub Copilot subscription

### Step 2: Enable Custom Instructions in VS Code

1. Open VS Code
2. Press `Cmd+,` (on Mac) or `Ctrl+,` (on Windows/Linux) to open Settings
3. Click the "Open Settings (JSON)" icon in the top-right corner
4. Add these lines to your `settings.json` file:
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "chat.promptFiles": true
   }
   ```
5. Save the file (`Cmd+S` or `Ctrl+S`)

### Step 3: Copy and Customize the Main Template

1. Download or copy the `copilot-instructions.md` file from this repository
2. In your project, create a `.github` folder in the root directory (if it doesn't exist)
3. Place the file as `.github/copilot-instructions.md` in your project
4. Open the file and replace all bracketed placeholders:
   - `[short project description]` → Your project description
   - `[project specific]` → Your domain (e.g., "React", "Node.js")
   - `[project domain]` → Your technology area
   - `[Main goal 1]`, `[Main goal 2]` → Your specific project goals
   - `[List primary technologies]` → Your tech stack

### Step 4: Add Specialized Instructions

1. Copy the entire `instructions/` folder from this repository
2. Place it in your project's `.github/` directory
3. Your structure should look like:
   ```
   your-project/
   ├── .github/
   │   ├── copilot-instructions.md
   │   └── instructions/
   │       ├── test-runner.instructions.md
   │       ├── release.instructions.md
   │       ├── docs-update.instructions.md
   │       └── code-review.instructions.md
   ```

### Step 5: Test the Setup

1. Restart VS Code to ensure all settings are applied
2. Open any file in your project
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette
4. Type "GitHub Copilot: Open Chat" and press Enter
5. In the chat, try asking: "What are the coding standards for this project?"
6. Copilot should now reference your custom instructions!

## 📁 File Structure

```
metacoding/
├── copilot-instructions.md                   # Main template with mandatory workflow
├── instructions/
│   ├── test-runner.instructions.md       # Testing workflows and TDD guidelines
│   ├── release.instructions.md           # Release management process
│   ├── docs-update.instructions.md       # Documentation with status transparency
│   └── code-review.instructions.md       # Comprehensive code review checklists
└── README.md                             # This documentation

# In your actual project:
your-project/
├── .github/
│   ├── copilot-instructions.md          # Customized from template
│   └── instructions/                    # Copied from metacoding/instructions/
│       ├── test-runner.instructions.md
│       ├── release.instructions.md
│       ├── docs-update.instructions.md
│       └── code-review.instructions.md
├── /meta                                 # Development documentation
│   ├── project-task-list.md            # Task tracking with status indicators
│   └── project-documentation.md        # General project documentation
└── /test                                # Test documentation
    └── test-documentation.md            # Test cases and status tracking
```

## 🎯 Main Template Features

### Project Customization

- **Project Overview**: Description, goals, and tech stack
- **Role Definition**: Senior developer persona with specific expertise
- **Communication Style**: Clear guidelines for AI responses

### Coding Standards

- **Language Preferences**: TypeScript-first with strict typing
- **Naming Conventions**: Consistent naming across files, classes, and variables
- **Code Quality**: Function size limits, error handling, memory management
- **Project Structure**: Organized directory layout and file organization

### Development Workflow

- **Mandatory 7-Step Process**: Strict workflow from task planning to completion
- **Test-Driven Development**: TDD approach with comprehensive coverage
- **Documentation Standards**: JSDoc, README, and changelog maintenance with status transparency
- **Version Control**: Conventional commits and semantic versioning
- **Release Management**: Complete release workflow with GitHub integration
- **Quality Gates**: No shortcuts, incremental development, workflow completion enforcement

## 🔧 Specialized Instructions

### Test Runner (`test-runner.instructions.md`)

**Auto-applies to**: `test/**/*.ts`

**Features**:

- Pre-commit testing validation
- Test development standards and naming conventions
- Mock strategy and realistic test data guidelines
- Performance testing and maintenance practices

**Usage**: Automatically included when editing test files

### Release Management (`release.instructions.md`)

**Auto-applies to**: `package.json`

**Features**:

- Complete release workflow checklist
- Semantic versioning guidelines
- README badge synchronization
- Changelog management with proper categorization
- GitHub release creation process

**Usage**: Triggered when editing package.json or manually: "Use release.instructions.md"

### Documentation Updates (`docs-update.instructions.md`)

**Auto-applies to**: `**/*.md`

**Features**:

- README.md maintenance standards with status transparency guidelines
- Code documentation with JSDoc and clear status indicators
- API documentation requirements using present-tense headers
- Architectural decision recording in `/meta` folder
- Link verification and example testing
- **Status Guidelines**: Never use "planned" or "to-do" in titles; use checkboxes and status indicators instead

**Usage**: Automatically included when editing any Markdown files

### Code Review (`code-review.instructions.md`)

**Auto-applies to**: `**` (any file)

**Features**:

- Comprehensive review checklist
- Functionality, performance, and security assessment
- Testing and documentation validation
- Anti-pattern detection
- Standards compliance verification

**Usage**: Manual attachment: "Use code-review.instructions.md to review this code"

## 📖 Usage Examples

### Automatic Context

```typescript
// Editing test/user-service.test.ts
// test-runner.instructions.md automatically applies
// Copilot suggests proper test structure and naming
```

### Manual Instruction Reference

```
// In Copilot Chat:
"Use release.instructions.md to help me bump the version to 2.1.0"

// In Copilot Chat:
"Apply code-review.instructions.md guidelines to review this function"
```

### Release Workflow

```bash
# When editing package.json, release instructions auto-apply
# Copilot guides through:
# 1. Version update
# 2. README badge sync
# 3. Changelog entry
# 4. Commit message format
# 5. GitHub release creation
```

## ⚙️ Setup Instructions

### 1. Enable Custom Instructions in VS Code

Add to your `settings.json`:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true
}
```

### 2. Customize the Main Template

Replace placeholders in `copilot-instructions.md`:

- `[short project description]` → Your project description
- `[project specific]` → Your domain (e.g., "React", "Node.js", "VS Code extension")
- `[project domain]` → Your technology area
- `[Main goal 1]` → Your specific project goals
- `[List primary technologies]` → Your tech stack

### 3. Copy to Your Project

```bash
# Copy main template and customize
cp metacoding/copilot-instructions.md your-project/.github/copilot-instructions.md

# Copy instruction files
cp -r metacoding/instructions/ your-project/.github/instructions/
```

### 4. Project-Specific Customization

Adjust instruction files based on your needs:

- **Testing**: Modify test patterns and frameworks
- **Release**: Adapt to your deployment process
- **Documentation**: Adjust for your documentation structure
- **Code Review**: Customize review criteria

## 🎨 Customization Guide

### Adding New Instructions

Create new `.instructions.md` files for specific tasks:

```markdown
---
description: "Custom workflow description"
applyTo: "src/**/*.ts" # Glob pattern for auto-application
---

# Your Custom Instructions

- Specific guidelines for your workflow
- Task-specific requirements
- Quality standards
```

Modify existing instructions

1. **Edit instruction files** in `instructions/`
2. **Update glob patterns** in the `applyTo` field
3. **Test with Copilot Chat** to verify effectiveness
4. **Share with team** for consistency

### Project Type Variations

- **Web Applications**: Emphasize React/Vue patterns, API integration
- **VS Code Extensions**: Focus on VS Code API, performance, activation events
- **Libraries**: Highlight API design, backward compatibility, documentation
- **CLI Tools**: Emphasize argument parsing, error messages, help text

## 🔄 Development Workflow

### Mandatory 7-Step Process

This template enforces a strict development workflow to ensure code quality and comprehensive documentation:

1. **Task Understanding & Planning**
   - Always start with clarification questions
   - Provide shortest possible implementation outline
   - Get explicit user confirmation before proceeding
   - Clarify scope and expectations

2. **Task Management**
   - Update `/meta/project-task-list.md` with new tasks
   - Set clear task status and descriptions
   - Break down complex tasks into manageable subtasks
   - Provide realistic effort estimates

3. **Test-Driven Development (TDD)**
   - Document test cases in `/test/test-documentation.md` first
   - Define expected behavior, inputs, outputs, and edge cases
   - Implement tests that verify documented behavior
   - Verify tests fail appropriately (red phase)
   - Write minimum code to make tests pass (green phase)

4. **Implementation & Verification**
   - Write production code to meet requirements
   - Run all tests to ensure they pass
   - Get user confirmation that implementation meets expectations
   - Refactor while maintaining test coverage

5. **Documentation & Status Updates**
   - Update all relevant documentation
   - Mark tasks complete in `/meta/project-task-list.md`
   - Update test status in `/test/test-documentation.md`
   - Document user-facing changes in `CHANGELOG.md`
   - Ensure JSDoc comments are current

6. **Version Control**
   - Use conventional commit messages
   - Include tests, documentation, and code in commits
   - Write descriptive commit messages explaining what and why
   - Keep commits atomic and complete

7. **Workflow Completion Check**
   - Ensure all steps are completed before new tasks
   - Maintain incremental development approach
   - Keep repository, codebase, and documentation up-to-date
   - Verify all quality gates are met

### Workflow Enforcement

- **No Shortcuts**: Every step must be completed in order
- **No Parallel Tasks**: Focus on one task until fully complete
- **No Skipping Tests**: TDD approach is mandatory
- **No Incomplete Documentation**: All docs must be current
- **No Uncommitted Changes**: All work must be committed

### Quality Benefits

- **Higher Code Quality**: TDD ensures robust, well-tested code
- **Better Documentation**: Always current and comprehensive
- **Reduced Technical Debt**: Incremental approach prevents shortcuts
- **Improved Maintainability**: Clear task tracking and documentation
- **Team Collaboration**: Consistent approach across team members
- **Risk Mitigation**: Small, tested changes reduce deployment risks

## 🤝 Team Adoption

### Onboarding New Developers

1. **Setup**: Share setup instructions
2. **Familiarization**: Review main template and instructions
3. **Practice**: Use instructions for common tasks
4. **Feedback**: Collect and incorporate improvements

### Maintaining Consistency

- **Version Control**: Track instruction changes
- **Regular Reviews**: Update instructions as practices evolve
- **Team Discussions**: Discuss effectiveness and improvements
- **Documentation**: Keep this README current

## 📚 Best Practices

### Instruction Writing

- **Be Specific**: Avoid vague guidelines
- **Be Actionable**: Provide clear steps
- **Be Contextual**: Use appropriate glob patterns
- **Be Consistent**: Maintain consistent terminology

### VS Code Integration

- **Test Instructions**: Verify instructions work as expected
- **Monitor Performance**: Ensure instructions don't slow down Copilot
- **Regular Updates**: Keep instructions current with VS Code updates
- **Team Sharing**: Use Settings Sync for team consistency

## 🐛 Troubleshooting

### Instructions Not Applying

- Check VS Code settings for custom instructions
- Verify file paths and glob patterns
- Ensure proper front matter syntax
- Restart VS Code if needed

### Copilot Not Following Instructions

- Make instructions more specific
- Break complex instructions into smaller parts
- Use explicit examples and patterns
- Check for conflicting instructions

### Performance Issues

- Simplify complex instruction files
- Use more specific glob patterns
- Remove redundant instructions
- Monitor VS Code performance

## 📝 Documentation Status Guidelines

### Status Transparency Standards

This template enforces clear status indication in all documentation:

#### Status Indicators
- ✅ **Complete/Implemented** - Feature is fully implemented and tested
- 🚧 **In Progress** - Currently being worked on
- ❌ **Not Started** - Not yet begun
- ⚠️ **Needs Review** - Requires review or validation
- 🔄 **Under Revision** - Being updated or modified

#### Best Practices
- **Never use "planned" or "to-do" in titles or headers** - Creates outdated documentation
- **Use checkboxes for task status** - `- [ ]` for incomplete, `- [x]` for complete
- **Reflect current state in headers** - Use present tense and current status
- **Keep status current** - Update indicators as work progresses
- **Use consistent symbols** - Maintain same symbols across all documentation

#### Examples
❌ **Bad Headers:**
- "Planned Authentication Features"
- "TODO: API Documentation"
- "Future Enhancements"

✅ **Good Headers:**
- "Authentication Features" (with status checkboxes)
- "API Documentation Status" (with clear indicators)
- "Enhancement Status" (with current state)

This approach ensures documentation always reflects reality and reduces maintenance overhead.

## 🔗 Resources

- [VS Code Copilot Customization Docs](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## 📄 License

This template is provided as-is for use in any project. Customize freely to match your project's needs.

## 🤖 Contributing

Feel free to suggest improvements or additional instruction patterns that could benefit the development community.

---

**Happy Coding with Enhanced Copilot! 🚀**
