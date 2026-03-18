import type { CSSProperties } from "react";
import Button from "./Button";
import ErrorBox from "./ErrorBox";

/**
 * ErrorFallback – friendly UI to show when ErrorBoundary catches an error.
 * - Provides retry and go-home actions.
 */
export type ErrorFallbackProps = {
  error?: Error;
  onRetry?: () => void;
  onHome?: () => void;
};


export default function ErrorFallback({ error, onRetry, onHome }: ErrorFallbackProps) {
  return (
    <div style={wrap}>
      <div style={container}>
        <h2 style={{ color: "#F4D73E", marginBottom: 12 }}>Something went wrong</h2>
        <ErrorBox
          tone="error"
          message={error?.message || "An unexpected error occurred."}
          style={{ width: "100%", marginBottom: 20 }}
        />
        <div style={{ display: "flex", gap: 12 }}>
          {onRetry && <Button variant="primary" onClick={onRetry}>Try Again</Button>}
          {onHome && <Button variant="ghost" onClick={onHome}>Go Home</Button>}
        </div>
      </div>
    </div>
  );
}


const wrap: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#0B0C2A",
  padding: 20,
};
const container: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  textAlign: "center",
};
