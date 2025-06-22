import * as fs from 'fs';
import * as path from 'path';

describe('Node.js Template', () => {
  const templateDir = path.join(__dirname, '../../templates/node');
  const templateJsonPath = path.join(templateDir, 'template.json');
  const filesDir = path.join(templateDir, 'files');

  describe('Template Structure', () => {
    test('TMPL-UNIT-001: should have nodejs template directory', () => {
      expect(fs.existsSync(templateDir)).toBe(true);
      expect(fs.statSync(templateDir).isDirectory()).toBe(true);
    });

    test('TMPL-UNIT-002: should have template.json configuration file', () => {
      expect(fs.existsSync(templateJsonPath)).toBe(true);
      expect(fs.statSync(templateJsonPath).isFile()).toBe(true);
    });

    test('TMPL-UNIT-003: should have files directory', () => {
      expect(fs.existsSync(filesDir)).toBe(true);
      expect(fs.statSync(filesDir).isDirectory()).toBe(true);
    });

    test('TMPL-UNIT-004: should have all required instruction files', () => {
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
    test('TMPL-UNIT-005: copilot instructions should contain Node.js-specific content', () => {
      const instructionsPath = path.join(
        filesDir,
        'copilot-instructions.md.template'
      );
      const content = fs.readFileSync(instructionsPath, 'utf8');

      // Check for Node.js-specific content
      expect(content).toContain('Node.js');
      expect(content).toContain('backend');
      expect(content).toContain('API');
      expect(content).toContain('server');
      expect(content).toContain('Express');

      // Check for mandatory workflow enforcement
      expect(content).toContain('7-step mandatory development workflow');
      expect(content).toContain('mandatory development workflow');

      // Check for template variables
      expect(content).toContain('{{PROJECT_DESCRIPTION}}');
      expect(content).toContain('{{TECH_STACK}}');
    });

    test('TMPL-UNIT-006: code review instructions should include backend-specific criteria', () => {
      const codeReviewPath = path.join(filesDir, 'code-review.instructions.md');
      const content = fs.readFileSync(codeReviewPath, 'utf8');

      // Check for backend-specific review criteria
      expect(content).toContain('API');
      expect(content).toContain('security');
      expect(content).toContain('database');
      expect(content).toContain('performance');
      expect(content).toContain('authentication');
      expect(content).toContain('authorization');

      // Check for temporary file management
      expect(content).toContain('temporary');
      expect(content).toContain('cleanup');
    });

    test('TMPL-UNIT-007: test runner instructions should include Node.js testing patterns', () => {
      const testRunnerPath = path.join(filesDir, 'test-runner.instructions.md');
      const content = fs.readFileSync(testRunnerPath, 'utf8');

      // Check for Node.js testing patterns
      expect(content).toContain('Jest');
      expect(content).toContain('API testing');
      expect(content).toContain('integration test');
      expect(content).toContain('Node.js');

      // Check for temporary file cleanup instructions
      expect(content).toContain('temporary');
      expect(content).toContain('cleanup');
      expect(content).toContain('artifact');
    });

    test('TMPL-UNIT-008: all instruction files should enforce 7-step workflow', () => {
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
  });

  describe('File Management and Cleanup', () => {
    test('TMPL-UNIT-009: instruction files should include comprehensive cleanup guidance', () => {
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
