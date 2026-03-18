import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Polymorphic element type */
  as?: "section" | "div" | "article";
  /** Card variant */
  variant?: "default" | "elevated" | "outlined" | "flat";
  /** Children */
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ as: Component = "section", variant = "default", className = "", style, children, ...props }) => {
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
    <Component
      className={`revamp-card ${className}`}
      style={{
        borderRadius: "var(--r-lg)",
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-card-header ${className}`}
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

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-card-body ${className}`}
    style={{
      padding: "16px",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  style,
  children,
  ...props
}) => (
  <div
    className={`revamp-card-footer ${className}`}
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

CardHeader.displayName = "Card.Header";
CardBody.displayName = "Card.Body";
CardFooter.displayName = "Card.Footer";

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.displayName = "Card";
