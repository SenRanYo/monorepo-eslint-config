/**
 * TypeScript ESLint 配置
 * 专门针对TypeScript项目的规则配置
 */

module.exports = {
  extends: [
    './base.js'
  ],

  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint'
  ],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },

  env: {
    node: true,
    browser: true,
    es2022: true
  },
  
  rules: {
    // 禁用与TypeScript冲突的规则
    'no-unused-vars': 'off',
    'no-undef': 'off', // TypeScript处理这个
    'no-redeclare': 'off',
    'no-use-before-define': 'off',

    // TypeScript特定规则
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // 基础规则
    'no-console': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },

  overrides: [
    {
      // 测试文件的特殊规则
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    }
  ]
};
