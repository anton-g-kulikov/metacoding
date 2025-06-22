import { Command } from 'commander';
import chalk from 'chalk';
import { InitCommand } from './commands/init';
import { ValidateCommand } from './commands/validate';
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
    .description('Guided Development Workflow for GitHub Copilot')
    .version(version)
    .addHelpText(
      'after',
      `
${chalk.cyan('Examples:')}
  ${chalk.dim('$')} metacoding init                    # Initialize metacoding in current directory
  ${chalk.dim('$')} metacoding init --template react   # Initialize with React template
  ${chalk.dim('$')} metacoding validate                # Validate current metacoding setup
  ${chalk.dim('$')} metacoding update                  # Update to latest metacoding version

${chalk.cyan('Learn more:')}
  Documentation: https://github.com/your-username/metacoding
  Issues: https://github.com/your-username/metacoding/issues
    `
    );

  // Initialize command
  program
    .command('init')
    .description('Initialize metacoding in the current project')
    .option(
      '-t, --template <type>',
      'project template (general, react, node, python)',
      'general'
    )
    .option('-f, --force', 'overwrite existing files without confirmation')
    .option('--skip-vscode', 'skip VS Code settings configuration')
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

  // Validate command
  program
    .command('validate')
    .description('Validate current metacoding setup')
    .option('--fix', 'automatically fix issues where possible')
    .option('--strict', 'use strict validation rules')
    .action(async (options) => {
      try {
        const validateCommand = new ValidateCommand();
        await validateCommand.execute(options);
      } catch (error) {
        console.error(
          chalk.red('Error during validation:'),
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    });

  // Update command
  program
    .command('update')
    .description('Update existing metacoding setup to latest version')
    .option('--template <type>', 'update to specific template type')
    .option('--backup', 'create backup of existing files before updating')
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
