import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import YAML from 'yaml';
import { AgentVendor, AgentVendorOption, UpdateOptions } from '../types';
import { BackupService } from '../services/backup';
import { ConflictResolutionService } from '../services/conflict-resolution';
import { GitIgnoreManager } from '../services/gitignore-manager';
import { ProjectDetector } from '../services/project-detector';
import {
  DEFAULT_PROJECT_DESCRIPTION,
  PROJECT_CONTEXT_FILE,
  SkillManager,
} from '../services/skill-manager';

/**
 * Handles syncing the installed skills with the packaged version.
 */
export class UpdateCommand {
  private readonly skillManager: SkillManager;
  private readonly backupService: BackupService;
  private readonly conflictService: ConflictResolutionService;
  private readonly projectDetector: ProjectDetector;
  private readonly gitIgnoreManager: GitIgnoreManager;

  constructor() {
    this.skillManager = new SkillManager();
    this.backupService = new BackupService();
    this.conflictService = new ConflictResolutionService();
    this.projectDetector = new ProjectDetector();
    this.gitIgnoreManager = new GitIgnoreManager();
  }

  async execute(options: UpdateOptions): Promise<void> {
    if (options.dryRun) {
      await this.validateSetup(options);
      return;
    }

    const installedVendors = await this.skillManager.getInstalledVendors();

    if (installedVendors.length === 0) {
      throw new Error(
        'No metacoding installation found. Run "metacoding init" first.'
      );
    }

    const targetVendors = this.getTargetVendors(installedVendors, options.vendor);

    console.log(chalk.cyan('Syncing metacoding skills...\n'));

    const projectInfo = await this.projectDetector.detectProject();

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
      // Keep what the user entered at init; detect only what the install lacks.
      // `??` on purpose: an answer may be empty, such as a tech stack with no entries.
      const installed = await this.skillManager.readInstalledProjectContext(vendor);
      const projectType =
        options.template || installed.projectType || projectInfo.type || 'general';
      const projectConfig = {
        name: installed.name ?? projectInfo.name,
        description: installed.description ?? DEFAULT_PROJECT_DESCRIPTION,
        techStack: installed.techStack ?? projectInfo.techStack,
        projectType,
        testFramework: this.skillManager.getDefaultTestFramework(projectType),
        buildTool: this.skillManager.getDefaultBuildTool(projectType),
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

      await this.cleanUpRetiredFiles(vendor, options);

      if (vendor === 'claude-code') {
        await this.migrateLegacyClaudeInstall(options);
      }
    }

    // Older installs ignored a single skill folder; cover the ones added since.
    await this.gitIgnoreManager.addMissingPatterns(process.cwd());

    await this.backupService.cleanupOldBackups();

    console.log(
      chalk.green.bold(
        `\nmetacoding skills are up to date (${filesUpdated} files synced).\n`
      )
    );
  }

  /**
   * Remove the 2.0.x Claude Code subagent layout once the skill is in place.
   * The legacy files are only deleted when this run backed them up.
   */
  private async migrateLegacyClaudeInstall(options: UpdateOptions): Promise<void> {
    if (!(await this.skillManager.hasLegacyClaudeInstall())) {
      return;
    }

    if (options.backup === false) {
      console.log(
        chalk.yellow(
          'Legacy Claude Code subagent files were kept because backups are disabled. ' +
            'Remove .claude/agents/metacoding-workflow.md and .claude/metacoding-workflow/ ' +
            'so Claude Code uses the skill instead of the old subagent.'
        )
      );
      return;
    }

    const removed = await this.skillManager.removeLegacyClaudeInstall();
    console.log(
      chalk.green(
        `Migrated Claude Code from the legacy subagent layout to a skill (removed ${removed.join(', ')}).`
      )
    );
  }

  /**
   * Remove files an earlier version installed and this one no longer ships.
   * They are only deleted when this run backed them up.
   */
  private async cleanUpRetiredFiles(
    vendor: AgentVendor,
    options: UpdateOptions
  ): Promise<void> {
    const retiredFiles = await this.skillManager.findRetiredFiles(vendor);
    if (retiredFiles.length === 0) {
      return;
    }

    if (options.backup === false) {
      console.log(
        chalk.yellow(
          'Files that metacoding no longer ships were kept because backups are disabled. ' +
            `Remove ${retiredFiles.join(', ')} yourself.`
        )
      );
      return;
    }

    const removed = await this.skillManager.removeRetiredFiles(vendor);
    console.log(
      chalk.green(
        `Removed files that metacoding no longer ships (${removed.join(', ')}).`
      )
    );
  }

  private async validateSetup(options: UpdateOptions): Promise<void> {
    console.log(chalk.cyan('Validating metacoding skills...\n'));

    const installedVendors = await this.skillManager.getInstalledVendors();
    if (installedVendors.length === 0) {
      throw new Error(
        'Validation failed: no vendor-specific metacoding installation was found.'
      );
    }

    const targetVendors = this.getTargetVendors(installedVendors, options.vendor);

    for (const vendor of targetVendors) {
      if (
        vendor === 'claude-code' &&
        (await this.skillManager.needsClaudeMigration())
      ) {
        throw new Error(
          'Validation failed: the Claude Code install uses the legacy subagent layout. ' +
            'Run "metacoding update" to migrate it to a skill.'
        );
      }

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
        for (const directory of this.skillManager.getSkillDirectories(vendor)) {
          const yamlPath = path.join(directory, 'agents/openai.yaml');
          const yamlContent = await fs.readFile(yamlPath, 'utf8');
          let parsed;
          try {
            parsed = YAML.parse(yamlContent);
          } catch {
            throw new Error(`Validation failed: ${yamlPath} is not valid YAML.`);
          }

          if (!parsed?.interface?.display_name || !parsed?.interface?.default_prompt) {
            throw new Error(
              `Validation failed: ${yamlPath} is missing required interface fields.`
            );
          }
        }
      }
    }

    if (options.strict) {
      const missingPatterns = await this.gitIgnoreManager.getMissingPatterns(
        process.cwd()
      );
      if (missingPatterns.length > 0) {
        throw new Error(
          `Validation failed: .gitignore is missing metacoding exclusions: ${missingPatterns.join(', ')}. ` +
            'Add these lines to .gitignore.'
        );
      }
    }

    console.log(chalk.green('Validation passed.'));
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
        `No metacoding installation was found for vendor "${normalizedVendor}".`
      );
    }

    return [normalizedVendor];
  }

  private getRequiredFilesForVendor(vendor: AgentVendor): string[] {
    const workflowDir = this.skillManager.getInstallDirectory(vendor);
    const companionDirs = this.skillManager.getSkillDirectories(vendor).slice(1);
    // Codex needs its UI metadata next to every skill.
    const skillFiles = ['SKILL.md', ...(vendor === 'codex' ? ['agents/openai.yaml'] : [])];
    const workflowFiles = [
      ...skillFiles,
      'references/workflow-rules.md',
      'references/platform-adaptation.md',
      PROJECT_CONTEXT_FILE,
      'assets/templates/task-entry.md',
    ];

    return [
      ...workflowFiles.map((file) => path.join(workflowDir, file)),
      ...companionDirs.flatMap((directory) =>
        skillFiles.map((file) => path.join(directory, file))
      ),
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
