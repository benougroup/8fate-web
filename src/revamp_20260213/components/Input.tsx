import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input variant style */
  variant?: "default" | "filled" | "outline";
  /** Input size */
  size?: "sm" | "md" | "lg";
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Left icon or element */
  startAdornment?: React.ReactNode;
  /** Right icon or element */
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "md",
      error = false,
      fullWidth = false,
      startAdornment,
      endAdornment,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: {
        height: "36px",
        padding: startAdornment || endAdornment ? "0 12px" : "0 14px",
        fontSize: "var(--fs-sm)",
      },
      md: {
        height: "44px",
        padding: startAdornment || endAdornment ? "0 14px" : "0 16px",
        fontSize: "var(--fs-md)",
      },
      lg: {
        height: "52px",
        padding: startAdornment || endAdornment ? "0 16px" : "0 18px",
        fontSize: "var(--fs-lg)",
      },
    };

    const variantStyles = {
      default: {
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      },
      filled: {
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid transparent",
        backdropFilter: "blur(10px)",
      },
      outline: {
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "none",
      },
    };

    const baseStyle: React.CSSProperties = {
      width: fullWidth ? "100%" : undefined,
      ...sizeStyles[size],
      ...variantStyles[variant],
      borderRadius: "var(--r-md)",
      color: "var(--c-text)",
      fontFamily: "inherit",
      outline: "none",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "text",
      ...(error && {
        borderColor: "var(--c-error)",
        boxShadow: "0 0 0 1px var(--c-error)",
      }),
    };

    const focusStyle = !disabled && !error ? {
      borderColor: "var(--c-accent)",
      boxShadow: "0 0 0 1px var(--c-accent)",
    } : {};

    if (startAdornment || endAdornment) {
      return (
        <div
          className={`revamp-input-wrapper ${className}`}
          style={{
            position: "relative",
            width: fullWidth ? "100%" : undefined,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {startAdornment && (
            <div
              style={{
                position: "absolute",
                left: "12px",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: "var(--c-muted)",
              }}
            >
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className="revamp-input"
            style={{
              ...baseStyle,
              paddingLeft: startAdornment ? "40px" : baseStyle.padding,
              paddingRight: endAdornment ? "40px" : baseStyle.padding,
            }}
            onFocus={(e) => {
              if (!disabled && !error) {
                Object.assign(e.currentTarget.style, focusStyle);
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              if (!disabled && !error) {
                e.currentTarget.style.borderColor = variantStyles[variant].border.split(" ")[2];
                e.currentTarget.style.boxShadow = "none";
              }
              props.onBlur?.(e);
            }}
            {...props}
          />
          {endAdornment && (
            <div
              style={{
                position: "absolute",
                right: "12px",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
                color: "var(--c-muted)",
              }}
            >
              {endAdornment}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`revamp-input ${className}`}
        style={baseStyle}
        onFocus={(e) => {
          if (!disabled && !error) {
            Object.assign(e.currentTarget.style, focusStyle);
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.borderColor = variantStyles[variant].border.split(" ")[2];
            e.currentTarget.style.boxShadow = "none";
          }
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
