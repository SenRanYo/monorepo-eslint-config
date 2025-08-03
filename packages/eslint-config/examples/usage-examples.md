# ESLint 配置使用示例

本文档展示了如何使用新的模块化 ESLint 配置。

## 1. 使用预设配置（推荐）

### React 项目
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

### Node.js 项目
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

### 纯 TypeScript 库
```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/typescript'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
```

## 2. 自定义规则组合

### 基础组合：JavaScript + Import
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
    'eslint-config-prettier',
  ],
  plugins: ['import'],
  rules: {
    ...rules.javascript.rules,
    ...rules.import.rules,
  },
};
```

### TypeScript 项目（无 React）
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
    'plugin:@typescript-eslint/recommended',
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
    ...rules.javascript.rules,
    ...rules.import.rules,
    ...rules.typescript.rules,
  },
};
```

### React 项目（不包含 A11y 检查）
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
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks'],
  rules: {
    ...rules.javascript.rules,
    ...rules.import.rules,
    ...rules.typescript.rules,
    ...rules.react.rules,
    ...rules.reactHooks.rules,
    // 注意：没有包含 jsxA11y 规则
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

## 3. 规则覆盖示例

### 宽松的开发环境配置
```js
// .eslintrc.js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
  rules: {
    // 开发时允许 console
    'no-console': 'off',
    
    // 允许 any 类型
    '@typescript-eslint/no-explicit-any': 'off',
    
    // 允许 props spreading
    'react/jsx-props-no-spreading': 'off',
  },
};
```

### 严格的生产环境配置
```js
// .eslintrc.js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
  rules: {
    // 生产环境禁止 console
    'no-console': 'error',
    
    // 严格的 TypeScript 检查
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    
    // 严格的 React 规则
    'react/jsx-props-no-spreading': 'error',
  },
};
```

## 4. 可用的规则模块

| 模块名 | 描述 | 包含的规则类型 |
|--------|------|----------------|
| `javascript` | 基础 JavaScript 规则 | 代码质量、最佳实践、ES6+ 特性 |
| `import` | 模块导入规则 | import/export 语句、模块解析 |
| `typescript` | TypeScript 规则 | 类型检查、TS 特定语法 |
| `react` | React 组件规则 | JSX 语法、组件最佳实践 |
| `reactHooks` | React Hooks 规则 | Hooks 使用规范 |
| `jsxA11y` | 可访问性规则 | ARIA 属性、语义化标签 |
| `node` | Node.js 规则 | Node.js API、服务端最佳实践 |

## 5. 迁移指南

### 从旧配置迁移

**之前：**
```js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
};
```

**现在（推荐）：**
```js
module.exports = {
  extends: ['@monorepo/eslint-config/presets/react'],
};
```

**或者使用模块化方式：**
```js
const { rules } = require('@monorepo/eslint-config');

module.exports = {
  // ... 基础配置
  rules: {
    ...rules.javascript.rules,
    ...rules.typescript.rules,
    ...rules.react.rules,
    ...rules.reactHooks.rules,
    ...rules.jsxA11y.rules,
  },
};
```
