/**
 * TypeScript type definitions for metacoding CLI
 */

export type AgentVendor = 'codex' | 'claude-code' | 'antigravity';
export type AgentVendorOption = AgentVendor | 'all';

export interface InitOptions {
  template: string;
  force?: boolean;
  skipGit?: boolean;
  vendor?: AgentVendorOption;
}

export interface UpdateOptions {
  template?: string;
  backup?: boolean;
  force?: boolean;
  dryRun?: boolean;
  strict?: boolean;
  vendor?: AgentVendorOption;
}

export interface ProjectConfig {
  name: string;
  description: string;
  techStack: string[];
  projectType: string;
  testFramework?: string;
  buildTool?: string;
  vendor: AgentVendor;
}

export interface Template {
  name: string;
  description: string;
  files: TemplateFile[];
  prompts: TemplatePrompt[];
  vscodeSettings?: Record<string, any>;
}

export interface TemplateFile {
  source: string;
  destination: string;
  template: boolean;
}

export interface TemplatePrompt {
  name: string;
  type: 'input' | 'list' | 'confirm';
  message: string;
  choices?: string[];
  default?: any;
  validate?: (input: any) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  file?: string;
  fixable: boolean;
}

export interface ValidationWarning {
  code: string;
  message: string;
  file?: string;
}

export interface FileSystemResult {
  success: boolean;
  error?: string;
  created?: string[];
  updated?: string[];
  skipped?: string[];
}

export interface ConflictResolution {
  action: 'keep' | 'replace' | 'skip';
  userFileName?: string | undefined;
  applyToAll?: boolean;
}

export interface UpdateConflict {
  filePath: string;
  templateContent: string;
  userContent: string;
  hasChanges: boolean;
}

export interface BackupResult {
  backupPath: string;
  timestamp: string;
  filesBackedUp: string[];
}
