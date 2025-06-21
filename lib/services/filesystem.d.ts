export declare class FileSystemService {
    isMetaCodingSetup(): Promise<boolean>;
    ensureDirectoryExists(dirPath: string): Promise<void>;
    writeFile(filePath: string, content: string): Promise<void>;
    readFile(filePath: string): Promise<string>;
    fileExists(filePath: string): Promise<boolean>;
    copyFile(source: string, destination: string): Promise<void>;
    listFiles(dirPath: string): Promise<string[]>;
    backupFile(filePath: string): Promise<string>;
    getCurrentDirectory(): string;
    getCurrentDirectoryName(): string;
}
//# sourceMappingURL=filesystem.d.ts.map