"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const filesystem_1 = require("../services/filesystem");
const gitignore_manager_1 = require("../services/gitignore-manager");
const project_detector_1 = require("../services/project-detector");
const skill_manager_1 = require("../services/skill-manager");
class InitCommand {
    constructor() {
        this.skillManager = new skill_manager_1.SkillManager();
        this.fileSystem = new filesystem_1.FileSystemService();
        this.projectDetector = new project_detector_1.ProjectDetector();
        this.gitIgnoreManager = new gitignore_manager_1.GitIgnoreManager();
    }
    async execute(options) {
        console.log(chalk_1.default.cyan.bold('metacoding skill setup\n'));
        const projectInfo = await this.projectDetector.detectProject();
        const vendorChoice = await this.getVendorChoice(options);
        const vendors = this.expandVendorChoice(vendorChoice);
        if ((await this.fileSystem.isMetaCodingSetup()) && !options.force) {
            const { proceed } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'The metacoding workflow skill is already installed here. Reinstall it?',
                    default: false,
                },
            ]);
            if (!proceed) {
                console.log(chalk_1.default.yellow('Setup cancelled.'));
                return;
            }
        }
        const primaryVendor = vendors[0] ?? 'codex';
        const baseConfig = await this.getProjectConfiguration(options, projectInfo, primaryVendor);
        await this.setupProject(vendors.map((vendor) => ({ ...baseConfig, vendor })));
        console.log(chalk_1.default.green.bold('\nmetacoding skill installed.\n'));
        this.displayNextSteps(vendorChoice);
    }
    async getProjectConfiguration(options, projectInfo, vendor) {
        if (options.force && process.env.NODE_ENV === 'test') {
            return {
                name: projectInfo.name || 'test-project',
                description: 'A project using the metacoding workflow skill',
                techStack: projectInfo.techStack.length
                    ? projectInfo.techStack
                    : ['TypeScript'],
                projectType: options.template || projectInfo.type || 'general',
                testFramework: this.getDefaultTestFramework(options.template || projectInfo.type || 'general'),
                buildTool: this.getDefaultBuildTool(options.template || projectInfo.type || 'general'),
                vendor,
            };
        }
        const detectedType = options.template || projectInfo.type || 'general';
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name:',
                default: projectInfo.name || 'my-project',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description:',
                default: 'A project using the metacoding workflow skill',
            },
            {
                type: 'list',
                name: 'projectType',
                message: 'Project type:',
                choices: [
                    { name: 'General', value: 'general' },
                    { name: 'TypeScript', value: 'typescript' },
                    { name: 'React', value: 'react' },
                    { name: 'Node.js', value: 'node' },
                    { name: 'JavaScript', value: 'javascript' },
                    { name: 'Python', value: 'python' },
                ],
                default: detectedType,
            },
            {
                type: 'input',
                name: 'techStack',
                message: 'Tech stack (comma-separated):',
                default: projectInfo.techStack.join(', ') || 'TypeScript',
                filter: (input) => input
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
            },
        ]);
        return {
            name: answers.name,
            description: answers.description,
            techStack: answers.techStack,
            projectType: answers.projectType,
            testFramework: this.getDefaultTestFramework(answers.projectType),
            buildTool: this.getDefaultBuildTool(answers.projectType),
            vendor,
        };
    }
    async setupProject(configs) {
        const spinner = (0, ora_1.default)('Installing metacoding workflow skill...').start();
        try {
            let installedFiles = 0;
            for (const config of configs) {
                const files = await this.skillManager.installSkill(config);
                installedFiles += files.length;
            }
            spinner.text = `Installed ${installedFiles} skill files`;
            await this.gitIgnoreManager.updateGitIgnore(process.cwd());
            spinner.succeed('Workflow skill installed successfully');
        }
        catch (error) {
            spinner.fail('Failed to install metacoding skill');
            throw error;
        }
    }
    getDefaultTestFramework(projectType) {
        switch (projectType) {
            case 'react':
                return 'Jest + React Testing Library';
            case 'python':
                return 'Pytest';
            default:
                return 'Use the repository default';
        }
    }
    getDefaultBuildTool(projectType) {
        switch (projectType) {
            case 'react':
                return 'Vite';
            case 'node':
                return 'Node.js toolchain';
            case 'python':
                return 'Poetry or the repository default';
            default:
                return 'Use the repository default';
        }
    }
    displayNextSteps(vendor) {
        console.log(chalk_1.default.cyan('Next steps:'));
        console.log(chalk_1.default.dim('1.'), 'Use the installed vendor-specific metacoding skill entrypoint in your repo.');
        this.displayNextStepsForVendor(vendor);
        console.log(chalk_1.default.dim('2.'), 'Ask your agent to use the metacoding workflow for the next task.');
        console.log(chalk_1.default.dim('3.'), 'Let the skill drive scope capture, test intent, implementation, verification, and close-out.');
        console.log('');
    }
    async getVendorChoice(options) {
        if (options.vendor) {
            return this.normalizeVendor(options.vendor);
        }
        if (options.force && process.env.NODE_ENV === 'test') {
            return 'codex';
        }
        const { vendor } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'vendor',
                message: 'Which coding agent do you want to set up?',
                choices: [
                    { name: 'Codex', value: 'codex' },
                    { name: 'Claude Code', value: 'claude-code' },
                    { name: 'Antigravity', value: 'antigravity' },
                    { name: 'All supported agents', value: 'all' },
                ],
                default: 'codex',
            },
        ]);
        return this.normalizeVendor(vendor);
    }
    displayNextStepsForVendor(vendor) {
        console.log(chalk_1.default.cyan('Installed entrypoint:'));
        if (vendor === 'all') {
            console.log(chalk_1.default.dim('-'), '.codex/skills/metacoding-workflow/SKILL.md');
            console.log(chalk_1.default.dim('-'), '.claude/agents/metacoding-workflow.md');
            console.log(chalk_1.default.dim('-'), '.agents/skills/metacoding-workflow/SKILL.md');
            return;
        }
        if (vendor === 'codex') {
            console.log(chalk_1.default.dim('-'), '.codex/skills/metacoding-workflow/SKILL.md');
        }
        else if (vendor === 'claude-code') {
            console.log(chalk_1.default.dim('-'), '.claude/agents/metacoding-workflow.md');
        }
        else {
            console.log(chalk_1.default.dim('-'), '.agents/skills/metacoding-workflow/SKILL.md');
        }
    }
    expandVendorChoice(vendor) {
        if (vendor === 'all') {
            return ['codex', 'claude-code', 'antigravity'];
        }
        return [vendor];
    }
    normalizeVendor(vendor) {
        if (vendor === 'codex' ||
            vendor === 'claude-code' ||
            vendor === 'antigravity' ||
            vendor === 'all') {
            return vendor;
        }
        throw new Error(`Unsupported vendor "${vendor}". Use codex, claude-code, antigravity, or all.`);
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=init.js.map