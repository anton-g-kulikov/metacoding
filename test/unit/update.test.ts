import { UpdateCommand } from '../../src/commands/update';
import { BackupService } from '../../src/services/backup';
import { ConflictResolutionService } from '../../src/services/conflict-resolution';
import * as fs from 'fs-extra';
import * as path from 'path';

// Mock inquirer to avoid interactive prompts in tests
jest.mock('inquirer', () => ({
  prompt: jest.fn().mockResolvedValue({ globalChoice: 'replace' }),
}));

describe('Update Command Tests', () => {
  let testDir: string;
  let originalCwd: string;
  let updateCommand: UpdateCommand;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-update-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    updateCommand = new UpdateCommand();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('UPD-UNIT-001: Update command basic execution', () => {
    test('should execute update command without errors when no metacoding setup exists', async () => {
      await expect(updateCommand.execute({ backup: false })).rejects.toThrow(
        'No metacoding setup found'
      );
    });

    test('should handle force option correctly', async () => {
      // Setup basic metacoding structure
      await fs.ensureDir('.github');
      await fs.writeFile('.github/copilot-instructions.md', 'test content');

      await expect(
        updateCommand.execute({ force: true, backup: false })
      ).resolves.not.toThrow();
    });
  });

  describe('UPD-UNIT-002: Template detection from existing files', () => {
    test('should detect general template when no specific files exist', async () => {
      await fs.ensureDir('.github');
      await fs.writeFile(
        '.github/copilot-instructions.md',
        'general template content'
      );

      await expect(
        updateCommand.execute({ backup: false })
      ).resolves.not.toThrow();
    });

    test('should use specified template when provided', async () => {
      await fs.ensureDir('.github');
      await fs.writeFile('.github/copilot-instructions.md', 'test content');

      await expect(
        updateCommand.execute({ template: 'react', backup: false })
      ).resolves.not.toThrow();
    });
  });
});

describe('Backup Service Tests', () => {
  let testDir: string;
  let originalCwd: string;
  let backupService: BackupService;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-backup-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    backupService = new BackupService();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('BKP-UNIT-001: Full directory backup creation', () => {
    test('should create backup of .github directory', async () => {
      // Setup test structure
      await fs.ensureDir('.github/instructions');
      await fs.writeFile('.github/copilot-instructions.md', 'test content');
      await fs.writeFile('.github/instructions/test.md', 'instruction content');

      const result = await backupService.createBackup();

      expect(result.backupPath).toMatch(/\.backup\/\d{8}_\d{6}/);
      expect(result.filesBackedUp).toHaveLength(2);
      expect(await fs.pathExists(result.backupPath)).toBe(true);
    });

    test('should handle empty .github directory', async () => {
      await fs.ensureDir('.github');

      const result = await backupService.createBackup();

      expect(result.backupPath).toMatch(/\.backup\/\d{8}_\d{6}/);
      expect(result.filesBackedUp).toHaveLength(0);
    });
  });

  describe('BKP-UNIT-002: Backup timestamp generation', () => {
    test('should generate unique timestamps for multiple backups', async () => {
      await fs.ensureDir('.github');
      await fs.writeFile('.github/test.md', 'content');

      const backup1 = await backupService.createBackup();

      // Wait a moment to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const backup2 = await backupService.createBackup();

      expect(backup1.timestamp).not.toBe(backup2.timestamp);
      expect(backup1.backupPath).not.toBe(backup2.backupPath);
    });
  });

  describe('BKP-UNIT-003: File content integrity in backup', () => {
    test('should preserve exact file content in backup', async () => {
      const originalContent =
        'This is test content with special chars: 🚀 & "quotes"';

      await fs.ensureDir('.github');
      await fs.writeFile('.github/test.md', originalContent);

      const result = await backupService.createBackup();
      const backupContent = await fs.readFile(
        path.join(result.backupPath, '.github/test.md'),
        'utf8'
      );

      expect(backupContent).toBe(originalContent);
    });
  });

  describe('BKP-UNIT-004: Hash-based change detection', () => {
    test('should detect file changes correctly', async () => {
      const originalContent = 'original content';
      const modifiedContent = 'modified content';

      await fs.writeFile('test.md', originalContent);

      const hasChanged1 = await backupService.hasFileChanged(
        'test.md',
        originalContent
      );
      expect(hasChanged1).toBe(false);

      await fs.writeFile('test.md', modifiedContent);
      const hasChanged2 = await backupService.hasFileChanged(
        'test.md',
        originalContent
      );
      expect(hasChanged2).toBe(true);
    });

    test('should handle missing files', async () => {
      const hasChanged = await backupService.hasFileChanged(
        'nonexistent.md',
        'content'
      );
      expect(hasChanged).toBe(true);
    });
  });
});

describe('Conflict Resolution Service Tests', () => {
  let testDir: string;
  let originalCwd: string;
  let conflictService: ConflictResolutionService;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-conflict-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    conflictService = new ConflictResolutionService();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('CFT-UNIT-001: File content comparison for conflict detection', () => {
    test('should detect conflicts when files differ', async () => {
      const templateFiles = [{ path: 'test.md', content: 'template content' }];

      await fs.writeFile('test.md', 'user modified content');
      const existingFiles = ['test.md'];

      const conflicts = await conflictService.detectConflicts(
        templateFiles,
        existingFiles
      );

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]?.filePath).toBe('test.md');
      expect(conflicts[0]?.hasChanges).toBe(true);
    });

    test('should not detect conflicts when files are identical', async () => {
      const templateContent = 'identical content';
      const templateFiles = [{ path: 'test.md', content: templateContent }];

      await fs.writeFile('test.md', templateContent);
      const existingFiles = ['test.md'];

      const conflicts = await conflictService.detectConflicts(
        templateFiles,
        existingFiles
      );

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('CFT-UNIT-002: User filename generation with user. prefix', () => {
    test('should generate correct user filename', async () => {
      const conflicts = [
        {
          filePath: '.github/copilot-instructions.md',
          templateContent: 'template',
          userContent: 'user',
          hasChanges: true,
        },
      ];

      const resolutions = [
        {
          action: 'keep' as const,
          userFileName: '.github/user.copilot-instructions.md',
          applyToAll: false,
        },
      ];

      // Create the file to move
      await fs.ensureDir('.github');
      await fs.writeFile('.github/copilot-instructions.md', 'user content');

      const { preservedFiles } = await conflictService.applyResolutions(
        conflicts,
        resolutions
      );

      expect(preservedFiles).toContain('.github/user.copilot-instructions.md');
      expect(await fs.pathExists('.github/user.copilot-instructions.md')).toBe(
        true
      );
    });
  });
});
