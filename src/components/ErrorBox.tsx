import React from "react";


import type { CSSProperties, ReactNode } from "react";

/**
 * ErrorBox – standardized alert box for errors, warnings, infos, successes.
 */
export type ErrorBoxProps = {
  message: ReactNode;
  tone?: "error" | "warning" | "info" | "success";
  dismissible?: boolean;
  onClose?: () => void;
  style?: CSSProperties;
  className?: string;
};


export default function ErrorBox({ message, tone = "error", dismissible, onClose, style, className }: ErrorBoxProps) {
  const palette: Record<typeof tone, CSSProperties> = {
    error: {
      background: "rgba(62, 32, 32, 0.8)",
      color: "#FF6B6B",
      border: "1px solid rgba(255, 107, 107, 0.4)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    warning: {
      background: "rgba(60, 50, 20, 0.8)",
      color: "#F4D73E",
      border: "1px solid rgba(244, 215, 62, 0.4)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    info: {
      background: "rgba(23, 40, 82, 0.8)",
      color: "#8fc4ff",
      border: "1px solid rgba(143, 196, 255, 0.3)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    success: {
      background: "rgba(20, 53, 40, 0.8)",
      color: "#8be8b6",
      border: "1px solid rgba(139, 232, 182, 0.3)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
  } as const;


  return (
    <div
      className={className}
      style={{
        ...root,
        ...palette[tone],
        ...style,
      }}
      role="alert"
    >
      <div style={{ flex: 1, lineHeight: 1.4 }}>{message}</div>
      {dismissible && (
        <button style={closeBtn} onClick={onClose} aria-label="Dismiss">×</button>
      )}
    </div>
  );
}


const root: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  margin: "8px 0",
  backdropFilter: "blur(10px)",
  fontWeight: 500,
};


const closeBtn: CSSProperties = {
  marginLeft: 12,
  border: "none",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: 20,
  lineHeight: 1,
  opacity: 0.7,
  transition: "opacity 0.2s ease",
  padding: 0,
};
