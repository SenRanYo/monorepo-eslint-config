/**
 * 导入/导出规则测试
 * 测试 eslint-plugin-import 相关规则
 */

// ✅ 良好实践：按照推荐顺序导入
// 1. Node.js 内置模块
import { readFileSync } from 'fs';
import { join } from 'path';

// 2. 第三方库
// import express from 'express'; // 如果安装了的话

// 3. 内部模块（按字母顺序）
import { identity } from '../advanced-features/generics';
import { User } from '../basic-types/object-types';
import { add } from '../basic-types/function-types';

// ✅ 良好实践：类型导入
import type { UserInterface } from './typescript-specific';

// ✅ 良好实践：命名导入
import { 
  explicitReturn,
  processData,
  handleElement,
} from './typescript-specific';

// ✅ 良好实践：默认导入
import DefaultExportClass from '../advanced-features/modules-namespaces';

// ✅ 良好实践：重命名导入
import { 
  add as addNumbers,
  multiply as multiplyNumbers,
} from '../basic-types/function-types';

// ✅ 良好实践：命名空间导入
import * as GeometryUtils from '../advanced-features/modules-namespaces';

// ❌ 错误：重复导入
// import { add } from '../basic-types/function-types'; // 已经导入过了

// ❌ 错误：未使用的导入
// import { unusedFunction } from './some-module'; // ESLint 会警告

// ✅ 良好实践：条件导入
async function conditionalImport(condition: boolean) {
  if (condition) {
    const { Container } = await import('../advanced-features/generics');
    return new Container<string>();
  }
  return null;
}

// ✅ 良好实践：动态导入
async function loadUtilities() {
  try {
    const utilities = await import('../basic-types/function-types');
    return utilities;
  } catch (error) {
    console.error('Failed to load utilities:', error);
    return null;
  }
}

// ✅ 良好实践：类型和值的分离导入
import type { Theme } from './typescript-specific';
import { Status } from './typescript-specific';

// ✅ 良好实践：导出函数
export function combineNumbers(a: number, b: number): number {
  return addNumbers(a, b);
}

// ✅ 良好实践：导出类型
export type CombinedUser = User & UserInterface;

// ✅ 良好实践：导出接口
export interface ImportExportConfig {
  enableDynamicImports: boolean;
  maxImportsPerFile: number;
  allowedExtensions: string[];
}

// ✅ 良好实践：导出常量
export const DEFAULT_CONFIG: ImportExportConfig = {
  enableDynamicImports: true,
  maxImportsPerFile: 50,
  allowedExtensions: ['.ts', '.tsx', '.js', '.jsx'],
};

// ✅ 良好实践：导出枚举
export enum ImportType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  CONDITIONAL = 'conditional',
}

// ✅ 良好实践：重新导出
export { identity, Container } from '../advanced-features/generics';
export type { User } from '../basic-types/object-types';

// ✅ 良好实践：重新导出并重命名
export { 
  explicitReturn as explicitReturnFunction,
  processData as processDataSafely,
} from './typescript-specific';

// ✅ 良好实践：命名空间重新导出
export * as TypeScriptRules from './typescript-specific';

// ✅ 良好实践：条件导出
const isDevelopment = process.env.NODE_ENV === 'development';

export const devTools = isDevelopment ? {
  log: console.log,
  debug: console.debug,
} : undefined;

// ✅ 良好实践：工厂函数导出
export function createUserProcessor(config: ImportExportConfig) {
  return {
    process(user: User): string {
      return `Processing user: ${user.name}`;
    },
    
    validate(user: User): boolean {
      return Boolean(user.name && user.email);
    },
    
    getConfig(): ImportExportConfig {
      return config;
    },
  };
}

// ✅ 良好实践：类导出
export class ImportManager {
  private imports: Map<string, any> = new Map();

  async loadModule(modulePath: string): Promise<any> {
    if (this.imports.has(modulePath)) {
      return this.imports.get(modulePath);
    }

    try {
      const module = await import(modulePath);
      this.imports.set(modulePath, module);
      return module;
    } catch (error) {
      console.error(`Failed to load module ${modulePath}:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.imports.clear();
  }

  getCachedModules(): string[] {
    return Array.from(this.imports.keys());
  }
}

// ✅ 良好实践：抽象类导出
export abstract class BaseImporter {
  abstract import(path: string): Promise<any>;
  
  protected validatePath(path: string): boolean {
    return path.length > 0 && !path.includes('..');
  }
}

// ✅ 良好实践：泛型类导出
export class TypedImporter<T> extends BaseImporter {
  async import(path: string): Promise<T> {
    if (!this.validatePath(path)) {
      throw new Error('Invalid import path');
    }

    const module = await import(path);
    return module.default || module;
  }
}

// ✅ 良好实践：函数重载导出
export function processImport(path: string): Promise<any>;
export function processImport(path: string, type: 'default'): Promise<any>;
export function processImport(path: string, type: 'named', name: string): Promise<any>;
export async function processImport(
  path: string, 
  type: 'default' | 'named' = 'default', 
  name?: string
): Promise<any> {
  const module = await import(path);
  
  switch (type) {
    case 'default':
      return module.default;
    case 'named':
      if (!name) {
        throw new Error('Name is required for named imports');
      }
      return module[name];
    default:
      return module;
  }
}

// ✅ 良好实践：默认导出
class ModuleLoader {
  private static instance: ModuleLoader;

  private constructor() {}

  static getInstance(): ModuleLoader {
    if (!ModuleLoader.instance) {
      ModuleLoader.instance = new ModuleLoader();
    }
    return ModuleLoader.instance;
  }

  async loadAndExecute(modulePath: string, functionName: string, ...args: any[]): Promise<any> {
    const module = await import(modulePath);
    const func = module[functionName];
    
    if (typeof func !== 'function') {
      throw new Error(`${functionName} is not a function in ${modulePath}`);
    }
    
    return func(...args);
  }
}

export default ModuleLoader;

// ✅ 良好实践：混合导出（默认 + 命名）
export const moduleVersion = '1.0.0';
export const supportedFormats = ['esm', 'cjs', 'umd'];

// ⚠️ 注意：避免循环依赖
// 这里只是示例，实际使用中要避免循环依赖

// ❌ 错误：导入未使用的模块
// import './side-effects-only'; // 如果只是为了副作用，应该明确注释

// ✅ 良好实践：副作用导入的正确方式
// import './polyfills'; // 明确表示这是为了副作用

// ✅ 良好实践：类型断言与导入
export function assertModuleType<T>(module: unknown): asserts module is T {
  if (!module || typeof module !== 'object') {
    throw new Error('Invalid module type');
  }
}

// ✅ 良好实践：模块元数据
export const moduleMetadata = {
  name: 'import-export-test',
  version: '1.0.0',
  dependencies: [
    '../advanced-features/generics',
    '../basic-types/object-types',
    '../basic-types/function-types',
    './typescript-specific',
  ],
  exports: [
    'combineNumbers',
    'CombinedUser',
    'ImportExportConfig',
    'DEFAULT_CONFIG',
    'ImportType',
    'createUserProcessor',
    'ImportManager',
    'BaseImporter',
    'TypedImporter',
    'processImport',
    'ModuleLoader',
  ],
} as const;
