import React from "react";

import type { CSSProperties } from "react";

/**
 * StatusBadge – shows Free or Premium status.
 * Used in Settings, Payments, Dashboard headers.
 */
export type StatusBadgeProps = {
  status: "premium" | "free";
  style?: CSSProperties;
  className?: string;
};


export default function StatusBadge({ status, style, className }: StatusBadgeProps) {
  const isPremium = status === "premium";


  return (
    <div
      className={className}
      style={{
        ...root,
        ...(isPremium ? premium : free),
        ...style,
      }}
    >
      <span
        style={{
          ...dot,
          background: isPremium ? "#f0b64d" : "rgba(252, 233, 199, 0.4)",
          boxShadow: isPremium ? "0 0 10px rgba(240, 182, 77, 0.5)" : undefined,
        }}
      />
      {isPremium ? "Premium active" : "Free plan"}
    </div>
  );
}


const root: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 14px",
  borderRadius: 999,
  border: "1px solid rgba(247, 216, 148, 0.25)",
  fontWeight: 600,
  fontSize: 14,
  background: "rgba(7, 12, 28, 0.7)",
  color: "rgba(252, 233, 199, 0.9)",
};


const premium: CSSProperties = {
  background: "rgba(32, 25, 6, 0.82)",
  color: "#f5d473",
  border: "1px solid rgba(245, 212, 115, 0.55)",
  boxShadow: "0 12px 26px rgba(245, 212, 115, 0.28)",
};


const free: CSSProperties = {
  background: "rgba(15, 24, 52, 0.7)",
  color: "rgba(252, 233, 199, 0.85)",
};


const dot: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  display: "inline-block",
};