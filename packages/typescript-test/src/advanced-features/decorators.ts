/**
 * 装饰器测试
 * 测试各种装饰器的使用和相关 ESLint 规则
 * 注意：需要在 tsconfig.json 中启用 experimentalDecorators
 */

// ✅ 良好实践：类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function component(name: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      componentName = name;
      created = new Date();
    };
  };
}

@sealed
@component('UserComponent')
class User {
  constructor(public name: string, public email: string) {}

  greet(): string {
    return `Hello, ${this.name}!`;
  }
}

// ✅ 良好实践：方法装饰器
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with arguments:`, args);
    const result = method.apply(this, args);
    console.log(`${propertyName} returned:`, result);
    return result;
  };
}

function measure(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = method.apply(this, args);
    const end = performance.now();
    console.log(`${propertyName} took ${end - start} milliseconds`);
    return result;
  };
}

class Calculator {
  @log
  @measure
  add(a: number, b: number): number {
    return a + b;
  }

  @log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

// ✅ 良好实践：属性装饰器
function readonly(target: any, propertyName: string) {
  const descriptor: PropertyDescriptor = {
    writable: false,
    configurable: false,
  };
  return descriptor;
}

function validate(validationFn: (value: any) => boolean) {
  return function (target: any, propertyName: string) {
    let value: any;

    const getter = () => value;
    const setter = (newValue: any) => {
      if (!validationFn(newValue)) {
        throw new Error(`Invalid value for ${propertyName}: ${newValue}`);
      }
      value = newValue;
    };

    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class Product {
  @readonly
  id: string;

  @validate((value: string) => value.length > 0)
  name: string;

  @validate((value: number) => value >= 0)
  price: number;

  constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// ✅ 良好实践：参数装饰器
function required(target: any, propertyName: string, parameterIndex: number) {
  const existingRequiredParameters: number[] = 
    Reflect.getOwnMetadata('required', target, propertyName) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyName);
}

function validate_parameters(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const requiredParameters: number[] = 
      Reflect.getOwnMetadata('required', target, propertyName) || [];

    for (const parameterIndex of requiredParameters) {
      if (args[parameterIndex] === undefined || args[parameterIndex] === null) {
        throw new Error(`Parameter at index ${parameterIndex} is required`);
      }
    }

    return method.apply(this, args);
  };
}

class UserService {
  @validate_parameters
  createUser(@required name: string, @required email: string, age?: number): User {
    return new User(name, email);
  }
}

// ✅ 良好实践：装饰器工厂
function cache(ttl: number = 60000) {
  const cache = new Map<string, { value: any; expiry: number }>();

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = `${propertyName}_${JSON.stringify(args)}`;
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        console.log(`Cache hit for ${propertyName}`);
        return cached.value;
      }

      const result = method.apply(this, args);
      cache.set(key, { value: result, expiry: Date.now() + ttl });
      console.log(`Cache miss for ${propertyName}, result cached`);
      return result;
    };
  };
}

class DataService {
  @cache(30000) // 30 seconds TTL
  async fetchUserData(userId: string): Promise<any> {
    console.log(`Fetching data for user ${userId}`);
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: userId, name: 'John Doe', email: 'john@example.com' };
  }
}

// ✅ 良好实践：多个装饰器组合
function retry(maxAttempts: number = 3) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await method.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`Attempt ${attempt} failed:`, error);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      throw lastError!;
    };
  };
}

class ApiClient {
  @log
  @retry(3)
  @cache(60000)
  async fetchData(endpoint: string): Promise<any> {
    // 模拟可能失败的 API 调用
    if (Math.random() < 0.3) {
      throw new Error('Network error');
    }
    
    console.log(`Fetching from ${endpoint}`);
    return { data: 'success', endpoint };
  }
}

// ✅ 良好实践：类型安全的装饰器
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();

    getTimestamp(): Date {
      return this.timestamp;
    }
  };
}

function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }

    static deserialize(json: string): InstanceType<TBase> {
      return JSON.parse(json);
    }
  };
}

@Timestamped
@Serializable
class Document {
  constructor(public title: string, public content: string) {}
}

// ✅ 良好实践：装饰器元数据
const METADATA_KEY = Symbol('metadata');

function metadata(key: string, value: any) {
  return function (target: any) {
    const existingMetadata = Reflect.getMetadata(METADATA_KEY, target) || {};
    existingMetadata[key] = value;
    Reflect.defineMetadata(METADATA_KEY, existingMetadata, target);
  };
}

function getMetadata(target: any): any {
  return Reflect.getMetadata(METADATA_KEY, target) || {};
}

@metadata('version', '1.0.0')
@metadata('author', 'John Doe')
class VersionedClass {
  static getInfo(): any {
    return getMetadata(VersionedClass);
  }
}

// ⚠️ 注意：装饰器的执行顺序
// 装饰器从下到上执行（最接近声明的先执行）
function first() {
  console.log('first(): factory evaluated');
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    console.log('first(): called');
  };
}

function second() {
  console.log('second(): factory evaluated');
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    console.log('second(): called');
  };
}

class OrderTest {
  @first()
  @second()
  method(): void {
    console.log('method called');
  }
}

export {
  User,
  Calculator,
  Product,
  UserService,
  DataService,
  ApiClient,
  Document,
  VersionedClass,
  OrderTest,
};
