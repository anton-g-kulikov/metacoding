import * as fs from 'fs-extra';
import * as path from 'path';
import { FileSystemService } from '../../src/services/filesystem';
import { createTempWorkspace } from './test-utils';

describe('FileSystemService', () => {
  test('reads, writes, copies, and detects the installed skill layout', async () => {
    const workspace = await createTempWorkspace('metacoding-filesystem');
    const service = new FileSystemService();
    const originalCwd = process.cwd();

    process.chdir(workspace);

    await service.writeFile(
      '.codex/skills/metacoding-workflow/SKILL.md',
      'skill content'
    );
    await service.writeFile(
      '.codex/skills/metacoding-workflow/agents/openai.yaml',
      'interface: {}'
    );
    await service.copyFile(
      '.codex/skills/metacoding-workflow/SKILL.md',
      '.codex/skills/metacoding-workflow/SKILL.copy.md'
    );

    expect(await service.isMetaCodingSetup()).toBe(true);
    expect(
      await service.readFile('.codex/skills/metacoding-workflow/SKILL.copy.md')
    ).toBe('skill content');
    expect(
      await service.listFiles('.codex/skills/metacoding-workflow')
    ).toEqual(
      expect.arrayContaining(['SKILL.copy.md', 'SKILL.md', 'agents'])
    );

    const backupPath = await service.backupFile(
      '.codex/skills/metacoding-workflow/SKILL.md'
    );

    expect(await fs.pathExists(path.join(workspace, backupPath))).toBe(true);
    process.chdir(originalCwd);
  });

  test('returns false when the workflow skill is not installed', async () => {
    const workspace = await createTempWorkspace('metacoding-filesystem-empty');
    const service = new FileSystemService();
    const originalCwd = process.cwd();

    process.chdir(workspace);
    expect(await service.isMetaCodingSetup()).toBe(false);
    process.chdir(originalCwd);
  });

  test('detects Claude Code and Antigravity installations', async () => {
    const workspace = await createTempWorkspace('metacoding-filesystem-vendors');
    const service = new FileSystemService();
    const originalCwd = process.cwd();

    process.chdir(workspace);

    await fs.ensureDir('.claude/agents');
    await fs.writeFile('.claude/agents/metacoding-workflow.md', 'agent', 'utf8');
    expect(await service.isMetaCodingSetup()).toBe(true);

    await fs.remove('.claude');
    await fs.ensureDir('.agents/skills/metacoding-workflow');
    await fs.writeFile('.agents/skills/metacoding-workflow/SKILL.md', 'skill', 'utf8');
    expect(await service.isMetaCodingSetup()).toBe(true);

    process.chdir(originalCwd);
  });
});
