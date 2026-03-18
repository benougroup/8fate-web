import * as React from "react";
import { createPortal } from "react-dom";

export type BottomSheetProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  height?: "auto" | "sm" | "md" | "lg";
};

export function BottomSheet({
  isOpen,
  title,
  onClose,
  children,
  height = "auto",
}: BottomSheetProps) {
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousActiveRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const focusTarget = () => {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }

      const focusable = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? panel).focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(focusTarget);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) {
      if (previousActiveRef.current) {
        previousActiveRef.current.focus();
      }
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  const panelClasses = [
    "revamp-bottomSheetPanel",
    `revamp-bottomSheetPanel--${height}`,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className="revamp-bottomSheetBackdrop" onClick={onClose}>
      <div
        className={panelClasses}
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Bottom sheet"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="revamp-bottomSheetHandle" aria-hidden="true" />
        {title ? <h2 id={titleId} className="revamp-bottomSheetTitle">{title}</h2> : null}
        <div className="revamp-bottomSheetBody">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
