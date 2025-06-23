import * as path from 'path';
import * as fs from 'fs-extra';
import inquirer from 'inquirer';
import { UpdateConflict, ConflictResolution } from '../types';
import { BackupService } from './backup';

/**
 * Service for detecting and resolving conflicts during updates
 */
export class ConflictResolutionService {
  private backupService: BackupService;

  constructor() {
    this.backupService = new BackupService();
  }

  /**
   * Detect conflicts between existing files and template files
   */
  async detectConflicts(
    templateFiles: Array<{ path: string; content: string }>,
    existingFiles: string[]
  ): Promise<UpdateConflict[]> {
    const conflicts: UpdateConflict[] = [];

    for (const templateFile of templateFiles) {
      const filePath = templateFile.path;

      if (existingFiles.includes(filePath)) {
        const hasChanges = await this.backupService.hasFileChanged(
          filePath,
          templateFile.content
        );

        if (hasChanges) {
          const userContent = await fs.readFile(filePath, 'utf8');
          conflicts.push({
            filePath,
            templateContent: templateFile.content,
            userContent,
            hasChanges: true,
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Get user's choice for resolving conflicts
   */
  async getConflictResolution(
    conflicts: UpdateConflict[]
  ): Promise<ConflictResolution[]> {
    if (conflicts.length === 0) {
      return [];
    }

    const resolutions: ConflictResolution[] = [];

    console.log(
      `\n🔍 Found ${conflicts.length} conflicts that need resolution:\n`
    );

    for (const conflict of conflicts) {
      console.log(`Conflict in: ${conflict.filePath}`);
    }

    const { globalChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'globalChoice',
        message: 'How would you like to handle conflicts?',
        choices: [
          { name: 'Keep my versions (save as user.filename)', value: 'keep' },
          { name: 'Replace with template versions', value: 'replace' },
          { name: 'Review each conflict individually', value: 'individual' },
          { name: 'Cancel update', value: 'cancel' },
        ],
      },
    ]);

    if (globalChoice === 'cancel') {
      throw new Error('Update cancelled by user');
    }

    if (globalChoice === 'individual') {
      // Handle each conflict individually
      for (const conflict of conflicts) {
        const { choice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'choice',
            message: `Conflict in ${conflict.filePath}:`,
            choices: [
              {
                name: 'Keep my version (save as user.filename)',
                value: 'keep',
              },
              { name: 'Replace with template version', value: 'replace' },
              { name: 'Skip this file', value: 'skip' },
            ],
          },
        ]);

        resolutions.push({
          action: choice,
          userFileName:
            choice === 'keep'
              ? this.getUserFileName(conflict.filePath)
              : undefined,
          applyToAll: false,
        });
      }
    } else {
      // Apply same choice to all conflicts
      for (const conflict of conflicts) {
        resolutions.push({
          action: globalChoice,
          userFileName:
            globalChoice === 'keep'
              ? this.getUserFileName(conflict.filePath)
              : undefined,
          applyToAll: true,
        });
      }
    }

    return resolutions;
  }

  /**
   * Generate user filename with user. prefix
   */
  private getUserFileName(originalPath: string): string {
    const dir = path.dirname(originalPath);
    const filename = path.basename(originalPath);
    return path.join(dir, `user.${filename}`);
  }

  /**
   * Apply conflict resolutions
   */
  async applyResolutions(
    conflicts: UpdateConflict[],
    resolutions: ConflictResolution[]
  ): Promise<{ preservedFiles: string[]; updatedFiles: string[] }> {
    const preservedFiles: string[] = [];
    const updatedFiles: string[] = [];

    for (let i = 0; i < conflicts.length; i++) {
      const conflict = conflicts[i];
      const resolution = resolutions[i];

      if (!conflict || !resolution) {
        continue;
      }

      switch (resolution.action) {
        case 'keep':
          if (resolution.userFileName) {
            // Move user's version to user.filename
            await fs.move(conflict.filePath, resolution.userFileName);
            preservedFiles.push(resolution.userFileName);

            // Write template version to original location
            await fs.writeFile(conflict.filePath, conflict.templateContent);
            updatedFiles.push(conflict.filePath);
          }
          break;

        case 'replace':
          // Simply overwrite with template version
          await fs.writeFile(conflict.filePath, conflict.templateContent);
          updatedFiles.push(conflict.filePath);
          break;

        case 'skip':
          // Do nothing, leave user's version in place
          break;
      }
    }

    return { preservedFiles, updatedFiles };
  }
}
