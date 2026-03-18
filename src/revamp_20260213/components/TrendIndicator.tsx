import React from "react";
import type { TrendIndicator as TrendType } from "../services/mock/baziTypes";

type TrendIndicatorProps = {
  trend: TrendType;
  size?: "sm" | "md" | "lg";
};

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  trend,
  size = "md",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "20px",
    lg: "24px",
  };

  const colorMap = {
    up: "var(--color-success)",
    neutral: "var(--color-warning)",
    down: "var(--color-error)",
  };

  const iconMap = {
    up: "↑",
    neutral: "→",
    down: "↓",
  };

  return (
    <span
      style={{
        fontSize: sizeMap[size],
        color: colorMap[trend],
        fontWeight: "bold",
        display: "inline-block",
        minWidth: sizeMap[size],
        textAlign: "center",
      }}
      aria-label={`Trend: ${trend}`}
    >
      {iconMap[trend]}
    </span>
  );
};
