import * as React from "react";

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Toggle size */
  size?: "sm" | "md" | "lg";
  /** Label text */
  label?: React.ReactNode;
  /** Label position */
  labelPosition?: "left" | "right";
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ size = "md", label, labelPosition = "right", className = "", disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: { width: "36px", height: "20px", dotSize: "14px", fontSize: "var(--fs-xs)" },
      md: { width: "44px", height: "24px", dotSize: "18px", fontSize: "var(--fs-sm)" },
      lg: { width: "52px", height: "28px", dotSize: "22px", fontSize: "var(--fs-md)" },
    };

    const { width, height, dotSize, fontSize } = sizeStyles[size];

    const trackStyle: React.CSSProperties = {
      width,
      height,
      borderRadius: height,
      background: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.3s ease",
      position: "relative",
      flexShrink: 0,
    };

    const labelStyle: React.CSSProperties = {
      fontSize,
      color: disabled ? "var(--c-muted)" : "var(--c-text)",
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
      marginLeft: labelPosition === "right" ? "8px" : 0,
      marginRight: labelPosition === "left" ? "8px" : 0,
    };

    const content = (
      <>
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="revamp-toggle-input"
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
          }}
          {...props}
        />
        <span className="revamp-toggle-track" style={trackStyle}>
          <span
            className="revamp-toggle-dot"
            style={{
              position: "absolute",
              top: "50%",
              left: "3px",
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: "white",
              transform: "translateY(-50%)",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          />
        </span>
        <style>{`
          .revamp-toggle-input:checked + .revamp-toggle-track {
            background: var(--c-accent);
            border-color: var(--c-accent);
          }
          .revamp-toggle-input:checked + .revamp-toggle-track .revamp-toggle-dot {
            left: calc(100% - ${dotSize} - 3px);
          }
          .revamp-toggle-input:focus + .revamp-toggle-track {
            box-shadow: 0 0 0 2px var(--c-accent-glow);
          }
        `}</style>
      </>
    );

    if (label) {
      return (
        <label
          className={`revamp-toggle-wrapper ${className}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            flexDirection: labelPosition === "left" ? "row-reverse" : "row",
          }}
        >
          {labelPosition === "left" && <span style={labelStyle}>{label}</span>}
          {content}
          {labelPosition === "right" && <span style={labelStyle}>{label}</span>}
        </label>
      );
    }

    return (
      <label className={`revamp-toggle-wrapper ${className}`} style={{ display: "inline-block", cursor: disabled ? "not-allowed" : "pointer" }}>
        {content}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
