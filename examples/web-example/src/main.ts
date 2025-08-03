/**
 * Web监控SDK使用示例
 */

import { WebSDK } from '@monitor-sdk/web';

// 创建SDK实例
const monitor = new WebSDK();

// 初始化配置
monitor.init({
  appId: 'web-example-app',
  apiKey: 'your-api-key-here',
  endpoint: 'https://api.monitor-sdk.com/v1/events',
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableUserTracking: true,
  debug: true,
  tags: {
    version: '1.0.0',
    environment: 'development'
  },
  user: {
    id: 'user-123',
    username: 'demo-user',
    email: 'demo@example.com'
  }
});

// 设置页面内容
document.body.innerHTML = `
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>Monitor SDK Web Example</h1>
    <p>这是一个Web监控SDK的使用示例</p>
    
    <div style="margin: 20px 0;">
      <button id="error-btn">触发错误</button>
      <button id="performance-btn">记录性能指标</button>
      <button id="user-action-btn">记录用户行为</button>
      <button id="custom-error-btn">自定义错误</button>
    </div>
    
    <div id="log" style="background: #f5f5f5; padding: 10px; margin-top: 20px; height: 200px; overflow-y: auto;">
      <h3>日志输出:</h3>
    </div>
  </div>
`;

// 日志输出函数
function log(message: string) {
  const logDiv = document.getElementById('log');
  if (logDiv) {
    const time = new Date().toLocaleTimeString();
    logDiv.innerHTML += `<div>[${time}] ${message}</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
}

// 绑定事件处理器
document.getElementById('error-btn')?.addEventListener('click', () => {
  try {
    // 故意触发错误
    throw new Error('这是一个测试错误');
  } catch (error) {
    log('触发了JavaScript错误');
  }
});

document.getElementById('performance-btn')?.addEventListener('click', () => {
  const startTime = performance.now();
  
  // 模拟一些工作
  setTimeout(() => {
    const duration = performance.now() - startTime;
    monitor.capturePerformance('custom_operation', duration, 'custom' as any);
    log(`记录了性能指标: custom_operation = ${duration.toFixed(2)}ms`);
  }, Math.random() * 100 + 50);
});

document.getElementById('user-action-btn')?.addEventListener('click', () => {
  monitor.captureUserAction('click' as any, '用户点击了记录按钮', {
    buttonId: 'user-action-btn',
    timestamp: Date.now()
  });
  log('记录了用户行为: 点击记录按钮');
});

document.getElementById('custom-error-btn')?.addEventListener('click', () => {
  monitor.captureError('这是一个自定义错误消息', {
    customData: {
      userId: 'user-123',
      action: 'button-click',
      context: 'example-page'
    }
  });
  log('记录了自定义错误');
});

// 监听SDK事件
monitor.on('initialized', () => {
  log('✅ Monitor SDK 初始化完成');
});

monitor.on('beforeSend', (eventData) => {
  log(`📤 准备发送事件: ${eventData.type}`);
});

monitor.on('afterSend', (eventData) => {
  log(`✅ 事件发送完成: ${eventData.type}`);
});

monitor.on('sendError', ({ error, eventData }) => {
  log(`❌ 事件发送失败: ${eventData.type} - ${error.message}`);
});

// 页面加载完成后的初始日志
window.addEventListener('load', () => {
  log('🚀 页面加载完成，监控SDK已启动');
});
