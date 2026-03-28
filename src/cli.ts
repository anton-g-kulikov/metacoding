import { Command } from 'commander';
import chalk from 'chalk';
import { InitCommand } from './commands/init';
import { UpdateCommand } from './commands/update';
const packageJson = require('../package.json');
const version = packageJson.version;

/**
 * Main CLI function that sets up and executes commands
 */
export async function main(): Promise<void> {
  const program = new Command();

  program
    .name('metacoding')
    .description('Install and sync the metacoding workflow skill for coding agents')
    .version(version)
    .addHelpText(
      'after',
      `
${chalk.cyan('Examples:')}
  ${chalk.dim('$')} metacoding init                    # Install the workflow skill in the current project
  ${chalk.dim('$')} metacoding init --template react   # Install with React-oriented project context
  ${chalk.dim('$')} metacoding init --vendor claude-code  # Install the Claude Code subagent variant
  ${chalk.dim('$')} metacoding init --vendor all       # Install all supported workspace variants
  ${chalk.dim('$')} metacoding update --dry-run        # Validate the installed skill package
  ${chalk.dim('$')} metacoding update                  # Sync the installed skill to the packaged version
  ${chalk.dim('$')} metacoding update --force          # Overwrite local skill edits with the packaged version

${chalk.cyan('Learn more:')}
  Documentation: https://github.com/anton-g-kulikov/metacoding
  Issues: https://github.com/anton-g-kulikov/metacoding/issues
    `
    );

  // Initialize command
  program
    .command('init')
    .description('Install the metacoding workflow skill in the current project')
    .option(
      '-t, --template <type>',
      'project template (general, react, node, python, typescript)',
      'general'
    )
    .option(
      '-v, --vendor <vendor>',
      'target coding agent vendor (codex, claude-code, antigravity, all)'
    )
    .option('-f, --force', 'overwrite existing files without confirmation')
    .option('--skip-git', 'skip Git repository initialization check')
    .action(async (options) => {
      try {
        const initCommand = new InitCommand();
        await initCommand.execute(options);
      } catch (error) {
        console.error(
          chalk.red('Error during initialization:'),
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    });

  // Update command
  program
    .command('update')
    .description(
      'Sync the installed metacoding workflow skill or validate its current setup'
    )
    .option('--template <type>', 'update to specific template type')
    .option(
      '-v, --vendor <vendor>',
      'sync or validate a specific vendor install (codex, claude-code, antigravity, all)'
    )
    .option('--backup', 'create backup of existing files before updating')
    .option('--force', 'overwrite locally edited skill files')
    .option('--dry-run', 'validate setup without making changes')
    .option('--strict', 'use strict validation rules (with --dry-run)')
    .action(async (options) => {
      try {
        const updateCommand = new UpdateCommand();
        await updateCommand.execute(options);
      } catch (error) {
        console.error(
          chalk.red('Error during update:'),
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    });

  // Handle case where no command is provided
  if (process.argv.length <= 2) {
    program.help();
  }

  // Parse command line arguments
  await program.parseAsync(process.argv);
}
