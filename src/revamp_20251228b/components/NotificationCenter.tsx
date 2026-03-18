import * as React from "react";
import EmptyState from "../../components/EmptyState";
import { getNotificationSrc, type NotificationKey } from "../assets/assetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { AnnouncementsModal } from "./AnnouncementsModal";
import { Button } from "./Button";

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  read?: boolean;
};

type NotificationCenterProps = {
  notifications?: NotificationItem[];
};

export function NotificationCenter({ notifications = [] }: NotificationCenterProps) {
  const { theme, locale } = usePreferences();
  const [open, setOpen] = React.useState(false);
  const [announcementsOpen, setAnnouncementsOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const localeTag = locale === "zh-Hant" ? "zh-Hant-TW" : "en-US";
  const formattedUnreadCount = new Intl.NumberFormat(localeTag).format(unreadCount);
  const hasUnread = unreadCount > 0;
  const iconKey: NotificationKey = hasUnread ? "none" : "unread";
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
          <div className="revamp-notificationHeader">
            <span>{t("notifications.title")}</span>
            {unreadCount ? (
              <span className="revamp-notificationCount">
                {t("notifications.unreadCount", { count: formattedUnreadCount })}
              </span>
            ) : null}
          </div>
          <div className="revamp-notificationBody">
            {notifications.length === 0 ? (
              <EmptyState
                className="revamp-notificationEmpty"
                title={t("notifications.emptyTitle")}
                description={t("notifications.emptyBody")}
              />
            ) : (
              <ul className="revamp-notificationList">
                {notifications.map((item) => (
                  <li key={item.id} className="revamp-notificationItem">
                    <div className="revamp-notificationItemTitle">{item.title}</div>
                    {item.body ? (
                      <div className="revamp-notificationItemBody">{item.body}</div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="revamp-notificationFooter">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setAnnouncementsOpen(true);
              }}
            >
              {t("announcements.open")}
            </Button>
          </div>
        </div>
      ) : null}
      <AnnouncementsModal
        open={announcementsOpen}
        onClose={() => setAnnouncementsOpen(false)}
      />
    </div>
  );
}
