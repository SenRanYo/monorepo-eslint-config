/**
 * Node.js ESLint 配置
 * 专门针对Node.js项目的规则配置
 */

module.exports = {
  extends: [
    './typescript.cjs'
  ],
  
  env: {
    node: true,
    es2022: true
  },
  
  rules: {
    // Node.js特定规则
    'no-process-exit': 'error',
    'no-process-env': 'off', // 在Node.js中使用环境变量是常见的
    'no-sync': 'warn', // 避免同步方法，但不是错误
    
    // 模块相关
    'global-require': 'error',
    'no-mixed-requires': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',
    
    // 安全相关
    'no-buffer-constructor': 'error',
    
    // 性能相关
    'prefer-const': 'error',
    'no-var': 'error',
    
    // 错误处理
    'handle-callback-err': 'error',
    'no-throw-literal': 'error',
    
    // 代码风格
    'callback-return': 'warn',
    'no-console': 'off' // Node.js中console是常用的
  },
  
  overrides: [
    {
      // 配置文件
      files: ['**/*.config.js', '**/*.config.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      // 脚本文件
      files: ['scripts/**/*', 'bin/**/*'],
      rules: {
        'no-console': 'off',
        'no-process-exit': 'off'
      }
    }
  ]
};
