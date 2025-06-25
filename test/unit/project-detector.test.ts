import * as fs from 'fs-extra';
import * as path from 'path';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { ProjectDetector } from '../../src/services/project-detector';

describe('ProjectDetector', () => {
  let projectDetector: ProjectDetector;
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    projectDetector = new ProjectDetector();
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../temp', 'project-detector-test');
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('JavaScript Project Detection', () => {
    test('CORE-UNIT-011: should detect JavaScript project with JS indicators', async () => {
      // Create package.json with JavaScript indicators
      await fs.writeJson('package.json', {
        name: 'test-js-project',
        version: '1.0.0',
        main: 'index.js',
        dependencies: {
          lodash: '^4.17.21',
          axios: '^0.21.1',
        },
        devDependencies: {
          webpack: '^5.0.0',
        },
      });

      await fs.writeFile('index.js', 'console.log("Hello JavaScript!");');

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('javascript');
      expect(result.hasPackageJson).toBe(true);
    });

    test('CORE-UNIT-012: should not detect JavaScript if React indicators present', async () => {
      // Create package.json with React indicators
      await fs.writeJson('package.json', {
        name: 'test-react-project',
        version: '1.0.0',
        dependencies: {
          react: '^17.0.0',
          'react-dom': '^17.0.0',
          lodash: '^4.17.21', // JS indicator but React takes precedence
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('react');
    });

    test('CORE-UNIT-013: should not detect JavaScript if Node.js backend indicators present', async () => {
      // Create package.json with Node.js backend indicators
      await fs.writeJson('package.json', {
        name: 'test-node-project',
        version: '1.0.0',
        dependencies: {
          express: '^4.17.1',
          lodash: '^4.17.21', // JS indicator but Node.js takes precedence
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('node');
    });

    test('CORE-UNIT-014: should detect JavaScript project with JS files but no TS files', async () => {
      await fs.writeFile('index.js', 'console.log("Hello!");');
      await fs.writeFile('main.js', 'console.log("Main!");');
      await fs.ensureDir('src');
      await fs.writeFile('src/app.js', 'console.log("App!");');

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('javascript');
    });

    test('CORE-UNIT-015: should not detect JavaScript if TypeScript files present', async () => {
      await fs.writeFile('index.js', 'console.log("Hello!");');
      await fs.writeFile('index.ts', 'console.log("Hello TS!");'); // TS takes precedence

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('general'); // Should not be detected as JavaScript
    });

    test('CORE-UNIT-016: should detect JavaScript project with browser field in package.json', async () => {
      await fs.writeJson('package.json', {
        name: 'test-browser-project',
        version: '1.0.0',
        browser: 'dist/bundle.js',
        dependencies: {
          moment: '^2.29.1',
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('javascript');
    });
  });

  describe('Project Type Priority', () => {
    test('CORE-UNIT-017: should prioritize React over JavaScript', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          react: '^17.0.0',
          'react-dom': '^17.0.0',
          webpack: '^5.0.0', // JS indicator
          lodash: '^4.17.21', // JS indicator
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('react');
    });

    test('CORE-UNIT-018: should prioritize Node.js over JavaScript', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          express: '^4.17.1', // Node.js indicator
          lodash: '^4.17.21', // JS indicator
          webpack: '^5.0.0', // JS indicator
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('node');
    });

    test('CORE-UNIT-019: should fall back to general if no specific indicators found', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          'some-random-lib': '^1.0.0',
        },
      });

      const result = await projectDetector.detectProject();
      expect(result.type).toBe('general');
    });
  });
});
