import * as React from "react";

export interface OptionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Option title */
  title: string;
  /** Option description */
  description?: string;
  /** Tags/keywords */
  tags?: string[];
  /** Selected state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Locked state (requires premium) */
  locked?: boolean;
  /** Icon */
  icon?: React.ReactNode;
  /** On select callback */
  onSelect?: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  tags = [],
  selected = false,
  disabled = false,
  locked = false,
  icon,
  onSelect,
  className = "",
  style,
  ...props
}) => {
  const isInteractive = !disabled && !locked && onSelect;

  return (
    <div
      className={`revamp-optionCard ${className}`}
      onClick={isInteractive ? onSelect : undefined}
      style={{
        padding: "16px",
        borderRadius: "var(--r-lg)",
        background: selected
          ? "rgba(var(--c-accent-rgb), 0.15)"
          : "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: selected
          ? "2px solid var(--c-accent)"
          : "1px solid rgba(255, 255, 255, 0.1)",
        cursor: isInteractive ? "pointer" : disabled ? "not-allowed" : "default",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        position: "relative",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isInteractive && !selected) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive && !selected) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }
      }}
      {...props}
    >
      {locked && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            fontSize: "18px",
            opacity: 0.6,
          }}
        >
          🔒
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        {icon && (
          <div
            style={{
              flexShrink: 0,
              fontSize: "24px",
              opacity: 0.8,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: "var(--fs-md)",
              fontWeight: 600,
              color: selected ? "var(--c-accent)" : "var(--c-text)",
              marginBottom: description || tags.length > 0 ? "8px" : 0,
            }}
          >
            {title}
          </h4>
          {description && (
            <p
              style={{
                margin: 0,
                fontSize: "var(--fs-sm)",
                color: "var(--c-muted)",
                marginBottom: tags.length > 0 ? "8px" : 0,
              }}
            >
              {description}
            </p>
          )}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: "2px 8px",
                    borderRadius: "var(--r-full)",
                    fontSize: "var(--fs-xs)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "var(--c-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

OptionCard.displayName = "OptionCard";
