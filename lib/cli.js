"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const validate_1 = require("./commands/validate");
const update_1 = require("./commands/update");
const packageJson = require('../package.json');
const version = packageJson.version;
async function main() {
    const program = new commander_1.Command();
    program
        .name('metacoding')
        .description('Guided Development Workflow for GitHub Copilot')
        .version(version)
        .addHelpText('after', `
${chalk_1.default.cyan('Examples:')}
  ${chalk_1.default.dim('$')} metacoding init                    # Initialize metacoding in current directory
  ${chalk_1.default.dim('$')} metacoding init --template react   # Initialize with React template
  ${chalk_1.default.dim('$')} metacoding validate                # Validate current metacoding setup
  ${chalk_1.default.dim('$')} metacoding update                  # Update to latest metacoding version

${chalk_1.default.cyan('Learn more:')}
  Documentation: https://github.com/your-username/metacoding
  Issues: https://github.com/your-username/metacoding/issues
    `);
    program
        .command('init')
        .description('Initialize metacoding in the current project')
        .option('-t, --template <type>', 'project template (general, react, node, python)', 'general')
        .option('-f, --force', 'overwrite existing files without confirmation')
        .option('--skip-vscode', 'skip VS Code settings configuration')
        .option('--skip-git', 'skip Git repository initialization check')
        .action(async (options) => {
        try {
            const initCommand = new init_1.InitCommand();
            await initCommand.execute(options);
        }
        catch (error) {
            console.error(chalk_1.default.red('Error during initialization:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });
    program
        .command('validate')
        .description('Validate current metacoding setup')
        .option('--fix', 'automatically fix issues where possible')
        .option('--strict', 'use strict validation rules')
        .action(async (options) => {
        try {
            const validateCommand = new validate_1.ValidateCommand();
            await validateCommand.execute(options);
        }
        catch (error) {
            console.error(chalk_1.default.red('Error during validation:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });
    program
        .command('update')
        .description('Update existing metacoding setup to latest version')
        .option('--template <type>', 'update to specific template type')
        .option('--backup', 'create backup of existing files before updating')
        .action(async (options) => {
        try {
            const updateCommand = new update_1.UpdateCommand();
            await updateCommand.execute(options);
        }
        catch (error) {
            console.error(chalk_1.default.red('Error during update:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });
    if (process.argv.length <= 2) {
        program.help();
    }
    await program.parseAsync(process.argv);
}
//# sourceMappingURL=cli.js.map