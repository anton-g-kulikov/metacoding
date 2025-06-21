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
exports.VSCodeService = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class VSCodeService {
    constructor() {
        this.vscodeDir = '.vscode';
        this.settingsFile = path.join(this.vscodeDir, 'settings.json');
    }
    async updateSettings(additionalSettings = {}) {
        const requiredSettings = {
            'github.copilot.chat.codeGeneration.useInstructionFiles': true,
            'chat.promptFiles': true,
            ...additionalSettings,
        };
        let existingSettings = {};
        if (await fs.pathExists(this.settingsFile)) {
            try {
                const content = await fs.readFile(this.settingsFile, 'utf8');
                existingSettings = JSON.parse(content);
            }
            catch (error) {
                await this.backupSettings();
                existingSettings = {};
            }
        }
        const mergedSettings = {
            ...existingSettings,
            ...requiredSettings,
        };
        await fs.ensureDir(this.vscodeDir);
        await fs.writeFile(this.settingsFile, JSON.stringify(mergedSettings, null, 2), 'utf8');
    }
    async isConfigured() {
        if (!(await fs.pathExists(this.settingsFile))) {
            return false;
        }
        try {
            const content = await fs.readFile(this.settingsFile, 'utf8');
            const settings = JSON.parse(content);
            return (settings['github.copilot.chat.codeGeneration.useInstructionFiles'] ===
                true && settings['chat.promptFiles'] === true);
        }
        catch {
            return false;
        }
    }
    async backupSettings() {
        if (!(await fs.pathExists(this.settingsFile))) {
            return null;
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${this.settingsFile}.backup-${timestamp}`;
        await fs.copy(this.settingsFile, backupPath);
        return backupPath;
    }
    async getSettings() {
        if (!(await fs.pathExists(this.settingsFile))) {
            return {};
        }
        try {
            const content = await fs.readFile(this.settingsFile, 'utf8');
            return JSON.parse(content);
        }
        catch {
            return {};
        }
    }
    async hasVSCodeConfiguration() {
        return await fs.pathExists(this.vscodeDir);
    }
}
exports.VSCodeService = VSCodeService;
//# sourceMappingURL=vscode.js.map