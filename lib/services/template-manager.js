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
exports.TemplateManager = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
class TemplateManager {
    constructor() {
        this.templatesDir = path.join(__dirname, '../../templates');
        this.instructionsDir = this.templatesDir;
    }
    async getTemplate(templateName, projectConfig) {
        const templatePath = path.join(this.templatesDir, templateName);
        if (!(await fs.pathExists(templatePath))) {
            throw new Error(`Template '${templateName}' not found`);
        }
        const configPath = path.join(templatePath, 'template.json');
        if (!(await fs.pathExists(configPath))) {
            throw new Error(`Template configuration not found for '${templateName}'`);
        }
        const config = await fs.readJson(configPath);
        const filesDir = path.join(templatePath, 'files');
        const templateFiles = await this.loadTemplateFiles(filesDir);
        const instructionFiles = await this.loadInstructionFiles(templateName, projectConfig);
        const files = [...templateFiles, ...instructionFiles];
        return {
            name: templateName,
            description: config.description,
            files,
            prompts: config.prompts || [],
            vscodeSettings: config.vscodeSettings || {},
        };
    }
    async loadInstructionFiles(templateName, projectConfig) {
        const files = [];
        const generalPath = path.join(this.templatesDir, 'general');
        const universalFiles = [
            'copilot-instructions.md',
            'docs-update.instructions.md',
            'release.instructions.md',
            'code-review.instructions.md',
        ];
        for (const file of universalFiles) {
            const filePath = path.join(generalPath, file);
            if (await fs.pathExists(filePath)) {
                files.push({
                    source: `general/${file}`,
                    destination: file === 'copilot-instructions.md'
                        ? '.github/copilot-instructions.md'
                        : `.github/instructions/${file}`,
                    template: file === 'copilot-instructions.md',
                });
            }
        }
        const testingFiles = {
            react: 'react.testing.instructions.md',
            node: 'nodejs.testing.instructions.md',
            python: 'python.testing.instructions.md',
            javascript: 'test-runner.instructions.md',
            general: 'test-runner.instructions.md',
        };
        const testingFile = testingFiles[templateName];
        if (testingFile) {
            const templatePath = path.join(this.templatesDir, templateName);
            const testingFilePath = path.join(templatePath, testingFile);
            if (await fs.pathExists(testingFilePath)) {
                files.push({
                    source: `${templateName}/${testingFile}`,
                    destination: '.github/instructions/test-runner.instructions.md',
                    template: false,
                });
            }
            else if (templateName === 'javascript') {
                const generalTestingPath = path.join(generalPath, 'test-runner.instructions.md');
                if (await fs.pathExists(generalTestingPath)) {
                    files.push({
                        source: 'general/test-runner.instructions.md',
                        destination: '.github/instructions/test-runner.instructions.md',
                        template: false,
                    });
                }
            }
        }
        const typescriptTemplates = ['node', 'react'];
        const useTypeScript = typescriptTemplates.includes(templateName) ||
            projectConfig?.techStack?.includes('TypeScript');
        if (useTypeScript) {
            const typescriptPath = path.join(this.templatesDir, 'typescript');
            if (await fs.pathExists(typescriptPath)) {
                const typescriptFiles = await fs.readdir(typescriptPath);
                for (const file of typescriptFiles) {
                    if (file === 'template.json') {
                        continue;
                    }
                    if (file.endsWith('.instructions.md')) {
                        files.push({
                            source: `typescript/${file}`,
                            destination: `.github/instructions/${file}`,
                            template: false,
                        });
                    }
                }
            }
        }
        if (templateName !== 'general') {
            const templatePath = path.join(this.templatesDir, templateName);
            const templateFiles = await fs.readdir(templatePath);
            for (const file of templateFiles) {
                if (file === 'template.json' || universalFiles.includes(file)) {
                    continue;
                }
                if (file.endsWith('.instructions.md')) {
                    files.push({
                        source: `${templateName}/${file}`,
                        destination: `.github/instructions/${file}`,
                        template: false,
                    });
                }
            }
        }
        return files;
    }
    async processTemplate(template, config) {
        const processedFiles = [];
        for (const file of template.files) {
            let content;
            let filePath;
            if (file.source.includes('/')) {
                filePath = path.join(this.templatesDir, file.source);
            }
            else {
                filePath = path.join(this.templatesDir, template.name, file.source);
            }
            if (file.template) {
                const templateContent = await fs.readFile(filePath, 'utf8');
                content = this.processTemplateContent(templateContent, config);
            }
            else {
                content = await fs.readFile(filePath, 'utf8');
            }
            processedFiles.push({
                path: file.destination,
                content,
            });
        }
        return processedFiles;
    }
    async getAvailableTemplates() {
        if (!(await fs.pathExists(this.templatesDir))) {
            return [];
        }
        const items = await fs.readdir(this.templatesDir);
        const templates = [];
        const excludedTemplates = ['typescript'];
        for (const item of items) {
            const itemPath = path.join(this.templatesDir, item);
            const stat = await fs.stat(itemPath);
            if (stat.isDirectory() && !excludedTemplates.includes(item)) {
                const configPath = path.join(itemPath, 'template.json');
                if (await fs.pathExists(configPath)) {
                    templates.push(item);
                }
            }
        }
        return templates;
    }
    async loadTemplateFiles(filesDir) {
        const files = [];
        if (!(await fs.pathExists(filesDir))) {
            return files;
        }
        const templateName = path.basename(path.dirname(filesDir));
        const items = await fs.readdir(filesDir, { withFileTypes: true });
        for (const item of items) {
            if (item.isFile()) {
                const isTemplate = item.name.endsWith('.template');
                const source = `${templateName}/files/${item.name}`;
                let destination = item.name;
                if (isTemplate) {
                    destination = item.name.replace('.template', '');
                }
                if (destination === 'copilot-instructions.md' ||
                    destination.endsWith('.instructions.md')) {
                    continue;
                }
                files.push({
                    source,
                    destination,
                    template: isTemplate,
                });
            }
        }
        return files;
    }
    processTemplateContent(content, config) {
        const variables = {
            PROJECT_NAME: config.name,
            PROJECT_DESCRIPTION: config.description,
            TECH_STACK: Array.isArray(config.techStack)
                ? config.techStack.join(', ')
                : config.techStack,
            PROJECT_TYPE: config.projectType,
            TEST_FRAMEWORK: config.testFramework || 'Jest',
            BUILD_TOOL: config.buildTool || 'TypeScript Compiler',
            PROJECT_DOMAIN: this.getProjectDomain(config.projectType),
            PROJECT_SPECIFIC_GUIDANCE: this.getProjectSpecificGuidance(config.projectType),
        };
        let processedContent = content;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
        }
        processedContent = processedContent.replace(/\[short project description\]/g, config.description);
        processedContent = processedContent.replace(/\[Main goal 1\]/g, 'Provide guided development workflow');
        processedContent = processedContent.replace(/\[Main goal 2\]/g, 'Ensure code quality and best practices');
        processedContent = processedContent.replace(/\[Main goal 3\]/g, 'Enable efficient team collaboration');
        processedContent = processedContent.replace(/\[List primary technologies\]/g, variables.TECH_STACK);
        processedContent = processedContent.replace(/\[project specific\]/g, variables.PROJECT_DOMAIN);
        return processedContent;
    }
    getProjectDomain(projectType) {
        switch (projectType) {
            case 'react':
                return 'React frontend';
            case 'node':
                return 'Node.js backend';
            case 'python':
                return 'Python';
            default:
                return 'software';
        }
    }
    getProjectSpecificGuidance(projectType) {
        switch (projectType) {
            case 'react':
                return `
- **React Components:** Follow modern React patterns with hooks and functional components
- **JSX Best Practices:** Use semantic HTML elements and proper JSX syntax
- **State Management:** Implement efficient state management with React hooks
- **Component Architecture:** Build reusable, testable React components
- **Frontend Performance:** Optimize rendering and bundle size for better user experience`;
            case 'node':
                return `
- **Server Architecture:** Design scalable Node.js server applications
- **API Development:** Build robust REST APIs with proper error handling
- **Backend Services:** Implement efficient server-side business logic
- **Database Integration:** Use appropriate data persistence patterns
- **Performance:** Optimize server response times and resource usage`;
            case 'python':
                return `
- **Django Development:** Follow Django best practices for web applications
- **Flask Applications:** Build lightweight Flask applications when appropriate
- **Python Standards:** Adhere to PEP 8 and Python coding conventions
- **Backend Development:** Implement scalable Python backend solutions
- **Framework Integration:** Use appropriate Python frameworks for different use cases`;
            default:
                return `
- **Best Practices:** Follow language-specific coding standards and conventions
- **Architecture:** Implement modular and maintainable code structure
- **Testing:** Write comprehensive tests for all functionality
- **Documentation:** Maintain clear and up-to-date documentation`;
        }
    }
    async getInstructionFiles(templateType) {
        const instructionFiles = [];
        try {
            const generalPath = path.join(this.templatesDir, 'general');
            const universalFiles = [
                'copilot-instructions.md',
                'docs-update.instructions.md',
                'code-review.instructions.md',
            ];
            for (const file of universalFiles) {
                const filePath = path.join(generalPath, file);
                if (await fs.pathExists(filePath)) {
                    const content = await fs.readFile(filePath, 'utf-8');
                    instructionFiles.push({
                        path: `general/${file}`,
                        content,
                    });
                }
            }
            const templatePath = path.join(this.templatesDir, templateType);
            if (await fs.pathExists(templatePath)) {
                const codingFiles = await this.getCodingInstructionFiles(templateType);
                for (const file of codingFiles) {
                    const filePath = path.join(templatePath, file);
                    if (await fs.pathExists(filePath)) {
                        const content = await fs.readFile(filePath, 'utf-8');
                        instructionFiles.push({
                            path: `${templateType}/${file}`,
                            content,
                        });
                    }
                }
            }
            return instructionFiles;
        }
        catch (error) {
            throw new Error(`Failed to load instruction files for ${templateType}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    getCodingInstructionFiles(templateType) {
        const commonFiles = ['test-runner.instructions.md'];
        switch (templateType) {
            case 'typescript':
            case 'node':
                return [
                    ...commonFiles,
                    'typescript.coding.instructions.md',
                    'nodejs.testing.instructions.md',
                ];
            case 'react':
                return [
                    ...commonFiles,
                    'react.coding.instructions.md',
                    'react.testing.instructions.md',
                ];
            case 'python':
                return [
                    ...commonFiles,
                    'python.coding.instructions.md',
                    'python.testing.instructions.md',
                ];
            case 'javascript':
                return [
                    ...commonFiles,
                    'javascript.coding.instructions.md',
                    'javascript.testing.instructions.md',
                    'javascript.docs.instructions.md',
                ];
            default:
                return commonFiles;
        }
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=template-manager.js.map