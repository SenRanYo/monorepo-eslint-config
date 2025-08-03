# @monorepo/eslint-config

共享的 ESLint 配置包，为 monorepo 中的不同类型项目提供统一的代码规范。现在支持模块化规则组合，让你可以灵活地组合使用不同的规则集。

## 🚀 新特性：模块化规则

现在你可以按需组合不同的规则模块，而不是使用预定义的配置。这让配置更加灵活和可定制。

## 使用方式

### 1. 使用预设配置（推荐）

我们提供了几种常用的预设配置，开箱即用：

#### JavaScript 预设
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/javascript'],
};
```

#### TypeScript 预设
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/typescript'],
};
```

#### React 预设
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
};
```

#### Node.js 预设
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/node'],
};
```

### 2. 使用传统配置（向后兼容）

原有的配置方式仍然可用：

```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
};
```

### 3. 自定义组合规则模块

这是新功能的核心！你可以按需组合不同的规则模块：

```js
// .eslintrc.js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // 只使用你需要的规则模块
    ...rules.javascript.rules,
    ...rules.import.rules,
    ...rules.typescript.rules,

    // 覆盖特定规则
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'error',
  },
};
```

## 可用的规则模块

| 模块 | 描述 | 引用方式 |
|------|------|----------|
| `javascript` | 基础 JavaScript 规则 | `rules.javascript.rules` |
| `import` | Import/Export 规则 | `rules.import.rules` |
| `typescript` | TypeScript 规则 | `rules.typescript.rules` |
| `react` | React 组件规则 | `rules.react.rules` |
| `reactHooks` | React Hooks 规则 | `rules.reactHooks.rules` |
| `jsxA11y` | JSX 可访问性规则 | `rules.jsxA11y.rules` |
| `node` | Node.js 规则 | `rules.node.rules` |

## 安装

在 monorepo 根目录安装：

```bash
pnpm add -D @monorepo/eslint-config eslint
```

## 使用场景示例

### 场景 1：纯 TypeScript 库（无 React）
```js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  extends: ['@monorepo/eslint-config/presets/typescript'],
  // 或者自定义组合：
  // rules: {
  //   ...rules.javascript.rules,
  //   ...rules.import.rules,
  //   ...rules.typescript.rules,
  // }
};
```

### 场景 2：React 应用但不需要 A11y 检查
```js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks'],
  rules: {
    ...rules.javascript.rules,
    ...rules.import.rules,
    ...rules.typescript.rules,
    ...rules.react.rules,
    ...rules.reactHooks.rules,
    // 注意：没有包含 jsxA11y 规则
  },
};
```

### 场景 3：Node.js CLI 工具
```js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  env: { node: true, es2021: true },
  extends: ['@monorepo/eslint-config/presets/node'],
  rules: {
    // 允许 console.log 在 CLI 工具中
    'no-console': 'off',
  },
};
```

## 配置层次

```
javascript (基础 JS 规则)
  ↓
import (模块导入规则)
  ↓
typescript (TS 类型规则)
  ↓
react + reactHooks + jsxA11y (React 生态) 或 node (Node.js 环境)
```

## 迁移指南

### 从旧配置迁移

如果你之前使用：
```js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
};
```

现在可以改为：
```js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
};
```

或者使用模块化方式获得更多控制：
```js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  // ... 基础配置
  rules: {
    ...rules.javascript.rules,
    ...rules.typescript.rules,
    ...rules.react.rules,
    // 自定义覆盖
    'react/jsx-props-no-spreading': 'off',
  },
};
```
