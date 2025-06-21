import { InitOptions } from '../types';
export declare class InitCommand {
    private templateManager;
    private fileSystem;
    private vscodeService;
    private projectDetector;
    constructor();
    execute(options: InitOptions): Promise<void>;
    private getProjectConfiguration;
    private setupProject;
    private getDefaultTestFramework;
    private getDefaultBuildTool;
    private displayNextSteps;
}
//# sourceMappingURL=init.d.ts.map