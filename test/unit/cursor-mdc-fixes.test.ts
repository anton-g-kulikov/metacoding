import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CursorService } from '../../src/services/cursor';
import { TemplateManager } from '../../src/services/template-manager';
import { FileSystemService } from '../../src/services/filesystem';

describe('CUR-TASK-002: MDC Generation Content Deduplication', () => {
  let cursorService: CursorService;
  let mockTemplateManager: jest.Mocked<TemplateManager>;
  let mockFileSystemService: jest.Mocked<FileSystemService>;

  beforeEach(() => {
    mockTemplateManager = {
      getInstructionFiles: jest.fn(),
    } as any;

    mockFileSystemService = {
      fileExists: jest.fn(),
      writeFile: jest.fn(),
      ensureDirectoryExists: jest.fn(),
    } as any;

    cursorService = new CursorService(mockTemplateManager, mockFileSystemService);
  });

  describe('CUR-UNIT-015: MDC generation should not duplicate content', () => {
    it('should not duplicate headers in merged content', async () => {
      const instructionFiles = [
        {
          path: 'copilot-instructions.md',
          content: '# Project Overview\nThis is a test project.\n\n# Role and Persona\nAssume the role of a senior developer.',
        },
        {
          path: 'typescript.coding.instructions.md',
          content: '# TypeScript Guidelines\nUse strict typing.',
        },
      ];

      mockTemplateManager.getInstructionFiles.mockResolvedValue(instructionFiles);

      const result = await cursorService.generateWorkflowRules('/test/path', 'typescript');

      // Should only have one main header
      const headerMatches = result.match(/# Cursor AI Development Rules/g);
      expect(headerMatches).toHaveLength(1);

      // Should not have duplicate content sections
      const projectOverviewMatches = result.match(/# Project Overview/g);
      expect(projectOverviewMatches).toHaveLength(1);

      // Should contain content only from copilot-instructions.md (new behavior)
      expect(result).toContain('This is a test project');
      // Should NOT contain TypeScript-specific content in workflow.mdc anymore
      expect(result).not.toContain('Use strict typing');
    });

    it('should properly separate content with source comments', async () => {
      const instructionFiles = [
        {
          path: 'copilot-instructions.md',
          content: '# Main Instructions\nCore rules.',
        },
        {
          path: 'typescript.coding.instructions.md',
          content: '# TypeScript\nTS rules.',
        },
      ];

      mockTemplateManager.getInstructionFiles.mockResolvedValue(instructionFiles);

      const result = await cursorService.generateWorkflowRules('/test/path', 'typescript');

      // Should only contain copilot-instructions.md source comment
      expect(result).toContain('<!-- Source: copilot-instructions.md -->');
      // Should NOT contain typescript.coding.instructions.md in workflow.mdc anymore
      expect(result).not.toContain('<!-- Source: typescript.coding.instructions.md -->');
      // Should not have section separators since only one file is processed
      expect(result).not.toContain('---');
    });
  });

  describe('CUR-UNIT-016: MDC frontmatter should be generated only once', () => {
    it('should have single frontmatter block in MDC output', () => {
      const content = 'Test content';
      const mdcContent = (cursorService as any).createMdcContent(content, '**/*');

      const frontmatterMatches = mdcContent.match(/^---$/gm);
      expect(frontmatterMatches).toHaveLength(2); // Opening and closing frontmatter markers
    });

    it('should have proper frontmatter structure', () => {
      const content = 'Test content';
      const mdcContent = (cursorService as any).createMdcContent(content, '**/*.ts');

      expect(mdcContent).toMatch(/^---\n/);
      expect(mdcContent).toContain('description:');
      expect(mdcContent).toContain('patterns:');
      expect(mdcContent).toContain('alwaysApply:');
      expect(mdcContent).toMatch(/\n---\n/);
    });
  });

  describe('CUR-UNIT-017: Template variables should be properly substituted', () => {
    it('should replace all template variables with provided values', () => {
      const content = 'Project: {{PROJECT_NAME}}, Description: {{PROJECT_DESCRIPTION}}, Tech: {{TECH_STACK}}';
      const projectConfig = {
        projectName: 'TestApp',
        projectDescription: 'A test application',
        techStack: ['React', 'TypeScript'],
      };

      const result = (cursorService as any).applyTemplateSubstitution(content, projectConfig);

      expect(result).toContain('Project: TestApp');
      expect(result).toContain('Description: A test application');
      expect(result).toContain('Tech: React, TypeScript');
    });

    it('should use default values for missing variables', () => {
      const content = 'Project: {{PROJECT_NAME}}, Description: {{PROJECT_DESCRIPTION}}';
      const projectConfig = {}; // Empty config

      const result = (cursorService as any).applyTemplateSubstitution(content, projectConfig);

      expect(result).toContain('Project: Project');
      expect(result).toContain('Description: A guided development project using metacoding workflow');
    });
  });

  describe('CUR-UNIT-018: Generated MDC file should have appropriate length', () => {
    it('should generate reasonably sized output', async () => {
      const instructionFiles = [
        {
          path: 'copilot-instructions.md',
          content: '# Instructions\n'.repeat(10) + 'Content\n'.repeat(50),
        },
      ];

      mockTemplateManager.getInstructionFiles.mockResolvedValue(instructionFiles);

      const result = await cursorService.generateWorkflowRules('/test/path', 'general');

      // Should be much smaller than the problematic 2,703 lines
      const lineCount = result.split('\n').length;
      expect(lineCount).toBeLessThan(200); // Reasonable upper bound
      expect(lineCount).toBeGreaterThan(50); // Should have meaningful content
    });
  });

  describe('CUR-UNIT-019: MDC structure should be valid and well-formed', () => {
    it('should generate valid MDC structure', () => {
      const content = '# Test Content\nSome instructions.';
      const mdcContent = (cursorService as any).createMdcContent(content, '**/*');

      // Should start with frontmatter
      expect(mdcContent).toMatch(/^---\n/);
      
      // Should have proper YAML structure
      expect(mdcContent).toMatch(/description: ".+"/);
      expect(mdcContent).toMatch(/patterns: \[".+"\]/);
      expect(mdcContent).toMatch(/alwaysApply: (true|false)/);
      
      // Should end frontmatter and start content
      expect(mdcContent).toMatch(/\n---\n\n/);
      
      // Should contain the actual content
      expect(mdcContent).toContain('Test Content');
    });

    it('should handle special characters in content', () => {
      const content = '# Test\n```typescript\nconst x: string = "test";\n```\n- [ ] Task item';
      const mdcContent = (cursorService as any).createMdcContent(content, '**/*');

      expect(mdcContent).toContain('```typescript');
      expect(mdcContent).toContain('const x: string = "test";');
      expect(mdcContent).toContain('- [ ] Task item');
    });
  });
});
