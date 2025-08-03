module.exports = {
  extends: ['@monorepo/eslint-config/configs/base'],
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // 为了测试目的，我们可能需要允许一些通常不推荐的做法
    // 但保持大部分规则启用以展示 ESLint 的检查能力
    
    // 允许 console.log 用于演示
    'no-console': 'off',
    
    // 允许未使用的变量（用于演示目的）
    'no-unused-vars': 'warn',
    
    // 允许 var 声明（用于演示对比）
    'no-var': 'warn',
    
    // 允许 == 比较（用于演示）
    'eqeqeq': 'warn',
  },
  overrides: [
    {
      // 对于专门测试错误用法的文件，放宽一些规则
      files: ['**/bad-examples/**/*.js', '**/anti-patterns/**/*.js'],
      rules: {
        'no-unused-vars': 'off',
        'no-var': 'off',
        'prefer-const': 'off',
        'eqeqeq': 'off',
        'no-undef': 'off',
        'no-redeclare': 'off',
        'no-unreachable': 'off',
      },
    },
    {
      // CommonJS 文件
      files: ['**/*.cjs'],
      env: {
        commonjs: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
