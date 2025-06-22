import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { InitOptions, ProjectConfig } from '../types';
import { TemplateManager } from '../services/template-manager';
import { FileSystemService } from '../services/filesystem';
import { VSCodeService } from '../services/vscode';
import { ProjectDetector } from '../services/project-detector';

/**
 * Handles the 'init' command for setting up metacoding in a project
 */
export class InitCommand {
  private templateManager: TemplateManager;
  private fileSystem: FileSystemService;
  private vscodeService: VSCodeService;
  private projectDetector: ProjectDetector;

  constructor() {
    this.templateManager = new TemplateManager();
    this.fileSystem = new FileSystemService();
    this.vscodeService = new VSCodeService();
    this.projectDetector = new ProjectDetector();
  }

  /**
   * Execute the init command
   */
  async execute(options: InitOptions): Promise<void> {
    console.log(chalk.cyan.bold('🚀 Welcome to metacoding Setup!\n'));

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
    await this.setupProject(config, options);

    console.log(chalk.green.bold('\n✅ metacoding setup complete!\n'));
    this.displayNextSteps();
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
    options: InitOptions
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

      // Configure VS Code settings (unless skipped)
      if (!options.skipVscode) {
        spinner.text = 'Configuring VS Code settings...';
        await this.vscodeService.updateSettings(template.vscodeSettings || {});
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
   * Display next steps to the user
   */
  private displayNextSteps(): void {
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.dim('1.'), 'Restart VS Code to apply settings');
    console.log(chalk.dim('2.'), 'Open GitHub Copilot Chat');
    console.log(
      chalk.dim('3.'),
      'Ask: "What are the coding standards for this project?"'
    );
    console.log(chalk.dim('4.'), 'Start coding with guided workflow support!');
    console.log('');
    console.log(
      chalk.cyan('Need help?'),
      'Visit https://github.com/anton-g-kulikov/metacoding'
    );
  }
}
