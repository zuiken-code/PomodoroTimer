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
          // className="flip-clock-wrapper" を維持しつつ
          // style prop で --fcc-* CSS変数を直接注入する
          // ※ このライブラリはCSS変数でしかスタイルを受け付けない
          <FlipClockCountdown
            to={timer.targetTime}
            renderMap={[false, false, true, true]}
            onComplete={setFinished}
            className="flip-clock-wrapper"
            style={
              {
                // 数字カードのサイズ
                "--fcc-digit-block-width": "52px",
                "--fcc-digit-block-height": "70px",
                "--fcc-digit-block-radius": "8px",
                "--fcc-digit-block-spacing": "4px",

                // フォント・文字色
                "--fcc-digit-font-size": "44px",
                "--fcc-digit-color": "#f1f5f9",

                // 背景（カード）
                "--fcc-background": "rgba(28, 28, 40, 0.95)",

                // ラベル (Minutes / Seconds)
                "--fcc-label-font-size": "10px",
                "--fcc-label-color": "#64748b",

                // 区切り線
                "--fcc-divider-color": "rgba(255,255,255,0.1)",
                "--fcc-divider-height": "1px",

                // コロン（:）セパレーター
                "--fcc-separator-size": "6px",
                "--fcc-separator-color": "#60a5fa",

                // フリップアニメーション速度
                "--fcc-flip-duration": "0.4s",

                // カード間スペース
                "--fcc-spacing": "8px",
              } as React.CSSProperties
            }
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
