import * as React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Checkbox size */
  size?: "sm" | "md" | "lg";
  /** Label text */
  label?: React.ReactNode;
  /** Error state */
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = "md", label, error = false, className = "", disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: { width: "16px", height: "16px", fontSize: "var(--fs-xs)" },
      md: { width: "20px", height: "20px", fontSize: "var(--fs-sm)" },
      lg: { width: "24px", height: "24px", fontSize: "var(--fs-md)" },
    };

    const checkboxStyle: React.CSSProperties = {
      ...sizeStyles[size],
      appearance: "none",
      border: `2px solid ${error ? "var(--c-error)" : "rgba(255, 255, 255, 0.3)"}`,
      borderRadius: "var(--r-sm)",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s ease",
      position: "relative",
      flexShrink: 0,
    };

    const labelStyle: React.CSSProperties = {
      ...sizeStyles[size],
      marginLeft: "8px",
      color: disabled ? "var(--c-muted)" : "var(--c-text)",
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
    };

    if (label) {
      return (
        <label
          className={`revamp-checkbox-wrapper ${className}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="revamp-checkbox"
            style={checkboxStyle}
            {...props}
          />
          <span style={labelStyle}>{label}</span>
          <style>{`
            .revamp-checkbox:checked {
              background: var(--c-accent);
              border-color: var(--c-accent);
            }
            .revamp-checkbox:checked::after {
              content: '';
              position: absolute;
              left: ${size === "sm" ? "4px" : size === "md" ? "6px" : "8px"};
              top: ${size === "sm" ? "1px" : size === "md" ? "2px" : "3px"};
              width: ${size === "sm" ? "4px" : size === "md" ? "5px" : "6px"};
              height: ${size === "sm" ? "8px" : size === "md" ? "10px" : "12px"};
              border: solid white;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
            .revamp-checkbox:focus {
              outline: none;
              box-shadow: 0 0 0 2px var(--c-accent-glow);
            }
          `}</style>
        </label>
      );
    }

    return (
      <>
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={`revamp-checkbox ${className}`}
          style={checkboxStyle}
          {...props}
        />
        <style>{`
          .revamp-checkbox:checked {
            background: var(--c-accent);
            border-color: var(--c-accent);
          }
          .revamp-checkbox:checked::after {
            content: '';
            position: absolute;
            left: ${size === "sm" ? "4px" : size === "md" ? "6px" : "8px"};
            top: ${size === "sm" ? "1px" : size === "md" ? "2px" : "3px"};
            width: ${size === "sm" ? "4px" : size === "md" ? "5px" : "6px"};
            height: ${size === "sm" ? "8px" : size === "md" ? "10px" : "12px"};
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
          .revamp-checkbox:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--c-accent-glow);
          }
        `}</style>
      </>
    );
  }
);

Checkbox.displayName = "Checkbox";
