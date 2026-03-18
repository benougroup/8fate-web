import React from "react";

import type { CSSProperties, ReactNode } from "react";

/**
 * SectionGrid – responsive grid for laying out Card components.
 * - Defaults to min column width 280px.
 * - Auto-fills across available width.
 */
export type SectionGridProps = {
  children: ReactNode;
  minWidth?: number; // min card width in px
  gap?: number; // grid gap in px
  style?: CSSProperties;
  className?: string;
};


export default function SectionGrid({ children, minWidth = 280, gap = 12, style, className }: SectionGridProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}