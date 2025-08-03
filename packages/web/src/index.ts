/**
 * Monitor SDK Web 包入口文件
 * 导出Web平台特定的功能
 */

// 导出Web SDK
export { WebSDK } from './WebSDK.js';
export type { IWebConfig } from './WebSDK.js';

// 重新导出核心功能
export {
  type IMonitorConfig,
  type IUserInfo,
  type IErrorInfo,
  type IPerformanceInfo,
  type IUserActionInfo,
  type IEventData,
  type IDeviceInfo,
  type IEnvironmentInfo,
  type IPlugin,
  type IMonitorSDK,
  ErrorType,
  ErrorLevel,
  PerformanceType,
  UserActionType,
  EventType,
  DeviceType,
  EnvironmentType,
  VERSION
} from '@monitor-sdk/core';

// 创建默认实例
export const MonitorSDK = WebSDK;

// 导出便捷方法
export function createWebSDK(): WebSDK {
  return new WebSDK();
}

// 版本信息
export const WEB_VERSION = '1.0.0';
