import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { InitCommand } from '../../src/commands/init';
import { createTempWorkspace } from './test-utils';

describe('InitCommand', () => {
  const originalCwd = process.cwd();
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
    process.chdir(originalCwd);
  });

  test('installs the workflow skill and updates gitignore', async () => {
    const workspace = await createTempWorkspace('metacoding-init');
    process.chdir(workspace);

    await fs.writeJson('package.json', {
      name: 'demo-app',
      dependencies: { react: '^18.0.0' },
      devDependencies: { typescript: '^5.0.0', jest: '^29.0.0' },
    });

    const command = new InitCommand();
    await command.execute({ template: 'react', force: true });

    const gitignore = await fs.readFile(path.join(workspace, '.gitignore'), 'utf8');
    const projectContext = await fs.readFile(
      path.join(
        workspace,
        '.codex/skills/metacoding-workflow/references/project-context.md'
      ),
      'utf8'
    );

    expect(gitignore).toContain('.codex/skills/metacoding-workflow/');
    expect(projectContext).toContain('Project type: react');
    expect(projectContext).toContain('Agent vendor: codex');
    expect(projectContext).toContain('React, TypeScript');
    expect(projectContext).toContain('references/repository-organization.md');
  });

  test('cancels reinstall when the user declines', async () => {
    const workspace = await createTempWorkspace('metacoding-init-cancel');
    process.chdir(workspace);

    await fs.ensureDir('.codex/skills/metacoding-workflow/agents');
    await fs.writeFile('.codex/skills/metacoding-workflow/SKILL.md', 'existing', 'utf8');
    await fs.writeFile(
      '.codex/skills/metacoding-workflow/agents/openai.yaml',
      'interface: {}',
      'utf8'
    );

    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ vendor: 'codex' } as never)
      .mockResolvedValueOnce({ proceed: false } as never);

    const command = new InitCommand();
    await command.execute({ template: 'general' });

    expect(await fs.readFile('.codex/skills/metacoding-workflow/SKILL.md', 'utf8')).toBe(
      'existing'
    );
  });

  test('supports the interactive project configuration path', async () => {
    const workspace = await createTempWorkspace('metacoding-init-interactive');
    process.chdir(workspace);

    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ vendor: 'claude-code' } as never)
      .mockResolvedValueOnce({
        name: 'interactive-app',
        description: 'Interactive app',
        projectType: 'python',
        techStack: ['Python', 'Pytest'],
      } as never);

    const command = new InitCommand();
    await command.execute({ template: 'general' });

    const projectContext = await fs.readFile(
      path.join(workspace, '.claude/metacoding-workflow/references/project-context.md'),
      'utf8'
    );
    const agentEntry = await fs.readFile(
      path.join(workspace, '.claude/agents/metacoding-workflow.md'),
      'utf8'
    );

    expect(projectContext).toContain('Project name: interactive-app');
    expect(projectContext).toContain('Project type: python');
    expect(projectContext).toContain('Agent vendor: claude-code');
    expect(agentEntry).toContain('name: metacoding-workflow');
    expect(agentEntry).toContain('mandatory TDD');
  });

  test('installs the Antigravity variant when requested', async () => {
    const workspace = await createTempWorkspace('metacoding-init-antigravity');
    process.chdir(workspace);

    const command = new InitCommand();
    await command.execute({
      template: 'typescript',
      vendor: 'antigravity',
      force: true,
    });

    expect(
      await fs.pathExists(
        path.join(workspace, '.agents/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
  });

  test('installs all vendor variants when requested', async () => {
    const workspace = await createTempWorkspace('metacoding-init-all');
    process.chdir(workspace);

    const command = new InitCommand();
    await command.execute({
      template: 'typescript',
      vendor: 'all',
      force: true,
    });

    expect(
      await fs.pathExists(
        path.join(workspace, '.codex/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(workspace, '.claude/agents/metacoding-workflow.md')
      )
    ).toBe(true);
    expect(
      await fs.pathExists(
        path.join(workspace, '.agents/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
  });
});
