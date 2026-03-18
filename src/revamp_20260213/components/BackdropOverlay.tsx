import React from "react";
import { createPortal } from "react-dom";
import { t } from "../i18n/t";

type BackdropOverlayProps = {
  open: boolean;
  onClose: () => void;
  variant?: "dim" | "blur" | "dim-blur";
  disableClickClose?: boolean;
  layer?: "default" | "modal" | "menu";
};

export function BackdropOverlay({
  open,
  onClose,
  variant = "dim",
  disableClickClose = false,
  layer = "default",
}: BackdropOverlayProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      type="button"
      className="revamp-backdropOverlay"
      data-variant={variant}
      data-layer={layer}
      aria-label={t("revamp.overlay.dismiss")}
      onClick={disableClickClose ? undefined : onClose}
    />,
    document.body,
  );
}
