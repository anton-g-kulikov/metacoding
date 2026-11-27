import * as fs from 'fs-extra';
import * as path from 'path';
import { InitCommand } from '../../src/commands/init';
import { UpdateCommand } from '../../src/commands/update';
import { createTempWorkspace } from './test-utils';

describe('UpdateCommand', () => {
  const originalCwd = process.cwd();
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.chdir(originalCwd);
  });

  test('dry-run validation succeeds for an installed skill', async () => {
    const workspace = await createTempWorkspace('metacoding-validate');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const update = new UpdateCommand();
    await expect(
      update.execute({ dryRun: true, strict: true })
    ).resolves.toBeUndefined();
  });

  test('force update restores packaged content and creates a backup', async () => {
    const workspace = await createTempWorkspace('metacoding-update');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const skillFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/SKILL.md'
    );
    await fs.writeFile(skillFile, 'local edit', 'utf8');

    const update = new UpdateCommand();
    await update.execute({ force: true });

    const restored = await fs.readFile(skillFile, 'utf8');
    const backups = await fs.readdir(path.join(workspace, '.backup'));

    expect(restored).toContain('name: metacoding-workflow');
    expect(backups.length).toBeGreaterThan(0);
  });

  test('validates and updates a Claude Code install', async () => {
    const workspace = await createTempWorkspace('metacoding-update-claude');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({
      template: 'general',
      vendor: 'claude-code',
      force: true,
    });

    const agentPath = path.join(
      workspace,
      '.claude/skills/metacoding-workflow/SKILL.md'
    );
    await fs.writeFile(agentPath, 'local edit', 'utf8');

    const update = new UpdateCommand();
    await expect(
      update.execute({ dryRun: true, vendor: 'claude-code' })
    ).resolves.toBeUndefined();
    await update.execute({ force: true, vendor: 'claude-code' });

    expect(await fs.readFile(agentPath, 'utf8')).toContain(
      'name: metacoding-workflow'
    );
  });

  test('throws when update runs before install', async () => {
    const workspace = await createTempWorkspace('metacoding-update-missing');
    process.chdir(workspace);

    const update = new UpdateCommand();
    await expect(update.execute({})).rejects.toThrow(
      'No metacoding workflow skill installation found'
    );
  });

  test('updates all installed vendor variants when requested', async () => {
    const workspace = await createTempWorkspace('metacoding-update-all');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({
      template: 'general',
      vendor: 'all',
      force: true,
    });

    await fs.writeFile(
      path.join(workspace, '.codex/skills/metacoding-workflow/SKILL.md'),
      'codex edit',
      'utf8'
    );
    await fs.writeFile(
      path.join(workspace, '.claude/skills/metacoding-workflow/SKILL.md'),
      'claude edit',
      'utf8'
    );
    await fs.writeFile(
      path.join(workspace, '.agents/skills/metacoding-workflow/SKILL.md'),
      'antigravity edit',
      'utf8'
    );

    const update = new UpdateCommand();
    await expect(
      update.execute({ dryRun: true, vendor: 'all' })
    ).resolves.toBeUndefined();
    await update.execute({ force: true, vendor: 'all' });

    expect(
      await fs.readFile(
        path.join(workspace, '.codex/skills/metacoding-workflow/SKILL.md'),
        'utf8'
      )
    ).toContain('name: metacoding-workflow');
    expect(
      await fs.readFile(
        path.join(workspace, '.claude/skills/metacoding-workflow/SKILL.md'),
        'utf8'
      )
    ).toContain('name: metacoding-workflow');
    expect(
      await fs.readFile(
        path.join(workspace, '.agents/skills/metacoding-workflow/SKILL.md'),
        'utf8'
      )
    ).toContain('name: metacoding-workflow');
  });

  test('migrates a legacy Claude Code subagent install to the skill layout', async () => {
    const workspace = await createTempWorkspace('metacoding-update-legacy');
    process.chdir(workspace);

    const legacyAgent = path.join(
      workspace,
      '.claude/agents/metacoding-workflow.md'
    );
    const legacyBundle = path.join(workspace, '.claude/metacoding-workflow');
    const otherAgent = path.join(workspace, '.claude/agents/other-agent.md');
    await fs.outputFile(legacyAgent, 'legacy agent with local edit', 'utf8');
    await fs.outputFile(
      path.join(legacyBundle, 'references/workflow-rules.md'),
      'legacy rules',
      'utf8'
    );
    await fs.outputFile(otherAgent, 'unrelated agent', 'utf8');
    await fs.writeFile(
      path.join(workspace, '.gitignore'),
      '# metacoding: AI coding assistant exclusions\n.claude/agents/metacoding-workflow.md\n',
      'utf8'
    );

    const update = new UpdateCommand();
    await expect(update.execute({ dryRun: true })).rejects.toThrow(
      'legacy subagent layout'
    );

    await update.execute({});

    expect(
      await fs.readFile(
        path.join(workspace, '.claude/skills/metacoding-workflow/SKILL.md'),
        'utf8'
      )
    ).toContain('name: metacoding-workflow');
    expect(
      await fs.pathExists(
        path.join(
          workspace,
          '.claude/skills/metacoding-workflow/references/interview.md'
        )
      )
    ).toBe(true);
    expect(await fs.pathExists(legacyAgent)).toBe(false);
    expect(await fs.pathExists(legacyBundle)).toBe(false);
    expect(await fs.readFile(otherAgent, 'utf8')).toBe('unrelated agent');

    const [backupName] = await fs.readdir(path.join(workspace, '.backup'));
    expect(
      await fs.readFile(
        path.join(
          workspace,
          '.backup',
          backupName as string,
          '.claude/agents/metacoding-workflow.md'
        ),
        'utf8'
      )
    ).toBe('legacy agent with local edit');
    expect(
      await fs.readFile(path.join(workspace, '.gitignore'), 'utf8')
    ).toContain('.claude/skills/metacoding-workflow/');

    await expect(
      update.execute({ dryRun: true, strict: true })
    ).resolves.toBeUndefined();
  });

  test('keeps legacy Claude Code files when backups are disabled', async () => {
    const workspace = await createTempWorkspace('metacoding-update-legacy-nobackup');
    process.chdir(workspace);

    const legacyAgent = path.join(
      workspace,
      '.claude/agents/metacoding-workflow.md'
    );
    await fs.outputFile(legacyAgent, 'legacy agent', 'utf8');

    const update = new UpdateCommand();
    await update.execute({ backup: false });

    expect(
      await fs.pathExists(
        path.join(workspace, '.claude/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
    expect(await fs.readFile(legacyAgent, 'utf8')).toBe('legacy agent');
  });
});
