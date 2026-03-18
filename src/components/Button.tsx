import type { ButtonHTMLAttributes, CSSProperties, MouseEvent, ReactNode } from "react";

/**
 * Button – unified button component with variants and sizes.
 * Replaces ad-hoc inline styles in pages.
 */
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "style" | "className"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "pill";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  onClick,
  style,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...rest}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(disabled ? disabledStyle : null),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const baseStyle: CSSProperties = {
  cursor: "pointer",
  borderRadius: 12,
  fontWeight: 600,
  border: "none",
  outline: "none",
  letterSpacing: 0.3,
  transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, CSSProperties> = {
  sm: { fontSize: 12, padding: "6px 14px", minHeight: 32 },
  md: { fontSize: 14, padding: "8px 18px", minHeight: 40 },
  lg: { fontSize: 16, padding: "10px 22px", minHeight: 48 },
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #f5d473 0%, #f0b64d 100%)",
    color: "#1b132c",
    boxShadow: "0 14px 32px rgba(240, 182, 77, 0.35)",
  },
  secondary: {
    background: "rgba(15, 24, 52, 0.82)",
    border: "1px solid rgba(248, 223, 167, 0.45)",
    color: "#fce9c7",
    boxShadow: "0 10px 28px rgba(7, 12, 28, 0.45)",
  },
  ghost: {
    background: "transparent",
    border: "1px solid rgba(252, 233, 199, 0.3)",
    color: "#fce9c7",
  },
  danger: {
    background: "rgba(63, 16, 24, 0.72)",
    border: "1px solid rgba(255, 116, 134, 0.5)",
    color: "#ff9ca7",
    boxShadow: "0 10px 24px rgba(63, 16, 24, 0.4)",
  },
  pill: {
    background: "rgba(15, 24, 52, 0.78)",
    border: "1px solid rgba(252, 233, 199, 0.22)",
    borderRadius: 999,
    color: "#fce9c7",
    fontWeight: 600,
  },
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  cursor: "not-allowed",
};
