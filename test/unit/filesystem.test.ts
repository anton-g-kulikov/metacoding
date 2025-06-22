import { FileSystemService } from '../../src/services/filesystem';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('FileSystemService', () => {
  let service: FileSystemService;
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    service = new FileSystemService();
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-unit-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('isMetaCodingSetup', () => {
    test('CORE-UNIT-001: should return false when no metacoding files exist', async () => {
      const result = await service.isMetaCodingSetup();
      expect(result).toBe(false);
    });

    test('CORE-UNIT-002: should return true when all required files exist', async () => {
      await fs.ensureDir('.github/instructions');
      await fs.writeFile('.github/copilot-instructions.md', 'test');

      const result = await service.isMetaCodingSetup();
      expect(result).toBe(true);
    });

    test('CORE-UNIT-003: should return false when only partial setup exists', async () => {
      await fs.ensureDir('.github');
      await fs.writeFile('.github/copilot-instructions.md', 'test');

      const result = await service.isMetaCodingSetup();
      expect(result).toBe(false);
    });
  });

  describe('ensureDirectoryExists', () => {
    test('CORE-UNIT-004: should create directory if it does not exist', async () => {
      const dirPath = 'test/nested/directory';

      expect(await fs.pathExists(dirPath)).toBe(false);

      await service.ensureDirectoryExists(dirPath);

      expect(await fs.pathExists(dirPath)).toBe(true);
    });

    test('CORE-UNIT-005: should not fail if directory already exists', async () => {
      const dirPath = 'existing-dir';
      await fs.ensureDir(dirPath);

      await expect(
        service.ensureDirectoryExists(dirPath)
      ).resolves.not.toThrow();
    });
  });

  describe('writeFile and readFile', () => {
    test('CORE-UNIT-006: should write and read file content correctly', async () => {
      const filePath = 'test-file.txt';
      const content = 'Hello, World!';

      await service.writeFile(filePath, content);
      const readContent = await service.readFile(filePath);

      expect(readContent).toBe(content);
    });

    test('CORE-UNIT-007: should create directories if they do not exist', async () => {
      const filePath = 'nested/directory/file.txt';
      const content = 'Test content';

      await service.writeFile(filePath, content);

      expect(await fs.pathExists('nested/directory')).toBe(true);
      expect(await service.readFile(filePath)).toBe(content);
    });
  });

  describe('fileExists', () => {
    test('CORE-UNIT-008: should return true for existing file', async () => {
      await fs.writeFile('existing-file.txt', 'content');

      const result = await service.fileExists('existing-file.txt');
      expect(result).toBe(true);
    });

    test('CORE-UNIT-009: should return false for non-existing file', async () => {
      const result = await service.fileExists('non-existing-file.txt');
      expect(result).toBe(false);
    });
  });

  describe('getCurrentDirectoryName', () => {
    test('CORE-UNIT-010: should return current directory name', () => {
      const result = service.getCurrentDirectoryName();
      expect(result).toBe(path.basename(testDir));
    });
  });
});
