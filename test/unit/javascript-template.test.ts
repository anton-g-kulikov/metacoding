import * as fs from 'fs';
import * as path from 'path';
import { describe, test, expect } from '@jest/globals';
import { GitIgnoreManager } from '../../src/services/gitignore-manager';

describe('JavaScript Template', () => {
  const templateDir = path.join(__dirname, '../../templates/javascript');
  const templateJsonPath = path.join(templateDir, 'template.json');

  describe('Template Structure', () => {
    test('TMPL-UNIT-028: should have javascript template directory', () => {
      expect(fs.existsSync(templateDir)).toBe(true);
      expect(fs.statSync(templateDir).isDirectory()).toBe(true);
    });

    test('TMPL-UNIT-029: should have template.json configuration file', () => {
      expect(fs.existsSync(templateJsonPath)).toBe(true);
      expect(fs.statSync(templateJsonPath).isFile()).toBe(true);
    });

    test('TMPL-UNIT-030: should have JavaScript-specific instruction files', () => {
      const requiredFiles = [
        'javascript.coding.instructions.md',
        'javascript.docs.instructions.md',
        'javascript.testing.instructions.md',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(templateDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(fs.statSync(filePath).isFile()).toBe(true);
      });
    });

    test('TMPL-UNIT-031: should not have files directory with universal gitignore approach', () => {
      const filesDir = path.join(templateDir, 'files');

      // With universal gitignore approach, templates no longer need files directories
      // since all gitignore patterns are handled by GitIgnoreManager
      expect(fs.existsSync(filesDir)).toBe(false);
    });
  });

  describe('Template Configuration', () => {
    test('TMPL-UNIT-032: should have valid template.json structure', () => {
      const content = fs.readFileSync(templateJsonPath, 'utf8');
      const config = JSON.parse(content);

      expect(config).toHaveProperty('name', 'javascript');
      expect(config).toHaveProperty('description');
      expect(config.description).toContain('JavaScript');
      expect(config).toHaveProperty('prompts');
      expect(config).toHaveProperty('vscodeSettings');
    });

    test('TMPL-UNIT-033: should have appropriate VS Code settings for JavaScript', () => {
      const content = fs.readFileSync(templateJsonPath, 'utf8');
      const config = JSON.parse(content);

      expect(
        config.vscodeSettings[
          'github.copilot.chat.codeGeneration.useInstructionFiles'
        ]
      ).toBe(true);
      expect(
        config.vscodeSettings[
          'javascript.preferences.inlayHints.parameterNames.enabled'
        ]
      ).toBe('all');
      expect(config.vscodeSettings['eslint.enable']).toBe(true);
      expect(config.vscodeSettings['files.exclude']).toHaveProperty(
        '**/node_modules',
        true
      );
    });
  });

  describe('Instruction File Content', () => {
    test('TMPL-UNIT-034: coding instructions should contain JavaScript-specific patterns', () => {
      const codingPath = path.join(
        templateDir,
        'javascript.coding.instructions.md'
      );
      const content = fs.readFileSync(codingPath, 'utf8');

      expect(content).toContain('Modern JavaScript');
      expect(content).toContain('ES6+');
      expect(content).toContain('async/await');
      expect(content).toContain("applyTo: 'src/**/*.{js,mjs}'");
      expect(content).toContain('Browser-Specific Development');
      expect(content).toContain('Node.js-Specific Development');
    });

    test('TMPL-UNIT-035: testing instructions should contain JavaScript area prefixes', () => {
      const testingPath = path.join(
        templateDir,
        'javascript.testing.instructions.md'
      );
      const content = fs.readFileSync(testingPath, 'utf8');

      expect(content).toContain('DOM');
      expect(content).toContain('UI');
      expect(content).toContain('EVENT');
      expect(content).toContain('API_CLIENT');
      expect(content).toContain('Jest');
      expect(content).toContain('Vitest');
      expect(content).toContain('jsdom');
    });

    test('TMPL-UNIT-036: docs instructions should contain JavaScript-specific task prefixes', () => {
      const docsPath = path.join(
        templateDir,
        'javascript.docs.instructions.md'
      );
      const content = fs.readFileSync(docsPath, 'utf8');

      expect(content).toContain('DOM-TASK-001');
      expect(content).toContain('API_CLIENT-TASK-002');
      expect(content).toContain('SERVER-TASK-003');
      expect(content).toContain('CLI-TASK-004');
      expect(content).toContain('JSDoc');
      expect(content).toContain('package.json');
    });
  });

  describe('File Generation', () => {
    test('TMPL-UNIT-037: GitIgnoreManager should provide universal AI assistant exclusion patterns', () => {
      // Test the universal gitignore approach instead of template-specific files
      const patterns = GitIgnoreManager.getAIAssistantPatterns();

      expect(patterns).toContain(
        '# metacoding: AI coding assistant exclusions'
      );
      expect(patterns).toContain('.github/copilot-instructions.md');
      expect(patterns).toContain('.cursor/');
      expect(patterns).toContain('.vscode/copilot-instructions.md');

      // Verify patterns work universally for all templates including JavaScript
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Content Quality', () => {
    test('TMPL-UNIT-038: should not contain placeholder text', () => {
      const instructionFiles = [
        'javascript.coding.instructions.md',
        'javascript.docs.instructions.md',
        'javascript.testing.instructions.md',
      ];

      instructionFiles.forEach((file) => {
        const filePath = path.join(templateDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        expect(content).not.toContain('[TODO]');
        expect(content).not.toContain('[PLACEHOLDER]');
        expect(content).not.toContain('TODO:');
        expect(content).not.toContain('FIXME:');
      });
    });

    test('TMPL-UNIT-039: should contain temporary file cleanup guidance', () => {
      const codingPath = path.join(
        templateDir,
        'javascript.coding.instructions.md'
      );
      const content = fs.readFileSync(codingPath, 'utf8');

      // Check for cleanup-related content
      expect(content.toLowerCase()).toMatch(
        /clean|cleanup|temporary|temp|remove/
      );
    });
  });
});
