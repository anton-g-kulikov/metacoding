export declare class VSCodeService {
    private readonly vscodeDir;
    private readonly settingsFile;
    updateSettings(additionalSettings?: Record<string, any>): Promise<void>;
    isConfigured(): Promise<boolean>;
    backupSettings(): Promise<string | null>;
    getSettings(): Promise<Record<string, any>>;
    hasVSCodeConfiguration(): Promise<boolean>;
}
//# sourceMappingURL=vscode.d.ts.map