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
    expect(gitignore).toContain('.codex/skills/metacoding-workflow/');
    expect(GitIgnoreManager.createTemplateContent()).toContain('.backup/');
  });

  test('detects whether the metacoding section is present', async () => {
    const workspace = await createTempWorkspace('metacoding-gitignore-detect');
    const manager = new GitIgnoreManager();

    expect(await manager.hasMetacodingPatterns(workspace)).toBe(false);

    await manager.updateGitIgnore(workspace);
    expect(await manager.hasMetacodingPatterns(workspace)).toBe(true);
  });
});
