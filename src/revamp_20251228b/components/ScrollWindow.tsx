import * as React from "react";
import { createPortal } from "react-dom";
import { t } from "../i18n/t";
import { BackdropOverlay } from "./BackdropOverlay";

type ScrollWindowProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
};

export function ScrollWindow({
  open,
  title,
  children,
  onClose,
  footer,
}: ScrollWindowProps) {
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    previousActiveRef.current = document.activeElement as HTMLElement | null;

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

    requestAnimationFrame(focusTarget);

    return () => {
      if (previousActiveRef.current) {
        previousActiveRef.current.focus();
      }
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <BackdropOverlay
        open={open}
        onClose={onClose}
        variant="dim-blur"
        layer="modal"
      />
      <div className="revamp-scrollWindowOverlay">
        <div
          className="revamp-scrollWindowPanel revamp-glassSurface"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="revamp-scrollWindowHeader">
            <h2 id={titleId} className="revamp-scrollWindowTitle">
              {title}
            </h2>
            <button
              type="button"
              className="revamp-overlayClose"
              onClick={onClose}
            >
              {t("revamp.overlay.close")}
            </button>
          </div>
          <div className="revamp-scrollWindowBody">{children}</div>
          {footer ? <div className="revamp-scrollWindowFooter">{footer}</div> : null}
        </div>
      </div>
    </>,
    document.body,
  );
}
