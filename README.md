# Monorepo ESLint Config

这是一个演示如何在 monorepo 中使用共享 ESLint 配置的项目。

## 项目结构

```
monorepo-eslint-config/
├── packages/
│   ├── eslint-config/          # 共享的 ESLint 配置包
│   │   ├── configs/
│   │   │   ├── base.js         # 基础配置
│   │   │   ├── typescript.js   # TypeScript 配置
│   │   │   ├── react.js        # React 配置
│   │   │   └── node.js         # Node.js 配置
│   │   ├── index.js
│   │   ├── package.json
│   │   └── README.md
│   ├── react-app/              # React 应用示例
│   │   ├── src/
│   │   ├── .eslintrc.js        # 使用 React 配置
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── node-lib/               # Node.js 库示例
│   │   ├── src/
│   │   ├── .eslintrc.js        # 使用 Node.js 配置
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils-lib/              # TypeScript 工具库示例
│       ├── src/
│       ├── .eslintrc.js        # 使用 TypeScript 配置
│       ├── package.json
│       └── tsconfig.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 运行 ESLint 检查

检查所有包：
```bash
pnpm lint
```

修复所有包的 ESLint 问题：
```bash
pnpm lint:fix
```

检查特定包：
```bash
cd packages/react-app
pnpm lint
```

### 3. 构建项目

构建所有包：
```bash
pnpm build
```

### 4. 开发模式

启动 React 应用：
```bash
cd packages/react-app
pnpm dev
```

## ESLint 配置说明

### 可用配置

1. **基础配置** (`@monorepo/eslint-config/configs/base`)
   - 适用于所有 JavaScript 项目
   - 包含基础的 ESLint 规则和 Prettier 集成

2. **TypeScript 配置** (`@monorepo/eslint-config/configs/typescript`)
   - 继承基础配置
   - 添加 TypeScript 特定规则
   - 适用于 TypeScript 项目

3. **React 配置** (`@monorepo/eslint-config/configs/react`)
   - 继承 TypeScript 配置
   - 添加 React、React Hooks 和可访问性规则
   - 适用于 React + TypeScript 项目

4. **Node.js 配置** (`@monorepo/eslint-config/configs/node`)
   - 继承 TypeScript 配置
   - 添加 Node.js 特定规则
   - 适用于 Node.js + TypeScript 项目

### 使用示例

#### React 项目
```js
// packages/react-app/.eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

#### Node.js 项目
```js
// packages/node-lib/.eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-console': 'off', // Node.js 项目中允许使用 console
  },
};
```

#### TypeScript 工具库
```js
// packages/utils-lib/.eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/typescript'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // 更严格的类型检查
  },
};
```

## 包管理

这个项目使用 pnpm 作为包管理器，支持 workspace 功能：

- 所有依赖都安装在根目录的 `node_modules` 中
- 子包之间可以通过 `workspace:*` 相互引用
- 使用 `pnpm -r` 命令可以在所有子包中运行脚本

## 开发工作流

1. **添加新的子包**：
   - 在 `packages/` 目录下创建新文件夹
   - 创建 `package.json` 并设置正确的包名
   - 根据项目类型选择合适的 ESLint 配置
   - 在根目录运行 `pnpm install` 安装依赖

2. **修改 ESLint 规则**：
   - 全局规则：修改 `packages/eslint-config/configs/` 中的配置文件
   - 项目特定规则：在子包的 `.eslintrc.js` 中覆盖

3. **添加新的 ESLint 配置**：
   - 在 `packages/eslint-config/configs/` 中创建新的配置文件
   - 更新 `packages/eslint-config/README.md` 文档

## 注意事项

- 确保每个子包的 `tsconfig.json` 中的 `project` 路径正确
- 在 `.eslintrc.js` 中设置正确的 `tsconfigRootDir`
- 新增 ESLint 插件时，需要在 `eslint-config` 包中添加依赖
- 使用 `workspace:*` 引用本地包，避免版本冲突
