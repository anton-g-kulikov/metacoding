import * as path from 'path';
import * as fs from 'fs-extra';
import { Template, ProjectConfig } from '../types';

/**
 * Service for managing and processing templates
 */
export class TemplateManager {
  private readonly templatesDir: string;

  constructor() {
    // Templates are located relative to the compiled lib directory
    this.templatesDir = path.join(__dirname, '../../templates');
  }

  /**
   * Get a template by name
   */
  async getTemplate(templateName: string): Promise<Template> {
    const templatePath = path.join(this.templatesDir, templateName);
    
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const configPath = path.join(templatePath, 'template.json');
    
    if (!(await fs.pathExists(configPath))) {
      throw new Error(`Template configuration not found for '${templateName}'`);
    }

    const config = await fs.readJson(configPath);
    
    // Load template files
    const filesDir = path.join(templatePath, 'files');
    const files = await this.loadTemplateFiles(filesDir);

    return {
      name: templateName,
      description: config.description,
      files,
      prompts: config.prompts || [],
      vscodeSettings: config.vscodeSettings || {},
    };
  }

  /**
   * Process a template with the given configuration
   */
  async processTemplate(template: Template, config: ProjectConfig): Promise<Array<{ path: string; content: string }>> {
    const processedFiles: Array<{ path: string; content: string }> = [];

    for (const file of template.files) {
      let content: string;

      if (file.template) {
        // Process template file with variable substitution
        const templateContent = await fs.readFile(
          path.join(this.templatesDir, template.name, 'files', file.source),
          'utf8'
        );
        content = this.processTemplateContent(templateContent, config);
      } else {
        // Copy file as-is
        content = await fs.readFile(
          path.join(this.templatesDir, template.name, 'files', file.source),
          'utf8'
        );
      }

      processedFiles.push({
        path: file.destination,
        content,
      });
    }

    return processedFiles;
  }

  /**
   * Get list of available templates
   */
  async getAvailableTemplates(): Promise<string[]> {
    if (!(await fs.pathExists(this.templatesDir))) {
      return [];
    }

    const items = await fs.readdir(this.templatesDir);
    const templates: string[] = [];

    for (const item of items) {
      const itemPath = path.join(this.templatesDir, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        const configPath = path.join(itemPath, 'template.json');
        if (await fs.pathExists(configPath)) {
          templates.push(item);
        }
      }
    }

    return templates;
  }

  /**
   * Load template files from a directory
   */
  private async loadTemplateFiles(filesDir: string): Promise<Array<{ source: string; destination: string; template: boolean }>> {
    const files: Array<{ source: string; destination: string; template: boolean }> = [];

    if (!(await fs.pathExists(filesDir))) {
      return files;
    }

    const items = await fs.readdir(filesDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const isTemplate = item.name.endsWith('.template');
        const source = item.name;
        let destination = item.name;

        if (isTemplate) {
          // Remove .template extension for destination
          destination = item.name.replace('.template', '');
        }

        // Map certain files to specific locations
        if (destination === 'copilot-instructions.md') {
          destination = '.github/copilot-instructions.md';
        } else if (destination.endsWith('.instructions.md')) {
          destination = `.github/instructions/${destination}`;
        }

        files.push({
          source,
          destination,
          template: isTemplate,
        });
      }
    }

    return files;
  }

  /**
   * Process template content by replacing variables
   */
  private processTemplateContent(content: string, config: ProjectConfig): string {
    const variables = {
      PROJECT_NAME: config.name,
      PROJECT_DESCRIPTION: config.description,
      TECH_STACK: Array.isArray(config.techStack) ? config.techStack.join(', ') : config.techStack,
      PROJECT_TYPE: config.projectType,
      TEST_FRAMEWORK: config.testFramework || 'Jest',
      BUILD_TOOL: config.buildTool || 'TypeScript Compiler',
      PROJECT_DOMAIN: this.getProjectDomain(config.projectType),
    };

    let processedContent = content;

    // Replace all variables in the format {{VARIABLE_NAME}}
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // Replace old-style placeholders for backward compatibility
    processedContent = processedContent.replace(/\[short project description\]/g, config.description);
    processedContent = processedContent.replace(/\[Main goal 1\]/g, 'Provide robust development workflow');
    processedContent = processedContent.replace(/\[Main goal 2\]/g, 'Ensure code quality and best practices');
    processedContent = processedContent.replace(/\[Main goal 3\]/g, 'Enable efficient team collaboration');
    processedContent = processedContent.replace(/\[List primary technologies\]/g, variables.TECH_STACK);
    processedContent = processedContent.replace(/\[project specific\]/g, variables.PROJECT_DOMAIN);

    return processedContent;
  }

  /**
   * Get project domain description based on project type
   */
  private getProjectDomain(projectType: string): string {
    switch (projectType) {
      case 'react':
        return 'React frontend';
      case 'node':
        return 'Node.js backend';
      case 'python':
        return 'Python';
      default:
        return 'software';
    }
  }
}
