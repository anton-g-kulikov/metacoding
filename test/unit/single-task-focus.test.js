"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('WF-UNIT-012 to WF-UNIT-018: Single-Task Focus Enforcement Tests', () => {
    let templateContent;
    (0, globals_1.beforeAll)(() => {
        const templatePath = (0, path_1.join)(__dirname, '../../templates/general/copilot-instructions.md');
        templateContent = (0, fs_1.readFileSync)(templatePath, 'utf-8');
    });
    (0, globals_1.describe)('WF-UNIT-012: Single-Task Focus Section', () => {
        (0, globals_1.it)('should contain Single-Task Focus Enforcement section', () => {
            (0, globals_1.expect)(templateContent).toContain('Single-Task Focus Enforcement');
            (0, globals_1.expect)(templateContent).toContain('one change at a time');
            (0, globals_1.expect)(templateContent).toContain('never mix tasks in one iteration');
        });
        (0, globals_1.it)('should define clear principles for task separation', () => {
            (0, globals_1.expect)(templateContent).toContain('No Task Mixing');
            (0, globals_1.expect)(templateContent).toContain('Task-Switching Prevention');
            (0, globals_1.expect)(templateContent).toContain('Scope Creep Management');
        });
    });
    (0, globals_1.describe)('WF-UNIT-013: Task Mixing Prevention', () => {
        (0, globals_1.it)('should explicitly forbid mixing different tasks', () => {
            (0, globals_1.expect)(templateContent).toContain('Never work on two different tasks simultaneously');
            (0, globals_1.expect)(templateContent).toContain('one task at a time');
            (0, globals_1.expect)(templateContent).toContain('complete the current workflow first');
        });
        (0, globals_1.it)('should provide clear examples of incorrect task mixing', () => {
            (0, globals_1.expect)(templateContent).toContain('❌ Incorrect');
            (0, globals_1.expect)(templateContent).toContain('Good:');
            (0, globals_1.expect)(templateContent).toContain('Bad:');
        });
    });
    (0, globals_1.describe)('WF-UNIT-014: Scope Creep Handling', () => {
        (0, globals_1.it)('should define scope creep handling procedures', () => {
            (0, globals_1.expect)(templateContent).toContain('Scope Creep Management');
            (0, globals_1.expect)(templateContent).toContain('Option A');
            (0, globals_1.expect)(templateContent).toContain('Option B');
        });
        (0, globals_1.it)('should provide decision criteria for scope changes', () => {
            (0, globals_1.expect)(templateContent).toContain('blocks current work');
            (0, globals_1.expect)(templateContent).toContain('subtask');
            (0, globals_1.expect)(templateContent).toContain('separate task');
            (0, globals_1.expect)(templateContent).toContain('unrelated');
        });
    });
    (0, globals_1.describe)('WF-UNIT-015: Task-Switching Templates', () => {
        (0, globals_1.it)('should provide polite redirection templates', () => {
            (0, globals_1.expect)(templateContent).toContain('Enforcement Templates');
            (0, globals_1.expect)(templateContent).toContain('Correct response');
            (0, globals_1.expect)(templateContent).toContain("I've added that request to the task list");
        });
        (0, globals_1.it)('should offer workflow completion assistance', () => {
            (0, globals_1.expect)(templateContent).toContain('complete the current workflow first');
            (0, globals_1.expect)(templateContent).toContain('address it as a separate task');
            (0, globals_1.expect)(templateContent).toContain('add it as a subtask');
        });
    });
    (0, globals_1.describe)('WF-UNIT-016: Enhanced Workflow Violations Section', () => {
        (0, globals_1.it)('should include scope creep handling in violations section', () => {
            (0, globals_1.expect)(templateContent).toContain('Workflow Violations');
            (0, globals_1.expect)(templateContent).toContain('Handling Scope Creep and Task Switching');
            (0, globals_1.expect)(templateContent).toContain('Task Switching');
        });
        (0, globals_1.it)('should provide specific violation response procedures', () => {
            (0, globals_1.expect)(templateContent).toContain('Politely decline');
            (0, globals_1.expect)(templateContent).toContain('Remind of benefits');
            (0, globals_1.expect)(templateContent).toContain('Offer to complete current workflow');
        });
    });
    (0, globals_1.describe)('WF-UNIT-017: Task Completion Verification', () => {
        (0, globals_1.it)('should emphasize task completion before new work', () => {
            (0, globals_1.expect)(templateContent).toContain('complete the current workflow');
            (0, globals_1.expect)(templateContent).toContain('before moving to next task');
            (0, globals_1.expect)(templateContent).toContain('finish the current task properly');
        });
        (0, globals_1.it)('should define completion criteria', () => {
            (0, globals_1.expect)(templateContent).toContain('Current task is documented and committed');
            (0, globals_1.expect)(templateContent).toContain('All tests are passing');
            (0, globals_1.expect)(templateContent).toContain('Documentation is updated');
        });
    });
    (0, globals_1.describe)('WF-UNIT-018: Integration with Existing Workflow', () => {
        (0, globals_1.it)('should integrate smoothly with documentation-first principle', () => {
            (0, globals_1.expect)(templateContent).toContain('Documentation-First Principle');
            (0, globals_1.expect)(templateContent).toContain('Single-Task Focus');
            (0, globals_1.expect)(templateContent).toContain('one change at a time');
        });
        (0, globals_1.it)('should maintain consistency with workflow enforcement rules', () => {
            (0, globals_1.expect)(templateContent).toContain('Workflow Enforcement Rules');
            (0, globals_1.expect)(templateContent).toContain('Quality Gates');
            (0, globals_1.expect)(templateContent).toContain('No parallel tasks');
        });
    });
});
//# sourceMappingURL=single-task-focus.test.js.map