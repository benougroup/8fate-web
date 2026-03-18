import * as React from "react";
import { getNotificationSrc, type NotificationKey } from "../assets/domainAssetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { Text } from "./Text";

type NotificationButtonProps = {
  hasUnread?: boolean;
};

export function NotificationButton({ hasUnread = false }: NotificationButtonProps) {
  const { theme } = usePreferences();
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const iconKey: NotificationKey = hasUnread ? "unread" : "none";
  const label = t("notifications.label");

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

  return (
    <div className="revamp-notificationCenter" ref={wrapperRef}>
      <button
        type="button"
        className="revamp-notificationButton"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          className="revamp-notificationIcon"
          src={getNotificationSrc(theme, iconKey)}
          alt=""
        />
      </button>
      {open ? (
        <div className="revamp-notificationDropdown revamp-glassSurface" role="dialog">
          <Text>{t("notifications.emptyBody")}</Text>
        </div>
      ) : null}
    </div>
  );
}
