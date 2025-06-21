"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommand = void 0;
const chalk_1 = __importDefault(require("chalk"));
class UpdateCommand {
    async execute(options) {
        console.log(chalk_1.default.cyan('🔄 Updating MetaCoding setup...\n'));
        console.log(chalk_1.default.yellow('⚠️  Update command is not yet implemented.'));
        console.log(chalk_1.default.dim('This feature will:'));
        console.log(chalk_1.default.dim('- Update instruction files to latest version'));
        console.log(chalk_1.default.dim('- Migrate configuration if needed'));
        console.log(chalk_1.default.dim('- Backup existing files'));
        console.log(chalk_1.default.dim('- Apply template updates'));
    }
}
exports.UpdateCommand = UpdateCommand;
//# sourceMappingURL=update.js.map