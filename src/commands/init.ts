import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { InitOptions, ProjectConfig } from '../types';
import { TemplateManager } from '../services/template-manager';
import { FileSystemService } from '../services/filesystem';
import { VSCodeService } from '../services/vscode';
import { CursorService } from '../services/cursor';
import { ProjectDetector } from '../services/project-detector';
import { GitIgnoreManager } from '../services/gitignore-manager';

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
  }

  /**
   * Execute the init command
   */
  async execute(options: InitOptions): Promise<void> {
    console.log(chalk.cyan.bold('🚀 Welcome to metacoding Setup!\n'));

    // Validate IDE options
    const ideChoice = await this.validateAndGetIdeChoice(options);

    // Detect current project context
    const projectInfo = await this.projectDetector.detectProject();

    // Check if metacoding is already set up
    if ((await this.fileSystem.isMetaCodingSetup()) && !options.force) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message:
            'metacoding is already set up in this directory. Do you want to reconfigure it?',
          default: false,
        },
      ]);

      if (!proceed) {
        console.log(chalk.yellow('Setup cancelled.'));
        return;
      }
    }

    // Get project configuration
    const config = await this.getProjectConfiguration(options, projectInfo);

    // Set up the project
    await this.setupProject(config, options, ideChoice);

    console.log(chalk.green.bold('\n✅ metacoding setup complete!\n'));
    this.displayNextSteps(ideChoice);
  }

  /**
   * Get project configuration from user input
   */
  private async getProjectConfiguration(
    options: InitOptions,
    projectInfo: any
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
      // Create .github directory structure
      await this.fileSystem.ensureDirectoryExists('.github');
      await this.fileSystem.ensureDirectoryExists('.github/instructions');

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
   * Display next steps to the user
   */
  private displayNextSteps(ideChoice: 'vscode' | 'cursor'): void {
    console.log(chalk.cyan('Next steps:'));

    if (ideChoice === 'vscode') {
      console.log(chalk.dim('1.'), 'Restart VS Code to apply settings');
      console.log(chalk.dim('2.'), 'Open GitHub Copilot Chat');
      console.log(
        chalk.dim('3.'),
        'Ask: "What is the development workflow for this project?"'
      );
      console.log(
        chalk.dim('4.'),
        'Start coding with guided workflow support!'
      );
    } else if (ideChoice === 'cursor') {
      console.log(chalk.dim('1.'), 'Open your project in Cursor IDE');
      console.log(
        chalk.dim('2.'),
        'Check that .cursor/rules/workflow.mdc is loaded'
      );
      console.log(
        chalk.dim('3.'),
        'Ask Cursor: "What is the development workflow for this project?"'
      );
      console.log(
        chalk.dim('4.'),
        'Start coding with guided workflow support!'
      );
    }

    console.log('');
    console.log(
      chalk.cyan('Need help?'),
      'Visit https://github.com/anton-g-kulikov/metacoding'
    );
  }
}
