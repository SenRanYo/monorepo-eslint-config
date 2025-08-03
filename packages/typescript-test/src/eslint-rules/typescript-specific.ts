/**
 * TypeScript 特定 ESLint 规则测试
 * 测试 @typescript-eslint 插件的各种规则
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

// ✅ 良好实践：明确的函数返回类型
function explicitReturn(x: number): number {
  return x * 2;
}

// ⚠️ 警告：缺少返回类型（根据配置可能会警告）
function implicitReturn(x: number) {
  return x * 2;
}

// ✅ 良好实践：避免使用 any
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return String(data);
}

// ❌ 错误：使用 any 类型
function badProcessData(data: any): any {
  return data.whatever.property;
}

// ✅ 良好实践：正确的类型断言
function handleElement(element: unknown): void {
  if (element instanceof HTMLElement) {
    element.click(); // 类型守卫后安全使用
  }
}

// ❌ 错误：不安全的类型断言
function unsafeAssertion(element: unknown): void {
  (element as HTMLElement).click(); // 可能运行时错误
}

// ✅ 良好实践：使用类型谓词
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// ✅ 良好实践：正确处理 Promise
async function correctPromiseHandling(): Promise<string> {
  try {
    const result = await fetch('/api/data');
    return await result.text();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ 错误：未处理的 Promise
function floatingPromise(): void {
  fetch('/api/data'); // ESLint 会警告未处理的 Promise
}

// ✅ 修复：明确处理 Promise
function handledPromise(): void {
  fetch('/api/data').catch(error => {
    console.error('Error:', error);
  });
}

// ✅ 良好实践：使用 nullish coalescing
function useNullishCoalescing(value: string | null | undefined): string {
  return value ?? 'default';
}

// ⚠️ 不推荐：使用 || 可能有意外行为
function useLogicalOr(value: string | null | undefined): string {
  return value || 'default'; // 空字符串也会被替换
}

// ✅ 良好实践：使用 optional chaining
interface User {
  profile?: {
    address?: {
      street?: string;
    };
  };
}

function getStreet(user: User): string | undefined {
  return user.profile?.address?.street;
}

// ❌ 错误：手动检查每一层
function manualChecking(user: User): string | undefined {
  if (user.profile && user.profile.address && user.profile.address.street) {
    return user.profile.address.street;
  }
  return undefined;
}

// ✅ 良好实践：避免不必要的类型断言
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // TypeScript 自动推断类型

// ❌ 错误：不必要的类型断言
const unnecessaryAssertion = numbers.map(n => n * 2) as number[];

// ✅ 良好实践：使用 const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const; // 字面量类型而不是 string 和 number

// ✅ 良好实践：正确的枚举使用
enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

function handleStatus(status: Status): string {
  switch (status) {
    case Status.PENDING:
      return 'Waiting for approval';
    case Status.APPROVED:
      return 'Request approved';
    case Status.REJECTED:
      return 'Request rejected';
    default:
      // 确保处理所有情况
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
  }
}

// ❌ 错误：数字枚举可能导致问题
enum BadEnum {
  FIRST, // 0
  SECOND, // 1
  THIRD, // 2
}

// ✅ 良好实践：接口而不是类型别名（对于对象形状）
interface UserInterface {
  id: number;
  name: string;
  email: string;
}

// ⚠️ 可以使用，但接口更好
type UserType = {
  id: number;
  name: string;
  email: string;
};

// ✅ 良好实践：类型别名用于联合类型
type Theme = 'light' | 'dark' | 'auto';
type EventHandler<T> = (event: T) => void;

// ✅ 良好实践：正确的泛型约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ❌ 错误：过于宽泛的泛型
function badGeneric<T>(obj: T, key: string): any {
  return (obj as any)[key];
}

// ✅ 良好实践：使用 unknown 而不是 any
function safeJsonParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ✅ 良好实践：正确的错误处理
class CustomError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'CustomError';
  }
}

function throwCustomError(): never {
  throw new CustomError('Something went wrong', 'ERR001', 500);
}

// ✅ 良好实践：使用 readonly 修饰符
interface ReadonlyConfig {
  readonly apiUrl: string;
  readonly features: readonly string[];
}

// ✅ 良好实践：正确的数组类型
const stringArray: string[] = ['a', 'b', 'c'];
const readonlyArray: readonly string[] = ['a', 'b', 'c'];
const tupleArray: [string, number, boolean] = ['test', 42, true];

// ❌ 错误：使用 Array<T> 语法（在某些配置中不推荐）
const arrayGeneric: Array<string> = ['a', 'b', 'c'];

// ✅ 良好实践：正确的索引签名
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // 可以有具体属性
}

// ✅ 良好实践：使用映射类型
type PartialUser = Partial<UserInterface>;
type RequiredUser = Required<UserInterface>;
type UserKeys = keyof UserInterface;

// ✅ 良好实践：条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// ✅ 良好实践：模板字面量类型
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // 'onClick'

// ✅ 良好实践：正确的类定义
class BaseClass {
  protected value: number;

  constructor(value: number) {
    this.value = value;
  }

  public getValue(): number {
    return this.value;
  }
}

class DerivedClass extends BaseClass {
  constructor(value: number, private multiplier: number) {
    super(value);
  }

  public override getValue(): number {
    return this.value * this.multiplier;
  }
}

// ✅ 良好实践：抽象类
abstract class Shape {
  abstract getArea(): number;
  
  protected displayInfo(): void {
    console.log(`Area: ${this.getArea()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

export {
  explicitReturn,
  processData,
  handleElement,
  isString,
  correctPromiseHandling,
  handledPromise,
  useNullishCoalescing,
  getStreet,
  Status,
  handleStatus,
  UserInterface,
  Theme,
  getProperty,
  safeJsonParse,
  CustomError,
  BaseClass,
  DerivedClass,
  Shape,
  Circle,
};
