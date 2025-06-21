import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Service for VS Code configuration and integration
 */
export class VSCodeService {
  private readonly vscodeDir = '.vscode';
  private readonly settingsFile = path.join(this.vscodeDir, 'settings.json');

  /**
   * Update VS Code settings with MetaCoding requirements
   */
  async updateSettings(additionalSettings: Record<string, any> = {}): Promise<void> {
    const requiredSettings = {
      'github.copilot.chat.codeGeneration.useInstructionFiles': true,
      'chat.promptFiles': true,
      ...additionalSettings,
    };

    let existingSettings = {};

    // Read existing settings if they exist
    if (await fs.pathExists(this.settingsFile)) {
      try {
        const content = await fs.readFile(this.settingsFile, 'utf8');
        existingSettings = JSON.parse(content);
      } catch (error) {
        // If settings file is malformed, create a backup and start fresh
        await this.backupSettings();
        existingSettings = {};
      }
    }

    // Merge settings
    const mergedSettings = {
      ...existingSettings,
      ...requiredSettings,
    };

    // Ensure .vscode directory exists
    await fs.ensureDir(this.vscodeDir);

    // Write updated settings
    await fs.writeFile(
      this.settingsFile,
      JSON.stringify(mergedSettings, null, 2),
      'utf8'
    );
  }

  /**
   * Check if VS Code is configured for MetaCoding
   */
  async isConfigured(): Promise<boolean> {
    if (!(await fs.pathExists(this.settingsFile))) {
      return false;
    }

    try {
      const content = await fs.readFile(this.settingsFile, 'utf8');
      const settings = JSON.parse(content);

      return (
        settings['github.copilot.chat.codeGeneration.useInstructionFiles'] === true &&
        settings['chat.promptFiles'] === true
      );
    } catch {
      return false;
    }
  }

  /**
   * Create a backup of current VS Code settings
   */
  async backupSettings(): Promise<string | null> {
    if (!(await fs.pathExists(this.settingsFile))) {
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${this.settingsFile}.backup-${timestamp}`;
    await fs.copy(this.settingsFile, backupPath);
    return backupPath;
  }

  /**
   * Get current VS Code settings
   */
  async getSettings(): Promise<Record<string, any>> {
    if (!(await fs.pathExists(this.settingsFile))) {
      return {};
    }

    try {
      const content = await fs.readFile(this.settingsFile, 'utf8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  /**
   * Check if VS Code directory exists
   */
  async hasVSCodeConfiguration(): Promise<boolean> {
    return await fs.pathExists(this.vscodeDir);
  }
}
