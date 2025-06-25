import * as fs from 'fs';
import * as path from 'path';
import { describe, test, expect } from '@jest/globals';

describe('Node.js Template', () => {
  const templateDir = path.join(__dirname, '../../templates/node');
  const templateJsonPath = path.join(templateDir, 'template.json');

  describe('Template Structure', () => {
    test('TMPL-UNIT-001: should have nodejs template directory', () => {
      expect(fs.existsSync(templateDir)).toBe(true);
      expect(fs.statSync(templateDir).isDirectory()).toBe(true);
    });

    test('TMPL-UNIT-002: should have template.json configuration file', () => {
      expect(fs.existsSync(templateJsonPath)).toBe(true);
      expect(fs.statSync(templateJsonPath).isFile()).toBe(true);
    });

    test('TMPL-UNIT-003: should have Node.js-specific instruction files', () => {
      const requiredFiles = [
        'nodejs.coding.instructions.md',
        'nodejs.docs.instructions.md',
        'nodejs.testing.instructions.md',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(templateDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(fs.statSync(filePath).isFile()).toBe(true);
      });
    });

    test('TMPL-UNIT-004: should have access to shared TypeScript instruction files', () => {
      const typescriptDir = path.join(__dirname, '../../templates/typescript');
      const typescriptFiles = [
        'typescript.coding.instructions.md',
        'typescript.docs.instructions.md',
        'typescript.testing.instructions.md',
      ];

      typescriptFiles.forEach((file) => {
        const filePath = path.join(typescriptDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(fs.statSync(filePath).isFile()).toBe(true);
      });
    });
  });

  describe('Template Configuration', () => {
    test('should have valid template.json with Node.js-specific settings', () => {
      const templateContent = fs.readFileSync(templateJsonPath, 'utf8');
      const template = JSON.parse(templateContent);

      expect(template.name).toBe('node');
      expect(template.description).toContain('Node.js');
      expect(template.description).toContain('backend');
      expect(template.vscodeSettings).toBeDefined();
      expect(
        template.vscodeSettings[
          'github.copilot.chat.codeGeneration.useInstructionFiles'
        ]
      ).toBe(true);
      expect(template.vscodeSettings['chat.promptFiles']).toBe(true);
    });
  });

  describe('Node.js Instruction Files', () => {
    test('TMPL-UNIT-005: nodejs coding instructions should contain Node.js-specific content', () => {
      const instructionsPath = path.join(
        templateDir,
        'nodejs.coding.instructions.md'
      );
      const content = fs.readFileSync(instructionsPath, 'utf8');

      // Check for Node.js-specific content
      expect(content).toContain('Node.js');
      expect(content).toContain('backend');
      expect(content).toContain('API');
      expect(content).toContain('middleware');
      expect(content).toContain('async/await');
    });

    test('TMPL-UNIT-006: nodejs docs instructions should include backend-specific documentation', () => {
      const docsPath = path.join(templateDir, 'nodejs.docs.instructions.md');
      const content = fs.readFileSync(docsPath, 'utf8');

      // Check for backend-specific documentation criteria
      expect(content).toContain('API');
      expect(content).toContain('OpenAPI');
      expect(content).toContain('Swagger');
      expect(content).toContain('endpoint');
      expect(content).toContain('authentication');
      expect(content).toContain('database');
    });

    test('TMPL-UNIT-007: nodejs testing instructions should include Node.js testing patterns', () => {
      const testingPath = path.join(
        templateDir,
        'nodejs.testing.instructions.md'
      );
      const content = fs.readFileSync(testingPath, 'utf8');

      // Check for Node.js-specific testing guidance
      expect(content).toContain('Node.js');
      expect(content).toContain('Jest');
      expect(content).toContain('Supertest');
      expect(content).toContain('endpoint testing');
      expect(content).toContain('integration test');
      expect(content).toContain('Database Testing');
      expect(content).toContain('middleware');
    });

    test('TMPL-UNIT-008: should work with shared TypeScript instructions', () => {
      const typescriptCodingPath = path.join(
        __dirname,
        '../../templates/typescript/typescript.coding.instructions.md'
      );
      const content = fs.readFileSync(typescriptCodingPath, 'utf8');

      // Check that TypeScript instructions exist and contain TypeScript content
      expect(content).toContain('TypeScript');
      expect(content).toContain('interface');
      expect(content).toContain('type');
    });
  });

  describe('Template Integration', () => {
    test('TMPL-UNIT-009: should be excluded from standalone template listing', () => {
      // TypeScript template should not appear in available templates since it's a shared component
      const {
        TemplateManager,
      } = require('../../src/services/template-manager');
      const templateManager = new TemplateManager();

      return templateManager
        .getAvailableTemplates()
        .then((templates: string[]) => {
          expect(templates).toContain('node');
          expect(templates).not.toContain('typescript'); // Should not be listed as standalone
        });
    });
  });
});
