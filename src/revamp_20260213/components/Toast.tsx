import * as React from "react";

export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast variant */
  variant?: "info" | "success" | "warning" | "error";
  /** Duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** On close callback */
  onClose?: () => void;
  /** Show close button */
  showClose?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = "info",
  duration = 3000,
  onClose,
  showClose = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const variantStyles = {
    info: {
      background: "rgba(59, 130, 246, 0.9)",
      border: "1px solid rgba(59, 130, 246, 1)",
    },
    success: {
      background: "rgba(34, 197, 94, 0.9)",
      border: "1px solid rgba(34, 197, 94, 1)",
    },
    warning: {
      background: "rgba(251, 146, 60, 0.9)",
      border: "1px solid rgba(251, 146, 60, 1)",
    },
    error: {
      background: "rgba(239, 68, 68, 0.9)",
      border: "1px solid rgba(239, 68, 68, 1)",
    },
  };

  return (
    <>
      <div
        className="revamp-toast"
        style={{
          ...variantStyles[variant],
          backdropFilter: "blur(10px)",
          borderRadius: "var(--r-md)",
          padding: "12px 16px",
          color: "white",
          fontSize: "var(--fs-sm)",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          minWidth: "280px",
          maxWidth: "480px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.3s ease",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <span style={{ flex: 1 }}>{message}</span>
        {showClose && (
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            ✕
          </button>
        )}
      </div>
    </>
  );
};

Toast.displayName = "Toast";

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  /** Position */
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  /** Children (Toast components) */
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  children,
}) => {
  const positionStyles = {
    "top-left": { top: "20px", left: "20px" },
    "top-center": { top: "20px", left: "50%", transform: "translateX(-50%)" },
    "top-right": { top: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "bottom-center": { bottom: "20px", left: "50%", transform: "translateX(-50%)" },
    "bottom-right": { bottom: "20px", right: "20px" },
  };

  return (
    <div
      className="revamp-toast-container"
      style={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
};

ToastContainer.displayName = "ToastContainer";
