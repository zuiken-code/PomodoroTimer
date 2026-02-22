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

// フォント定数
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const FONT_UI = "'Syne', 'Noto Sans JP', -apple-system, sans-serif";

export function SetInterval({ timer, durations, setDurations }: Props) {
  const picSelections = {
    work: String(durations.work / 60),
    break: String(durations.break / 60),
    longBreak: String(durations.longBreak / 60),
  };

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
                // ← ここにstyleを直接渡してフォント継承させる
                style={{
                  fontFamily: FONT_MONO,
                  color: "var(--text-primary)",
                }}
              >
                {Object.keys(selections).map((name) => (
                  <Picker.Column key={name} name={name}>
                    {selections[name as keyof typeof selections].map(
                      (option) => (
                        <Picker.Item key={option} value={option}>
                          {/* render props で selected 状態を受け取りスタイルを切り替える */}
                          {({ selected }) => (
                            <div
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: selected ? "28px" : "20px",
                                fontWeight: selected ? 600 : 400,
                                color: selected
                                  ? "var(--text-primary)" // 選択中: 白
                                  : "var(--text-tertiary)", // 非選択: グレー
                                transition: "all 0.2s ease",
                                lineHeight: "50px",
                                textAlign: "center",
                                userSelect: "none",
                              }}
                            >
                              {option}
                            </div>
                          )}
                        </Picker.Item>
                      ),
                    )}
                  </Picker.Column>
                ))}
              </Picker>
            </div>
          </div>

          {/* カラムのラベル */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "8px",
              fontFamily: FONT_UI,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            <span>集中</span>
            <span>休憩</span>
            <span>長休憩</span>
          </div>
        </div>
      )}
    </>
  );
}
