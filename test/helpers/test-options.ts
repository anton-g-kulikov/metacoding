/**
 * Test helper utilities for creating init command options
 * with proper multi-assistant parameters
 */

import { AssistantType } from '../../src/types';

export interface TestInitOptions {
  template?: string;
  force?: boolean;
  skipVscode?: boolean;
  skipGit?: boolean;
  environment?: 'ide' | 'terminal';
  ideChoice?: 'vscode' | 'cursor' | 'intellij';
  assistants?: AssistantType[];
  vscode?: boolean;
  cursor?: boolean;
}

/**
 * Create default options for VS Code + Copilot tests
 */
export function createVSCodeOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    environment: 'ide' as const,
    ideChoice: 'vscode' as const,
    assistants: ['copilot'],
    ...overrides,
  };
}

/**
 * Create default options for Cursor IDE tests
 */
export function createCursorOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    environment: 'ide' as const,
    ideChoice: 'cursor' as const,
    assistants: ['copilot'], // Cursor uses its own rules system
    ...overrides,
  };
}

/**
 * Create default options for multi-assistant tests
 */
export function createMultiAssistantOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    environment: 'ide' as const,
    ideChoice: 'vscode' as const,
    assistants: ['all'],
    ...overrides,
  };
}

/**
 * Create default options for terminal-based assistant tests
 */
export function createTerminalOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    environment: 'terminal' as const,
    assistants: ['claude'],
    ...overrides,
  };
}

/**
 * Create legacy-style options (for backward compatibility tests)
 */
export function createLegacyVSCodeOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    vscode: true,
    ...overrides,
  };
}

/**
 * Create legacy-style Cursor options (for backward compatibility tests)
 */
export function createLegacyCursorOptions(overrides: Partial<TestInitOptions> = {}): TestInitOptions {
  return {
    template: 'general',
    force: true,
    skipVscode: true,
    skipGit: true,
    cursor: true,
    ...overrides,
  };
}
