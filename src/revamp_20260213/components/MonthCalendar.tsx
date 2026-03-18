import React from "react";

type MonthStatus = "favorable" | "unfavorable" | "critical" | "neutral";

type MonthCalendarProps = {
  favorableMonths: number[];
  unfavorableMonths: number[];
  criticalMonths: number[];
  onMonthClick?: (month: number) => void;
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const monthNamesFull = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  favorableMonths,
  unfavorableMonths,
  criticalMonths,
  onMonthClick,
}) => {
  const getMonthStatus = (month: number): MonthStatus => {
    if (criticalMonths.includes(month)) return "critical";
    if (favorableMonths.includes(month)) return "favorable";
    if (unfavorableMonths.includes(month)) return "unfavorable";
    return "neutral";
  };

  const getMonthIcon = (status: MonthStatus): string => {
    switch (status) {
      case "favorable": return "🟢";
      case "unfavorable": return "🔴";
      case "critical": return "⚠️";
      default: return "⚪";
    }
  };

  return (
    <div className="revamp-monthCalendar">
      <div className="revamp-monthCalendar-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const status = getMonthStatus(month);
          const icon = getMonthIcon(status);
          
          return (
            <button
              key={month}
              className={`revamp-monthCalendar-month revamp-monthCalendar-month--${status}`}
              onClick={() => onMonthClick?.(month)}
              title={monthNamesFull[month - 1]}
            >
              <span className="revamp-monthCalendar-icon">{icon}</span>
              <span className="revamp-monthCalendar-name">{monthNames[month - 1]}</span>
            </button>
          );
        })}
      </div>
      
      <div className="revamp-monthCalendar-legend">
        <div className="revamp-monthCalendar-legend-item">
          <span>🟢</span>
          <span>Favorable</span>
        </div>
        <div className="revamp-monthCalendar-legend-item">
          <span>🔴</span>
          <span>Unfavorable</span>
        </div>
        <div className="revamp-monthCalendar-legend-item">
          <span>⚠️</span>
          <span>Critical</span>
        </div>
        <div className="revamp-monthCalendar-legend-item">
          <span>⚪</span>
          <span>Neutral</span>
        </div>
      </div>
    </div>
  );
};
