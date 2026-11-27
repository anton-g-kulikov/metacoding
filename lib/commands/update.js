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
const yaml_1 = __importDefault(require("yaml"));
const backup_1 = require("../services/backup");
const conflict_resolution_1 = require("../services/conflict-resolution");
const gitignore_manager_1 = require("../services/gitignore-manager");
const project_detector_1 = require("../services/project-detector");
const skill_manager_1 = require("../services/skill-manager");
class UpdateCommand {
    constructor() {
        this.skillManager = new skill_manager_1.SkillManager();
        this.backupService = new backup_1.BackupService();
        this.conflictService = new conflict_resolution_1.ConflictResolutionService();
        this.projectDetector = new project_detector_1.ProjectDetector();
        this.gitIgnoreManager = new gitignore_manager_1.GitIgnoreManager();
    }
    async execute(options) {
        if (options.dryRun) {
            await this.validateSetup(options);
            return;
        }
        const installedVendors = await this.skillManager.getInstalledVendors();
        if (installedVendors.length === 0) {
            throw new Error('No metacoding installation found. Run "metacoding init" first.');
        }
        const targetVendors = this.getTargetVendors(installedVendors, options.vendor);
        console.log(chalk_1.default.cyan('Syncing metacoding skills...\n'));
        const projectInfo = await this.projectDetector.detectProject();
        if (options.backup !== false) {
            const backupSpinner = (0, ora_1.default)('Creating backup...').start();
            const backupTargets = targetVendors.flatMap((vendor) => this.skillManager.getBackupTargets(vendor));
            const backup = await this.backupService.createBackup(backupTargets);
            backupSpinner.succeed(backup.filesBackedUp.length > 0
                ? `Backup created at ${backup.backupPath}`
                : 'No existing installation to back up');
        }
        let filesUpdated = 0;
        for (const vendor of targetVendors) {
            const installed = await this.skillManager.readInstalledProjectContext(vendor);
            const projectType = options.template || installed.projectType || projectInfo.type || 'general';
            const projectConfig = {
                name: installed.name ?? projectInfo.name,
                description: installed.description ?? skill_manager_1.DEFAULT_PROJECT_DESCRIPTION,
                techStack: installed.techStack ?? projectInfo.techStack,
                projectType,
                testFramework: this.skillManager.getDefaultTestFramework(projectType),
                buildTool: this.skillManager.getDefaultBuildTool(projectType),
                vendor,
            };
            const packagedFiles = await this.skillManager.generateInstallationFiles(projectConfig);
            const existingFiles = await this.skillManager.getInstalledFiles(vendor);
            const conflictSpinner = (0, ora_1.default)(`Checking for local ${vendor} skill edits...`).start();
            const conflicts = await this.conflictService.detectConflicts(packagedFiles, existingFiles);
            if (conflicts.length === 0) {
                conflictSpinner.succeed(`No local ${vendor} skill conflicts detected`);
            }
            else {
                conflictSpinner.warn(`Found ${conflicts.length} locally edited ${vendor} skill files`);
                if (options.force) {
                    for (const conflict of conflicts) {
                        await fs.writeFile(conflict.filePath, conflict.templateContent, 'utf8');
                    }
                }
                else {
                    const resolutions = await this.conflictService.getConflictResolution(conflicts);
                    await this.conflictService.applyResolutions(conflicts, resolutions);
                }
            }
            const writeSpinner = (0, ora_1.default)(`Syncing packaged ${vendor} skill files...`).start();
            let vendorFilesUpdated = 0;
            for (const file of packagedFiles) {
                const conflicted = conflicts.some((conflict) => conflict.filePath === file.path);
                if (!conflicted || options.force) {
                    await fs.ensureDir(path.dirname(file.path));
                    await fs.writeFile(file.path, file.content, 'utf8');
                    filesUpdated++;
                    vendorFilesUpdated++;
                }
            }
            writeSpinner.succeed(`Updated ${vendor} skill files (${vendorFilesUpdated} files)`);
            await this.cleanUpRetiredFiles(vendor, options);
            if (vendor === 'claude-code') {
                await this.migrateLegacyClaudeInstall(options);
            }
        }
        await this.gitIgnoreManager.addMissingPatterns(process.cwd());
        await this.backupService.cleanupOldBackups();
        console.log(chalk_1.default.green.bold(`\nmetacoding skills are up to date (${filesUpdated} files synced).\n`));
    }
    async migrateLegacyClaudeInstall(options) {
        if (!(await this.skillManager.hasLegacyClaudeInstall())) {
            return;
        }
        if (options.backup === false) {
            console.log(chalk_1.default.yellow('Legacy Claude Code subagent files were kept because backups are disabled. ' +
                'Remove .claude/agents/metacoding-workflow.md and .claude/metacoding-workflow/ ' +
                'so Claude Code uses the skill instead of the old subagent.'));
            return;
        }
        const removed = await this.skillManager.removeLegacyClaudeInstall();
        console.log(chalk_1.default.green(`Migrated Claude Code from the legacy subagent layout to a skill (removed ${removed.join(', ')}).`));
    }
    async cleanUpRetiredFiles(vendor, options) {
        const retiredFiles = await this.skillManager.findRetiredFiles(vendor);
        if (retiredFiles.length === 0) {
            return;
        }
        if (options.backup === false) {
            console.log(chalk_1.default.yellow('Files that metacoding no longer ships were kept because backups are disabled. ' +
                `Remove ${retiredFiles.join(', ')} yourself.`));
            return;
        }
        const removed = await this.skillManager.removeRetiredFiles(vendor);
        console.log(chalk_1.default.green(`Removed files that metacoding no longer ships (${removed.join(', ')}).`));
    }
    async validateSetup(options) {
        console.log(chalk_1.default.cyan('Validating metacoding skills...\n'));
        const installedVendors = await this.skillManager.getInstalledVendors();
        if (installedVendors.length === 0) {
            throw new Error('Validation failed: no vendor-specific metacoding installation was found.');
        }
        const targetVendors = this.getTargetVendors(installedVendors, options.vendor);
        for (const vendor of targetVendors) {
            if (vendor === 'claude-code' &&
                (await this.skillManager.needsClaudeMigration())) {
                throw new Error('Validation failed: the Claude Code install uses the legacy subagent layout. ' +
                    'Run "metacoding update" to migrate it to a skill.');
            }
            const requiredFiles = this.getRequiredFilesForVendor(vendor);
            let missingFiles = 0;
            for (const file of requiredFiles) {
                if (!(await fs.pathExists(file))) {
                    missingFiles++;
                    console.log(chalk_1.default.red(`Missing: ${file}`));
                }
            }
            if (missingFiles > 0) {
                throw new Error(`Validation failed: ${missingFiles} required ${vendor} skill files are missing.`);
            }
            if (vendor === 'codex') {
                for (const directory of this.skillManager.getSkillDirectories(vendor)) {
                    const yamlPath = path.join(directory, 'agents/openai.yaml');
                    const yamlContent = await fs.readFile(yamlPath, 'utf8');
                    let parsed;
                    try {
                        parsed = yaml_1.default.parse(yamlContent);
                    }
                    catch {
                        throw new Error(`Validation failed: ${yamlPath} is not valid YAML.`);
                    }
                    if (!parsed?.interface?.display_name || !parsed?.interface?.default_prompt) {
                        throw new Error(`Validation failed: ${yamlPath} is missing required interface fields.`);
                    }
                }
            }
        }
        if (options.strict) {
            const missingPatterns = await this.gitIgnoreManager.getMissingPatterns(process.cwd());
            if (missingPatterns.length > 0) {
                throw new Error(`Validation failed: .gitignore is missing metacoding exclusions: ${missingPatterns.join(', ')}.`);
            }
        }
        console.log(chalk_1.default.green('Validation passed.'));
    }
    getTargetVendors(installedVendors, selectedVendor) {
        if (!selectedVendor) {
            return installedVendors;
        }
        const normalizedVendor = this.normalizeVendor(selectedVendor);
        if (normalizedVendor === 'all') {
            return installedVendors;
        }
        if (!installedVendors.includes(normalizedVendor)) {
            throw new Error(`No metacoding installation was found for vendor "${normalizedVendor}".`);
        }
        return [normalizedVendor];
    }
    getRequiredFilesForVendor(vendor) {
        const workflowDir = this.skillManager.getInstallDirectory(vendor);
        const companionDirs = this.skillManager.getSkillDirectories(vendor).slice(1);
        const skillFiles = ['SKILL.md', ...(vendor === 'codex' ? ['agents/openai.yaml'] : [])];
        const workflowFiles = [
            ...skillFiles,
            'references/workflow-rules.md',
            'references/platform-adaptation.md',
            skill_manager_1.PROJECT_CONTEXT_FILE,
            'assets/templates/task-entry.md',
        ];
        return [
            ...workflowFiles.map((file) => path.join(workflowDir, file)),
            ...companionDirs.flatMap((directory) => skillFiles.map((file) => path.join(directory, file))),
        ];
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
exports.UpdateCommand = UpdateCommand;
//# sourceMappingURL=update.js.map