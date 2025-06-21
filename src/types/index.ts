/**
 * TypeScript type definitions for metacoding CLI
 */

export interface InitOptions {
  template: string;
  force?: boolean;
  skipVscode?: boolean;
  skipGit?: boolean;
}

export interface ValidateOptions {
  fix?: boolean;
  strict?: boolean;
}

export interface UpdateOptions {
  template?: string;
  backup?: boolean;
}

export interface ProjectConfig {
  name: string;
  description: string;
  techStack: string[];
  projectType: string;
  testFramework?: string;
  buildTool?: string;
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
