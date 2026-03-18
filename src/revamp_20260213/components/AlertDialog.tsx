import * as React from "react";
import { createPortal } from "react-dom";
import { BackdropOverlay } from "./BackdropOverlay";
import { Button } from "./Button";

export type AlertDialogAction = {
  key: string;
  label: string;
  variant: "primary" | "secondary" | "danger";
  onPress: () => void;
};

type AlertDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actions: AlertDialogAction[];
  blocking?: boolean;
};

export function AlertDialog({
  open,
  title,
  message,
  onClose,
  actions,
  blocking = false,
}: AlertDialogProps) {
  const titleId = React.useId();
  const messageId = React.useId();
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
        disableClickClose={blocking}
        layer="modal"
      />
      <div className="revamp-alertDialogOverlay">
        <div
          className="revamp-alertDialogPanel revamp-glassSurface"
          ref={panelRef}
          tabIndex={-1}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={messageId}
        >
          <div className="revamp-alertDialogHeader">
            <h2 id={titleId} className="revamp-alertDialogTitle">
              {title}
            </h2>
          </div>
          <p id={messageId} className="revamp-alertDialogMessage">
            {message}
          </p>
          <div className="revamp-alertDialogActions">
            {actions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant}
                onClick={action.onPress}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
