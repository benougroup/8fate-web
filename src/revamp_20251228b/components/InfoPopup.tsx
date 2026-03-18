import * as React from "react";
import { createPortal } from "react-dom";
import { getUiSymbolSrc } from "../assets/assetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { BackdropOverlay } from "./BackdropOverlay";

type InfoPopupProps = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export function InfoPopup({ open, title, body, onClose }: InfoPopupProps) {
  const titleId = React.useId();
  const bodyId = React.useId();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const previousActiveRef = React.useRef<HTMLElement | null>(null);
  const { theme } = usePreferences();
  const closeIconSrc = getUiSymbolSrc(theme, "x_circle_around");

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
      <div className="revamp-infoPopupOverlay">
        <div
          className="revamp-infoPopupPanel revamp-glassSurface"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={bodyId}
        >
          <div className="revamp-infoPopupHeader">
            <h2 id={titleId} className="revamp-infoPopupTitle">
              {title}
            </h2>
            <button
              type="button"
              className="revamp-infoPopupClose"
              onClick={onClose}
              aria-label={t("common.close")}
            >
              <img
                src={closeIconSrc}
                alt=""
                aria-hidden="true"
                className="revamp-infoPopupCloseIcon"
              />
            </button>
          </div>
          <p id={bodyId} className="revamp-infoPopupBody">
            {body}
          </p>
        </div>
      </div>
    </>,
    document.body,
  );
}
