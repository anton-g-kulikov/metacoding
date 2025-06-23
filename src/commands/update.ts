import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UpdateOptions } from '../types';
import { TemplateManager } from '../services/template-manager';
import { BackupService } from '../services/backup';
import { ConflictResolutionService } from '../services/conflict-resolution';
import { VSCodeService } from '../services/vscode';
import { ProjectDetector } from '../services/project-detector';

/**
 * Handles the 'update' command for updating metacoding setup
 */
export class UpdateCommand {
  private templateManager: TemplateManager;
  private backupService: BackupService;
  private conflictService: ConflictResolutionService;
  private vscodeService: VSCodeService;
  private projectDetector: ProjectDetector;

  constructor() {
    this.templateManager = new TemplateManager();
    this.backupService = new BackupService();
    this.conflictService = new ConflictResolutionService();
    this.vscodeService = new VSCodeService();
    this.projectDetector = new ProjectDetector();
  }

  async execute(options: UpdateOptions): Promise<void> {
    // Handle dry-run mode (validation only)
    if (options.dryRun) {
      return this.validateSetup(options);
    }

    console.log(chalk.cyan('🔄 Updating metacoding setup...\n'));

    try {
      // Step 1: Detect current template type
      const spinner = ora('Detecting current template...').start();
      const currentTemplate = await this.detectCurrentTemplate(
        options.template
      );
      spinner.succeed(`Current template: ${currentTemplate}`);

      // Step 2: Create backup (unless disabled)
      if (options.backup !== false) {
        const backupSpinner = ora('Creating backup...').start();
        const backupResult = await this.backupService.createBackup();
        backupSpinner.succeed(`Backup created at: ${backupResult.backupPath}`);
      }

      // Step 3: Get template files to update
      const templateSpinner = ora('Loading template files...').start();
      const projectConfig = await this.getProjectConfig(currentTemplate);
      const template = await this.templateManager.getTemplate(
        currentTemplate,
        projectConfig
      );
      const templateFiles = await this.templateManager.processTemplate(
        template,
        projectConfig
      );
      templateSpinner.succeed(`Loaded ${templateFiles.length} template files`);

      // Step 4: Detect existing files
      const existingFiles = await this.getExistingMetacodingFiles();

      // Step 5: Detect conflicts
      const conflictSpinner = ora('Checking for conflicts...').start();
      const conflicts = await this.conflictService.detectConflicts(
        templateFiles.map((f) => ({ path: f.path, content: f.content })),
        existingFiles
      );

      if (conflicts.length > 0) {
        conflictSpinner.warn(`Found ${conflicts.length} conflicts`);

        // Step 6: Resolve conflicts
        if (!options.force) {
          const resolutions =
            await this.conflictService.getConflictResolution(conflicts);
          const { preservedFiles } =
            await this.conflictService.applyResolutions(conflicts, resolutions);

          if (preservedFiles.length > 0) {
            console.log(
              chalk.yellow(
                `💾 Preserved ${preservedFiles.length} user files with user. prefix`
              )
            );
          }
        } else {
          // Force mode: replace all conflicts
          for (const conflict of conflicts) {
            await fs.writeFile(conflict.filePath, conflict.templateContent);
          }
          console.log(
            chalk.yellow(
              `⚠️  Force mode: Replaced ${conflicts.length} conflicted files`
            )
          );
        }
      } else {
        conflictSpinner.succeed('No conflicts detected');
      }

      // Step 7: Update non-conflicted files
      const updateSpinner = ora('Updating template files...').start();
      let filesUpdated = 0;

      for (const file of templateFiles) {
        const isConflicted = conflicts.some((c) => c.filePath === file.path);

        if (!isConflicted) {
          await fs.ensureDir(path.dirname(file.path));
          await fs.writeFile(file.path, file.content);
          filesUpdated++;
        }
      }

      updateSpinner.succeed(`Updated ${filesUpdated} files`);

      // Step 8: Update VS Code settings
      const vscodeSpinner = ora('Updating VS Code settings...').start();
      await this.vscodeService.updateSettings(template.vscodeSettings || {});
      vscodeSpinner.succeed('VS Code settings updated');

      // Step 9: Cleanup old backups
      await this.backupService.cleanupOldBackups();

      // Display success message
      console.log(chalk.green.bold('\n✅ metacoding update complete!\n'));

      this.displayUpdateSummary({
        template: currentTemplate,
        filesUpdated,
        conflictsResolved: conflicts.length,
        backupCreated: options.backup !== false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(chalk.red('\n❌ Update failed:'), errorMessage);

      // Don't call process.exit in tests
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Detect current template type from existing files
   */
  private async detectCurrentTemplate(
    specifiedTemplate?: string
  ): Promise<string> {
    if (specifiedTemplate) {
      return specifiedTemplate;
    }

    // Check if .github directory exists
    if (!(await fs.pathExists('.github'))) {
      throw new Error(
        'No metacoding setup found. Run "metacoding init" first.'
      );
    }

    // Use project detector to determine template type
    const projectInfo = await this.projectDetector.detectProject();
    return projectInfo.projectType || 'general';
  }

  /**
   * Get project configuration for template processing
   */
  private async getProjectConfig(templateType: string): Promise<any> {
    const projectInfo = await this.projectDetector.detectProject();

    return {
      name: projectInfo.name || path.basename(process.cwd()),
      description: projectInfo.description || 'A guided development project',
      techStack: projectInfo.techStack || [],
      projectType: templateType,
      testFramework: projectInfo.testFramework,
      buildTool: projectInfo.buildTool,
    };
  }

  /**
   * Get list of existing metacoding files
   */
  private async getExistingMetacodingFiles(): Promise<string[]> {
    const files: string[] = [];
    const githubDir = '.github';

    if (!(await fs.pathExists(githubDir))) {
      return files;
    }

    // Check main copilot instructions
    const mainFile = path.join(githubDir, 'copilot-instructions.md');
    if (await fs.pathExists(mainFile)) {
      files.push(mainFile);
    }

    // Check instructions directory
    const instructionsDir = path.join(githubDir, 'instructions');
    if (await fs.pathExists(instructionsDir)) {
      const instructionFiles = await fs.readdir(instructionsDir);
      for (const file of instructionFiles) {
        files.push(path.join(instructionsDir, file));
      }
    }

    return files;
  }

  /**
   * Validate current metacoding setup without making changes
   */
  private async validateSetup(options: UpdateOptions): Promise<void> {
    console.log(chalk.cyan('🔍 Validating metacoding setup...\n'));

    const validationResults: {
      check: string;
      status: 'pass' | 'warn' | 'fail';
      message?: string;
    }[] = [];
    let hasErrors = false;
    let hasWarnings = false;

    try {
      // Step 1: Validate file structure
      const fileSpinner = ora('Checking file structure...').start();

      const requiredFiles = [
        '.github/copilot-instructions.md',
        '.github/instructions/code-review.instructions.md',
        '.github/instructions/docs-update.instructions.md',
        '.github/instructions/release.instructions.md',
        '.github/instructions/test-runner.instructions.md',
      ];

      let missingFiles = 0;
      for (const file of requiredFiles) {
        if (!(await fs.pathExists(file))) {
          validationResults.push({
            check: `File ${file}`,
            status: 'fail',
            message: 'Missing required file',
          });
          missingFiles++;
          hasErrors = true;
        }
      }

      if (missingFiles === 0) {
        fileSpinner.succeed('File structure complete');
        validationResults.push({
          check: 'File structure',
          status: 'pass',
        });
      } else {
        fileSpinner.fail(`Missing ${missingFiles} required files`);
      }

      // Step 2: Validate VS Code configuration
      const vscodeSpinner = ora('Checking VS Code configuration...').start();

      try {
        const vscodeSettingsPath = '.vscode/settings.json';
        if (await fs.pathExists(vscodeSettingsPath)) {
          const settings = await fs.readJson(vscodeSettingsPath);
          const requiredSettings = ['github.copilot.chat.promptFiles'];

          let missingSettings = 0;
          for (const setting of requiredSettings) {
            if (!settings[setting]) {
              validationResults.push({
                check: `VS Code setting '${setting}'`,
                status: options.strict ? 'fail' : 'warn',
                message: 'Not configured',
              });
              missingSettings++;
              if (options.strict) {
                hasErrors = true;
              } else {
                hasWarnings = true;
              }
            }
          }

          if (missingSettings === 0) {
            vscodeSpinner.succeed('VS Code configuration valid');
            validationResults.push({
              check: 'VS Code configuration',
              status: 'pass',
            });
          } else if (options.strict) {
            vscodeSpinner.fail(`Missing ${missingSettings} required settings`);
          } else {
            vscodeSpinner.warn(
              `Missing ${missingSettings} recommended settings`
            );
          }
        } else {
          vscodeSpinner.warn('VS Code settings file not found');
          validationResults.push({
            check: 'VS Code settings file',
            status: 'warn',
            message: 'File not found',
          });
          hasWarnings = true;
        }
      } catch {
        vscodeSpinner.fail('Error reading VS Code settings');
        validationResults.push({
          check: 'VS Code configuration',
          status: 'fail',
          message: 'Error reading settings file',
        });
        hasErrors = true;
      }

      // Step 3: Validate Git repository
      const gitSpinner = ora('Checking Git repository...').start();

      if (await fs.pathExists('.git')) {
        gitSpinner.succeed('Git repository configured');
        validationResults.push({
          check: 'Git repository',
          status: 'pass',
        });
      } else {
        const message = 'No Git repository found';
        if (options.strict) {
          gitSpinner.fail(message);
          validationResults.push({
            check: 'Git repository',
            status: 'fail',
            message,
          });
          hasErrors = true;
        } else {
          gitSpinner.warn(message);
          validationResults.push({
            check: 'Git repository',
            status: 'warn',
            message,
          });
          hasWarnings = true;
        }
      }

      // Step 4: Validate template integrity
      const templateSpinner = ora('Checking template integrity...').start();

      try {
        // Just verify we can detect the template
        await this.detectCurrentTemplate(options.template);

        // Check for placeholder text in main copilot instructions
        if (await fs.pathExists('.github/copilot-instructions.md')) {
          const content = await fs.readFile(
            '.github/copilot-instructions.md',
            'utf-8'
          );
          const hasPlaceholders =
            content.includes('{{') && content.includes('}}');

          if (hasPlaceholders) {
            templateSpinner.fail('Template variables not substituted');
            validationResults.push({
              check: 'Template integrity',
              status: 'fail',
              message: 'Unprocessed template variables found',
            });
            hasErrors = true;
          } else {
            templateSpinner.succeed('Template integrity verified');
            validationResults.push({
              check: 'Template integrity',
              status: 'pass',
            });
          }
        } else {
          templateSpinner.warn(
            'Cannot verify template integrity - main file missing'
          );
          validationResults.push({
            check: 'Template integrity',
            status: 'warn',
            message: 'Main instruction file missing',
          });
          hasWarnings = true;
        }
      } catch {
        templateSpinner.fail('Error checking template integrity');
        validationResults.push({
          check: 'Template integrity',
          status: 'fail',
          message: 'Error during template validation',
        });
        hasErrors = true;
      }

      // Display results
      console.log('');
      for (const result of validationResults) {
        const icon =
          result.status === 'pass'
            ? '✅'
            : result.status === 'warn'
              ? '⚠️'
              : '❌';
        const message = result.message ? ` - ${result.message}` : '';
        console.log(`${icon} ${result.check}${message}`);
      }

      // Summary
      console.log('');
      const totalChecks = validationResults.length;
      const passedChecks = validationResults.filter(
        (r) => r.status === 'pass'
      ).length;

      if (hasErrors) {
        console.log(chalk.red.bold('❌ Validation failed with errors\n'));

        console.log(chalk.cyan('Suggestions:'));
        console.log("- Run 'metacoding update' to restore missing files");
        console.log('- Check VS Code settings configuration');
        console.log("- Ensure you're in a Git repository");

        console.log(
          chalk.dim(`\nSummary: ${passedChecks}/${totalChecks} checks passed`)
        );

        // Don't call process.exit in tests
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        } else {
          throw new Error('Validation failed');
        }
      } else if (hasWarnings && options.strict) {
        console.log(
          chalk.yellow.bold('⚠️ Validation completed with warnings\n')
        );

        console.log(chalk.cyan('Suggestions:'));
        console.log('- Configure recommended VS Code settings');
        console.log('- Consider initializing a Git repository');

        console.log(
          chalk.dim(`\nSummary: ${passedChecks}/${totalChecks} checks passed`)
        );

        // Don't call process.exit in tests
        if (process.env.NODE_ENV !== 'test') {
          process.exit(2);
        } else {
          throw new Error('Validation completed with warnings');
        }
      } else {
        console.log(
          chalk.green.bold('🎉 metacoding setup is valid and ready to use!\n')
        );
        console.log(
          chalk.dim(`Summary: ${passedChecks}/${totalChecks} checks passed`)
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Validation')) {
        throw error; // Re-throw validation errors for tests
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(chalk.red('\n❌ Validation failed:'), errorMessage);

      // Don't call process.exit in tests
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  /**
   * Display update summary
   */
  private displayUpdateSummary(summary: {
    template: string;
    filesUpdated: number;
    conflictsResolved: number;
    backupCreated: boolean;
  }): void {
    console.log(chalk.cyan('Update Summary:'));
    console.log(`  Template: ${summary.template}`);
    console.log(`  Files updated: ${summary.filesUpdated}`);

    if (summary.conflictsResolved > 0) {
      console.log(`  Conflicts resolved: ${summary.conflictsResolved}`);
    }

    if (summary.backupCreated) {
      console.log(`  Backup: Created in .backup/ directory`);
    }

    console.log('\n' + chalk.dim('Your metacoding setup is now up to date!'));
  }
}
