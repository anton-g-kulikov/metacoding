# metacoding: Guided Development Workflow for GitHub Copilot

[![Version](https://img.shields.io/npm/v/metacoding.svg)](https://www.npmjs.com/package/metacoding)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Compatible-brightgreen.svg)](https://github.com/features/copilot)

Transform your development experience with AI-guided coding standards, structured workflows, and quality practices that help you build better software from day one.

## Table of Contents

- [🎯 What is metacoding?](#-what-is-metacoding)
- [🛠 Installation Guide](#-installation-guide)
- [📦 Using the metacoding CLI](#-using-the-metacoding-cli)
- [💬 How to Use metacoding with GitHub Copilot](#-how-to-use-metacoding-with-github-copilot)
- [🆘 Getting Help](#-getting-help)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 What is metacoding?

metacoding is a **guided development methodology** that uses GitHub Copilot's custom instruction capabilities to help developers at any level follow established best practices. Instead of just getting code suggestions, you get:

- **Structured workflows** that guide you through proven development practices
- **Quality standards** that help you avoid common mistakes
- **Test-driven development** that's encouraged and guided step-by-step
- **Documentation guidance** that keeps your projects maintainable

## 🛠 Installation Guide

### Prerequisites

Before installing metacoding, make sure you have:

1. **Visual Studio Code** installed ([download here](https://code.visualstudio.com/))
2. **GitHub Copilot extension** installed and configured in VS Code
3. **Active GitHub Copilot subscription** ([get one here](https://github.com/features/copilot))
4. **Node.js** (version 16 or higher) for the CLI tool

### Quick Setup (Recommended)

The easiest way to get started with metacoding is using our npm package:

1. **Install globally:** `npm install -g metacoding`
2. **Navigate to your project:** `cd your-project`
3. **Initialize metacoding:** `metacoding init`
4. **Follow the interactive prompts and you're done!**

**Available templates:** You can also specify a template during initialization:

- `metacoding init --template react` - Use React template
- `metacoding init --template node` - Use Node.js/Backend template
- `metacoding init --template python` - Use Python template
- `metacoding init --force` - Overwrite existing files

**Note:** The CLI will automatically configure VS Code settings for custom instructions. If you need to configure manually, add these settings to your VS Code settings.json:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.promptFiles": true
}
```

After you finished, your project should now look like this:

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

### Test Your Setup

1. **Restart VS Code** to ensure all settings are applied
2. **Create a new file** in your project (e.g., `test.js` or `main.py`)
3. **Open GitHub Copilot Chat:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "GitHub Copilot: Open Chat"
   - Press Enter
4. **Test the setup:**
   - In GitHub Copilot, ask: "What is the development workflow for this project?"
   - Copilot should reference your custom instructions and provide project-specific guidance!

## ✅ You're Ready to Go!

## 📦 Using the metacoding CLI

Once installed, you can use these commands:

### `metacoding validate`

Check your current metacoding setup:

- `metacoding validate` - Basic validation
- `metacoding validate --strict` - Strict validation rules
- `metacoding validate --fix` - Auto-fix issues where possible

### `metacoding update`

Update your metacoding setup to the latest version:

- `metacoding update` - Update to latest version
- `metacoding update --backup` - Create backup before updating

### Help and Version

- `metacoding --help` - Show all commands
- `metacoding --version` - Show version number

## 💬 How to Use metacoding with GitHub Copilot

Once you have metacoding set up, you can leverage its power in several ways:

### Automatic Context Application

GitHub Copilot automatically applies relevant instruction files based on the files you're editing:

- **Editing test files** → `test-runner.instructions.md` automatically applies
- **Editing Markdown files** → `docs-update.instructions.md` automatically applies
- **Editing any code file** → `code-review.instructions.md` is available for manual use
- **Editing package.json** → `release.instructions.md` automatically applies

### Attaching Instruction Files

1. **Open GitHub Copilot Chat** (`Ctrl+Shift+P` → "GitHub Copilot: Open Chat")
2. **Click the paperclip icon** (attach button) in the Copilot input
3. **Select "Instructions..."** from the menu
4. **Choose the instruction file** you want to reference
5. **Type your prompt** and Copilot will use that instruction context

Examples of effective prompts:

- "Run tests and prepare for publishing changes"
- "Bump version and commit following release workflow"
- "Review this code for security vulnerabilities"

### Manual Instruction Reference

You can explicitly reference specific instruction files in GitHub Copilot:

- "Use release.instructions.md to help me bump the version to 2.1.0"

- "Apply code-review.instructions.md guidelines to review this function"

- "Following test-runner.instructions.md, help me write tests for this component"

## Best Practices for Using GitHub Copilot

### Choose the Right Mode for Your Task

- **Agent Mode (Default)**: Use for complex workflows, multi-step tasks, and when you want Copilot to handle the entire process
  - Examples: "Implement user authentication with tests and documentation" or "Prepare release with version bump and changelog"
- **Ask Mode**: Use for questions, explanations, and when you need information without taking action
  - Examples: "Explain how this algorithm works" or "What are the best practices for error handling?"
- **Edit Mode**: Use for focused code modifications when you want direct file editing
  - Examples: "Refactor this function to use async/await" or "Add error handling to this method"

### Effective Prompting Strategies

- **Start with simple prompts** like "Let's plan feature X" to test your setup
- **Be specific about context** when manually referencing instructions
- **Reference multiple instructions** when needed for complex tasks
- **Provide necessary context**: include documentation, task list, test cases and related files and folders in your prompt (use the "Attach" menu)

## 🆘 Getting Help

### Common Questions

**Q: Do I need to be an experienced developer?**
A: No! metacoding provides guidance and structure to help developers at any level adopt proven practices and improve their skills.

**Q: What if I don't have GitHub Copilot?**
A: You'll need an active GitHub Copilot subscription to use metacoding. Students can get it free through GitHub Education.

**Q: Can I use this without the CLI tool?**
A: The CLI tool provides the easiest setup experience. For manual setup, you can download instruction files from our GitHub repository.

**Q: Will this work with my preferred programming language?**
A: Yes! The general metacoding template (set of instructions) works with any language supported by GitHub Copilot.

**Q: Can I customize the workflow for my team's needs?**
A: Absolutely! All instruction files can be modified to match your team's specific requirements.

**Q: Does this replace learning to code?**
A: No, it enhances your learning by providing guidance on proven practices while you develop your coding skills.

**Q: What VS Code settings are required?**
A: The CLI automatically configures required settings, but you need `github.copilot.chat.codeGeneration.useInstructionFiles: true` and `chat.promptFiles: true`.

## Troubleshooting

**Installation Issues:**

- Make sure Node.js (version 16+) is installed: `node --version`
- Verify npm is working: `npm --version`
- Try clearing npm cache: `npm cache clean --force`

**GitHub Copilot not responding to instructions:**

- Make sure you've restarted VS Code after installation
- Verify your GitHub Copilot subscription is active
- Check that the instruction files are in the correct `.github/` folder
- Ensure VS Code settings include the required custom instruction settings

**Instructions not applying automatically:**

- Ensure file names match exactly (including the `.instructions.md` extension)
- Verify the folder structure is correct
- Try manually referencing instructions in GitHub Copilot
- Run `metacoding validate` to check your setup

**CLI Command Issues:**

- Ensure metacoding is installed globally: `npm list -g metacoding`
- Try reinstalling: `npm uninstall -g metacoding && npm install -g metacoding`
- Check PATH configuration if command not found

## Official Resources

Learn more about GitHub Copilot custom instructions:

- **[VS Code Custom Instructions Guide](https://code.visualstudio.com/blogs/2025/03/26/custom-instructions)** - **Official comprehensive guide** from the VS Code team on custom instructions
- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)** - Official GitHub Copilot best practices
- **[VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)** - Technical documentation for advanced customization

## 🤝 Contributing

We welcome contributions to make metacoding even better! Whether you have:

- Improvements to existing workflows
- New instruction patterns for specific technologies
- Documentation enhancements
- Bug fixes or clarifications

Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT). Use it freely in personal or commercial projects.
