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
const filesystem_1 = require("../../src/services/filesystem");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
describe('Package Structure Validation', () => {
    let testDir;
    let originalCwd;
    let fileSystem;
    beforeEach(async () => {
        originalCwd = process.cwd();
        testDir = path.join(__dirname, '../../tmp-structure-test-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);
        fileSystem = new filesystem_1.FileSystemService();
    });
    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(testDir);
    });
    describe('General Template Structure', () => {
        test('CLI-UNIT-020: should create all required metacoding files for general template', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            expect(await fileSystem.fileExists('.github')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions')).toBe(true);
            expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions/code-review.instructions.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions/docs-update.instructions.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions/release.instructions.md')).toBe(true);
            expect(await fileSystem.fileExists('.github/instructions/test-runner.instructions.md')).toBe(true);
        });
        test('CLI-UNIT-021: should verify copilot instructions content for general template', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const content = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(content).not.toContain('{{PROJECT_DESCRIPTION}}');
            expect(content).not.toContain('{{TECH_STACK}}');
            expect(content).toContain('mandatory development workflow');
            expect(content).toContain('Step 1: Task Understanding and Planning');
            expect(content).toContain('workflow completion');
        });
    });
    describe('React Template Structure', () => {
        test('CLI-UNIT-022: should create React-specific files and content', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'react',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const copilotContent = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(copilotContent).toContain('React');
            expect(copilotContent).toContain('React');
            expect(copilotContent).toContain('component');
            expect(copilotContent).toContain('JSX');
        });
        test('CLI-UNIT-023: should include React-specific test conventions', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'react',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const testRunnerContent = await fileSystem.readFile('.github/instructions/test-runner.instructions.md');
            expect(testRunnerContent).toContain('COMP` - React component tests');
            expect(testRunnerContent).toContain('HOOK` - Custom hooks tests');
            expect(testRunnerContent).toContain('PAGE` - Page/Route');
        });
    });
    describe('Node.js Template Structure', () => {
        test('CLI-UNIT-024: should create Node.js-specific files and content', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'node',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const copilotContent = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(copilotContent).toContain('Node.js');
            expect(copilotContent).toContain('backend');
            expect(copilotContent).toContain('API');
            expect(copilotContent).toContain('server');
        });
        test('CLI-UNIT-025: should include Node.js-specific test conventions', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'node',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const testRunnerContent = await fileSystem.readFile('.github/instructions/test-runner.instructions.md');
            expect(testRunnerContent).toContain('`API` - REST API endpoint tests');
            expect(testRunnerContent).toContain('`SRV` - Service layer tests');
            expect(testRunnerContent).toContain('`DB` - Database/ORM tests');
        });
    });
    describe('Python Template Structure', () => {
        test('CLI-UNIT-026: should create Python-specific files and content', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'python',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const copilotContent = await fileSystem.readFile('.github/copilot-instructions.md');
            expect(copilotContent).toContain('Python');
            expect(copilotContent).toContain('Django');
            expect(copilotContent).toContain('Flask');
            expect(copilotContent).toContain('backend');
        });
        test('CLI-UNIT-027: should include Python-specific test conventions', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'python',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const testRunnerContent = await fileSystem.readFile('.github/instructions/test-runner.instructions.md');
            expect(testRunnerContent).toContain('`VIEW` - Django views/FastAPI endpoints tests');
            expect(testRunnerContent).toContain('`MODEL` - Django models/SQLAlchemy tests');
            expect(testRunnerContent).toContain('`FORM` - Django forms/Pydantic validators tests');
        });
    });
    describe('File Content Validation', () => {
        test('CLI-UNIT-028: should ensure all instruction files have proper front matter', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const instructionFiles = [
                '.github/instructions/code-review.instructions.md',
                '.github/instructions/docs-update.instructions.md',
                '.github/instructions/release.instructions.md',
                '.github/instructions/test-runner.instructions.md',
            ];
            for (const file of instructionFiles) {
                const content = await fileSystem.readFile(file);
                expect(content).toMatch(/^---\n/);
                expect(content).toContain('description:');
                expect(content).toContain('applyTo:');
            }
        });
        test('CLI-UNIT-029: should ensure copilot instructions contain workflow enforcement', async () => {
            const templates = ['general', 'react', 'node', 'python'];
            for (const template of templates) {
                const initCommand = new init_1.InitCommand();
                await initCommand.execute({
                    template,
                    force: true,
                    skipVscode: true,
                    skipGit: true,
                });
                const content = await fileSystem.readFile('.github/copilot-instructions.md');
                expect(content).toContain('Mandatory Development Process');
                expect(content).toContain('Step 1: Task Understanding and Planning');
                expect(content).toContain('workflow completion');
                await fs.remove('.github');
            }
        });
    });
    describe('Directory Structure Validation', () => {
        test('CLI-UNIT-030: should create proper directory hierarchy', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            const githubStat = await fs.stat('.github');
            expect(githubStat.isDirectory()).toBe(true);
            const instructionsStat = await fs.stat('.github/instructions');
            expect(instructionsStat.isDirectory()).toBe(true);
            const copilotStat = await fs.stat('.github/copilot-instructions.md');
            expect(copilotStat.isFile()).toBe(true);
        });
    });
});
//# sourceMappingURL=package-structure.test.js.map