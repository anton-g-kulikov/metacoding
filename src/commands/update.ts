import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import YAML from 'yaml';
import { AgentVendor, AgentVendorOption, UpdateOptions } from '../types';
import { BackupService } from '../services/backup';
import { ConflictResolutionService } from '../services/conflict-resolution';
import { ProjectDetector } from '../services/project-detector';
import { SkillManager } from '../services/skill-manager';

/**
 * Handles syncing an installed workflow skill with the packaged version.
 */
export class UpdateCommand {
  private readonly skillManager: SkillManager;
  private readonly backupService: BackupService;
  private readonly conflictService: ConflictResolutionService;
  private readonly projectDetector: ProjectDetector;

  constructor() {
    this.skillManager = new SkillManager();
    this.backupService = new BackupService();
    this.conflictService = new ConflictResolutionService();
    this.projectDetector = new ProjectDetector();
  }

  async execute(options: UpdateOptions): Promise<void> {
    if (options.dryRun) {
      await this.validateSetup(options);
      return;
    }

    const installedVendors = await this.skillManager.getInstalledVendors();

    if (installedVendors.length === 0) {
      throw new Error(
        'No metacoding workflow skill installation found. Run "metacoding init" first.'
      );
    }

    const targetVendors = this.getTargetVendors(installedVendors, options.vendor);

    console.log(chalk.cyan('Syncing metacoding workflow skill...\n'));

    const projectInfo = await this.projectDetector.detectProject();
    const projectType = options.template || projectInfo.type || 'general';

    if (options.backup !== false) {
      const backupSpinner = ora('Creating backup...').start();
      const backupTargets = targetVendors.flatMap((vendor) =>
        this.skillManager.getBackupTargets(vendor)
      );
      const backup = await this.backupService.createBackup(backupTargets);
      backupSpinner.succeed(
        backup.filesBackedUp.length > 0
          ? `Backup created at ${backup.backupPath}`
          : 'No existing installation to back up'
      );
    }

    let filesUpdated = 0;

    for (const vendor of targetVendors) {
      const projectConfig = {
        name: projectInfo.name,
        description: 'A project using the metacoding workflow skill',
        techStack: projectInfo.techStack,
        projectType,
        testFramework: this.getDefaultTestFramework(projectType),
        buildTool: this.getDefaultBuildTool(projectType),
        vendor,
      };

      const packagedFiles = await this.skillManager.generateInstallationFiles(
        projectConfig
      );
      const existingFiles = await this.skillManager.getInstalledFiles(vendor);

      const conflictSpinner = ora(
        `Checking for local ${vendor} skill edits...`
      ).start();
      const conflicts = await this.conflictService.detectConflicts(
        packagedFiles,
        existingFiles
      );

      if (conflicts.length === 0) {
        conflictSpinner.succeed(`No local ${vendor} skill conflicts detected`);
      } else {
        conflictSpinner.warn(
          `Found ${conflicts.length} locally edited ${vendor} skill files`
        );

        if (options.force) {
          for (const conflict of conflicts) {
            await fs.writeFile(conflict.filePath, conflict.templateContent, 'utf8');
          }
        } else {
          const resolutions =
            await this.conflictService.getConflictResolution(conflicts);
          await this.conflictService.applyResolutions(conflicts, resolutions);
        }
      }

      const writeSpinner = ora(`Syncing packaged ${vendor} skill files...`).start();
      let vendorFilesUpdated = 0;

      for (const file of packagedFiles) {
        const conflicted = conflicts.some((conflict) => conflict.filePath === file.path);
        if (!conflicted || options.force) {
          await fs.ensureDir(path.dirname(file.path));
          await fs.writeFile(file.path, file.content, 'utf8');
          filesUpdated++;
          vendorFilesUpdated++;
        }
      }

      writeSpinner.succeed(`Updated ${vendor} skill files (${vendorFilesUpdated} files)`);
    }

    await this.backupService.cleanupOldBackups();

    console.log(
      chalk.green.bold(
        `\nmetacoding workflow skill is up to date (${filesUpdated} files synced).\n`
      )
    );
  }

  private async validateSetup(options: UpdateOptions): Promise<void> {
    console.log(chalk.cyan('Validating metacoding workflow skill...\n'));

    const installedVendors = await this.skillManager.getInstalledVendors();
    if (installedVendors.length === 0) {
      throw new Error(
        'Validation failed: no vendor-specific metacoding installation was found.'
      );
    }

    const targetVendors = this.getTargetVendors(installedVendors, options.vendor);

    for (const vendor of targetVendors) {
      const requiredFiles = this.getRequiredFilesForVendor(vendor);
      let missingFiles = 0;

      for (const file of requiredFiles) {
        if (!(await fs.pathExists(file))) {
          missingFiles++;
          console.log(chalk.red(`Missing: ${file}`));
        }
      }

      if (missingFiles > 0) {
        throw new Error(
          `Validation failed: ${missingFiles} required ${vendor} skill files are missing.`
        );
      }

      if (vendor === 'codex') {
        const yamlPath = '.codex/skills/metacoding-workflow/agents/openai.yaml';
        const yamlContent = await fs.readFile(yamlPath, 'utf8');
        const parsed = YAML.parse(yamlContent);

        if (!parsed?.interface?.display_name || !parsed?.interface?.default_prompt) {
          throw new Error(
            'Validation failed: agents/openai.yaml is missing required interface fields.'
          );
        }
      }
    }

    if (options.strict) {
      const gitignorePath = '.gitignore';
      if (await fs.pathExists(gitignorePath)) {
        const content = await fs.readFile(gitignorePath, 'utf8');
        if (!content.includes('# metacoding: AI coding assistant exclusions')) {
          throw new Error(
            'Validation failed: .gitignore is missing the metacoding skill exclusion.'
          );
        }
      }
    }

    console.log(chalk.green('Validation passed.'));
  }

  private getDefaultTestFramework(projectType: string): string {
    return projectType === 'python'
      ? 'Pytest'
      : projectType === 'react'
        ? 'Jest + React Testing Library'
        : 'Use the repository default';
  }

  private getDefaultBuildTool(projectType: string): string {
    return projectType === 'react'
      ? 'Vite'
      : projectType === 'python'
        ? 'Poetry or the repository default'
        : 'Use the repository default';
  }

  private getTargetVendors(
    installedVendors: AgentVendor[],
    selectedVendor?: AgentVendorOption
  ): AgentVendor[] {
    if (!selectedVendor) {
      return installedVendors;
    }

    const normalizedVendor = this.normalizeVendor(selectedVendor);

    if (normalizedVendor === 'all') {
      return installedVendors;
    }

    if (!installedVendors.includes(normalizedVendor)) {
      throw new Error(
        `No installed metacoding skill was found for vendor "${normalizedVendor}".`
      );
    }

    return [normalizedVendor];
  }

  private getRequiredFilesForVendor(vendor: AgentVendor): string[] {
    if (vendor === 'codex') {
      return [
        '.codex/skills/metacoding-workflow/SKILL.md',
        '.codex/skills/metacoding-workflow/agents/openai.yaml',
        '.codex/skills/metacoding-workflow/references/workflow-rules.md',
        '.codex/skills/metacoding-workflow/references/platform-adaptation.md',
        '.codex/skills/metacoding-workflow/references/project-context.md',
        '.codex/skills/metacoding-workflow/assets/templates/task-entry.md',
      ];
    }

    if (vendor === 'claude-code') {
      return [
        '.claude/agents/metacoding-workflow.md',
        '.claude/metacoding-workflow/SKILL.md',
        '.claude/metacoding-workflow/references/workflow-rules.md',
        '.claude/metacoding-workflow/references/platform-adaptation.md',
        '.claude/metacoding-workflow/references/project-context.md',
        '.claude/metacoding-workflow/assets/templates/task-entry.md',
      ];
    }

    return [
      '.agents/skills/metacoding-workflow/SKILL.md',
      '.agents/skills/metacoding-workflow/references/workflow-rules.md',
      '.agents/skills/metacoding-workflow/references/platform-adaptation.md',
      '.agents/skills/metacoding-workflow/references/project-context.md',
      '.agents/skills/metacoding-workflow/assets/templates/task-entry.md',
    ];
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
