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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const template_manager_1 = require("../services/template-manager");
const backup_1 = require("../services/backup");
const conflict_resolution_1 = require("../services/conflict-resolution");
const vscode_1 = require("../services/vscode");
const project_detector_1 = require("../services/project-detector");
class UpdateCommand {
    constructor() {
        this.templateManager = new template_manager_1.TemplateManager();
        this.backupService = new backup_1.BackupService();
        this.conflictService = new conflict_resolution_1.ConflictResolutionService();
        this.vscodeService = new vscode_1.VSCodeService();
        this.projectDetector = new project_detector_1.ProjectDetector();
    }
    async execute(options) {
        if (options.dryRun) {
            return this.validateSetup(options);
        }
        console.log(chalk_1.default.cyan('🔄 Updating metacoding setup...\n'));
        try {
            const spinner = (0, ora_1.default)('Detecting current template...').start();
            const currentTemplate = await this.detectCurrentTemplate(options.template);
            spinner.succeed(`Current template: ${currentTemplate}`);
            if (options.backup !== false) {
                const backupSpinner = (0, ora_1.default)('Creating backup...').start();
                const backupResult = await this.backupService.createBackup();
                backupSpinner.succeed(`Backup created at: ${backupResult.backupPath}`);
            }
            const templateSpinner = (0, ora_1.default)('Loading template files...').start();
            const projectConfig = await this.getProjectConfig(currentTemplate);
            const template = await this.templateManager.getTemplate(currentTemplate, projectConfig);
            const templateFiles = await this.templateManager.processTemplate(template, projectConfig);
            templateSpinner.succeed(`Loaded ${templateFiles.length} template files`);
            const existingFiles = await this.getExistingMetacodingFiles();
            const conflictSpinner = (0, ora_1.default)('Checking for conflicts...').start();
            const conflicts = await this.conflictService.detectConflicts(templateFiles.map((f) => ({ path: f.path, content: f.content })), existingFiles);
            if (conflicts.length > 0) {
                conflictSpinner.warn(`Found ${conflicts.length} conflicts`);
                if (!options.force) {
                    const resolutions = await this.conflictService.getConflictResolution(conflicts);
                    const { preservedFiles } = await this.conflictService.applyResolutions(conflicts, resolutions);
                    if (preservedFiles.length > 0) {
                        console.log(chalk_1.default.yellow(`💾 Preserved ${preservedFiles.length} user files with user. prefix`));
                    }
                }
                else {
                    for (const conflict of conflicts) {
                        await fs.writeFile(conflict.filePath, conflict.templateContent);
                    }
                    console.log(chalk_1.default.yellow(`⚠️  Force mode: Replaced ${conflicts.length} conflicted files`));
                }
            }
            else {
                conflictSpinner.succeed('No conflicts detected');
            }
            const updateSpinner = (0, ora_1.default)('Updating template files...').start();
            let filesUpdated = 0;
            for (const file of templateFiles) {
                const isConflicted = conflicts.some((c) => c.filePath === file.path);
                if (!isConflicted) {
                    await fs.ensureDir(path.dirname(file.path));
                    await fs.writeFile(file.path, file.content);
                    filesUpdated++;
                }
            }
            updateSpinner.succeed(`Updated ${filesUpdated} files`);
            const vscodeSpinner = (0, ora_1.default)('Updating VS Code settings...').start();
            await this.vscodeService.updateSettings(template.vscodeSettings || {});
            vscodeSpinner.succeed('VS Code settings updated');
            await this.backupService.cleanupOldBackups();
            console.log(chalk_1.default.green.bold('\n✅ metacoding update complete!\n'));
            this.displayUpdateSummary({
                template: currentTemplate,
                filesUpdated,
                conflictsResolved: conflicts.length,
                backupCreated: options.backup !== false,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(chalk_1.default.red('\n❌ Update failed:'), errorMessage);
            if (process.env.NODE_ENV !== 'test') {
                process.exit(1);
            }
            else {
                throw error;
            }
        }
    }
    async detectCurrentTemplate(specifiedTemplate) {
        if (specifiedTemplate) {
            return specifiedTemplate;
        }
        if (!(await fs.pathExists('.github'))) {
            throw new Error('No metacoding setup found. Run "metacoding init" first.');
        }
        const projectInfo = await this.projectDetector.detectProject();
        return projectInfo.projectType || 'general';
    }
    async getProjectConfig(templateType) {
        const projectInfo = await this.projectDetector.detectProject();
        return {
            name: projectInfo.name || path.basename(process.cwd()),
            description: projectInfo.description || 'A guided development project',
            techStack: projectInfo.techStack || [],
            projectType: templateType,
            testFramework: projectInfo.testFramework,
            buildTool: projectInfo.buildTool,
        };
    }
    async getExistingMetacodingFiles() {
        const files = [];
        const githubDir = '.github';
        if (!(await fs.pathExists(githubDir))) {
            return files;
        }
        const mainFile = path.join(githubDir, 'copilot-instructions.md');
        if (await fs.pathExists(mainFile)) {
            files.push(mainFile);
        }
        const instructionsDir = path.join(githubDir, 'instructions');
        if (await fs.pathExists(instructionsDir)) {
            const instructionFiles = await fs.readdir(instructionsDir);
            for (const file of instructionFiles) {
                files.push(path.join(instructionsDir, file));
            }
        }
        return files;
    }
    async validateSetup(options) {
        console.log(chalk_1.default.cyan('🔍 Validating metacoding setup...\n'));
        const validationResults = [];
        let hasErrors = false;
        let hasWarnings = false;
        try {
            const fileSpinner = (0, ora_1.default)('Checking file structure...').start();
            const requiredFiles = [
                '.github/copilot-instructions.md',
                '.github/instructions/code-review.instructions.md',
                '.github/instructions/docs-update.instructions.md',
                '.github/instructions/release.instructions.md',
                '.github/instructions/test-runner.instructions.md'
            ];
            let missingFiles = 0;
            for (const file of requiredFiles) {
                if (!(await fs.pathExists(file))) {
                    validationResults.push({
                        check: `File ${file}`,
                        status: 'fail',
                        message: 'Missing required file'
                    });
                    missingFiles++;
                    hasErrors = true;
                }
            }
            if (missingFiles === 0) {
                fileSpinner.succeed('File structure complete');
                validationResults.push({
                    check: 'File structure',
                    status: 'pass'
                });
            }
            else {
                fileSpinner.fail(`Missing ${missingFiles} required files`);
            }
            const vscodeSpinner = (0, ora_1.default)('Checking VS Code configuration...').start();
            try {
                const vscodeSettingsPath = '.vscode/settings.json';
                if (await fs.pathExists(vscodeSettingsPath)) {
                    const settings = await fs.readJson(vscodeSettingsPath);
                    const requiredSettings = ['github.copilot.chat.promptFiles'];
                    let missingSettings = 0;
                    for (const setting of requiredSettings) {
                        if (!settings[setting]) {
                            validationResults.push({
                                check: `VS Code setting '${setting}'`,
                                status: options.strict ? 'fail' : 'warn',
                                message: 'Not configured'
                            });
                            missingSettings++;
                            if (options.strict) {
                                hasErrors = true;
                            }
                            else {
                                hasWarnings = true;
                            }
                        }
                    }
                    if (missingSettings === 0) {
                        vscodeSpinner.succeed('VS Code configuration valid');
                        validationResults.push({
                            check: 'VS Code configuration',
                            status: 'pass'
                        });
                    }
                    else if (options.strict) {
                        vscodeSpinner.fail(`Missing ${missingSettings} required settings`);
                    }
                    else {
                        vscodeSpinner.warn(`Missing ${missingSettings} recommended settings`);
                    }
                }
                else {
                    vscodeSpinner.warn('VS Code settings file not found');
                    validationResults.push({
                        check: 'VS Code settings file',
                        status: 'warn',
                        message: 'File not found'
                    });
                    hasWarnings = true;
                }
            }
            catch {
                vscodeSpinner.fail('Error reading VS Code settings');
                validationResults.push({
                    check: 'VS Code configuration',
                    status: 'fail',
                    message: 'Error reading settings file'
                });
                hasErrors = true;
            }
            const gitSpinner = (0, ora_1.default)('Checking Git repository...').start();
            if (await fs.pathExists('.git')) {
                gitSpinner.succeed('Git repository configured');
                validationResults.push({
                    check: 'Git repository',
                    status: 'pass'
                });
            }
            else {
                const message = 'No Git repository found';
                if (options.strict) {
                    gitSpinner.fail(message);
                    validationResults.push({
                        check: 'Git repository',
                        status: 'fail',
                        message
                    });
                    hasErrors = true;
                }
                else {
                    gitSpinner.warn(message);
                    validationResults.push({
                        check: 'Git repository',
                        status: 'warn',
                        message
                    });
                    hasWarnings = true;
                }
            }
            const templateSpinner = (0, ora_1.default)('Checking template integrity...').start();
            try {
                await this.detectCurrentTemplate(options.template);
                if (await fs.pathExists('.github/copilot-instructions.md')) {
                    const content = await fs.readFile('.github/copilot-instructions.md', 'utf-8');
                    const hasPlaceholders = content.includes('{{') && content.includes('}}');
                    if (hasPlaceholders) {
                        templateSpinner.fail('Template variables not substituted');
                        validationResults.push({
                            check: 'Template integrity',
                            status: 'fail',
                            message: 'Unprocessed template variables found'
                        });
                        hasErrors = true;
                    }
                    else {
                        templateSpinner.succeed('Template integrity verified');
                        validationResults.push({
                            check: 'Template integrity',
                            status: 'pass'
                        });
                    }
                }
                else {
                    templateSpinner.warn('Cannot verify template integrity - main file missing');
                    validationResults.push({
                        check: 'Template integrity',
                        status: 'warn',
                        message: 'Main instruction file missing'
                    });
                    hasWarnings = true;
                }
            }
            catch {
                templateSpinner.fail('Error checking template integrity');
                validationResults.push({
                    check: 'Template integrity',
                    status: 'fail',
                    message: 'Error during template validation'
                });
                hasErrors = true;
            }
            console.log('');
            for (const result of validationResults) {
                const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
                const message = result.message ? ` - ${result.message}` : '';
                console.log(`${icon} ${result.check}${message}`);
            }
            console.log('');
            const totalChecks = validationResults.length;
            const passedChecks = validationResults.filter(r => r.status === 'pass').length;
            if (hasErrors) {
                console.log(chalk_1.default.red.bold('❌ Validation failed with errors\n'));
                console.log(chalk_1.default.cyan('Suggestions:'));
                console.log('- Run \'metacoding update\' to restore missing files');
                console.log('- Check VS Code settings configuration');
                console.log('- Ensure you\'re in a Git repository');
                console.log(chalk_1.default.dim(`\nSummary: ${passedChecks}/${totalChecks} checks passed`));
                if (process.env.NODE_ENV !== 'test') {
                    process.exit(1);
                }
                else {
                    throw new Error('Validation failed');
                }
            }
            else if (hasWarnings && options.strict) {
                console.log(chalk_1.default.yellow.bold('⚠️ Validation completed with warnings\n'));
                console.log(chalk_1.default.cyan('Suggestions:'));
                console.log('- Configure recommended VS Code settings');
                console.log('- Consider initializing a Git repository');
                console.log(chalk_1.default.dim(`\nSummary: ${passedChecks}/${totalChecks} checks passed`));
                if (process.env.NODE_ENV !== 'test') {
                    process.exit(2);
                }
                else {
                    throw new Error('Validation completed with warnings');
                }
            }
            else {
                console.log(chalk_1.default.green.bold('🎉 metacoding setup is valid and ready to use!\n'));
                console.log(chalk_1.default.dim(`Summary: ${passedChecks}/${totalChecks} checks passed`));
            }
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Validation')) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(chalk_1.default.red('\n❌ Validation failed:'), errorMessage);
            if (process.env.NODE_ENV !== 'test') {
                process.exit(1);
            }
            else {
                throw error;
            }
        }
    }
    displayUpdateSummary(summary) {
        console.log(chalk_1.default.cyan('Update Summary:'));
        console.log(`  Template: ${summary.template}`);
        console.log(`  Files updated: ${summary.filesUpdated}`);
        if (summary.conflictsResolved > 0) {
            console.log(`  Conflicts resolved: ${summary.conflictsResolved}`);
        }
        if (summary.backupCreated) {
            console.log(`  Backup: Created in .backup/ directory`);
        }
        console.log('\n' + chalk_1.default.dim('Your metacoding setup is now up to date!'));
    }
}
exports.UpdateCommand = UpdateCommand;
//# sourceMappingURL=update.js.map