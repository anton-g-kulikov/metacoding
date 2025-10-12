import path from 'path';
import { AssistantConfig, AssistantType, ProjectConfig } from '../types';
import { FileSystemService } from './filesystem';

/**
 * Service for managing AI assistant adapters and generating configuration files
 */
export class AssistantAdapterService {
  private fileSystem: FileSystemService;

  constructor() {
    this.fileSystem = new FileSystemService();
  }

  /**
   * Get configuration for all available assistants
   */
  getAvailableAssistants(): AssistantConfig[] {
    return [
      {
        type: 'copilot',
        fileName: '.github/copilot-instructions.md',
        description: 'GitHub Copilot - VS Code and IDEs',
        instructions: 'Existing copilot-instructions.md template'
      },
      {
        type: 'claude',
        fileName: 'CLAUDE.md',
        description: 'Claude Code - Terminal and project instructions',
        instructions: 'CLAUDE.md template with project instructions'
      },
      {
        type: 'codex',
        fileName: 'AGENTS.md',
        description: 'Codex/OpenAI - System message and agent instructions',
        instructions: 'AGENTS.md template with system message configuration'
      },
      {
        type: 'gemini',
        fileName: 'GEMINI.md',
        description: 'Gemini Code Assist - Style guide and configuration',
        instructions: 'GEMINI.md template with hierarchical discovery'
      }
    ];
  }

  /**
   * Generate assistant configuration files based on selections
   */
  async generateAssistantFiles(
    assistantTypes: AssistantType[],
    projectConfig: ProjectConfig,
    targetPath: string
  ): Promise<string[]> {
    const generatedFiles: string[] = [];

    // Ensure assistantTypes is defined and is an array
    if (!assistantTypes || !Array.isArray(assistantTypes)) {
      assistantTypes = ['copilot']; // Default to copilot if no selection
    }

    // Handle 'all' selection
    if (assistantTypes.includes('all')) {
      assistantTypes = ['copilot', 'claude', 'codex', 'gemini'];
    }

    for (const assistantType of assistantTypes) {
      if (assistantType === 'all') continue; // Skip 'all' in the loop

      const filePath = await this.generateAssistantFile(
        assistantType,
        projectConfig,
        targetPath
      );
      if (filePath) {
        generatedFiles.push(filePath);
      }
    }

    return generatedFiles;
  }

  /**
   * Generate a single assistant configuration file
   */
  private async generateAssistantFile(
    assistantType: AssistantType,
    projectConfig: ProjectConfig,
    targetPath: string
  ): Promise<string | null> {
    try {
      let templatePath: string;
      let outputPath: string;

      switch (assistantType) {
        case 'copilot':
          // Always use copilot-instructions.md from general template
          // It will be processed with template substitution for project-specific content
          templatePath = path.join(
            __dirname,
            '../..',
            'templates',
            'general',
            'copilot-instructions.md'
          );
          outputPath = path.join(targetPath, '.github', 'copilot-instructions.md');
          break;

        case 'claude':
          templatePath = path.join(
            __dirname,
            '../..',
            'templates',
            'assistants',
            'CLAUDE.md'
          );
          outputPath = path.join(targetPath, 'CLAUDE.md');
          break;

        case 'codex':
          templatePath = path.join(
            __dirname,
            '../..',
            'templates',
            'assistants',
            'AGENTS.md'
          );
          outputPath = path.join(targetPath, 'AGENTS.md');
          break;

        case 'gemini':
          templatePath = path.join(
            __dirname,
            '../..',
            'templates',
            'assistants',
            'GEMINI.md'
          );
          outputPath = path.join(targetPath, 'GEMINI.md');
          break;

        default:
          console.warn(`Unknown assistant type: ${assistantType}`);
          return null;
      }

      // Read template content
      const templateContent = await this.fileSystem.readFile(templatePath);
      if (!templateContent) {
        console.warn(`Template not found for ${assistantType}: ${templatePath}`);
        return null;
      }

      // Apply variable substitution
      const processedContent = this.substituteVariables(templateContent, projectConfig);

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await this.fileSystem.ensureDirectoryExists(outputDir);

      // Write the file
      await this.fileSystem.writeFile(outputPath, processedContent);

      return outputPath;
    } catch (error) {
      console.error(`Error generating ${assistantType} configuration:`, error);
      return null;
    }
  }

  /**
   * Substitute template variables with project configuration values
   */
  private substituteVariables(content: string, projectConfig: ProjectConfig): string {
    const variables: Record<string, string> = {
      PROJECT_NAME: projectConfig.name,
      PROJECT_DESCRIPTION: projectConfig.description,
      TECH_STACK: projectConfig.techStack.join(', '),
      PROJECT_DOMAIN: projectConfig.projectType,
      ENVIRONMENT_TYPE: projectConfig.ideChoice === 'vscode' || projectConfig.ideChoice === 'cursor' 
        ? 'IDE' 
        : 'Terminal',
      BUILD_COMMAND: this.getBuildCommand(projectConfig),
      TEST_COMMAND: this.getTestCommand(projectConfig),
      LINT_COMMAND: this.getLintCommand(projectConfig),
      TYPECHECK_COMMAND: this.getTypecheckCommand(projectConfig),
      CODE_STYLE_GUIDELINES: this.getCodeStyleGuidelines(projectConfig),
      REPOSITORY_STRUCTURE: this.getRepositoryStructure(projectConfig),
      PROJECT_SPECIFIC_GUIDANCE: '' // Remove this placeholder for now
    };

    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }

    return result;
  }

  /**
   * Get build command based on project configuration
   */
  private getBuildCommand(projectConfig: ProjectConfig): string {
    switch (projectConfig.projectType) {
      case 'react':
      case 'node':
      case 'typescript':
      case 'javascript':
        return 'npm run build';
      case 'python':
        return 'python -m build';
      default:
        return 'npm run build';
    }
  }

  /**
   * Get test command based on project configuration
   */
  private getTestCommand(projectConfig: ProjectConfig): string {
    if (projectConfig.testFramework) {
      switch (projectConfig.testFramework) {
        case 'jest':
          return 'npm test';
        case 'vitest':
          return 'npm run test';
        case 'pytest':
          return 'pytest';
        default:
          return 'npm test';
      }
    }
    
    switch (projectConfig.projectType) {
      case 'python':
        return 'pytest';
      default:
        return 'npm test';
    }
  }

  /**
   * Get lint command based on project configuration
   */
  private getLintCommand(projectConfig: ProjectConfig): string {
    switch (projectConfig.projectType) {
      case 'python':
        return 'flake8 . && black --check .';
      default:
        return 'npm run lint';
    }
  }

  /**
   * Get typecheck command based on project configuration
   */
  private getTypecheckCommand(projectConfig: ProjectConfig): string {
    switch (projectConfig.projectType) {
      case 'typescript':
      case 'react':
        return 'npm run typecheck || tsc --noEmit';
      case 'python':
        return 'mypy .';
      default:
        return 'echo "No type checking configured"';
    }
  }

  /**
   * Get code style guidelines based on project type
   */
  private getCodeStyleGuidelines(projectConfig: ProjectConfig): string {
    switch (projectConfig.projectType) {
      case 'react':
        return 'Use functional components with hooks, JSX best practices, semantic HTML';
      case 'typescript':
      case 'node':
        return 'Use TypeScript strict mode, explicit types, async/await patterns';
      case 'python':
        return 'Follow PEP 8, use type hints, prefer list comprehensions';
      case 'javascript':
        return 'Use ES6+ features, const/let over var, arrow functions';
      default:
        return 'Follow language-specific conventions and best practices';
    }
  }

  /**
   * Get repository structure based on project type
   */
  private getRepositoryStructure(projectConfig: ProjectConfig): string {
    const baseStructure = `
/src                  # All source code
/_meta               # Development documentation
/test                # All test-related files
/.github            # GitHub-specific files`;

    switch (projectConfig.projectType) {
      case 'react':
        return `${baseStructure}
  /components        # Reusable React components
  /hooks             # Custom React hooks
  /pages             # Page components
  /utils             # Utility functions`;
      
      case 'node':
      case 'typescript':
        return `${baseStructure}
  /services          # Business logic services
  /routes            # API routes
  /middleware        # Express middleware
  /utils             # Utility functions`;
        
      case 'python':
        return `${baseStructure}
  /modules           # Python modules
  /utils             # Utility functions
  /config            # Configuration files
  requirements.txt   # Python dependencies`;
        
      default:
        return `${baseStructure}
  /components        # Reusable components
  /services          # Business logic
  /utils             # Utility functions`;
    }
  }

  /**
   * Detect existing assistant configurations
   */
  async detectExistingAssistants(projectPath: string): Promise<AssistantType[]> {
    const existingAssistants: AssistantType[] = [];

    const assistantFiles = [
      { type: 'copilot' as AssistantType, path: '.github/copilot-instructions.md' },
      { type: 'claude' as AssistantType, path: 'CLAUDE.md' },
      { type: 'codex' as AssistantType, path: 'AGENTS.md' },
      { type: 'gemini' as AssistantType, path: 'GEMINI.md' }
    ];

    for (const { type, path: filePath } of assistantFiles) {
      const fullPath = path.join(projectPath, filePath);
      if (await this.fileSystem.fileExists(fullPath)) {
        existingAssistants.push(type);
      }
    }

    return existingAssistants;
  }

  /**
   * Check if any assistant configuration exists (for migration prompts)
   */
  async hasExistingAssistantConfig(projectPath: string): Promise<boolean> {
    const existingAssistants = await this.detectExistingAssistants(projectPath);
    return existingAssistants.length > 0;
  }
}