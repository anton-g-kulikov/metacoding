import * as fs from 'fs-extra';
import * as path from 'path';
import { METACODING_SKILLS, SkillManager } from '../../src/services/skill-manager';
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
      claudeFiles.find(
        (file) => file.path === '.claude/skills/metacoding-workflow/SKILL.md'
      )?.content
    ).toContain('references/repository-organization.md');
    expect(
      claudeFiles.every((file) =>
        file.path.startsWith('.claude/skills/metacoding-')
      )
    ).toBe(true);
    expect(
      antigravityFiles.some(
        (file) => file.path.endsWith('.agents/skills/metacoding-workflow/SKILL.md')
      )
    ).toBe(true);
    expect(
      claudeFiles.some((file) => file.path.includes('agents/openai.yaml'))
    ).toBe(false);
  });

  test('the skill list matches the packaged skill directories', async () => {
    const skillsDir = path.join(__dirname, '../../skills');
    const packaged = (await fs.readdir(skillsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect([...METACODING_SKILLS].sort()).toEqual(packaged);
    expect(METACODING_SKILLS[0]).toBe('metacoding-workflow');
  });

  test('INSTALL-1: metacoding-spec is installed with the other skills for every agent', async () => {
    const skillsDirs = {
      codex: '.codex/skills',
      'claude-code': '.claude/skills',
      antigravity: '.agents/skills',
    } as const;

    for (const vendor of Object.keys(skillsDirs) as Array<keyof typeof skillsDirs>) {
      const files = await new SkillManager().generateInstallationFiles({
        name: 'demo-app',
        description: 'Demo application',
        techStack: ['TypeScript'],
        projectType: 'typescript',
        vendor,
      });
      const installed = (skill: string, file: string) =>
        files.find(
          (candidate) => candidate.path === `${skillsDirs[vendor]}/${skill}/${file}`
        );

      expect(installed('metacoding-spec', 'SKILL.md')?.content).toContain(
        'name: metacoding-spec\n'
      );
      expect(installed('metacoding-spec', 'agents/openai.yaml') !== undefined).toBe(
        vendor === 'codex'
      );
      for (const skill of METACODING_SKILLS) {
        expect(installed(skill, 'SKILL.md')).toBeDefined();
      }
    }
  });

  test('installs the orchestrator and its companion skills for every vendor', async () => {
    const workspace = await createTempWorkspace('metacoding-multi-skill');
    process.chdir(workspace);

    const manager = new SkillManager();
    const baseConfig = {
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['TypeScript'],
      projectType: 'typescript',
      testFramework: 'Use the repository default',
      buildTool: 'Use the repository default',
    };
    const skillsDirs = {
      codex: '.codex/skills',
      'claude-code': '.claude/skills',
      antigravity: '.agents/skills',
    } as const;

    for (const vendor of Object.keys(skillsDirs) as Array<keyof typeof skillsDirs>) {
      const skillsDir = skillsDirs[vendor];
      const files = await manager.generateInstallationFiles({
        ...baseConfig,
        vendor,
      });
      const contentOf = (filePath: string) =>
        files.find((file) => file.path === filePath)?.content;

      for (const skill of METACODING_SKILLS) {
        expect(contentOf(`${skillsDir}/${skill}/SKILL.md`)).toContain(
          `name: ${skill}\n`
        );
        expect(
          files.some(
            (file) => file.path === `${skillsDir}/${skill}/agents/openai.yaml`
          )
        ).toBe(vendor === 'codex');
      }

      const orchestrator = contentOf(`${skillsDir}/metacoding-workflow/SKILL.md`);
      for (const companion of METACODING_SKILLS.slice(1)) {
        expect(orchestrator).toContain(`\`${companion}\``);
      }

      const shape = contentOf(`${skillsDir}/metacoding-shape/SKILL.md`);
      expect(shape).toContain('Recommended:');
      expect(shape).toContain('Decisions summary');
      expect(contentOf(`${skillsDir}/metacoding-spec/SKILL.md`)).toContain(
        'Scope summary'
      );

      expect(
        contentOf(`${skillsDir}/metacoding-workflow/references/project-context.md`)
      ).toContain('Project type: typescript');
      expect(
        files.filter((file) => file.path.endsWith('project-context.md') &&
          file.path.includes('/references/'))
      ).toHaveLength(1);
    }
  });

  test('skips .DS_Store files in the packaged skills', async () => {
    const workspace = await createTempWorkspace('metacoding-skill-dsstore');
    process.chdir(workspace);

    const packagedSkills = path.join(workspace, 'packaged-skills');
    await fs.copy(path.join(__dirname, '../../skills'), packagedSkills);
    await fs.writeFile(path.join(packagedSkills, '.DS_Store'), 'finder data');
    await fs.writeFile(
      path.join(packagedSkills, 'metacoding-tdd/.DS_Store'),
      'finder data'
    );
    await fs.writeFile(
      path.join(packagedSkills, 'metacoding-workflow/references/.DS_Store'),
      'finder data'
    );

    const manager = new SkillManager();
    Object.defineProperty(manager, 'sourceSkillsDir', { value: packagedSkills });

    const installed = await manager.installSkill({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['TypeScript'],
      projectType: 'typescript',
      vendor: 'codex',
    });

    expect(installed).toContain(
      path.join('.codex', 'skills', 'metacoding-tdd', 'SKILL.md')
    );
    expect(installed.filter((file) => file.endsWith('.DS_Store'))).toEqual([]);
    expect(
      await fs.pathExists(
        path.join(workspace, '.codex/skills/metacoding-tdd/.DS_Store')
      )
    ).toBe(false);
  });

  test('places the review step between verification and artifact updates', async () => {
    const skillsRoot = path.join(__dirname, '../../skills');
    const workflowSkill = await fs.readFile(
      path.join(skillsRoot, 'metacoding-workflow/SKILL.md'),
      'utf8'
    );
    const workflowRules = await fs.readFile(
      path.join(skillsRoot, 'metacoding-workflow/references/workflow-rules.md'),
      'utf8'
    );
    const expectInOrder = (content: string, markers: string[]) => {
      const positions = markers.map((marker) => content.indexOf(marker));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    };

    expectInOrder(workflowSkill, [
      '4. Verify.',
      '5. Review, with `metacoding-review`.',
      '6. Update artifacts.',
    ]);
    expectInOrder(workflowRules, [
      '4. Verify.',
      '5. Review.',
      '6. Update artifacts',
    ]);
    for (const companion of METACODING_SKILLS.slice(1)) {
      expect(workflowRules).toContain(`\`${companion}\` skill`);
    }
  });

  test('companion skills do not point at files that only the workflow skill ships', async () => {
    for (const companion of METACODING_SKILLS.slice(1)) {
      const content = await fs.readFile(
        path.join(__dirname, '../../skills', companion, 'SKILL.md'),
        'utf8'
      );

      expect(content).not.toMatch(/references\/|assets\//);
    }
  });

  test('lists backup targets and installed files across all skills', async () => {
    const workspace = await createTempWorkspace('metacoding-multi-skill-installed');
    process.chdir(workspace);

    const manager = new SkillManager();
    await manager.installSkill({
      name: 'demo-app',
      description: 'Demo application',
      techStack: ['TypeScript'],
      projectType: 'typescript',
      vendor: 'antigravity',
    });

    expect(manager.getBackupTargets('antigravity')).toEqual([
      ...METACODING_SKILLS.map((skill) => path.join('.agents', 'skills', skill)),
      path.join('.agents', 'skills', 'metacoding-interview'),
    ]);

    const installed = await manager.getInstalledFiles('antigravity');
    for (const skill of METACODING_SKILLS) {
      expect(installed).toContain(path.join('.agents', 'skills', skill, 'SKILL.md'));
    }
  });

  test('reads the init answers back from an installed project context', async () => {
    const workspace = await createTempWorkspace('metacoding-skill-context');
    process.chdir(workspace);
    const manager = new SkillManager();
    const contextFile = path.join(
      workspace,
      '.agents/skills/metacoding-workflow/references/project-context.md'
    );
    const nothing = {
      name: undefined,
      description: undefined,
      projectType: undefined,
      techStack: undefined,
    };

    expect(await manager.readInstalledProjectContext('antigravity')).toEqual(nothing);

    await fs.outputFile(
      contextFile,
      [
        '# Project Context',
        '',
        '- Project name: shop',
        '- Description: Online shop: backend, API',
        '- Project type: python',
        '- Tech stack: Go, Postgres',
        '',
      ].join('\r\n'),
      'utf8'
    );
    expect(await manager.readInstalledProjectContext('antigravity')).toEqual({
      name: 'shop',
      description: 'Online shop: backend, API',
      projectType: 'python',
      techStack: ['Go', 'Postgres'],
    });

    await fs.writeFile(contextFile, '- Project name: shop\n- Tech stack: \n', 'utf8');
    expect(await manager.readInstalledProjectContext('antigravity')).toEqual({
      ...nothing,
      name: 'shop',
      techStack: [],
    });
  });
});
