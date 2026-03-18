import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Dot indicator */
  dot?: boolean;
  /** Children */
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: {
      padding: "2px 8px",
      fontSize: "var(--fs-xs)",
      height: "20px",
    },
    md: {
      padding: "4px 10px",
      fontSize: "var(--fs-sm)",
      height: "24px",
    },
    lg: {
      padding: "6px 12px",
      fontSize: "var(--fs-md)",
      height: "28px",
    },
  };

  const variantStyles = {
    default: {
      background: "rgba(255, 255, 255, 0.1)",
      color: "var(--c-text)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    primary: {
      background: "var(--c-accent)",
      color: "white",
      border: "1px solid var(--c-accent)",
    },
    success: {
      background: "rgba(34, 197, 94, 0.2)",
      color: "rgb(34, 197, 94)",
      border: "1px solid rgba(34, 197, 94, 0.5)",
    },
    warning: {
      background: "rgba(251, 146, 60, 0.2)",
      color: "rgb(251, 146, 60)",
      border: "1px solid rgba(251, 146, 60, 0.5)",
    },
    error: {
      background: "rgba(239, 68, 68, 0.2)",
      color: "rgb(239, 68, 68)",
      border: "1px solid rgba(239, 68, 68, 0.5)",
    },
    info: {
      background: "rgba(59, 130, 246, 0.2)",
      color: "rgb(59, 130, 246)",
      border: "1px solid rgba(59, 130, 246, 0.5)",
    },
  };

  return (
    <span
      className={`revamp-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: dot ? "6px" : 0,
        borderRadius: "var(--r-full)",
        fontWeight: 500,
        backdropFilter: "blur(10px)",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "currentColor",
          }}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
