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
          <p>
            作業時間・休憩時間は 下記からタイマー停止中に自由に変更できます。
            <br />
            012みたいに0が先頭についちゃっても大丈夫です。
          </p>
          <p className="settings-title">タイマー設定 (分)</p>
          <div className="settings-grid">
            <div className="setting-item">
              <label>作業</label>
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
              <label>休憩</label>
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
              <label>長い休憩</label>
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
