import { TemplateManager } from '../../src/services/template-manager';
import { ProjectDetector } from '../../src/services/project-detector';
import { VSCodeService } from '../../src/services/vscode';
import { FileSystemService } from '../../src/services/filesystem';
import { ProjectConfig } from '../../src/types';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Service Integration', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-service-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Template Manager Service', () => {
    test('CLI-UNIT-031: should list all available templates', async () => {
      const templateManager = new TemplateManager();
      const templates = await templateManager.getAvailableTemplates();

      expect(templates).toContain('general');
      expect(templates).toContain('react');
      expect(templates).toContain('node');
      expect(templates).toContain('python');
      expect(templates.length).toBeGreaterThanOrEqual(4);
    });

    test('CLI-UNIT-032: should load template configuration correctly', async () => {
      const templateManager = new TemplateManager();
      const template = await templateManager.getTemplate('general');

      expect(template.name).toBe('general');
      expect(template.description).toBeDefined();
      expect(template.files).toBeDefined();
      expect(Array.isArray(template.files)).toBe(true);
      expect(template.files.length).toBeGreaterThan(0);
    });

    test('CLI-UNIT-033: should throw error for non-existent template', async () => {
      const templateManager = new TemplateManager();

      await expect(
        templateManager.getTemplate('non-existent')
      ).rejects.toThrow();
    });

    test('CLI-UNIT-034: should validate template file structure', async () => {
      const templateManager = new TemplateManager();
      const templates = ['general', 'react', 'node', 'python'];

      for (const templateName of templates) {
        const template = await templateManager.getTemplate(templateName);

        // Each template should have required files
        const requiredFiles = [
          'copilot-instructions.md', // .template gets removed for destination
          'code-review.instructions.md',
          'docs-update.instructions.md',
          'release.instructions.md',
          'test-runner.instructions.md',
        ];

        for (const requiredFile of requiredFiles) {
          const hasFile = template.files.some((file) =>
            file.destination.includes(requiredFile)
          );
          if (!hasFile) {
            console.log(
              `Missing required file ${requiredFile} in template ${templateName}`
            );
            console.log(
              'Available files:',
              template.files.map((f) => f.destination)
            );
          }
          expect(hasFile).toBe(true);
        }
      }
    });
  });

  describe('Project Detector Service', () => {
    test('CLI-UNIT-035: should detect Node.js project from package.json', async () => {
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'test-project',
          dependencies: {
            express: '^4.0.0',
          },
        })
      );

      const detector = new ProjectDetector();
      const project = await detector.detectProject();

      expect(project.type).toBe('node');
    });

    test('CLI-UNIT-036: should detect React project from package.json', async () => {
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'test-project',
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0',
          },
        })
      );

      const detector = new ProjectDetector();
      const project = await detector.detectProject();

      expect(project.type).toBe('react');
    });

    test('CLI-UNIT-037: should detect Python project from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', 'django==4.0.0\nflask==2.0.0');

      const detector = new ProjectDetector();
      const project = await detector.detectProject();

      expect(project.type).toBe('python');
    });

    test('CLI-UNIT-038: should default to general for unknown project types', async () => {
      // No project files created

      const detector = new ProjectDetector();
      const project = await detector.detectProject();

      expect(project.type).toBe('general');
    });

    test('CLI-UNIT-039: should handle malformed package.json gracefully', async () => {
      await fs.writeFile('package.json', '{ invalid json }');

      const detector = new ProjectDetector();
      const project = await detector.detectProject();

      expect(project.type).toBe('general'); // Should fallback gracefully
    });
  });

  describe('VSCode Service', () => {
    test('CLI-UNIT-040: should create .vscode directory and settings', async () => {
      const vscodeService = new VSCodeService();
      const fileSystem = new FileSystemService();

      await vscodeService.updateSettings({
        'chat.promptFiles': true,
        'editor.wordWrap': 'on',
      });

      expect(await fileSystem.fileExists('.vscode')).toBe(true);
      expect(await fileSystem.fileExists('.vscode/settings.json')).toBe(true);

      const settingsContent = await fileSystem.readFile(
        '.vscode/settings.json'
      );
      const settings = JSON.parse(settingsContent);

      expect(settings['chat.promptFiles']).toBe(true);
      expect(settings['editor.wordWrap']).toBe('on');
    });

    test('CLI-UNIT-041: should merge with existing VSCode settings', async () => {
      const vscodeService = new VSCodeService();
      const fileSystem = new FileSystemService();

      // Create existing settings
      await fileSystem.ensureDirectoryExists('.vscode');
      await fileSystem.writeFile(
        '.vscode/settings.json',
        JSON.stringify({
          'editor.fontSize': 14,
          'chat.promptFiles': false,
        })
      );

      // Update with new settings
      await vscodeService.updateSettings({
        'chat.promptFiles': true,
        'editor.wordWrap': 'on',
      });

      const settingsContent = await fileSystem.readFile(
        '.vscode/settings.json'
      );
      const settings = JSON.parse(settingsContent);

      // Should preserve existing and add new
      expect(settings['editor.fontSize']).toBe(14);
      expect(settings['chat.promptFiles']).toBe(true); // Should be updated
      expect(settings['editor.wordWrap']).toBe('on'); // Should be added
    });

    test('CLI-UNIT-042: should handle invalid existing settings.json', async () => {
      const vscodeService = new VSCodeService();
      const fileSystem = new FileSystemService();

      // Create invalid settings file
      await fileSystem.ensureDirectoryExists('.vscode');
      await fileSystem.writeFile('.vscode/settings.json', '{ invalid json }');

      // Should handle gracefully and recreate
      await expect(
        vscodeService.updateSettings({
          'chat.promptFiles': true,
        })
      ).resolves.not.toThrow();

      const settingsContent = await fileSystem.readFile(
        '.vscode/settings.json'
      );
      const settings = JSON.parse(settingsContent);
      expect(settings['chat.promptFiles']).toBe(true);
    });
  });

  describe('Service Integration Workflows', () => {
    test('CLI-UNIT-043: should integrate template manager with file system for full setup', async () => {
      const templateManager = new TemplateManager();
      const fileSystem = new FileSystemService();

      const template = await templateManager.getTemplate('general');

      // Process template with mock config
      const mockConfig: ProjectConfig = {
        name: 'test-project',
        description: 'A test project',
        techStack: ['TypeScript', 'Jest'],
        projectType: 'general',
      };

      const processedFiles = await templateManager.processTemplate(
        template,
        mockConfig
      );

      // Create files from processed template
      for (const file of processedFiles) {
        await fileSystem.ensureDirectoryExists(path.dirname(file.path));
        await fileSystem.writeFile(file.path, file.content);
      }

      // Verify all files were created
      expect(
        await fileSystem.fileExists('.github/copilot-instructions.md')
      ).toBe(true);
      expect(
        await fileSystem.fileExists(
          '.github/instructions/code-review.instructions.md'
        )
      ).toBe(true);
    });

    test('CLI-UNIT-044: should integrate project detector with template manager', async () => {
      // Setup React project
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'test-react-app',
          dependencies: { react: '^18.0.0' },
        })
      );

      const detector = new ProjectDetector();
      const templateManager = new TemplateManager();

      const project = await detector.detectProject();
      const template = await templateManager.getTemplate(project.type);

      expect(project.type).toBe('react');
      expect(template.name).toBe('react');
    });
  });
});
