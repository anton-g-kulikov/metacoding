import { jest } from '@jest/globals';
import { main } from '../../src/cli';

// Mock dependencies
jest.mock('../../src/commands/init');
jest.mock('../../src/commands/validate');
jest.mock('../../src/commands/update');
jest.mock('chalk', () => ({
  cyan: (text: string) => text,
  dim: (text: string) => text,
  red: (text: string) => text,
  blue: (text: string) => text,
  green: (text: string) => text,
  yellow: (text: string) => text,
  magenta: (text: string) => text,
  gray: (text: string) => text,
  white: (text: string) => text,
  bold: (text: string) => text,
}));

// Mock console methods to avoid output during tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeEach(() => {
  jest.clearAllMocks();
  console.error = jest.fn();
  console.log = jest.fn();
  // Reset process.argv to clean state
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

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

      expect(InitCommand).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith({ template: 'general' });
    });

    test('should parse init command with template option', async () => {
      process.argv = ['node', 'cli.js', 'init', '--template', 'react'];

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

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

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

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

      // Mock process.exit to prevent test termination
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
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

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

      // Should still call execute with invalid template (let command handle validation)
      expect(mockExecute).toHaveBeenCalledWith({
        template: 'invalid-template',
      });
    });
  });

  describe('CLI-COV-003: Version flag display', () => {
    test('should display version when --version flag is used', async () => {
      process.argv = ['node', 'cli.js', '--version'];

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      mockExit.mockRestore();
    });

    test('should display version when -V flag is used', async () => {
      process.argv = ['node', 'cli.js', '-V'];

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      mockExit.mockRestore();
    });
  });

  describe('CLI-COV-004: Help flag display', () => {
    test('should display help when --help flag is used', async () => {
      process.argv = ['node', 'cli.js', '--help'];

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      mockExit.mockRestore();
    });

    test('should display help when no command is provided', async () => {
      process.argv = ['node', 'cli.js'];

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      mockExit.mockRestore();
    });
  });

  describe('CLI-COV-005: Exit code handling for various scenarios', () => {
    test('should exit with code 1 on init command error', async () => {
      process.argv = ['node', 'cli.js', 'init'];

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockRejectedValue(new Error('Init failed'));
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error during initialization:'),
        'Init failed'
      );

      mockExit.mockRestore();
    });

    test('should exit with code 1 on validate command error', async () => {
      process.argv = ['node', 'cli.js', 'validate'];

      const { ValidateCommand } = await import('../../src/commands/validate');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockRejectedValue(new Error('Validation failed'));
      (ValidateCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error during validation:'),
        'Validation failed'
      );

      mockExit.mockRestore();
    });

    test('should exit with code 1 on update command error', async () => {
      process.argv = ['node', 'cli.js', 'update'];

      const { UpdateCommand } = await import('../../src/commands/update');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockRejectedValue(new Error('Update failed'));
      (UpdateCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error during update:'),
        'Update failed'
      );

      mockExit.mockRestore();
    });
  });

  describe('CLI-COV-006: Command delegation to subcommands', () => {
    test('should delegate validate command with options', async () => {
      process.argv = ['node', 'cli.js', 'validate', '--fix', '--strict'];

      const { ValidateCommand } = await import('../../src/commands/validate');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (ValidateCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

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

      const { UpdateCommand } = await import('../../src/commands/update');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockResolvedValue(undefined);
      (UpdateCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      await main();

      expect(UpdateCommand).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith({
        template: 'react',
        backup: true,
      });
    });

    test('should handle non-Error thrown objects', async () => {
      process.argv = ['node', 'cli.js', 'init'];

      const { InitCommand } = await import('../../src/commands/init');
      const mockExecute = jest.fn() as jest.MockedFunction<any>;
      mockExecute.mockRejectedValue('String error');
      (InitCommand as any).mockImplementation(() => ({
        execute: mockExecute,
      }));

      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      try {
        await main();
      } catch (error) {
        // Expected to throw due to mocked process.exit
      }

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error during initialization:'),
        'String error'
      );

      mockExit.mockRestore();
    });
  });
});
