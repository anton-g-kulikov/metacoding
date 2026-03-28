import * as fs from 'fs-extra';
import * as path from 'path';
import { AgentVendor, ProjectConfig } from '../types';

interface VendorInstallDefinition {
  vendor: AgentVendor;
  root: string;
  entryFiles: string[];
}

/**
 * Service for packaging and installing vendor-specific metacoding skills.
 */
export class SkillManager {
  private readonly sourceSkillDir = path.join(
    __dirname,
    '../../skills/metacoding-workflow'
  );
  private readonly claudeAgentTemplatePath = path.join(
    __dirname,
    '../../skills/vendor-templates/claude-agent.md.template'
  );
  private readonly vendorDefinitions: Record<AgentVendor, VendorInstallDefinition> = {
    codex: {
      vendor: 'codex',
      root: path.join('.codex', 'skills', 'metacoding-workflow'),
      entryFiles: ['SKILL.md', path.join('agents', 'openai.yaml')],
    },
    'claude-code': {
      vendor: 'claude-code',
      root: path.join('.claude', 'metacoding-workflow'),
      entryFiles: [path.join('..', 'agents', 'metacoding-workflow.md')],
    },
    antigravity: {
      vendor: 'antigravity',
      root: path.join('.agents', 'skills', 'metacoding-workflow'),
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
      if (await this.hasVendorInstall(vendor)) {
        installed.push(vendor);
      }
    }

    return installed;
  }

  getInstallDirectory(vendor: AgentVendor): string {
    return this.vendorDefinitions[vendor].root;
  }

  getBackupTargets(vendor: AgentVendor): string[] {
    if (vendor === 'claude-code') {
      return [
        path.join('.claude', 'agents', 'metacoding-workflow.md'),
        this.vendorDefinitions[vendor].root,
      ];
    }

    return [this.vendorDefinitions[vendor].root];
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
    const root = this.getInstallDirectory(config.vendor);
    const supportFiles = await this.readCoreSupportFiles(root, config.vendor);
    const projectContext = await this.renderProjectContext(config);
    const files = [
      ...supportFiles,
      {
        path: path.join(root, 'references/project-context.md'),
        content: projectContext,
      },
    ];

    if (config.vendor === 'claude-code') {
      files.push({
        path: path.join('.claude', 'agents', 'metacoding-workflow.md'),
        content: await this.renderClaudeAgentFile(),
      });
    }

    return files;
  }

  async getInstalledFiles(vendor: AgentVendor): Promise<string[]> {
    const files = await this.listFilesRecursively(this.getInstallDirectory(vendor));

    if (vendor === 'claude-code') {
      const agentPath = path.join('.claude', 'agents', 'metacoding-workflow.md');
      if (await fs.pathExists(agentPath)) {
        files.push(agentPath);
      }
    }

    return files.sort();
  }

  private async hasVendorInstall(vendor: AgentVendor): Promise<boolean> {
    const definition = this.vendorDefinitions[vendor];

    for (const relativeEntry of definition.entryFiles) {
      const fullPath = path.join(definition.root, relativeEntry);
      if (!(await fs.pathExists(fullPath))) {
        return false;
      }
    }

    return true;
  }

  private async readCoreSupportFiles(
    installRoot: string,
    vendor: AgentVendor
  ): Promise<Array<{ path: string; content: string }>> {
    const relativePaths = await this.listFilesRecursively(this.sourceSkillDir);
    const files: Array<{ path: string; content: string }> = [];

    for (const absolutePath of relativePaths) {
      const relativePath = path.relative(this.sourceSkillDir, absolutePath);

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

  private async renderClaudeAgentFile(): Promise<string> {
    return fs.readFile(this.claudeAgentTemplatePath, 'utf8');
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
      } else {
        files.push(fullPath);
      }
    }

    return files.sort();
  }

  private async renderProjectContext(config: ProjectConfig): Promise<string> {
    const templatePath = path.join(
      this.sourceSkillDir,
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
