import * as React from "react";

export interface LoadingProps {
  /** Loading variant */
  variant?: "spinner" | "dots" | "pulse";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Loading text */
  text?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  text,
  fullScreen = false,
}) => {
  const sizeValues = {
    sm: { spinner: "20px", dot: "8px", fontSize: "var(--fs-xs)" },
    md: { spinner: "32px", dot: "12px", fontSize: "var(--fs-sm)" },
    lg: { spinner: "48px", dot: "16px", fontSize: "var(--fs-md)" },
  };

  const { spinner: spinnerSize, dot: dotSize, fontSize } = sizeValues[size];

  const renderSpinner = () => (
    <div
      className="revamp-loading-spinner"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `3px solid rgba(255, 255, 255, 0.2)`,
        borderTop: `3px solid var(--c-accent)`,
        borderRadius: "50%",
        animation: "revamp-spin 0.8s linear infinite",
      }}
    />
  );

  const renderDots = () => (
    <div
      className="revamp-loading-dots"
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: "var(--c-accent)",
            animation: `revamp-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className="revamp-loading-pulse"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        borderRadius: "50%",
        background: "var(--c-accent)",
        animation: "revamp-pulse 1.4s ease-in-out infinite",
      }}
    />
  );

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {variant === "spinner" && renderSpinner()}
      {variant === "dots" && renderDots()}
      {variant === "pulse" && renderPulse()}
      {text && (
        <p
          style={{
            margin: 0,
            fontSize,
            color: "var(--c-text)",
            opacity: 0.8,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <>
        <div
          className="revamp-loading-fullscreen"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9998,
          }}
        >
          {content}
        </div>
        <style>{`
          @keyframes revamp-spin {
            to { transform: rotate(360deg); }
          }
          @keyframes revamp-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {content}
      <style>{`
        @keyframes revamp-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes revamp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </>
  );
};

Loading.displayName = "Loading";
