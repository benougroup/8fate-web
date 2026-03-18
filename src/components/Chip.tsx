import React from "react";


/**
 * Chip – small labeled pill for tags, statuses, compatibilities, etc.
 */
export type ChipProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  style?: React.CSSProperties;
  className?: string;
};


export default function Chip({ children, variant = "default", style, className }: ChipProps) {
  return (
    <span
      className={className}
      style={{
        ...base,
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}


const base: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.2,
};


const variants: Record<string, React.CSSProperties> = {
  default: { background: "#f2f2f2", color: "#333" },
  success: { background: "#eefbea", color: "#187a00", border: "1px solid #cfeccc" },
  warning: { background: "#fff8e5", color: "#8a6d00", border: "1px solid #f2dea0" },
  danger: { background: "#fff5f5", color: "#8a1f1f", border: "1px solid #f3c2c2" },
  outline: { background: "#fff", color: "#333", border: "1px solid #ddd" },
};