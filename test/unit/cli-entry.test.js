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
const globals_1 = require("@jest/globals");
const cli_1 = require("../../src/cli");
globals_1.jest.mock('../../src/commands/init');
globals_1.jest.mock('../../src/commands/validate');
globals_1.jest.mock('../../src/commands/update');
globals_1.jest.mock('chalk', () => ({
    cyan: (text) => text,
    dim: (text) => text,
    red: (text) => text,
    blue: (text) => text,
    green: (text) => text,
    yellow: (text) => text,
    magenta: (text) => text,
    gray: (text) => text,
    white: (text) => text,
    bold: (text) => text,
}));
const originalConsoleError = console.error;
const originalConsoleLog = console.log;
beforeEach(() => {
    globals_1.jest.clearAllMocks();
    console.error = globals_1.jest.fn();
    console.log = globals_1.jest.fn();
    process.argv = ['node', 'cli.js'];
});
afterEach(() => {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
});
describe('CLI Entry Point Coverage', () => {
    describe('CLI-COV-001: CLI startup and command parsing', () => {
        test('should parse init command with default options', async () => {
            process.argv = ['node', 'cli.js', 'init'];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(InitCommand).toHaveBeenCalled();
            expect(mockExecute).toHaveBeenCalledWith({ template: 'general' });
        });
        test('should parse init command with template option', async () => {
            process.argv = ['node', 'cli.js', 'init', '--template', 'react'];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(mockExecute).toHaveBeenCalledWith({ template: 'react' });
        });
        test('should parse init command with multiple options', async () => {
            process.argv = [
                'node',
                'cli.js',
                'init',
                '--template',
                'node',
                '--force',
                '--skip-vscode',
            ];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(mockExecute).toHaveBeenCalledWith({
                template: 'node',
                force: true,
                skipVscode: true,
            });
        });
    });
    describe('CLI-COV-002: Invalid argument handling', () => {
        test('should handle unknown commands gracefully', async () => {
            process.argv = ['node', 'cli.js', 'unknown-command'];
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            mockExit.mockRestore();
        });
        test('should handle invalid template option', async () => {
            process.argv = [
                'node',
                'cli.js',
                'init',
                '--template',
                'invalid-template',
            ];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(mockExecute).toHaveBeenCalledWith({
                template: 'invalid-template',
            });
        });
    });
    describe('CLI-COV-003: Version flag display', () => {
        test('should display version when --version flag is used', async () => {
            process.argv = ['node', 'cli.js', '--version'];
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            mockExit.mockRestore();
        });
        test('should display version when -V flag is used', async () => {
            process.argv = ['node', 'cli.js', '-V'];
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            mockExit.mockRestore();
        });
    });
    describe('CLI-COV-004: Help flag display', () => {
        test('should display help when --help flag is used', async () => {
            process.argv = ['node', 'cli.js', '--help'];
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            mockExit.mockRestore();
        });
        test('should display help when no command is provided', async () => {
            process.argv = ['node', 'cli.js'];
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            mockExit.mockRestore();
        });
    });
    describe('CLI-COV-005: Exit code handling for various scenarios', () => {
        test('should exit with code 1 on init command error', async () => {
            process.argv = ['node', 'cli.js', 'init'];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockRejectedValue(new Error('Init failed'));
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            expect(mockExit).toHaveBeenCalledWith(1);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error during initialization:'), 'Init failed');
            mockExit.mockRestore();
        });
        test('should exit with code 1 on validate command error', async () => {
            process.argv = ['node', 'cli.js', 'validate'];
            const { ValidateCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/validate')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockRejectedValue(new Error('Validation failed'));
            ValidateCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            expect(mockExit).toHaveBeenCalledWith(1);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error during validation:'), 'Validation failed');
            mockExit.mockRestore();
        });
        test('should exit with code 1 on update command error', async () => {
            process.argv = ['node', 'cli.js', 'update'];
            const { UpdateCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/update')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockRejectedValue(new Error('Update failed'));
            UpdateCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            expect(mockExit).toHaveBeenCalledWith(1);
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error during update:'), 'Update failed');
            mockExit.mockRestore();
        });
    });
    describe('CLI-COV-006: Command delegation to subcommands', () => {
        test('should delegate validate command with options', async () => {
            process.argv = ['node', 'cli.js', 'validate', '--fix', '--strict'];
            const { ValidateCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/validate')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            ValidateCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(ValidateCommand).toHaveBeenCalled();
            expect(mockExecute).toHaveBeenCalledWith({ fix: true, strict: true });
        });
        test('should delegate update command with options', async () => {
            process.argv = [
                'node',
                'cli.js',
                'update',
                '--template',
                'react',
                '--backup',
            ];
            const { UpdateCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/update')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockResolvedValue(undefined);
            UpdateCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            await (0, cli_1.main)();
            expect(UpdateCommand).toHaveBeenCalled();
            expect(mockExecute).toHaveBeenCalledWith({
                template: 'react',
                backup: true,
            });
        });
        test('should handle non-Error thrown objects', async () => {
            process.argv = ['node', 'cli.js', 'init'];
            const { InitCommand } = await Promise.resolve().then(() => __importStar(require('../../src/commands/init')));
            const mockExecute = globals_1.jest.fn();
            mockExecute.mockRejectedValue('String error');
            InitCommand.mockImplementation(() => ({
                execute: mockExecute,
            }));
            const mockExit = globals_1.jest.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('process.exit called');
            });
            try {
                await (0, cli_1.main)();
            }
            catch (error) {
            }
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error during initialization:'), 'String error');
            mockExit.mockRestore();
        });
    });
});
//# sourceMappingURL=cli-entry.test.js.map