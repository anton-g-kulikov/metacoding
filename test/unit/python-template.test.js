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
(0, globals_1.describe)('Python Template', () => {
    const templatesDir = path.join(__dirname, '../../templates');
    const pythonTemplateDir = path.join(templatesDir, 'python');
    (0, globals_1.describe)('Template Structure', () => {
        (0, globals_1.test)('TMPL-UNIT-010: should have python template directory', () => {
            (0, globals_1.expect)(fs.existsSync(pythonTemplateDir)).toBe(true);
            (0, globals_1.expect)(fs.statSync(pythonTemplateDir).isDirectory()).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-011: should have template.json file', () => {
            const templateJsonPath = path.join(pythonTemplateDir, 'template.json');
            (0, globals_1.expect)(fs.existsSync(templateJsonPath)).toBe(true);
            (0, globals_1.expect)(fs.statSync(templateJsonPath).isFile()).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-012: should have all required instruction files', () => {
            const requiredFiles = [
                'template.json',
                'python.coding.instructions.md',
                'python.docs.instructions.md',
                'python.testing.instructions.md',
            ];
            requiredFiles.forEach((file) => {
                const filePath = path.join(pythonTemplateDir, file);
                (0, globals_1.expect)(fs.existsSync(filePath)).toBe(true);
                (0, globals_1.expect)(fs.statSync(filePath).isFile()).toBe(true);
            });
        });
    });
    (0, globals_1.describe)('Template Configuration', () => {
        (0, globals_1.test)('TMPL-UNIT-013: should have valid template.json with Python-specific settings', () => {
            const templateJsonPath = path.join(pythonTemplateDir, 'template.json');
            const templateContent = fs.readFileSync(templateJsonPath, 'utf8');
            const template = JSON.parse(templateContent);
            (0, globals_1.expect)(template.name).toBe('python');
            (0, globals_1.expect)(template.description).toContain('Python');
            (0, globals_1.expect)(template.description).toContain('backend');
            (0, globals_1.expect)(template.vscodeSettings).toBeDefined();
            (0, globals_1.expect)(template.vscodeSettings['github.copilot.chat.codeGeneration.useInstructionFiles']).toBe(true);
            (0, globals_1.expect)(template.vscodeSettings['chat.promptFiles']).toBe(true);
        });
    });
    (0, globals_1.describe)('Python Instruction Files', () => {
        (0, globals_1.test)('TMPL-UNIT-014: python coding instructions should contain Python-specific content', () => {
            const instructionsPath = path.join(pythonTemplateDir, 'python.coding.instructions.md');
            const content = fs.readFileSync(instructionsPath, 'utf8');
            (0, globals_1.expect)(content).toContain('Python');
            (0, globals_1.expect)(content).toContain('PEP 8');
            (0, globals_1.expect)(content).toContain('pytest');
            (0, globals_1.expect)(content).toContain('type hints');
            (0, globals_1.expect)(content).toContain('Black formatter');
            (0, globals_1.expect)(content).toContain('snake_case');
            (0, globals_1.expect)(content).toContain('Code Quality Guidelines');
            (0, globals_1.expect)(content).toContain('Naming Conventions');
        });
        (0, globals_1.test)('TMPL-UNIT-015: python docs instructions should contain Python-specific patterns', () => {
            const docsPath = path.join(pythonTemplateDir, 'python.docs.instructions.md');
            const content = fs.readFileSync(docsPath, 'utf8');
            (0, globals_1.expect)(content).toContain('Python');
            (0, globals_1.expect)(content).toContain('Django');
            (0, globals_1.expect)(content).toContain('documentation');
            (0, globals_1.expect)(content).toContain('docstring');
            (0, globals_1.expect)(content).toContain('docstring');
            (0, globals_1.expect)(content).toContain('Google-style');
        });
        (0, globals_1.test)('TMPL-UNIT-016: python testing instructions should contain Python testing patterns', () => {
            const testingPath = path.join(pythonTemplateDir, 'python.testing.instructions.md');
            const content = fs.readFileSync(testingPath, 'utf8');
            (0, globals_1.expect)(content).toContain('Python');
            (0, globals_1.expect)(content).toContain('Django');
            (0, globals_1.expect)(content).toContain('pytest');
            (0, globals_1.expect)(content).toContain('testing');
            (0, globals_1.expect)(content).toContain('pytest');
            (0, globals_1.expect)(content).toContain('testing');
        });
        (0, globals_1.test)('TMPL-UNIT-017: all instruction files should enforce workflow standards', () => {
            const instructionFiles = [
                'python.coding.instructions.md',
                'python.docs.instructions.md',
                'python.testing.instructions.md',
            ];
            instructionFiles.forEach((fileName) => {
                const filePath = path.join(pythonTemplateDir, fileName);
                const content = fs.readFileSync(filePath, 'utf8');
                (0, globals_1.expect)(content).toMatch(/Python/i);
            });
        });
        (0, globals_1.test)('TMPL-UNIT-018: all instruction files should include Python-specific guidance', () => {
            const instructionFiles = [
                'python.coding.instructions.md',
                'python.docs.instructions.md',
                'python.testing.instructions.md',
            ];
            instructionFiles.forEach((fileName) => {
                const filePath = path.join(pythonTemplateDir, fileName);
                const content = fs.readFileSync(filePath, 'utf8');
                (0, globals_1.expect)(content).toMatch(/(Python|Django|Flask|FastAPI)/i);
            });
        });
    });
});
//# sourceMappingURL=python-template.test.js.map