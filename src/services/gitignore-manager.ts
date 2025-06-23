import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Service for managing .gitignore files with append-only strategy
 */
export class GitIgnoreManager {
  /**
   * Get comprehensive AI coding assistant exclusion patterns
   */
  static getAIAssistantPatterns(): string[] {
    return [
      '# metacoding: AI coding assistant exclusions',
      '.github/copilot-instructions.md',
      '.github/instructions/',
      '.vscode/copilot-instructions.md',
      '.idea/copilot-instructions.md',
    ];
  }

  /**
   * Update .gitignore file with AI assistant exclusion patterns
   * Uses append-only strategy to preserve existing user configurations
   */
  async updateGitIgnore(projectPath: string): Promise<void> {
    const gitignorePath = path.join(projectPath, '.gitignore');
    const patterns = GitIgnoreManager.getAIAssistantPatterns();

    try {
      let existingContent = '';
      let hasExistingFile = false;

      // Check if .gitignore already exists
      if (await fs.pathExists(gitignorePath)) {
        existingContent = await fs.readFile(gitignorePath, 'utf8');
        hasExistingFile = true;
      }

      // Check if our patterns are already present to avoid duplicates
      const hasMetacodingSection = existingContent.includes('# metacoding:');
      
      if (hasMetacodingSection) {
        // Skip if our patterns are already present
        return;
      }

      // Prepare content to append
      let contentToAppend = '';
      
      // Add newlines if file exists and doesn't end with newline
      if (hasExistingFile && existingContent.length > 0 && !existingContent.endsWith('\n')) {
        contentToAppend = '\n\n';
      } else if (hasExistingFile && existingContent.length > 0) {
        contentToAppend = '\n';
      }

      // Add our patterns
      contentToAppend += patterns.join('\n') + '\n';

      // Append to existing file or create new file
      if (hasExistingFile) {
        await fs.appendFile(gitignorePath, contentToAppend);
      } else {
        await fs.writeFile(gitignorePath, contentToAppend);
      }
    } catch (error) {
      throw new Error(`Failed to update .gitignore: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if .gitignore already contains metacoding patterns
   */
  async hasMetacodingPatterns(projectPath: string): Promise<boolean> {
    const gitignorePath = path.join(projectPath, '.gitignore');
    
    try {
      if (!(await fs.pathExists(gitignorePath))) {
        return false;
      }

      const content = await fs.readFile(gitignorePath, 'utf8');
      return content.includes('# metacoding:');
    } catch {
      // If we can't read the file, assume patterns are not present
      return false;
    }
  }

  /**
   * Create .gitignore template content for new projects
   */
  static createTemplateContent(): string {
    const patterns = GitIgnoreManager.getAIAssistantPatterns();
    
    return `# Dependencies
node_modules/
*.tgz

# Build outputs
lib/
dist/
build/
coverage/

# Environment files
.env
.env.local
.env.*.local

# IDE and Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Temporary files
tmp/
temp/
tmp-*

${patterns.join('\n')}
`;
  }
}
