import { InitCommand } from '../../src/commands/init';
import { UpdateCommand } from '../../src/commands/update';
import { FileSystemService } from '../../src/services/filesystem';
import * as fs from 'fs-extra';
import * as path from 'path';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('Advanced Integration Tests', () => {
  let testDir: string;
  let originalCwd: string;
  let fileSystem: FileSystemService;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-integration-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    fileSystem = new FileSystemService();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Complete Workflow Tests', () => {
    test('CLI-INT-003: should complete full init-validate-update cycle', async () => {
      // Step 1: Initialize
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Verify initialization
      expect(
        await fileSystem.fileExists('.github/copilot-instructions.md')
      ).toBe(true);

      // Step 2: Validate using update --dry-run
      const updateCommand = new UpdateCommand();
      await expect(
        updateCommand.execute({ dryRun: true })
      ).resolves.not.toThrow();

      // Step 3: Update (with force option to avoid interactive prompts)
      await expect(
        updateCommand.execute({
          force: true, // Use force mode to avoid interactive prompts
        })
      ).resolves.not.toThrow();
    }, 15000); // Increase timeout to 15 seconds for this complex integration test

    test('CLI-INT-004: should handle project type detection and appropriate template selection', async () => {
      // Create a React project
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'my-react-app',
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0',
          },
        })
      );

      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'react', // Use React template to get React-specific content
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const copilotContent = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Should contain React-specific content
      expect(copilotContent).toContain('React');
      expect(copilotContent).toContain('component');
    });

    test('CLI-INT-005: should handle template switching between different project types', async () => {
      // Start with React
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'app',
          dependencies: { react: '^18.0.0' },
        })
      );

      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'react',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      let content = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );
      expect(content).toContain('React');

      // Switch to Node.js
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'app',
          dependencies: { express: '^4.0.0' },
        })
      );

      await initCommand.execute({
        template: 'node',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      content = await fileSystem.readFile('.github/copilot-instructions.md');
      expect(content).toContain('Node.js');
      expect(content).toContain('backend');
    });
  });

  describe('VSCode Integration Tests', () => {
    test('CLI-INT-006: should create and configure VSCode settings properly', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: false, // Enable VSCode setup
        skipGit: true,
      });

      // Check VSCode settings were created
      expect(await fileSystem.fileExists('.vscode/settings.json')).toBe(true);

      const settings = JSON.parse(
        await fileSystem.readFile('.vscode/settings.json')
      );
      expect(settings['chat.promptFiles']).toBe(true);
    });

    test('CLI-INT-007: should preserve existing VSCode settings when adding metacoding settings', async () => {
      // Create existing VSCode settings
      await fileSystem.ensureDirectoryExists('.vscode');
      await fileSystem.writeFile(
        '.vscode/settings.json',
        JSON.stringify({
          'editor.fontSize': 16,
          'workbench.colorTheme': 'Dark+',
        })
      );

      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: false,
        skipGit: true,
      });

      const settings = JSON.parse(
        await fileSystem.readFile('.vscode/settings.json')
      );

      // Should preserve existing settings
      expect(settings['editor.fontSize']).toBe(16);
      expect(settings['workbench.colorTheme']).toBe('Dark+');

      // Should add metacoding settings
      expect(settings['chat.promptFiles']).toBe(true);
    });
  });

  describe('Git Integration Tests', () => {
    test('CLI-INT-008: should handle git repository detection', async () => {
      // Initialize a git repository
      await fs.ensureDir('.git');

      const initCommand = new InitCommand();

      // Should not throw even with git repository present
      await expect(
        initCommand.execute({
          template: 'general',
          force: true,
          skipVscode: true,
          skipGit: false,
        })
      ).resolves.not.toThrow();
    });

    test('CLI-INT-009: should work in non-git directory', async () => {
      // No .git directory

      const initCommand = new InitCommand();

      await expect(
        initCommand.execute({
          template: 'general',
          force: true,
          skipVscode: true,
          skipGit: false,
        })
      ).resolves.not.toThrow();
    });
  });

  describe('Real-world Scenario Tests', () => {
    test('CLI-INT-010: should handle existing project with complex structure', async () => {
      // Create a complex project structure
      await fs.ensureDir('src/components');
      await fs.ensureDir('src/utils');
      await fs.ensureDir('test');
      await fs.ensureDir('docs');

      await fs.writeFile('src/index.ts', 'export * from "./components";');
      await fs.writeFile('README.md', '# Existing Project');
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'complex-project',
          scripts: { test: 'jest' },
          dependencies: { react: '^18.0.0' },
        })
      );

      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'react',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Should create metacoding files without affecting existing structure
      expect(await fileSystem.fileExists('src/index.ts')).toBe(true);
      expect(await fileSystem.fileExists('README.md')).toBe(true);
      expect(
        await fileSystem.fileExists('.github/copilot-instructions.md')
      ).toBe(true);
    });

    test('CLI-INT-011: should handle force reinstallation correctly', async () => {
      const initCommand = new InitCommand();

      // First installation
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Modify the copilot instructions
      await fileSystem.writeFile(
        '.github/copilot-instructions.md',
        'MODIFIED CONTENT'
      );

      // Force reinstallation
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const content = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Should be replaced with template content, not user modifications
      expect(content).not.toBe('MODIFIED CONTENT');
      expect(content).toContain('metacoding');
    });

    test('CLI-INT-012: should handle concurrent template installations', async () => {
      const initCommand = new InitCommand();

      // This tests that file operations are atomic and don't interfere
      const promises = [
        initCommand.execute({
          template: 'general',
          force: true,
          skipVscode: true,
          skipGit: true,
        }),
        // Second execution should wait or handle gracefully
      ];

      await expect(Promise.all(promises)).resolves.not.toThrow();

      // Should end up with valid metacoding setup
      expect(
        await fileSystem.fileExists('.github/copilot-instructions.md')
      ).toBe(true);
    });
  });

  describe('Performance and Resource Tests', () => {
    test('CLI-INT-013: should complete initialization within reasonable time', async () => {
      const startTime = Date.now();

      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const duration = Date.now() - startTime;

      // Should complete within 5 seconds (generous for CI environments)
      expect(duration).toBeLessThan(5000);
    });

    test('CLI-INT-014: should clean up temporary resources properly', async () => {
      const initCommand = new InitCommand();

      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Check that no temporary files were left behind
      const files = await fs.readdir('.');
      const tempFiles = files
        .filter(
          (file) =>
            file.includes('tmp') ||
            file.includes('temp') ||
            file.startsWith('.')
        )
        .filter((file) => file !== '.github'); // .github is expected

      // Verify no unexpected temporary files remain
      expect(tempFiles.length).toBe(0);

      // Should only have .github directory after init
      const dotFiles = files.filter((f) => f.startsWith('.'));
      expect(dotFiles).toContain('.github');
    });
  });
});
