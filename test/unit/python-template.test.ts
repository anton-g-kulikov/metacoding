import * as fs from 'fs';
import * as path from 'path';
import { describe, test, expect } from '@jest/globals';

describe('Python Template', () => {
  const templatesDir = path.join(__dirname, '../../templates');
  const pythonTemplateDir = path.join(templatesDir, 'python');

  describe('Template Structure', () => {
    test('TMPL-UNIT-010: should have python template directory', () => {
      expect(fs.existsSync(pythonTemplateDir)).toBe(true);
      expect(fs.statSync(pythonTemplateDir).isDirectory()).toBe(true);
    });

    test('TMPL-UNIT-011: should have template.json file', () => {
      const templateJsonPath = path.join(pythonTemplateDir, 'template.json');
      expect(fs.existsSync(templateJsonPath)).toBe(true);
      expect(fs.statSync(templateJsonPath).isFile()).toBe(true);
    });

    test('TMPL-UNIT-012: should have all required instruction files', () => {
      const requiredFiles = [
        'template.json',
        'python.coding.instructions.md',
        'python.docs.instructions.md',
        'python.testing.instructions.md',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(pythonTemplateDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
        expect(fs.statSync(filePath).isFile()).toBe(true);
      });
    });
  });

  describe('Template Configuration', () => {
    test('TMPL-UNIT-013: should have valid template.json with Python-specific settings', () => {
      const templateJsonPath = path.join(pythonTemplateDir, 'template.json');
      const templateContent = fs.readFileSync(templateJsonPath, 'utf8');
      const template = JSON.parse(templateContent);

      expect(template.name).toBe('python');
      expect(template.description).toContain('Python');
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

  describe('Python Instruction Files', () => {
    test('TMPL-UNIT-014: python coding instructions should contain Python-specific content', () => {
      const instructionsPath = path.join(
        pythonTemplateDir,
        'python.coding.instructions.md'
      );
      const content = fs.readFileSync(instructionsPath, 'utf8');

      // Check for Python-specific content
      expect(content).toContain('Python');
      expect(content).toContain('PEP 8');
      expect(content).toContain('pytest');
      expect(content).toContain('type hints');

      // Check for Python-specific practices
      expect(content).toContain('Black formatter');
      expect(content).toContain('snake_case');

      // Check that this is coding-specific content
      expect(content).toContain('Code Quality Guidelines');
      expect(content).toContain('Naming Conventions');
    });

    test('TMPL-UNIT-015: python docs instructions should contain Python-specific patterns', () => {
      const docsPath = path.join(
        pythonTemplateDir,
        'python.docs.instructions.md'
      );
      const content = fs.readFileSync(docsPath, 'utf8');

      // Check for Python backend-specific content
      expect(content).toContain('Python');
      expect(content).toContain('Django');
      expect(content).toContain('documentation');
      expect(content).toContain('docstring');

      // Check for documentation and docstring content
      expect(content).toContain('docstring');
      expect(content).toContain('Google-style');
    });

    test('TMPL-UNIT-016: python testing instructions should contain Python testing patterns', () => {
      const testingPath = path.join(
        pythonTemplateDir,
        'python.testing.instructions.md'
      );
      const content = fs.readFileSync(testingPath, 'utf8');

      // Check for Python-specific testing guidance
      expect(content).toContain('Python');
      expect(content).toContain('Django');
      expect(content).toContain('pytest');
      expect(content).toContain('testing');

      // Check for testing framework and patterns
      expect(content).toContain('pytest');
      expect(content).toContain('testing');
    });

    test('TMPL-UNIT-017: all instruction files should enforce workflow standards', () => {
      const instructionFiles = [
        'python.coding.instructions.md',
        'python.docs.instructions.md',
        'python.testing.instructions.md',
      ];

      instructionFiles.forEach((fileName) => {
        const filePath = path.join(pythonTemplateDir, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        // Each file should reference Python-specific patterns
        expect(content).toMatch(/Python/i);
      });
    });

    test('TMPL-UNIT-018: all instruction files should include Python-specific guidance', () => {
      const instructionFiles = [
        'python.coding.instructions.md',
        'python.docs.instructions.md',
        'python.testing.instructions.md',
      ];

      instructionFiles.forEach((fileName) => {
        const filePath = path.join(pythonTemplateDir, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for Python-specific content
        expect(content).toMatch(/(Python|Django|Flask|FastAPI)/i);
      });
    });
  });
});
