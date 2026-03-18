import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Select variant style */
  variant?: "default" | "filled" | "outline";
  /** Select size */
  size?: "sm" | "md" | "lg";
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Options */
  options?: SelectOption[];
  /** Placeholder */
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = "default",
      size = "md",
      error = false,
      fullWidth = false,
      options = [],
      placeholder,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: {
        height: "36px",
        padding: "0 32px 0 14px",
        fontSize: "var(--fs-sm)",
      },
      md: {
        height: "44px",
        padding: "0 36px 0 16px",
        fontSize: "var(--fs-md)",
      },
      lg: {
        height: "52px",
        padding: "0 40px 0 18px",
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
      cursor: disabled ? "not-allowed" : "pointer",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.6)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      ...(error && {
        borderColor: "var(--c-error)",
        boxShadow: "0 0 0 1px var(--c-error)",
      }),
    };

    const focusStyle = !disabled && !error ? {
      borderColor: "var(--c-accent)",
      boxShadow: "0 0 0 1px var(--c-accent)",
    } : {};

    return (
      <select
        ref={ref}
        disabled={disabled}
        className={`revamp-select ${className}`}
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
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.length > 0
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                style={{
                  background: "var(--c-bg)",
                  color: "var(--c-text)",
                }}
              >
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "Select";
