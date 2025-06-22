"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const template_manager_1 = require("../../src/services/template-manager");
(0, globals_1.describe)('General Template TypeScript Support', () => {
    let templateManager;
    (0, globals_1.beforeEach)(() => {
        templateManager = new template_manager_1.TemplateManager();
    });
    const findFileByDestination = (files, destination) => {
        return files.find((f) => f.destination === destination);
    };
    const filterFilesByPattern = (files, pattern) => {
        return files.filter((f) => f.destination.includes(pattern));
    };
    (0, globals_1.describe)('GEN-UNIT-001: General template with TypeScript loads only TypeScript files', () => {
        (0, globals_1.it)('should load TypeScript instructions when TypeScript is in techStack', async () => {
            const projectConfig = {
                name: 'test-project',
                description: 'Test project with TypeScript',
                techStack: ['TypeScript'],
                projectType: 'general',
                testFramework: 'Jest',
                buildTool: 'TypeScript Compiler',
            };
            const template = await templateManager.getTemplate('general', projectConfig);
            const typescriptCodingFile = findFileByDestination(template.files, '.github/instructions/typescript.coding.instructions.md');
            const typescriptDocsFile = findFileByDestination(template.files, '.github/instructions/typescript.docs.instructions.md');
            const typescriptTestingFile = findFileByDestination(template.files, '.github/instructions/typescript.testing.instructions.md');
            (0, globals_1.expect)(typescriptCodingFile).toBeDefined();
            (0, globals_1.expect)(typescriptDocsFile).toBeDefined();
            (0, globals_1.expect)(typescriptTestingFile).toBeDefined();
            const pythonFiles = filterFilesByPattern(template.files, 'python.');
            const reactFiles = filterFilesByPattern(template.files, 'react.');
            (0, globals_1.expect)(pythonFiles).toHaveLength(0);
            (0, globals_1.expect)(reactFiles).toHaveLength(0);
            const codeReviewFile = findFileByDestination(template.files, '.github/instructions/code-review.instructions.md');
            const docsUpdateFile = findFileByDestination(template.files, '.github/instructions/docs-update.instructions.md');
            const copilotInstructionsFile = findFileByDestination(template.files, '.github/copilot-instructions.md');
            (0, globals_1.expect)(codeReviewFile).toBeDefined();
            (0, globals_1.expect)(docsUpdateFile).toBeDefined();
            (0, globals_1.expect)(copilotInstructionsFile).toBeDefined();
            const testRunnerFile = findFileByDestination(template.files, '.github/instructions/test-runner.instructions.md');
            (0, globals_1.expect)(testRunnerFile).toBeDefined();
        });
        (0, globals_1.it)('should not load TypeScript instructions when TypeScript is not in techStack', async () => {
            const projectConfig = {
                name: 'test-project',
                description: 'Test project without TypeScript',
                techStack: ['JavaScript'],
                projectType: 'general',
                testFramework: 'Jest',
            };
            const template = await templateManager.getTemplate('general', projectConfig);
            const typescriptFiles = filterFilesByPattern(template.files, 'typescript.');
            (0, globals_1.expect)(typescriptFiles).toHaveLength(0);
            const codeReviewFile = findFileByDestination(template.files, '.github/instructions/code-review.instructions.md');
            (0, globals_1.expect)(codeReviewFile).toBeDefined();
        });
        (0, globals_1.it)('should work with backwards compatibility when no project config is provided', async () => {
            const template = await templateManager.getTemplate('general');
            (0, globals_1.expect)(template).toBeDefined();
            (0, globals_1.expect)(template.name).toBe('general');
            const universalFiles = template.files.filter((f) => f.destination.includes('.github/instructions/') ||
                f.destination.includes('.github/copilot-instructions.md'));
            (0, globals_1.expect)(universalFiles.length).toBeGreaterThan(0);
        });
        (0, globals_1.it)('should still load TypeScript instructions for node template (backwards compatibility)', async () => {
            const projectConfig = {
                name: 'test-project',
                description: 'Test Node.js project',
                techStack: ['Node.js'],
                projectType: 'node',
                testFramework: 'Jest',
            };
            const template = await templateManager.getTemplate('node', projectConfig);
            const typescriptCodingFile = findFileByDestination(template.files, '.github/instructions/typescript.coding.instructions.md');
            (0, globals_1.expect)(typescriptCodingFile).toBeDefined();
        });
        (0, globals_1.it)('should handle invalid template name gracefully', async () => {
            const projectConfig = {
                name: 'test-project',
                description: 'Test project',
                techStack: ['TypeScript'],
                projectType: 'general',
                testFramework: 'Jest',
            };
            await (0, globals_1.expect)(templateManager.getTemplate('non-existent-template', projectConfig)).rejects.toThrow();
        });
        (0, globals_1.it)('should handle empty tech stack gracefully', async () => {
            const projectConfig = {
                name: 'test-project',
                description: 'Test project with empty tech stack',
                techStack: [],
                projectType: 'general',
                testFramework: 'Jest',
            };
            const template = await templateManager.getTemplate('general', projectConfig);
            (0, globals_1.expect)(template).toBeDefined();
            const typescriptFiles = filterFilesByPattern(template.files, 'typescript.');
            (0, globals_1.expect)(typescriptFiles).toHaveLength(0);
            const codeReviewFile = findFileByDestination(template.files, '.github/instructions/code-review.instructions.md');
            (0, globals_1.expect)(codeReviewFile).toBeDefined();
        });
    });
});
//# sourceMappingURL=general-template-typescript.test.js.map