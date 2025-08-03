/**
 * 自定义组合示例
 * 展示如何灵活组合不同的规则模块
 */
const javascriptRules = require('../rules/javascript');
const importRules = require('../rules/import');
const typescriptRules = require('../rules/typescript');
const reactRules = require('../rules/react');
// 注意：这里我们只引入了部分规则模块，没有包含 react-hooks 和 jsx-a11y

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
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
  plugins: [
    '@typescript-eslint',
    'import',
    'react',
  ],
  rules: {
    // 基础规则
    ...javascriptRules.rules,
    ...importRules.rules,
    
    // TypeScript 规则，但覆盖某些设置
    ...typescriptRules.rules,
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any
    
    // React 规则，但覆盖某些设置
    ...reactRules.rules,
    'react/jsx-props-no-spreading': 'error', // 禁止 props spreading
    
    // 自定义规则
    'no-console': 'error', // 比基础规则更严格
    'prefer-const': 'warn', // 比基础规则更宽松
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
