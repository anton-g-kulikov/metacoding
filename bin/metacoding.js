#!/usr/bin/env node

/**
 * MetaCoding CLI Entry Point
 * 
 * This file serves as the main entry point for the MetaCoding CLI tool.
 * It delegates to the compiled TypeScript code in the lib directory.
 */

const { main } = require('../lib/cli');

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

// Run the main CLI function
main().catch((error) => {
  console.error('CLI Error:', error.message);
  process.exit(1);
});
