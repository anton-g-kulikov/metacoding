import { TemplateManager } from './template-manager';
import { FileSystemService } from './filesystem';
import * as path from 'path';
import * as os from 'os';
import { promises as fs } from 'fs';

/**
 * Interface for pattern-specific rule files
 */
export interface PatternRule {
  filename: string;
  content: string;
  pattern: string;
}

/**
 * Interface for installation result
 */
export interface InstallationResult {
  success: boolean;
  conflicts: string[];
  backups: string[];
}

/**
 * Service for managing Cursor IDE integration and rules
 */
export class CursorService {
  constructor(
    private templateManager: TemplateManager,
    private fileSystemService: FileSystemService
  ) {}

  /**
   * Detect if Cursor IDE is installed on the system
   */
  async detectCursorIDE(): Promise<boolean> {
    try {
      const configPath = this.getCursorConfigPath();
      await fs.access(configPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate that Cursor version supports .cursorrules
   */
  async validateCursorCompatibility(): Promise<boolean> {
    // For now, assume any detected Cursor installation supports rules
    // This could be enhanced to check specific version requirements
    return await this.detectCursorIDE();
  }

  /**
   * Get the Cursor configuration directory path
   */
  getCursorConfigPath(customPath?: string): string {
    if (customPath) {
      return customPath;
    }
    return path.join(os.homedir(), '.cursor');
  }

  /**
   * Generate workflow rules content from instruction templates
   * This content will be wrapped in MDC format when written to .cursor/rules/workflow.mdc
   */
  async generateWorkflowRules(
    projectPath: string,
    templateType: string,
    projectConfig?: any
  ): Promise<string> {
    try {
      const instructionFiles =
        await this.templateManager.getInstructionFiles(templateType);

      if (instructionFiles.length === 0) {
        return this.createDefaultWorkflowRules();
      }

      return this.mergeInstructionFiles(instructionFiles, projectConfig);
    } catch (error) {
      throw new Error(
        `Failed to generate workflow rules: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Generate pattern-specific .cursor/rules/*.mdc files
   */
  async generatePatternRules(
    projectPath: string,
    templateType: string
  ): Promise<PatternRule[]> {
    const instructionFiles =
      await this.templateManager.getInstructionFiles(templateType);
    const patternRules: PatternRule[] = [];

    for (const file of instructionFiles) {
      // Skip main copilot instructions as they go into workflow.cursorrules
      if (file.path.includes('copilot-instructions')) {
        continue;
      }

      const pattern = this.determineFilePattern(file.path, templateType);
      const mdcFile = this.extractPatternSpecificRules(file, pattern);
      patternRules.push(mdcFile);
    }

    return patternRules;
  }

  /**
   * Install Cursor rules files safely (all rules go to .cursor/rules/ directory)
   * The general workflow rules are written to .cursor/rules/workflow.mdc.
   * Pattern-specific rules are written as .mdc files in .cursor/rules/ directory.
   * Note: .cursorrules files in project root are legacy and deprecated in modern Cursor IDE.
   */
  async installCursorRules(
    projectPath: string,
    workflowContent: string,
    patternRules: PatternRule[]
  ): Promise<InstallationResult> {
    const conflicts: string[] = [];
    const backups: string[] = [];

    // Check for conflicts with all .cursor/rules/*.mdc files (including workflow.mdc)
    const cursorRulesDir = path.join(projectPath, '.cursor', 'rules');

    // Check for conflict with main workflow rules in .cursor/rules/
    const workflowRulesPath = path.join(cursorRulesDir, 'workflow.mdc');
    if (await this.fileSystemService.fileExists(workflowRulesPath)) {
      conflicts.push('.cursor/rules/workflow.mdc');
    }

    // Check for conflicts with pattern-specific .cursor/rules/*.mdc files
    for (const rule of patternRules) {
      const rulePath = path.join(cursorRulesDir, rule.filename);
      if (await this.fileSystemService.fileExists(rulePath)) {
        conflicts.push(path.join('.cursor', 'rules', rule.filename));
      }
    }

    if (conflicts.length > 0) {
      return {
        success: false,
        conflicts,
        backups: [],
      };
    }

    // Proceed with installation
    try {
      // Ensure .cursor/rules directory exists for all rules
      await this.fileSystemService.ensureDirectoryExists(cursorRulesDir);

      // Write main workflow rules to .cursor/rules/workflow.mdc (with MDC format)
      const workflowMdcContent = this.createMdcContent(workflowContent, '**/*');
      await this.fileSystemService.writeFile(
        workflowRulesPath,
        workflowMdcContent
      );

      // Write pattern-specific rules to .cursor/rules/*.mdc
      for (const rule of patternRules) {
        const rulePath = path.join(cursorRulesDir, rule.filename);
        await this.fileSystemService.writeFile(rulePath, rule.content);
      }

      return {
        success: true,
        conflicts: [],
        backups,
      };
    } catch (error) {
      throw new Error(
        `Failed to install Cursor rules: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Create backups of existing Cursor rules files
   */
  async backupExistingRules(projectPath: string): Promise<string[]> {
    const backups: string[] = [];

    // Backup legacy workflow.cursorrules if it exists (for migration scenarios)
    const legacyWorkflowPath = path.join(projectPath, 'workflow.cursorrules');
    if (await this.fileSystemService.fileExists(legacyWorkflowPath)) {
      const backupPath =
        await this.fileSystemService.backupFile(legacyWorkflowPath);
      backups.push(backupPath);
    }

    // Backup modern .cursor/rules/ directory if it exists
    const cursorRulesDir = path.join(projectPath, '.cursor', 'rules');
    if (await this.fileSystemService.fileExists(cursorRulesDir)) {
      const files = await this.fileSystemService.listFiles(cursorRulesDir);
      // Filter for .mdc files (including workflow.mdc)
      const mdcFiles = files.filter((file) => file.endsWith('.mdc'));
      for (const file of mdcFiles) {
        const filePath = path.join(cursorRulesDir, file);
        const backupPath = await this.fileSystemService.backupFile(filePath);
        backups.push(backupPath);
      }
    }

    return backups;
  }

  /**
   * Convert Copilot instructions to Cursor rules format
   */
  processInstructionTemplate(instructionContent: string): string {
    const header = this.createCursorRulesHeader();
    const processedContent = instructionContent
      .replace(/# GitHub Copilot/gi, '# Cursor AI')
      .replace(/GitHub Copilot/g, 'Cursor AI')
      .replace(/Copilot/g, 'Cursor AI')
      .replace(/\.vscode/g, '.cursor')
      .replace(/VS Code/g, 'Cursor IDE')
      .replace(/Visual Studio Code/g, 'Cursor IDE');

    return `${header}\n\n${processedContent}`;
  }

  /**
   * Combine multiple instruction files into workflow rules content
   * The content will be wrapped in MDC format when saved to .cursor/rules/workflow.mdc
   */
  mergeInstructionFiles(
    instructionFiles: Array<{ path: string; content: string }>,
    projectConfig?: any
  ): string {
    const header = this.createCursorRulesHeader();

    const mergedContent = instructionFiles
      .map((file) => {
        let processed = this.processInstructionTemplate(file.content);

        // Apply template substitution if projectConfig is available
        if (projectConfig) {
          processed = this.applyTemplateSubstitution(processed, projectConfig);
        }

        return `<!-- Source: ${file.path} -->\n${processed}`;
      })
      .join('\n\n---\n\n');

    return `${header}\n\n${mergedContent}`;
  }

  /**
   * Extract pattern-specific rules for .mdc files
   */
  extractPatternSpecificRules(
    instructionFile: { path: string; content: string },
    pattern: string
  ): PatternRule {
    const filename = this.generateMdcFilename(instructionFile.path);
    const content = this.createMdcContent(instructionFile.content, pattern);

    return {
      filename,
      content,
      pattern,
    };
  }

  /**
   * Validate generated rules content for Cursor compatibility
   */
  validateRulesContent(content: string): boolean {
    // Basic validation - check for markdown content and no HTML
    if (content.includes('<!--') && content.includes('-->')) {
      return false; // Reject HTML-like content
    }

    // Must contain some actual content
    return content.trim().length > 0;
  }

  /**
   * Create default workflow rules when no instructions are found
   */
  private createDefaultWorkflowRules(): string {
    const header = this.createCursorRulesHeader();
    const defaultContent = `# Default Cursor AI Rules

No specific instructions found for this project type.

Please follow general best practices for code quality, maintainability, and documentation.`;

    return `${header}\n\n${defaultContent}`;
  }

  /**
   * Create Cursor rules header with metadata
   */
  private createCursorRulesHeader(): string {
    return `<!--
Generated by metacoding v${this.getMetacodingVersion()}
Cursor AI rules for enhanced development experience
Do not edit manually - regenerate using metacoding update
This content will be wrapped in MDC format when saved to .cursor/rules/
-->

# Cursor AI Development Rules`;
  }

  /**
   * Determine file pattern based on instruction file path and template type
   */
  private determineFilePattern(
    instructionPath: string,
    templateType: string
  ): string {
    if (
      instructionPath.includes('typescript') ||
      instructionPath.includes('ts')
    ) {
      return '**/*.ts';
    }
    if (instructionPath.includes('test')) {
      // More specific test patterns based on template type
      switch (templateType) {
        case 'typescript':
        case 'node':
          return '**/*.test.ts';
        case 'react':
          return '**/*.test.{tsx,ts}';
        case 'python':
          return '**/*.test.py';
        default:
          return '**/*.test.*';
      }
    }
    if (instructionPath.includes('react')) {
      return '**/*.{tsx,jsx}';
    }
    if (instructionPath.includes('python')) {
      return '**/*.py';
    }

    // Default pattern based on template type
    switch (templateType) {
      case 'typescript':
      case 'node':
        return '**/*.{ts,js}';
      case 'react':
        return '**/*.{tsx,jsx,ts,js}';
      case 'python':
        return '**/*.py';
      default:
        return '**/*';
    }
  }

  /**
   * Generate .mdc filename from instruction file path
   */
  private generateMdcFilename(instructionPath: string): string {
    const basename = path.basename(instructionPath, '.md');
    const cleanName = basename
      .replace('.instructions', '-instructions')
      .replace('.coding', '-coding')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-') // Replace multiple consecutive dashes with single dash
      .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
      .toLowerCase();

    return `${cleanName}.mdc`;
  }

  /**
   * Create .mdc file content with frontmatter
   */
  private createMdcContent(
    instructionContent: string,
    pattern: string
  ): string {
    const frontmatter = `---
description: "${pattern === '**/*' ? 'General workflow and development rules' : `AI rules for ${pattern} files`}"
patterns: ["${pattern}"]
alwaysApply: ${pattern === '**/*' ? 'true' : 'false'}
---

`;

    const processedContent =
      this.processInstructionTemplate(instructionContent);
    return frontmatter + processedContent;
  }

  /**
   * Get metacoding version for header generation
   */
  private getMetacodingVersion(): string {
    // TODO: Read from package.json or pass as parameter
    return '1.1.4';
  }

  /**
   * Apply template substitution to content using project configuration
   */
  private applyTemplateSubstitution(
    content: string,
    projectConfig: any
  ): string {
    let substituted = content;

    // Replace project variables
    if (projectConfig.projectName) {
      substituted = substituted.replace(
        /\{\{PROJECT_NAME\}\}/g,
        projectConfig.projectName
      );
    }

    if (projectConfig.projectDescription) {
      substituted = substituted.replace(
        /\{\{PROJECT_DESCRIPTION\}\}/g,
        projectConfig.projectDescription
      );
    }

    if (projectConfig.techStack && Array.isArray(projectConfig.techStack)) {
      substituted = substituted.replace(
        /\{\{TECH_STACK\}\}/g,
        projectConfig.techStack.join(', ')
      );
    }

    if (projectConfig.projectDomain) {
      substituted = substituted.replace(
        /\{\{PROJECT_DOMAIN\}\}/g,
        projectConfig.projectDomain
      );
    }

    // Default fallbacks for missing variables
    substituted = substituted.replace(/\{\{PROJECT_NAME\}\}/g, 'Project');
    substituted = substituted.replace(
      /\{\{PROJECT_DESCRIPTION\}\}/g,
      'A guided development project using metacoding workflow'
    );
    substituted = substituted.replace(
      /\{\{TECH_STACK\}\}/g,
      'TypeScript, Jest'
    );
    substituted = substituted.replace(/\{\{PROJECT_DOMAIN\}\}/g, 'software');
    substituted = substituted.replace(
      /\{\{PROJECT_SPECIFIC_GUIDANCE\}\}/g,
      '- **Best Practices:** Follow language-specific coding standards and conventions\n- **Architecture:** Implement modular and maintainable code structure\n- **Testing:** Write comprehensive tests for all functionality\n- **Documentation:** Maintain clear and up-to-date documentation'
    );

    return substituted;
  }
}
