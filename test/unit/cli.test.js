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
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
describe('CLI Commands', () => {
    const cliPath = path.join(__dirname, '../../bin/metacoding.js');
    describe('CLI-UNIT-001: help command', () => {
        test('CLI-UNIT-001: should display help when --help flag is used', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --help`, { encoding: 'utf8' });
            expect(output).toContain('Usage: metacoding');
            expect(output).toContain('init');
            expect(output).toContain('validate');
            expect(output).toContain('update');
            expect(output).toContain('Options:');
        });
        test('CLI-UNIT-002: should display help when help command is used', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} help`, { encoding: 'utf8' });
            expect(output).toContain('Usage: metacoding');
            expect(output).toContain('Commands:');
        });
    });
    describe('CLI-UNIT-003: version command', () => {
        test('CLI-UNIT-003: should display version when --version flag is used', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --version`, {
                encoding: 'utf8',
            });
            expect(output).toMatch(/\d+\.\d+\.\d+/);
        });
        test('CLI-UNIT-004: should display version when --version flag is used', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --version`, {
                encoding: 'utf8',
            });
            expect(output).toMatch(/\d+\.\d+\.\d+/);
        });
    });
    describe('CLI-UNIT-005: invalid commands', () => {
        test('CLI-UNIT-005: should show error for invalid command', () => {
            try {
                (0, child_process_1.execSync)(`node ${cliPath} invalid-command`, {
                    encoding: 'utf8',
                    stdio: 'pipe',
                });
                fail('Should have thrown an error');
            }
            catch (error) {
                expect(error.status).not.toBe(0);
                expect(error.stderr || error.stdout).toContain('unknown command');
            }
        });
        test('CLI-UNIT-006: should show help suggestion for invalid command', () => {
            try {
                (0, child_process_1.execSync)(`node ${cliPath} unknown`, {
                    encoding: 'utf8',
                    stdio: 'pipe',
                });
                fail('Should have thrown an error');
            }
            catch (error) {
                const output = error.stderr || error.stdout || '';
                expect(output).toContain('unknown command');
            }
        });
    });
    describe('CLI-UNIT-007: command availability', () => {
        test('CLI-UNIT-007: should list init command as available', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --help`, { encoding: 'utf8' });
            expect(output).toContain('init');
            expect(output).toMatch(/init.*metacoding/i);
        });
        test('CLI-UNIT-008: should list validate command as available', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --help`, { encoding: 'utf8' });
            expect(output).toContain('validate');
        });
        test('CLI-UNIT-009: should list update command as available', () => {
            const output = (0, child_process_1.execSync)(`node ${cliPath} --help`, { encoding: 'utf8' });
            expect(output).toContain('update');
        });
    });
});
//# sourceMappingURL=cli.test.js.map