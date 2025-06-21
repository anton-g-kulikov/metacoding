"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class FileSystemService {
    async isMetaCodingSetup() {
        const githubDir = '.github';
        const copilotInstructions = path.join(githubDir, 'copilot-instructions.md');
        const instructionsDir = path.join(githubDir, 'instructions');
        return (await fs.pathExists(copilotInstructions) &&
            await fs.pathExists(instructionsDir));
    }
    async ensureDirectoryExists(dirPath) {
        await fs.ensureDir(dirPath);
    }
    async writeFile(filePath, content) {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf8');
    }
    async readFile(filePath) {
        return await fs.readFile(filePath, 'utf8');
    }
    async fileExists(filePath) {
        return await fs.pathExists(filePath);
    }
    async copyFile(source, destination) {
        await fs.ensureDir(path.dirname(destination));
        await fs.copy(source, destination);
    }
    async listFiles(dirPath) {
        if (!(await fs.pathExists(dirPath))) {
            return [];
        }
        return await fs.readdir(dirPath);
    }
    async backupFile(filePath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${filePath}.backup-${timestamp}`;
        await fs.copy(filePath, backupPath);
        return backupPath;
    }
    getCurrentDirectory() {
        return process.cwd();
    }
    getCurrentDirectoryName() {
        return path.basename(this.getCurrentDirectory());
    }
}
exports.FileSystemService = FileSystemService;
//# sourceMappingURL=filesystem.js.map