/**
 * 函数类型测试
 * 测试各种函数定义方式和相关 ESLint 规则
 */

// ✅ 良好实践：函数声明
function add(a: number, b: number): number {
  return a + b;
}

// ✅ 良好实践：函数表达式
const multiply = function(a: number, b: number): number {
  return a * b;
};

// ✅ 良好实践：箭头函数
const divide = (a: number, b: number): number => a / b;

// ✅ 良好实践：可选参数
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hello'}, ${name}!`;
}

// ✅ 良好实践：默认参数
function createUser(name: string, age = 18, isActive = true): object {
  return { name, age, isActive };
}

// ✅ 良好实践：剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// ✅ 良好实践：函数重载
function processValue(value: string): string;
function processValue(value: number): number;
function processValue(value: boolean): boolean;
function processValue(value: string | number | boolean): string | number | boolean {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value * 2;
  }
  return !value;
}

// ✅ 良好实践：泛型函数
function identity<T>(arg: T): T {
  return arg;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ✅ 良好实践：约束泛型
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// ✅ 良好实践：异步函数
async function fetchData(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// ✅ 良好实践：Promise 返回类型
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ 良好实践：回调函数类型
type EventCallback<T> = (data: T) => void;

function addEventListener<T>(event: string, callback: EventCallback<T>): void {
  // 模拟事件监听器
  console.log(`Added listener for ${event}`);
  // 稍后调用回调
  setTimeout(() => {
    callback({} as T);
  }, 1000);
}

// ✅ 良好实践：高阶函数
function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

// ✅ 良好实践：函数作为参数
function applyOperation(
  numbers: number[],
  operation: (a: number, b: number) => number
): number {
  return numbers.reduce(operation);
}

// ✅ 良好实践：条件类型与函数
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type AddReturnType = ReturnTypeOf<typeof add>; // number

// ✅ 良好实践：this 类型
interface Counter {
  count: number;
  increment(this: Counter): void;
  decrement(this: Counter): void;
}

const counter: Counter = {
  count: 0,
  increment() {
    this.count++;
  },
  decrement() {
    this.count--;
  },
};

// ✅ 良好实践：函数类型别名
type BinaryOperation = (a: number, b: number) => number;
type UnaryOperation = (a: number) => number;
type Predicate<T> = (item: T) => boolean;

const operations: Record<string, BinaryOperation> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};

// ⚠️ 警告：函数参数过多
function tooManyParameters(
  a: string,
  b: number,
  c: boolean,
  d: object,
  e: string[],
  f: number,
  g: boolean
): void {
  // ESLint 可能会警告参数过多
  console.log(a, b, c, d, e, f, g);
}

// ✅ 更好的做法：使用对象参数
interface FunctionOptions {
  stringParam: string;
  numberParam: number;
  booleanParam: boolean;
  objectParam: object;
  arrayParam: string[];
  anotherNumber: number;
  anotherBoolean: boolean;
}

function betterFunction(options: FunctionOptions): void {
  const { stringParam, numberParam, booleanParam } = options;
  console.log(stringParam, numberParam, booleanParam);
}

// ❌ 错误：未使用的参数
function unusedParameter(used: string, unused: number): string {
  return used.toUpperCase();
  // ESLint 会警告 unused 参数未使用
}

// ✅ 修复：使用下划线前缀表示故意未使用
function intentionallyUnused(used: string, _unused: number): string {
  return used.toUpperCase();
}

export {
  add,
  multiply,
  greet,
  sum,
  processValue,
  identity,
  getProperty,
  fetchData,
  createMultiplier,
  applyOperation,
  counter,
  operations,
  betterFunction,
};
