# 开发指南

本文档提供了Monitor SDK monorepo项目的详细开发指南。

## 📁 项目结构

```
monorepo-eslint-config/
├── packages/                    # 核心包目录
│   ├── core/                   # 核心SDK包
│   │   ├── src/                # 源代码
│   │   ├── types/              # 类型定义
│   │   ├── tests/              # 测试文件
│   │   └── package.json        # 包配置
│   ├── web/                    # Web平台适配层
│   ├── react/                  # React平台适配层
│   ├── vue/                    # Vue平台适配层
│   ├── miniprogram/            # 小程序平台适配层（待实现）
│   └── eslint-config/          # ESLint配置包
├── dev/                        # 开发工具包
│   └── rollup/                 # Rollup打包配置
├── examples/                   # 示例项目
│   ├── web-example/            # Web示例
│   ├── react-example/          # React示例（待实现）
│   └── vue-example/            # Vue示例（待实现）
├── .github/workflows/          # CI/CD配置
├── docs/                       # 文档（待实现）
└── README.md                   # 项目说明
```

## 🔧 开发环境设置

### 必需工具
- Node.js >= 16.0.0
- pnpm >= 8.0.0
- Git

### 初始化项目
```bash
# 克隆项目
git clone <repository-url>
cd monorepo-eslint-config

# 安装依赖
pnpm install

# 验证安装
pnpm lint
pnpm type-check
```

## 📦 包开发

### 创建新包
1. 在`packages/`目录下创建新包目录
2. 创建`package.json`文件
3. 添加到`pnpm-workspace.yaml`
4. 配置ESLint和TypeScript
5. 添加构建配置

### 包依赖管理
```bash
# 为特定包添加依赖
pnpm add <package> --filter @monitor-sdk/core

# 添加开发依赖
pnpm add -D <package> --filter @monitor-sdk/core

# 添加workspace依赖
pnpm add @monitor-sdk/core --filter @monitor-sdk/web
```

### 构建和测试
```bash
# 构建单个包
cd packages/core
pnpm build

# 测试单个包
cd packages/core
pnpm test

# 检查单个包
cd packages/core
pnpm lint
pnpm type-check
```

## 🎯 代码规范

### ESLint配置
项目使用统一的ESLint配置：
- `@monitor-sdk/eslint-config` - 基础配置
- `@monitor-sdk/eslint-config/typescript` - TypeScript项目
- `@monitor-sdk/eslint-config/react` - React项目
- `@monitor-sdk/eslint-config/vue` - Vue项目
- `@monitor-sdk/eslint-config/node` - Node.js项目

### 提交规范
使用Conventional Commits规范：
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### Git Hooks
项目配置了以下Git hooks：
- `pre-commit`: 运行lint-staged和类型检查
- `commit-msg`: 验证提交消息格式

## 🏗️ 构建系统

### Rollup配置
使用`@monitor-sdk/rollup-config`包提供统一的构建配置：

```javascript
// rollup.config.js
import { presets } from '@monitor-sdk/rollup-config';

export default presets.core(); // 或 web(), react(), vue()
```

### 支持的输出格式
- **ESM**: `dist/index.js` - ES模块格式
- **CJS**: `dist/index.cjs` - CommonJS格式
- **IIFE**: `dist/index.iife.js` - 立即执行函数格式
- **Types**: `dist/index.d.ts` - TypeScript类型声明

## 🧪 测试

### 测试框架
- **Vitest**: 单元测试和集成测试
- **jsdom**: 浏览器环境模拟

### 测试命令
```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 监听模式运行测试
pnpm test --watch
```

### 测试文件组织
```
packages/core/
├── src/
│   └── utils/
│       └── index.ts
└── tests/
    └── utils.test.ts
```

## 🚀 发布流程

### 版本管理
使用Changesets进行版本管理：

```bash
# 添加变更集
pnpm changeset

# 版本升级
pnpm version-packages

# 发布
pnpm release
```

### CI/CD流程
1. **代码检查**: ESLint、TypeScript类型检查
2. **测试**: 单元测试、集成测试
3. **构建**: 所有包的构建验证
4. **发布**: 自动发布到NPM（仅main分支）

## 🔍 调试

### 开发模式
```bash
# 启动开发模式（监听文件变化）
pnpm dev

# 在特定包中启动开发模式
cd packages/core
pnpm dev
```

### 调试技巧
1. 使用`console.log`进行调试（在开发环境中允许）
2. 使用浏览器开发者工具
3. 使用VS Code调试器
4. 查看构建产物验证输出

## 📚 最佳实践

### 代码组织
1. 保持包的职责单一
2. 合理使用TypeScript类型
3. 编写清晰的注释和文档
4. 遵循统一的命名约定

### 性能考虑
1. 避免不必要的依赖
2. 使用Tree Shaking友好的导出
3. 合理使用懒加载
4. 监控包大小

### 兼容性
1. 支持现代浏览器
2. 提供合适的polyfill
3. 考虑不同环境的差异
4. 保持API的向后兼容性

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支
3. 进行开发和测试
4. 提交Pull Request
5. 等待代码审查

## 📞 获取帮助

如果遇到问题，可以：
1. 查看项目文档
2. 搜索已有的Issues
3. 创建新的Issue
4. 联系项目维护者
