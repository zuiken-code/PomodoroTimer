import { useState, useEffect } from "react";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

import "./App.css";

import { CategorySelector } from "./components/CategorySelector";
import { TimerPanel } from "./components/TimerPanel";

import type {
  WorkCategory,
  WorkLog,
  PersistedState,
  TimerMode,
  TimerState,
} from "./types";

const STORAGE_KEY = "pomodoro-log-v1";

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
  stop: 0,
};

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
  const today = new Date().toLocaleDateString("sv-SE");
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
    const today = new Date().toLocaleDateString("sv-SE");
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
        "作業内容を選択してください。\nまたは入力することで新規作成してください。\n次回からは選択できるようになります。"
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
      <h1>PomodoroTime</h1>

      <div className="card">
        <p>{today}</p>

        <CategorySelector
          inputValue={inputValue}
          confirmCategory={confirmCategory}
          setInputValue={setInputValue}
          categories={categories}
          selectedCategory={selectedCategory}
        />

        <TimerPanel
          timer={timer}
          setFinished={setFinished}
          startTimer={startTimer}
          stopTimer={stopTimer}
        />

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
