"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('Workflow Enhancement - Documentation-First Principle', () => {
    const templatePath = path.join(__dirname, '../../templates/general/copilot-instructions.md');
    let templateContent;
    (0, globals_1.beforeAll)(() => {
        templateContent = fs.readFileSync(templatePath, 'utf8');
    });
    (0, globals_1.describe)('WF-UNIT-005: Documentation-first principle enforcement validation', () => {
        (0, globals_1.it)('should contain documentation-first principle section', () => {
            (0, globals_1.expect)(templateContent).toContain('Documentation-First Principle');
            (0, globals_1.expect)(templateContent).toContain('MANDATORY: Document first, execute second');
        });
        (0, globals_1.it)('should enforce no implementation without documentation', () => {
            (0, globals_1.expect)(templateContent).toContain('No Implementation Without Documentation');
            (0, globals_1.expect)(templateContent).toContain('Never begin any coding, testing, or implementation work until corresponding documentation is complete');
        });
    });
    (0, globals_1.describe)('WF-UNIT-006: Task documentation requirement before implementation', () => {
        (0, globals_1.it)('should require task documentation before work begins', () => {
            (0, globals_1.expect)(templateContent).toContain('Task Documentation Required');
            (0, globals_1.expect)(templateContent).toContain('Every task must be added to `/_meta/project-task-list.md` before work begins');
        });
        (0, globals_1.it)('should include task documentation in Step 2', () => {
            (0, globals_1.expect)(templateContent).toContain('Document before executing');
            (0, globals_1.expect)(templateContent).toContain('Task documentation requirement');
        });
    });
    (0, globals_1.describe)('WF-UNIT-007: Test case documentation requirement validation', () => {
        (0, globals_1.it)('should require test documentation before test implementation', () => {
            (0, globals_1.expect)(templateContent).toContain('Test Documentation Required');
            (0, globals_1.expect)(templateContent).toContain('All test cases must be documented in `/test/test-documentation.md` before writing any test code');
        });
        (0, globals_1.it)('should include test documentation requirement in Step 3', () => {
            (0, globals_1.expect)(templateContent).toContain('Document test cases first');
            (0, globals_1.expect)(templateContent).toContain('Test documentation requirement');
        });
    });
    (0, globals_1.describe)('WF-UNIT-008: Confirmation gate enforcement in workflow steps', () => {
        (0, globals_1.it)('should require explicit user confirmation', () => {
            (0, globals_1.expect)(templateContent).toContain('Confirmation Gates');
            (0, globals_1.expect)(templateContent).toContain('User must explicitly confirm understanding of plan, scope, and consequences');
        });
        (0, globals_1.it)('should include confirmation requirements in Step 1', () => {
            (0, globals_1.expect)(templateContent).toContain('Mandatory confirmation gates');
            (0, globals_1.expect)(templateContent).toContain('User must explicitly approve the plan, scope, and consequences before any work begins');
        });
    });
    (0, globals_1.describe)('WF-UNIT-009: Enhanced Step 1 confirmation requirements', () => {
        (0, globals_1.it)('should enforce documentation-first in Step 1', () => {
            (0, globals_1.expect)(templateContent).toContain('Document first, execute second');
            (0, globals_1.expect)(templateContent).toContain('No implementation work begins until all required documentation is complete');
        });
    });
    (0, globals_1.describe)('WF-UNIT-010: Enhanced Step 2 task management documentation', () => {
        (0, globals_1.it)('should enforce task documentation before execution in Step 2', () => {
            (0, globals_1.expect)(templateContent).toContain('Document before executing');
            (0, globals_1.expect)(templateContent).toContain('BEFORE any implementation work');
        });
    });
    (0, globals_1.describe)('WF-UNIT-011: Enhanced Step 3 TDD documentation requirements', () => {
        (0, globals_1.it)('should enforce test documentation before implementation in Step 3', () => {
            (0, globals_1.expect)(templateContent).toContain('BEFORE implementing any tests');
            (0, globals_1.expect)(templateContent).toContain('Only then implement tests');
            (0, globals_1.expect)(templateContent).toContain('Create actual test files after test cases are documented');
        });
    });
    (0, globals_1.describe)('Documentation-First Examples', () => {
        (0, globals_1.it)('should provide correct and incorrect examples', () => {
            (0, globals_1.expect)(templateContent).toContain('Examples of Required Documentation-First Workflow');
            (0, globals_1.expect)(templateContent).toContain('✅ Correct:');
            (0, globals_1.expect)(templateContent).toContain('❌ Incorrect:');
        });
        (0, globals_1.it)('should show proper task documentation workflow', () => {
            (0, globals_1.expect)(templateContent).toContain("I'll add this task to the task list, then document the test cases, then get your confirmation before implementing");
        });
        (0, globals_1.it)('should show improper workflow to avoid', () => {
            (0, globals_1.expect)(templateContent).toContain("I'll implement this feature and update the documentation afterwards");
        });
    });
    (0, globals_1.describe)('Communication Style Enhancement', () => {
        (0, globals_1.it)('should include documentation-first enforcement in communication style', () => {
            (0, globals_1.expect)(templateContent).toContain('Enforce documentation-first principle');
            (0, globals_1.expect)(templateContent).toContain('Implement confirmation gates');
        });
    });
});
//# sourceMappingURL=workflow-enhancement.test.js.map