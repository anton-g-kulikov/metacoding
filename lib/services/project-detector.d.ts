export declare class ProjectDetector {
    detectProject(): Promise<{
        name: string;
        type: string;
        hasGit: boolean;
        techStack: string[];
    }>;
    private detectProjectType;
    private detectTechStack;
    private collectDependencies;
    private readPackageJson;
    private hasAnyFile;
}
//# sourceMappingURL=project-detector.d.ts.map