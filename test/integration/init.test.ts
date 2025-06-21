import { InitCommand } from '../../src/commands/init';
import { FileSystemService } from '../../src/services/filesystem';
import * as fs from 'fs-extra';
import * as path from 'path';

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

  test('should create basic MetaCoding structure with force flag', async () => {
    const initCommand = new InitCommand();
    const fileSystem = new FileSystemService();

    // Mock the interactive prompts by creating a version that skips them
    const options = {
      template: 'general',
      force: true,
      skipVscode: true,
      skipGit: true,
    };

    // Execute the command
    await initCommand.execute(options);

    // Check that basic structure was created
    expect(await fileSystem.fileExists('.github')).toBe(true);
    expect(await fileSystem.fileExists('.github/instructions')).toBe(true);
    expect(await fileSystem.fileExists('.github/copilot-instructions.md')).toBe(true);
  });

  test('should detect existing MetaCoding setup', async () => {
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
