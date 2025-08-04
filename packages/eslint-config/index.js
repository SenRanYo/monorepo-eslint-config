/**
 * Monitor SDK ESLint 主配置文件
 * 提供统一的代码规范配置，适用于所有子包
 */

module.exports = {
  // 继承基础配置
  extends: [
    './base.js'
  ],
  
  // 环境配置
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  
  // 解析器选项
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  
  // 全局变量
  globals: {
    // 监控SDK相关全局变量
    __MONITOR_SDK_VERSION__: 'readonly',
    __MONITOR_SDK_ENV__: 'readonly'
  },
  
  // 规则配置
  rules: {
    // 项目特定规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // 监控SDK特定规则
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  
  // 忽略模式
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    '*.min.js',
    'coverage/'
  ]
};
