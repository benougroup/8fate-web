import * as React from "react";

export interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card header */
  header?: React.ReactNode;
  /** Card footer */
  footer?: React.ReactNode;
  /** Card variant */
  variant?: "default" | "elevated" | "outlined" | "flat";
  /** Children (card body) */
  children: React.ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  header,
  footer,
  variant = "default",
  className = "",
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    default: {
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "none",
    },
    elevated: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    },
    outlined: {
      background: "transparent",
      backdropFilter: "none",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "none",
    },
    flat: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "none",
      border: "none",
      boxShadow: "none",
    },
  };

  return (
    <div
      className={`revamp-contentCard ${className}`}
      style={{
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {header && (
        <div
          className="revamp-contentCard-header"
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          {header}
        </div>
      )}
      <div
        className="revamp-contentCard-body"
        style={{
          padding: "16px",
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          className="revamp-contentCard-footer"
          style={{
            padding: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

ContentCard.displayName = "ContentCard";

// Compound components
export const ContentCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-contentCard-header ${className}`}
    style={{
      padding: "16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.03)",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const ContentCardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-contentCard-body ${className}`}
    style={{
      padding: "16px",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const ContentCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-contentCard-footer ${className}`}
    style={{
      padding: "16px",
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.03)",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

ContentCardHeader.displayName = "ContentCard.Header";
ContentCardBody.displayName = "ContentCard.Body";
ContentCardFooter.displayName = "ContentCard.Footer";
