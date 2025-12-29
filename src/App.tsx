import { useState, useEffect } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

type TimerMode = "work" | "break" | "longBreak" | "stop";
const STORAGE_KEY = "pomodoro-log-v1";

interface TimerState {
  mode: TimerMode;
  duration: number;
  targetTime: number | null;
}

const DURATIONS: Record<TimerMode, number> = {
  work: 0.2 * 60,
  break: 0.1 * 60,
  longBreak: 15 * 60,
  stop: 0,
};

type WorkCategory = {
  id: number;
  name: string;
};

interface WorkLog {
  date: string;
  categoryId: number;
  minutes: number;
}

interface PersistedState {
  categories: WorkCategory[];
  logs: WorkLog[];
}

function roundDecimal(value: number, decimalPoint: number) {
  const x = 1 / decimalPoint;
  return Math.round(value * x) / x;
}

function loadPersistedState(): PersistedState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      categories: [
        { id: 1, name: "勉強" },
        { id: 2, name: "開発" },
      ],
      logs: [],
    };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {
      categories: [
        { id: 1, name: "勉強" },
        { id: 2, name: "開発" },
      ],
      logs: [],
    };
  }
}

function savePersistedState(categories: WorkCategory[], logs: WorkLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, logs }));
}

function App() {
  const today = new Date().toISOString().slice(0, 10);

  const [categories, setCategories] = useState<WorkCategory[]>(
    () => loadPersistedState().categories
  );
  const [logs, setLogs] = useState<WorkLog[]>(() => loadPersistedState().logs);

  const [timer, setTimer] = useState<TimerState>({
    mode: "stop",
    duration: 0,
    targetTime: null,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // 🔑 入力中
  const [inputValue, setInputValue] = useState("");
  // 🔑 確定済み
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    // もし今日以外のログが混じっていたら、その場で消す
    if (logs.some((log) => log.date !== today)) {
      setLogs((prev) => prev.filter((l) => l.date === today));
      alert("過去のログを削除しました");
    }
    savePersistedState(categories, logs);
  }, [categories, logs]);

  // ===== カテゴリ確定 =====
  function confirmCategory() {
    const name = inputValue.trim();
    if (!name) {
      alert(
        "作業内容を選択してください。\nまたは入力することで新規作成してください。\n 次回からは選択できるようになります。"
      );
      return;
    }

    const existing = categories.find((c) => c.name === name);
    if (existing) {
      setSelectedCategory(existing.name);
      setSelectedCategoryId(existing.id);
    } else {
      const newCategory: WorkCategory = {
        id: Date.now(),
        name,
      };
      setCategories((prev) => [...prev, newCategory]);
      setSelectedCategory(name);
      setSelectedCategoryId(newCategory.id);
    }
  }

  // ===== タイマー制御 =====
  function startTimer() {
    if (!selectedCategory) {
      alert("確定ボタンを押して作業内容を確定してください");
      return;
    }

    setTimer({
      mode: "work",
      duration: DURATIONS.work,
      targetTime: Date.now() + DURATIONS.work * 1000,
    });
  }

  function stopTimer() {
    setTimer({
      mode: "stop",
      duration: 0,
      targetTime: null,
    });
  }

  function getTodayMinutesByCategory() {
    const today = new Date().toISOString().slice(0, 10);

    const todayLogs = logs.filter((log) => log.date === today);

    const minutesMap = new Map<number, number>();

    for (const log of todayLogs) {
      minutesMap.set(
        log.categoryId,
        (minutesMap.get(log.categoryId) ?? 0) + log.minutes
      );
    }

    return categories
      .map((cat) => ({
        categoryName: cat.name,
        minutes: minutesMap.get(cat.id) ?? 0,
      }))
      .filter((item) => item.minutes > 0);
  }

  function setFinished() {
    if (timer.mode === "work") {
      if (!selectedCategoryId) return;

      const today = new Date().toISOString().slice(0, 10);

      setLogs((prev) => [
        ...prev,
        {
          date: today,
          categoryId: selectedCategoryId,
          minutes: DURATIONS.work / 60,
        },
      ]);

      setTimer({
        mode: "break",
        duration: DURATIONS.break,
        targetTime: Date.now() + DURATIONS.break * 1000,
      });
    } else if (timer.mode === "break") {
      setTimer({
        mode: "work",
        duration: DURATIONS.work,
        targetTime: Date.now() + DURATIONS.work * 1000,
      });
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" />
        </a>
      </div>

      <h1>Pomodoro</h1>

      <div className="card">
        <p>{today}</p>

        <input
          list="categories"
          placeholder="作業内容を入力 / 選択"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button onClick={confirmCategory}>確定</button>

        <datalist id="categories">
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name} />
          ))}
        </datalist>

        {selectedCategory && (
          <p>
            現在の作業：<strong>{selectedCategory}</strong>
          </p>
        )}

        {timer.mode !== "stop" && (
          <div
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              display: "inline-block",
              margin: "10px 0",
              fontWeight: "bold",
              // モードによって背景色と文字色を変える
              backgroundColor: timer.mode === "work" ? "#ffebee" : "#e8f5e9",
              color: timer.mode === "work" ? "#d32f2f" : "#2e7d32",
              border: `1px solid ${
                timer.mode === "work" ? "#ffcdd2" : "#c8e6c9"
              }`,
            }}
          >
            {timer.mode === "work" ? "🚀 集中タイム" : "☕ 休憩タイム"}
          </div>
        )}

        {timer.targetTime && (
          <FlipClockCountdown
            to={timer.targetTime}
            renderMap={[false, false, true, true]}
            onComplete={setFinished}
          />
        )}

        <button onClick={startTimer}>スタート</button>
        <button onClick={stopTimer}>止める</button>
        <h2>今日の作業時間</h2>

        <ul>
          {getTodayMinutesByCategory().map((item) => (
            <li key={item.categoryName}>
              {item.categoryName}：{roundDecimal(item.minutes, 0.1)} 分
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
