import { InitOptions } from '../types';
export declare class InitCommand {
    private templateManager;
    private fileSystem;
    private vscodeService;
    private cursorService;
    private projectDetector;
    private gitIgnoreManager;
    private assistantAdapterService;
    constructor();
    execute(options: InitOptions): Promise<void>;
    private getProjectConfiguration;
    private setupProject;
    private getDefaultTestFramework;
    private getDefaultBuildTool;
    private validateAndGetIdeChoice;
    private getEnvironmentChoice;
    private getIdeChoice;
    private getAssistantChoices;
    private setupProjectWithAssistants;
    private generateInitialTaskList;
    private generateInitialTestDoc;
    private displayNextSteps;
}
//# sourceMappingURL=init.d.ts.map