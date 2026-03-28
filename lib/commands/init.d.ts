import { InitOptions } from '../types';
export declare class InitCommand {
    private readonly skillManager;
    private readonly fileSystem;
    private readonly projectDetector;
    private readonly gitIgnoreManager;
    constructor();
    execute(options: InitOptions): Promise<void>;
    private getProjectConfiguration;
    private setupProject;
    private getDefaultTestFramework;
    private getDefaultBuildTool;
    private displayNextSteps;
    private getVendorChoice;
    private displayNextStepsForVendor;
    private expandVendorChoice;
    private normalizeVendor;
}
//# sourceMappingURL=init.d.ts.map