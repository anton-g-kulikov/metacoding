import { InitCommand } from '../../src/commands/init';
import { FileSystemService } from '../../src/services/filesystem';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Package Structure Validation', () => {
  let testDir: string;
  let originalCwd: string;
  let fileSystem: FileSystemService;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(__dirname, '../../tmp-structure-test-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    fileSystem = new FileSystemService();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('General Template Structure', () => {
    test('CLI-UNIT-020: should create all required metacoding files for general template', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Check core structure
      expect(await fileSystem.fileExists('.github')).toBe(true);
      expect(await fileSystem.fileExists('.github/instructions')).toBe(true);
      expect(
        await fileSystem.fileExists('.github/copilot-instructions.md')
      ).toBe(true);

      // Check instruction files
      expect(
        await fileSystem.fileExists(
          '.github/instructions/code-review.instructions.md'
        )
      ).toBe(true);
      expect(
        await fileSystem.fileExists(
          '.github/instructions/docs-update.instructions.md'
        )
      ).toBe(true);
      expect(
        await fileSystem.fileExists(
          '.github/instructions/release.instructions.md'
        )
      ).toBe(true);
      expect(
        await fileSystem.fileExists(
          '.github/instructions/test-runner.instructions.md'
        )
      ).toBe(true);
    });

    test('CLI-UNIT-021: should verify copilot instructions content for general template', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const content = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Check for template variable substitution
      expect(content).not.toContain('{{PROJECT_DESCRIPTION}}');
      expect(content).not.toContain('{{TECH_STACK}}');

      // Check for mandatory workflow content
      expect(content).toContain('mandatory development workflow');
      expect(content).toContain('Step 1: Task Understanding and Planning');
      expect(content).toContain('workflow completion');
    });
  });

  describe('React Template Structure', () => {
    test('CLI-UNIT-022: should create React-specific files and content', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'react',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const copilotContent = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Check React-specific content
      expect(copilotContent).toContain('React');
      expect(copilotContent).toContain('React');
      expect(copilotContent).toContain('component');
      expect(copilotContent).toContain('JSX');
    });

    test('CLI-UNIT-023: should include React-specific test conventions', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'react',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const testRunnerContent = await fileSystem.readFile(
        '.github/instructions/test-runner.instructions.md'
      );

      // Check for React/Frontend specific area prefixes
      expect(testRunnerContent).toContain('COMP` - React component tests');
      expect(testRunnerContent).toContain('HOOK` - Custom hooks tests');
      expect(testRunnerContent).toContain('PAGE` - Page/Route');
    });
  });

  describe('Node.js Template Structure', () => {
    test('CLI-UNIT-024: should create Node.js-specific files and content', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'node',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const copilotContent = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Check Node.js-specific content
      expect(copilotContent).toContain('Node.js');
      expect(copilotContent).toContain('backend');
      expect(copilotContent).toContain('API');
      expect(copilotContent).toContain('server');
    });

    test('CLI-UNIT-025: should include Node.js-specific test conventions', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'node',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const testRunnerContent = await fileSystem.readFile(
        '.github/instructions/test-runner.instructions.md'
      );

      // Check for Node.js/Backend specific area prefixes
      expect(testRunnerContent).toContain('`API` - REST API endpoint tests');
      expect(testRunnerContent).toContain('`SRV` - Service layer tests');
      expect(testRunnerContent).toContain('`DB` - Database/ORM tests');
    });
  });

  describe('Python Template Structure', () => {
    test('CLI-UNIT-026: should create Python-specific files and content', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'python',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const copilotContent = await fileSystem.readFile(
        '.github/copilot-instructions.md'
      );

      // Check Python-specific content
      expect(copilotContent).toContain('Python');
      expect(copilotContent).toContain('Django');
      expect(copilotContent).toContain('Flask');
      expect(copilotContent).toContain('backend');
    });

    test('CLI-UNIT-027: should include Python-specific test conventions', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'python',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const testRunnerContent = await fileSystem.readFile(
        '.github/instructions/test-runner.instructions.md'
      );

      // Check for Python/Django specific area prefixes
      expect(testRunnerContent).toContain(
        '`VIEW` - Django views/FastAPI endpoints tests'
      );
      expect(testRunnerContent).toContain(
        '`MODEL` - Django models/SQLAlchemy tests'
      );
      expect(testRunnerContent).toContain(
        '`FORM` - Django forms/Pydantic validators tests'
      );
    });
  });

  describe('File Content Validation', () => {
    test('CLI-UNIT-028: should ensure all instruction files have proper front matter', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      const instructionFiles = [
        '.github/instructions/code-review.instructions.md',
        '.github/instructions/docs-update.instructions.md',
        '.github/instructions/release.instructions.md',
        '.github/instructions/test-runner.instructions.md',
      ];

      for (const file of instructionFiles) {
        const content = await fileSystem.readFile(file);

        // Check for YAML front matter
        expect(content).toMatch(/^---\n/);
        expect(content).toContain('description:');
        expect(content).toContain('applyTo:');
      }
    });

    test('CLI-UNIT-029: should ensure copilot instructions contain workflow enforcement', async () => {
      const templates = ['general', 'react', 'node', 'python'];

      for (const template of templates) {
        const initCommand = new InitCommand();
        await initCommand.execute({
          template,
          force: true,
          skipVscode: true,
          skipGit: true,
        });

        const content = await fileSystem.readFile(
          '.github/copilot-instructions.md'
        );

        // Check for workflow enforcement content (general template)
        expect(content).toContain('Mandatory Development Process');
        expect(content).toContain('Step 1: Task Understanding and Planning');
        expect(content).toContain('workflow completion');

        // Clean up for next iteration
        await fs.remove('.github');
      }
    });
  });

  describe('Directory Structure Validation', () => {
    test('CLI-UNIT-030: should create proper directory hierarchy', async () => {
      const initCommand = new InitCommand();
      await initCommand.execute({
        template: 'general',
        force: true,
        skipVscode: true,
        skipGit: true,
      });

      // Check directory structure
      const githubStat = await fs.stat('.github');
      expect(githubStat.isDirectory()).toBe(true);

      const instructionsStat = await fs.stat('.github/instructions');
      expect(instructionsStat.isDirectory()).toBe(true);

      // Check that files are in correct locations
      const copilotStat = await fs.stat('.github/copilot-instructions.md');
      expect(copilotStat.isFile()).toBe(true);
    });
  });
});
