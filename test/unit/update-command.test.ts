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
          '.claude/skills/metacoding-shape/SKILL.md'
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
    ).toContain('.claude/skills/metacoding-*/');

    await expect(
      update.execute({ dryRun: true, strict: true })
    ).resolves.toBeUndefined();
  });

  const vendorSkillsDirs = [
    ['codex', '.codex/skills'],
    ['claude-code', '.claude/skills'],
    ['antigravity', '.agents/skills'],
  ] as const;
  const companionSkills = [
    'metacoding-shape',
    'metacoding-tdd',
    'metacoding-review',
    'metacoding-debug',
  ];

  test.each(vendorSkillsDirs)(
    'adds companion skills to a %s install that only has the workflow skill',
    async (vendor, skillsDir) => {
      const workspace = await createTempWorkspace(`metacoding-update-companions-${vendor}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', vendor, force: true });

      const companions = companionSkills.map((skill) =>
        path.join(workspace, skillsDir, skill)
      );
      for (const companion of companions) {
        await fs.remove(companion);
      }

      const update = new UpdateCommand();
      await expect(update.execute({ dryRun: true })).rejects.toThrow(
        `4 required ${vendor} skill files are missing`
      );

      await update.execute({});

      for (const companion of companions) {
        expect(await fs.readFile(path.join(companion, 'SKILL.md'), 'utf8')).toContain(
          `name: ${path.basename(companion)}\n`
        );
      }
      await expect(update.execute({ dryRun: true })).resolves.toBeUndefined();
    }
  );

  test.each(companionSkills)(
    'dry-run fails when only %s is missing',
    async (skill) => {
      const workspace = await createTempWorkspace(`metacoding-validate-${skill}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', force: true });
      await fs.remove(path.join(workspace, '.codex/skills', skill, 'SKILL.md'));

      const update = new UpdateCommand();
      await expect(update.execute({ dryRun: true })).rejects.toThrow(
        '1 required codex skill files are missing'
      );
    }
  );

  test('force update upgrades an older install with changed workflow files', async () => {
    const workspace = await createTempWorkspace('metacoding-update-older');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const skillsDir = path.join(workspace, '.codex/skills');
    const rulesFile = path.join(
      skillsDir,
      'metacoding-workflow/references/workflow-rules.md'
    );
    await fs.writeFile(rulesFile, 'rules from an older release', 'utf8');
    for (const skill of companionSkills) {
      await fs.remove(path.join(skillsDir, skill));
    }

    const update = new UpdateCommand();
    await update.execute({ force: true });

    expect(await fs.readFile(rulesFile, 'utf8')).toContain('`metacoding-review` skill');
    for (const skill of companionSkills) {
      expect(await fs.pathExists(path.join(skillsDir, skill, 'SKILL.md'))).toBe(true);
    }
    await expect(update.execute({ dryRun: true })).resolves.toBeUndefined();
  });

  test('backs up every installed skill before syncing', async () => {
    const workspace = await createTempWorkspace('metacoding-update-backup');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const update = new UpdateCommand();
    await update.execute({});

    const [backupName] = await fs.readdir(path.join(workspace, '.backup'));
    for (const skill of ['metacoding-workflow', ...companionSkills]) {
      expect(
        await fs.readFile(
          path.join(
            workspace,
            '.backup',
            backupName as string,
            '.codex/skills',
            skill,
            'SKILL.md'
          ),
          'utf8'
        )
      ).toContain(`name: ${skill}\n`);
    }
  });

  test('fills in gitignore patterns that an older install section lacks', async () => {
    const workspace = await createTempWorkspace('metacoding-update-gitignore');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const gitignorePath = path.join(workspace, '.gitignore');
    await fs.writeFile(
      gitignorePath,
      '# metacoding: AI coding assistant exclusions\n.codex/skills/metacoding-workflow/\n.backup/\n',
      'utf8'
    );

    const update = new UpdateCommand();
    await update.execute({});
    await update.execute({});

    const gitignore = await fs.readFile(gitignorePath, 'utf8');
    for (const agentDir of ['.codex', '.claude', '.agents']) {
      expect(
        gitignore.split('\n').filter((line) => line === `${agentDir}/skills/metacoding-*/`)
      ).toHaveLength(1);
    }
  });

  test('leaves a gitignore without a metacoding section alone', async () => {
    const workspace = await createTempWorkspace('metacoding-update-gitignore-optout');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const gitignorePath = path.join(workspace, '.gitignore');
    await fs.writeFile(gitignorePath, 'node_modules/\n', 'utf8');

    const update = new UpdateCommand();
    await update.execute({});

    expect(await fs.readFile(gitignorePath, 'utf8')).toBe('node_modules/\n');
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
