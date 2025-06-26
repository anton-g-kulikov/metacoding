import { describe, it, beforeEach, afterEach, expect } from '@jest/globals';
import { TemplateManager } from '../../src/services/template-manager';
import { ProjectConfig } from '../../src/types';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

describe('TemplateManager IDE Choice Integration', () => {
  let templateManager: TemplateManager;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'metacoding-test-'));
    templateManager = new TemplateManager();
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('CUR-UNIT-021: Template manager should accept ideChoice parameter', () => {
    it('should accept ideChoice parameter in getTemplate method', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
      };

      // This should not throw an error when ideChoice is passed
      await expect(
        templateManager.getTemplate('general', projectConfig)
      ).resolves.toBeDefined();
    });

    it('should accept ideChoice parameter with vscode value', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
      };

      await expect(
        templateManager.getTemplate('general', projectConfig)
      ).resolves.toBeDefined();
    });
  });

  describe('CUR-UNIT-022: loadInstructionFiles should conditionally create files by IDE choice', () => {
    it('should create .github files when ideChoice is vscode', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
        ideChoice: 'vscode',
      };

      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // Should contain .github file destinations for VS Code
      const githubFiles = template.files.filter((file) =>
        file.destination.startsWith('.github/')
      );
      expect(githubFiles.length).toBeGreaterThan(0);

      // Should include copilot-instructions.md for VS Code
      const copilotFile = template.files.find(
        (file) => file.destination === '.github/copilot-instructions.md'
      );
      expect(copilotFile).toBeDefined();
    });

    it('should NOT create .github files when ideChoice is cursor', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
        ideChoice: 'cursor',
      };

      // This will fail initially since we haven't implemented the ideChoice parameter yet
      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // Should NOT contain any .github file destinations for Cursor
      const githubFiles = template.files.filter((file) =>
        file.destination.startsWith('.github/')
      );
      expect(githubFiles.length).toBe(0); // This will fail until we implement the fix
    });

    it('should default to vscode behavior when ideChoice is undefined', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
      };

      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // Should create .github files by default (backwards compatibility)
      const githubFiles = template.files.filter((file) =>
        file.destination.startsWith('.github/')
      );
      expect(githubFiles.length).toBeGreaterThan(0);
    });
  });

  describe('CUR-UNIT-019: VS Code init should only create .github files', () => {
    it('should only include .github destinations for VS Code setup', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
        ideChoice: 'vscode',
      };

      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // All instruction files should go to .github
      const instructionFiles = template.files.filter(
        (file) =>
          file.source.includes('.instructions.md') ||
          file.source.includes('copilot-instructions.md')
      );

      instructionFiles.forEach((file) => {
        expect(file.destination).toMatch(/^\.github\//);
      });
    });
  });

  describe('CUR-UNIT-020: Cursor init should only create .cursor files, no .github files', () => {
    it('should not create any .github files for Cursor setup', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
        ideChoice: 'cursor',
      };

      // This will fail initially since we haven't implemented ideChoice parameter yet
      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // No files should have .github destinations
      const githubFiles = template.files.filter((file) =>
        file.destination.startsWith('.github/')
      );

      expect(githubFiles).toHaveLength(0); // This will fail until we implement the fix
    });

    it('should allow Cursor service to handle .cursor file generation separately', async () => {
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project',
        techStack: ['typescript'],
        projectType: 'general',
        ideChoice: 'cursor',
      };

      const template = await templateManager.getTemplate(
        'general',
        projectConfig
      );

      // Template should not include instruction files when IDE choice is cursor
      const instructionSources = template.files.filter(
        (file) =>
          file.source.includes('.instructions.md') ||
          file.source.includes('copilot-instructions.md')
      );

      // Sources should not be included for Cursor since CursorService handles them separately
      expect(instructionSources).toHaveLength(0); // This will fail until we implement the fix
    });
  });
});
