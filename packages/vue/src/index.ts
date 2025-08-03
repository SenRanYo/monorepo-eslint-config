/**
 * Monitor SDK Vue 包入口文件
 * 导出Vue特定的功能
 */

// 导出Vue SDK
export { VueSDK } from './VueSDK.js';
export type { IVueConfig } from './VueSDK.js';

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
export const MonitorSDK = VueSDK;

// 导出便捷方法
export function createVueSDK(): VueSDK {
  return new VueSDK();
}

// Vue插件安装方法
export function createVuePlugin(config: any) {
  const sdk = new VueSDK();
  
  return {
    install(app: any) {
      sdk.init(config);
      sdk.install(app);
    },
    sdk
  };
}

// 版本信息
export const VUE_VERSION = '1.0.0';
