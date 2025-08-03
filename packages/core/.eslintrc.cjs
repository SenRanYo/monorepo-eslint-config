module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['@monitor-sdk/eslint-config/typescript'],
  env: {
    node: true,
    browser: true,
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  globals: {
    NodeJS: 'readonly'
  },
  rules: {
    // 基础规则
    'no-console': 'error',
    'no-unused-vars': 'off',
    'no-undef': 'off', // TypeScript处理这个
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
