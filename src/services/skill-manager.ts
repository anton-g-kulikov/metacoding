import * as fs from 'fs-extra';
import * as path from 'path';
import { AgentVendor, ProjectConfig } from '../types';

/**
 * The orchestrator skill, and the entrypoint that marks a vendor install.
 */
export const WORKFLOW_SKILL = 'metacoding-workflow';
/**
 * Skills shipped in the package: the workflow skill, then its companions.
 */
export const METACODING_SKILLS = [
  WORKFLOW_SKILL,
  'metacoding-shape',
  'metacoding-tdd',
  'metacoding-review',
  'metacoding-debug',
] as const;

interface VendorInstallDefinition {
  vendor: AgentVendor;
  /** Directory that holds one folder per skill. */
  skillsDir: string;
  /** Files, relative to the workflow skill, that mark a vendor install. */
  entryFiles: string[];
}

/**
 * Service for packaging and installing vendor-specific metacoding skills.
 */
export class SkillManager {
  private readonly sourceSkillsDir = path.join(__dirname, '../../skills');
  /**
   * Paths written by the 2.0.x Claude Code install, which shipped a subagent
   * plus a support bundle instead of a skill.
   */
  private readonly legacyClaudePaths = [
    path.join('.claude', 'agents', 'metacoding-workflow.md'),
    path.join('.claude', 'metacoding-workflow'),
  ];
  /**
   * Skill folders that an earlier version installed and this one no longer
   * ships.
   */
  private readonly retiredSkills = ['metacoding-interview'];
  /**
   * Files, relative to a vendor's skills directory, that an earlier version
   * installed and this one no longer ships. Listed one by one so that a file
   * the user added next to them is never removed.
   */
  private readonly retiredFiles = [
    path.join('metacoding-interview', 'SKILL.md'),
    path.join('metacoding-interview', 'agents', 'openai.yaml'),
    path.join(WORKFLOW_SKILL, 'references', 'interview.md'),
    path.join(WORKFLOW_SKILL, 'assets', 'templates', 'test-plan.md'),
  ];
  private readonly vendorDefinitions: Record<AgentVendor, VendorInstallDefinition> = {
    codex: {
      vendor: 'codex',
      skillsDir: path.join('.codex', 'skills'),
      entryFiles: ['SKILL.md', path.join('agents', 'openai.yaml')],
    },
    'claude-code': {
      vendor: 'claude-code',
      skillsDir: path.join('.claude', 'skills'),
      entryFiles: ['SKILL.md'],
    },
    antigravity: {
      vendor: 'antigravity',
      skillsDir: path.join('.agents', 'skills'),
      entryFiles: ['SKILL.md'],
    },
  };

  async isInstalled(vendor?: AgentVendor): Promise<boolean> {
    const vendors = vendor ? [vendor] : await this.getInstalledVendors();
    return vendors.length > 0;
  }

  async getInstalledVendors(): Promise<AgentVendor[]> {
    const installed: AgentVendor[] = [];

    for (const vendor of Object.keys(this.vendorDefinitions) as AgentVendor[]) {
      if (
        (await this.hasVendorInstall(vendor)) ||
        (vendor === 'claude-code' && (await this.hasLegacyClaudeInstall()))
      ) {
        installed.push(vendor);
      }
    }

    return installed;
  }

  /**
   * True when the 2.0.x Claude Code subagent layout is still on disk.
   */
  async hasLegacyClaudeInstall(): Promise<boolean> {
    for (const legacyPath of this.legacyClaudePaths) {
      if (await fs.pathExists(legacyPath)) {
        return true;
      }
    }

    return false;
  }

  /**
   * True when Claude Code has the legacy layout but not the skill layout.
   */
  async needsClaudeMigration(): Promise<boolean> {
    return (
      (await this.hasLegacyClaudeInstall()) &&
      !(await this.hasVendorInstall('claude-code'))
    );
  }

  /**
   * Remove the legacy Claude Code subagent and its support bundle.
   * Returns the paths that were removed.
   */
  async removeLegacyClaudeInstall(): Promise<string[]> {
    const removed: string[] = [];

    for (const legacyPath of this.legacyClaudePaths) {
      if (await fs.pathExists(legacyPath)) {
        await fs.remove(legacyPath);
        removed.push(legacyPath);
      }
    }

    return removed;
  }

  /**
   * Install directory of the workflow skill, which holds the project context.
   */
  getInstallDirectory(vendor: AgentVendor): string {
    return path.join(this.vendorDefinitions[vendor].skillsDir, WORKFLOW_SKILL);
  }

  /**
   * Install directories of every packaged skill, workflow skill first.
   */
  getSkillDirectories(vendor: AgentVendor): string[] {
    return METACODING_SKILLS.map((skill) =>
      path.join(this.vendorDefinitions[vendor].skillsDir, skill)
    );
  }

  getBackupTargets(vendor: AgentVendor): string[] {
    const targets = [
      ...this.getSkillDirectories(vendor),
      ...this.getRetiredSkillDirectories(vendor),
    ];

    if (vendor === 'claude-code') {
      return [...targets, ...this.legacyClaudePaths];
    }

    return targets;
  }

  /**
   * Files on disk that an earlier version installed and this one no longer
   * ships.
   */
  async findRetiredFiles(vendor: AgentVendor): Promise<string[]> {
    const found: string[] = [];

    for (const retiredFile of this.retiredFiles) {
      const fullPath = path.join(this.vendorDefinitions[vendor].skillsDir, retiredFile);
      if (await fs.pathExists(fullPath)) {
        found.push(fullPath);
      }
    }

    return found;
  }

  /**
   * Remove the retired files, and a retired skill folder they leave empty.
   * Returns the files that were removed.
   */
  async removeRetiredFiles(vendor: AgentVendor): Promise<string[]> {
    const removed = await this.findRetiredFiles(vendor);

    for (const retiredFile of removed) {
      await fs.remove(retiredFile);
    }
    for (const directory of this.getRetiredSkillDirectories(vendor)) {
      await this.removeEmptyDirectories(directory);
    }

    return removed;
  }

  private getRetiredSkillDirectories(vendor: AgentVendor): string[] {
    return this.retiredSkills.map((skill) =>
      path.join(this.vendorDefinitions[vendor].skillsDir, skill)
    );
  }

  private async removeEmptyDirectories(root: string): Promise<void> {
    if (!(await fs.pathExists(root))) {
      return;
    }

    for (const entry of await fs.readdir(root, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        await this.removeEmptyDirectories(path.join(root, entry.name));
      }
    }

    if ((await fs.readdir(root)).length === 0) {
      await fs.rmdir(root);
    }
  }

  async installSkill(config: ProjectConfig): Promise<string[]> {
    const files = await this.generateInstallationFiles(config);

    for (const file of files) {
      await fs.ensureDir(path.dirname(file.path));
      await fs.writeFile(file.path, file.content, 'utf8');
    }

    return files.map((file) => file.path);
  }

  async generateInstallationFiles(
    config: ProjectConfig
  ): Promise<Array<{ path: string; content: string }>> {
    const skillsDir = this.vendorDefinitions[config.vendor].skillsDir;
    const files: Array<{ path: string; content: string }> = [];

    for (const skill of METACODING_SKILLS) {
      files.push(
        ...(await this.readSkillFiles(
          skill,
          path.join(skillsDir, skill),
          config.vendor
        ))
      );
    }

    files.push({
      path: path.join(
        this.getInstallDirectory(config.vendor),
        'references/project-context.md'
      ),
      content: await this.renderProjectContext(config),
    });

    return files;
  }

  async getInstalledFiles(vendor: AgentVendor): Promise<string[]> {
    const files: string[] = [];

    for (const directory of this.getSkillDirectories(vendor)) {
      files.push(...(await this.listFilesRecursively(directory)));
    }

    return files;
  }

  private async hasVendorInstall(vendor: AgentVendor): Promise<boolean> {
    const definition = this.vendorDefinitions[vendor];
    const root = this.getInstallDirectory(vendor);

    for (const relativeEntry of definition.entryFiles) {
      const fullPath = path.join(root, relativeEntry);
      if (!(await fs.pathExists(fullPath))) {
        return false;
      }
    }

    return true;
  }

  private async readSkillFiles(
    skill: string,
    installRoot: string,
    vendor: AgentVendor
  ): Promise<Array<{ path: string; content: string }>> {
    const sourceDir = path.join(this.sourceSkillsDir, skill);
    const relativePaths = await this.listFilesRecursively(sourceDir);
    const files: Array<{ path: string; content: string }> = [];

    for (const absolutePath of relativePaths) {
      const relativePath = path.relative(sourceDir, absolutePath);

      // Codex needs its UI metadata; other vendors do not.
      if (vendor !== 'codex' && relativePath.startsWith('agents/')) {
        continue;
      }

      const content = await fs.readFile(absolutePath, 'utf8');
      files.push({
        path: path.join(installRoot, relativePath),
        content,
      });
    }

    return files;
  }

  private async listFilesRecursively(root: string): Promise<string[]> {
    if (!(await fs.pathExists(root))) {
      return [];
    }

    const entries = await fs.readdir(root, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(root, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.listFilesRecursively(fullPath)));
      } else if (entry.name !== '.DS_Store') {
        files.push(fullPath);
      }
    }

    return files.sort();
  }

  private async renderProjectContext(config: ProjectConfig): Promise<string> {
    const templatePath = path.join(
      this.sourceSkillsDir,
      WORKFLOW_SKILL,
      'assets/templates/project-context.md'
    );
    const template = await fs.readFile(templatePath, 'utf8');
    const recommendedReferences = this.getRecommendedReferences(config);

    const variables = {
      PROJECT_NAME: config.name,
      PROJECT_DESCRIPTION: config.description,
      PROJECT_TYPE: config.projectType,
      TECH_STACK: config.techStack.join(', '),
      TEST_FRAMEWORK: config.testFramework || 'Use the repo default',
      BUILD_TOOL: config.buildTool || 'Use the repo default',
      RECOMMENDED_REFERENCES: recommendedReferences.join('\n'),
      AGENT_VENDOR: config.vendor,
    };

    return Object.entries(variables).reduce((content, [key, value]) => {
      return content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, template);
  }

  private getRecommendedReferences(config: ProjectConfig): string[] {
    const references = [
      '- `references/workflow-rules.md` for the gated task flow',
      '- `references/repository-organization.md` for repository structure and MECE documentation ownership',
      '- `references/platform-adaptation.md` for fallback behavior when repo artifacts or git are missing',
    ];

    if (config.projectType === 'typescript') {
      references.push(
        '- `references/typescript.md` for shared TypeScript coding, testing, and documentation guidance'
      );
    } else if (config.projectType === 'react') {
      references.push(
        '- `references/typescript.md` for shared TypeScript guidance',
        '- `references/react.md` for component, testing, and UI workflow guidance'
      );
    } else if (config.projectType === 'node') {
      references.push(
        '- `references/typescript.md` for shared TypeScript guidance',
        '- `references/node.md` for service, API, and backend workflow guidance'
      );
    } else if (config.projectType === 'javascript') {
      references.push(
        '- `references/javascript.md` for JavaScript coding, testing, and documentation guidance'
      );
    } else if (config.projectType === 'python') {
      references.push(
        '- `references/python.md` for Python coding, testing, and documentation guidance'
      );
    }

    return references;
  }
}
