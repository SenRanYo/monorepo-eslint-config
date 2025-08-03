module.exports = {
  extends: ['@monorepo/eslint-config/configs/typescript'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 为了测试目的，我们可能需要允许一些通常不推荐的做法
    // 但保持大部分规则启用以展示 ESLint 的检查能力

    // 允许 console.log 用于演示
    'no-console': 'off',

    // 设置为错误以显示红色波浪线
    '@typescript-eslint/no-unused-vars': 'error',

    // 设置为错误以显示红色波浪线
    '@typescript-eslint/no-explicit-any': 'error',

    // 允许空函数（用于演示）
    '@typescript-eslint/no-empty-function': 'warn',
  },
  overrides: [
    {
      // 对于专门测试错误用法的文件，放宽一些规则
      files: ['**/bad-examples/**/*.ts', '**/anti-patterns/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'prefer-const': 'off',
        'no-var': 'off',
      },
    },
  ],
};
