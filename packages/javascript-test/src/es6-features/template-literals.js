/**
 * 模板字符串测试
 * 测试模板字符串的各种用法和相关 ESLint 规则
 */

// ✅ 良好实践：基础模板字符串
const name = 'Alice';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;

// ✅ 良好实践：多行字符串
const multilineText = `
  This is a multiline string.
  It can span multiple lines
  without using concatenation
  or escape characters.
`;

const htmlTemplate = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
    <p>Status: Active</p>
  </div>
`;

// ✅ 良好实践：表达式插值
const a = 10;
const b = 20;
const mathResult = `The sum of ${a} and ${b} is ${a + b}`;
const comparison = `${a} is ${a > b ? 'greater than' : 'less than or equal to'} ${b}`;

// ✅ 良好实践：函数调用插值
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

const price = 1234.56;
const priceDisplay = `The price is ${formatCurrency(price)}`;

// ✅ 良好实践：对象属性插值
const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  profile: {
    bio: 'Software Developer',
    location: 'San Francisco',
  },
};

const userInfo = `
  Name: ${user.firstName} ${user.lastName}
  Email: ${user.email}
  Bio: ${user.profile.bio}
  Location: ${user.profile.location}
`;

// ✅ 良好实践：数组方法插值
const numbers = [1, 2, 3, 4, 5];
const arrayInfo = `
  Numbers: ${numbers.join(', ')}
  Sum: ${numbers.reduce((sum, num) => sum + num, 0)}
  Average: ${numbers.reduce((sum, num) => sum + num, 0) / numbers.length}
`;

// ✅ 良好实践：条件渲染
const isLoggedIn = true;
const username = 'alice123';
const loginStatus = `
  ${isLoggedIn ? `Welcome back, ${username}!` : 'Please log in to continue.'}
`;

// ✅ 良好实践：循环渲染
const items = ['Apple', 'Banana', 'Orange'];
const itemList = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join('')}
  </ul>
`;

// ✅ 良好实践：嵌套模板字符串
const products = [
  { name: 'Laptop', price: 999.99, inStock: true },
  { name: 'Mouse', price: 29.99, inStock: false },
  { name: 'Keyboard', price: 79.99, inStock: true },
];

const productCatalog = `
  <div class="catalog">
    ${products.map(product => `
      <div class="product ${product.inStock ? 'in-stock' : 'out-of-stock'}">
        <h3>${product.name}</h3>
        <p>Price: ${formatCurrency(product.price)}</p>
        <p>Status: ${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    `).join('')}
  </div>
`;

// ✅ 良好实践：标签模板字符串
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + string + value;
  }, '');
}

const searchTerm = 'JavaScript';
const highlightedText = highlight`
  Learning ${searchTerm} is fun! ${searchTerm} is a versatile language.
`;

// ✅ 良好实践：国际化标签函数
function i18n(strings, ...values) {
  // 简化的国际化函数
  const translations = {
    'Hello, my name is': '你好，我的名字是',
    'and I am': '我',
    'years old': '岁',
  };
  
  return strings.reduce((result, string, i) => {
    const translatedString = translations[string.trim()] || string;
    const value = values[i] || '';
    return result + translatedString + value;
  }, '');
}

const translatedGreeting = i18n`Hello, my name is ${name} and I am ${age} years old`;

// ✅ 良好实践：SQL 查询构建
function sql(strings, ...values) {
  // 简化的 SQL 构建器（实际使用中需要防 SQL 注入）
  return strings.reduce((query, string, i) => {
    const value = values[i];
    const escapedValue = typeof value === 'string' ? `'${value}'` : value;
    return query + string + (escapedValue || '');
  }, '');
}

const userId = 123;
const userEmail = 'user@example.com';
const query = sql`
  SELECT * FROM users 
  WHERE id = ${userId} 
  AND email = ${userEmail}
`;

// ✅ 良好实践：CSS-in-JS
function css(strings, ...values) {
  return strings.reduce((styles, string, i) => {
    const value = values[i] || '';
    return styles + string + value;
  }, '');
}

const primaryColor = '#007bff';
const fontSize = '16px';
const buttonStyles = css`
  background-color: ${primaryColor};
  font-size: ${fontSize};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
`;

// ✅ 良好实践：日志格式化
function createLogger(level) {
  return function log(strings, ...values) {
    const timestamp = new Date().toISOString();
    const message = strings.reduce((msg, string, i) => {
      return msg + string + (values[i] || '');
    }, '');
    
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  };
}

const info = createLogger('info');
const error = createLogger('error');

// 使用示例
const operation = 'user creation';
const result = 'success';
info`Operation ${operation} completed with result: ${result}`;

// ✅ 良好实践：URL 构建
function buildUrl(baseUrl, params = {}) {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

const apiUrl = buildUrl('https://api.example.com/users', {
  page: 1,
  limit: 10,
  search: 'john',
});

// ✅ 良好实践：配置文件生成
function generateConfig(options) {
  return `
    {
      "name": "${options.name}",
      "version": "${options.version}",
      "description": "${options.description}",
      "main": "${options.main || 'index.js'}",
      "scripts": {
        ${Object.entries(options.scripts || {})
          .map(([key, value]) => `"${key}": "${value}"`)
          .join(',\n        ')}
      },
      "dependencies": {
        ${Object.entries(options.dependencies || {})
          .map(([key, value]) => `"${key}": "${value}"`)
          .join(',\n        ')}
      }
    }
  `;
}

const packageJson = generateConfig({
  name: 'my-app',
  version: '1.0.0',
  description: 'A sample application',
  scripts: {
    start: 'node index.js',
    test: 'jest',
  },
  dependencies: {
    express: '^4.18.0',
    lodash: '^4.17.21',
  },
});

// ✅ 良好实践：邮件模板
function createEmailTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.subject}</title>
    </head>
    <body>
      <h1>Hello ${data.recipientName}!</h1>
      <p>${data.message}</p>
      <p>
        Best regards,<br>
        ${data.senderName}
      </p>
      <footer>
        <p>This email was sent on ${new Date().toLocaleDateString()}</p>
      </footer>
    </body>
    </html>
  `;
}

const emailHtml = createEmailTemplate({
  subject: 'Welcome to our service',
  recipientName: 'John Doe',
  message: 'Thank you for signing up! We are excited to have you on board.',
  senderName: 'The Team',
});

// ⚠️ 注意：避免在模板字符串中使用复杂逻辑
// 复杂逻辑应该提取到函数中
function formatUserStatus(user) {
  if (!user.isActive) return 'Inactive';
  if (user.isPremium) return 'Premium Member';
  return 'Regular Member';
}

const userCard = `
  <div class="user-card">
    <h2>${user.firstName} ${user.lastName}</h2>
    <p>Status: ${formatUserStatus(user)}</p>
  </div>
`;

export {
  greeting,
  multilineText,
  htmlTemplate,
  mathResult,
  comparison,
  priceDisplay,
  userInfo,
  arrayInfo,
  loginStatus,
  itemList,
  productCatalog,
  highlight,
  highlightedText,
  i18n,
  translatedGreeting,
  sql,
  query,
  css,
  buttonStyles,
  createLogger,
  info,
  error,
  buildUrl,
  apiUrl,
  generateConfig,
  packageJson,
  createEmailTemplate,
  emailHtml,
  formatUserStatus,
  userCard,
};
