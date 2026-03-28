"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const update_1 = require("./commands/update");
const packageJson = require('../package.json');
const version = packageJson.version;
async function main() {
    const program = new commander_1.Command();
    program
        .name('metacoding')
        .description('Install and sync the metacoding workflow skill for coding agents')
        .version(version)
        .addHelpText('after', `
${chalk_1.default.cyan('Examples:')}
  ${chalk_1.default.dim('$')} metacoding init                    # Install the workflow skill in the current project
  ${chalk_1.default.dim('$')} metacoding init --template react   # Install with React-oriented project context
  ${chalk_1.default.dim('$')} metacoding init --vendor claude-code  # Install the Claude Code subagent variant
  ${chalk_1.default.dim('$')} metacoding init --vendor all       # Install all supported workspace variants
  ${chalk_1.default.dim('$')} metacoding update --dry-run        # Validate the installed skill package
  ${chalk_1.default.dim('$')} metacoding update                  # Sync the installed skill to the packaged version
  ${chalk_1.default.dim('$')} metacoding update --force          # Overwrite local skill edits with the packaged version

${chalk_1.default.cyan('Learn more:')}
  Documentation: https://github.com/anton-g-kulikov/metacoding
  Issues: https://github.com/anton-g-kulikov/metacoding/issues
    `);
    program
        .command('init')
        .description('Install the metacoding workflow skill in the current project')
        .option('-t, --template <type>', 'project template (general, react, node, python, typescript)', 'general')
        .option('-v, --vendor <vendor>', 'target coding agent vendor (codex, claude-code, antigravity, all)')
        .option('-f, --force', 'overwrite existing files without confirmation')
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
        .command('update')
        .description('Sync the installed metacoding workflow skill or validate its current setup')
        .option('--template <type>', 'update to specific template type')
        .option('-v, --vendor <vendor>', 'sync or validate a specific vendor install (codex, claude-code, antigravity, all)')
        .option('--backup', 'create backup of existing files before updating')
        .option('--force', 'overwrite locally edited skill files')
        .option('--dry-run', 'validate setup without making changes')
        .option('--strict', 'use strict validation rules (with --dry-run)')
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