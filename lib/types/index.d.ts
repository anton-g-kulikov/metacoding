export interface InitOptions {
    template: string;
    force?: boolean;
    skipVscode?: boolean;
    skipGit?: boolean;
    vscode?: boolean;
    cursor?: boolean;
    ide?: string;
}
export interface UpdateOptions {
    template?: string;
    backup?: boolean;
    force?: boolean;
    dryRun?: boolean;
    strict?: boolean;
}
export interface ProjectConfig {
    name: string;
    description: string;
    techStack: string[];
    projectType: string;
    testFramework?: string;
    buildTool?: string;
    ideChoice?: 'vscode' | 'cursor';
}
export interface Template {
    name: string;
    description: string;
    files: TemplateFile[];
    prompts: TemplatePrompt[];
    vscodeSettings?: Record<string, any>;
}
export interface TemplateFile {
    source: string;
    destination: string;
    template: boolean;
}
export interface TemplatePrompt {
    name: string;
    type: 'input' | 'list' | 'confirm';
    message: string;
    choices?: string[];
    default?: any;
    validate?: (input: any) => boolean | string;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}
export interface ValidationError {
    code: string;
    message: string;
    file?: string;
    fixable: boolean;
}
export interface ValidationWarning {
    code: string;
    message: string;
    file?: string;
}
export interface FileSystemResult {
    success: boolean;
    error?: string;
    created?: string[];
    updated?: string[];
    skipped?: string[];
}
export interface ConflictResolution {
    action: 'keep' | 'replace' | 'skip';
    userFileName?: string | undefined;
    applyToAll?: boolean;
}
export interface UpdateConflict {
    filePath: string;
    templateContent: string;
    userContent: string;
    hasChanges: boolean;
}
export interface BackupResult {
    backupPath: string;
    timestamp: string;
    filesBackedUp: string[];
}
//# sourceMappingURL=index.d.ts.map