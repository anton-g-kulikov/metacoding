"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const template_manager_1 = require("../services/template-manager");
const filesystem_1 = require("../services/filesystem");
const vscode_1 = require("../services/vscode");
const project_detector_1 = require("../services/project-detector");
const gitignore_manager_1 = require("../services/gitignore-manager");
class InitCommand {
    constructor() {
        this.templateManager = new template_manager_1.TemplateManager();
        this.fileSystem = new filesystem_1.FileSystemService();
        this.vscodeService = new vscode_1.VSCodeService();
        this.projectDetector = new project_detector_1.ProjectDetector();
        this.gitIgnoreManager = new gitignore_manager_1.GitIgnoreManager();
    }
    async execute(options) {
        console.log(chalk_1.default.cyan.bold('🚀 Welcome to metacoding Setup!\n'));
        const projectInfo = await this.projectDetector.detectProject();
        if ((await this.fileSystem.isMetaCodingSetup()) && !options.force) {
            const { proceed } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'metacoding is already set up in this directory. Do you want to reconfigure it?',
                    default: false,
                },
            ]);
            if (!proceed) {
                console.log(chalk_1.default.yellow('Setup cancelled.'));
                return;
            }
        }
        const config = await this.getProjectConfiguration(options, projectInfo);
        await this.setupProject(config, options);
        console.log(chalk_1.default.green.bold('\n✅ metacoding setup complete!\n'));
        this.displayNextSteps();
    }
    async getProjectConfiguration(options, projectInfo) {
        if (options.force && process.env.NODE_ENV === 'test') {
            return {
                name: projectInfo.name || 'test-project',
                description: 'A test project using metacoding workflow',
                techStack: ['TypeScript', 'Jest'],
                projectType: options.template,
                testFramework: 'Jest',
                buildTool: 'TypeScript Compiler',
            };
        }
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Project name:',
                default: projectInfo.name || 'my-project',
                validate: (input) => {
                    if (!input.trim()) {
                        return 'Project name is required';
                    }
                    return true;
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description:',
                default: 'A guided development project using metacoding workflow',
            },
            {
                type: 'list',
                name: 'projectType',
                message: 'What type of project are you working on?',
                choices: [
                    { name: 'React/Frontend Application', value: 'react' },
                    { name: 'Node.js/Backend Application', value: 'node' },
                    { name: 'Python Application', value: 'python' },
                    { name: 'General/Other', value: 'general' },
                ],
                default: options.template !== 'general' ? options.template : undefined,
            },
            {
                type: 'input',
                name: 'techStack',
                message: 'Tech stack (comma-separated):',
                default: (answers) => {
                    switch (answers.projectType) {
                        case 'react':
                            return 'React, TypeScript, Jest, Vite';
                        case 'node':
                            return 'Node.js, TypeScript, Express, Jest';
                        case 'python':
                            return 'Python, FastAPI, Pytest';
                        default:
                            return 'TypeScript, Jest';
                    }
                },
                filter: (input) => input.split(',').map((item) => item.trim()),
            },
            {
                type: 'confirm',
                name: 'enableTesting',
                message: 'Enable test automation features?',
                default: true,
            },
            {
                type: 'confirm',
                name: 'enableReleaseManagement',
                message: 'Enable release management workflow?',
                default: true,
            },
        ];
        const answers = await inquirer_1.default.prompt(questions);
        return {
            name: answers.name,
            description: answers.description,
            techStack: answers.techStack,
            projectType: answers.projectType,
            testFramework: answers.enableTesting
                ? this.getDefaultTestFramework(answers.projectType)
                : undefined,
            buildTool: this.getDefaultBuildTool(answers.projectType),
        };
    }
    async setupProject(config, options) {
        const spinner = (0, ora_1.default)('Setting up metacoding files...').start();
        try {
            await this.fileSystem.ensureDirectoryExists('.github');
            await this.fileSystem.ensureDirectoryExists('.github/instructions');
            const template = await this.templateManager.getTemplate(config.projectType, config);
            const processedFiles = await this.templateManager.processTemplate(template, config);
            for (const file of processedFiles) {
                await this.fileSystem.writeFile(file.path, file.content);
                spinner.text = `Created ${file.path}`;
            }
            spinner.text = 'Updating .gitignore with AI assistant exclusions...';
            await this.gitIgnoreManager.updateGitIgnore(process.cwd());
            if (!options.skipVscode) {
                spinner.text = 'Configuring VS Code settings...';
                await this.vscodeService.updateSettings(template.vscodeSettings || {});
            }
            spinner.succeed('metacoding files created successfully');
        }
        catch (error) {
            spinner.fail('Failed to set up metacoding');
            throw error;
        }
    }
    getDefaultTestFramework(projectType) {
        switch (projectType) {
            case 'react':
                return 'Jest + React Testing Library';
            case 'node':
                return 'Jest';
            case 'python':
                return 'Pytest';
            default:
                return 'Jest';
        }
    }
    getDefaultBuildTool(projectType) {
        switch (projectType) {
            case 'react':
                return 'Vite';
            case 'node':
                return 'TypeScript Compiler';
            case 'python':
                return 'Poetry';
            default:
                return 'TypeScript Compiler';
        }
    }
    displayNextSteps() {
        console.log(chalk_1.default.cyan('Next steps:'));
        console.log(chalk_1.default.dim('1.'), 'Restart VS Code to apply settings');
        console.log(chalk_1.default.dim('2.'), 'Open GitHub Copilot Chat');
        console.log(chalk_1.default.dim('3.'), 'Ask: "What are the coding standards for this project?"');
        console.log(chalk_1.default.dim('4.'), 'Start coding with guided workflow support!');
        console.log('');
        console.log(chalk_1.default.cyan('Need help?'), 'Visit https://github.com/anton-g-kulikov/metacoding');
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=init.js.map