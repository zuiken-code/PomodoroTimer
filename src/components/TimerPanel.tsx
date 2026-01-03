import type { TimerState } from "../types";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

interface props {
  timer: TimerState;
  setFinished: () => void;
  startTimer: () => void;
  stopTimer: () => void;
}

export function TimerPanel({
  timer,
  setFinished,
  startTimer,
  stopTimer,
}: props) {
  return (
    <>
      <div className="timer-panel">
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
      </div>
      <br></br>
      <button onClick={startTimer}>スタート</button>
      <button onClick={stopTimer}>やめる</button>
    </>
  );
}
