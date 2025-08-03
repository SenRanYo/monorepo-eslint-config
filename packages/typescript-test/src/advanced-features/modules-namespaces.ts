/**
 * 模块和命名空间测试
 * 测试 ES6 模块、命名空间和模块解析相关的 ESLint 规则
 */

// ✅ 良好实践：命名空间的使用
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }

  export interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
  }

  export function distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  export function area(rect: Rectangle): number {
    const width = rect.bottomRight.x - rect.topLeft.x;
    const height = rect.bottomRight.y - rect.topLeft.y;
    return width * height;
  }

  // 嵌套命名空间
  export namespace Utils {
    export function midpoint(p1: Point, p2: Point): Point {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    }

    export function translate(point: Point, dx: number, dy: number): Point {
      return {
        x: point.x + dx,
        y: point.y + dy,
      };
    }
  }
}

// ✅ 良好实践：使用命名空间
const point1: Geometry.Point = { x: 0, y: 0 };
const point2: Geometry.Point = { x: 3, y: 4 };
const dist = Geometry.distance(point1, point2);
const midpoint = Geometry.Utils.midpoint(point1, point2);

// ✅ 良好实践：模块声明
declare module 'external-library' {
  export interface Config {
    apiKey: string;
    timeout: number;
  }

  export function initialize(config: Config): void;
  export function getData(): Promise<any>;
}

// ✅ 良好实践：全局声明
declare global {
  interface Window {
    myGlobalFunction: (data: any) => void;
    myGlobalVariable: string;
  }

  namespace NodeJS {
    interface ProcessEnv {
      CUSTOM_ENV_VAR: string;
    }
  }
}

// ✅ 良好实践：模块增强
declare module './basic-types/primitive-types' {
  export function additionalFunction(): string;
}

// ✅ 良好实践：条件模块导入
async function loadModule(condition: boolean) {
  if (condition) {
    const { identity } = await import('./generics');
    return identity;
  } else {
    const { add } = await import('../basic-types/function-types');
    return add;
  }
}

// ✅ 良好实践：重新导出
export { Geometry };
export type { Geometry as GeometryNamespace };

// 从其他模块重新导出
export { identity, Container } from './generics';
export type { User } from '../basic-types/object-types';

// ✅ 良好实践：默认导出与命名导出的组合
class DefaultExportClass {
  constructor(public name: string) {}

  greet(): string {
    return `Hello from ${this.name}`;
  }
}

export default DefaultExportClass;

export const namedExport = 'This is a named export';
export const anotherNamedExport = 42;

// ✅ 良好实践：类型导出
export type ModuleConfig = {
  name: string;
  version: string;
  dependencies: string[];
};

export interface ModuleInterface {
  initialize(): void;
  destroy(): void;
}

// ✅ 良好实践：常量导出
export const MODULE_VERSION = '1.0.0';
export const DEFAULT_TIMEOUT = 5000;

// ✅ 良好实践：枚举导出
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

// ✅ 良好实践：函数重载导出
export function processData(data: string): string;
export function processData(data: number): number;
export function processData(data: string | number): string | number {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return data * 2;
}

// ✅ 良好实践：工厂函数导出
export function createLogger(level: LogLevel) {
  return {
    log(message: string): void {
      console.log(`[${level.toUpperCase()}] ${message}`);
    },
    
    isEnabled(checkLevel: LogLevel): boolean {
      const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
      return levels.indexOf(checkLevel) >= levels.indexOf(level);
    },
  };
}

// ✅ 良好实践：单例模式导出
class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  set(key: string, value: any): void {
    this.config[key] = value;
  }

  get<T>(key: string, defaultValue?: T): T {
    return this.config[key] ?? defaultValue;
  }
}

export const configManager = ConfigManager.getInstance();

// ✅ 良好实践：模块内部类型
type InternalType = {
  id: string;
  data: unknown;
};

function internalFunction(item: InternalType): void {
  console.log(`Processing item ${item.id}`);
}

// 只导出需要的部分
export function publicFunction(id: string, data: unknown): void {
  internalFunction({ id, data });
}

// ✅ 良好实践：条件导出
const isDevelopment = process.env.NODE_ENV === 'development';

export const debugUtils = isDevelopment ? {
  log: console.log,
  warn: console.warn,
  error: console.error,
} : undefined;

// ✅ 良好实践：类型守卫导出
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ⚠️ 注意：避免循环依赖
// 这里只是示例，实际使用中要避免循环依赖

// ❌ 不推荐：使用 namespace 合并（现代 TypeScript 中不推荐）
namespace LegacyNamespace {
  export const value1 = 'first';
}

namespace LegacyNamespace {
  export const value2 = 'second';
}

// ✅ 更好的做法：使用模块
export const modernModule = {
  value1: 'first',
  value2: 'second',
};

// ✅ 良好实践：模块边界清晰
export {
  point1,
  point2,
  dist,
  midpoint,
  loadModule,
  DefaultExportClass,
};
