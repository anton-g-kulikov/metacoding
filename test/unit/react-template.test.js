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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const globals_1 = require("@jest/globals");
const template_manager_1 = require("../../src/services/template-manager");
(0, globals_1.describe)('React Template', () => {
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    const reactTemplateDir = path.join(templatesDir, 'react');
    const templateManager = new template_manager_1.TemplateManager();
    (0, globals_1.describe)('Template Structure', () => {
        (0, globals_1.test)('TMPL-UNIT-019: should have react template directory', async () => {
            const exists = await fs.pathExists(reactTemplateDir);
            (0, globals_1.expect)(exists).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-020: should have template.json configuration file', async () => {
            const templateJsonPath = path.join(reactTemplateDir, 'template.json');
            const exists = await fs.pathExists(templateJsonPath);
            (0, globals_1.expect)(exists).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-021: should have React-specific instruction files', async () => {
            const requiredFiles = [
                'template.json',
                'react.coding.instructions.md',
                'react.docs.instructions.md',
                'react.testing.instructions.md',
            ];
            for (const file of requiredFiles) {
                const filePath = path.join(reactTemplateDir, file);
                const exists = await fs.pathExists(filePath);
                (0, globals_1.expect)(exists).toBe(true);
            }
        });
    });
    (0, globals_1.describe)('Template Configuration', () => {
        (0, globals_1.test)('TMPL-UNIT-022: should have valid template.json with React metadata', async () => {
            const templateJsonPath = path.join(reactTemplateDir, 'template.json');
            const templateConfig = await fs.readJson(templateJsonPath);
            (0, globals_1.expect)(templateConfig).toHaveProperty('name', 'react');
            (0, globals_1.expect)(templateConfig).toHaveProperty('description');
            (0, globals_1.expect)(templateConfig.description).toContain('React');
            (0, globals_1.expect)(templateConfig).toHaveProperty('vscodeSettings');
        });
    });
    (0, globals_1.describe)('React Instruction Files', () => {
        (0, globals_1.test)('TMPL-UNIT-023: should have React-specific coding instructions', async () => {
            const instructionsPath = path.join(reactTemplateDir, 'react.coding.instructions.md');
            const exists = await fs.pathExists(instructionsPath);
            (0, globals_1.expect)(exists).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-024: should have React-specific testing instructions', async () => {
            const testingPath = path.join(reactTemplateDir, 'react.testing.instructions.md');
            const exists = await fs.pathExists(testingPath);
            (0, globals_1.expect)(exists).toBe(true);
        });
        (0, globals_1.test)('TMPL-UNIT-025: coding instructions should contain React-specific content', async () => {
            const instructionsPath = path.join(reactTemplateDir, 'react.coding.instructions.md');
            const content = await fs.readFile(instructionsPath, 'utf-8');
            (0, globals_1.expect)(content).toContain('React');
            (0, globals_1.expect)(content).toContain('component');
            (0, globals_1.expect)(content).toContain('TypeScript');
            (0, globals_1.expect)(content).toContain('hooks');
        });
    });
    (0, globals_1.describe)('Template Manager Integration', () => {
        (0, globals_1.test)('TMPL-UNIT-026: should list React template as available', async () => {
            const templates = await templateManager.getAvailableTemplates();
            (0, globals_1.expect)(templates).toContain('react');
        });
        (0, globals_1.test)('TMPL-UNIT-027: should load React template successfully', async () => {
            const reactTemplate = await templateManager.getTemplate('react');
            (0, globals_1.expect)(reactTemplate.name).toBe('react');
            (0, globals_1.expect)(reactTemplate.description).toContain('React');
            (0, globals_1.expect)(reactTemplate.files).toBeDefined();
            (0, globals_1.expect)(reactTemplate.files.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=react-template.test.js.map