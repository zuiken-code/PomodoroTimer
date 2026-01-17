import type { TimerState, TimerMode } from "../types";
import Picker from "react-mobile-picker";

interface Props {
  timer: TimerState;
  durations: Record<TimerMode, number>;
  setDurations: (interval: Record<TimerMode, number>) => void;
}

const selections = {
  work: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"],
  break: ["5", "10", "15", "20", "25", "30"],
  longBreak: ["15", "20", "25", "30", "35", "40", "45", "50", "55", "60"],
};

export function SetInterval({ timer, durations, setDurations }: Props) {
  // Pickerの値を durations (秒) から 分に変換して管理
  const picSelections = {
    work: String(durations.work / 60),
    break: String(durations.break / 60),
    longBreak: String(durations.longBreak / 60),
  };

  // Pickerが動いた時の処理
  const handlePickerChange = (values: Record<string, string>) => {
    setDurations({
      work: Number(values.work) * 60,
      break: Number(values.break) * 60,
      longBreak: Number(values.longBreak) * 60,
      stop: 0,
    });
  };

  return (
    <>
      {timer.mode === "stop" && (
        <div className="settings-section">
          <span className="settings-title">時間設定</span>
          <p className="settings-description">
            上もしくは下にある数字をタップして各時間を変更できます。
            <br />
            左から順に「集中時間」「休憩時間」「長めの休憩時間」です。
            <br />
            タイマー起動中は変更できません。
          </p>

          <div className="picker-hud-container">
            <div className="picker-wrapper">
              <div className="picker-highlight-bar" />
              <Picker
                value={picSelections}
                onChange={handlePickerChange}
                height={150}
                itemHeight={50}
              >
                {Object.keys(selections).map((name) => (
                  <Picker.Column key={name} name={name}>
                    {selections[name as keyof typeof selections].map(
                      (option) => (
                        <Picker.Item key={option} value={option}>
                          {option}
                        </Picker.Item>
                      ),
                    )}
                  </Picker.Column>
                ))}
              </Picker>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
