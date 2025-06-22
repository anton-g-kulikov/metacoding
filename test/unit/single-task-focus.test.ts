import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect, beforeAll } from '@jest/globals';

describe('WF-UNIT-012 to WF-UNIT-018: Single-Task Focus Enforcement Tests', () => {
  let templateContent: string;

  beforeAll(() => {
    const templatePath = join(
      __dirname,
      '../../templates/general/copilot-instructions.md'
    );
    templateContent = readFileSync(templatePath, 'utf-8');
  });

  describe('WF-UNIT-012: Single-Task Focus Section', () => {
    it('should contain Single-Task Focus Enforcement section', () => {
      expect(templateContent).toContain('Single-Task Focus Enforcement');
      expect(templateContent).toContain('one change at a time');
      expect(templateContent).toContain('never mix tasks in one iteration');
    });

    it('should define clear principles for task separation', () => {
      expect(templateContent).toContain('No Task Mixing');
      expect(templateContent).toContain('Task-Switching Prevention');
      expect(templateContent).toContain('Scope Creep Management');
    });
  });

  describe('WF-UNIT-013: Task Mixing Prevention', () => {
    it('should explicitly forbid mixing different tasks', () => {
      expect(templateContent).toContain(
        'Never work on two different tasks simultaneously'
      );
      expect(templateContent).toContain('one task at a time');
      expect(templateContent).toContain('complete the current workflow first');
    });

    it('should provide clear examples of incorrect task mixing', () => {
      expect(templateContent).toContain('❌ Incorrect');
      expect(templateContent).toContain('Good:');
      expect(templateContent).toContain('Bad:');
    });
  });

  describe('WF-UNIT-014: Scope Creep Handling', () => {
    it('should define scope creep handling procedures', () => {
      expect(templateContent).toContain('Scope Creep Management');
      expect(templateContent).toContain('Option A');
      expect(templateContent).toContain('Option B');
    });

    it('should provide decision criteria for scope changes', () => {
      expect(templateContent).toContain('blocks current work');
      expect(templateContent).toContain('subtask');
      expect(templateContent).toContain('separate task');
      expect(templateContent).toContain('unrelated');
    });
  });

  describe('WF-UNIT-015: Task-Switching Templates', () => {
    it('should provide polite redirection templates', () => {
      expect(templateContent).toContain('Enforcement Templates');
      expect(templateContent).toContain('Correct response');
      expect(templateContent).toContain(
        "I've added that request to the task list"
      );
    });

    it('should offer workflow completion assistance', () => {
      expect(templateContent).toContain('complete the current workflow first');
      expect(templateContent).toContain('address it as a separate task');
      expect(templateContent).toContain('add it as a subtask');
    });
  });

  describe('WF-UNIT-016: Enhanced Workflow Violations Section', () => {
    it('should include scope creep handling in violations section', () => {
      expect(templateContent).toContain('Workflow Violations');
      expect(templateContent).toContain(
        'Handling Scope Creep and Task Switching'
      );
      expect(templateContent).toContain('Task Switching');
    });

    it('should provide specific violation response procedures', () => {
      expect(templateContent).toContain('Politely decline');
      expect(templateContent).toContain('Remind of benefits');
      expect(templateContent).toContain('Offer to complete current workflow');
    });
  });

  describe('WF-UNIT-017: Task Completion Verification', () => {
    it('should emphasize task completion before new work', () => {
      expect(templateContent).toContain('complete the current workflow');
      expect(templateContent).toContain('before moving to next task');
      expect(templateContent).toContain('finish the current task properly');
    });

    it('should define completion criteria', () => {
      expect(templateContent).toContain(
        'Current task is documented and committed'
      );
      expect(templateContent).toContain('All tests are passing');
      expect(templateContent).toContain('Documentation is updated');
    });
  });

  describe('WF-UNIT-018: Integration with Existing Workflow', () => {
    it('should integrate smoothly with documentation-first principle', () => {
      expect(templateContent).toContain('Documentation-First Principle');
      expect(templateContent).toContain('Single-Task Focus');
      expect(templateContent).toContain('one change at a time');
    });

    it('should maintain consistency with workflow enforcement rules', () => {
      expect(templateContent).toContain('Workflow Enforcement Rules');
      expect(templateContent).toContain('Quality Gates');
      expect(templateContent).toContain('No parallel tasks');
    });
  });
});
