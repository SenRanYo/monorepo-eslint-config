# JavaScript ESLint Testing Package

这个包包含了全面的 JavaScript ESLint 规则测试示例，用于验证和演示各种 ESLint 规则在纯 JavaScript 环境中的效果。

## 目录结构

```
src/
├── basic-syntax/          # 基础语法测试
├── es6-features/          # ES6+ 特性测试
├── async-programming/     # 异步编程测试
├── modules/              # 模块系统测试
├── code-quality/         # 代码质量测试
├── good-examples/        # 良好实践示例
├── bad-examples/         # 不良实践示例（用于对比）
└── index.js             # 主入口文件
```

## 使用方法

### 运行 ESLint 检查
```bash
pnpm lint
```

### 生成 ESLint 报告
```bash
pnpm lint:report
```
这会生成一个 HTML 格式的详细报告。

### 修复可自动修复的问题
```bash
pnpm lint:fix
```

## 测试内容

### 1. 基础语法测试 (`basic-syntax/`)
- 变量声明 (var, let, const)
- 函数定义和调用
- 对象和数组操作
- 条件语句和循环
- 作用域和提升

### 2. ES6+ 特性测试 (`es6-features/`)
- 箭头函数
- 模板字符串
- 解构赋值
- 展开运算符
- 类和继承
- Symbol 和 Iterator

### 3. 异步编程测试 (`async-programming/`)
- Promise 使用
- async/await 语法
- 错误处理
- 并发控制

### 4. 模块系统测试 (`modules/`)
- ES6 模块 (import/export)
- CommonJS (require/module.exports)
- 动态导入
- 模块解析

### 5. 代码质量测试 (`code-quality/`)
- 最佳实践
- 性能优化
- 安全性考虑
- 可维护性

### 6. 对比示例
- `good-examples/`: 推荐的写法
- `bad-examples/`: 不推荐的写法（ESLint 会报错）

## 特性

- **现代 JavaScript**: 使用 ES2022 语法和特性
- **模块化**: 支持 ES6 模块和 CommonJS
- **全面覆盖**: 涵盖 JavaScript 的各个方面
- **实用示例**: 真实场景中的代码模式

## 注意事项

- `bad-examples/` 目录中的文件故意包含不良实践，用于演示 ESLint 规则的检查效果
- 某些规则在测试文件中被放宽，以便展示不同的用法场景
- 运行 `pnpm lint` 时会看到各种警告和错误，这是预期的行为
- 支持多种模块格式：`.js` (ES6 模块)、`.mjs` (ES6 模块)、`.cjs` (CommonJS)
