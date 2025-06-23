import { UpdateOptions } from '../types';
export declare class UpdateCommand {
    private templateManager;
    private backupService;
    private conflictService;
    private vscodeService;
    private projectDetector;
    constructor();
    execute(options: UpdateOptions): Promise<void>;
    private detectCurrentTemplate;
    private getProjectConfig;
    private getExistingMetacodingFiles;
    private displayUpdateSummary;
}
//# sourceMappingURL=update.d.ts.map