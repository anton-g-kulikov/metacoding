import * as path from 'path';
import * as fs from 'fs-extra';
import { Template, ProjectConfig } from '../types';

/**
 * Service for managing and processing templates
 */
export class TemplateManager {
  private readonly templatesDir: string;
  private readonly instructionsDir: string;

  constructor() {
    // Templates are located relative to the compiled lib directory
    this.templatesDir = path.join(__dirname, '../../templates');
    // Instructions are now stored within each template directory
    this.instructionsDir = this.templatesDir;
  }

  /**
   * Get a template by name, optionally with project configuration for technology-specific instructions
   */
  async getTemplate(
    templateName: string,
    projectConfig?: ProjectConfig
  ): Promise<Template> {
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
    const templateFiles = await this.loadTemplateFiles(filesDir);

    // Load composable instruction files based on template/project type and tech stack
    const instructionFiles = await this.loadInstructionFiles(
      templateName,
      projectConfig
    );

    // Combine template files and instruction files
    const files = [...templateFiles, ...instructionFiles];

    return {
      name: templateName,
      description: config.description,
      files,
      prompts: config.prompts || [],
      vscodeSettings: config.vscodeSettings || {},
    };
  }

  /**
   * Load instruction files from template directories
   */
  private async loadInstructionFiles(
    templateName: string,
    projectConfig?: ProjectConfig
  ): Promise<
    Array<{ source: string; destination: string; template: boolean }>
  > {
    const files: Array<{
      source: string;
      destination: string;
      template: boolean;
    }> = [];

    // Always load universal files from the general template
    const generalPath = path.join(this.templatesDir, 'general');
    const universalFiles = [
      'copilot-instructions.md',
      'docs-update.instructions.md',
      'release.instructions.md',
      'code-review.instructions.md',
    ];

    for (const file of universalFiles) {
      const filePath = path.join(generalPath, file);
      if (await fs.pathExists(filePath)) {
        files.push({
          source: `general/${file}`,
          destination:
            file === 'copilot-instructions.md'
              ? '.github/copilot-instructions.md'
              : `.github/instructions/${file}`,
          template: file === 'copilot-instructions.md', // Enable template substitution for copilot instructions
        });
      }
    }

    // Load template-specific testing instructions (new naming convention)
    const testingFiles = {
      react: 'react.testing.instructions.md',
      node: 'nodejs.testing.instructions.md',
      python: 'python.testing.instructions.md',
      javascript: 'test-runner.instructions.md', // JavaScript uses general test-runner
      general: 'test-runner.instructions.md',
    };

    const testingFile = testingFiles[templateName as keyof typeof testingFiles];
    if (testingFile) {
      const templatePath = path.join(this.templatesDir, templateName);
      const testingFilePath = path.join(templatePath, testingFile);
      if (await fs.pathExists(testingFilePath)) {
        files.push({
          source: `${templateName}/${testingFile}`,
          destination: '.github/instructions/test-runner.instructions.md',
          template: false,
        });
      } else if (templateName === 'javascript') {
        // JavaScript template uses general test-runner instructions
        const generalTestingPath = path.join(
          generalPath,
          'test-runner.instructions.md'
        );
        if (await fs.pathExists(generalTestingPath)) {
          files.push({
            source: 'general/test-runner.instructions.md',
            destination: '.github/instructions/test-runner.instructions.md',
            template: false,
          });
        }
      }
    }

    // Load TypeScript instructions for templates that use TypeScript
    const typescriptTemplates = ['node', 'react'];
    const useTypeScript =
      typescriptTemplates.includes(templateName) ||
      projectConfig?.techStack?.includes('TypeScript');

    if (useTypeScript) {
      const typescriptPath = path.join(this.templatesDir, 'typescript');
      if (await fs.pathExists(typescriptPath)) {
        const typescriptFiles = await fs.readdir(typescriptPath);

        for (const file of typescriptFiles) {
          if (file === 'template.json') {
            continue;
          }

          if (file.endsWith('.instructions.md')) {
            files.push({
              source: `typescript/${file}`,
              destination: `.github/instructions/${file}`,
              template: false,
            });
          }
        }
      }
    }

    // Load template-specific files from the specific template directory
    if (templateName !== 'general') {
      const templatePath = path.join(this.templatesDir, templateName);
      const templateFiles = await fs.readdir(templatePath);

      for (const file of templateFiles) {
        // Skip template.json and universal files (already loaded from general)
        if (file === 'template.json' || universalFiles.includes(file)) {
          continue;
        }

        // Only include instruction files
        if (file.endsWith('.instructions.md')) {
          files.push({
            source: `${templateName}/${file}`,
            destination: `.github/instructions/${file}`,
            template: false,
          });
        }
      }
    }

    return files;
  }

  /**
   * Process a template with the given configuration
   */
  async processTemplate(
    template: Template,
    config: ProjectConfig
  ): Promise<Array<{ path: string; content: string }>> {
    const processedFiles: Array<{ path: string; content: string }> = [];

    for (const file of template.files) {
      let content: string;
      let filePath: string;

      // Files now include the template directory in the source path
      if (file.source.includes('/')) {
        // Source includes directory (e.g., "general/copilot-instructions.md")
        filePath = path.join(this.templatesDir, file.source);
      } else {
        // Fallback for files without directory prefix
        filePath = path.join(this.templatesDir, template.name, file.source);
      }

      if (file.template) {
        // Process template file with variable substitution
        const templateContent = await fs.readFile(filePath, 'utf8');
        content = this.processTemplateContent(templateContent, config);
      } else {
        // Copy file as-is
        content = await fs.readFile(filePath, 'utf8');
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
    // Exclude shared component templates that are not standalone
    const excludedTemplates = ['typescript'];

    for (const item of items) {
      const itemPath = path.join(this.templatesDir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory() && !excludedTemplates.includes(item)) {
        const configPath = path.join(itemPath, 'template.json');
        if (await fs.pathExists(configPath)) {
          templates.push(item);
        }
      }
    }

    return templates;
  }

  /**
   * Load template files from a directory (excluding instruction files which are handled separately)
   */
  private async loadTemplateFiles(
    filesDir: string
  ): Promise<
    Array<{ source: string; destination: string; template: boolean }>
  > {
    const files: Array<{
      source: string;
      destination: string;
      template: boolean;
    }> = [];

    if (!(await fs.pathExists(filesDir))) {
      return files;
    }

    // Extract template name from filesDir path
    // filesDir is like "/path/to/templates/general/files"
    const templateName = path.basename(path.dirname(filesDir));

    const items = await fs.readdir(filesDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const isTemplate = item.name.endsWith('.template');
        const source = `${templateName}/files/${item.name}`; // Include template name and files/ prefix
        let destination = item.name;

        if (isTemplate) {
          // Remove .template extension for destination
          destination = item.name.replace('.template', '');
        }

        // Skip instruction files - they are now handled by loadInstructionFiles()
        if (
          destination === 'copilot-instructions.md' ||
          destination.endsWith('.instructions.md')
        ) {
          continue;
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
  private processTemplateContent(
    content: string,
    config: ProjectConfig
  ): string {
    const variables = {
      PROJECT_NAME: config.name,
      PROJECT_DESCRIPTION: config.description,
      TECH_STACK: Array.isArray(config.techStack)
        ? config.techStack.join(', ')
        : config.techStack,
      PROJECT_TYPE: config.projectType,
      TEST_FRAMEWORK: config.testFramework || 'Jest',
      BUILD_TOOL: config.buildTool || 'TypeScript Compiler',
      PROJECT_DOMAIN: this.getProjectDomain(config.projectType),
      PROJECT_SPECIFIC_GUIDANCE: this.getProjectSpecificGuidance(
        config.projectType
      ),
    };

    let processedContent = content;

    // Replace all variables in the format {{VARIABLE_NAME}}
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(
        new RegExp(placeholder, 'g'),
        value
      );
    }

    // Replace old-style placeholders for backward compatibility
    processedContent = processedContent.replace(
      /\[short project description\]/g,
      config.description
    );
    processedContent = processedContent.replace(
      /\[Main goal 1\]/g,
      'Provide guided development workflow'
    );
    processedContent = processedContent.replace(
      /\[Main goal 2\]/g,
      'Ensure code quality and best practices'
    );
    processedContent = processedContent.replace(
      /\[Main goal 3\]/g,
      'Enable efficient team collaboration'
    );
    processedContent = processedContent.replace(
      /\[List primary technologies\]/g,
      variables.TECH_STACK
    );
    processedContent = processedContent.replace(
      /\[project specific\]/g,
      variables.PROJECT_DOMAIN
    );

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

  /**
   * Get project-specific guidance content based on project type
   */
  private getProjectSpecificGuidance(projectType: string): string {
    switch (projectType) {
      case 'react':
        return `
- **React Components:** Follow modern React patterns with hooks and functional components
- **JSX Best Practices:** Use semantic HTML elements and proper JSX syntax
- **State Management:** Implement efficient state management with React hooks
- **Component Architecture:** Build reusable, testable React components
- **Frontend Performance:** Optimize rendering and bundle size for better user experience`;
      case 'node':
        return `
- **Server Architecture:** Design scalable Node.js server applications
- **API Development:** Build robust REST APIs with proper error handling
- **Backend Services:** Implement efficient server-side business logic
- **Database Integration:** Use appropriate data persistence patterns
- **Performance:** Optimize server response times and resource usage`;
      case 'python':
        return `
- **Django Development:** Follow Django best practices for web applications
- **Flask Applications:** Build lightweight Flask applications when appropriate
- **Python Standards:** Adhere to PEP 8 and Python coding conventions
- **Backend Development:** Implement scalable Python backend solutions
- **Framework Integration:** Use appropriate Python frameworks for different use cases`;
      default:
        return `
- **Best Practices:** Follow language-specific coding standards and conventions
- **Architecture:** Implement modular and maintainable code structure
- **Testing:** Write comprehensive tests for all functionality
- **Documentation:** Maintain clear and up-to-date documentation`;
    }
  }

  /**
   * Get instruction files for a specific template type (for Cursor support)
   */
  async getInstructionFiles(
    templateType: string
  ): Promise<Array<{ path: string; content: string }>> {
    const instructionFiles: Array<{ path: string; content: string }> = [];

    try {
      // Load universal files from general template
      const generalPath = path.join(this.templatesDir, 'general');
      const universalFiles = [
        'copilot-instructions.md',
        'docs-update.instructions.md',
        'code-review.instructions.md',
      ];

      for (const file of universalFiles) {
        const filePath = path.join(generalPath, file);
        if (await fs.pathExists(filePath)) {
          const content = await fs.readFile(filePath, 'utf-8');
          instructionFiles.push({
            path: `general/${file}`,
            content,
          });
        }
      }

      // Load template-specific files
      const templatePath = path.join(this.templatesDir, templateType);
      if (await fs.pathExists(templatePath)) {
        // Load language-specific coding instructions
        const codingFiles = await this.getCodingInstructionFiles(templateType);
        for (const file of codingFiles) {
          const filePath = path.join(templatePath, file);
          if (await fs.pathExists(filePath)) {
            const content = await fs.readFile(filePath, 'utf-8');
            instructionFiles.push({
              path: `${templateType}/${file}`,
              content,
            });
          }
        }
      }

      return instructionFiles;
    } catch (error) {
      throw new Error(
        `Failed to load instruction files for ${templateType}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get coding instruction files for a specific template type
   */
  private getCodingInstructionFiles(templateType: string): string[] {
    const commonFiles = ['test-runner.instructions.md'];

    switch (templateType) {
      case 'typescript':
      case 'node':
        return [
          ...commonFiles,
          'typescript.coding.instructions.md',
          'nodejs.testing.instructions.md',
        ];
      case 'react':
        return [
          ...commonFiles,
          'react.coding.instructions.md',
          'react.testing.instructions.md',
        ];
      case 'python':
        return [
          ...commonFiles,
          'python.coding.instructions.md',
          'python.testing.instructions.md',
        ];
      case 'javascript':
        return [
          ...commonFiles,
          'javascript.coding.instructions.md',
          'javascript.testing.instructions.md',
          'javascript.docs.instructions.md',
        ];
      default:
        return commonFiles;
    }
  }
}
