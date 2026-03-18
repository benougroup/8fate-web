import * as React from "react";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive) */
  cols?: number | { xs?: number; sm?: number; md?: number; lg?: number };
  /** Gap between items */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Align items */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify items */
  justify?: "start" | "center" | "end" | "stretch";
  /** Children */
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = "md",
  align = "stretch",
  justify = "stretch",
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
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
  };

  const justifyValues = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
  };

  // Handle responsive columns
  const getGridTemplateColumns = () => {
    if (typeof cols === "number") {
      return `repeat(${cols}, 1fr)`;
    }

    // Responsive columns
    const { xs = 1, sm, md, lg } = cols;
    return `repeat(${xs}, 1fr)`;
  };

  const getResponsiveStyles = () => {
    if (typeof cols === "number") return "";

    const { xs = 1, sm, md, lg } = cols;
    let styles = "";

    if (sm) {
      styles += `
        @media (min-width: 640px) {
          .revamp-grid-responsive {
            grid-template-columns: repeat(${sm}, 1fr);
          }
        }
      `;
    }

    if (md) {
      styles += `
        @media (min-width: 768px) {
          .revamp-grid-responsive {
            grid-template-columns: repeat(${md}, 1fr);
          }
        }
      `;
    }

    if (lg) {
      styles += `
        @media (min-width: 1024px) {
          .revamp-grid-responsive {
            grid-template-columns: repeat(${lg}, 1fr);
          }
        }
      `;
    }

    return styles;
  };

  const isResponsive = typeof cols === "object";
  const gridClass = isResponsive ? "revamp-grid-responsive" : "";

  return (
    <>
      <div
        className={`revamp-grid ${gridClass} ${className}`}
        style={{
          display: "grid",
          gridTemplateColumns: getGridTemplateColumns(),
          gap: gapValues[gap],
          alignItems: alignValues[align],
          justifyItems: justifyValues[justify],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
      {isResponsive && <style>{getResponsiveStyles()}</style>}
    </>
  );
};

Grid.displayName = "Grid";
