# @monorepo/eslint-config

共享的 ESLint 配置包，为 monorepo 中的不同类型项目提供统一的代码规范。

## 可用配置

### 基础配置 (base)
适用于所有 JavaScript 项目的基础配置。

```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/base'],
};
```

### TypeScript 配置 (typescript)
适用于 TypeScript 项目，继承基础配置并添加 TypeScript 特定规则。

```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/typescript'],
};
```

### React 配置 (react)
适用于 React + TypeScript 项目，包含 React、React Hooks 和可访问性规则。

```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
};
```

### Node.js 配置 (node)
适用于 Node.js + TypeScript 项目，包含 Node.js 特定规则。

```js
// .eslintrc.js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/node'],
};
```

## 安装

在 monorepo 根目录安装：

```bash
pnpm add -D @monorepo/eslint-config eslint
```

## 使用方法

1. 在你的子包中创建 `.eslintrc.js` 文件
2. 根据项目类型选择合适的配置
3. 可以根据需要添加项目特定的规则

## 配置层次

```
base (基础规则)
  ↓
typescript (TypeScript 规则)
  ↓
react (React 规则) 或 node (Node.js 规则)
```

## 自定义规则

你可以在项目的 `.eslintrc.js` 中覆盖或添加规则：

```js
module.exports = {
  extends: ['@monorepo/eslint-config/configs/react'],
  rules: {
    // 你的自定义规则
    'no-console': 'off',
  },
};
```
