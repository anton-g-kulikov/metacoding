"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDetector = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class ProjectDetector {
    async detectProject() {
        const currentDir = process.cwd();
        const packageJson = await this.readPackageJson();
        const type = await this.detectProjectType(packageJson);
        return {
            name: path.basename(currentDir),
            type,
            hasGit: await fs.pathExists('.git'),
            techStack: this.detectTechStack(packageJson, type),
        };
    }
    async detectProjectType(packageJson) {
        const deps = this.collectDependencies(packageJson);
        if (deps.react || deps['react-dom']) {
            return 'react';
        }
        if (await this.hasAnyFile([
            'requirements.txt',
            'pyproject.toml',
            'setup.py',
            'Pipfile',
            'main.py',
            'app.py',
        ])) {
            return 'python';
        }
        if (deps.express ||
            deps.fastify ||
            deps.koa ||
            (await this.hasAnyFile(['server.ts', 'server.js', 'app.ts', 'app.js']))) {
            return 'node';
        }
        if ((deps.webpack ||
            deps.parcel ||
            deps.rollup ||
            deps.vite ||
            (await this.hasAnyFile([
                'index.js',
                'main.js',
                'src/index.js',
                'src/main.js',
            ]))) &&
            !deps.typescript) {
            return 'javascript';
        }
        if (deps.typescript) {
            return 'typescript';
        }
        return 'general';
    }
    detectTechStack(packageJson, type) {
        const deps = this.collectDependencies(packageJson);
        const techStack = [];
        if (type === 'python') {
            techStack.push('Python');
        }
        if (deps.react) {
            techStack.push('React');
        }
        if (deps.typescript || deps['@types/node']) {
            techStack.push('TypeScript');
        }
        if (deps.express) {
            techStack.push('Express');
        }
        if (deps.fastify) {
            techStack.push('Fastify');
        }
        if (deps.jest) {
            techStack.push('Jest');
        }
        if (deps.vite) {
            techStack.push('Vite');
        }
        if (deps.pytest) {
            techStack.push('Pytest');
        }
        if (techStack.length === 0) {
            if (type === 'javascript') {
                techStack.push('JavaScript');
            }
            else {
                techStack.push('TypeScript');
            }
        }
        return techStack;
    }
    collectDependencies(packageJson) {
        return {
            ...(packageJson?.dependencies || {}),
            ...(packageJson?.devDependencies || {}),
        };
    }
    async readPackageJson() {
        if (!(await fs.pathExists('package.json'))) {
            return null;
        }
        try {
            return await fs.readJson('package.json');
        }
        catch {
            return null;
        }
    }
    async hasAnyFile(filePaths) {
        const results = await Promise.all(filePaths.map((filePath) => fs.pathExists(filePath)));
        return results.some(Boolean);
    }
}
exports.ProjectDetector = ProjectDetector;
//# sourceMappingURL=project-detector.js.map