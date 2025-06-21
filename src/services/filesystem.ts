import * as fs from 'fs-extra';
import * as path from 'path';
import { FileSystemResult } from '../types';

/**
 * Service for file system operations
 */
export class FileSystemService {
  /**
   * Check if metacoding is already set up in the current directory
   */
  async isMetaCodingSetup(): Promise<boolean> {
    const githubDir = '.github';
    const copilotInstructions = path.join(githubDir, 'copilot-instructions.md');
    const instructionsDir = path.join(githubDir, 'instructions');

    return (
      (await fs.pathExists(copilotInstructions)) &&
      (await fs.pathExists(instructionsDir))
    );
  }

  /**
   * Ensure a directory exists, creating it if necessary
   */
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  /**
   * Write content to a file
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Read content from a file
   */
  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    return await fs.pathExists(filePath);
  }

  /**
   * Copy a file from source to destination
   */
  async copyFile(source: string, destination: string): Promise<void> {
    await fs.ensureDir(path.dirname(destination));
    await fs.copy(source, destination);
  }

  /**
   * List files in a directory
   */
  async listFiles(dirPath: string): Promise<string[]> {
    if (!(await fs.pathExists(dirPath))) {
      return [];
    }
    return await fs.readdir(dirPath);
  }

  /**
   * Create a backup of a file
   */
  async backupFile(filePath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    await fs.copy(filePath, backupPath);
    return backupPath;
  }

  /**
   * Get the current working directory
   */
  getCurrentDirectory(): string {
    return process.cwd();
  }

  /**
   * Get the base name of the current directory
   */
  getCurrentDirectoryName(): string {
    return path.basename(this.getCurrentDirectory());
  }
}
