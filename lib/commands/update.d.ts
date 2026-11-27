import { UpdateOptions } from '../types';
export declare class UpdateCommand {
    private readonly skillManager;
    private readonly backupService;
    private readonly conflictService;
    private readonly projectDetector;
    private readonly gitIgnoreManager;
    constructor();
    execute(options: UpdateOptions): Promise<void>;
    private migrateLegacyClaudeInstall;
    private cleanUpRetiredFiles;
    private validateSetup;
    private getDefaultTestFramework;
    private getDefaultBuildTool;
    private getTargetVendors;
    private getRequiredFilesForVendor;
    private normalizeVendor;
}
//# sourceMappingURL=update.d.ts.map