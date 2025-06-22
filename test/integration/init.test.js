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
const filesystem_1 = require("../../src/services/filesystem");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
describe('InitCommand Integration', () => {
    let testDir;
    let originalCwd;
    beforeEach(async () => {
        originalCwd = process.cwd();
        testDir = path.join(__dirname, '../../tmp-test-' + Date.now());
        await fs.ensureDir(testDir);
        process.chdir(testDir);
        process.env.NODE_ENV = 'test';
    });
    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(testDir);
    });
    test('CLI-INT-001: should create basic metacoding structure with force flag', async () => {
        const initCommand = new init_1.InitCommand();
        const fileSystem = new filesystem_1.FileSystemService();
        const options = {
            template: 'general',
            force: true,
            skipVscode: true,
            skipGit: true,
        };
        await initCommand.execute(options);
        expect(await fileSystem.fileExists('.github')).toBe(true);
        expect(await fileSystem.fileExists('.github/instructions')).toBe(true);
        expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
    });
    test('CLI-INT-002: should detect existing metacoding setup', async () => {
        const fileSystem = new filesystem_1.FileSystemService();
        expect(await fileSystem.isMetaCodingSetup()).toBe(false);
        await fs.ensureDir('.github/instructions');
        await fs.writeFile('.github/copilot-instructions.md', 'test content');
        expect(await fileSystem.isMetaCodingSetup()).toBe(true);
    });
});
//# sourceMappingURL=init.test.js.map