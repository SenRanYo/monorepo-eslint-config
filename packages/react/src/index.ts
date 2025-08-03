/**
 * Monitor SDK React 包入口文件
 * 导出React特定的功能
 */

// 导出React SDK
export { ReactSDK } from './ReactSDK.js';
export type { IReactConfig } from './ReactSDK.js';

// 导出React Hooks
export {
  useMonitor,
  useComponentPerformance,
  useErrorBoundary,
  useUserInteraction,
  usePageView,
  useAsyncTracking
} from './hooks/useMonitor.js';

// 导出错误边界组件
export { MonitorErrorBoundary, withErrorBoundary } from './components/ErrorBoundary.js';

// 重新导出Web SDK功能
export {
  type IWebConfig,
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
} from '@monitor-sdk/web';

// 创建默认实例
export const MonitorSDK = ReactSDK;

// 导出便捷方法
export function createReactSDK(): ReactSDK {
  return new ReactSDK();
}

// 版本信息
export const REACT_VERSION = '1.0.0';
