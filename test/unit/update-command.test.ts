import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { InitCommand } from '../../src/commands/init';
import { UpdateCommand } from '../../src/commands/update';
import { AgentVendor } from '../../src/types';
import { createTempWorkspace } from './test-utils';

describe('UpdateCommand', () => {
  const originalCwd = process.cwd();
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
      'No metacoding installation found'
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
    'metacoding-spec',
    'metacoding-tdd',
    'metacoding-review',
    'metacoding-debug',
    'metacoding-design',
    'metacoding-retro',
    'metacoding-onboard',
  ];

  test.each(vendorSkillsDirs)(
    'INSTALL-1: update adds metacoding-spec to a %s install that lacks it',
    async (vendor, skillsDir) => {
      const workspace = await createTempWorkspace(`metacoding-update-spec-${vendor}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', vendor, force: true });
      const specSkill = path.join(workspace, skillsDir, 'metacoding-spec');
      await fs.remove(specSkill);

      await new UpdateCommand().execute({});

      expect(await fs.readFile(path.join(specSkill, 'SKILL.md'), 'utf8')).toContain(
        'name: metacoding-spec\n'
      );
    }
  );

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
      // Codex also needs each companion's agents/openai.yaml.
      const missingFiles = companionSkills.length * (vendor === 'codex' ? 2 : 1);
      await expect(update.execute({ dryRun: true })).rejects.toThrow(
        `${missingFiles} required ${vendor} skill files are missing`
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

  test.each(companionSkills)(
    'dry-run fails when the Codex metadata of %s is missing',
    async (skill) => {
      const workspace = await createTempWorkspace(`metacoding-validate-yaml-missing-${skill}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', force: true });
      await fs.remove(path.join(workspace, '.codex/skills', skill, 'agents/openai.yaml'));

      const update = new UpdateCommand();
      await expect(update.execute({ dryRun: true })).rejects.toThrow(
        '1 required codex skill files are missing'
      );
    }
  );

  test.each(['metacoding-workflow', ...companionSkills])(
    'dry-run fails when the Codex metadata of %s lacks interface fields',
    async (skill) => {
      const workspace = await createTempWorkspace(`metacoding-validate-yaml-${skill}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', force: true });
      const yamlPath = path.join('.codex/skills', skill, 'agents/openai.yaml');
      await fs.writeFile(
        path.join(workspace, yamlPath),
        'interface:\n  display_name: "Only a name"\n',
        'utf8'
      );

      const update = new UpdateCommand();
      await expect(update.execute({ dryRun: true })).rejects.toThrow(
        `Validation failed: ${yamlPath} is missing required interface fields.`
      );
    }
  );

  test('strict dry-run names the gitignore exclusions that are missing', async () => {
    const workspace = await createTempWorkspace('metacoding-validate-strict');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });
    await fs.writeFile(
      path.join(workspace, '.gitignore'),
      '# metacoding: AI coding assistant exclusions\n.codex/skills/metacoding-*/\n',
      'utf8'
    );

    const update = new UpdateCommand();
    await expect(update.execute({ dryRun: true })).resolves.toBeUndefined();
    await expect(update.execute({ dryRun: true, strict: true })).rejects.toThrow(
      'Validation failed: .gitignore is missing metacoding exclusions: ' +
        '.claude/skills/metacoding-*/, .agents/skills/metacoding-*/, .backup/'
    );
  });

  test('strict dry-run says how to fix a gitignore without a metacoding section', async () => {
    const workspace = await createTempWorkspace('metacoding-validate-strict-nosection');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });
    const gitignorePath = path.join(workspace, '.gitignore');
    await fs.writeFile(gitignorePath, 'node_modules/\n', 'utf8');

    const update = new UpdateCommand();
    await update.execute({});

    expect(await fs.readFile(gitignorePath, 'utf8')).toBe('node_modules/\n');
    await expect(update.execute({ dryRun: true, strict: true })).rejects.toThrow(
      'Validation failed: .gitignore is missing metacoding exclusions: ' +
        '.codex/skills/metacoding-*/, .claude/skills/metacoding-*/, ' +
        '.agents/skills/metacoding-*/, .backup/. Add these lines to .gitignore.'
    );
  });

  test('strict dry-run fails when there is no gitignore', async () => {
    const workspace = await createTempWorkspace('metacoding-validate-strict-nofile');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });
    await fs.remove(path.join(workspace, '.gitignore'));

    const update = new UpdateCommand();
    await expect(update.execute({ dryRun: true, strict: true })).rejects.toThrow(
      'Validation failed: .gitignore is missing metacoding exclusions: .codex/skills/metacoding-*/'
    );
  });

  test.each(vendorSkillsDirs)(
    'removes files a %s install no longer ships, after backing them up',
    async (vendor, skillsDir) => {
      const workspace = await createTempWorkspace(`metacoding-update-retired-${vendor}`);
      process.chdir(workspace);

      const init = new InitCommand();
      await init.execute({ template: 'general', vendor, force: true });

      const retired = [
        'metacoding-interview/SKILL.md',
        'metacoding-interview/agents/openai.yaml',
        'metacoding-workflow/references/interview.md',
        'metacoding-workflow/assets/templates/test-plan.md',
        'metacoding-workflow/references/typescript.md',
        'metacoding-workflow/references/javascript.md',
        'metacoding-workflow/references/node.md',
        'metacoding-workflow/references/react.md',
        'metacoding-workflow/references/python.md',
      ];
      for (const file of retired) {
        await fs.outputFile(path.join(workspace, skillsDir, file), `retired ${file}`, 'utf8');
      }
      const userCopy = path.join(workspace, skillsDir, 'metacoding-workflow/user.SKILL.md');
      await fs.outputFile(userCopy, 'my own notes', 'utf8');

      const update = new UpdateCommand();
      await update.execute({});

      const [backupName] = await fs.readdir(path.join(workspace, '.backup'));
      for (const file of retired) {
        expect(await fs.pathExists(path.join(workspace, skillsDir, file))).toBe(false);
        expect(
          await fs.readFile(
            path.join(workspace, '.backup', backupName as string, skillsDir, file),
            'utf8'
          )
        ).toBe(`retired ${file}`);
      }
      expect(
        await fs.pathExists(path.join(workspace, skillsDir, 'metacoding-interview'))
      ).toBe(false);
      expect(await fs.readFile(userCopy, 'utf8')).toBe('my own notes');
    }
  );

  test('keeps files the user added to a skill folder it no longer ships', async () => {
    const workspace = await createTempWorkspace('metacoding-update-retired-userfile');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const retiredSkill = path.join(workspace, '.codex/skills/metacoding-interview');
    await fs.outputFile(path.join(retiredSkill, 'SKILL.md'), 'retired', 'utf8');
    await fs.outputFile(path.join(retiredSkill, 'agents/openai.yaml'), 'retired', 'utf8');
    await fs.outputFile(path.join(retiredSkill, 'user.SKILL.md'), 'my own notes', 'utf8');

    const update = new UpdateCommand();
    await update.execute({});

    expect(await fs.readdir(retiredSkill)).toEqual(['user.SKILL.md']);
    expect(await fs.readFile(path.join(retiredSkill, 'user.SKILL.md'), 'utf8')).toBe(
      'my own notes'
    );
  });

  test('dry-run names a Codex metadata file that is not valid YAML', async () => {
    const workspace = await createTempWorkspace('metacoding-validate-yaml-malformed');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });
    const yamlPath = path.join('.codex/skills/metacoding-review/agents/openai.yaml');
    await fs.writeFile(path.join(workspace, yamlPath), 'interface: [unclosed', 'utf8');

    const update = new UpdateCommand();
    await expect(update.execute({ dryRun: true })).rejects.toThrow(
      `Validation failed: ${yamlPath} is not valid YAML.`
    );
  });

  test('keeps files it no longer ships when backups are disabled', async () => {
    const workspace = await createTempWorkspace('metacoding-update-retired-nobackup');
    process.chdir(workspace);

    const init = new InitCommand();
    await init.execute({ template: 'general', force: true });

    const retiredFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/assets/templates/test-plan.md'
    );
    await fs.outputFile(retiredFile, 'retired', 'utf8');

    const update = new UpdateCommand();
    await update.execute({ backup: false });

    expect(await fs.readFile(retiredFile, 'utf8')).toBe('retired');
  });

  const projectTypes = ['general', 'typescript', 'react', 'node', 'javascript', 'python'];

  async function initWithAnswers(
    vendor: AgentVendor,
    projectType: string,
    answers: { name?: string; description?: string; techStack?: string[] } = {}
  ): Promise<jest.SpyInstance> {
    const promptSpy = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      name: 'shop',
      description: 'Online shop backend',
      projectType,
      techStack: ['Go', 'Postgres'],
      ...answers,
    } as never);

    await new InitCommand().execute({ template: 'general', vendor });

    return promptSpy;
  }

  test.each(vendorSkillsDirs)(
    'keeps the project answers of a %s install and reports no local edits',
    async (vendor, skillsDir) => {
      const workspace = await createTempWorkspace(`metacoding-update-answers-${vendor}`);
      process.chdir(workspace);

      const promptSpy = await initWithAnswers(vendor, 'python');
      const contextFile = path.join(
        workspace,
        skillsDir,
        'metacoding-workflow/references/project-context.md'
      );
      const installed = await fs.readFile(contextFile, 'utf8');

      await new UpdateCommand().execute({});

      expect(installed).toContain('- Project name: shop\n');
      expect(installed).toContain('- Description: Online shop backend\n');
      expect(installed).toContain('- Project type: python\n');
      expect(installed).toContain('- Tech stack: Go, Postgres\n');
      expect(await fs.readFile(contextFile, 'utf8')).toBe(installed);
      // The only prompt was init's; update found nothing to resolve.
      expect(promptSpy).toHaveBeenCalledTimes(1);
    }
  );

  test.each(projectTypes)(
    'reports no local edits for an untouched %s install',
    async (projectType) => {
      const workspace = await createTempWorkspace(`metacoding-update-untouched-${projectType}`);
      process.chdir(workspace);

      const promptSpy = await initWithAnswers('codex', projectType);
      const contextFile = path.join(
        workspace,
        '.codex/skills/metacoding-workflow/references/project-context.md'
      );
      const installed = await fs.readFile(contextFile, 'utf8');

      await new UpdateCommand().execute({});

      expect(await fs.readFile(contextFile, 'utf8')).toBe(installed);
      expect(promptSpy).toHaveBeenCalledTimes(1);
    }
  );

  test('--template overrides the installed project type and what follows from it', async () => {
    const workspace = await createTempWorkspace('metacoding-update-template');
    process.chdir(workspace);

    await initWithAnswers('codex', 'python');

    await new UpdateCommand().execute({ template: 'react', force: true });

    const context = await fs.readFile(
      path.join(workspace, '.codex/skills/metacoding-workflow/references/project-context.md'),
      'utf8'
    );
    expect(context).toContain('- Project name: shop\n');
    expect(context).toContain('- Description: Online shop backend\n');
    expect(context).toContain('- Tech stack: Go, Postgres\n');
    expect(context).toContain('- Project type: react\n');
    expect(context).toContain('- Default test framework: Jest + React Testing Library\n');
    expect(context).toContain('- Default build tool: Vite\n');
  });

  test('falls back to detection when the project context is missing', async () => {
    const workspace = await createTempWorkspace('metacoding-update-nocontext');
    process.chdir(workspace);

    await initWithAnswers('codex', 'python');
    const contextFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/references/project-context.md'
    );
    await fs.remove(contextFile);

    await new UpdateCommand().execute({});

    const context = await fs.readFile(contextFile, 'utf8');
    expect(context).toContain(`- Project name: ${path.basename(workspace)}\n`);
    expect(context).toContain('- Description: A project using the metacoding skills\n');
    expect(context).toContain('- Project type: general\n');
    expect(context).toContain('- Tech stack: TypeScript\n');
  });

  test('falls back to detection for a line the project context lacks', async () => {
    const workspace = await createTempWorkspace('metacoding-update-noline');
    process.chdir(workspace);

    await initWithAnswers('codex', 'python');
    const contextFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/references/project-context.md'
    );
    const installed = await fs.readFile(contextFile, 'utf8');
    await fs.writeFile(
      contextFile,
      installed.replace('- Description: Online shop backend\n', ''),
      'utf8'
    );

    await new UpdateCommand().execute({ force: true });

    const context = await fs.readFile(contextFile, 'utf8');
    expect(context).toContain('- Project name: shop\n');
    expect(context).toContain('- Description: A project using the metacoding skills\n');
    expect(context).toContain('- Project type: python\n');
    expect(context).toContain('- Tech stack: Go, Postgres\n');
  });

  test.each([
    ['surrounding spaces', { name: ' shop ', description: 'Online shop backend ' }],
    ['dollar patterns', { description: "Costs $& and $' and $1 more" }],
    ['an empty tech stack', { techStack: [] }],
  ])('keeps answers with %s exactly and reports no local edits', async (_label, answers) => {
    const workspace = await createTempWorkspace('metacoding-update-answers-exact');
    process.chdir(workspace);

    const promptSpy = await initWithAnswers('codex', 'general', answers);
    const contextFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/references/project-context.md'
    );
    const installed = await fs.readFile(contextFile, 'utf8');
    const expected = {
      name: 'shop',
      description: 'Online shop backend',
      techStack: ['Go', 'Postgres'],
      ...answers,
    };

    await new UpdateCommand().execute({});

    expect(installed).toContain(`- Project name: ${expected.name}\n`);
    expect(installed).toContain(`- Description: ${expected.description}\n`);
    expect(installed).toContain(`- Tech stack: ${expected.techStack.join(', ')}\n`);
    expect(await fs.readFile(contextFile, 'utf8')).toBe(installed);
    expect(promptSpy).toHaveBeenCalledTimes(1);
  });

  test('falls back to the detected project type when the line is missing', async () => {
    const workspace = await createTempWorkspace('metacoding-update-notype');
    process.chdir(workspace);
    await fs.writeJson('package.json', {
      name: 'demo-app',
      dependencies: { react: '^18.0.0' },
    });

    await initWithAnswers('codex', 'python');
    const contextFile = path.join(
      workspace,
      '.codex/skills/metacoding-workflow/references/project-context.md'
    );
    const installed = await fs.readFile(contextFile, 'utf8');
    await fs.writeFile(contextFile, installed.replace('- Project type: python\n', ''), 'utf8');

    await new UpdateCommand().execute({ force: true });

    const context = await fs.readFile(contextFile, 'utf8');
    expect(context).toContain('- Project name: shop\n');
    expect(context).toContain('- Project type: react\n');
  });

  test('keeps the project answers of a legacy Claude Code install when migrating it', async () => {
    const workspace = await createTempWorkspace('metacoding-update-legacy-answers');
    process.chdir(workspace);

    await fs.outputFile(
      path.join(workspace, '.claude/agents/metacoding-workflow.md'),
      'legacy agent',
      'utf8'
    );
    await fs.outputFile(
      path.join(workspace, '.claude/metacoding-workflow/references/project-context.md'),
      [
        '# Project Context',
        '',
        '- Project name: shop',
        '- Description: Online shop backend',
        '- Project type: python',
        '- Agent vendor: claude-code',
        '- Tech stack: Go, Postgres',
        '',
      ].join('\n'),
      'utf8'
    );

    await new UpdateCommand().execute({});

    const context = await fs.readFile(
      path.join(workspace, '.claude/skills/metacoding-workflow/references/project-context.md'),
      'utf8'
    );
    expect(context).toContain('- Project name: shop\n');
    expect(context).toContain('- Description: Online shop backend\n');
    expect(context).toContain('- Project type: python\n');
    expect(context).toContain('- Tech stack: Go, Postgres\n');
  });
});
