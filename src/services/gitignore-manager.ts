import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Service for managing .gitignore files with append-only strategy
 */
export class GitIgnoreManager {
  /**
   * Get comprehensive AI coding assistant exclusion patterns
   * Universal patterns that work across all project types and IDEs
   */
  static getAIAssistantPatterns(): string[] {
    return [
      '# metacoding: AI coding assistant exclusions',
      '.codex/skills/metacoding-*/',
      '.claude/skills/metacoding-*/',
      '.agents/skills/metacoding-*/',
      '.backup/',
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
        // Keep the existing section and only fill in patterns it lacks
        await this.addMissingPatterns(projectPath);
        return;
      }

      // Prepare content to append
      let contentToAppend = '';

      // Add newlines if file exists and doesn't end with newline
      if (
        hasExistingFile &&
        existingContent.length > 0 &&
        !existingContent.endsWith('\n')
      ) {
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
      throw new Error(
        `Failed to update .gitignore: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Append exclusion patterns that an existing metacoding section lacks.
   * Does nothing when the file has no metacoding section, so a project that
   * chose to commit its skill files keeps that choice.
   */
  async addMissingPatterns(projectPath: string): Promise<void> {
    const gitignorePath = path.join(projectPath, '.gitignore');

    if (!(await fs.pathExists(gitignorePath))) {
      return;
    }

    const existingContent = await fs.readFile(gitignorePath, 'utf8');
    if (!existingContent.includes('# metacoding:')) {
      return;
    }

    const existingLines = new Set(
      existingContent.split(/\r?\n/).map((line) => line.trim())
    );
    const missing = GitIgnoreManager.getAIAssistantPatterns().filter(
      (pattern) => !pattern.startsWith('#') && !existingLines.has(pattern)
    );

    if (missing.length === 0) {
      return;
    }

    const separator = existingContent.endsWith('\n') ? '' : '\n';
    await fs.appendFile(gitignorePath, separator + missing.join('\n') + '\n');
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
