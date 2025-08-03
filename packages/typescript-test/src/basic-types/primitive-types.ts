/**
 * 基础原始类型测试
 * 测试 TypeScript 基础类型的使用和相关 ESLint 规则
 */

// ✅ 良好实践：明确的类型注解
const explicitString: string = 'Hello, TypeScript!';
const explicitNumber: number = 42;
const explicitBoolean: boolean = true;

// ✅ 良好实践：类型推断
const inferredString = 'Hello, TypeScript!'; // string
const inferredNumber = 42; // number
const inferredBoolean = true; // boolean

// ⚠️ 警告：不必要的类型注解（类型推断已足够）
const unnecessaryAnnotation: string = 'This annotation is redundant';

// ❌ 错误：使用 any 类型（应该避免）
let anyType: any = 'This could be anything';
anyType = 42;
anyType = true;

// ✅ 良好实践：使用 unknown 替代 any
let unknownType: unknown = 'This is safer than any';
if (typeof unknownType === 'string') {
  console.log(unknownType.toUpperCase()); // 类型守卫后安全使用
}

// ✅ 良好实践：null 和 undefined 的处理
const nullableString: string | null = Math.random() > 0.5 ? 'value' : null;
const optionalString: string | undefined = Math.random() > 0.5 ? 'value' : undefined;

// ✅ 良好实践：使用可选链和空值合并
console.log(nullableString?.toUpperCase() ?? 'Default value');

// ✅ 良好实践：BigInt 和 Symbol
const bigIntValue = 123n;
const symbolValue = Symbol('unique');

// ❌ 错误：混合使用 number 和 bigint
// const mixedNumbers = bigIntValue + 42; // Type error

// ✅ 良好实践：正确的 BigInt 使用
const bigIntSum = bigIntValue + 456n;

// ✅ 良好实践：void 类型用于函数
function logMessage(message: string): void {
  console.log(message);
}

// ✅ 良好实践：never 类型用于永不返回的函数
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // 无限循环
  }
}

// ✅ 良好实践：类型断言的正确使用
const someValue: unknown = 'This is a string';
const strLength = (someValue as string).length;

// ⚠️ 警告：非空断言操作符的使用（应谨慎）
const possiblyNull: string | null = Math.random() > 0.5 ? 'value' : null;
const definitelyString = possiblyNull!; // 非空断言

// ✅ 更好的做法：使用类型守卫
if (possiblyNull !== null) {
  const safeString = possiblyNull; // TypeScript 知道这里不是 null
  console.log(safeString.length);
}

export {
  explicitString,
  inferredNumber,
  unknownType,
  bigIntSum,
  logMessage,
  throwError,
};
