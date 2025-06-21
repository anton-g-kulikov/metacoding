import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Service for detecting project type and context
 */
export class ProjectDetector {
  /**
   * Detect project information from the current directory
   */
  async detectProject(): Promise<any> {
    const currentDir = process.cwd();
    const projectName = path.basename(currentDir);

    return {
      name: projectName,
      type: await this.detectProjectType(),
      hasGit: await this.hasGitRepository(),
      hasVSCode: await this.hasVSCodeConfiguration(),
      hasPackageJson: await this.hasPackageJson(),
      techStack: await this.detectTechStack(),
    };
  }

  /**
   * Detect the project type based on files present
   */
  private async detectProjectType(): Promise<string> {
    // Check for React project indicators
    if (await this.hasReactIndicators()) {
      return 'react';
    }

    // Check for Node.js project indicators
    if (await this.hasNodeIndicators()) {
      return 'node';
    }

    // Check for Python project indicators
    if (await this.hasPythonIndicators()) {
      return 'python';
    }

    return 'general';
  }

  /**
   * Check if this looks like a React project
   */
  private async hasReactIndicators(): Promise<boolean> {
    const packageJsonPath = 'package.json';

    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const deps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        return !!(deps.react || deps['@types/react'] || deps['react-dom']);
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Check for common React files
    const reactFiles = [
      'src/App.tsx',
      'src/App.jsx',
      'public/index.html',
      'vite.config.ts',
      'vite.config.js',
    ];

    for (const file of reactFiles) {
      if (await fs.pathExists(file)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if this looks like a Node.js project
   */
  private async hasNodeIndicators(): Promise<boolean> {
    const packageJsonPath = 'package.json';

    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const deps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        // Look for Node.js specific dependencies
        const nodeIndicators = [
          'express',
          'fastify',
          'koa',
          '@types/node',
          'nodemon',
        ];
        return nodeIndicators.some((indicator) => deps[indicator]);
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Check for common Node.js files
    const nodeFiles = [
      'server.js',
      'server.ts',
      'app.js',
      'app.ts',
      'index.js',
      'index.ts',
    ];

    for (const file of nodeFiles) {
      if (await fs.pathExists(file)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if this looks like a Python project
   */
  private async hasPythonIndicators(): Promise<boolean> {
    const pythonFiles = [
      'requirements.txt',
      'pyproject.toml',
      'setup.py',
      'Pipfile',
      'poetry.lock',
      'main.py',
      'app.py',
    ];

    for (const file of pythonFiles) {
      if (await fs.pathExists(file)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if the project has a Git repository
   */
  private async hasGitRepository(): Promise<boolean> {
    return await fs.pathExists('.git');
  }

  /**
   * Check if the project has VS Code configuration
   */
  private async hasVSCodeConfiguration(): Promise<boolean> {
    return await fs.pathExists('.vscode');
  }

  /**
   * Check if the project has a package.json file
   */
  private async hasPackageJson(): Promise<boolean> {
    return await fs.pathExists('package.json');
  }

  /**
   * Detect tech stack from various project files
   */
  private async detectTechStack(): Promise<string[]> {
    const techStack: string[] = [];

    // Check package.json for dependencies
    if (await fs.pathExists('package.json')) {
      try {
        const packageJson = await fs.readJson('package.json');
        const deps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        if (deps.react) techStack.push('React');
        if (deps.typescript || deps['@types/node'])
          techStack.push('TypeScript');
        if (deps.express) techStack.push('Express');
        if (deps.jest) techStack.push('Jest');
        if (deps.vite) techStack.push('Vite');
        if (deps.webpack) techStack.push('Webpack');
        if (deps.next) techStack.push('Next.js');
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Check for Python
    if (await this.hasPythonIndicators()) {
      techStack.push('Python');
    }

    // Default to TypeScript and Jest if no specific tech detected
    if (techStack.length === 0) {
      techStack.push('TypeScript', 'Jest');
    }

    return techStack;
  }
}
