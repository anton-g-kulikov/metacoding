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
const template_manager_1 = require("../../src/services/template-manager");
const project_detector_1 = require("../../src/services/project-detector");
const vscode_1 = require("../../src/services/vscode");
const filesystem_1 = require("../../src/services/filesystem");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
describe('Service Integration', () => {
    let testDir;
    let originalCwd;
    beforeEach(async () => {
        originalCwd = process.cwd();
        testDir = path.join(__dirname, '../../tmp-service-test-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);
    });
    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(testDir);
    });
    describe('Template Manager Service', () => {
        test('CLI-UNIT-031: should list all available templates', async () => {
            const templateManager = new template_manager_1.TemplateManager();
            const templates = await templateManager.getAvailableTemplates();
            expect(templates).toContain('general');
            expect(templates).toContain('react');
            expect(templates).toContain('node');
            expect(templates).toContain('python');
            expect(templates.length).toBeGreaterThanOrEqual(4);
        });
        test('CLI-UNIT-032: should load template configuration correctly', async () => {
            const templateManager = new template_manager_1.TemplateManager();
            const template = await templateManager.getTemplate('general');
            expect(template.name).toBe('general');
            expect(template.description).toBeDefined();
            expect(template.files).toBeDefined();
            expect(Array.isArray(template.files)).toBe(true);
            expect(template.files.length).toBeGreaterThan(0);
        });
        test('CLI-UNIT-033: should throw error for non-existent template', async () => {
            const templateManager = new template_manager_1.TemplateManager();
            await expect(templateManager.getTemplate('non-existent')).rejects.toThrow();
        });
        test('CLI-UNIT-034: should validate template file structure', async () => {
            const templateManager = new template_manager_1.TemplateManager();
            const templates = ['general', 'react', 'node', 'python'];
            for (const templateName of templates) {
                const template = await templateManager.getTemplate(templateName);
                const requiredFiles = [
                    'copilot-instructions.md',
                    'code-review.instructions.md',
                    'docs-update.instructions.md',
                    'release.instructions.md',
                    'test-runner.instructions.md',
                ];
                for (const requiredFile of requiredFiles) {
                    const hasFile = template.files.some((file) => file.destination.includes(requiredFile));
                    if (!hasFile) {
                        console.log(`Missing required file ${requiredFile} in template ${templateName}`);
                        console.log('Available files:', template.files.map((f) => f.destination));
                    }
                    expect(hasFile).toBe(true);
                }
            }
        });
    });
    describe('Project Detector Service', () => {
        test('CLI-UNIT-035: should detect Node.js project from package.json', async () => {
            await fs.writeFile('package.json', JSON.stringify({
                name: 'test-project',
                dependencies: {
                    express: '^4.0.0',
                },
            }));
            const detector = new project_detector_1.ProjectDetector();
            const project = await detector.detectProject();
            expect(project.type).toBe('node');
        });
        test('CLI-UNIT-036: should detect React project from package.json', async () => {
            await fs.writeFile('package.json', JSON.stringify({
                name: 'test-project',
                dependencies: {
                    react: '^18.0.0',
                    'react-dom': '^18.0.0',
                },
            }));
            const detector = new project_detector_1.ProjectDetector();
            const project = await detector.detectProject();
            expect(project.type).toBe('react');
        });
        test('CLI-UNIT-037: should detect Python project from requirements.txt', async () => {
            await fs.writeFile('requirements.txt', 'django==4.0.0\nflask==2.0.0');
            const detector = new project_detector_1.ProjectDetector();
            const project = await detector.detectProject();
            expect(project.type).toBe('python');
        });
        test('CLI-UNIT-038: should default to general for unknown project types', async () => {
            const detector = new project_detector_1.ProjectDetector();
            const project = await detector.detectProject();
            expect(project.type).toBe('general');
        });
        test('CLI-UNIT-039: should handle malformed package.json gracefully', async () => {
            await fs.writeFile('package.json', '{ invalid json }');
            const detector = new project_detector_1.ProjectDetector();
            const project = await detector.detectProject();
            expect(project.type).toBe('general');
        });
    });
    describe('VSCode Service', () => {
        test('CLI-UNIT-040: should create .vscode directory and settings', async () => {
            const vscodeService = new vscode_1.VSCodeService();
            const fileSystem = new filesystem_1.FileSystemService();
            await vscodeService.updateSettings({
                'chat.promptFiles': true,
                'editor.wordWrap': 'on',
            });
            expect(await fileSystem.fileExists('.vscode')).toBe(true);
            expect(await fileSystem.fileExists('.vscode/settings.json')).toBe(true);
            const settingsContent = await fileSystem.readFile('.vscode/settings.json');
            const settings = JSON.parse(settingsContent);
            expect(settings['chat.promptFiles']).toBe(true);
            expect(settings['editor.wordWrap']).toBe('on');
        });
        test('CLI-UNIT-041: should merge with existing VSCode settings', async () => {
            const vscodeService = new vscode_1.VSCodeService();
            const fileSystem = new filesystem_1.FileSystemService();
            await fileSystem.ensureDirectoryExists('.vscode');
            await fileSystem.writeFile('.vscode/settings.json', JSON.stringify({
                'editor.fontSize': 14,
                'chat.promptFiles': false,
            }));
            await vscodeService.updateSettings({
                'chat.promptFiles': true,
                'editor.wordWrap': 'on',
            });
            const settingsContent = await fileSystem.readFile('.vscode/settings.json');
            const settings = JSON.parse(settingsContent);
            expect(settings['editor.fontSize']).toBe(14);
            expect(settings['chat.promptFiles']).toBe(true);
            expect(settings['editor.wordWrap']).toBe('on');
        });
        test('CLI-UNIT-042: should handle invalid existing settings.json', async () => {
            const vscodeService = new vscode_1.VSCodeService();
            const fileSystem = new filesystem_1.FileSystemService();
            await fileSystem.ensureDirectoryExists('.vscode');
            await fileSystem.writeFile('.vscode/settings.json', '{ invalid json }');
            await expect(vscodeService.updateSettings({
                'chat.promptFiles': true,
            })).resolves.not.toThrow();
            const settingsContent = await fileSystem.readFile('.vscode/settings.json');
            const settings = JSON.parse(settingsContent);
            expect(settings['chat.promptFiles']).toBe(true);
        });
    });
    describe('Service Integration Workflows', () => {
        test('CLI-UNIT-043: should integrate template manager with file system for full setup', async () => {
            const templateManager = new template_manager_1.TemplateManager();
            const fileSystem = new filesystem_1.FileSystemService();
            const template = await templateManager.getTemplate('general');
            const mockConfig = {
                name: 'test-project',
                description: 'A test project',
                techStack: ['TypeScript', 'Jest'],
                projectType: 'general',
            };
            const processedFiles = await templateManager.processTemplate(template, mockConfig);
            for (const file of processedFiles) {
                await fileSystem.ensureDirectoryExists(path.dirname(file.path));
                await fileSystem.writeFile(file.path, file.content);
            }
            expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions/code-review.instructions.md')).toBe(true);
        });
        test('CLI-UNIT-044: should integrate project detector with template manager', async () => {
            await fs.writeFile('package.json', JSON.stringify({
                name: 'test-react-app',
                dependencies: { react: '^18.0.0' },
            }));
            const detector = new project_detector_1.ProjectDetector();
            const templateManager = new template_manager_1.TemplateManager();
            const project = await detector.detectProject();
            const template = await templateManager.getTemplate(project.type);
            expect(project.type).toBe('react');
            expect(template.name).toBe('react');
        });
    });
});
//# sourceMappingURL=service-integration.test.js.map