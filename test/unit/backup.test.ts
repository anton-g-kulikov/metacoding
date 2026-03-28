import * as fs from 'fs-extra';
import * as path from 'path';
import { BackupService } from '../../src/services/backup';
import { createTempWorkspace } from './test-utils';

describe('BackupService', () => {
  const originalCwd = process.cwd();

  afterEach(() => {
    process.chdir(originalCwd);
  });

  test('backs up requested targets and detects file changes', async () => {
    const workspace = await createTempWorkspace('metacoding-backup');
    process.chdir(workspace);

    await fs.ensureDir('.codex/skills/metacoding-workflow');
    await fs.writeFile('.codex/skills/metacoding-workflow/SKILL.md', 'v1', 'utf8');

    const service = new BackupService();
    const backup = await service.createBackup(['.codex/skills/metacoding-workflow']);

    expect(backup.filesBackedUp).toContain('.codex/skills/metacoding-workflow/SKILL.md');
    expect(
      await service.hasFileChanged('.codex/skills/metacoding-workflow/SKILL.md', 'v1')
    ).toBe(false);
    expect(
      await service.hasFileChanged('.codex/skills/metacoding-workflow/SKILL.md', 'v2')
    ).toBe(true);
    expect(await service.getFileHash('missing.txt')).toBeNull();
  });

  test('cleans up old backups beyond the most recent five', async () => {
    const workspace = await createTempWorkspace('metacoding-backup-prune');
    process.chdir(workspace);

    await fs.ensureDir('.backup');
    for (const dir of [
      '20240101_000000',
      '20240102_000000',
      '20240103_000000',
      '20240104_000000',
      '20240105_000000',
      '20240106_000000',
      'ignore-me',
    ]) {
      await fs.ensureDir(path.join('.backup', dir));
    }

    const service = new BackupService();
    await service.cleanupOldBackups();

    const remaining = await fs.readdir('.backup');
    expect(remaining).toContain('20240106_000000');
    expect(remaining).toContain('ignore-me');
    expect(remaining).not.toContain('20240101_000000');
  });

  test('skips cleanup when the backup directory does not exist', async () => {
    const workspace = await createTempWorkspace('metacoding-backup-empty');
    process.chdir(workspace);

    const service = new BackupService();
    await expect(service.cleanupOldBackups()).resolves.toBeUndefined();
  });
});
