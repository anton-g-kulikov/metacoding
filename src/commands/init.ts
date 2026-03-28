import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import {
  AgentVendor,
  AgentVendorOption,
  InitOptions,
  ProjectConfig,
} from '../types';
import { FileSystemService } from '../services/filesystem';
import { GitIgnoreManager } from '../services/gitignore-manager';
import { ProjectDetector } from '../services/project-detector';
import { SkillManager } from '../services/skill-manager';

/**
 * Handles skill installation for the current project.
 */
export class InitCommand {
  private readonly skillManager: SkillManager;
  private readonly fileSystem: FileSystemService;
  private readonly projectDetector: ProjectDetector;
  private readonly gitIgnoreManager: GitIgnoreManager;

  constructor() {
    this.skillManager = new SkillManager();
    this.fileSystem = new FileSystemService();
    this.projectDetector = new ProjectDetector();
    this.gitIgnoreManager = new GitIgnoreManager();
  }

  async execute(options: InitOptions): Promise<void> {
    console.log(chalk.cyan.bold('metacoding skill setup\n'));

    const projectInfo = await this.projectDetector.detectProject();
    const vendorChoice = await this.getVendorChoice(options);
    const vendors = this.expandVendorChoice(vendorChoice);

    if ((await this.fileSystem.isMetaCodingSetup()) && !options.force) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message:
            'The metacoding workflow skill is already installed here. Reinstall it?',
          default: false,
        },
      ]);

      if (!proceed) {
        console.log(chalk.yellow('Setup cancelled.'));
        return;
      }
    }

    const primaryVendor = vendors[0] ?? 'codex';
    const baseConfig = await this.getProjectConfiguration(
      options,
      projectInfo,
      primaryVendor
    );
    await this.setupProject(vendors.map((vendor) => ({ ...baseConfig, vendor })));

    console.log(chalk.green.bold('\nmetacoding skill installed.\n'));
    this.displayNextSteps(vendorChoice);
  }

  private async getProjectConfiguration(
    options: InitOptions,
    projectInfo: { name: string; type: string; techStack: string[] },
    vendor: AgentVendor
  ): Promise<ProjectConfig> {
    if (options.force && process.env.NODE_ENV === 'test') {
      return {
        name: projectInfo.name || 'test-project',
        description: 'A project using the metacoding workflow skill',
        techStack: projectInfo.techStack.length
          ? projectInfo.techStack
          : ['TypeScript'],
        projectType: options.template || projectInfo.type || 'general',
        testFramework: this.getDefaultTestFramework(
          options.template || projectInfo.type || 'general'
        ),
        buildTool: this.getDefaultBuildTool(
          options.template || projectInfo.type || 'general'
        ),
        vendor,
      };
    }

    const detectedType = options.template || projectInfo.type || 'general';
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: projectInfo.name || 'my-project',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A project using the metacoding workflow skill',
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Project type:',
        choices: [
          { name: 'General', value: 'general' },
          { name: 'TypeScript', value: 'typescript' },
          { name: 'React', value: 'react' },
          { name: 'Node.js', value: 'node' },
          { name: 'JavaScript', value: 'javascript' },
          { name: 'Python', value: 'python' },
        ],
        default: detectedType,
      },
      {
        type: 'input',
        name: 'techStack',
        message: 'Tech stack (comma-separated):',
        default: projectInfo.techStack.join(', ') || 'TypeScript',
        filter: (input: string) =>
          input
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
      },
    ]);

    return {
      name: answers.name,
      description: answers.description,
      techStack: answers.techStack,
      projectType: answers.projectType,
      testFramework: this.getDefaultTestFramework(answers.projectType),
      buildTool: this.getDefaultBuildTool(answers.projectType),
      vendor,
    };
  }

  private async setupProject(configs: ProjectConfig[]): Promise<void> {
    const spinner = ora('Installing metacoding workflow skill...').start();

    try {
      let installedFiles = 0;

      for (const config of configs) {
        const files = await this.skillManager.installSkill(config);
        installedFiles += files.length;
      }

      spinner.text = `Installed ${installedFiles} skill files`;

      await this.gitIgnoreManager.updateGitIgnore(process.cwd());

      spinner.succeed('Workflow skill installed successfully');
    } catch (error) {
      spinner.fail('Failed to install metacoding skill');
      throw error;
    }
  }

  private getDefaultTestFramework(projectType: string): string {
    switch (projectType) {
      case 'react':
        return 'Jest + React Testing Library';
      case 'python':
        return 'Pytest';
      default:
        return 'Use the repository default';
    }
  }

  private getDefaultBuildTool(projectType: string): string {
    switch (projectType) {
      case 'react':
        return 'Vite';
      case 'node':
        return 'Node.js toolchain';
      case 'python':
        return 'Poetry or the repository default';
      default:
        return 'Use the repository default';
    }
  }

  private displayNextSteps(vendor: AgentVendorOption): void {
    console.log(chalk.cyan('Next steps:'));
    console.log(
      chalk.dim('1.'),
      'Use the installed vendor-specific metacoding skill entrypoint in your repo.'
    );
    this.displayNextStepsForVendor(vendor);
    console.log(chalk.dim('2.'), 'Ask your agent to use the metacoding workflow for the next task.');
    console.log(
      chalk.dim('3.'),
      'Let the skill drive scope capture, test intent, implementation, verification, and close-out.'
    );
    console.log('');
  }

  private async getVendorChoice(options: InitOptions): Promise<AgentVendorOption> {
    if (options.vendor) {
      return this.normalizeVendor(options.vendor);
    }

    if (options.force && process.env.NODE_ENV === 'test') {
      return 'codex';
    }

    const { vendor } = await inquirer.prompt([
      {
        type: 'list',
        name: 'vendor',
        message: 'Which coding agent do you want to set up?',
        choices: [
          { name: 'Codex', value: 'codex' },
          { name: 'Claude Code', value: 'claude-code' },
          { name: 'Antigravity', value: 'antigravity' },
          { name: 'All supported agents', value: 'all' },
        ],
        default: 'codex',
      },
    ]);

    return this.normalizeVendor(vendor);
  }

  private displayNextStepsForVendor(vendor: AgentVendorOption): void {
    console.log(chalk.cyan('Installed entrypoint:'));
    if (vendor === 'all') {
      console.log(chalk.dim('-'), '.codex/skills/metacoding-workflow/SKILL.md');
      console.log(chalk.dim('-'), '.claude/agents/metacoding-workflow.md');
      console.log(chalk.dim('-'), '.agents/skills/metacoding-workflow/SKILL.md');
      return;
    }

    if (vendor === 'codex') {
      console.log(chalk.dim('-'), '.codex/skills/metacoding-workflow/SKILL.md');
    } else if (vendor === 'claude-code') {
      console.log(chalk.dim('-'), '.claude/agents/metacoding-workflow.md');
    } else {
      console.log(chalk.dim('-'), '.agents/skills/metacoding-workflow/SKILL.md');
    }
  }

  private expandVendorChoice(vendor: AgentVendorOption): AgentVendor[] {
    if (vendor === 'all') {
      return ['codex', 'claude-code', 'antigravity'];
    }

    return [vendor];
  }

  private normalizeVendor(vendor: string): AgentVendorOption {
    if (
      vendor === 'codex' ||
      vendor === 'claude-code' ||
      vendor === 'antigravity' ||
      vendor === 'all'
    ) {
      return vendor;
    }

    throw new Error(
      `Unsupported vendor "${vendor}". Use codex, claude-code, antigravity, or all.`
    );
  }
}
