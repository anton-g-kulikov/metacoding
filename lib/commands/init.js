"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const assistant_adapter_1 = require("../services/assistant-adapter");
const cursor_1 = require("../services/cursor");
const filesystem_1 = require("../services/filesystem");
const gitignore_manager_1 = require("../services/gitignore-manager");
const project_detector_1 = require("../services/project-detector");
const template_manager_1 = require("../services/template-manager");
const vscode_1 = require("../services/vscode");
class InitCommand {
    constructor() {
        this.templateManager = new template_manager_1.TemplateManager();
        this.fileSystem = new filesystem_1.FileSystemService();
        this.vscodeService = new vscode_1.VSCodeService();
        this.cursorService = new cursor_1.CursorService(this.templateManager, this.fileSystem);
        this.projectDetector = new project_detector_1.ProjectDetector();
        this.gitIgnoreManager = new gitignore_manager_1.GitIgnoreManager();
        this.assistantAdapterService = new assistant_adapter_1.AssistantAdapterService();
    }
    async execute(options) {
        console.log(chalk_1.default.cyan.bold('🚀 Welcome to metacoding Setup!\n'));
        const projectInfo = await this.projectDetector.detectProject();
        const existingAssistants = await this.assistantAdapterService.detectExistingAssistants(process.cwd());
        if (existingAssistants.length > 0 && !options.force) {
            console.log(chalk_1.default.yellow(`\nDetected existing assistant configurations: ${existingAssistants.join(', ')}`));
            const { migrationChoice } = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'migrationChoice',
                    message: 'How would you like to proceed?',
                    choices: [
                        { name: 'Overwrite existing configurations', value: 'overwrite' },
                        { name: 'Keep existing and add new ones', value: 'add' },
                        { name: 'Cancel setup', value: 'cancel' }
                    ]
                }
            ]);
            if (migrationChoice === 'cancel') {
                console.log(chalk_1.default.yellow('Setup cancelled.'));
                return;
            }
            if (migrationChoice === 'overwrite') {
                options.force = true;
            }
        }
        const environmentChoice = await this.getEnvironmentChoice(options);
        const ideChoice = environmentChoice === 'ide' ? await this.getIdeChoice(options) : undefined;
        const assistantChoices = await this.getAssistantChoices(options, environmentChoice);
        const config = await this.getProjectConfiguration(options, projectInfo, environmentChoice, ideChoice);
        await this.setupProjectWithAssistants(config, assistantChoices, options);
        console.log(chalk_1.default.green.bold('\n✅ metacoding setup complete!\n'));
        this.displayNextSteps(assistantChoices, environmentChoice, ideChoice);
    }
    async getProjectConfiguration(options, projectInfo, environmentChoice, ideChoice) {
        if (options.force && process.env.NODE_ENV === 'test') {
            return {
                name: projectInfo.name || 'test-project',
                description: 'A test project using metacoding workflow',
                techStack: ['TypeScript', 'Jest'],
                projectType: options.template,
                testFramework: 'Jest',
                buildTool: 'TypeScript Compiler',
                ideChoice: ideChoice || (environmentChoice === 'ide' ? 'vscode' : undefined),
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
                    { name: 'JavaScript Application', value: 'javascript' },
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
                        case 'javascript':
                            return 'JavaScript, Node.js, Jest, npm';
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
            ideChoice,
        };
    }
    async setupProject(config, options, ideChoice) {
        const spinner = (0, ora_1.default)('Setting up metacoding files...').start();
        try {
            if (ideChoice === 'vscode') {
                await this.fileSystem.ensureDirectoryExists('.github');
                await this.fileSystem.ensureDirectoryExists('.github/instructions');
            }
            else if (ideChoice === 'cursor') {
                await this.fileSystem.ensureDirectoryExists('.cursor');
                await this.fileSystem.ensureDirectoryExists('.cursor/rules');
            }
            const template = await this.templateManager.getTemplate(config.projectType, config);
            const processedFiles = await this.templateManager.processTemplate(template, config);
            for (const file of processedFiles) {
                await this.fileSystem.writeFile(file.path, file.content);
                spinner.text = `Created ${file.path}`;
            }
            spinner.text = 'Updating .gitignore with AI assistant exclusions...';
            await this.gitIgnoreManager.updateGitIgnore(process.cwd());
            if (ideChoice === 'vscode') {
                if (!options.skipVscode) {
                    spinner.text = 'Configuring VS Code settings...';
                    await this.vscodeService.updateSettings(template.vscodeSettings || {});
                }
            }
            else if (ideChoice === 'cursor') {
                spinner.text = 'Configuring Cursor IDE rules...';
                const workflowContent = await this.cursorService.generateWorkflowRules(process.cwd(), config.projectType, config);
                const patternRules = await this.cursorService.generatePatternRules(process.cwd(), config.projectType);
                await this.cursorService.installCursorRules(process.cwd(), workflowContent, patternRules);
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
            case 'javascript':
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
            case 'javascript':
                return 'Webpack/Vite';
            case 'python':
                return 'Poetry';
            default:
                return 'TypeScript Compiler';
        }
    }
    async validateAndGetIdeChoice(options) {
        if (options.vscode && options.cursor) {
            throw new Error('Cannot specify both --vscode and --cursor flags. Please choose one.');
        }
        if (options.vscode) {
            return 'vscode';
        }
        if (options.cursor) {
            return 'cursor';
        }
        if (options.force && process.env.NODE_ENV === 'test') {
            return 'vscode';
        }
        const { ideChoice } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'ideChoice',
                message: 'Which AI coding environment would you like to set up?',
                choices: [
                    {
                        name: 'VS Code + GitHub Copilot (recommended for most users)',
                        value: 'vscode',
                    },
                    {
                        name: 'Cursor IDE (alternative AI-powered editor)',
                        value: 'cursor',
                    },
                ],
                default: 'vscode',
            },
        ]);
        return ideChoice;
    }
    async getEnvironmentChoice(options) {
        if (options.vscode || options.cursor) {
            return 'ide';
        }
        if (options.environment) {
            return options.environment;
        }
        if (options.force && process.env.NODE_ENV === 'test') {
            return 'ide';
        }
        const { environment } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'environment',
                message: 'What development environment will you primarily use?',
                choices: [
                    { name: 'IDE (VS Code, Cursor, IntelliJ)', value: 'ide' },
                    { name: 'Terminal/CLI', value: 'terminal' }
                ],
                default: 'ide'
            }
        ]);
        return environment;
    }
    async getIdeChoice(options) {
        if (options.vscode)
            return 'vscode';
        if (options.cursor)
            return 'cursor';
        if (options.ide) {
            return options.ide;
        }
        if (options.force && process.env.NODE_ENV === 'test') {
            return 'vscode';
        }
        const { ideChoice } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'ideChoice',
                message: 'Which IDE will you use?',
                choices: [
                    { name: 'VS Code', value: 'vscode' },
                    { name: 'Cursor', value: 'cursor' },
                    { name: 'IntelliJ IDEA', value: 'intellij' }
                ],
                default: 'vscode'
            }
        ]);
        return ideChoice;
    }
    async getAssistantChoices(options, environmentChoice) {
        if (options.assistants && options.assistants.length > 0) {
            return options.assistants;
        }
        if (options.vscode || options.cursor) {
            return ['copilot'];
        }
        if (options.force && process.env.NODE_ENV === 'test') {
            return ['copilot'];
        }
        const availableAssistants = this.assistantAdapterService.getAvailableAssistants();
        const choices = availableAssistants.map(assistant => ({
            name: assistant.description,
            value: assistant.type
        }));
        choices.push({ name: 'All of the above', value: 'all' });
        const { assistants } = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'assistants',
                message: `Which AI assistants will you use in your ${environmentChoice} environment?`,
                choices,
                default: environmentChoice === 'ide' ? ['copilot'] : ['codex'],
                validate: (input) => {
                    if (input.length === 0) {
                        return 'Please select at least one assistant';
                    }
                    return true;
                }
            }
        ]);
        return assistants;
    }
    async setupProjectWithAssistants(config, assistantChoices, options) {
        const spinner = (0, ora_1.default)('Setting up metacoding files...').start();
        try {
            spinner.text = 'Generating assistant configuration files...';
            const generatedFiles = await this.assistantAdapterService.generateAssistantFiles(assistantChoices, config, process.cwd());
            spinner.text = `Generated ${generatedFiles.length} assistant configuration files`;
            spinner.text = 'Updating .gitignore...';
            await this.gitIgnoreManager.updateGitIgnore(process.cwd());
            spinner.text = 'Setting up project documentation...';
            await this.fileSystem.ensureDirectoryExists('_meta');
            const taskListPath = path_1.default.join(process.cwd(), '_meta', 'project-task-list.md');
            if (!(await this.fileSystem.fileExists(taskListPath))) {
                const taskListContent = this.generateInitialTaskList(config);
                await this.fileSystem.writeFile(taskListPath, taskListContent);
            }
            await this.fileSystem.ensureDirectoryExists('test');
            const testDocPath = path_1.default.join(process.cwd(), 'test', 'test-documentation.md');
            if (!(await this.fileSystem.fileExists(testDocPath))) {
                const testDocContent = this.generateInitialTestDoc(config);
                await this.fileSystem.writeFile(testDocPath, testDocContent);
            }
            if (config.ideChoice) {
                if (config.ideChoice === 'vscode' && !options.skipVscode) {
                    spinner.text = 'Configuring VS Code settings...';
                    await this.vscodeService.updateSettings({
                        'typescript.preferences.includePackageJsonAutoImports': 'auto',
                        'editor.formatOnSave': true,
                        'editor.codeActionsOnSave': {
                            'source.fixAll.eslint': true
                        }
                    });
                }
            }
            spinner.succeed('Setup complete!');
        }
        catch (error) {
            spinner.fail('Setup failed');
            throw error;
        }
    }
    generateInitialTaskList(config) {
        return `# ${config.name} Project Task List

## Current Tasks

- [ ] **SETUP-TASK-001: Initial project setup** - 🟡 **IN PROGRESS** - Setting up metacoding development workflow and assistant configurations

## Task Status Legend

- 🟡 **IN PROGRESS** - Currently being worked on
- ✅ **COMPLETED** - Task finished and verified
- ❌ **BLOCKED** - Task cannot proceed due to dependency or issue
- ⏸️ **ON HOLD** - Task paused for specific reason
- 📋 **NOT STARTED** - Task identified but not yet begun

## Notes

This task list follows the 7-step development workflow. All tasks must be documented here before implementation begins.
`;
    }
    generateInitialTestDoc(config) {
        return `# ${config.name} Test Documentation

## Test Framework Configuration

**Framework**: ${config.testFramework || 'Not specified'}
**Test Command**: \`npm test\`

## Test Cases

### SETUP-TEST-001: Verify project setup
- **Status**: 📋 NOT STARTED
- **Description**: Verify that metacoding setup is working correctly
- **Expected**: All configuration files are present and valid
- **Test File**: \`test/setup.test.js\`

## Test Coverage Goals

- Unit Tests: 80%+ coverage for critical functionality
- Integration Tests: Key workflow paths
- End-to-end Tests: User scenarios

## Notes

All test cases must be documented here before test implementation begins, following the TDD approach of the 7-step workflow.
`;
    }
    displayNextSteps(assistantChoices, environmentChoice, ideChoice) {
        console.log(chalk_1.default.cyan('Next steps:'));
        let step = 1;
        if (environmentChoice === 'ide' && ideChoice) {
            switch (ideChoice) {
                case 'vscode':
                    console.log(chalk_1.default.dim(`${step++}.`), 'Restart VS Code to apply settings');
                    break;
                case 'cursor':
                    console.log(chalk_1.default.dim(`${step++}.`), 'Open your project in Cursor IDE');
                    break;
                case 'intellij':
                    console.log(chalk_1.default.dim(`${step++}.`), 'Open your project in IntelliJ IDEA');
                    break;
            }
        }
        if (assistantChoices.includes('copilot') || assistantChoices.includes('all')) {
            console.log(chalk_1.default.dim(`${step++}.`), 'GitHub Copilot: Open Copilot Chat and check .github/copilot-instructions.md is loaded');
        }
        if (assistantChoices.includes('claude') || assistantChoices.includes('all')) {
            console.log(chalk_1.default.dim(`${step++}.`), 'Claude Code: Run `claude` in terminal, it will auto-load CLAUDE.md');
        }
        if (assistantChoices.includes('codex') || assistantChoices.includes('all')) {
            console.log(chalk_1.default.dim(`${step++}.`), 'Codex/OpenAI: Configure your agent to use AGENTS.md as system message');
        }
        if (assistantChoices.includes('gemini') || assistantChoices.includes('all')) {
            console.log(chalk_1.default.dim(`${step++}.`), 'Gemini Code Assist: GEMINI.md will be auto-discovered in VS Code/IntelliJ');
        }
        console.log(chalk_1.default.dim(`${step++}.`), chalk_1.default.bold('Test your setup by asking any assistant:'));
        console.log('     ', chalk_1.default.italic('"What is the development workflow for this project?"'));
        console.log(chalk_1.default.dim(`${step++}.`), 'Start coding with guided workflow support!');
        console.log('');
        console.log(chalk_1.default.cyan('Need help?'), 'Visit https://github.com/anton-g-kulikov/metacoding');
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=init.js.map