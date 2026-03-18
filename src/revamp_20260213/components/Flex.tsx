import * as React from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  /** Align items */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Justify content */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Gap between items */
  gap?: "xs" | "sm" | "md" | "lg" | "xl" | string;
  /** Wrap items */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  /** Full width */
  fullWidth?: boolean;
  /** Children */
  children: React.ReactNode;
}

export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  align = "stretch",
  justify = "start",
  gap = "md",
  wrap = "nowrap",
  fullWidth = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const gapValues = {
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
  };

  const alignValues = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };

  const justifyValues = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  const gapValue = gapValues[gap as keyof typeof gapValues] || gap;

  return (
    <div
      className={`revamp-flex ${className}`}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: alignValues[align],
        justifyContent: justifyValues[justify],
        gap: gapValue,
        flexWrap: wrap,
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Flex.displayName = "Flex";
