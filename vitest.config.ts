import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // 测试环境配置
    environment: 'jsdom',
    
    // 全局测试设置
    globals: true,
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    },
    
    // 测试文件匹配模式
    include: [
      'packages/*/src/**/*.{test,spec}.{js,ts}',
      'packages/*/tests/**/*.{test,spec}.{js,ts}',
      'dev/*/src/**/*.{test,spec}.{js,ts}'
    ],
    
    // 排除文件
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'examples/'
    ]
  },
  
  // 路径解析配置，与tsconfig.json保持一致
  resolve: {
    alias: {
      '@monitor-sdk/core': resolve(__dirname, 'packages/core/src'),
      '@monitor-sdk/web': resolve(__dirname, 'packages/web/src'),
      '@monitor-sdk/react': resolve(__dirname, 'packages/react/src'),
      '@monitor-sdk/vue': resolve(__dirname, 'packages/vue/src'),
      '@monitor-sdk/miniprogram': resolve(__dirname, 'packages/miniprogram/src'),
      '@monitor-sdk/rollup-config': resolve(__dirname, 'dev/rollup/src')
    }
  }
});
