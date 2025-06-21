# MetaCoding: Professional Development Workflow for GitHub Copilot

Transform your development experience with AI-powered coding standards, automated workflows, and quality assurance that enforces best practices from day one.

## 🎯 What is MetaCoding?

MetaCoding is a **complete development methodology** that uses GitHub Copilot's custom instruction capabilities to create a **senior developer experience** for developers at any level. Instead of just getting code suggestions, you get:

- **Robust workflows** that guide you through professional development practices
- **Enforced quality standards** that prevent common mistakes
- **Test-driven development** that's automatically encouraged and guided
- **Built-in documentation standards** that keep your project maintainable

## 🛠 Installation Guide

### Step 1: Install Visual Studio Code

If you don't have VS Code installed:

1. Go to [code.visualstudio.com](https://code.visualstudio.com/)
2. Download VS Code for your operating system (Windows, Mac, or Linux)
3. Install it using the downloaded installer
4. Open VS Code after installation

### Step 2: Install GitHub Copilot Extension

1. **Open VS Code**
2. **Open Extensions panel:**
   - Click the Extensions icon in the sidebar (four squares icon)
   - Or press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
3. **Search for GitHub Copilot:**
   - Type "GitHub Copilot" in the search box
   - Look for the official extension by GitHub
4. **Install the extension:**
   - Click the "Install" button
   - Wait for installation to complete

### Step 3: Set Up GitHub Copilot

1. **Sign in to GitHub:**

   - VS Code will prompt you to sign in to GitHub
   - Click "Sign in to GitHub" and follow the authentication steps
   - Make sure you have an active GitHub Copilot subscription

2. **Enable Custom Instructions:**
   - Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac) to open Settings
   - Click the "Open Settings (JSON)" icon in the top-right corner
   - Add these lines to your settings file:
   ```json
   {
     "github.copilot.chat.codeGeneration.useInstructionFiles": true,
     "chat.promptFiles": true
   }
   ```
   - Save the file with `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)

### Step 4: Set Up MetaCoding in Your Project

1. **Create your project folder:**

   ```bash
   mkdir my-awesome-project
   cd my-awesome-project
   ```

2. **Open your project in VS Code:**

   - In VS Code, go to File → Open Folder
   - Select your project folder
   - Click "Select Folder" (Windows) or "Open" (Mac/Linux)

3. **Create the GitHub configuration folder:**

   - In VS Code, create a new folder called `.github` in your project root
   - Inside `.github`, create another folder called `instructions`

4. **Download MetaCoding files:**

   - Download the `copilot-instructions.md` file from this repository
   - Download all files from the `instructions/` folder
   - Place `copilot-instructions.md` in your `.github/` folder
   - Place all instruction files in your `.github/instructions/` folder

   Your project should now look like this:

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

### Step 5: Customize for Your Project

1. **Open `copilot-instructions.md`** in VS Code
2. **Replace the placeholder text:**
   - Replace `[short project description]` with your actual project description
   - Replace `[Main goal 1]`, `[Main goal 2]`, etc. with your project goals
   - Replace `[List primary technologies]` with your tech stack (e.g., "React, Node.js, TypeScript")
   - Replace `[project specific]` with your domain (e.g., "React", "Node.js", "Python")
3. **Save the file**

### Step 6: Test Your Setup

1. **Restart VS Code** to ensure all settings are applied
2. **Create a new file** in your project (e.g., `test.js` or `main.py`)
3. **Open GitHub Copilot Chat:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "GitHub Copilot: Open Chat"
   - Press Enter
4. **Test the setup:**
   - In GitHub Copilot, ask: "What are the coding standards for this project?"
   - Copilot should reference your custom instructions and provide project-specific guidance!

## ✅ You're Ready to Go!

# 💬 How to Use MetaCoding with GitHub Copilot

Once you have MetaCoding set up, you can leverage its power in several ways:

## Automatic Context Application

GitHub Copilot automatically applies relevant instruction files based on the files you're editing:

- **Editing test files** → `test-runner.instructions.md` automatically applies
- **Editing Markdown files** → `docs-update.instructions.md` automatically applies
- **Editing any code file** → `code-review.instructions.md` is available for manual use
- **Editing package.json** → `release.instructions.md` automatically applies

## Attaching Instruction Files

1. **Open GitHub Copilot Chat** (`Ctrl+Shift+P` → "GitHub Copilot: Open Chat")
2. **Click the paperclip icon** (attach button) in the Copilot input
3. **Select "Instructions..."** from the menu
4. **Choose the instruction file** you want to reference
5. **Type your prompt** and Copilot will use that instruction context

Examples of effective prompts:

- "Run tests and prepare for publishing changes"
- "Bump version and commit following release workflow"
- "Review this code for security vulnerabilities"

## Manual Instruction Reference

You can explicitly reference specific instruction files in GitHub Copilot:

- "Use release.instructions.md to help me bump the version to 2.1.0"

- "Apply code-review.instructions.md guidelines to review this function"

- "Following test-runner.instructions.md, help me write tests for this component"

# Best Practices for Using GitHub Copilot

- **Use Agent Mode by default** - Agent mode provides the most comprehensive assistance with workflow automation
- **Start with simple prompts** like "Let's plan feature X" to test your setup
- **Be specific about context** when manually referencing instructions
- **Reference multiple instructions** when needed for complex tasks
- **Provide necessary context**: include documentation, taks list, test cases and related files and folders in your prompt (use the "Attach" menu)

## When to Switch Copilot Modes

- **Agent Mode (Default)**: Use for complex workflows, multi-step tasks, and when you want Copilot to handle the entire process
  - Examples: "Implement user authentication with tests and documentation" or "Prepare release with version bump and changelog"
- **Ask Mode**: Use for questions, explanations, and when you need information without taking action
  - Examples: "Explain how this algorithm works" or "What are the best practices for error handling?"
- **Edit Mode**: Use for focused code modifications when you want direct file editing
  - Examples: "Refactor this function to use async/await" or "Add error handling to this method"

## 🆘 Getting Help

### Common Questions

**Q: Do I need to be an experienced developer?**
A: No! MetaCoding is designed to help developers at any level follow professional practices.

**Q: Will this work with my preferred programming language?**
A: Yes! MetaCoding works with any language supported by GitHub Copilot.

**Q: Can I customize the workflow for my team's needs?**
A: Absolutely! All instruction files can be modified to match your team's specific requirements.

**Q: Does this replace learning to code?**
A: No, it enhances your learning by guiding you through professional practices while you develop your coding skills.

## Troubleshooting

**GitHub Copilot not responding to instructions:**

- Make sure you've restarted VS Code after adding the settings
- Verify your GitHub Copilot subscription is active
- Check that the instruction files are in the correct `.github/` folder

**Instructions not applying automatically:**

- Ensure file names match exactly (including the `.instructions.md` extension)
- Verify the folder structure is correct
- Try manually referencing instructions in GitHub Copilot

## Official Resources

Learn more about GitHub Copilot custom instructions:

- **[VS Code Custom Instructions Guide](https://code.visualstudio.com/blogs/2025/03/26/custom-instructions)** - **Official comprehensive guide** from the VS Code team on custom instructions
- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)** - Official GitHub Copilot best practices
- **[VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)** - Technical documentation for advanced customization

## 🤝 Contributing

We welcome contributions to make MetaCoding even better! Whether you have:

- Improvements to existing workflows
- New instruction patterns for specific technologies
- Documentation enhancements
- Bug fixes or clarifications

Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT). Use it freely in personal or commercial projects.
