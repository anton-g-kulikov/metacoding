import * as path from 'path';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import { BackupResult } from '../types';

/**
 * Service for creating and managing backups during update operations
 */
export class BackupService {
  private readonly backupBaseDir = '.backup';

  /**
   * Create a full backup of the .github directory
   */
  async createBackup(): Promise<BackupResult> {
    const timestamp = this.generateTimestamp();
    const backupPath = path.join(this.backupBaseDir, timestamp);
    const githubDir = '.github';

    // Ensure backup directory exists
    await fs.ensureDir(backupPath);

    const filesBackedUp: string[] = [];

    if (await fs.pathExists(githubDir)) {
      // Copy entire .github directory
      await fs.copy(githubDir, path.join(backupPath, githubDir));

      // List all files that were backed up
      const allFiles = await this.listAllFiles(githubDir);
      filesBackedUp.push(...allFiles);
    }

    return {
      backupPath,
      timestamp,
      filesBackedUp,
    };
  }

  /**
   * Generate a timestamp for backup directory naming
   */
  private generateTimestamp(): string {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_');
  }

  /**
   * Recursively list all files in a directory
   */
  private async listAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    if (!(await fs.pathExists(dirPath))) {
      return files;
    }

    const items = await fs.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        const subFiles = await this.listAllFiles(itemPath);
        files.push(...subFiles);
      } else {
        files.push(itemPath);
      }
    }

    return files;
  }

  /**
   * Create a hash of file content for change detection
   */
  async getFileHash(filePath: string): Promise<string | null> {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }

    const content = await fs.readFile(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Check if a file has been modified compared to original content
   */
  async hasFileChanged(
    filePath: string,
    originalContent: string
  ): Promise<boolean> {
    if (!(await fs.pathExists(filePath))) {
      return true; // File doesn't exist, consider it changed
    }

    const currentContent = await fs.readFile(filePath, 'utf8');
    const currentHash = crypto
      .createHash('md5')
      .update(currentContent)
      .digest('hex');
    const originalHash = crypto
      .createHash('md5')
      .update(originalContent)
      .digest('hex');

    return currentHash !== originalHash;
  }

  /**
   * Clean up old backup directories (keep last 5)
   */
  async cleanupOldBackups(): Promise<void> {
    if (!(await fs.pathExists(this.backupBaseDir))) {
      return;
    }

    const backupDirs = await fs.readdir(this.backupBaseDir);
    const sortedDirs = backupDirs
      .filter((dir) => /^\d{8}_\d{6}$/.test(dir))
      .sort()
      .reverse();

    // Keep the 5 most recent backups
    const dirsToDelete = sortedDirs.slice(5);

    for (const dir of dirsToDelete) {
      const dirPath = path.join(this.backupBaseDir, dir);
      await fs.remove(dirPath);
    }
  }
}
