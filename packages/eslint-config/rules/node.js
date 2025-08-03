/**
 * Node.js 相关规则
 * 包含 Node.js 环境下的最佳实践和规则
 */
module.exports = {
  rules: {
    // Node.js 特定规则
    'node/no-unsupported-features/es-syntax': 'off', // 使用 TypeScript 编译
    'node/no-missing-import': 'off', // TypeScript 处理这个
    'node/no-missing-require': 'off', // TypeScript 处理这个
    'node/no-unpublished-import': 'off', // 在 monorepo 中可能需要
    'node/no-unpublished-require': 'off', // 在 monorepo 中可能需要
    'node/shebang': 'off', // 不是所有 Node.js 文件都需要 shebang
    
    // 推荐的 Node.js 规则
    'node/no-deprecated-api': 'error',
    'node/no-extraneous-import': 'error',
    'node/no-extraneous-require': 'error',
    'node/process-exit-as-throw': 'error',
    'node/no-process-exit': 'warn',
    
    // 全局对象偏好
    'node/prefer-global/buffer': 'error',
    'node/prefer-global/console': 'error',
    'node/prefer-global/process': 'error',
    'node/prefer-global/url-search-params': 'error',
    'node/prefer-global/url': 'error',
    
    // Promise API 偏好
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
    
    // 文件扩展名
    'node/file-extension-in-import': 'off', // TypeScript 处理
    
    // 回调函数
    'node/callback-return': 'error',
    'node/handle-callback-err': 'error',
    'node/no-callback-literal': 'error',
    'node/no-sync': 'warn', // 警告同步方法的使用
    
    // 路径
    'node/no-path-concat': 'error',
    
    // 禁用浏览器相关的规则
    'no-console': 'off', // Node.js 中 console 是正常的
  },
};
