/**
 * 变量声明测试
 * 测试 var, let, const 的使用和相关 ESLint 规则
 */

// ✅ 良好实践：使用 const 声明不会重新赋值的变量
const PI = 3.14159;
const APP_NAME = 'JavaScript Test App';
const CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// ✅ 良好实践：使用 let 声明会重新赋值的变量
let counter = 0;
let userName = 'guest';
let isLoggedIn = false;

// ⚠️ 警告：使用 var（现代 JavaScript 中不推荐）
var legacyVariable = 'This uses var';
var globalCounter = 0;

// ✅ 良好实践：块级作用域
function demonstrateBlockScope() {
  if (true) {
    const blockScoped = 'Only available in this block';
    let alsoBlockScoped = 'Also block scoped';
    console.log(blockScoped, alsoBlockScoped);
  }
  
  // ❌ 错误：访问块级作用域外的变量
  // console.log(blockScoped); // ReferenceError
}

// ⚠️ 警告：var 的函数作用域问题
function demonstrateVarIssues() {
  console.log('Before loop, i is:', typeof i); // undefined (hoisting)
  
  for (var i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log('var i:', i); // 总是打印 3
    }, 100);
  }
  
  console.log('After loop, i is:', i); // 3 (函数作用域)
}

// ✅ 良好实践：let 解决循环问题
function demonstrateLetSolution() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log('let i:', i); // 打印 0, 1, 2
    }, 100);
  }
  
  // ❌ 错误：let 是块级作用域
  // console.log('After loop, i is:', i); // ReferenceError
}

// ✅ 良好实践：const 用于对象和数组
const users = [];
const settings = {
  theme: 'dark',
  language: 'en',
};

// ✅ 可以修改对象和数组的内容
users.push({ name: 'John', age: 30 });
settings.theme = 'light';

// ❌ 错误：不能重新赋值 const 变量
// users = []; // TypeError
// settings = {}; // TypeError

// ✅ 良好实践：解构赋值
const person = { name: 'Alice', age: 25, city: 'New York' };
const { name, age } = person;
const { city: userCity } = person; // 重命名

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// ✅ 良好实践：默认值
const { theme = 'light', fontSize = 14 } = settings;
const [primaryColor = '#000000'] = [];

// ✅ 良好实践：交换变量
let a = 1;
let b = 2;
[a, b] = [b, a]; // 交换值

// ✅ 良好实践：函数参数解构
function greetUser({ name, age = 18 }) {
  return `Hello ${name}, you are ${age} years old`;
}

// ✅ 良好实践：嵌套解构
const company = {
  name: 'Tech Corp',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
};

const {
  name: companyName,
  address: {
    city: companyCity,
    coordinates: { lat, lng },
  },
} = company;

// ✅ 良好实践：数组解构跳过元素
const colors = ['red', 'green', 'blue', 'yellow'];
const [primary, , tertiary] = colors; // 跳过 'green'

// ✅ 良好实践：剩余参数
const [head, ...tail] = numbers;

// ⚠️ 注意：变量提升（hoisting）
console.log('hoistedVar before declaration:', hoistedVar); // undefined
var hoistedVar = 'I am hoisted';

// ❌ 错误：let 和 const 的暂时性死区
// console.log('letVar before declaration:', letVar); // ReferenceError
let letVar = 'I am not hoisted';

// ✅ 良好实践：避免全局变量污染
(function() {
  const localVariable = 'This stays local';
  // 立即执行函数表达式 (IIFE)
})();

// ✅ 良好实践：模块模式
const MyModule = (function() {
  let privateVariable = 'This is private';
  
  return {
    getPrivateVariable() {
      return privateVariable;
    },
    setPrivateVariable(value) {
      privateVariable = value;
    },
  };
})();

// ✅ 良好实践：使用严格模式
'use strict';

function strictModeExample() {
  // ❌ 在严格模式下会报错
  // undeclaredVariable = 'This will throw an error';
  
  // ✅ 正确声明变量
  const declaredVariable = 'This is correct';
  return declaredVariable;
}

// ✅ 良好实践：常量命名约定
const MAX_RETRY_ATTEMPTS = 3;
const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  COMMENTS: '/api/comments',
};

// ✅ 良好实践：避免魔法数字
const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

function convertHoursToMilliseconds(hours) {
  return hours * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
}

// ❌ 错误示例：重复声明
// var duplicateVar = 'first';
// var duplicateVar = 'second'; // 不会报错但不推荐

// let duplicateLet = 'first';
// let duplicateLet = 'second'; // SyntaxError

export {
  PI,
  APP_NAME,
  CONFIG,
  counter,
  userName,
  demonstrateBlockScope,
  demonstrateLetSolution,
  users,
  settings,
  greetUser,
  companyName,
  companyCity,
  lat,
  lng,
  MyModule,
  strictModeExample,
  MAX_RETRY_ATTEMPTS,
  API_ENDPOINTS,
  convertHoursToMilliseconds,
};
