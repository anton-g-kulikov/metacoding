import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { ConflictResolutionService } from '../../src/services/conflict-resolution';
import { createTempWorkspace } from './test-utils';

describe('ConflictResolutionService', () => {
  const originalCwd = process.cwd();

  afterEach(() => {
    process.chdir(originalCwd);
  });

  test('detects and preserves local files when keeping user edits', async () => {
    const workspace = await createTempWorkspace('metacoding-conflicts');
    process.chdir(workspace);

    const filePath = path.join(workspace, '.codex/skills/metacoding-workflow/SKILL.md');
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, 'user version', 'utf8');

    const service = new ConflictResolutionService();
    const conflicts = await service.detectConflicts(
      [{ path: filePath, content: 'template version' }],
      [filePath]
    );

    expect(conflicts).toHaveLength(1);

    await service.applyResolutions(conflicts, [
      {
        action: 'keep',
        userFileName: path.join(
          workspace,
          '.codex/skills/metacoding-workflow/user.SKILL.md'
        ),
      },
    ]);

    expect(await fs.readFile(filePath, 'utf8')).toBe('template version');
    expect(
      await fs.readFile(
        path.join(workspace, '.codex/skills/metacoding-workflow/user.SKILL.md'),
        'utf8'
      )
    ).toBe('user version');
  });

  test('supports interactive conflict selection and cancel flow', async () => {
    const workspace = await createTempWorkspace('metacoding-conflicts-interactive');
    process.chdir(workspace);

    const filePath = path.join(workspace, 'skill.md');
    await fs.writeFile(filePath, 'user version', 'utf8');

    const conflicts = [
      {
        filePath,
        templateContent: 'template version',
        userContent: 'user version',
        hasChanges: true,
      },
    ];

    const service = new ConflictResolutionService();

    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ globalChoice: 'individual' } as never)
      .mockResolvedValueOnce({ choice: 'replace' } as never);

    await expect(service.getConflictResolution(conflicts)).resolves.toEqual([
      { action: 'replace', userFileName: undefined, applyToAll: false },
    ]);

    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      globalChoice: 'cancel',
    } as never);

    await expect(service.getConflictResolution(conflicts)).rejects.toThrow(
      'Update cancelled by user'
    );
  });

  test('handles empty conflict lists and skipped resolutions', async () => {
    const workspace = await createTempWorkspace('metacoding-conflicts-skip');
    process.chdir(workspace);

    const service = new ConflictResolutionService();
    await expect(service.getConflictResolution([])).resolves.toEqual([]);

    const filePath = path.join(workspace, 'skill.md');
    await fs.writeFile(filePath, 'user version', 'utf8');

    const result = await service.applyResolutions(
      [
        {
          filePath,
          templateContent: 'template version',
          userContent: 'user version',
          hasChanges: true,
        },
      ],
      [{ action: 'skip' }]
    );

    expect(result).toEqual({ preservedFiles: [], updatedFiles: [] });
    expect(await fs.readFile(filePath, 'utf8')).toBe('user version');
  });
});
