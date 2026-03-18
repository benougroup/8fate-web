import * as React from "react";

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left icon or element */
  startAdornment?: React.ReactNode;
  /** Right icon or element */
  endAdornment?: React.ReactNode;
  /** Title */
  title?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Clickable */
  onClick?: () => void;
  /** Disabled */
  disabled?: boolean;
  /** Children (overrides title/description) */
  children?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  startAdornment,
  endAdornment,
  title,
  description,
  onClick,
  disabled = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const isClickable = !!onClick && !disabled;

  return (
    <div
      className={`revamp-listItem ${className}`}
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        cursor: isClickable ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.background = "transparent";
        }
      }}
      {...props}
    >
      {startAdornment && (
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {startAdornment}
        </div>
      )}
      {children || (
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <div
              style={{
                fontSize: "var(--fs-md)",
                fontWeight: 500,
                color: "var(--c-text)",
                marginBottom: description ? "4px" : 0,
              }}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--c-muted)",
              }}
            >
              {description}
            </div>
          )}
        </div>
      )}
      {endAdornment && (
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {endAdornment}
        </div>
      )}
    </div>
  );
};

ListItem.displayName = "ListItem";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List items */
  children: React.ReactNode;
  /** Divider between items */
  divider?: boolean;
  /** Glass background */
  glass?: boolean;
}

export const List: React.FC<ListProps> = ({
  children,
  divider = true,
  glass = true,
  className = "",
  style,
  ...props
}) => {
  return (
    <div
      className={`revamp-list ${className}`}
      style={{
        ...(glass && {
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

List.displayName = "List";
List.Item = ListItem;
