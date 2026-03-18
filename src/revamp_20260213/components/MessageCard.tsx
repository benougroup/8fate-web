import * as React from "react";

export interface MessageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message text */
  message: React.ReactNode;
  /** Message variant */
  variant?: "default" | "quote" | "tip" | "warning" | "success";
  /** Icon */
  icon?: React.ReactNode;
  /** Author/source */
  author?: string;
  /** Show quotation marks */
  showQuotes?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  variant = "default",
  icon,
  author,
  showQuotes = false,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    default: {
      background: "rgba(255, 255, 255, 0.05)",
      borderLeft: "4px solid rgba(255, 255, 255, 0.3)",
    },
    quote: {
      background: "rgba(255, 255, 255, 0.03)",
      borderLeft: "4px solid var(--c-accent)",
    },
    tip: {
      background: "rgba(59, 130, 246, 0.1)",
      borderLeft: "4px solid rgb(59, 130, 246)",
    },
    warning: {
      background: "rgba(251, 146, 60, 0.1)",
      borderLeft: "4px solid rgb(251, 146, 60)",
    },
    success: {
      background: "rgba(34, 197, 94, 0.1)",
      borderLeft: "4px solid rgb(34, 197, 94)",
    },
  };

  return (
    <div
      className={`revamp-messageCard ${className}`}
      style={{
        padding: "16px 20px",
        borderRadius: "var(--r-md)",
        backdropFilter: "blur(10px)",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      <div style={{ display: "flex", gap: "12px" }}>
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
        <div style={{ flex: 1 }}>
          {showQuotes && variant === "quote" && (
            <div
              style={{
                fontSize: "32px",
                lineHeight: "0.5",
                opacity: 0.3,
                marginBottom: "8px",
              }}
            >
              "
            </div>
          )}
          <div
            style={{
              fontSize: "var(--fs-md)",
              lineHeight: 1.6,
              color: "var(--c-text)",
              fontStyle: variant === "quote" ? "italic" : "normal",
            }}
          >
            {message}
          </div>
          {author && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "var(--fs-sm)",
                color: "var(--c-muted)",
                fontStyle: "normal",
              }}
            >
              — {author}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MessageCard.displayName = "MessageCard";
