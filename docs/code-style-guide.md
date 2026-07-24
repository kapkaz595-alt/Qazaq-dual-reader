# 代码规范

## Lint工具
- frontend 使用 ESLint（Vite创建项目时自动配置，规则文件 eslint.config.js）
- backend 使用 ESLint（手动配置，CommonJS模块，规则文件 eslint.config.mjs）

## 使用方法
- frontend 目录下运行：`npm run lint`
- backend 目录下运行：`npm run lint`

## 提交前检查
提交代码前请先在本地运行 lint，确保没有报错再提交。
GitHub Actions CI流水线（见 T006）也会在每次 push 或提交 Pull Request 时自动运行 lint 和 build 检查，检查不通过会阻止合并。