/**
 * 监控SDK基类
 * 提供监控SDK的核心功能和基础架构
 */

import type {
  IMonitorConfig,
  IMonitorSDK,
  IUserInfo,
  IPlugin,
  IErrorInfo,
  IPerformanceInfo,
  IUserActionInfo,
  PerformanceType,
  UserActionType,
  EventType,
  IEventData
} from '../../types/index.js';

import { EventEmitter } from './EventEmitter.js';
import { generateSessionId, getTimestamp, deepMerge } from '../utils/index.js';

/**
 * 默认配置
 */
const DEFAULT_CONFIG: Partial<IMonitorConfig> = {
  endpoint: 'https://api.monitor-sdk.com/v1/events',
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableUserTracking: true,
  sampleRate: 1.0,
  debug: false,
  tags: {},
  user: {}
};

/**
 * 监控SDK基类
 * 实现监控SDK的核心功能
 */
export abstract class BaseSDK extends EventEmitter implements IMonitorSDK {
  protected config: IMonitorConfig;
  protected sessionId: string;
  protected plugins: Map<string, IPlugin> = new Map();
  protected isInitialized = false;
  protected isDestroyed = false;

  constructor() {
    super();
    this.sessionId = generateSessionId();
    this.config = { appId: '', apiKey: '', ...DEFAULT_CONFIG };
  }

  /**
   * 初始化SDK
   * @param config 配置选项
   */
  public init(config: IMonitorConfig): void {
    if (this.isInitialized) {
      console.warn('Monitor SDK is already initialized');
      return;
    }

    if (this.isDestroyed) {
      throw new Error('Cannot initialize destroyed SDK instance');
    }

    // 合并配置
    this.config = deepMerge({}, DEFAULT_CONFIG, config);

    // 验证必需配置
    this.validateConfig();

    // 初始化SDK
    this.setupSDK();

    this.isInitialized = true;

    // 发射初始化完成事件
    this.safeEmit('initialized', { config: this.config });

    if (this.config.debug) {
      console.log('Monitor SDK initialized:', this.config);
    }
  }

  /**
   * 捕获错误
   * @param error 错误对象或消息
   * @param extra 额外信息
   */
  public captureError(error: Error | string, extra?: Record<string, any>): void {
    if (!this.isInitialized || this.isDestroyed) {
      return;
    }

    if (!this.config.enableErrorTracking) {
      return;
    }

    if (!this.shouldSample()) {
      return;
    }

    const errorInfo: IErrorInfo = this.createErrorInfo(error, extra);
    const eventData: IEventData = this.createEventData('error', errorInfo);

    this.processEvent(eventData);
  }

  /**
   * 捕获性能指标
   * @param name 指标名称
   * @param value 指标值
   * @param type 指标类型
   */
  public capturePerformance(name: string, value: number, type: PerformanceType): void {
    if (!this.isInitialized || this.isDestroyed) {
      return;
    }

    if (!this.config.enablePerformanceTracking) {
      return;
    }

    if (!this.shouldSample()) {
      return;
    }

    const performanceInfo: IPerformanceInfo = {
      name,
      value,
      type,
      timestamp: getTimestamp(),
      url: this.getCurrentUrl(),
      extra: {}
    };

    const eventData: IEventData = this.createEventData('performance', performanceInfo);
    this.processEvent(eventData);
  }

  /**
   * 捕获用户行为
   * @param type 行为类型
   * @param description 行为描述
   * @param extra 额外信息
   */
  public captureUserAction(
    type: UserActionType,
    description: string,
    extra?: Record<string, any>
  ): void {
    if (!this.isInitialized || this.isDestroyed) {
      return;
    }

    if (!this.config.enableUserTracking) {
      return;
    }

    if (!this.shouldSample()) {
      return;
    }

    const userActionInfo: IUserActionInfo = {
      type,
      description,
      timestamp: getTimestamp(),
      url: this.getCurrentUrl(),
      extra: extra || {}
    };

    const eventData: IEventData = this.createEventData('user_action', userActionInfo);
    this.processEvent(eventData);
  }

  /**
   * 设置用户信息
   * @param user 用户信息
   */
  public setUser(user: IUserInfo): void {
    this.config.user = deepMerge(this.config.user || {}, user);
    this.safeEmit('userUpdated', this.config.user);
  }

  /**
   * 设置标签
   * @param key 标签键
   * @param value 标签值
   */
  public setTag(key: string, value: string): void {
    if (!this.config.tags) {
      this.config.tags = {};
    }
    this.config.tags[key] = value;
    this.safeEmit('tagUpdated', { key, value });
  }

  /**
   * 设置额外信息
   * @param key 键
   * @param value 值
   */
  public setExtra(key: string, value: any): void {
    // 子类可以重写此方法来实现特定的额外信息存储
    this.safeEmit('extraUpdated', { key, value });
  }

  /**
   * 安装插件
   * @param plugin 插件实例
   */
  public use(plugin: IPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already installed`);
      return;
    }

    try {
      plugin.install(this);
      this.plugins.set(plugin.name, plugin);
      this.safeEmit('pluginInstalled', plugin);

      if (this.config.debug) {
        console.log(`Plugin "${plugin.name}" installed`);
      }
    } catch (error) {
      console.error(`Failed to install plugin "${plugin.name}":`, error);
    }
  }

  /**
   * 销毁SDK
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    // 卸载所有插件
    this.plugins.forEach(plugin => {
      try {
        plugin.uninstall?.();
      } catch (error) {
        console.error(`Failed to uninstall plugin "${plugin.name}":`, error);
      }
    });
    this.plugins.clear();

    // 清理事件监听器
    super.destroy();

    this.isDestroyed = true;
    this.isInitialized = false;

    if (this.config.debug) {
      console.log('Monitor SDK destroyed');
    }
  }

  // 抽象方法，由子类实现
  protected abstract setupSDK(): void;
  protected abstract getCurrentUrl(): string;
  protected abstract processEvent(eventData: IEventData): void;
  protected abstract getDeviceInfo(): IDeviceInfo;
  protected abstract getEnvironmentInfo(): IEnvironmentInfo;

  /**
   * 验证配置
   */
  private validateConfig(): void {
    if (!this.config.appId) {
      throw new Error('appId is required');
    }

    if (!this.config.apiKey) {
      throw new Error('apiKey is required');
    }

    if (this.config.sampleRate !== undefined) {
      if (this.config.sampleRate < 0 || this.config.sampleRate > 1) {
        throw new Error('sampleRate must be between 0 and 1');
      }
    }
  }

  /**
   * 创建错误信息
   */
  private createErrorInfo(error: Error | string, extra?: Record<string, any>): IErrorInfo {
    const errorInfo: IErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? (error.stack || '') : '',
      type: 'custom',
      timestamp: getTimestamp(),
      level: 'error',
      url: this.getCurrentUrl(),
      userAgent: this.getUserAgent(),
      extra: extra || {}
    };

    return errorInfo;
  }

  /**
   * 创建事件数据
   */
  private createEventData(
    type: 'error' | 'performance' | 'user_action',
    data: IErrorInfo | IPerformanceInfo | IUserActionInfo
  ): IEventData {
    return {
      type: type as EventType,
      data,
      sessionId: this.sessionId,
      device: this.getDeviceInfo(),
      environment: this.getEnvironmentInfo()
    };
  }

  /**
   * 判断是否应该采样
   */
  private shouldSample(): boolean {
    return Math.random() < (this.config.sampleRate || 1);
  }

  /**
   * 获取用户代理
   */
  protected getUserAgent(): string {
    return 'Unknown';
  }
}
