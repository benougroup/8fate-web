import * as React from "react";
import { Stack } from "./Stack";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Icon or illustration */
  icon?: React.ReactNode;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Action button text */
  actionText?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Custom className */
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <Stack
      gap="lg"
      align="center"
      className={`revamp-emptyState ${className}`}
      style={{
        padding: "var(--space-xl)",
        textAlign: "center",
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: "48px",
            opacity: 0.5,
            filter: "grayscale(50%)",
          }}
        >
          {icon}
        </div>
      )}
      <Stack gap="xs" align="center">
        <h3
          style={{
            margin: 0,
            fontSize: "var(--fs-lg)",
            fontWeight: 600,
            color: "var(--c-text)",
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: "var(--fs-sm)",
              color: "var(--c-muted)",
              maxWidth: "400px",
            }}
          >
            {description}
          </p>
        )}
      </Stack>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </Stack>
  );
};

EmptyState.displayName = "EmptyState";
