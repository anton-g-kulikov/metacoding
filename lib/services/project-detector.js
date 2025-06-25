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
        const projectName = path.basename(currentDir);
        return {
            name: projectName,
            type: await this.detectProjectType(),
            hasGit: await this.hasGitRepository(),
            hasVSCode: await this.hasVSCodeConfiguration(),
            hasPackageJson: await this.hasPackageJson(),
            techStack: await this.detectTechStack(),
        };
    }
    async detectProjectType() {
        if (await this.hasReactIndicators()) {
            return 'react';
        }
        if (await this.hasNodeIndicators()) {
            return 'node';
        }
        if (await this.hasJavaScriptIndicators()) {
            return 'javascript';
        }
        if (await this.hasPythonIndicators()) {
            return 'python';
        }
        return 'general';
    }
    async hasReactIndicators() {
        const packageJsonPath = 'package.json';
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);
                const deps = {
                    ...packageJson.dependencies,
                    ...packageJson.devDependencies,
                };
                return !!(deps.react || deps['@types/react'] || deps['react-dom']);
            }
            catch {
            }
        }
        const reactFiles = [
            'src/App.tsx',
            'src/App.jsx',
            'public/index.html',
            'vite.config.ts',
            'vite.config.js',
        ];
        for (const file of reactFiles) {
            if (await fs.pathExists(file)) {
                return true;
            }
        }
        return false;
    }
    async hasNodeIndicators() {
        const packageJsonPath = 'package.json';
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);
                const deps = {
                    ...packageJson.dependencies,
                    ...packageJson.devDependencies,
                };
                const nodeIndicators = [
                    'express',
                    'fastify',
                    'koa',
                    '@types/node',
                    'nodemon',
                ];
                return nodeIndicators.some((indicator) => deps[indicator]);
            }
            catch {
            }
        }
        const nodeFiles = [
            'server.js',
            'server.ts',
            'app.js',
            'app.ts',
        ];
        for (const file of nodeFiles) {
            if (await fs.pathExists(file)) {
                return true;
            }
        }
        const indexFiles = ['index.js', 'index.ts'];
        for (const file of indexFiles) {
            if (await fs.pathExists(file)) {
                try {
                    const content = await fs.readFile(file, 'utf-8');
                    const nodePatterns = [
                        'require\\(.*express.*\\)',
                        'require\\(.*http.*\\)',
                        'require\\(.*fs.*\\)',
                        'require\\(.*path.*\\)',
                        'process\\.env',
                        'module\\.exports',
                        '__dirname',
                        '__filename',
                        'createServer',
                        'app\\.listen',
                    ];
                    if (nodePatterns.some(pattern => new RegExp(pattern).test(content))) {
                        return true;
                    }
                }
                catch {
                }
            }
        }
        return false;
    }
    async hasJavaScriptIndicators() {
        const packageJsonPath = 'package.json';
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);
                const deps = {
                    ...packageJson.dependencies,
                    ...packageJson.devDependencies,
                };
                const jsIndicators = [
                    'webpack',
                    'parcel',
                    'rollup',
                    'browserify',
                    'lodash',
                    'moment',
                    'axios',
                    'jquery',
                    '@babel/core',
                    'babel-core',
                ];
                const hasJsIndicators = jsIndicators.some((indicator) => deps[indicator]);
                const hasBackendIndicators = ['express', 'fastify', 'koa'].some((indicator) => deps[indicator]);
                const hasReactIndicators = ['react', 'react-dom'].some((indicator) => deps[indicator]);
                if (hasJsIndicators && !hasBackendIndicators && !hasReactIndicators) {
                    return true;
                }
                if (packageJson.main || packageJson.browser) {
                    return !hasBackendIndicators && !hasReactIndicators;
                }
            }
            catch {
            }
        }
        const jsFiles = ['index.js', 'main.js', 'app.js', 'src/index.js', 'src/main.js'];
        const tsFiles = ['index.ts', 'main.ts', 'app.ts', 'src/index.ts', 'src/main.ts'];
        const hasJsFiles = await Promise.all(jsFiles.map(file => fs.pathExists(file)));
        const hasTsFiles = await Promise.all(tsFiles.map(file => fs.pathExists(file)));
        if (hasJsFiles.some(exists => exists) && !hasTsFiles.some(exists => exists)) {
            return true;
        }
        return false;
    }
    async hasPythonIndicators() {
        const pythonFiles = [
            'requirements.txt',
            'pyproject.toml',
            'setup.py',
            'Pipfile',
            'poetry.lock',
            'main.py',
            'app.py',
        ];
        for (const file of pythonFiles) {
            if (await fs.pathExists(file)) {
                return true;
            }
        }
        return false;
    }
    async hasGitRepository() {
        return await fs.pathExists('.git');
    }
    async hasVSCodeConfiguration() {
        return await fs.pathExists('.vscode');
    }
    async hasPackageJson() {
        return await fs.pathExists('package.json');
    }
    async detectTechStack() {
        const techStack = [];
        if (await fs.pathExists('package.json')) {
            try {
                const packageJson = await fs.readJson('package.json');
                const deps = {
                    ...packageJson.dependencies,
                    ...packageJson.devDependencies,
                };
                if (deps.react)
                    techStack.push('React');
                if (deps.typescript || deps['@types/node'])
                    techStack.push('TypeScript');
                if (deps.express)
                    techStack.push('Express');
                if (deps.jest)
                    techStack.push('Jest');
                if (deps.vite)
                    techStack.push('Vite');
                if (deps.webpack)
                    techStack.push('Webpack');
                if (deps.next)
                    techStack.push('Next.js');
            }
            catch {
            }
        }
        if (await this.hasPythonIndicators()) {
            techStack.push('Python');
        }
        if (techStack.length === 0) {
            techStack.push('TypeScript', 'Jest');
        }
        return techStack;
    }
}
exports.ProjectDetector = ProjectDetector;
//# sourceMappingURL=project-detector.js.map