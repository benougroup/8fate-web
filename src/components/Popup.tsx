import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/Button";
import warningIcon from "@/assets/images/general icons/exclamation_mark_icon.png";
import questionIcon from "@/assets/images/general icons/question_mark_icon.png";

export type PopupTone = "info" | "warning" | "error" | "confirm";

export type PopupAction = {
  label: string;
  onSelect: () => void;
  variant?: "primary" | "secondary" | "ghost";
  autoFocus?: boolean;
  disabled?: boolean;
};

export interface PopupProps {
  open: boolean;
  title: ReactNode;
  message?: ReactNode;
  tone?: PopupTone;
  actions?: PopupAction[];
  onClose?: () => void;
  dismissLabel?: string;
  iconOverride?: string;
  closeOnBackdrop?: boolean;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(11, 12, 42, 0.72)",
  display: "grid",
  placeItems: "center",
  zIndex: 2147483647,
  padding: "32px 24px",
};

const cardStyle: CSSProperties = {
  width: "min(420px, 100%)",
  borderRadius: 20,
  border: "1px solid rgba(70, 98, 112, 0.55)",
  background: "linear-gradient(180deg, rgba(21, 27, 41, 0.96) 0%, rgba(9, 13, 24, 0.98) 100%)",
  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
  padding: "28px 24px",
  color: "rgba(252, 233, 199, 0.95)",
  display: "grid",
  gap: 18,
  justifyItems: "center",
  textAlign: "center",
  maxHeight: "85vh",
  overflow: "hidden",
};

const iconWrapStyle: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "radial-gradient(50% 50% at 50% 50%, rgba(240, 182, 77, 0.32) 0%, rgba(240, 182, 77, 0.05) 68%)",
  boxShadow: "0 18px 36px rgba(240, 182, 77, 0.25)",
};

const titleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.3,
  margin: 0,
};

const messageStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(252, 233, 199, 0.78)",
  width: "100%",
  maxHeight: "55vh",
  overflowY: "auto",
};

const actionsStyle: CSSProperties = {
  display: "grid",
  width: "100%",
  gap: 12,
};

function resolveIcon(tone: PopupTone, override?: string): string {
  if (override) return override;
  if (tone === "info" || tone === "confirm") return questionIcon;
  return warningIcon;
}

export default function Popup({
  open,
  title,
  message,
  tone = "info",
  actions,
  onClose,
  dismissLabel = "OK",
  iconOverride,
  closeOnBackdrop = false,
}: PopupProps) {
  useEffect(() => {
    function onKey(evt: KeyboardEvent) {
      if (!open) return;
      if (evt.key === "Escape") {
        evt.preventDefault();
        onClose?.();
      }
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    return undefined;
  }, [open, onClose]);

  if (!open) return null;

  const resolvedActions = actions && actions.length > 0
    ? actions
    : [{ label: dismissLabel, onSelect: () => onClose?.(), variant: "primary" as const }];

  const content = (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      onClick={(evt) => {
        if (!closeOnBackdrop) return;
        if (evt.target === evt.currentTarget) onClose?.();
      }}
    >
      <div style={cardStyle}>
        <div style={iconWrapStyle}>
          <img src={resolveIcon(tone, iconOverride)} alt="" aria-hidden style={{ width: 40, height: 40 }} />
        </div>
        <h2 style={titleStyle}>{title}</h2>
        {message && <div style={messageStyle}>{message}</div>}
        <div style={actionsStyle}>
          {resolvedActions.map((action, idx) => (
            <Button
              key={`${action.label}-${idx}`}
              variant={action.variant ?? (idx === 0 ? "primary" : "secondary")}
              size="lg"
              onClick={action.onSelect}
              autoFocus={action.autoFocus}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
}
