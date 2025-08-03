/**
 * Import 相关规则
 * 包含模块导入导出的规则和最佳实践
 */
module.exports = {
  rules: {
    // Import 排序和组织
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    
    // Import 质量规则
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',
    
    // Export 规则
    'import/no-default-export': 'off', // 允许默认导出
    'import/prefer-default-export': 'off', // 不强制默认导出
    'import/no-anonymous-default-export': 'warn',
    
    // 静态分析
    'import/no-dynamic-require': 'warn',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-deprecated': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          '**/test/**/*',
          '**/tests/**/*',
          '**/__tests__/**/*',
          '**/*.config.{js,ts}',
          '**/*.setup.{js,ts}',
          '**/vite.config.*',
          '**/vitest.config.*',
          '**/jest.config.*',
          '**/webpack.config.*',
          '**/rollup.config.*',
        ],
      },
    ],
    'import/no-mutable-exports': 'error',
    'import/no-unused-modules': 'off', // 可能在某些项目中有用，但默认关闭
    
    // ES6+ 模块规则
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-amd': 'error',
    'import/no-commonjs': 'off', // 允许 CommonJS，特别是在配置文件中
    'import/no-import-module-exports': 'error',
    'import/no-nodejs-modules': 'off', // 允许 Node.js 模块
    'import/unambiguous': 'off', // 不强制明确的模块类型
  },
};
