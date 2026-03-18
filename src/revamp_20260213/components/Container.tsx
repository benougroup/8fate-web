import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width size */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  /** Center the container */
  center?: boolean;
  /** Padding */
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Children */
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  size = "lg",
  center = true,
  padding = "md",
  className = "",
  style,
  children,
  ...props
}) => {
  const sizeValues = {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    full: "100%",
  };

  const paddingValues = {
    none: "0",
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
  };

  return (
    <div
      className={`revamp-container ${className}`}
      style={{
        maxWidth: sizeValues[size],
        margin: center ? "0 auto" : undefined,
        padding: paddingValues[padding],
        width: "100%",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = "Container";
