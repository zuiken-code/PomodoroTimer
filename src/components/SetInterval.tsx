import type { TimerState, TimerMode } from "../types";

interface Props {
  timer: TimerState;
  durations: Record<TimerMode, number>;
  setDurations: (interval: Record<TimerMode, number>) => void;
}

export function SetInterval({ timer, durations, setDurations }: Props) {
  return (
    <>
      {timer.mode === "stop" && (
        <div className="settings-section">
          <p className="settings-title">タイマー設定 (分)</p>
          <div className="settings-grid">
            <div className="setting-item">
              <label>作業</label>
              <input
                type="number"
                value={durations.work / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= 0) return;
                  setDurations({
                    ...durations,
                    work: val * 60,
                  });
                }}
              />
            </div>
            <div className="setting-item">
              <label>休憩</label>
              <input
                type="number"
                value={durations.break / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= 0) return;
                  setDurations({
                    ...durations,
                    break: val * 60,
                  });
                }}
              />
            </div>
            <div className="setting-item">
              <label>長い休憩</label>
              <input
                type="number"
                value={durations.longBreak / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= 0) return;
                  setDurations({
                    ...durations,
                    longBreak: val * 60,
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
