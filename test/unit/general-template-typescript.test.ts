import { TemplateManager } from '../../src/services/template-manager';
import { ProjectConfig } from '../../src/types';

describe('General Template TypeScript Support', () => {
  let templateManager: TemplateManager;

  beforeEach(() => {
    templateManager = new TemplateManager();
  });

  describe('GEN-UNIT-001: General template with TypeScript loads only TypeScript files', () => {
    it('should load TypeScript instructions when TypeScript is in techStack', async () => {
      // Arrange
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project with TypeScript',
        techStack: ['TypeScript'],
        projectType: 'general',
        testFramework: 'Jest',
        buildTool: 'TypeScript Compiler'
      };

      // Act
      const template = await templateManager.getTemplate('general', projectConfig);

      // Assert - Should contain TypeScript instruction files
      const typescriptCodingFile = template.files.find(f => 
        f.destination === '.github/instructions/typescript.coding.instructions.md'
      );
      const typescriptDocsFile = template.files.find(f => 
        f.destination === '.github/instructions/typescript.docs.instructions.md'
      );
      const typescriptTestingFile = template.files.find(f => 
        f.destination === '.github/instructions/typescript.testing.instructions.md'
      );

      expect(typescriptCodingFile).toBeDefined();
      expect(typescriptDocsFile).toBeDefined();
      expect(typescriptTestingFile).toBeDefined();

      // Assert - Should NOT contain Python or React specific files
      const pythonFiles = template.files.filter(f => 
        f.destination.includes('python.')
      );
      const reactFiles = template.files.filter(f => 
        f.destination.includes('react.')
      );

      expect(pythonFiles).toHaveLength(0);
      expect(reactFiles).toHaveLength(0);

      // Assert - Should contain universal files
      const codeReviewFile = template.files.find(f => 
        f.destination === '.github/instructions/code-review.instructions.md'
      );
      const docsUpdateFile = template.files.find(f => 
        f.destination === '.github/instructions/docs-update.instructions.md'
      );
      const copilotInstructionsFile = template.files.find(f => 
        f.destination === '.github/copilot-instructions.md'
      );

      expect(codeReviewFile).toBeDefined();
      expect(docsUpdateFile).toBeDefined();
      expect(copilotInstructionsFile).toBeDefined();

      // Assert - Should contain general test runner file
      const testRunnerFile = template.files.find(f => 
        f.destination === '.github/instructions/test-runner.instructions.md'
      );
      expect(testRunnerFile).toBeDefined();
    });

    it('should not load TypeScript instructions when TypeScript is not in techStack', async () => {
      // Arrange
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test project without TypeScript',
        techStack: ['JavaScript'],
        projectType: 'general',
        testFramework: 'Jest'
      };

      // Act
      const template = await templateManager.getTemplate('general', projectConfig);

      // Assert - Should NOT contain TypeScript instruction files
      const typescriptFiles = template.files.filter(f => 
        f.destination.includes('typescript.')
      );

      expect(typescriptFiles).toHaveLength(0);

      // Assert - Should still contain universal files
      const codeReviewFile = template.files.find(f => 
        f.destination === '.github/instructions/code-review.instructions.md'
      );
      expect(codeReviewFile).toBeDefined();
    });

    it('should work with backwards compatibility when no project config is provided', async () => {
      // Act - Call without project config (backwards compatibility)
      const template = await templateManager.getTemplate('general');

      // Assert - Should work without errors and contain universal files
      expect(template).toBeDefined();
      expect(template.name).toBe('general');
      
      const universalFiles = template.files.filter(f => 
        f.destination.includes('.github/instructions/') || 
        f.destination.includes('.github/copilot-instructions.md')
      );
      
      expect(universalFiles.length).toBeGreaterThan(0);
    });

    it('should still load TypeScript instructions for node template (backwards compatibility)', async () => {
      // Arrange
      const projectConfig: ProjectConfig = {
        name: 'test-project',
        description: 'Test Node.js project',
        techStack: ['Node.js'],
        projectType: 'node',
        testFramework: 'Jest'
      };

      // Act
      const template = await templateManager.getTemplate('node', projectConfig);

      // Assert - Should contain TypeScript instruction files (node template includes TypeScript by default)
      const typescriptCodingFile = template.files.find(f => 
        f.destination === '.github/instructions/typescript.coding.instructions.md'
      );

      expect(typescriptCodingFile).toBeDefined();
    });
  });
});
