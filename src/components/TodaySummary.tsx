interface props {
  getTodayMinutesByCategory: () => { categoryName: string; minutes: number }[];
  roundDecimal: (num: number, unit: number) => number;
}

export function TodaySummary({
  getTodayMinutesByCategory,
  roundDecimal,
}: props) {
  return (
    <>
      <h2>今日の作業時間</h2>

      <ul>
        {getTodayMinutesByCategory().map((item) => (
          <li key={item.categoryName}>
            {item.categoryName}：{roundDecimal(item.minutes, 0.1)} 分
          </li>
        ))}
      </ul>
    </>
  );
}
