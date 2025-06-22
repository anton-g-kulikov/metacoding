import * as fs from 'fs';
import * as path from 'path';

/**
 * Test suite for workflow enhancement features in copilot-instructions.md template
 * Validates documentation-first principle enforcement
 */

describe('Workflow Enhancement - Documentation-First Principle', () => {
  const templatePath = path.join(
    __dirname,
    '../../templates/general/files/copilot-instructions.md.template'
  );
  let templateContent: string;

  beforeAll(() => {
    templateContent = fs.readFileSync(templatePath, 'utf8');
  });

  describe('WF-UNIT-005: Documentation-first principle enforcement validation', () => {
    it('should contain documentation-first principle section', () => {
      expect(templateContent).toContain('Documentation-First Principle');
      expect(templateContent).toContain(
        'MANDATORY: Document first, execute second'
      );
    });

    it('should enforce no implementation without documentation', () => {
      expect(templateContent).toContain(
        'No Implementation Without Documentation'
      );
      expect(templateContent).toContain(
        'Never begin any coding, testing, or implementation work until corresponding documentation is complete'
      );
    });
  });

  describe('WF-UNIT-006: Task documentation requirement before implementation', () => {
    it('should require task documentation before work begins', () => {
      expect(templateContent).toContain('Task Documentation Required');
      expect(templateContent).toContain(
        'Every task must be added to `/_meta/project-task-list.md` before work begins'
      );
    });

    it('should include task documentation in Step 2', () => {
      expect(templateContent).toContain('Document before executing');
      expect(templateContent).toContain('Task documentation requirement');
    });
  });

  describe('WF-UNIT-007: Test case documentation requirement validation', () => {
    it('should require test documentation before test implementation', () => {
      expect(templateContent).toContain('Test Documentation Required');
      expect(templateContent).toContain(
        'All test cases must be documented in `/test/test-documentation.md` before writing any test code'
      );
    });

    it('should include test documentation requirement in Step 3', () => {
      expect(templateContent).toContain('Document test cases first');
      expect(templateContent).toContain('Test documentation requirement');
    });
  });

  describe('WF-UNIT-008: Confirmation gate enforcement in workflow steps', () => {
    it('should require explicit user confirmation', () => {
      expect(templateContent).toContain('Confirmation Gates');
      expect(templateContent).toContain(
        'User must explicitly confirm understanding of plan, scope, and consequences'
      );
    });

    it('should include confirmation requirements in Step 1', () => {
      expect(templateContent).toContain('Mandatory confirmation gates');
      expect(templateContent).toContain(
        'User must explicitly approve the plan, scope, and consequences before any work begins'
      );
    });
  });

  describe('WF-UNIT-009: Enhanced Step 1 confirmation requirements', () => {
    it('should enforce documentation-first in Step 1', () => {
      expect(templateContent).toContain('Document first, execute second');
      expect(templateContent).toContain(
        'No implementation work begins until all required documentation is complete'
      );
    });
  });

  describe('WF-UNIT-010: Enhanced Step 2 task management documentation', () => {
    it('should enforce task documentation before execution in Step 2', () => {
      expect(templateContent).toContain('Document before executing');
      expect(templateContent).toContain('BEFORE any implementation work');
    });
  });

  describe('WF-UNIT-011: Enhanced Step 3 TDD documentation requirements', () => {
    it('should enforce test documentation before implementation in Step 3', () => {
      expect(templateContent).toContain('BEFORE implementing any tests');
      expect(templateContent).toContain('Only then implement tests');
      expect(templateContent).toContain(
        'Create actual test files after test cases are documented'
      );
    });
  });

  describe('Documentation-First Examples', () => {
    it('should provide correct and incorrect examples', () => {
      expect(templateContent).toContain(
        'Examples of Required Documentation-First Workflow'
      );
      expect(templateContent).toContain('✅ Correct:');
      expect(templateContent).toContain('❌ Incorrect:');
    });

    it('should show proper task documentation workflow', () => {
      expect(templateContent).toContain(
        "I'll add this task to the task list, then document the test cases, then get your confirmation before implementing"
      );
    });

    it('should show improper workflow to avoid', () => {
      expect(templateContent).toContain(
        "I'll implement this feature and update the documentation afterwards"
      );
    });
  });

  describe('Communication Style Enhancement', () => {
    it('should include documentation-first enforcement in communication style', () => {
      expect(templateContent).toContain(
        'Enforce documentation-first principle'
      );
      expect(templateContent).toContain('Implement confirmation gates');
    });
  });
});
