/**
 * 联合类型和交叉类型测试
 * 测试复杂类型组合的使用
 */

// ✅ 良好实践：基础联合类型
type Status = 'loading' | 'success' | 'error';
type ID = string | number;

// ✅ 良好实践：联合类型的类型守卫
function handleStatus(status: Status): string {
  switch (status) {
    case 'loading':
      return 'Please wait...';
    case 'success':
      return 'Operation completed!';
    case 'error':
      return 'Something went wrong!';
    default:
      // TypeScript 确保所有情况都被处理
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

// ✅ 良好实践：判别联合类型
interface LoadingState {
  type: 'loading';
  message: string;
}

interface SuccessState {
  type: 'success';
  data: unknown;
}

interface ErrorState {
  type: 'error';
  error: string;
}

type AppState = LoadingState | SuccessState | ErrorState;

function renderState(state: AppState): string {
  switch (state.type) {
    case 'loading':
      return `Loading: ${state.message}`;
    case 'success':
      return `Success: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error}`;
    default:
      const exhaustiveCheck: never = state;
      return exhaustiveCheck;
  }
}

// ✅ 良好实践：交叉类型
interface Timestamped {
  timestamp: Date;
}

interface Versioned {
  version: number;
}

type TimestampedAndVersioned = Timestamped & Versioned;

const document: TimestampedAndVersioned = {
  timestamp: new Date(),
  version: 1,
};

// ✅ 良好实践：混合对象类型
interface User {
  id: number;
  name: string;
}

interface Admin {
  permissions: string[];
}

type AdminUser = User & Admin;

const adminUser: AdminUser = {
  id: 1,
  name: 'Admin',
  permissions: ['read', 'write', 'delete'],
};

// ✅ 良好实践：条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArray = string[];
type StringElement = ArrayElement<StringArray>; // string

// ✅ 良好实践：映射类型与联合类型
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  load: Event;
};

type EventNames = keyof EventMap; // 'click' | 'keydown' | 'load'

function addEventListener<K extends EventNames>(
  eventName: K,
  handler: (event: EventMap[K]) => void
): void {
  // 模拟事件监听
  console.log(`Added listener for ${eventName}`);
  // handler 的参数类型会根据 eventName 自动推断
}

// ✅ 良好实践：复杂的联合类型处理
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success) {
    return response.data; // TypeScript 知道这里有 data 属性
  } else {
    console.error(response.error); // TypeScript 知道这里有 error 属性
    return null;
  }
}

// ✅ 良好实践：类型谓词函数
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function processValue(value: string | number | boolean): string {
  if (isString(value)) {
    return value.toUpperCase(); // TypeScript 知道这里是 string
  }
  if (isNumber(value)) {
    return value.toString(); // TypeScript 知道这里是 number
  }
  return value ? 'true' : 'false'; // TypeScript 知道这里是 boolean
}

// ✅ 良好实践：可选属性与联合类型
interface BaseConfig {
  name: string;
  version: string;
}

interface DatabaseConfig extends BaseConfig {
  type: 'database';
  connectionString: string;
  maxConnections?: number;
}

interface ApiConfig extends BaseConfig {
  type: 'api';
  endpoint: string;
  timeout?: number;
}

type Config = DatabaseConfig | ApiConfig;

function validateConfig(config: Config): boolean {
  // 通用属性检查
  if (!config.name || !config.version) {
    return false;
  }

  // 特定类型检查
  switch (config.type) {
    case 'database':
      return Boolean(config.connectionString);
    case 'api':
      return Boolean(config.endpoint);
    default:
      const exhaustiveCheck: never = config;
      return false;
  }
}

// ✅ 良好实践：工具类型与联合类型
type PartialConfig = Partial<Config>; // 所有属性变为可选
type ConfigType = Config['type']; // 'database' | 'api'

// 提取特定类型的配置
type DatabaseConfigOnly = Extract<Config, { type: 'database' }>; // DatabaseConfig
type NonDatabaseConfig = Exclude<Config, { type: 'database' }>; // ApiConfig

// ✅ 良好实践：递归类型定义
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

function parseJSON(json: string): JSONValue {
  return JSON.parse(json) as JSONValue;
}

// ⚠️ 注意：复杂联合类型的性能考虑
type ComplexUnion = 
  | { a: string; b: number }
  | { a: number; c: boolean }
  | { a: boolean; d: string }
  | { a: object; e: number };

// 对于非常复杂的联合类型，考虑使用判别联合
type BetterComplexUnion = 
  | { type: 'string'; a: string; b: number }
  | { type: 'number'; a: number; c: boolean }
  | { type: 'boolean'; a: boolean; d: string }
  | { type: 'object'; a: object; e: number };

export {
  Status,
  ID,
  handleStatus,
  AppState,
  renderState,
  AdminUser,
  addEventListener,
  handleApiResponse,
  isString,
  isNumber,
  processValue,
  validateConfig,
  parseJSON,
};
