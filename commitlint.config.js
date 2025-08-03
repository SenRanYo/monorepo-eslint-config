/**
 * Commitlint 配置
 * 使用 Conventional Commits 规范
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式化
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'chore',    // 构建过程或辅助工具的变动
        'ci',       // CI配置文件和脚本的变动
        'build',    // 构建系统或外部依赖的变动
        'revert'    // 回滚
      ]
    ],
    // 主题长度限制
    'subject-max-length': [2, 'always', 100],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题首字母小写
    'subject-case': [2, 'always', 'lower-case'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 类型小写
    'type-case': [2, 'always', 'lower-case'],
    // 范围小写
    'scope-case': [2, 'always', 'lower-case']
  }
};
