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
            className={`status-badge ${timer.mode === "work" ? "mode-work" : "mode-break"}`}
          >
            {timer.mode === "work" ? "⚡ FOCUS MODE" : "☕ BREAK TIME"}
          </div>
        )}

        {timer.targetTime && (
          <FlipClockCountdown
            to={timer.targetTime}
            renderMap={[false, false, true, true]}
            onComplete={setFinished}
            className="flip-clock-wrapper"
          />
        )}

        <div className="timer-controls">
          {timer.mode === "stop" ? (
            <button className="primary-btn" onClick={startTimer}>
              START
            </button>
          ) : (
            <button className="danger-btn" onClick={stopTimer}>
              STOP
            </button>
          )}
        </div>
      </div>
    </>
  );
}
