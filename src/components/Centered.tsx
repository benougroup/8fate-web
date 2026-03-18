import type { CSSProperties, ReactNode } from "react";

/**
 * Centered – flex/grid helper to center children both vertically and horizontally.
 * - Useful for loading spinners, empty states, and fallback messages.
 */
export type CenteredProps = {
  children: ReactNode;
  fullHeight?: boolean; // if true, takes full viewport height
  style?: CSSProperties;
  className?: string;
};


export default function Centered({ children, fullHeight = true, style, className }: CenteredProps) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: fullHeight ? "100vh" : undefined,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}