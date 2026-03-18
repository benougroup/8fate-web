import * as React from "react";

export type RoundedBarSeriesItem = {
  label: string;
  value: number;
};

type RoundedBarChartProps = {
  series: RoundedBarSeriesItem[];
  max?: number;
  showLabels?: boolean;
  className?: string;
};

const clampValue = (value: number) => Math.max(0, value);

const roundedTopPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  if (height <= 0) {
    return "";
  }

  const safeRadius = Math.min(radius, width / 2, height);
  const right = x + width;
  const bottom = y + height;

  return [
    `M ${x} ${bottom}`,
    `L ${x} ${y + safeRadius}`,
    `Q ${x} ${y} ${x + safeRadius} ${y}`,
    `L ${right - safeRadius} ${y}`,
    `Q ${right} ${y} ${right} ${y + safeRadius}`,
    `L ${right} ${bottom}`,
    "Z",
  ].join(" ");
};

export function RoundedBarChart({
  series,
  max,
  showLabels = false,
  className,
}: RoundedBarChartProps) {
  const safeSeries = series.length > 0 ? series : [];
  const computedMax = Math.max(
    max ?? 0,
    ...safeSeries.map((item) => clampValue(item.value)),
    1,
  );

  const barWidth = 28;
  const gap = 18;
  const paddingX = 16;
  const chartHeight = 120;
  const labelHeight = showLabels ? 22 : 0;
  const paddingTop = 10;
  const paddingBottom = 8;
  const availableHeight = chartHeight - paddingTop - paddingBottom;
  const viewBoxWidth =
    paddingX * 2 + safeSeries.length * barWidth + Math.max(safeSeries.length - 1, 0) * gap;
  const viewBoxHeight = chartHeight + labelHeight;

  const classes = ["revamp-roundedBarChart", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      role="img"
      aria-label="Rounded bar chart"
      preserveAspectRatio="xMidYMid meet"
    >
      {safeSeries.map((item, index) => {
        const value = clampValue(item.value);
        const barHeight = (value / computedMax) * availableHeight;
        const x = paddingX + index * (barWidth + gap);
        const y = paddingTop + (availableHeight - barHeight);
        const path = roundedTopPath(x, y, barWidth, barHeight, barWidth / 2);

        return (
          <g key={item.label}>
            {path ? <path className="revamp-roundedBarChartBar" d={path} /> : null}
            {showLabels ? (
              <text
                className="revamp-roundedBarChartLabel"
                x={x + barWidth / 2}
                y={chartHeight + labelHeight * 0.65}
                textAnchor="middle"
              >
                {item.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
