/**
 * Vue监控SDK
 * 继承Web SDK，提供Vue特定的监控功能
 */

import { WebSDK, type IWebConfig } from '@monitor-sdk/web';
import { ErrorType, UserActionType } from '@monitor-sdk/core';
import type { App } from 'vue';

/**
 * Vue SDK配置接口
 */
export interface IVueConfig extends IWebConfig {
  /** 是否捕获Vue错误 */
  captureVueErrors?: boolean;
  /** 是否追踪组件渲染性能 */
  trackComponentPerformance?: boolean;
  /** 是否追踪路由变化 */
  trackRouteChanges?: boolean;
  /** 组件性能追踪的阈值（毫秒） */
  performanceThreshold?: number;
}

/**
 * Vue监控SDK实现
 */
export class VueSDK extends WebSDK {
  private vueConfig: IVueConfig;
  private vueApp: App | null = null;
  private componentRenderTimes: Map<string, number> = new Map();

  constructor() {
    super();
    this.vueConfig = {};
  }

  /**
   * 初始化Vue SDK
   * @param config Vue配置选项
   */
  public init(config: IVueConfig): void {
    this.vueConfig = {
      captureVueErrors: true,
      trackComponentPerformance: true,
      trackRouteChanges: true,
      performanceThreshold: 16, // 16ms (60fps)
      ...config
    };

    super.init(this.vueConfig);
  }

  /**
   * 安装Vue插件
   * @param app Vue应用实例
   */
  public install(app: App): void {
    this.vueApp = app;

    if (this.vueConfig.captureVueErrors) {
      this.setupVueErrorHandler(app);
    }

    // 提供全局属性
    app.config.globalProperties.$monitor = this;
    app.provide('monitor', this);
  }

  /**
   * 设置SDK
   */
  protected setupSDK(): void {
    super.setupSDK();

    if (this.vueConfig.trackRouteChanges) {
      this.setupRouteTracking();
    }
  }

  /**
   * 捕获Vue错误
   * @param error 错误对象
   * @param instance Vue组件实例
   * @param info 错误信息
   */
  public captureVueError(error: Error, instance: any, info: string): void {
    const componentName = instance?.$options?.name || instance?.$options?._componentTag || 'Unknown';
    
    this.captureError(error, {
      type: ErrorType.JAVASCRIPT,
      framework: 'Vue',
      component: componentName,
      errorInfo: info,
      vueVersion: this.getVueVersion()
    });
  }

  /**
   * 追踪组件渲染开始
   * @param componentName 组件名称
   */
  public trackComponentRenderStart(componentName: string): void {
    if (!this.vueConfig.trackComponentPerformance) {
      return;
    }

    this.componentRenderTimes.set(componentName, performance.now());
  }

  /**
   * 追踪组件渲染结束
   * @param componentName 组件名称
   */
  public trackComponentRenderEnd(componentName: string): void {
    if (!this.vueConfig.trackComponentPerformance) {
      return;
    }

    const startTime = this.componentRenderTimes.get(componentName);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.componentRenderTimes.delete(componentName);

      // 只记录超过阈值的渲染时间
      if (renderTime > (this.vueConfig.performanceThreshold || 16)) {
        this.capturePerformance(
          `vue_component_render_${componentName}`,
          renderTime,
          'custom' as any
        );
      }
    }
  }

  /**
   * 追踪路由变化
   * @param from 来源路由
   * @param to 目标路由
   */
  public trackRouteChange(from: string, to: string): void {
    this.captureUserAction(UserActionType.NAVIGATION, `Vue route changed from ${from} to ${to}`, {
      from,
      to,
      framework: 'Vue'
    });
  }

  /**
   * 设置Vue错误处理器
   */
  private setupVueErrorHandler(app: App): void {
    const originalErrorHandler = app.config.errorHandler;

    app.config.errorHandler = (error: any, instance: any, info: string) => {
      // 发送错误到监控系统
      this.captureVueError(error, instance, info);

      // 调用原始错误处理器
      if (originalErrorHandler) {
        originalErrorHandler(error, instance, info);
      } else {
        console.error('Vue Error:', error);
      }
    };
  }

  /**
   * 设置路由追踪
   */
  private setupRouteTracking(): void {
    // 监听浏览器历史变化
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      const result = originalPushState.apply(history, args);
      this.handleRouteChange();
      return result;
    };

    history.replaceState = (...args) => {
      const result = originalReplaceState.apply(history, args);
      this.handleRouteChange();
      return result;
    };

    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  /**
   * 处理路由变化
   */
  private handleRouteChange(): void {
    // 延迟执行以确保路由已经更新
    setTimeout(() => {
      this.captureUserAction(UserActionType.NAVIGATION, `Vue navigated to ${window.location.pathname}`, {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        framework: 'Vue'
      });
    }, 0);
  }

  /**
   * 获取Vue版本
   */
  private getVueVersion(): string {
    try {
      // Vue 3
      if (this.vueApp?.version) {
        return this.vueApp.version;
      }
      
      // 尝试从全局Vue获取版本
      if (typeof window !== 'undefined' && (window as any).Vue?.version) {
        return (window as any).Vue.version;
      }
      
      return 'Unknown';
    } catch {
      return 'Unknown';
    }
  }
}
