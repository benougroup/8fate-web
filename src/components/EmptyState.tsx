import type { CSSProperties, ReactNode } from "react";

/**
 * EmptyState – reusable block for when a list or view has no content.
 * - Provides optional title, description, icon, and action button/link.
 */
export type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: CSSProperties;
  className?: string;
};


export default function EmptyState({ title, description, icon, action, style, className }: EmptyStateProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 28,
        color: "rgba(252, 233, 199, 0.78)",
        gap: 16,
        background: "rgba(7, 12, 28, 0.6)",
        borderRadius: 18,
        border: "1px solid rgba(247, 216, 148, 0.14)",
        boxShadow: "0 20px 42px rgba(3, 6, 18, 0.5)",
        ...style,
      }}
    >
      {icon && <div style={{ fontSize: 32 }}>{icon}</div>}
      {title && <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}>{title}</div>}
      {description && <div style={{ fontSize: 14, maxWidth: 400, opacity: 0.85 }}>{description}</div>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}