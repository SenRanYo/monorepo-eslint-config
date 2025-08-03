/**
 * Web平台监控SDK
 * 继承核心SDK，提供Web浏览器环境特定的监控功能
 */

import {
  BaseSDK,
  type IMonitorConfig,
  type IEventData,
  type IDeviceInfo,
  type IEnvironmentInfo,
  ErrorType,
  PerformanceType,
  UserActionType,
  DeviceType,
  EnvironmentType,
  VERSION as CORE_VERSION
} from '@monitor-sdk/core';

/**
 * Web SDK配置接口
 */
export interface IWebConfig extends IMonitorConfig {
  /** 是否自动捕获未处理的错误 */
  autoCapture?: boolean;
  /** 是否自动捕获Promise拒绝 */
  captureUnhandledRejections?: boolean;
  /** 是否自动捕获资源加载错误 */
  captureResourceErrors?: boolean;
  /** 是否自动收集性能指标 */
  autoCollectPerformance?: boolean;
  /** 是否自动追踪用户交互 */
  autoTrackUserActions?: boolean;
  /** 忽略的错误URL模式 */
  ignoreUrls?: RegExp[];
  /** 忽略的错误消息模式 */
  ignoreErrors?: RegExp[];
}

/**
 * Web监控SDK实现
 */
export class WebSDK extends BaseSDK {
  private webConfig: IWebConfig;
  private originalErrorHandler: OnErrorEventHandler | null = null;
  private originalUnhandledRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> = [];

  constructor() {
    super();
    this.webConfig = { appId: '', apiKey: '' };
  }

  /**
   * 初始化Web SDK
   * @param config Web配置选项
   */
  public init(config: IWebConfig): void {
    this.webConfig = {
      autoCapture: true,
      captureUnhandledRejections: true,
      captureResourceErrors: true,
      autoCollectPerformance: true,
      autoTrackUserActions: true,
      ignoreUrls: [],
      ignoreErrors: [],
      ...config
    };

    super.init(this.webConfig);
  }

  /**
   * 设置SDK
   */
  protected override setupSDK(): void {
    if (this.webConfig.autoCapture) {
      this.setupErrorCapture();
    }

    if (this.webConfig.autoCollectPerformance) {
      this.setupPerformanceCollection();
    }

    if (this.webConfig.autoTrackUserActions) {
      this.setupUserActionTracking();
    }

    // 收集初始页面性能数据
    this.collectInitialPerformance();
  }

  /**
   * 获取当前URL
   */
  protected override getCurrentUrl(): string {
    return window.location.href;
  }

  /**
   * 处理事件数据
   */
  protected override processEvent(eventData: IEventData): void {
    // 发射事件供插件处理
    this.safeEmit('beforeSend', eventData);

    // 发送到服务器
    this.sendToServer(eventData);

    // 发射发送完成事件
    this.safeEmit('afterSend', eventData);
  }

  /**
   * 获取用户代理
   */
  protected override getUserAgent(): string {
    return navigator.userAgent;
  }

  /**
   * 获取设备信息
   */
  protected override getDeviceInfo(): IDeviceInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    let deviceType = DeviceType.DESKTOP;

    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      deviceType = /ipad|tablet/i.test(userAgent) ? DeviceType.TABLET : DeviceType.MOBILE;
    }

    return {
      type: deviceType,
      os: this.getOS(),
      browser: this.getBrowser(),
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };
  }

  /**
   * 获取环境信息
   */
  protected override getEnvironmentInfo(): IEnvironmentInfo {
    return {
      type: this.getEnvironmentType(),
      sdkVersion: CORE_VERSION,
      appVersion: this.webConfig.tags?.version || 'unknown',
      buildVersion: this.webConfig.tags?.build || 'unknown'
    };
  }

  /**
   * 设置错误捕获
   */
  private setupErrorCapture(): void {
    // 捕获JavaScript错误
    this.originalErrorHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleError(error || new Error(String(message)), {
        source,
        lineno,
        colno,
        type: ErrorType.JAVASCRIPT
      });

      // 调用原始处理器
      if (this.originalErrorHandler) {
        return this.originalErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    };

    // 捕获未处理的Promise拒绝
    if (this.webConfig.captureUnhandledRejections) {
      this.originalUnhandledRejectionHandler = window.onunhandledrejection;
      window.onunhandledrejection = (event) => {
        this.handleError(new Error(String(event.reason)), {
          type: ErrorType.PROMISE,
          reason: event.reason
        });

        // 调用原始处理器
        if (this.originalUnhandledRejectionHandler) {
          this.originalUnhandledRejectionHandler(event);
        }
      };
    }

    // 捕获资源加载错误
    if (this.webConfig.captureResourceErrors) {
      const resourceErrorHandler = (event: Event) => {
        const target = event.target as HTMLElement;
        if (target && target.tagName) {
          this.handleError(new Error(`Resource loading failed: ${target.tagName}`), {
            type: ErrorType.RESOURCE,
            element: target.tagName,
            source: (target as any).src || (target as any).href
          });
        }
      };

      window.addEventListener('error', resourceErrorHandler, true);
      this.eventListeners.push({
        element: window,
        event: 'error',
        handler: resourceErrorHandler
      });
    }
  }

  /**
   * 设置性能数据收集
   */
  private setupPerformanceCollection(): void {
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.handlePerformanceEntry(entry);
          });
        });

        // 观察各种性能指标
        this.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        console.warn('Failed to setup PerformanceObserver:', error);
      }
    }
  }

  /**
   * 设置用户行为追踪
   */
  private setupUserActionTracking(): void {
    // 点击事件
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      this.captureUserAction(UserActionType.CLICK, `Clicked ${target.tagName}`, {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100)
      });
    };

    document.addEventListener('click', clickHandler);
    this.eventListeners.push({
      element: document,
      event: 'click',
      handler: clickHandler as EventListener
    });

    // 页面导航
    const navigationHandler = () => {
      this.captureUserAction(UserActionType.NAVIGATION, `Navigated to ${window.location.pathname}`, {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      });
    };

    window.addEventListener('popstate', navigationHandler);
    this.eventListeners.push({
      element: window,
      event: 'popstate',
      handler: navigationHandler
    });
  }

  /**
   * 收集初始页面性能数据
   */
  private collectInitialPerformance(): void {
    // 等待页面加载完成后收集性能数据
    if (document.readyState === 'complete') {
      this.collectNavigationTiming();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectNavigationTiming(), 0);
      });
    }
  }

  /**
   * 收集导航时间数据
   */
  private collectNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      // 页面加载时间
      this.capturePerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart, PerformanceType.NAVIGATION);
      
      // DNS查询时间
      this.capturePerformance('dns_lookup_time', navigation.domainLookupEnd - navigation.domainLookupStart, PerformanceType.NAVIGATION);
      
      // TCP连接时间
      this.capturePerformance('tcp_connect_time', navigation.connectEnd - navigation.connectStart, PerformanceType.NAVIGATION);
      
      // 首字节时间
      this.capturePerformance('time_to_first_byte', navigation.responseStart - navigation.fetchStart, PerformanceType.NAVIGATION);
      
      // DOM解析时间
      this.capturePerformance('dom_parse_time', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, PerformanceType.NAVIGATION);
    }
  }

  /**
   * 处理性能条目
   */
  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'paint':
        this.capturePerformance(entry.name, entry.startTime, PerformanceType.PAINT);
        break;
      case 'largest-contentful-paint':
        this.capturePerformance('largest_contentful_paint', entry.startTime, PerformanceType.LARGEST_CONTENTFUL_PAINT);
        break;
      case 'first-input':
        const firstInput = entry as PerformanceEventTiming;
        this.capturePerformance('first_input_delay', firstInput.processingStart - firstInput.startTime, PerformanceType.FIRST_INPUT_DELAY);
        break;
      case 'layout-shift':
        const layoutShift = entry as any; // LayoutShift类型可能不可用
        if (!layoutShift.hadRecentInput) {
          this.capturePerformance('cumulative_layout_shift', layoutShift.value, PerformanceType.LAYOUT_SHIFT);
        }
        break;
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: Error, extra: Record<string, any> = {}): void {
    // 检查是否应该忽略此错误
    if (this.shouldIgnoreError(error, extra)) {
      return;
    }

    this.captureError(error, extra);
  }

  /**
   * 检查是否应该忽略错误
   */
  private shouldIgnoreError(error: Error, extra: Record<string, any>): boolean {
    const { ignoreUrls = [], ignoreErrors = [] } = this.webConfig;
    
    // 检查URL模式
    const currentUrl = this.getCurrentUrl();
    if (ignoreUrls.some(pattern => pattern.test(currentUrl))) {
      return true;
    }

    // 检查错误消息模式
    if (ignoreErrors.some(pattern => pattern.test(error.message))) {
      return true;
    }

    // 检查来源URL
    if (extra.source && ignoreUrls.some(pattern => pattern.test(extra.source))) {
      return true;
    }

    return false;
  }

  /**
   * 发送数据到服务器
   */
  private async sendToServer(eventData: IEventData): Promise<void> {
    try {
      const response = await fetch(this.webConfig.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webConfig.apiKey}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (this.webConfig.debug) {
        console.log('Event sent successfully:', eventData);
      }
    } catch (error) {
      console.error('Failed to send event:', error);
      this.safeEmit('sendError', { error, eventData });
    }
  }

  /**
   * 获取操作系统
   */
  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  /**
   * 获取浏览器
   */
  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  /**
   * 获取环境类型
   */
  private getEnvironmentType(): EnvironmentType {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('dev')) {
      return EnvironmentType.DEVELOPMENT;
    }
    if (hostname.includes('staging') || hostname.includes('test')) {
      return EnvironmentType.STAGING;
    }
    return EnvironmentType.PRODUCTION;
  }

  /**
   * 销毁SDK
   */
  public override destroy(): void {
    // 恢复原始错误处理器
    if (this.originalErrorHandler) {
      window.onerror = this.originalErrorHandler;
    }

    if (this.originalUnhandledRejectionHandler) {
      window.onunhandledrejection = this.originalUnhandledRejectionHandler;
    }

    // 断开性能观察器
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    // 移除事件监听器
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    super.destroy();
  }
}
