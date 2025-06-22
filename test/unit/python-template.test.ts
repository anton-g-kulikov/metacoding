import * as fs from 'fs';
import * as path from 'path';

describe('Python Template', () => {
  const templatesDir = path.join(__dirname, '../../templates');
  const pythonTemplateDir = path.join(templatesDir, 'python');
  const filesDir = path.join(pythonTemplateDir, 'files');

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

    test('TMPL-UNIT-012: should have files directory with all required instruction files', () => {
      expect(fs.existsSync(filesDir)).toBe(true);
      expect(fs.statSync(filesDir).isDirectory()).toBe(true);

      const requiredFiles = [
        'copilot-instructions.md.template',
        'code-review.instructions.md',
        'docs-update.instructions.md',
        'release.instructions.md',
        'test-runner.instructions.md',
      ];

      requiredFiles.forEach((file) => {
        const filePath = path.join(filesDir, file);
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
    test('TMPL-UNIT-014: copilot instructions should contain Python-specific content', () => {
      const instructionsPath = path.join(
        filesDir,
        'copilot-instructions.md.template'
      );
      const content = fs.readFileSync(instructionsPath, 'utf8');

      // Check for Python-specific content
      expect(content).toContain('Python');
      expect(content).toContain('Django');
      expect(content).toContain('Flask');
      expect(content).toContain('FastAPI');
      expect(content).toContain('backend');

      // Check for mandatory workflow enforcement
      expect(content).toContain('7-step mandatory development workflow');
      expect(content).toContain('mandatory development workflow');

      // Check for template variables
      expect(content).toContain('{{PROJECT_DESCRIPTION}}');
      expect(content).toContain('{{TECH_STACK}}');
    });

    test('TMPL-UNIT-015: code review instructions should contain Python-specific patterns', () => {
      const codeReviewPath = path.join(filesDir, 'code-review.instructions.md');
      const content = fs.readFileSync(codeReviewPath, 'utf8');

      // Check for Python backend-specific content
      expect(content).toContain('Python');
      expect(content).toContain('Django');
      expect(content).toContain('ORM');
      expect(content).toContain('security');
      expect(content).toContain('performance');

      // Check for temporary file management
      expect(content).toContain('temporary');
      expect(content).toContain('cleanup');
    });

    test('TMPL-UNIT-016: test runner instructions should contain Python testing patterns', () => {
      const testRunnerPath = path.join(filesDir, 'test-runner.instructions.md');
      const content = fs.readFileSync(testRunnerPath, 'utf8');

      // Check for Python testing content
      expect(content).toContain('pytest');
      expect(content).toContain('Python');
      expect(content).toContain('Django');

      // Check for temporary file cleanup instructions
      expect(content).toContain('temporary');
      expect(content).toContain('cleanup');
    });

    test('TMPL-UNIT-017: all instruction files should enforce 7-step workflow', () => {
      const instructionFiles = [
        'copilot-instructions.md.template',
        'code-review.instructions.md',
        'test-runner.instructions.md',
      ];

      instructionFiles.forEach((fileName) => {
        const filePath = path.join(filesDir, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        // Each file should reference or enforce the workflow
        expect(content).toMatch(/(workflow|mandatory|step)/i);
      });
    });

    test('TMPL-UNIT-018: all instruction files should include cleanup guidance', () => {
      const instructionFiles = [
        'copilot-instructions.md.template',
        'code-review.instructions.md',
        'test-runner.instructions.md',
      ];

      instructionFiles.forEach((fileName) => {
        const filePath = path.join(filesDir, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for cleanup-related content
        expect(content).toMatch(/(cleanup|temporary|artifact|clean)/i);
      });
    });
  });
});
