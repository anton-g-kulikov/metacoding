import * as fs from 'fs-extra';
import * as path from 'path';
import { GitIgnoreManager } from '../../src/services/gitignore-manager';
import { createTempWorkspace } from './test-utils';

describe('GitIgnoreManager', () => {
  test('appends metacoding skill exclusions once', async () => {
    const workspace = await createTempWorkspace('metacoding-gitignore');
    const manager = new GitIgnoreManager();
    const gitignorePath = path.join(workspace, '.gitignore');

    await fs.writeFile(gitignorePath, 'node_modules/\n', 'utf8');
    await manager.updateGitIgnore(workspace);
    await manager.updateGitIgnore(workspace);

    const gitignore = await fs.readFile(gitignorePath, 'utf8');

    expect(gitignore.match(/# metacoding:/g)).toHaveLength(1);
    expect(gitignore).toContain('.codex/skills/metacoding-*/');
    expect(gitignore).toContain('.claude/skills/metacoding-*/');
    expect(gitignore).toContain('.agents/skills/metacoding-*/');
    expect(GitIgnoreManager.createTemplateContent()).toContain('.backup/');
  });

  test('adds patterns that an existing metacoding section is missing', async () => {
    const workspace = await createTempWorkspace('metacoding-gitignore-missing');
    const manager = new GitIgnoreManager();
    const gitignorePath = path.join(workspace, '.gitignore');

    await fs.writeFile(
      gitignorePath,
      '# metacoding: AI coding assistant exclusions\n.codex/skills/metacoding-workflow/\n',
      'utf8'
    );
    await manager.updateGitIgnore(workspace);
    await manager.updateGitIgnore(workspace);

    const gitignore = await fs.readFile(gitignorePath, 'utf8');

    expect(gitignore.match(/# metacoding:/g)).toHaveLength(1);
    expect(gitignore.match(/^\.codex\/skills\/metacoding-workflow\/$/gm)).toHaveLength(1);
    for (const agentDir of ['.codex', '.claude', '.agents']) {
      expect(
        gitignore.split('\n').filter((line) => line === `${agentDir}/skills/metacoding-*/`)
      ).toHaveLength(1);
    }
  });

  test('leaves a gitignore without a metacoding section alone when only filling gaps', async () => {
    const workspace = await createTempWorkspace('metacoding-gitignore-optout');
    const manager = new GitIgnoreManager();
    const gitignorePath = path.join(workspace, '.gitignore');

    await fs.writeFile(gitignorePath, 'node_modules/\n', 'utf8');
    await manager.addMissingPatterns(workspace);

    expect(await fs.readFile(gitignorePath, 'utf8')).toBe('node_modules/\n');
  });

  test('detects whether the metacoding section is present', async () => {
    const workspace = await createTempWorkspace('metacoding-gitignore-detect');
    const manager = new GitIgnoreManager();

    expect(await manager.hasMetacodingPatterns(workspace)).toBe(false);

    await manager.updateGitIgnore(workspace);
    expect(await manager.hasMetacodingPatterns(workspace)).toBe(true);
  });
});
