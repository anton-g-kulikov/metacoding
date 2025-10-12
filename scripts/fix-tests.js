#!/usr/bin/env node

/**
 * Script to batch-fix test files with multi-assistant parameters
 * 
 * This script updates all test files that call initCommand.execute()
 * to include the required multi-assistant parameters (environment, ideChoice, assistants)
 */

const fs = require('fs');

// Files to process
const testFiles = [
  'test/unit/package-structure.test.ts',
  'test/integration/advanced-workflows.test.ts',
  'test/integration/cli.cursor.integration.test.ts',
  'test/integration/e2e.cursor.integration.test.ts',
];

// Pattern to match execute calls with old format
const oldPattern = /await initCommand\.execute\(\{\s*template: ['"](\w+)['"],\s*force: true,\s*skipVscode: true,\s*skipGit: true,\s*\}\);/g;
const oldPatternNonAwait = /initCommand\.execute\(\{\s*template: ['"](\w+)['"],\s*force: true,\s*skipVscode: true,\s*skipGit: true,\s*\}\)/g;

function fixFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if AssistantType is already imported
  if (!content.includes("import { AssistantType }")) {
    // Add AssistantType import
    content = content.replace(
      /(import.*from.*'..\/..\/src\/types';)/,
      "$1\nimport { AssistantType } from '../../src/types';"
    );
    
    // If no types import exists, add it after filesystem import
    if (!content.includes("from '../../src/types'")) {
      content = content.replace(
        /(import.*FileSystemService.*from.*'..\/..\/src\/services\/filesystem';)/,
        "$1\nimport { AssistantType } from '../../src/types';"
      );
    }
    modified = true;
  }
  
  // Fix execute calls with await
  content = content.replace(oldPattern, (match, template) => {
    modified = true;
    return `const assistants: AssistantType[] = ['copilot'];
      await initCommand.execute({
        template: '${template}',
        force: true,
        skipVscode: true,
        skipGit: true,
        environment: 'ide' as const,
        ideChoice: 'vscode' as const,
        assistants,
      });`;
  });
  
  // Fix execute calls without await
  content = content.replace(oldPatternNonAwait, (match, template) => {
    modified = true;
    return `initCommand.execute({
        template: '${template}',
        force: true,
        skipVscode: true,
        skipGit: true,
        environment: 'ide' as const,
        ideChoice: 'vscode' as const,
        assistants: ['copilot'],
      })`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Fixed ${filePath}`);
  } else {
    console.log(`  - No changes needed for ${filePath}`);
  }
}

// Process all files
testFiles.forEach(fixFile);

console.log('\nBatch fix complete!');
