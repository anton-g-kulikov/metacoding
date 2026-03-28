import { UpdateOptions } from '../types';
export declare class UpdateCommand {
    private readonly skillManager;
    private readonly backupService;
    private readonly conflictService;
    private readonly projectDetector;
    constructor();
    execute(options: UpdateOptions): Promise<void>;
    private validateSetup;
    private getDefaultTestFramework;
    private getDefaultBuildTool;
    private getTargetVendors;
    private getRequiredFilesForVendor;
    private normalizeVendor;
}
//# sourceMappingURL=update.d.ts.map