# `metacoding`: Guided Development Workflow for AI Assistants

[![Version](https://img.shields.io/npm/v/metacoding.svg)](https://www.npmjs.com/package/metacoding)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Compatible-brightgreen.svg)](https://github.com/features/copilot)
[![Cursor IDE](https://img.shields.io/badge/Cursor%20IDE-Compatible-brightgreen.svg)](https://www.cursor.com/)

Transform your development experience with AI-guided coding standards, structured workflows, and quality practices that help you build better software from day one. Works with both GitHub Copilot in VS Code and Cursor IDE.

## Table of Contents

- [🎯 What is `metacoding`?](#-what-is-metacoding)
- [💬 How to Use `metacoding` with AI Assistants](#-how-to-use-metacoding-with-ai-assistants)
- [🛠 Installation Guide](#-installation-guide)
- [📦 Using the `metacoding` CLI](#-using-the-metacoding-cli)
- [🆘 Getting Help](#-getting-help)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 What is `metacoding`?

`metacoding` is a **guided development methodology** that uses AI assistant custom instruction capabilities to help developers at any level follow established best practices. Works seamlessly with GitHub Copilot in VS Code and Cursor IDE. Instead of just getting code suggestions, you get:

- **Structured workflows** that guide you through proven development practices
- **Quality standards** that help you avoid common mistakes
- **Test-driven development** that's encouraged and guided step-by-step
- **Documentation guidance** that keeps your projects maintainable

## 💬 How to Use `metacoding` with AI Assistants

`metacoding` transforms AI assistants (GitHub Copilot or Cursor IDE) into autonomous development partners that execute structured workflows. You specify what you want built, and your AI assistant independently follows a disciplined 7-step process that ensures quality, maintainability, and thorough testing. Your role is to provide clear requirements, validate results, and approve each stage before proceeding.

### The `metacoding` 7-Step Development Workflow

Every development task follows this mandatory workflow to ensure quality and consistency:

#### Step 1: Describe Your Feature or Task

Be specific about what you want to build. Copilot will automatically follow the workflow and create a comprehensive plan for your approval.

- **Be specific about requirements**: Clearly describe the feature, functionality, or problem to solve
- **Provide context**: Include relevant constraints, user needs, or business requirements
- **Review Copilot's plan**: Copilot will automatically create an implementation outline following workflow standards
- **Approve or refine**: Confirm the plan meets your needs or request adjustments
- **Example prompt**: _"I want to add user authentication to my web app. Users should be able to register with email/password, login securely, logout, and have password reset functionality. The system should handle validation errors gracefully."_

#### Step 2: Verify Task Documentation

Copilot will automatically document tasks following the workflow. Your role is to review and approve the breakdown.

- **Review task breakdown**: Copilot will add tasks to your project list and create subtasks
- **Verify scope boundaries**: Ensure what's included and excluded is clear and appropriate
- **Approve documentation**: Confirm the task structure before Copilot proceeds to testing
- **Example verification**: _"Review the authentication tasks you've added. Does this scope make sense for our current iteration?"_

#### Step 3: Validate Test Strategy

Copilot will automatically document test cases before implementation. You verify the testing approach meets your quality standards.

- **Review test documentation**: Copilot will document all test scenarios following TDD principles
- **Verify coverage**: Ensure happy paths, error scenarios, and edge cases are included
- **Approve test approach**: Confirm the testing strategy before Copilot implements failing tests
- **Example verification**: _"Check the test cases you've documented for authentication. Are we covering all the important scenarios?"_

#### Step 4: Monitor Implementation Progress

Copilot will implement functionality to make tests pass. You track progress and validate the working solution.

- **Track implementation**: Copilot will write minimal code following TDD red-green-refactor cycle
- **Verify test results**: Copilot will run tests and report results - you confirm they're passing
- **Test functionality yourself**: Validate that the implementation works as expected in practice
- **Example check**: _"Show me the test results and let me verify the authentication is working correctly."_

#### Step 5: Review Documentation Updates

Copilot will automatically update all documentation. You verify completeness and accuracy of updates.

- **Review documentation changes**: Copilot will update README, API docs, and code comments
- **Verify task status updates**: Confirm completed work is properly marked in project management docs
- **Approve changelog entries**: Review user-facing changes recorded in changelog
- **Example review**: _"Show me what documentation you've updated for the authentication feature. Let me verify it's accurate and complete."_

#### Step 6: Approve Version Control

Copilot will create proper commits following conventional standards. You approve the commit structure and messages.

- **Review commit structure**: Copilot will prepare atomic commits with conventional messages
- **Verify file inclusion**: Ensure all related files (code, tests, docs) are included together
- **Approve commits**: Confirm the commit represents complete, working functionality
- **Example approval**: _"Show me the commit you've prepared for the authentication feature. Does it include everything we've built?"_

#### Step 7: Confirm Workflow Completion

Copilot will verify workflow completion automatically. You perform final validation before moving to new work.

- **Review completion checklist**: Copilot will verify all tests pass, documentation is updated, and changes are committed
- **Confirm clean repository state**: Verify temporary files are cleaned up and repository is organized
- **Approve workflow completion**: Give explicit approval before starting any new tasks
- **Example confirmation**: _"Confirm our authentication workflow is complete and we're ready for the next feature."_

### Workflow Enforcement and Quality Assurance

`metacoding` enforces strict quality practices:

- **Documentation-First Principle**: No coding begins until documentation is complete
- **Single-Task Focus**: One change at a time - never mix unrelated tasks
- **Confirmation Gates**: User approval required before proceeding with implementation
- **Test Coverage**: Comprehensive testing mandatory for all functionality
- **Repository Hygiene**: Clean up temporary files and maintain organization

### Effective Workflow Prompts

**Starting a new feature:**
_"Let's implement feature X following the 7-step workflow. First, help me understand requirements and create an implementation plan."_

**During development:**
_"We're on step 3 of our workflow. Document the test cases for this component before implementing tests."_

**Scope management:**
_"I want to add feature Y, but we're working on feature X. Add Y to the task list and let's complete X first."_

**Quality check:**
_"Review our current workflow step. Are we ready to proceed, or do we need to complete documentation first?"_

### Automatic Context Application

GitHub Copilot automatically applies relevant instruction files based on your work:

- **Test files** → Applies test-driven development and quality standards
- **Documentation** → Enforces documentation architecture and maintenance guidelines
- **Code files** → Provides code review criteria and quality standards
- **Release files** → Guides version management and release procedures

### Manual Instruction Reference

For specific guidance, explicitly reference instruction files:

- _"Use the 7-step workflow to implement user registration"_
- _"Apply code review guidelines to check this function"_
- _"Follow test documentation standards to update our test cases"_
- _"Use release instructions to prepare version 2.1.0"_

### Workflow Violations and Corrections

If you try to skip steps or mix tasks, Copilot will redirect you:

- **Skipping documentation**: _"Let's document this task first before implementing"_
- **Task switching**: _"I've added that to the task list. Let's complete our current workflow first"_
- **Missing tests**: _"We need to document and implement tests before the production code"_

### Best Practices for Workflow Success

1. **Start small**: Begin with simple features to practice the workflow
2. **Stay focused**: Complete one task fully before starting another
3. **Trust the process**: The workflow prevents technical debt and quality issues
4. **Attach context**: Include task lists, documentation, and related files in prompts
5. **Confirm understanding**: Always confirm plans before implementation begins

The `metacoding` workflow transforms chaotic development into a structured, quality-driven process that scales from personal projects to enterprise teams.

## 🛠 Installation Guide

### Prerequisites

Before installing `metacoding`, choose your AI development setup:

#### Option A: VS Code + GitHub Copilot

1. **Visual Studio Code** installed ([download here](https://code.visualstudio.com/))
2. **GitHub Copilot extension** installed and configured in VS Code
3. **Active GitHub Copilot subscription** ([get one here](https://github.com/features/copilot))
4. **Node.js** (version 16 or higher) for the CLI tool

#### Option B: Cursor IDE

1. **Cursor IDE** installed ([download here](https://www.cursor.com/))
2. **Active Cursor Pro subscription** for advanced AI features (recommended)
3. **Node.js** (version 16 or higher) for the CLI tool

### Quick Setup (Recommended)

The easiest way to get started with `metacoding` is using our npm package:

1. **Install globally:** `npm install -g metacoding`
2. **Navigate to your project:** `cd your-project`
3. **Initialize `metacoding`:** `metacoding init`
4. **Follow the interactive prompts** to choose your AI setup and you're done!

#### Init options

**Basic usage:**

- `metacoding init` - Interactive setup with AI assistant and template selection
- `metacoding init --template react` - Use React template with interactive AI setup
- `metacoding init --template node` - Use Node.js template with interactive AI setup
- `metacoding init --template python` - Use Python template with interactive AI setup
- `metacoding init --force` - Overwrite existing files

**Direct AI setup:**

- `metacoding init --vscode` - Set up for VS Code + GitHub Copilot
- `metacoding init --cursor` - Set up for Cursor IDE
- `metacoding init --cursor --template react` - Cursor setup with React template

#### Post-Installation Configuration

**For VS Code + GitHub Copilot:**
The CLI automatically configures VS Code settings for custom instructions. If you need to configure manually, add these settings to your VS Code settings.json:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true
}
```

**For Cursor IDE:**
No additional configuration needed! Cursor automatically detects and uses `workflow.cursorrules` and `.cursor/rules/*.mdc` files.

### File Structure by AI Setup

**VS Code + GitHub Copilot setup:**

```
my-awesome-project/
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/
│       ├── test-runner.instructions.md
│       ├── release.instructions.md
│       ├── docs-update.instructions.md
│       └── code-review.instructions.md
```

**Cursor IDE setup:**

```
my-awesome-project/
├── workflow.cursorrules
├── .cursor/
│   └── rules/
│       ├── test-runner.mdc
│       ├── release.mdc
│       ├── docs-update.mdc
│       └── code-review.mdc
```

### Test Your Setup

#### For VS Code + GitHub Copilot:

1. **Restart VS Code** to ensure all settings are applied
2. **Create a new file** in your project (e.g., `test.js` or `main.py`)
3. **Open GitHub Copilot Chat:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "GitHub Copilot: Open Chat"
   - Press Enter
4. **Test the setup:**
   - In GitHub Copilot, ask: "What is the development workflow for this project?"
   - Copilot should reference your custom instructions and provide project-specific guidance!

#### For Cursor IDE:

1. **Open your project in Cursor IDE**
2. **Verify rules are loaded:**
   - Check that `workflow.cursorrules` appears in the Cursor IDE interface
   - Look for rule indicators showing active patterns
3. **Test the setup:**
   - In Cursor chat, ask: "What is the development workflow for this project?"
   - Cursor should reference your workflow rules and provide project-specific guidance!

## ✅ You're Ready to Go!

## 📦 Using the `metacoding` CLI

Once installed, you can use these commands:

### `metacoding init`

Initialize metacoding in your current project:

**Interactive setup:**

- `metacoding init` - Interactive setup with AI assistant and template selection
- `metacoding init --template react` - Initialize with React template (interactive AI setup)
- `metacoding init --template node` - Initialize with Node.js template (interactive AI setup)
- `metacoding init --template python` - Initialize with Python template (interactive AI setup)
- `metacoding init --force` - Overwrite existing files without confirmation

**Direct AI setup:**

- `metacoding init --vscode` - Set up for VS Code + GitHub Copilot
- `metacoding init --cursor` - Set up for Cursor IDE
- `metacoding init --vscode --template react` - VS Code setup with React template
- `metacoding init --cursor --template python` - Cursor setup with Python template

### `metacoding update`

Update your `metacoding` setup to the latest version:

- `metacoding update` - Update to latest version
- `metacoding update --dry-run` - Validate current setup without making changes
- `metacoding update --dry-run --strict` - Strict validation rules
- `metacoding update --backup` - Create backup before updating

### Help and Version

- `metacoding --help` - Show all commands and examples
- `metacoding --version` - Show version number

## 🆘 Getting Help

### Common Questions

**Q: Do I need to be an experienced developer?**
A: No! `metacoding` provides guidance and structure to help developers at any level adopt proven practices and improve their skills.

**Q: Should I choose VS Code + GitHub Copilot or Cursor IDE?**
A: Both work great! Choose based on your preference:

- **VS Code + GitHub Copilot**: Best if you already use VS Code and have GitHub Copilot
- **Cursor IDE**: Best for AI-first development with built-in AI features

**Q: What if I don't have an AI assistant subscription?**
A: You'll need either an active GitHub Copilot subscription (for VS Code) or Cursor Pro (for advanced Cursor features). Students can get GitHub Copilot free through GitHub Education.

**Q: Can I switch between VS Code and Cursor later?**
A: Yes! Run `metacoding init --vscode` or `metacoding init --cursor` to switch your setup. The CLI will install the appropriate files for your chosen AI assistant.

**Q: Can I use this without the CLI tool?**
A: The CLI tool provides the easiest setup experience. For manual setup, you can download instruction files from our GitHub repository.

**Q: Will this work with my preferred programming language?**
A: Yes! The general `metacoding` template works with any language supported by your AI assistant.

**Q: Can I customize the workflow for my team's needs?**
A: Absolutely! All instruction files can be modified to match your specific requirements.

**Q: Does this replace learning to code?**
A: Nope. But it's totally up to you!.

**Q: What VS Code settings are required?**
A: For VS Code + GitHub Copilot, you need `github.copilot.chat.codeGeneration.useInstructionFiles: true` and `chat.promptFiles: true`. The CLI configures these automatically.

**Q: Does Cursor IDE require special settings?**
A: No additional settings needed! Cursor automatically detects `workflow.cursorrules` and `.cursor/rules/*.mdc` files.

## Troubleshooting

**Installation Issues:**

- Make sure Node.js (version 16+) is installed: `node --version`
- Verify npm is working: `npm --version`
- Try clearing npm cache: `npm cache clean --force`

**VS Code + GitHub Copilot Issues:**

- Make sure you've restarted VS Code after installation
- Verify your GitHub Copilot subscription is active
- Check that the instruction files are in the correct `.github/` folder
- Ensure VS Code settings include the required custom instruction settings
- Try manually referencing instructions in GitHub Copilot

**Cursor IDE Issues:**

- Verify `workflow.cursorrules` file exists in your project root
- Check that `.cursor/rules/*.mdc` files are present
- Ensure Cursor IDE is updated to the latest version
- Look for rule indicators in Cursor IDE interface showing active patterns
- Try asking Cursor: "What rules are active for this project?"

**Instructions not applying automatically:**

- Ensure file names match exactly (including extensions)
- Verify the folder structure is correct for your AI setup
- Run `metacoding update --dry-run` to validate your setup
- For VS Code: Check `.github/instructions/` folder structure
- For Cursor: Check `workflow.cursorrules` and `.cursor/rules/` files

**CLI Command Issues:**

- Ensure `metacoding` is installed globally: `npm list -g metacoding`
- Try reinstalling: `npm uninstall -g metacoding && npm install -g metacoding`
- Check PATH configuration if command not found

## Official Resources

Learn more about GitHub Copilot custom instructions:

- **[VS Code Custom Instructions Guide](https://code.visualstudio.com/blogs/2025/03/26/custom-instructions)** - **Official comprehensive guide** from the VS Code team on custom instructions
- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)** - Official GitHub Copilot best practices
- **[VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)** - Technical documentation for advanced customization

## 🤝 Contributing

We welcome contributions to make `metacoding` even better! Whether you have:

- Improvements to existing workflows
- New instruction patterns for specific technologies
- Documentation enhancements
- Bug fixes or clarifications

Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT). Use it freely in personal or commercial projects.
