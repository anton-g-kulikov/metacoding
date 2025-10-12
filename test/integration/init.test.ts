import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';
import { InitCommand } from '../../src/commands/init';
import { FileSystemService } from '../../src/services/filesystem';
import { AssistantType } from '../../src/types';

/**
 * Basic integration test for the init command
 */
describe('InitCommand Integration', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    // Create a temporary test directory
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);

    // Set test environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(async () => {
    // Clean up
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  test('CLI-INT-001: should create basic metacoding structure with force flag', async () => {
    const initCommand = new InitCommand();
    const fileSystem = new FileSystemService();

    // Mock the interactive prompts by providing all required options
    const assistants: AssistantType[] = ['copilot'];
    const options = {
      template: 'general',
      force: true,
      skipVscode: true,
      skipGit: true,
      environment: 'ide' as const,
      ideChoice: 'vscode' as const,
      assistants,
    };

    // Execute the command
    await initCommand.execute(options);

    // Check that basic structure was created
    expect(await fileSystem.fileExists('.github')).toBe(true);
    expect(await fileSystem.fileExists('.github/instructions')).toBe(true);
    expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(
      true
    );
  });

  test('CLI-INT-002: should detect existing metacoding setup', async () => {
    const fileSystem = new FileSystemService();

    // Initially should not be set up
    expect(await fileSystem.isMetaCodingSetup()).toBe(false);

    // Create basic structure
    await fs.ensureDir('.github/instructions');
    await fs.writeFile('.github/copilot-instructions.md', 'test content');

    // Now should be detected as set up
    expect(await fileSystem.isMetaCodingSetup()).toBe(true);
  });
});
