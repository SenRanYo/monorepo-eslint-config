# @monitor-sdk/eslint-config

Monitor SDK 统一 ESLint 配置包，为 monorepo 中的所有子包提供一致的代码规范。

## 📦 安装

```bash
# 使用 pnpm
pnpm add -D @monitor-sdk/eslint-config eslint

# 使用 npm
npm install -D @monitor-sdk/eslint-config eslint

# 使用 yarn
yarn add -D @monitor-sdk/eslint-config eslint
```

## 🚀 使用方法

### 基础配置

在项目根目录创建 `.eslintrc.js` 文件：

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config']
};
```

### TypeScript 项目

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config/typescript']
};
```

### React 项目

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config/react']
};
```

### Vue 项目

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config/vue']
};
```

### Node.js 项目

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config/node']
};
```

## 📋 配置说明

### 可用配置

- `@monitor-sdk/eslint-config` - 基础配置，适用于所有项目
- `@monitor-sdk/eslint-config/base` - 纯 JavaScript 基础配置
- `@monitor-sdk/eslint-config/typescript` - TypeScript 项目配置
- `@monitor-sdk/eslint-config/react` - React 项目配置（包含 TypeScript）
- `@monitor-sdk/eslint-config/vue` - Vue 项目配置（包含 TypeScript）
- `@monitor-sdk/eslint-config/node` - Node.js 项目配置

### 包含的插件

- **基础配置**:
  - `eslint:recommended`
  - `eslint-config-prettier`
  - `eslint-plugin-import`
  - `eslint-plugin-prettier`

- **TypeScript 配置**:
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`

- **React 配置**:
  - `eslint-plugin-react`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-jsx-a11y`

- **Vue 配置**:
  - `eslint-plugin-vue`

## 🔧 自定义配置

你可以在项目中覆盖或扩展这些规则：

```javascript
export default {
  extends: ['@monitor-sdk/eslint-config/typescript'],
  rules: {
    // 自定义规则
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
```

## 📝 规则说明

### 代码质量规则

- 禁止未使用的变量和导入
- 强制使用严格相等 (`===`)
- 禁止使用 `eval()` 和类似的不安全方法
- 要求适当的错误处理

### 代码风格规则

- 使用 2 空格缩进
- 使用单引号
- 要求分号
- 对象和数组的一致格式化

### TypeScript 特定规则

- 强制类型安全
- 优先使用现代 TypeScript 特性
- 一致的命名约定
- 类型导入优化

### React 特定规则

- React Hooks 规则
- JSX 可访问性检查
- 组件最佳实践
- 性能优化建议

### Vue 特定规则

- Vue 3 推荐规则
- 模板语法规范
- 组件命名约定
- Composition API 最佳实践

## 🤝 贡献

如果你发现规则配置有问题或需要改进，请提交 Issue 或 Pull Request。

## 📄 许可证

MIT
