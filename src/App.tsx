import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type TimerMode = "work" | "break" | "longBreak";
const STORAGE_KEY = "pomodoro-log-v1";

interface TimerState {
  mode: TimerMode;
  duration: number;  
  isRunning: boolean;
  startedAt: number | null; // Date.now()
}

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

type WorkCategory = {
  id: number;   // id
  name: string; // 表示名
};

interface CategoryState {
  categories: WorkCategory[];
  selectedCategoryId: number | null;
}

interface WorkLog {
  date: string;        // YYYY-MM-DD
  categoryId: number;
  seconds: number;
}

interface LogState {
  logs: WorkLog[];
}

interface PersistedState {
  categories: WorkCategory[];
  logs: WorkLog[];
}

function loadPersistedState(): PersistedState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      categories: [
        { id: 1, name: "勉強" },
        { id: 2, name: "開発" }
      ],
      logs: []
    };
  }

  try {
    return JSON.parse(raw) as PersistedState;
  } catch {
    // 壊れてたら初期化
    return {
      categories: [
        { id: 1, name: "勉強" },
        { id: 2, name: "開発" }
      ],
      logs: []
    };
  }
}

function savePersistedState(
  categories: WorkCategory[],
  logs: WorkLog[]
) {
  const data: PersistedState = {
    categories,
    logs
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


function App() {
  const today = new Date().toISOString().slice(0, 10);
  const [categories, setCategories] = useState<WorkCategory[]>(
  () => loadPersistedState().categories
);
  const [timer, setTimer] = useState<TimerState>({
  mode: "work",
  duration: DURATIONS.work,
  isRunning: false,
  startedAt: null
});
  const [logs, setLogs] = useState<WorkLog[]>(
  () => loadPersistedState().logs
);

  useEffect(() => {
  savePersistedState(categories, logs);
}, [categories, logs]);
  
  const [count, setCount] = useState(0);

  function addWorkLog(categoryId: number, seconds: number) {
    const today = new Date().toISOString().slice(0, 10);
    
    setLogs(prev => [
      ...prev,
      {
        date: today,
        categoryId,
        seconds
      }
    ]);
  }

  function addCategory(name: string) {
    setCategories(prev => [
      ...prev,
      {
        id: categories.length,
        name
      }
    ]);
  }


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>{today}</p>
        <p>{categories[1].name}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
