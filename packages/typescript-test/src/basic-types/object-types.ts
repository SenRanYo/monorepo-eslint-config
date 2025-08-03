/**
 * 对象类型测试
 * 测试对象、数组、元组等复合类型的使用
 */

// ✅ 良好实践：接口定义
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
  readonly createdAt: Date;
}

// ✅ 良好实践：类型别名
type UserRole = 'admin' | 'user' | 'guest';

type UserWithRole = User & {
  role: UserRole;
};

// ✅ 良好实践：对象字面量类型
const userConfig: {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
} = {
  theme: 'dark',
  language: 'en',
  notifications: true,
};

// ✅ 良好实践：数组类型的不同写法
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: Array<string> = ['a', 'b', 'c'];
const booleans: readonly boolean[] = [true, false, true]; // 只读数组

// ✅ 良好实践：元组类型
const coordinate: [number, number] = [10, 20];
const namedTuple: [x: number, y: number, z?: number] = [1, 2]; // 命名元组

// ✅ 良好实践：可变长度元组
const httpResponse: [number, string, ...string[]] = [200, 'OK', 'header1', 'header2'];

// ✅ 良好实践：Record 类型
const userRoles: Record<string, UserRole> = {
  john: 'admin',
  jane: 'user',
  bob: 'guest',
};

// ✅ 良好实践：索引签名
interface StringDictionary {
  [key: string]: string;
}

interface NumberDictionary {
  [key: string]: number;
  length: number; // 可以有已知属性
}

// ✅ 良好实践：映射类型的使用
type PartialUser = Partial<User>; // 所有属性变为可选
type RequiredUser = Required<User>; // 所有属性变为必需
type UserEmail = Pick<User, 'email'>; // 选择特定属性
type UserWithoutId = Omit<User, 'id'>; // 排除特定属性

// ✅ 良好实践：函数类型
type EventHandler = (event: Event) => void;
type AsyncOperation<T> = (input: T) => Promise<T>;

interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

// ✅ 良好实践：对象方法的不同定义方式
const mathUtils = {
  // 方法简写
  add(a: number, b: number): number {
    return a + b;
  },
  
  // 箭头函数属性
  multiply: (a: number, b: number): number => a * b,
  
  // 函数表达式属性
  divide: function(a: number, b: number): number {
    return a / b;
  },
};

// ✅ 良好实践：嵌套对象类型
interface Company {
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  employees: User[];
}

// ✅ 良好实践：可选链和空值合并在对象中的使用
function getCompanyCoordinates(company: Company): string {
  const lat = company.address.coordinates?.lat ?? 0;
  const lng = company.address.coordinates?.lng ?? 0;
  return `${lat}, ${lng}`;
}

// ✅ 良好实践：对象解构与类型
function processUser({ name, email, age = 18 }: User): string {
  return `${name} (${email}) - Age: ${age}`;
}

// ✅ 良好实践：剩余参数与对象
function createUser(baseInfo: Pick<User, 'name' | 'email'>, ...additionalInfo: Array<Partial<User>>): User {
  return {
    id: Math.random(),
    createdAt: new Date(),
    ...baseInfo,
    ...Object.assign({}, ...additionalInfo),
  };
}

// ❌ 错误示例：对象属性访问
const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date(),
};

// ❌ 尝试修改只读属性
// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property

// ❌ 访问不存在的属性
// console.log(user.nonExistent); // Error: Property 'nonExistent' does not exist

export {
  User,
  UserRole,
  UserWithRole,
  mathUtils,
  getCompanyCoordinates,
  processUser,
  createUser,
};
