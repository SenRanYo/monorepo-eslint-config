/**
 * Promise 和异步编程测试
 * 测试 Promise、async/await 和相关 ESLint 规则
 */

// ✅ 良好实践：基础 Promise 创建
function createPromise(shouldResolve = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve('Promise resolved successfully!');
      } else {
        reject(new Error('Promise rejected!'));
      }
    }, 1000);
  });
}

// ✅ 良好实践：Promise 链式调用
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(userData => {
      console.log('User data received:', userData);
      return userData;
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      throw error; // 重新抛出错误
    });
}

// ✅ 良好实践：Promise.all 并行执行
async function fetchMultipleUsers(userIds) {
  try {
    const promises = userIds.map(id => fetchUserData(id));
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    console.error('Error fetching multiple users:', error);
    throw error;
  }
}

// ✅ 良好实践：Promise.allSettled 处理部分失败
async function fetchUsersWithPartialFailure(userIds) {
  const promises = userIds.map(id => fetchUserData(id));
  const results = await Promise.allSettled(promises);
  
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
  
  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
  
  return { successful, failed };
}

// ✅ 良好实践：Promise.race 超时控制
function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// ✅ 良好实践：async/await 基础用法
async function getUserProfile(userId) {
  try {
    const user = await fetchUserData(userId);
    const posts = await fetchUserPosts(userId);
    const followers = await fetchUserFollowers(userId);
    
    return {
      user,
      posts,
      followers,
      profileComplete: true,
    };
  } catch (error) {
    console.error('Error building user profile:', error);
    return {
      user: null,
      posts: [],
      followers: [],
      profileComplete: false,
      error: error.message,
    };
  }
}

// ✅ 良好实践：并行异步操作
async function getUserProfileParallel(userId) {
  try {
    const [user, posts, followers] = await Promise.all([
      fetchUserData(userId),
      fetchUserPosts(userId),
      fetchUserFollowers(userId),
    ]);
    
    return { user, posts, followers, profileComplete: true };
  } catch (error) {
    console.error('Error building user profile:', error);
    throw error;
  }
}

// ✅ 良好实践：错误处理和重试机制
async function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // 指数退避
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// ✅ 良好实践：异步迭代器
async function* fetchPaginatedData(baseUrl, pageSize = 10) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await fetch(`${baseUrl}?page=${page}&size=${pageSize}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        yield data.items;
        hasMore = data.hasMore;
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error('Error fetching paginated data:', error);
      break;
    }
  }
}

// ✅ 良好实践：使用异步迭代器
async function processAllPages(baseUrl) {
  const allItems = [];
  
  for await (const items of fetchPaginatedData(baseUrl)) {
    allItems.push(...items);
    console.log(`Processed ${items.length} items`);
  }
  
  return allItems;
}

// ✅ 良好实践：Promise 工具函数
const PromiseUtils = {
  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // 超时包装
  timeout(promise, ms) {
    return withTimeout(promise, ms);
  },
  
  // 限制并发数
  async limitConcurrency(tasks, limit) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
      const promise = Promise.resolve().then(() => task());
      results.push(promise);
      
      if (tasks.length >= limit) {
        executing.push(promise);
        
        if (executing.length >= limit) {
          await Promise.race(executing);
          executing.splice(executing.findIndex(p => p === promise), 1);
        }
      }
    }
    
    return Promise.all(results);
  },
  
  // 顺序执行
  async sequence(tasks) {
    const results = [];
    for (const task of tasks) {
      const result = await task();
      results.push(result);
    }
    return results;
  },
  
  // 管道操作
  async pipe(value, ...operations) {
    let result = value;
    for (const operation of operations) {
      result = await operation(result);
    }
    return result;
  },
};

// ✅ 良好实践：异步队列
class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
      });
      
      this.process();
    });
  }
  
  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const { task, resolve, reject } = this.queue.shift();
    
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// ✅ 良好实践：缓存异步结果
class AsyncCache {
  constructor(ttl = 60000) { // 默认 1 分钟 TTL
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async get(key, fetcher) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.value;
    }
    
    try {
      const value = await fetcher();
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      });
      return value;
    } catch (error) {
      this.cache.delete(key);
      throw error;
    }
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key) {
    this.cache.delete(key);
  }
}

// ✅ 良好实践：事件驱动的异步操作
class AsyncEventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
  }
  
  async emit(event, data) {
    const listeners = this.listeners.get(event) || [];
    const promises = listeners.map(listener => 
      Promise.resolve().then(() => listener(data))
    );
    
    return Promise.allSettled(promises);
  }
  
  async waitFor(event, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for event: ${event}`));
      }, timeout);
      
      const listener = (data) => {
        clearTimeout(timer);
        this.off(event, listener);
        resolve(data);
      };
      
      this.on(event, listener);
    });
  }
  
  off(event, listener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

// ❌ 错误示例：未处理的 Promise 拒绝
function badPromiseHandling() {
  fetch('/api/data'); // 没有 .catch() 或 await
  
  createPromise(false); // 没有处理拒绝
}

// ❌ 错误示例：Promise 构造函数反模式
function promiseAntiPattern() {
  return new Promise((resolve) => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => resolve(data)); // 应该直接返回 fetch promise
  });
}

// ✅ 正确做法
function correctPromisePattern() {
  return fetch('/api/data')
    .then(response => response.json());
}

// ❌ 错误示例：async/await 中的常见错误
async function badAsyncAwait() {
  // 错误：顺序执行本可以并行的操作
  const user1 = await fetchUserData(1);
  const user2 = await fetchUserData(2);
  const user3 = await fetchUserData(3);
  
  return [user1, user2, user3];
}

// ✅ 正确做法：并行执行
async function goodAsyncAwait() {
  const [user1, user2, user3] = await Promise.all([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3),
  ]);
  
  return [user1, user2, user3];
}

// 模拟的辅助函数
async function fetchUserPosts(userId) {
  await PromiseUtils.delay(500);
  return [`Post 1 by user ${userId}`, `Post 2 by user ${userId}`];
}

async function fetchUserFollowers(userId) {
  await PromiseUtils.delay(300);
  return [`Follower 1 of user ${userId}`, `Follower 2 of user ${userId}`];
}

export {
  createPromise,
  fetchUserData,
  fetchMultipleUsers,
  fetchUsersWithPartialFailure,
  withTimeout,
  getUserProfile,
  getUserProfileParallel,
  fetchWithRetry,
  fetchPaginatedData,
  processAllPages,
  PromiseUtils,
  AsyncQueue,
  AsyncCache,
  AsyncEventEmitter,
  correctPromisePattern,
  goodAsyncAwait,
};
