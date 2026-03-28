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
const project_detector_1 = require("../services/project-detector");
const skill_manager_1 = require("../services/skill-manager");
class UpdateCommand {
    constructor() {
        this.skillManager = new skill_manager_1.SkillManager();
        this.backupService = new backup_1.BackupService();
        this.conflictService = new conflict_resolution_1.ConflictResolutionService();
        this.projectDetector = new project_detector_1.ProjectDetector();
    }
    async execute(options) {
        if (options.dryRun) {
            await this.validateSetup(options);
            return;
        }
        const installedVendors = await this.skillManager.getInstalledVendors();
        if (installedVendors.length === 0) {
            throw new Error('No metacoding workflow skill installation found. Run "metacoding init" first.');
        }
        const targetVendors = this.getTargetVendors(installedVendors, options.vendor);
        console.log(chalk_1.default.cyan('Syncing metacoding workflow skill...\n'));
        const projectInfo = await this.projectDetector.detectProject();
        const projectType = options.template || projectInfo.type || 'general';
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
            const projectConfig = {
                name: projectInfo.name,
                description: 'A project using the metacoding workflow skill',
                techStack: projectInfo.techStack,
                projectType,
                testFramework: this.getDefaultTestFramework(projectType),
                buildTool: this.getDefaultBuildTool(projectType),
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
        }
        await this.backupService.cleanupOldBackups();
        console.log(chalk_1.default.green.bold(`\nmetacoding workflow skill is up to date (${filesUpdated} files synced).\n`));
    }
    async validateSetup(options) {
        console.log(chalk_1.default.cyan('Validating metacoding workflow skill...\n'));
        const installedVendors = await this.skillManager.getInstalledVendors();
        if (installedVendors.length === 0) {
            throw new Error('Validation failed: no vendor-specific metacoding installation was found.');
        }
        const targetVendors = this.getTargetVendors(installedVendors, options.vendor);
        for (const vendor of targetVendors) {
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
                const yamlPath = '.codex/skills/metacoding-workflow/agents/openai.yaml';
                const yamlContent = await fs.readFile(yamlPath, 'utf8');
                const parsed = yaml_1.default.parse(yamlContent);
                if (!parsed?.interface?.display_name || !parsed?.interface?.default_prompt) {
                    throw new Error('Validation failed: agents/openai.yaml is missing required interface fields.');
                }
            }
        }
        if (options.strict) {
            const gitignorePath = '.gitignore';
            if (await fs.pathExists(gitignorePath)) {
                const content = await fs.readFile(gitignorePath, 'utf8');
                if (!content.includes('# metacoding: AI coding assistant exclusions')) {
                    throw new Error('Validation failed: .gitignore is missing the metacoding skill exclusion.');
                }
            }
        }
        console.log(chalk_1.default.green('Validation passed.'));
    }
    getDefaultTestFramework(projectType) {
        return projectType === 'python'
            ? 'Pytest'
            : projectType === 'react'
                ? 'Jest + React Testing Library'
                : 'Use the repository default';
    }
    getDefaultBuildTool(projectType) {
        return projectType === 'react'
            ? 'Vite'
            : projectType === 'python'
                ? 'Poetry or the repository default'
                : 'Use the repository default';
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
            throw new Error(`No installed metacoding skill was found for vendor "${normalizedVendor}".`);
        }
        return [normalizedVendor];
    }
    getRequiredFilesForVendor(vendor) {
        if (vendor === 'codex') {
            return [
                '.codex/skills/metacoding-workflow/SKILL.md',
                '.codex/skills/metacoding-workflow/agents/openai.yaml',
                '.codex/skills/metacoding-workflow/references/workflow-rules.md',
                '.codex/skills/metacoding-workflow/references/platform-adaptation.md',
                '.codex/skills/metacoding-workflow/references/project-context.md',
                '.codex/skills/metacoding-workflow/assets/templates/task-entry.md',
            ];
        }
        if (vendor === 'claude-code') {
            return [
                '.claude/agents/metacoding-workflow.md',
                '.claude/metacoding-workflow/SKILL.md',
                '.claude/metacoding-workflow/references/workflow-rules.md',
                '.claude/metacoding-workflow/references/platform-adaptation.md',
                '.claude/metacoding-workflow/references/project-context.md',
                '.claude/metacoding-workflow/assets/templates/task-entry.md',
            ];
        }
        return [
            '.agents/skills/metacoding-workflow/SKILL.md',
            '.agents/skills/metacoding-workflow/references/workflow-rules.md',
            '.agents/skills/metacoding-workflow/references/platform-adaptation.md',
            '.agents/skills/metacoding-workflow/references/project-context.md',
            '.agents/skills/metacoding-workflow/assets/templates/task-entry.md',
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