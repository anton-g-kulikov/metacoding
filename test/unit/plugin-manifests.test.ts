import * as fs from 'fs-extra';
import * as path from 'path';
import { METACODING_SKILLS } from '../../src/services/skill-manager';

const repoRoot = path.join(__dirname, '../..');
const pluginName = 'metacoding';

/** The plugin manifest each agent reads, by agent. */
const manifestPaths = {
  'Claude Code': '.claude-plugin/plugin.json',
  Codex: 'plugin.json',
  Antigravity: '.antigravity-plugin/plugin.json',
};

interface PluginManifest {
  $schema?: string;
  name: string;
  version: string;
  description: string;
}

interface Marketplace {
  name: string;
  plugins: unknown[];
}

async function readJson<T>(relativePath: string): Promise<T> {
  const content = await fs.readFile(path.join(repoRoot, relativePath), 'utf8');
  return JSON.parse(content) as T;
}

describe('plugin install: the manifests', () => {
  test.each(Object.entries(manifestPaths))(
    'the repo root is a plugin named metacoding for %s',
    async (_agent, manifestPath) => {
      const manifest = await readJson<PluginManifest>(manifestPath);

      expect(manifest.name).toBe(pluginName);
      expect(manifest.description).toMatch(/\S/);
    }
  );

  test.each(Object.entries(manifestPaths))(
    'the plugin for %s has the version of the npm package',
    async (_agent, manifestPath) => {
      const manifest = await readJson<PluginManifest>(manifestPath);
      const packageJson = await readJson<{ version: string }>('package.json');

      expect(manifest.version).toBe(packageJson.version);
    }
  );

  test('every agent gets the same plugin details', async () => {
    const withoutSchema = async (manifestPath: string) => {
      const manifest = await readJson<PluginManifest>(manifestPath);
      delete manifest.$schema;
      return manifest;
    };
    const claudeCode = await withoutSchema(manifestPaths['Claude Code']);

    for (const manifestPath of Object.values(manifestPaths)) {
      expect(await withoutSchema(manifestPath)).toEqual(claudeCode);
    }
  });

  test('the Codex manifest names the schema that makes Codex read a root plugin.json', async () => {
    const manifest = await readJson<PluginManifest>(manifestPaths.Codex);

    expect(manifest.$schema).toBe(
      'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
    );
  });
});

describe('plugin install: the marketplaces', () => {
  test('the repo is a Claude Code marketplace that offers the plugin from its root', async () => {
    const marketplace = await readJson<Marketplace>(
      '.claude-plugin/marketplace.json'
    );

    expect(marketplace.name).toBe(pluginName);
    expect(marketplace.plugins).toEqual([
      expect.objectContaining({ name: pluginName, source: './' }),
    ]);
  });

  test('the repo is a Codex marketplace that offers the plugin from its git address', async () => {
    const marketplace = await readJson<Marketplace>(
      '.agents/plugins/marketplace.json'
    );

    expect(marketplace.name).toBe(pluginName);
    expect(marketplace.plugins).toEqual([
      {
        name: pluginName,
        source: {
          source: 'url',
          url: 'https://github.com/anton-g-kulikov/metacoding.git',
        },
        policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
        category: 'Productivity',
      },
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
