# TypeScript ESLint Testing Package

这个包包含了全面的 TypeScript ESLint 规则测试示例，用于验证和演示各种 ESLint 规则的效果。

## 目录结构

```
src/
├── basic-types/           # 基础类型测试
├── advanced-features/     # 高级特性测试
├── eslint-rules/         # ESLint 规则测试
├── code-quality/         # 代码质量测试
├── good-examples/        # 良好实践示例
├── bad-examples/         # 不良实践示例（用于对比）
└── index.ts             # 主入口文件
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

### 1. 基础类型测试 (`basic-types/`)
- 原始类型使用
- 对象和数组类型
- 函数类型
- 联合类型和交叉类型
- 字面量类型

### 2. 高级特性测试 (`advanced-features/`)
- 泛型
- 装饰器
- 模块系统
- 命名空间
- 映射类型
- 条件类型

### 3. ESLint 规则测试 (`eslint-rules/`)
- TypeScript 特定规则
- 导入/导出规则
- 代码风格规则
- 最佳实践规则

### 4. 代码质量测试 (`code-quality/`)
- 错误处理
- 异步代码
- 性能相关
- 安全相关

### 5. 对比示例
- `good-examples/`: 推荐的写法
- `bad-examples/`: 不推荐的写法（ESLint 会报错）

## 注意事项

- `bad-examples/` 目录中的文件故意包含不良实践，用于演示 ESLint 规则的检查效果
- 某些规则在测试文件中被放宽，以便展示不同的用法场景
- 运行 `pnpm lint` 时会看到各种警告和错误，这是预期的行为
