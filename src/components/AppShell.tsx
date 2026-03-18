import type { CSSProperties, ReactNode } from "react";
import BottomNav from "./BottomNav";

/**
 * AppShell – layout wrapper for all pages.
 * - Renders children content.
 * - Pins BottomNav to bottom by default.
 * - Can hide nav on certain pages via prop.
 * - Provides safe-area padding.
 */
export type AppShellProps = {
  children: ReactNode;
  hideNav?: boolean;
  style?: CSSProperties;
  className?: string;
};

export default function AppShell({ children, hideNav, style, className }: AppShellProps) {
  return (
    <div className={className} style={{ ...rootStyle, ...style }}>
      <main
        style={{
          ...mainStyle,
          paddingBottom: hideNav ? 0 : "90px",
        }}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#0B0C2A",
  color: "#fff",
};

const mainStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  zIndex: 1,
  backgroundColor: "#0B0C2A",
};
