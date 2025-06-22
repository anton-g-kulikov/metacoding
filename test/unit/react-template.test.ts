import * as fs from 'fs-extra';
import * as path from 'path';
import { describe, test, expect } from '@jest/globals';
import { TemplateManager } from '../../src/services/template-manager';

describe('React Template', () => {
  const templatesDir = path.join(__dirname, '..', '..', 'templates');
  const reactTemplateDir = path.join(templatesDir, 'react');
  const templateManager = new TemplateManager();

  describe('Template Structure', () => {
    test('TMPL-UNIT-019: should have react template directory', async () => {
      const exists = await fs.pathExists(reactTemplateDir);
      expect(exists).toBe(true);
    });

    test('TMPL-UNIT-020: should have template.json configuration file', async () => {
      const templateJsonPath = path.join(reactTemplateDir, 'template.json');
      const exists = await fs.pathExists(templateJsonPath);
      expect(exists).toBe(true);
    });

    test('TMPL-UNIT-021: should have React-specific instruction files', async () => {
      const requiredFiles = [
        'template.json',
        'react.coding.instructions.md',
        'react.docs.instructions.md',
        'react.testing.instructions.md',
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(reactTemplateDir, file);
        const exists = await fs.pathExists(filePath);
        expect(exists).toBe(true);
      }
    });
  });

  describe('Template Configuration', () => {
    test('TMPL-UNIT-022: should have valid template.json with React metadata', async () => {
      const templateJsonPath = path.join(reactTemplateDir, 'template.json');
      const templateConfig = await fs.readJson(templateJsonPath);

      expect(templateConfig).toHaveProperty('name', 'react');
      expect(templateConfig).toHaveProperty('description');
      expect(templateConfig.description).toContain('React');
      expect(templateConfig).toHaveProperty('vscodeSettings');
    });
  });

  describe('React Instruction Files', () => {
    test('TMPL-UNIT-023: should have React-specific coding instructions', async () => {
      const instructionsPath = path.join(
        reactTemplateDir,
        'react.coding.instructions.md'
      );
      const exists = await fs.pathExists(instructionsPath);
      expect(exists).toBe(true);
    });

    test('TMPL-UNIT-024: should have React-specific testing instructions', async () => {
      const testingPath = path.join(
        reactTemplateDir,
        'react.testing.instructions.md'
      );
      const exists = await fs.pathExists(testingPath);
      expect(exists).toBe(true);
    });

    test('TMPL-UNIT-025: coding instructions should contain React-specific content', async () => {
      const instructionsPath = path.join(
        reactTemplateDir,
        'react.coding.instructions.md'
      );
      const content = await fs.readFile(instructionsPath, 'utf-8');

      expect(content).toContain('React');
      expect(content).toContain('component');
      expect(content).toContain('TypeScript');
      expect(content).toContain('hooks');
    });
  });

  describe('Template Manager Integration', () => {
    test('TMPL-UNIT-026: should list React template as available', async () => {
      const templates = await templateManager.getAvailableTemplates();

      expect(templates).toContain('react');
    });

    test('TMPL-UNIT-027: should load React template successfully', async () => {
      const reactTemplate = await templateManager.getTemplate('react');

      expect(reactTemplate.name).toBe('react');
      expect(reactTemplate.description).toContain('React');
      expect(reactTemplate.files).toBeDefined();
      expect(reactTemplate.files.length).toBeGreaterThan(0);
    });
  });
});
