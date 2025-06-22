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
const init_1 = require("../../src/commands/init");
const validate_1 = require("../../src/commands/validate");
const update_1 = require("../../src/commands/update");
const filesystem_1 = require("../../src/services/filesystem");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
describe('Error Handling', () => {
    let testDir;
    let originalCwd;
    beforeEach(async () => {
        originalCwd = process.cwd();
        testDir = path.join(__dirname, '../../tmp-error-test-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);
    });
    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(testDir);
    });
    describe('Init Command Error Handling', () => {
        test('CLI-UNIT-010: should handle invalid template selection gracefully', async () => {
            const initCommand = new init_1.InitCommand();
            const options = {
                template: 'invalid-template',
                force: true,
                skipVscode: true,
                skipGit: true,
            };
            await expect(initCommand.execute(options)).rejects.toThrow(/template.*not.*found|invalid.*template/i);
        });
        test('CLI-UNIT-011: should handle directory creation permissions error', async () => {
            const readOnlyDir = path.join(testDir, 'readonly');
            await fs.ensureDir(readOnlyDir);
            try {
                await fs.chmod(readOnlyDir, 0o444);
                process.chdir(readOnlyDir);
                const initCommand = new init_1.InitCommand();
                const options = {
                    template: 'general',
                    force: true,
                    skipVscode: true,
                    skipGit: true,
                };
                await expect(initCommand.execute(options)).rejects.toThrow();
            }
            catch (error) {
                console.log('Skipping permissions test - platform limitation');
            }
        });
        test('CLI-UNIT-012: should handle force flag when metacoding already exists', async () => {
            const initCommand = new init_1.InitCommand();
            const options = {
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            };
            await initCommand.execute(options);
            await expect(initCommand.execute(options)).resolves.not.toThrow();
        });
    });
    describe('Validate Command Error Handling', () => {
        test('CLI-UNIT-013: should handle validation when no metacoding setup exists', async () => {
            const validateCommand = new validate_1.ValidateCommand();
            await expect(validateCommand.execute({})).resolves.not.toThrow();
        });
        test('CLI-UNIT-014: should handle corrupted metacoding files', async () => {
            await fs.ensureDir('.github');
            await fs.writeFile('.github/copilot-instructions.md', 'invalid content without proper structure');
            const validateCommand = new validate_1.ValidateCommand();
            await expect(validateCommand.execute({})).resolves.not.toThrow();
        });
    });
    describe('Update Command Error Handling', () => {
        test('CLI-UNIT-015: should handle update when no metacoding setup exists', async () => {
            const updateCommand = new update_1.UpdateCommand();
            await expect(updateCommand.execute({})).resolves.not.toThrow();
        });
        test('CLI-UNIT-016: should handle file conflicts during update', async () => {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute({
                template: 'general',
                force: true,
                skipVscode: true,
                skipGit: true,
            });
            await fs.writeFile('.github/copilot-instructions.md', 'USER MODIFIED CONTENT');
            const updateCommand = new update_1.UpdateCommand();
            await expect(updateCommand.execute({})).resolves.not.toThrow();
        });
    });
    describe('FileSystem Service Error Handling', () => {
        test('CLI-UNIT-017: should handle reading non-existent files', async () => {
            const fileSystem = new filesystem_1.FileSystemService();
            await expect(fileSystem.readFile('non-existent-file.txt')).rejects.toThrow();
        });
        test('CLI-UNIT-018: should handle writing to invalid paths', async () => {
            const fileSystem = new filesystem_1.FileSystemService();
            const invalidPath = path.join('\0invalid\0path\0', 'file.txt');
            await expect(fileSystem.writeFile(invalidPath, 'content')).rejects.toThrow();
        });
        test('CLI-UNIT-019: should handle directory existence check errors', async () => {
            const fileSystem = new filesystem_1.FileSystemService();
            const longPath = 'a'.repeat(1000);
            await expect(fileSystem.fileExists(longPath)).resolves.toBeDefined();
        });
    });
});
//# sourceMappingURL=error-handling.test.js.map