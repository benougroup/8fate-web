import * as React from "react";
import { Stack } from "./Stack";
import { Text } from "./Text";

export interface FormFieldProps {
  /** Field label */
  label?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required indicator */
  required?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Children (input element) */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  fullWidth = false,
  children,
  className = "",
}) => {
  return (
    <Stack
      gap="xs"
      className={`revamp-formField ${className}`}
      style={{
        width: fullWidth ? "100%" : undefined,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "var(--fs-sm)",
            fontWeight: 600,
            color: error ? "var(--c-error)" : "var(--c-text)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {label}
          {required && (
            <span
              style={{
                color: "var(--c-error)",
                fontSize: "var(--fs-md)",
              }}
            >
              *
            </span>
          )}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <Text
          muted={!error}
          style={{
            fontSize: "var(--fs-xs)",
            color: error ? "var(--c-error)" : "var(--c-muted)",
            marginTop: "2px",
          }}
        >
          {error || helperText}
        </Text>
      )}
    </Stack>
  );
};

FormField.displayName = "FormField";
