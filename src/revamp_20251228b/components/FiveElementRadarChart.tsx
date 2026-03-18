import * as React from "react";

export type FiveElementValues = {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
};

type FiveElementRadarChartProps = {
  values: FiveElementValues;
  labels?: [string, string, string, string, string];
  size?: number;
  className?: string;
};

const DEFAULT_LABELS: FiveElementRadarChartProps["labels"] = [
  "Wood",
  "Fire",
  "Earth",
  "Metal",
  "Water",
];

const clampValue = (value: number) => Math.max(0, Math.min(100, value));

export function FiveElementRadarChart({
  values,
  labels = DEFAULT_LABELS,
  size = 220,
  className,
}: FiveElementRadarChartProps) {
  const center = size / 2;
  const padding = size * 0.12;
  const radius = center - padding;
  const labelOffset = size * 0.12;
  const angles = Array.from({ length: 5 }, (_, index) =>
    (Math.PI * 2 * index) / 5 - Math.PI / 2,
  );

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const axisPoints = angles.map((angle) => ({
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }));

  const valuePoints = [
    values.wood,
    values.fire,
    values.earth,
    values.metal,
    values.water,
  ].map((value, index) => {
    const safeValue = clampValue(value) / 100;
    const angle = angles[index];
    return {
      x: center + Math.cos(angle) * radius * safeValue,
      y: center + Math.sin(angle) * radius * safeValue,
    };
  });

  const pointString = (points: Array<{ x: number; y: number }>) =>
    points.map((point) => `${point.x},${point.y}`).join(" ");

  const classes = ["revamp-radarChart", className].filter(Boolean).join(" ");

  return (
    <svg
      className={classes}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Five element radar chart"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="revamp-radarChartGrid">
        {gridLevels.map((level) => {
          const levelPoints = angles.map((angle) => ({
            x: center + Math.cos(angle) * radius * level,
            y: center + Math.sin(angle) * radius * level,
          }));
          return (
            <polygon
              key={`grid-${level}`}
              points={pointString(levelPoints)}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {axisPoints.map((point, index) => (
          <line
            key={`axis-${index}`}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            className="revamp-radarChartAxis"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <polygon
        className="revamp-radarChartPolygon"
        points={pointString(valuePoints)}
        vectorEffect="non-scaling-stroke"
      />
      {valuePoints.map((point, index) => (
        <circle
          key={`point-${index}`}
          className="revamp-radarChartPoint"
          cx={point.x}
          cy={point.y}
          r={size * 0.02}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {labels.map((label, index) => {
        const angle = angles[index];
        const x = center + Math.cos(angle) * (radius + labelOffset);
        const y = center + Math.sin(angle) * (radius + labelOffset);
        const textAnchor =
          Math.cos(angle) > 0.2 ? "start" : Math.cos(angle) < -0.2 ? "end" : "middle";
        const dominantBaseline =
          Math.sin(angle) > 0.2
            ? "hanging"
            : Math.sin(angle) < -0.2
              ? "alphabetic"
              : "middle";

        return (
          <text
            key={`label-${label}`}
            className="revamp-radarChartLabel"
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
