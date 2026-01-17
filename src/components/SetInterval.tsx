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
          <span className="settings-title">TIMER SETTINGS (MIN)</span>
          <p className="settings-description">
            フローをカスタマイズします。タイマーが停止している間に継続時間を編集します。
          </p>

          <div className="settings-grid">
            <div className="setting-item">
              <label>WORK</label>
              <input
                type="number"
                value={durations.work / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDurations({
                    ...durations,
                    work: val * 60,
                  });
                }}
              />
            </div>
            <div className="setting-item">
              <label>SHORT BREAK</label>
              <input
                type="number"
                value={durations.break / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDurations({
                    ...durations,
                    break: val * 60,
                  });
                }}
              />
            </div>
            <div className="setting-item">
              <label>LONG BREAK</label>
              <input
                type="number"
                value={durations.longBreak / 60}
                onChange={(e) => {
                  const val = Number(e.target.value);
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
