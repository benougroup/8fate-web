import * as React from "react";
import { t } from "../i18n/t";

type InfoPopoverProps = {
  content: React.ReactNode;
  label?: string;
};

export function InfoPopover({ content, label }: InfoPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !wrapperRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  const ariaLabel = label ?? t("revamp.infoPopover.label");

  return (
    <span className="revamp-infoPopover" ref={wrapperRef}>
      <button
        type="button"
        className="revamp-infoPopoverButton"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">!</span>
      </button>
      {open ? (
        <div className="revamp-infoPopoverBubble revamp-glassSurface" role="dialog">
          {content}
        </div>
      ) : null}
    </span>
  );
}
