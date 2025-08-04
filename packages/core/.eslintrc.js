module.exports = {
  root: true,
  extends: ['@monitor-sdk/eslint-config/typescript.js'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'rollup.config.js',
    'vitest.config.ts',
    'dist/',
    'node_modules/'
  ],
  rules: {
    // 核心包特定规则
    '@typescript-eslint/no-explicit-any': 'warn', // 允许在类型定义中使用any
    'no-console': 'error' // 测试规则 - 应该报错
  }
};
