import * as React from "react";

export interface TableColumn<T = any> {
  /** Column key */
  key: string;
  /** Column header */
  header: React.ReactNode;
  /** Cell render function */
  render?: (value: any, row: T, index: number) => React.ReactNode;
  /** Column width */
  width?: string;
  /** Align */
  align?: "left" | "center" | "right";
}

export interface TableProps<T = any> {
  /** Table columns */
  columns: TableColumn<T>[];
  /** Table data */
  data: T[];
  /** Row key extractor */
  rowKey?: (row: T, index: number) => string | number;
  /** On row click */
  onRowClick?: (row: T, index: number) => void;
  /** Empty state */
  emptyText?: string;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Custom className */
  className?: string;
}

export function Table<T = any>({
  columns,
  data,
  rowKey = (_, index) => index,
  onRowClick,
  emptyText = "No data available",
  striped = false,
  hoverable = true,
  className = "",
}: TableProps<T>) {
  return (
    <div
      className={`revamp-table-container ${className}`}
      style={{
        width: "100%",
        overflowX: "auto",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        borderRadius: "var(--r-lg)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <table
        className="revamp-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--fs-sm)",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {columns.map((column, index) => (
              <th
                key={column.key}
                style={{
                  padding: "14px 16px",
                  textAlign: column.align || "left",
                  fontWeight: 600,
                  color: "var(--c-text)",
                  background: "rgba(255, 255, 255, 0.05)",
                  width: column.width,
                  whiteSpace: "nowrap",
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--c-muted)",
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowKey(row, rowIndex)}
                onClick={() => onRowClick?.(row, rowIndex)}
                style={{
                  borderBottom:
                    rowIndex < data.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "none",
                  background: striped && rowIndex % 2 === 1
                    ? "rgba(255, 255, 255, 0.02)"
                    : "transparent",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (hoverable) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (hoverable) {
                    e.currentTarget.style.background =
                      striped && rowIndex % 2 === 1
                        ? "rgba(255, 255, 255, 0.02)"
                        : "transparent";
                  }
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: "12px 16px",
                      textAlign: column.align || "left",
                      color: "var(--c-text)",
                    }}
                  >
                    {column.render
                      ? column.render((row as any)[column.key], row, rowIndex)
                      : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = "Table";
