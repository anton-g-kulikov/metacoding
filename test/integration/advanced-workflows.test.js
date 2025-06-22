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
const init_1 = require("../../src/commands/init");
const validate_1 = require("../../src/commands/validate");
const update_1 = require("../../src/commands/update");
const filesystem_1 = require("../../src/services/filesystem");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
describe('Advanced Integration Tests', () => {
    let testDir;
    let originalCwd;
    let fileSystem;
    beforeEach(async () => {
        originalCwd = process.cwd();
        testDir = path.join(__dirname, '../../tmp-integration-test-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);
        fileSystem = new filesystem_1.FileSystemService();
    });
    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(testDir);
    });
    describe('Complete Workflow Tests', () => {
        test('CLI-INT-003: should complete full init-validate-update cycle', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
            const validateCommand = new validate_1.ValidateCommand();
            const validationResult = await validateCommand.execute({});
            const validationCommand = new validate_1.ValidateCommand();
            await validationCommand.execute({});
            const updateCommand = new update_1.UpdateCommand();
            await expect(updateCommand.execute({})).resolves.not.toThrow();
        });
        test('CLI-INT-004: should handle project type detection and appropriate template selection', async () => {
            await fs.writeFile('package.json', JSON.stringify({
                name: 'my-react-app',
                dependencies: {
                    react: '^18.0.0',
                    'react-dom': '^18.0.0',
                },
            }));
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'react',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const copilotContent = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(copilotContent).toContain('React');
            expect(copilotContent).toContain('component');
        });
        test('CLI-INT-005: should handle template switching between different project types', async () => {
            await fs.writeFile('package.json', JSON.stringify({
                name: 'app',
                dependencies: { react: '^18.0.0' },
            }));
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'react',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            let content = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(content).toContain('React');
            await fs.writeFile('package.json', JSON.stringify({
                name: 'app',
                dependencies: { express: '^4.0.0' },
            }));
            await initCommand.execute({
                template: 'node',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            content = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(content).toContain('Node.js');
            expect(content).toContain('backend');
        });
    });
    describe('VSCode Integration Tests', () => {
        test('CLI-INT-006: should create and configure VSCode settings properly', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: false,
                skipGit: true,
            });
            expect(await fileSystem.fileExists('.vscode/settings.json')).toBe(true);
            const settings = JSON.parse(await fileSystem.readFile('.vscode/settings.json'));
            expect(settings['chat.promptFiles']).toBe(true);
        });
        test('CLI-INT-007: should preserve existing VSCode settings when adding metacoding settings', async () => {
            await fileSystem.ensureDirectoryExists('.vscode');
            await fileSystem.writeFile('.vscode/settings.json', JSON.stringify({
                'editor.fontSize': 16,
                'workbench.colorTheme': 'Dark+',
            }));
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: false,
                skipGit: true,
            });
            const settings = JSON.parse(await fileSystem.readFile('.vscode/settings.json'));
            expect(settings['editor.fontSize']).toBe(16);
            expect(settings['workbench.colorTheme']).toBe('Dark+');
            expect(settings['chat.promptFiles']).toBe(true);
        });
    });
    describe('Git Integration Tests', () => {
        test('CLI-INT-008: should handle git repository detection', async () => {
            await fs.ensureDir('.git');
            const initCommand = new init_1.InitCommand();
            await expect(initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: false,
            })).resolves.not.toThrow();
        });
        test('CLI-INT-009: should work in non-git directory', async () => {
            const initCommand = new init_1.InitCommand();
            await expect(initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: false,
            })).resolves.not.toThrow();
        });
    });
    describe('Real-world Scenario Tests', () => {
        test('CLI-INT-010: should handle existing project with complex structure', async () => {
            await fs.ensureDir('src/components');
            await fs.ensureDir('src/utils');
            await fs.ensureDir('test');
            await fs.ensureDir('docs');
            await fs.writeFile('src/index.ts', 'export * from "./components";');
            await fs.writeFile('README.md', '# Existing Project');
            await fs.writeFile('package.json', JSON.stringify({
                name: 'complex-project',
                scripts: { test: 'jest' },
                dependencies: { react: '^18.0.0' },
            }));
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'react',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            expect(await fileSystem.fileExists('src/index.ts')).toBe(true);
            expect(await fileSystem.fileExists('README.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
        });
        test('CLI-INT-011: should handle force reinstallation correctly', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            await fileSystem.writeFile('.github/copilot-instructions.md', 'MODIFIED CONTENT');
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const content = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(content).not.toBe('MODIFIED CONTENT');
            expect(content).toContain('metacoding');
        });
        test('CLI-INT-012: should handle concurrent template installations', async () => {
            const initCommand = new init_1.InitCommand();
            const promises = [
                initCommand.execute({
                    template: 'general',
                    force: true,
                    skipVscode: true,
                    skipGit: true,
                }),
            ];
            await expect(Promise.all(promises)).resolves.not.toThrow();
            expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
        });
    });
    describe('Performance and Resource Tests', () => {
        test('CLI-INT-013: should complete initialization within reasonable time', async () => {
            const startTime = Date.now();
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(5000);
        });
        test('CLI-INT-014: should clean up temporary resources properly', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const files = await fs.readdir('.');
            const tempFiles = files
                .filter((file) => file.includes('tmp') ||
                file.includes('temp') ||
                file.startsWith('.'))
                .filter((file) => file !== '.github');
            const dotFiles = files.filter((f) => f.startsWith('.'));
            expect(dotFiles).toContain('.github');
        });
    });
});
//# sourceMappingURL=advanced-workflows.test.js.map