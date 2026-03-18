import * as React from "react";

export interface MetadataItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export interface MetadataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Metadata items */
  items: MetadataItem[];
  /** Card variant */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /** Layout */
  layout?: "vertical" | "horizontal" | "grid";
  /** Icon */
  icon?: React.ReactNode;
}

export const MetadataCard: React.FC<MetadataCardProps> = ({
  title,
  items,
  variant = "default",
  layout = "vertical",
  icon,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    default: {
      background: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    success: {
      background: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 0.3)",
    },
    warning: {
      background: "rgba(251, 146, 60, 0.1)",
      borderColor: "rgba(251, 146, 60, 0.3)",
    },
    error: {
      background: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    },
    info: {
      background: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
  };

  const layoutStyles = {
    vertical: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    horizontal: {
      display: "flex",
      flexDirection: "row" as const,
      gap: "16px",
      flexWrap: "wrap" as const,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "12px",
    },
  };

  return (
    <div
      className={`revamp-metadataCard ${className}`}
      style={{
        padding: "16px",
        borderRadius: "var(--r-lg)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${variantStyles[variant].borderColor}`,
        background: variantStyles[variant].background,
        ...style,
      }}
      {...props}
    >
      {(title || icon) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {icon && (
            <div style={{ fontSize: "20px", opacity: 0.8 }}>{icon}</div>
          )}
          {title && (
            <h4
              style={{
                margin: 0,
                fontSize: "var(--fs-md)",
                fontWeight: 600,
                color: "var(--c-text)",
              }}
            >
              {title}
            </h4>
          )}
        </div>
      )}
      <div style={layoutStyles[layout]}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: layout === "vertical" ? "flex-start" : "center",
              gap: "8px",
              ...(layout === "horizontal" && { flex: "1 1 auto" }),
            }}
          >
            {item.icon && (
              <div
                style={{
                  flexShrink: 0,
                  fontSize: "16px",
                  opacity: 0.7,
                }}
              >
                {item.icon}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "var(--fs-xs)",
                  color: "var(--c-muted)",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: 500,
                  color: "var(--c-text)",
                }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MetadataCard.displayName = "MetadataCard";
