/**
 * 泛型测试
 * 测试各种泛型使用场景和相关 ESLint 规则
 */

// ✅ 良好实践：基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// ✅ 良好实践：多个泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// ✅ 良好实践：泛型约束
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(`Length: ${arg.length}`);
  return arg;
}

// ✅ 良好实践：keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ✅ 良好实践：泛型接口
interface GenericRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  findAll(): Promise<T[]>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository implements GenericRepository<User> {
  async findById(id: string): Promise<User | null> {
    // 模拟数据库查询
    console.log(`Finding user with id: ${id}`);
    return null;
  }

  async save(user: User): Promise<User> {
    console.log(`Saving user: ${user.name}`);
    return user;
  }

  async delete(id: string): Promise<void> {
    console.log(`Deleting user with id: ${id}`);
  }

  async findAll(): Promise<User[]> {
    console.log('Finding all users');
    return [];
  }
}

// ✅ 良好实践：泛型类
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): readonly T[] {
    return [...this.items];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  map<U>(mapper: (item: T) => U): U[] {
    return this.items.map(mapper);
  }
}

// ✅ 良好实践：条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// ✅ 良好实践：映射类型
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// ✅ 良好实践：高级映射类型
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// ✅ 良好实践：递归泛型类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ✅ 良好实践：泛型工具函数
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ✅ 良好实践：异步泛型
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as Promise<T>;
}

class AsyncCache<T> {
  private cache = new Map<string, Promise<T>>();

  async get(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, fetcher());
    }
    return this.cache.get(key)!;
  }

  clear(): void {
    this.cache.clear();
  }
}

// ✅ 良好实践：泛型约束的复杂用法
interface Serializable {
  serialize(): string;
}

interface Deserializable<T> {
  deserialize(data: string): T;
}

class SerializableContainer<T extends Serializable> {
  constructor(private item: T) {}

  save(): string {
    return this.item.serialize();
  }

  getItem(): T {
    return this.item;
  }
}

// ✅ 良好实践：泛型与函数重载
function process<T extends string>(value: T): T;
function process<T extends number>(value: T): T;
function process<T extends boolean>(value: T): T;
function process<T>(value: T): T {
  return value;
}

// ✅ 良好实践：泛型默认参数
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

function handleResponse<T = unknown>(response: ApiResponse<T>): T {
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response.message);
}

// ✅ 良好实践：协变和逆变
interface Producer<out T> {
  produce(): T;
}

interface Consumer<in T> {
  consume(item: T): void;
}

interface Transformer<in TInput, out TOutput> {
  transform(input: TInput): TOutput;
}

// ✅ 良好实践：模板字面量类型
type EventName<T extends string> = `on${Capitalize<T>}`;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiEndpoint<T extends HttpMethod> = `${Lowercase<T>} /api/`;

type ClickEvent = EventName<'click'>; // 'onClick'
type GetEndpoint = ApiEndpoint<'GET'>; // 'get /api/'

// ⚠️ 注意：避免过度复杂的泛型
// 这个例子展示了可能过于复杂的泛型使用
type OverlyComplex<
  T extends Record<string, any>,
  K extends keyof T,
  V extends T[K]
> = {
  [P in K]: T[P] extends V ? T[P] : never;
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

// ✅ 更好的做法：保持泛型简单明了
type SimpleFilter<T, K extends keyof T> = Pick<T, K>;

export {
  identity,
  pair,
  logLength,
  getProperty,
  GenericRepository,
  UserRepository,
  Container,
  createArray,
  groupBy,
  fetchData,
  AsyncCache,
  SerializableContainer,
  process,
  handleResponse,
};
