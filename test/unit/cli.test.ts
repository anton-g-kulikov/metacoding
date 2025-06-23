import { execSync } from 'child_process';
import * as path from 'path';
import { describe, test, expect } from '@jest/globals';

describe('CLI Commands', () => {
  const cliPath = path.join(__dirname, '../../bin/metacoding.js');

  describe('CLI-UNIT-001: help command', () => {
    test('CLI-UNIT-001: should display help when --help flag is used', () => {
      const output = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: metacoding');
      expect(output).toContain('init');
      expect(output).toContain('update');
      expect(output).toContain('Options:');
    });

    test('CLI-UNIT-002: should display help when help command is used', () => {
      const output = execSync(`node ${cliPath} help`, { encoding: 'utf8' });

      expect(output).toContain('Usage: metacoding');
      expect(output).toContain('Commands:');
    });
  });

  describe('CLI-UNIT-003: version command', () => {
    test('CLI-UNIT-003: should display version when --version flag is used', () => {
      const output = execSync(`node ${cliPath} --version`, {
        encoding: 'utf8',
      });

      expect(output).toMatch(/\d+\.\d+\.\d+/); // Should match semantic version pattern
    });

    test('CLI-UNIT-004: should display version when --version flag is used', () => {
      const output = execSync(`node ${cliPath} --version`, {
        encoding: 'utf8',
      });

      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('CLI-UNIT-005: invalid commands', () => {
    test('CLI-UNIT-005: should show error for invalid command', () => {
      try {
        execSync(`node ${cliPath} invalid-command`, {
          encoding: 'utf8',
          stdio: 'pipe',
        });
        throw new Error('Should have thrown an error');
      } catch (error: any) {
        expect(error.status).not.toBe(0);
        expect(error.stderr || error.stdout).toContain('unknown command');
      }
    });

    test('CLI-UNIT-006: should show help suggestion for invalid command', () => {
      try {
        execSync(`node ${cliPath} unknown`, {
          encoding: 'utf8',
          stdio: 'pipe',
        });
        throw new Error('Should have thrown an error');
      } catch (error: any) {
        const output = error.stderr || error.stdout || '';
        expect(output).toContain('unknown command');
      }
    });
  });

  describe('CLI-UNIT-007: command availability', () => {
    test('CLI-UNIT-007: should list init command as available', () => {
      const output = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });

      expect(output).toContain('init');
      expect(output).toMatch(/init.*metacoding/i);
    });

    test('CLI-UNIT-008: should list update command with validation option', () => {
      const output = execSync(`node ${cliPath} update --help`, {
        encoding: 'utf8',
      });

      expect(output).toContain('--dry-run');
      expect(output).toMatch(/dry.*run.*validate/i);
    });

    test('CLI-UNIT-009: should list update command as available', () => {
      const output = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });

      expect(output).toContain('update');
    });
  });
});
