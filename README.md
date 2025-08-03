# 前端监控SDK Monorepo

一个现代化的前端监控SDK项目，采用monorepo架构，支持多平台部署。

## 🏗️ 项目架构

```
monorepo-eslint-config/
├── packages/                    # 核心包目录
│   ├── core/                   # 核心SDK包
│   ├── web/                    # Web平台适配层
│   ├── react/                  # React平台适配层
│   ├── vue/                    # Vue平台适配层
│   ├── miniprogram/            # 小程序平台适配层
│   └── eslint-config/          # ESLint配置包
├── dev/                        # 开发工具包
│   └── rollup/                 # Rollup打包配置
├── examples/                   # 示例项目
└── docs/                       # 文档
```

## 🚀 特性

- 🎯 **多平台支持**: Web、React、Vue、小程序等多平台适配
- 📦 **模块化设计**: 核心功能与平台适配分离，按需加载
- 🔧 **统一工具链**: 统一的ESLint配置、构建工具、测试框架
- 📊 **完整监控**: 错误监控、性能监控、用户行为追踪
- 🔄 **自动化**: CI/CD、版本管理、自动发布
- 📝 **TypeScript**: 完整的类型支持

## 🛠️ 技术栈

- **包管理**: pnpm + workspace
- **构建工具**: Rollup + Vite
- **类型检查**: TypeScript 5.x
- **代码规范**: ESLint + Prettier
- **测试框架**: Vitest
- **版本管理**: Changesets
- **CI/CD**: GitHub Actions

## 📦 包说明

### 核心包
- `@monitor-sdk/core`: 监控SDK核心功能，提供基础的监控能力
- `@monitor-sdk/eslint-config`: 统一的ESLint配置规则

### 平台适配包
- `@monitor-sdk/web`: Web平台适配层，基于core包扩展
- `@monitor-sdk/react`: React应用监控，提供React特定的监控功能
- `@monitor-sdk/vue`: Vue应用监控，提供Vue特定的监控功能
- `@monitor-sdk/miniprogram`: 小程序监控适配

### 开发工具包
- `@monitor-sdk/rollup-config`: 统一的Rollup打包配置，支持ESM/CJS/IIFE格式

## 🚀 快速开始

### 安装依赖
```bash
# 安装pnpm（如果未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 开发命令
```bash
# 启动开发模式
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 清理构建产物
pnpm clean
```

### 项目状态
✅ **已完成的功能**:
- 基础项目结构和配置
- ESLint配置包（支持TypeScript、React、Vue、Node.js）
- 核心SDK包（基础监控功能和架构）
- Web平台适配层（浏览器环境监控）
- React适配层（React特定功能和Hooks）
- Vue适配层（Vue特定功能）
- Rollup构建配置包（支持ESM/CJS/IIFE格式）
- CI/CD工作流配置
- 示例项目

🔧 **需要进一步完善的功能**:
- 小程序适配层实现
- 完整的测试覆盖
- 文档网站
- 性能优化
- 更多示例项目

### 版本管理
```bash
# 添加变更集
pnpm changeset

# 版本升级
pnpm version-packages

# 发布包
pnpm release
```

## 📖 使用示例

### Web平台
```typescript
import { MonitorSDK } from '@monitor-sdk/web';

const monitor = new MonitorSDK({
  appId: 'your-app-id',
  apiKey: 'your-api-key',
  enableErrorTracking: true,
  enablePerformanceTracking: true
});

monitor.init();
```

### React应用
```typescript
import { ReactMonitorSDK } from '@monitor-sdk/react';

const monitor = new ReactMonitorSDK({
  appId: 'your-app-id',
  apiKey: 'your-api-key'
});

// 在React应用中使用
function App() {
  useEffect(() => {
    monitor.init();
  }, []);
  
  return <div>Your App</div>;
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
