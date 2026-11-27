import * as fs from 'fs-extra';
import * as path from 'path';
import { METACODING_SKILLS } from '../../src/services/skill-manager';

const repoRoot = path.join(__dirname, '../..');

interface PluginManifest {
  name: string;
  version: string;
  description: string;
}

interface Marketplace {
  name: string;
  plugins: Array<{ name: string; source: unknown }>;
}

async function readJson<T>(relativePath: string): Promise<T> {
  const content = await fs.readFile(path.join(repoRoot, relativePath), 'utf8');
  return JSON.parse(content) as T;
}

describe('plugin install: Claude Code', () => {
  test('the repo root is a plugin named metacoding', async () => {
    const manifest = await readJson<PluginManifest>(
      '.claude-plugin/plugin.json'
    );

    expect(manifest.name).toBe('metacoding');
    expect(typeof manifest.description).toBe('string');
    expect(manifest.description).not.toBe('');
  });

  test('the plugin has the version of the npm package', async () => {
    const manifest = await readJson<PluginManifest>(
      '.claude-plugin/plugin.json'
    );
    const packageJson = await readJson<{ version: string }>('package.json');

    expect(manifest.version).toBe(packageJson.version);
  });

  test('the repo is a marketplace that offers the plugin from its root', async () => {
    const marketplace = await readJson<Marketplace>(
      '.claude-plugin/marketplace.json'
    );

    expect(marketplace.name).toBe('metacoding');
    expect(marketplace.plugins).toEqual([
      expect.objectContaining({ name: 'metacoding', source: './' }),
    ]);
  });
});

describe('plugin install: the skills it ships', () => {
  test('each skill is named after its folder', async () => {
    for (const folder of METACODING_SKILLS) {
      const skill = await fs.readFile(
        path.join(repoRoot, 'skills', folder, 'SKILL.md'),
        'utf8'
      );
      const frontmatterEnd = skill.indexOf('\n---', 3);
      const frontmatter = skill.slice(0, frontmatterEnd);

      expect(skill.startsWith('---\n')).toBe(true);
      expect(frontmatterEnd).toBeGreaterThan(0);
      expect(frontmatter.split('\n')).toContain(`name: ${folder}`);
    }
  });
});
