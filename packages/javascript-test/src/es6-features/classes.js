/**
 * ES6 类和继承测试
 * 测试类定义、继承、静态方法等特性
 */

// ✅ 良好实践：基础类定义
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  }

  // Getter
  get info() {
    return `${this.name} (${this.age})`;
  }

  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  }

  get age() {
    return this._age;
  }

  // 静态方法
  static createAdult(name) {
    return new Person(name, 18);
  }

  static isValidAge(age) {
    return age >= 0 && age <= 150;
  }
}

// ✅ 良好实践：类继承
class Employee extends Person {
  constructor(name, age, jobTitle, salary) {
    super(name, age); // 调用父类构造函数
    this.jobTitle = jobTitle;
    this.salary = salary;
  }

  // 重写父类方法
  greet() {
    return `${super.greet()} I work as a ${this.jobTitle}.`;
  }

  // 新方法
  getAnnualSalary() {
    return this.salary * 12;
  }

  // 静态方法
  static createIntern(name, age) {
    return new Employee(name, age, 'Intern', 2000);
  }
}

// ✅ 良好实践：私有字段（ES2022）
class BankAccount {
  #balance = 0; // 私有字段
  #accountNumber;

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  // 公共方法访问私有字段
  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (amount > this.#balance) {
      throw new Error('Insufficient funds');
    }
    this.#balance -= amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }

  get accountNumber() {
    return this.#accountNumber;
  }

  // 私有方法
  #validateTransaction(amount) {
    return amount > 0 && amount <= 10000;
  }

  transfer(amount, targetAccount) {
    if (!this.#validateTransaction(amount)) {
      throw new Error('Invalid transaction amount');
    }
    this.withdraw(amount);
    targetAccount.deposit(amount);
  }
}

// ✅ 良好实践：抽象类模拟
class Shape {
  constructor(color) {
    if (this.constructor === Shape) {
      throw new Error('Cannot instantiate abstract class');
    }
    this.color = color;
  }

  // 抽象方法（需要子类实现）
  getArea() {
    throw new Error('getArea method must be implemented');
  }

  getPerimeter() {
    throw new Error('getPerimeter method must be implemented');
  }

  // 具体方法
  getColor() {
    return this.color;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter() {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  getPerimeter() {
    return 2 * (this.width + this.height);
  }
}

// ✅ 良好实践：Mixin 模式
const Flyable = {
  fly() {
    return `${this.name} is flying!`;
  },
  
  land() {
    return `${this.name} has landed.`;
  },
};

const Swimmable = {
  swim() {
    return `${this.name} is swimming!`;
  },
  
  dive() {
    return `${this.name} is diving deep.`;
  },
};

class Bird {
  constructor(name) {
    this.name = name;
  }
}

class Duck extends Bird {
  constructor(name) {
    super(name);
  }
}

// 应用 mixins
Object.assign(Duck.prototype, Flyable, Swimmable);

// ✅ 良好实践：工厂模式
class VehicleFactory {
  static createVehicle(type, ...args) {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car(...args);
      case 'motorcycle':
        return new Motorcycle(...args);
      case 'truck':
        return new Truck(...args);
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

class Vehicle {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  start() {
    return `${this.brand} ${this.model} is starting...`;
  }

  stop() {
    return `${this.brand} ${this.model} has stopped.`;
  }
}

class Car extends Vehicle {
  constructor(brand, model, year, doors = 4) {
    super(brand, model, year);
    this.doors = doors;
  }

  honk() {
    return 'Beep beep!';
  }
}

class Motorcycle extends Vehicle {
  constructor(brand, model, year, engineSize) {
    super(brand, model, year);
    this.engineSize = engineSize;
  }

  wheelie() {
    return 'Doing a wheelie!';
  }
}

class Truck extends Vehicle {
  constructor(brand, model, year, capacity) {
    super(brand, model, year);
    this.capacity = capacity;
  }

  loadCargo(weight) {
    if (weight > this.capacity) {
      throw new Error('Cargo exceeds truck capacity');
    }
    return `Loaded ${weight}kg of cargo`;
  }
}

// ✅ 良好实践：单例模式
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    
    this.logs = [];
    Logger.instance = this;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.logs.push(logEntry);
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs.length = 0;
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

// ✅ 良好实践：观察者模式
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    
    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    
    const listeners = this.events.get(event);
    listeners.forEach(listener => listener(...args));
  }

  once(event, listener) {
    const onceListener = (...args) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }
}

// ✅ 良好实践：链式调用
class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this; // 返回 this 支持链式调用
  }

  subtract(n) {
    this.value -= n;
    return this;
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  divide(n) {
    if (n === 0) {
      throw new Error('Division by zero');
    }
    this.value /= n;
    return this;
  }

  power(n) {
    this.value = Math.pow(this.value, n);
    return this;
  }

  result() {
    return this.value;
  }

  reset() {
    this.value = 0;
    return this;
  }
}

// 使用示例
const person = new Person('Alice', 30);
const employee = new Employee('Bob', 25, 'Developer', 5000);
const account = new BankAccount('123456789', 1000);
const circle = new Circle('red', 5);
const rectangle = new Rectangle('blue', 10, 20);
const duck = new Duck('Donald');
const car = VehicleFactory.createVehicle('car', 'Toyota', 'Camry', 2022);
const logger = Logger.getInstance();
const emitter = new EventEmitter();
const calc = new Calculator();

export {
  Person,
  Employee,
  BankAccount,
  Shape,
  Circle,
  Rectangle,
  Flyable,
  Swimmable,
  Duck,
  VehicleFactory,
  Vehicle,
  Car,
  Motorcycle,
  Truck,
  Logger,
  EventEmitter,
  Calculator,
  person,
  employee,
  account,
  circle,
  rectangle,
  duck,
  car,
  logger,
  emitter,
  calc,
};
