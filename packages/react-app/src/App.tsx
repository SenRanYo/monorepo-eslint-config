import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>React App Example</h1>
      <p>This app uses the shared ESLint React configuration.</p>
      <Counter />
    </div>
  );
}

export default App;
