/**
 * React监控SDK
 * 继承Web SDK，提供React特定的监控功能
 */

import { WebSDK, type IWebConfig } from '@monitor-sdk/web';
import { ErrorType, UserActionType } from '@monitor-sdk/core';

/**
 * React SDK配置接口
 */
export interface IReactConfig extends IWebConfig {
  /** 是否捕获React错误边界 */
  captureErrorBoundaries?: boolean;
  /** 是否追踪组件渲染性能 */
  trackComponentPerformance?: boolean;
  /** 是否追踪路由变化 */
  trackRouteChanges?: boolean;
  /** 组件性能追踪的阈值（毫秒） */
  performanceThreshold?: number;
}

/**
 * React监控SDK实现
 */
export class ReactSDK extends WebSDK {
  private reactConfig: IReactConfig;
  private componentRenderTimes: Map<string, number> = new Map();

  constructor() {
    super();
    this.reactConfig = { appId: '', apiKey: '' };
  }

  /**
   * 初始化React SDK
   * @param config React配置选项
   */
  public init(config: IReactConfig): void {
    this.reactConfig = {
      captureErrorBoundaries: true,
      trackComponentPerformance: true,
      trackRouteChanges: true,
      performanceThreshold: 16, // 16ms (60fps)
      ...config
    };

    super.init(this.reactConfig);
  }

  /**
   * 设置SDK
   */
  protected setupSDK(): void {
    super.setupSDK();

    if (this.reactConfig.trackRouteChanges) {
      this.setupRouteTracking();
    }
  }

  /**
   * 捕获React错误边界错误
   * @param error 错误对象
   * @param errorInfo React错误信息
   */
  public captureReactError(error: Error, errorInfo: { componentStack: string }): void {
    this.captureError(error, {
      type: ErrorType.JAVASCRIPT,
      framework: 'React',
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
  }

  /**
   * 追踪组件渲染开始
   * @param componentName 组件名称
   */
  public trackComponentRenderStart(componentName: string): void {
    if (!this.reactConfig.trackComponentPerformance) {
      return;
    }

    this.componentRenderTimes.set(componentName, performance.now());
  }

  /**
   * 追踪组件渲染结束
   * @param componentName 组件名称
   */
  public trackComponentRenderEnd(componentName: string): void {
    if (!this.reactConfig.trackComponentPerformance) {
      return;
    }

    const startTime = this.componentRenderTimes.get(componentName);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.componentRenderTimes.delete(componentName);

      // 只记录超过阈值的渲染时间
      if (renderTime > (this.reactConfig.performanceThreshold || 16)) {
        this.capturePerformance(
          `component_render_${componentName}`,
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
    this.captureUserAction(UserActionType.NAVIGATION, `Route changed from ${from} to ${to}`, {
      from,
      to,
      framework: 'React'
    });
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
      this.captureUserAction(UserActionType.NAVIGATION, `Navigated to ${window.location.pathname}`, {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        framework: 'React'
      });
    }, 0);
  }
}
