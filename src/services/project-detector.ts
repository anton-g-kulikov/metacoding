import * as fs from 'fs-extra';
import * as path from 'path';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Service for detecting the current project's shape.
 */
export class ProjectDetector {
  async detectProject(): Promise<{
    name: string;
    type: string;
    hasGit: boolean;
    techStack: string[];
  }> {
    const currentDir = process.cwd();
    const packageJson = await this.readPackageJson();
    const type = await this.detectProjectType(packageJson);

    return {
      name: path.basename(currentDir),
      type,
      hasGit: await fs.pathExists('.git'),
      techStack: this.detectTechStack(packageJson, type),
    };
  }

  private async detectProjectType(packageJson: PackageJson | null): Promise<string> {
    const deps = this.collectDependencies(packageJson);

    if (deps.react || deps['react-dom']) {
      return 'react';
    }

    if (
      await this.hasAnyFile([
        'requirements.txt',
        'pyproject.toml',
        'setup.py',
        'Pipfile',
        'main.py',
        'app.py',
      ])
    ) {
      return 'python';
    }

    if (
      deps.express ||
      deps.fastify ||
      deps.koa ||
      (await this.hasAnyFile(['server.ts', 'server.js', 'app.ts', 'app.js']))
    ) {
      return 'node';
    }

    if (
      (deps.webpack ||
        deps.parcel ||
        deps.rollup ||
        deps.vite ||
        (await this.hasAnyFile([
          'index.js',
          'main.js',
          'src/index.js',
          'src/main.js',
        ]))) &&
      !deps.typescript
    ) {
      return 'javascript';
    }

    if (deps.typescript) {
      return 'typescript';
    }

    return 'general';
  }

  private detectTechStack(packageJson: PackageJson | null, type: string): string[] {
    const deps = this.collectDependencies(packageJson);
    const techStack: string[] = [];

    if (type === 'python') {
      techStack.push('Python');
    }
    if (deps.react) {
      techStack.push('React');
    }
    if (deps.typescript || deps['@types/node']) {
      techStack.push('TypeScript');
    }
    if (deps.express) {
      techStack.push('Express');
    }
    if (deps.fastify) {
      techStack.push('Fastify');
    }
    if (deps.jest) {
      techStack.push('Jest');
    }
    if (deps.vite) {
      techStack.push('Vite');
    }
    if (deps.pytest) {
      techStack.push('Pytest');
    }

    if (techStack.length === 0) {
      if (type === 'javascript') {
        techStack.push('JavaScript');
      } else {
        techStack.push('TypeScript');
      }
    }

    return techStack;
  }

  private collectDependencies(packageJson: PackageJson | null): Record<string, string> {
    return {
      ...(packageJson?.dependencies || {}),
      ...(packageJson?.devDependencies || {}),
    };
  }

  private async readPackageJson(): Promise<PackageJson | null> {
    if (!(await fs.pathExists('package.json'))) {
      return null;
    }

    try {
      return await fs.readJson('package.json');
    } catch {
      return null;
    }
  }

  private async hasAnyFile(filePaths: string[]): Promise<boolean> {
    const results = await Promise.all(filePaths.map((filePath) => fs.pathExists(filePath)));
    return results.some(Boolean);
  }
}
