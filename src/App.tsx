import { useState, useEffect, useCallback } from "react";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

import "./App.css";

import { CategorySelector } from "./components/CategorySelector";
import { TimerPanel } from "./components/TimerPanel";
import { SetInterval } from "./components/SetInterval";
import useSound from "use-sound";
import alarmSound from "./assets/Clock-Alarm03-01(Mid-Loop) (mp3cut.net).mp3";
import ReactGA from "react-ga4";

// 測定IDを定数として定義
const TRACKING_ID = "G-6R54R1XXNB";

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
  // アプリ起動時に初期化
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    // ページビューを送信
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

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

  const [workCount, setWorkCount] = useState(0);

  // 🔑 入力中
  const [inputValue, setInputValue] = useState("");
  // 🔑 確定済み
  const [selectedCategory, setSelectedCategory] = useState("");

  const [play, { stop }] = useSound(alarmSound, { loop: true, volume: 0.5 });

  useEffect(() => {
    const today = new Date().toLocaleDateString("sv-SE");
    // もし今日以外のログが混じっていたら、その場で消す
    if (logs.some((log) => log.date !== today)) {
      setLogs((prev) => prev.filter((l) => l.date === today));
      alert("過去のログを削除しました");
    }
    savePersistedState(categories, logs);
  }, [categories, logs]);

  const stopAlarm = useCallback(() => {
    stop();

    window.removeEventListener("click", stopAlarm);
    window.removeEventListener("touchstart", stopAlarm);
  }, [stop]);

  // ===== タイマー設定 =====
  const [durations, setDurations] = useState(DURATIONS);

  // コンポーネントが消えるときに念のため音を止める（お作法）
  useEffect(() => {
    return () => {
      stop();
      window.removeEventListener("click", stopAlarm);
      window.removeEventListener("touchstart", stopAlarm);
    };
  }, [stop, stopAlarm]);

  // ===== カテゴリ確定 =====
  function confirmCategory() {
    const name = inputValue.trim();
    if (!name) {
      ReactGA.event({
        category: "missed action",
        action: "カテゴリ未選択で確定ボタンを押した",
      });
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
      ReactGA.event({
        category: "missed action",
        action: "カテゴリ未選択でタイマー開始しようとした",
      });
      alert("確定ボタンを押して作業内容を確定してください");
      return;
    }
    // 💡 Safari対策：ユーザーがボタンを押したこの瞬間に、一度再生・即停止させる
    // これによって、このページは「音を出す許可」を得たことになります
    play();
    stop();
    ReactGA.event({
      category: "Timer",
      action: "タイマーを開始",
    });

    setTimer({
      mode: "work",
      duration: durations.work,
      targetTime: Date.now() + durations.work * 1000,
    });
  }

  function stopTimer() {
    if (timer.mode === "work" && timer.targetTime && selectedCategoryId) {
      const now = Date.now();
      const totalMs = durations.work * 1000;
      const remainingMs = timer.targetTime - now;

      const elapasedMS = totalMs - remainingMs;
      const elapsedMinutes = elapasedMS / 1000 / 60;

      if (elapsedMinutes > 0.1) {
        setLogs((prev) => [
          ...prev,
          {
            date: today,
            categoryId: selectedCategoryId,
            minutes: roundDecimal(elapsedMinutes, 0.1),
          },
        ]);
      }
    }
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
    play();

    window.addEventListener("click", stopAlarm);
    window.addEventListener("touchstart", stopAlarm);
    if (timer.mode === "work") {
      if (!selectedCategoryId) return;

      // 1. ログを保存
      setLogs((prev) => [
        ...prev,
        {
          date: today,
          categoryId: selectedCategoryId,
          minutes: durations.work / 60,
        },
      ]);

      // 2. 次の回数を計算して保存
      const nextCount = workCount + 1;
      setWorkCount(nextCount);

      // 3. nextCount を使って休憩時間を決める
      if (nextCount % 4 === 0) {
        // 4, 8, 12回目...
        setTimer({
          mode: "longBreak",
          duration: durations.longBreak,
          targetTime: Date.now() + durations.longBreak * 1000,
        });
      } else {
        // それ以外の休憩
        setTimer({
          mode: "break",
          duration: durations.break,
          targetTime: Date.now() + durations.break * 1000,
        });
      }
    } else if (timer.mode === "break" || timer.mode === "longBreak") {
      // 休憩終了 → 仕事開始
      setTimer({
        mode: "work",
        duration: durations.work,
        targetTime: Date.now() + durations.work * 1000,
      });
    }
  }

  return (
    <>
      <h1>PomodoroTimer</h1>

      <p>
        タイマーの流れについて<br></br>
        作業 → 休憩 → 作業… を繰り返します。
        作業を4回行うごとに、長い休憩に切り替わります。<br></br>
        タイマーが終了した時に音が鳴ります。
        画面のどこかをタップ(クリック)することで止めることができます。<br></br>※
        iPhoneでは消音モードだと タイマー終了音が鳴りません
      </p>

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

      <SetInterval
        timer={timer}
        durations={durations}
        setDurations={setDurations}
      />

      <footer style={{ marginTop: "20px", fontSize: "0.8rem", color: "#888" }}>
        <div className="pwa-install-guide">
          <h3>【アプリとして使う（推奨）】</h3>
          <p>ホーム画面に追加すると、全画面で集中して使えます。</p>

          <div className="guide-grid">
            <div className="guide-item">
              <strong>iPhone / Android</strong>
              <span>「共有ボタン」→「ホーム画面に追加」</span>
            </div>
            <div className="guide-item">
              <strong>PC</strong>
              <span>メニューから「インストール」</span>
            </div>
          </div>
        </div>
        <p>
          Sound by{" "}
          <a
            href="https://otologic.jp"
            target="_blank"
            rel="noopener noreferrer"
          >
            OtoLogic
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
