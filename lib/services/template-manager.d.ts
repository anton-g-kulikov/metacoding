import { Template, ProjectConfig } from '../types';
export declare class TemplateManager {
    private readonly templatesDir;
    private readonly instructionsDir;
    constructor();
    getTemplate(templateName: string, projectConfig?: ProjectConfig): Promise<Template>;
    private loadInstructionFiles;
    processTemplate(template: Template, config: ProjectConfig): Promise<Array<{
        path: string;
        content: string;
    }>>;
    getAvailableTemplates(): Promise<string[]>;
    private loadTemplateFiles;
    private processTemplateContent;
    private getProjectDomain;
    private getProjectSpecificGuidance;
    getInstructionFiles(templateType: string): Promise<Array<{
        path: string;
        content: string;
    }>>;
    private getCodingInstructionFiles;
}
//# sourceMappingURL=template-manager.d.ts.map