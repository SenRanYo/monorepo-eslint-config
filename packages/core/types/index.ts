/**
 * Monitor SDK 核心类型定义
 * 定义监控SDK的基础接口和类型
 */

// 基础配置接口
export interface IMonitorConfig {
  /** 应用ID */
  appId: string;
  /** API密钥 */
  apiKey: string;
  /** 服务端点URL */
  endpoint?: string;
  /** 是否启用错误监控 */
  enableErrorTracking?: boolean;
  /** 是否启用性能监控 */
  enablePerformanceTracking?: boolean;
  /** 是否启用用户行为追踪 */
  enableUserTracking?: boolean;
  /** 采样率 (0-1) */
  sampleRate?: number;
  /** 调试模式 */
  debug?: boolean;
  /** 自定义标签 */
  tags?: Record<string, string>;
  /** 用户信息 */
  user?: IUserInfo;
}

// 用户信息接口
export interface IUserInfo {
  /** 用户ID */
  id?: string;
  /** 用户名 */
  username?: string;
  /** 邮箱 */
  email?: string;
  /** 自定义属性 */
  attributes?: Record<string, any>;
}

// 错误信息接口
export interface IErrorInfo {
  /** 错误消息 */
  message: string;
  /** 错误堆栈 */
  stack: string;
  /** 错误类型 */
  type: ErrorType;
  /** 发生时间 */
  timestamp: number;
  /** 错误级别 */
  level: ErrorLevel;
  /** 页面URL */
  url?: string;
  /** 用户代理 */
  userAgent?: string;
  /** 额外信息 */
  extra?: Record<string, any>;
}

// 性能信息接口
export interface IPerformanceInfo {
  /** 指标名称 */
  name: string;
  /** 指标值 */
  value: number;
  /** 指标类型 */
  type: PerformanceType;
  /** 发生时间 */
  timestamp: number;
  /** 页面URL */
  url?: string;
  /** 额外信息 */
  extra?: Record<string, any>;
}

// 用户行为信息接口
export interface IUserActionInfo {
  /** 行为类型 */
  type: UserActionType;
  /** 行为描述 */
  description: string;
  /** 发生时间 */
  timestamp: number;
  /** 页面URL */
  url?: string;
  /** 目标元素 */
  target?: string;
  /** 额外信息 */
  extra?: Record<string, any>;
}

// 事件数据接口
export interface IEventData {
  /** 事件类型 */
  type: EventType;
  /** 事件数据 */
  data: IErrorInfo | IPerformanceInfo | IUserActionInfo;
  /** 会话ID */
  sessionId: string;
  /** 设备信息 */
  device: IDeviceInfo;
  /** 环境信息 */
  environment: IEnvironmentInfo;
}

// 设备信息接口
export interface IDeviceInfo {
  /** 设备类型 */
  type: DeviceType;
  /** 操作系统 */
  os: string;
  /** 浏览器 */
  browser: string;
  /** 屏幕分辨率 */
  screenResolution: string;
  /** 视口大小 */
  viewportSize: string;
}

// 环境信息接口
export interface IEnvironmentInfo {
  /** 环境类型 */
  type: EnvironmentType;
  /** SDK版本 */
  sdkVersion: string;
  /** 应用版本 */
  appVersion: string;
  /** 构建版本 */
  buildVersion: string;
}

// 插件接口
export interface IPlugin {
  /** 插件名称 */
  name: string;
  /** 插件版本 */
  version: string;
  /** 安装插件 */
  install(sdk: IMonitorSDK): void;
  /** 卸载插件 */
  uninstall?(): void;
}

// 监控SDK接口
export interface IMonitorSDK {
  /** 初始化SDK */
  init(config: IMonitorConfig): void;
  /** 捕获错误 */
  captureError(error: Error | string, extra?: Record<string, any>): void;
  /** 捕获性能指标 */
  capturePerformance(name: string, value: number, type: PerformanceType): void;
  /** 捕获用户行为 */
  captureUserAction(type: UserActionType, description: string, extra?: Record<string, any>): void;
  /** 设置用户信息 */
  setUser(user: IUserInfo): void;
  /** 设置标签 */
  setTag(key: string, value: string): void;
  /** 设置额外信息 */
  setExtra(key: string, value: any): void;
  /** 安装插件 */
  use(plugin: IPlugin): void;
  /** 销毁SDK */
  destroy(): void;
}

// 枚举类型定义
export enum ErrorType {
  JAVASCRIPT = 'javascript',
  PROMISE = 'promise',
  RESOURCE = 'resource',
  HTTP = 'http',
  CUSTOM = 'custom'
}

export enum ErrorLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum PerformanceType {
  NAVIGATION = 'navigation',
  RESOURCE = 'resource',
  PAINT = 'paint',
  LAYOUT_SHIFT = 'layout-shift',
  LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint',
  FIRST_INPUT_DELAY = 'first-input-delay',
  CUSTOM = 'custom'
}

export enum UserActionType {
  CLICK = 'click',
  INPUT = 'input',
  SCROLL = 'scroll',
  NAVIGATION = 'navigation',
  CUSTOM = 'custom'
}

export enum EventType {
  ERROR = 'error',
  PERFORMANCE = 'performance',
  USER_ACTION = 'user_action'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

export enum EnvironmentType {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}
