import * as fs from 'fs-extra';
import { ProjectDetector } from '../../src/services/project-detector';
import { createTempWorkspace } from './test-utils';

describe('ProjectDetector', () => {
  const originalCwd = process.cwd();

  afterEach(() => {
    process.chdir(originalCwd);
  });

  test('detects react projects from package.json', async () => {
    const workspace = await createTempWorkspace('metacoding-react');
    process.chdir(workspace);

    await fs.writeJson('package.json', {
      dependencies: { react: '^18.0.0' },
      devDependencies: { typescript: '^5.0.0', jest: '^29.0.0', vite: '^5.0.0' },
    });

    const detector = new ProjectDetector();
    const project = await detector.detectProject();

    expect(project.type).toBe('react');
    expect(project.techStack).toEqual(
      expect.arrayContaining(['React', 'TypeScript', 'Jest', 'Vite'])
    );
  });

  test('detects python projects from standard markers', async () => {
    const workspace = await createTempWorkspace('metacoding-python');
    process.chdir(workspace);

    await fs.writeFile('pyproject.toml', '[project]\nname = "demo"\n', 'utf8');

    const detector = new ProjectDetector();
    const project = await detector.detectProject();

    expect(project.type).toBe('python');
    expect(project.techStack).toContain('Python');
  });

  test('falls back to general projects when no markers exist', async () => {
    const workspace = await createTempWorkspace('metacoding-general');
    process.chdir(workspace);

    const detector = new ProjectDetector();
    const project = await detector.detectProject();

    expect(project.type).toBe('general');
    expect(project.techStack).toContain('TypeScript');
  });
});
