import * as fs from 'fs-extra';
import * as path from 'path';
import { SkillManager } from '../../src/services/skill-manager';
import { FileSystemService } from '../../src/services/filesystem';
import { createTempWorkspace } from './test-utils';

describe('SkillManager', () => {
  const originalCwd = process.cwd();

  afterEach(() => {
    process.chdir(originalCwd);
  });

  test('generates and installs the packaged skill with project context', async () => {
    const workspace = await createTempWorkspace('metacoding-skill');
    process.chdir(workspace);

    const manager = new SkillManager();
    const files = await manager.generateInstallationFiles({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['React', 'TypeScript', 'Vite'],
      projectType: 'react',
      testFramework: 'Jest + React Testing Library',
      buildTool: 'Vite',
      vendor: 'codex',
    });

    expect(
      files.some((file) => file.path.endsWith('.codex/skills/metacoding-workflow/SKILL.md'))
    ).toBe(true);
    expect(
      files.find((file) => file.path.endsWith('references/project-context.md'))?.content
    ).toContain('references/react.md');
    expect(
      files.find((file) => file.path.endsWith('references/project-context.md'))?.content
    ).toContain('references/repository-organization.md');

    await manager.installSkill({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['React', 'TypeScript', 'Vite'],
      projectType: 'react',
      testFramework: 'Jest + React Testing Library',
      buildTool: 'Vite',
      vendor: 'codex',
    });

    const installedContext = await fs.readFile(
      path.join(
        workspace,
        '.codex/skills/metacoding-workflow/references/project-context.md'
      ),
      'utf8'
    );
    const fileSystem = new FileSystemService();

    expect(installedContext).toContain('Project type: react');
    expect(installedContext).toContain('## Required References');
    expect(await fileSystem.isMetaCodingSetup()).toBe(true);
  });

  test('generates Claude Code and Antigravity variants', async () => {
    const workspace = await createTempWorkspace('metacoding-vendors');
    process.chdir(workspace);

    const manager = new SkillManager();

    const claudeFiles = await manager.generateInstallationFiles({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['TypeScript'],
      projectType: 'typescript',
      testFramework: 'Use the repository default',
      buildTool: 'Use the repository default',
      vendor: 'claude-code',
    });
    const antigravityFiles = await manager.generateInstallationFiles({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['TypeScript'],
      projectType: 'typescript',
      testFramework: 'Use the repository default',
      buildTool: 'Use the repository default',
      vendor: 'antigravity',
    });

    expect(
      claudeFiles.some(
        (file) => file.path === '.claude/agents/metacoding-workflow.md'
      )
    ).toBe(true);
    expect(
      claudeFiles.find(
        (file) => file.path === '.claude/agents/metacoding-workflow.md'
      )?.content
    ).toContain('references/repository-organization.md');
    expect(
      antigravityFiles.some(
        (file) => file.path.endsWith('.agents/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
    expect(
      claudeFiles.some((file) => file.path.includes('agents/openai.yaml'))
    ).toBe(false);
  });
});
