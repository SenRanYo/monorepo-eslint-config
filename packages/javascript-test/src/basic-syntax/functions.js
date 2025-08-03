/**
 * 函数定义和使用测试
 * 测试各种函数定义方式和相关 ESLint 规则
 */

// ✅ 良好实践：函数声明
function add(a, b) {
  return a + b;
}

// ✅ 良好实践：函数表达式
const multiply = function(a, b) {
  return a * b;
};

// ✅ 良好实践：箭头函数
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
};

// ✅ 良好实践：简洁的箭头函数
const square = x => x * x;
const double = x => x * 2;
const isEven = n => n % 2 === 0;

// ✅ 良好实践：默认参数
function greet(name = 'World', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

// ✅ 良好实践：剩余参数
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

function logAll(message, ...args) {
  console.log(message, ...args);
}

// ✅ 良好实践：解构参数
function createUser({ name, email, age = 18 }) {
  return {
    id: Math.random().toString(36),
    name,
    email,
    age,
    createdAt: new Date(),
  };
}

function processCoordinates([x, y, z = 0]) {
  return { x, y, z };
}

// ✅ 良好实践：高阶函数
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

// ✅ 良好实践：函数作为参数
function applyOperation(numbers, operation) {
  return numbers.map(operation);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = applyOperation(numbers, double);
const squared = applyOperation(numbers, square);

// ✅ 良好实践：回调函数
function fetchData(url, onSuccess, onError) {
  // 模拟异步操作
  setTimeout(() => {
    if (url.startsWith('https://')) {
      onSuccess({ data: 'Mock data', status: 200 });
    } else {
      onError(new Error('Invalid URL'));
    }
  }, 1000);
}

// ✅ 良好实践：立即执行函数表达式 (IIFE)
const modulePattern = (function() {
  let privateCounter = 0;
  
  return {
    increment() {
      privateCounter++;
    },
    decrement() {
      privateCounter--;
    },
    getCount() {
      return privateCounter;
    },
  };
})();

// ✅ 良好实践：递归函数
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// ✅ 良好实践：尾递归优化
function factorialTailRecursive(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTailRecursive(n - 1, n * accumulator);
}

// ✅ 良好实践：函数柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
const addFive = curriedAdd(5);
const addFiveAndThree = addFive(3);

// ✅ 良好实践：函数组合
const compose = (...fns) => value => fns.reduceRight((acc, fn) => fn(acc), value);
const pipe = (...fns) => value => fns.reduce((acc, fn) => fn(acc), value);

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const subtractThree = x => x - 3;

const composedFunction = compose(subtractThree, multiplyByTwo, addOne);
const pipedFunction = pipe(addOne, multiplyByTwo, subtractThree);

// ✅ 良好实践：纯函数
function pureAdd(a, b) {
  return a + b; // 没有副作用，相同输入总是产生相同输出
}

function pureCalculateArea(radius) {
  return Math.PI * radius * radius;
}

// ❌ 错误：非纯函数（有副作用）
let globalCounter = 0;
function impureIncrement() {
  globalCounter++; // 修改外部状态
  return globalCounter;
}

// ✅ 良好实践：避免副作用的版本
function pureIncrement(counter) {
  return counter + 1; // 返回新值而不是修改原值
}

// ✅ 良好实践：函数重载模拟
function processValue(value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  if (typeof value === 'number') {
    return value * 2;
  }
  if (Array.isArray(value)) {
    return value.length;
  }
  return null;
}

// ✅ 良好实践：工厂函数
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = initialValue;
      return count;
    },
  };
}

// ✅ 良好实践：函数防抖
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// ✅ 良好实践：函数节流
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ✅ 良好实践：记忆化
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const memoizedFibonacci = memoize(fibonacci);

// ⚠️ 警告：函数提升
console.log('Calling hoisted function:', hoistedFunction()); // 可以工作

function hoistedFunction() {
  return 'I am hoisted!';
}

// ❌ 错误：函数表达式不会提升
// console.log('Calling non-hoisted function:', nonHoistedFunction()); // ReferenceError

const nonHoistedFunction = function() {
  return 'I am not hoisted!';
};

// ✅ 良好实践：箭头函数的 this 绑定
const obj = {
  name: 'Object',
  regularFunction: function() {
    return this.name; // this 指向 obj
  },
  arrowFunction: () => {
    return this.name; // this 指向外层作用域
  },
  methodWithArrow: function() {
    const inner = () => {
      return this.name; // this 指向 obj（继承自外层函数）
    };
    return inner();
  },
};

export {
  add,
  multiply,
  divide,
  square,
  double,
  isEven,
  greet,
  sum,
  logAll,
  createUser,
  processCoordinates,
  createMultiplier,
  triple,
  quadruple,
  applyOperation,
  fetchData,
  modulePattern,
  factorial,
  fibonacci,
  factorialTailRecursive,
  curry,
  curriedAdd,
  compose,
  pipe,
  composedFunction,
  pipedFunction,
  pureAdd,
  pureCalculateArea,
  pureIncrement,
  processValue,
  createCounter,
  debounce,
  throttle,
  memoize,
  memoizedFibonacci,
  hoistedFunction,
  obj,
};
