import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { AssistantAdapterService } from '../services/assistant-adapter';
import { CursorService } from '../services/cursor';
import { FileSystemService } from '../services/filesystem';
import { GitIgnoreManager } from '../services/gitignore-manager';
import { ProjectDetector } from '../services/project-detector';
import { TemplateManager } from '../services/template-manager';
import { VSCodeService } from '../services/vscode';
import { AssistantType, InitOptions, ProjectConfig } from '../types';

/**
 * Handles the 'init' command for setting up metacoding in a project
 */
export class InitCommand {
  private templateManager: TemplateManager;
  private fileSystem: FileSystemService;
  private vscodeService: VSCodeService;
  private cursorService: CursorService;
  private projectDetector: ProjectDetector;
  private gitIgnoreManager: GitIgnoreManager;
  private assistantAdapterService: AssistantAdapterService;

  constructor() {
    this.templateManager = new TemplateManager();
    this.fileSystem = new FileSystemService();
    this.vscodeService = new VSCodeService();
    this.cursorService = new CursorService(
      this.templateManager,
      this.fileSystem
    );
    this.projectDetector = new ProjectDetector();
    this.gitIgnoreManager = new GitIgnoreManager();
    this.assistantAdapterService = new AssistantAdapterService();
  }

  /**
   * Execute the init command
   */
  async execute(options: InitOptions): Promise<void> {
    console.log(chalk.cyan.bold('🚀 Welcome to metacoding Setup!\n'));

    // Detect current project context
    const projectInfo = await this.projectDetector.detectProject();

    // Check for existing assistant configurations
    const existingAssistants = await this.assistantAdapterService.detectExistingAssistants(process.cwd());
    if (existingAssistants.length > 0 && !options.force) {
      console.log(chalk.yellow(`\nDetected existing assistant configurations: ${existingAssistants.join(', ')}`));
      
      const { migrationChoice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'migrationChoice',
          message: 'How would you like to proceed?',
          choices: [
            { name: 'Overwrite existing configurations', value: 'overwrite' },
            { name: 'Keep existing and add new ones', value: 'add' },
            { name: 'Cancel setup', value: 'cancel' }
          ]
        }
      ]);

      if (migrationChoice === 'cancel') {
        console.log(chalk.yellow('Setup cancelled.'));
        return;
      }

      if (migrationChoice === 'overwrite') {
        options.force = true;
      }
    }

    // Get environment and assistant choices
    const environmentChoice = await this.getEnvironmentChoice(options);
    const ideChoice = environmentChoice === 'ide' ? await this.getIdeChoice(options) : undefined;
    const assistantChoices = await this.getAssistantChoices(options, environmentChoice);

    // Get project configuration
    const config = await this.getProjectConfiguration(
      options,
      projectInfo,
      environmentChoice,
      ideChoice
    );

    // Set up the project with assistant configurations
    await this.setupProjectWithAssistants(config, assistantChoices, options);

    console.log(chalk.green.bold('\n✅ metacoding setup complete!\n'));
    this.displayNextSteps(assistantChoices, environmentChoice, ideChoice);
  }

  /**
   * Get project configuration from user input
   */
  private async getProjectConfiguration(
    options: InitOptions,
    projectInfo: any,
    environmentChoice: 'ide' | 'terminal',
    ideChoice?: 'vscode' | 'cursor' | 'intellij'
  ): Promise<ProjectConfig> {
    // For testing or force mode, use defaults
    if (options.force && process.env.NODE_ENV === 'test') {
      return {
        name: projectInfo.name || 'test-project',
        description: 'A test project using metacoding workflow',
        techStack: ['TypeScript', 'Jest'],
        projectType: options.template,
        testFramework: 'Jest',
        buildTool: 'TypeScript Compiler',
        ideChoice: ideChoice || (environmentChoice === 'ide' ? 'vscode' : undefined),
      };
    }

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: projectInfo.name || 'my-project',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A guided development project using metacoding workflow',
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project are you working on?',
        choices: [
          { name: 'React/Frontend Application', value: 'react' },
          { name: 'Node.js/Backend Application', value: 'node' },
          { name: 'JavaScript Application', value: 'javascript' },
          { name: 'Python Application', value: 'python' },
          { name: 'General/Other', value: 'general' },
        ],
        default: options.template !== 'general' ? options.template : undefined,
      },
      {
        type: 'input',
        name: 'techStack',
        message: 'Tech stack (comma-separated):',
        default: (answers: any) => {
          switch (answers.projectType) {
            case 'react':
              return 'React, TypeScript, Jest, Vite';
            case 'node':
              return 'Node.js, TypeScript, Express, Jest';
            case 'javascript':
              return 'JavaScript, Node.js, Jest, npm';
            case 'python':
              return 'Python, FastAPI, Pytest';
            default:
              return 'TypeScript, Jest';
          }
        },
        filter: (input: string) => input.split(',').map((item) => item.trim()),
      },
      {
        type: 'confirm',
        name: 'enableTesting',
        message: 'Enable test automation features?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'enableReleaseManagement',
        message: 'Enable release management workflow?',
        default: true,
      },
    ];

    const answers = await inquirer.prompt(questions);

    return {
      name: answers.name,
      description: answers.description,
      techStack: answers.techStack,
      projectType: answers.projectType,
      testFramework: answers.enableTesting
        ? this.getDefaultTestFramework(answers.projectType)
        : undefined,
      buildTool: this.getDefaultBuildTool(answers.projectType),
      ideChoice,
    } as ProjectConfig;
  }

  /**
   * Set up the project with the given configuration
   */
  private async setupProject(
    config: ProjectConfig,
    options: InitOptions,
    ideChoice: 'vscode' | 'cursor'
  ): Promise<void> {
    const spinner = ora('Setting up metacoding files...').start();

    try {
      // Create IDE-specific directory structure
      if (ideChoice === 'vscode') {
        await this.fileSystem.ensureDirectoryExists('.github');
        await this.fileSystem.ensureDirectoryExists('.github/instructions');
      } else if (ideChoice === 'cursor') {
        await this.fileSystem.ensureDirectoryExists('.cursor');
        await this.fileSystem.ensureDirectoryExists('.cursor/rules');
      }

      // Generate and write template files
      const template = await this.templateManager.getTemplate(
        config.projectType,
        config
      );
      const processedFiles = await this.templateManager.processTemplate(
        template,
        config
      );

      for (const file of processedFiles) {
        await this.fileSystem.writeFile(file.path, file.content);
        spinner.text = `Created ${file.path}`;
      }

      // Update .gitignore with AI assistant exclusion patterns
      spinner.text = 'Updating .gitignore with AI assistant exclusions...';
      await this.gitIgnoreManager.updateGitIgnore(process.cwd());

      // Configure IDE-specific settings
      if (ideChoice === 'vscode') {
        // Configure VS Code settings (unless skipped)
        if (!options.skipVscode) {
          spinner.text = 'Configuring VS Code settings...';
          await this.vscodeService.updateSettings(
            template.vscodeSettings || {}
          );
        }
      } else if (ideChoice === 'cursor') {
        // Configure Cursor IDE settings
        spinner.text = 'Configuring Cursor IDE rules...';

        // Generate workflow content and pattern rules
        const workflowContent = await this.cursorService.generateWorkflowRules(
          process.cwd(),
          config.projectType,
          config
        );
        const patternRules = await this.cursorService.generatePatternRules(
          process.cwd(),
          config.projectType
        );

        // Install Cursor rules
        await this.cursorService.installCursorRules(
          process.cwd(),
          workflowContent,
          patternRules
        );
      }

      spinner.succeed('metacoding files created successfully');
    } catch (error) {
      spinner.fail('Failed to set up metacoding');
      throw error;
    }
  }

  /**
   * Get default test framework for project type
   */
  private getDefaultTestFramework(projectType: string): string {
    switch (projectType) {
      case 'react':
        return 'Jest + React Testing Library';
      case 'node':
        return 'Jest';
      case 'javascript':
        return 'Jest';
      case 'python':
        return 'Pytest';
      default:
        return 'Jest';
    }
  }

  /**
   * Get default build tool for project type
   */
  private getDefaultBuildTool(projectType: string): string {
    switch (projectType) {
      case 'react':
        return 'Vite';
      case 'node':
        return 'TypeScript Compiler';
      case 'javascript':
        return 'Webpack/Vite';
      case 'python':
        return 'Poetry';
      default:
        return 'TypeScript Compiler';
    }
  }

  /**
   * Validate IDE options and get the user's choice
   */
  private async validateAndGetIdeChoice(
    options: InitOptions
  ): Promise<'vscode' | 'cursor'> {
    // Check for conflicting flags
    if (options.vscode && options.cursor) {
      throw new Error(
        'Cannot specify both --vscode and --cursor flags. Please choose one.'
      );
    }

    // Return explicit choice if provided
    if (options.vscode) {
      return 'vscode';
    }
    if (options.cursor) {
      return 'cursor';
    }

    // For testing or force mode, default to VS Code
    if (options.force && process.env.NODE_ENV === 'test') {
      return 'vscode';
    }

    // Interactive prompt for IDE choice
    const { ideChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'ideChoice',
        message: 'Which AI coding environment would you like to set up?',
        choices: [
          {
            name: 'VS Code + GitHub Copilot (recommended for most users)',
            value: 'vscode',
          },
          {
            name: 'Cursor IDE (alternative AI-powered editor)',
            value: 'cursor',
          },
        ],
        default: 'vscode',
      },
    ]);

    return ideChoice;
  }

  /**
   * Get environment choice from user or options
   */
  private async getEnvironmentChoice(options: InitOptions): Promise<'ide' | 'terminal'> {
    // Handle legacy options
    if (options.vscode || options.cursor) {
      return 'ide';
    }

    if (options.environment) {
      return options.environment;
    }

    // For testing or force mode, use defaults
    if (options.force && process.env.NODE_ENV === 'test') {
      return 'ide'; // Default for tests
    }

    const { environment } = await inquirer.prompt([
      {
        type: 'list',
        name: 'environment',
        message: 'What development environment will you primarily use?',
        choices: [
          { name: 'IDE (VS Code, Cursor, IntelliJ)', value: 'ide' },
          { name: 'Terminal/CLI', value: 'terminal' }
        ],
        default: 'ide'
      }
    ]);

    return environment;
  }

  /**
   * Get IDE choice from user or options
   */
  private async getIdeChoice(options: InitOptions): Promise<'vscode' | 'cursor' | 'intellij' | undefined> {
    // Handle legacy options
    if (options.vscode) return 'vscode';
    if (options.cursor) return 'cursor';

    if (options.ide) {
      return options.ide as 'vscode' | 'cursor' | 'intellij';
    }

    // For testing or force mode, use defaults
    if (options.force && process.env.NODE_ENV === 'test') {
      return 'vscode'; // Default for tests
    }

    const { ideChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'ideChoice',
        message: 'Which IDE will you use?',
        choices: [
          { name: 'VS Code', value: 'vscode' },
          { name: 'Cursor', value: 'cursor' },
          { name: 'IntelliJ IDEA', value: 'intellij' }
        ],
        default: 'vscode'
      }
    ]);

    return ideChoice;
  }

  /**
   * Get assistant choices from user or options
   */
  private async getAssistantChoices(
    options: InitOptions, 
    environmentChoice: 'ide' | 'terminal'
  ): Promise<AssistantType[]> {
    if (options.assistants && options.assistants.length > 0) {
      return options.assistants;
    }

    // Handle legacy options
    if (options.vscode || options.cursor) {
      return ['copilot'];
    }

    // For testing or force mode, use defaults
    if (options.force && process.env.NODE_ENV === 'test') {
      return ['copilot']; // Default for tests
    }

    const availableAssistants = this.assistantAdapterService.getAvailableAssistants();
    const choices = availableAssistants.map(assistant => ({
      name: assistant.description,
      value: assistant.type
    }));

    choices.push({ name: 'All of the above', value: 'all' as AssistantType });

    const { assistants } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'assistants',
        message: `Which AI assistants will you use in your ${environmentChoice} environment?`,
        choices,
        default: environmentChoice === 'ide' ? ['copilot'] : ['codex'],
        validate: (input: AssistantType[]) => {
          if (input.length === 0) {
            return 'Please select at least one assistant';
          }
          return true;
        }
      }
    ]);

    return assistants;
  }

  /**
   * Set up project with assistant configurations
   */
  private async setupProjectWithAssistants(
    config: ProjectConfig,
    assistantChoices: AssistantType[],
    options: InitOptions
  ): Promise<void> {
    const spinner = ora('Setting up metacoding files...').start();

    try {
      // Generate assistant configuration files
      spinner.text = 'Generating assistant configuration files...';
      const generatedFiles = await this.assistantAdapterService.generateAssistantFiles(
        assistantChoices,
        config,
        process.cwd()
      );

      spinner.text = `Generated ${generatedFiles.length} assistant configuration files`;

      // Update .gitignore with AI assistant exclusion patterns
      spinner.text = 'Updating .gitignore...';
      await this.gitIgnoreManager.updateGitIgnore(process.cwd());

      // Set up meta directory and documentation
      spinner.text = 'Setting up project documentation...';
      await this.fileSystem.ensureDirectoryExists('_meta');
      
      // Create project task list if it doesn't exist
      const taskListPath = path.join(process.cwd(), '_meta', 'project-task-list.md');
      if (!(await this.fileSystem.fileExists(taskListPath))) {
        const taskListContent = this.generateInitialTaskList(config);
        await this.fileSystem.writeFile(taskListPath, taskListContent);
      }

      // Set up test directory and documentation
      await this.fileSystem.ensureDirectoryExists('test');
      const testDocPath = path.join(process.cwd(), 'test', 'test-documentation.md');
      if (!(await this.fileSystem.fileExists(testDocPath))) {
        const testDocContent = this.generateInitialTestDoc(config);
        await this.fileSystem.writeFile(testDocPath, testDocContent);
      }

      // Configure IDE-specific settings if IDE environment
      if (config.ideChoice) {
        if (config.ideChoice === 'vscode' && !options.skipVscode) {
          spinner.text = 'Configuring VS Code settings...';
          await this.vscodeService.updateSettings({
            'typescript.preferences.includePackageJsonAutoImports': 'auto',
            'editor.formatOnSave': true,
            'editor.codeActionsOnSave': {
              'source.fixAll.eslint': true
            }
          });
        }
      }

      spinner.succeed('Setup complete!');
    } catch (error) {
      spinner.fail('Setup failed');
      throw error;
    }
  }

  /**
   * Generate initial task list content
   */
  private generateInitialTaskList(config: ProjectConfig): string {
    return `# ${config.name} Project Task List

## Current Tasks

- [ ] **SETUP-TASK-001: Initial project setup** - 🟡 **IN PROGRESS** - Setting up metacoding development workflow and assistant configurations

## Task Status Legend

- 🟡 **IN PROGRESS** - Currently being worked on
- ✅ **COMPLETED** - Task finished and verified
- ❌ **BLOCKED** - Task cannot proceed due to dependency or issue
- ⏸️ **ON HOLD** - Task paused for specific reason
- 📋 **NOT STARTED** - Task identified but not yet begun

## Notes

This task list follows the 7-step development workflow. All tasks must be documented here before implementation begins.
`;
  }

  /**
   * Generate initial test documentation content
   */
  private generateInitialTestDoc(config: ProjectConfig): string {
    return `# ${config.name} Test Documentation

## Test Framework Configuration

**Framework**: ${config.testFramework || 'Not specified'}
**Test Command**: \`npm test\`

## Test Cases

### SETUP-TEST-001: Verify project setup
- **Status**: 📋 NOT STARTED
- **Description**: Verify that metacoding setup is working correctly
- **Expected**: All configuration files are present and valid
- **Test File**: \`test/setup.test.js\`

## Test Coverage Goals

- Unit Tests: 80%+ coverage for critical functionality
- Integration Tests: Key workflow paths
- End-to-end Tests: User scenarios

## Notes

All test cases must be documented here before test implementation begins, following the TDD approach of the 7-step workflow.
`;
  }

  /**
   * Display next steps to the user
   */
  private displayNextSteps(
    assistantChoices: AssistantType[], 
    environmentChoice: 'ide' | 'terminal',
    ideChoice?: 'vscode' | 'cursor' | 'intellij'
  ): void {
    console.log(chalk.cyan('Next steps:'));

    let step = 1;

    if (environmentChoice === 'ide' && ideChoice) {
      switch (ideChoice) {
        case 'vscode':
          console.log(chalk.dim(`${step++}.`), 'Restart VS Code to apply settings');
          break;
        case 'cursor':
          console.log(chalk.dim(`${step++}.`), 'Open your project in Cursor IDE');
          break;
        case 'intellij':
          console.log(chalk.dim(`${step++}.`), 'Open your project in IntelliJ IDEA');
          break;
      }
    }

    // Display assistant-specific instructions
    if (assistantChoices.includes('copilot') || assistantChoices.includes('all')) {
      console.log(chalk.dim(`${step++}.`), 'GitHub Copilot: Open Copilot Chat and check .github/copilot-instructions.md is loaded');
    }

    if (assistantChoices.includes('claude') || assistantChoices.includes('all')) {
      console.log(chalk.dim(`${step++}.`), 'Claude Code: Run `claude` in terminal, it will auto-load CLAUDE.md');
    }

    if (assistantChoices.includes('codex') || assistantChoices.includes('all')) {
      console.log(chalk.dim(`${step++}.`), 'Codex/OpenAI: Configure your agent to use AGENTS.md as system message');
    }

    if (assistantChoices.includes('gemini') || assistantChoices.includes('all')) {
      console.log(chalk.dim(`${step++}.`), 'Gemini Code Assist: GEMINI.md will be auto-discovered in VS Code/IntelliJ');
    }

    console.log(chalk.dim(`${step++}.`), chalk.bold('Test your setup by asking any assistant:'));
    console.log('     ', chalk.italic('"What is the development workflow for this project?"'));
    
    console.log(chalk.dim(`${step++}.`), 'Start coding with guided workflow support!');

    console.log('');
    console.log(
      chalk.cyan('Need help?'),
      'Visit https://github.com/anton-g-kulikov/metacoding'
    );
  }
}
