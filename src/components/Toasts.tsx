import { createContext, useCallback, useContext, useState } from "react";
import type { CSSProperties, ReactNode } from "react";


/**
 * Toasts – lightweight notification system for success/info/warning/error.
 * Usage:
 *   const { push } = useToasts();
 *   push("Saved!", "success");
 */
export type Toast = {
  id: number;
  message: string;
  tone: "success" | "info" | "warning" | "error";
};


export type ToastContextType = {
  push: (message: string, tone?: Toast["tone"]) => void;
};


const ToastContext = createContext<ToastContextType | null>(null);


export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used inside <ToastProvider>");
  return ctx;
}


export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);


  const push = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);


  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={wrap}>
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toast, ...tones[t.tone] }}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


const wrap: CSSProperties = {
  position: "fixed",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  zIndex: 9999,
};


const toast: CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  maxWidth: "80vw",
  textAlign: "center",
};


const tones: Record<Toast["tone"], CSSProperties> = {
  success: { background: "#2ecc71" },
  info: { background: "#3498db" },
  warning: { background: "#f39c12" },
  error: { background: "#e74c3c" },
};