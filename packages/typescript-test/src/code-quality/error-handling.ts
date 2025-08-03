/**
 * 错误处理和异常管理测试
 * 测试错误处理相关的最佳实践和 ESLint 规则
 */

// ✅ 良好实践：自定义错误类
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
    
    // 确保正确的原型链
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string
  ) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

// ✅ 良好实践：错误类型定义
type ErrorType = 'validation' | 'network' | 'permission' | 'unknown';

interface ErrorDetails {
  type: ErrorType;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

// ✅ 良好实践：Result 类型模式
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function createSuccess<T>(data: T): Result<T> {
  return { success: true, data };
}

function createError<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// ✅ 良好实践：安全的数据验证
function validateEmail(email: string): Result<string, ValidationError> {
  if (!email) {
    return createError(new ValidationError('Email is required', 'email', email));
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return createError(new ValidationError('Invalid email format', 'email', email));
  }
  
  return createSuccess(email);
}

function validateAge(age: number): Result<number, ValidationError> {
  if (age < 0) {
    return createError(new ValidationError('Age cannot be negative', 'age', age));
  }
  
  if (age > 150) {
    return createError(new ValidationError('Age seems unrealistic', 'age', age));
  }
  
  return createSuccess(age);
}

// ✅ 良好实践：组合验证结果
interface UserData {
  email: string;
  age: number;
}

function validateUser(data: Partial<UserData>): Result<UserData, ValidationError[]> {
  const errors: ValidationError[] = [];
  
  if (!data.email) {
    errors.push(new ValidationError('Email is required', 'email', data.email));
  } else {
    const emailResult = validateEmail(data.email);
    if (!emailResult.success) {
      errors.push(emailResult.error);
    }
  }
  
  if (data.age === undefined) {
    errors.push(new ValidationError('Age is required', 'age', data.age));
  } else {
    const ageResult = validateAge(data.age);
    if (!ageResult.success) {
      errors.push(ageResult.error);
    }
  }
  
  if (errors.length > 0) {
    return createError(errors);
  }
  
  return createSuccess(data as UserData);
}

// ✅ 良好实践：异步错误处理
async function fetchUserData(userId: string): Promise<Result<UserData, NetworkError>> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      return createError(new NetworkError(
        `Failed to fetch user data: ${response.statusText}`,
        response.status,
        response.url
      ));
    }
    
    const data = await response.json();
    const validationResult = validateUser(data);
    
    if (!validationResult.success) {
      // 转换验证错误为网络错误
      return createError(new NetworkError(
        'Invalid user data received from server',
        422,
        response.url
      ));
    }
    
    return createSuccess(validationResult.data);
  } catch (error) {
    if (error instanceof TypeError) {
      // 网络错误
      return createError(new NetworkError(
        'Network connection failed',
        0,
        `/api/users/${userId}`
      ));
    }
    
    // 未知错误
    return createError(new NetworkError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      `/api/users/${userId}`
    ));
  }
}

// ✅ 良好实践：错误恢复策略
async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetcher();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        break;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // 指数退避
    }
  }
  
  throw lastError!;
}

// ✅ 良好实践：错误边界模式
class ErrorBoundary {
  private errorHandlers: Map<string, (error: Error) => void> = new Map();
  
  registerHandler(errorType: string, handler: (error: Error) => void): void {
    this.errorHandlers.set(errorType, handler);
  }
  
  handleError(error: Error): void {
    const handler = this.errorHandlers.get(error.name) || 
                   this.errorHandlers.get('default');
    
    if (handler) {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    } else {
      console.error('Unhandled error:', error);
    }
  }
  
  async safeExecute<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }
}

// ✅ 良好实践：类型安全的错误处理
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

function handleKnownError(error: unknown): string {
  if (isValidationError(error)) {
    return `Validation failed for ${error.field}: ${error.message}`;
  }
  
  if (isNetworkError(error)) {
    return `Network error (${error.statusCode}): ${error.message}`;
  }
  
  if (error instanceof Error) {
    return `Unexpected error: ${error.message}`;
  }
  
  return 'An unknown error occurred';
}

// ✅ 良好实践：Promise 错误处理
async function processUserData(userId: string): Promise<string> {
  const result = await fetchUserData(userId);
  
  if (!result.success) {
    throw result.error;
  }
  
  return `User: ${result.data.email}, Age: ${result.data.age}`;
}

// ✅ 良好实践：错误聚合
class ErrorCollector {
  private errors: Error[] = [];
  
  add(error: Error): void {
    this.errors.push(error);
  }
  
  addIf(condition: boolean, error: Error): void {
    if (condition) {
      this.add(error);
    }
  }
  
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  
  getErrors(): readonly Error[] {
    return [...this.errors];
  }
  
  throwIfAny(): void {
    if (this.hasErrors()) {
      const message = this.errors.map(e => e.message).join('; ');
      throw new Error(`Multiple errors occurred: ${message}`);
    }
  }
  
  clear(): void {
    this.errors.length = 0;
  }
}

// ✅ 良好实践：资源清理
class ResourceManager {
  private resources: Array<{ cleanup: () => void }> = [];
  
  register(resource: { cleanup: () => void }): void {
    this.resources.push(resource);
  }
  
  async executeWithCleanup<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } finally {
      // 确保资源被清理，即使操作失败
      for (const resource of this.resources) {
        try {
          resource.cleanup();
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }
      this.resources.length = 0;
    }
  }
}

// ❌ 错误示例：忽略错误
function badErrorHandling(): void {
  fetch('/api/data').then(response => {
    // 没有检查 response.ok
    return response.json();
  }).then(data => {
    console.log(data);
  });
  // 没有 .catch() 处理错误
}

// ❌ 错误示例：吞掉错误
function swallowError(): void {
  try {
    JSON.parse('invalid json');
  } catch {
    // 静默忽略错误 - 不好的做法
  }
}

// ❌ 错误示例：抛出非 Error 对象
function throwNonError(): never {
  throw 'This is a string error'; // 应该抛出 Error 对象
}

export {
  ValidationError,
  NetworkError,
  ErrorType,
  ErrorDetails,
  Result,
  createSuccess,
  createError,
  validateEmail,
  validateAge,
  validateUser,
  fetchUserData,
  fetchWithRetry,
  ErrorBoundary,
  isValidationError,
  isNetworkError,
  handleKnownError,
  processUserData,
  ErrorCollector,
  ResourceManager,
};
