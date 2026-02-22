const FONT_UI =
  "'Syne', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

interface Props {
  getTodayMinutesByCategory: () => { categoryName: string; minutes: number }[];
  roundDecimal: (num: number, unit: number) => number;
}

export function TodaySummary({
  getTodayMinutesByCategory,
  roundDecimal,
}: Props) {
  const items = getTodayMinutesByCategory();

  return (
    <>
      <h2>今日の作業時間</h2>

      <ul>
        {items.length === 0 ? (
          <li
            style={{
              fontFamily: FONT_UI,
              color: "var(--text-tertiary)",
              fontSize: "0.88rem",
              textAlign: "center",
              border: "none",
              background: "transparent",
            }}
          >
            まだ記録がありません
          </li>
        ) : (
          items.map((item) => (
            <li key={item.categoryName}>
              {/* カテゴリ名: UI フォント */}
              <span style={{ fontFamily: FONT_UI, fontWeight: 500 }}>
                {item.categoryName}
              </span>

              <span
                style={{
                  fontFamily: FONT_UI,
                  color: "var(--text-tertiary)",
                  margin: "0 6px",
                }}
              >
                :
              </span>

              {/* 数値部分: Mono フォント */}
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 600,
                  color: "var(--accent-primary)",
                  fontSize: "0.95rem",
                }}
              >
                {roundDecimal(item.minutes, 0.1)}
              </span>

              <span
                style={{
                  fontFamily: FONT_UI,
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginLeft: "3px",
                }}
              >
                分
              </span>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
