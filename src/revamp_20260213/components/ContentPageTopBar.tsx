/**
 * ContentPageTopBar — reusable top bar for all content pages.
 *
 * Matches the Daily (Home) page top bar exactly:
 *  - Left: optional back button (for non-menu pages) + UserBadge pill with name
 *  - Right: NotificationButton + SkinToggleIcon
 *
 * Usage:
 *   // Menu page (no back button):
 *   <ContentPageTopBar />
 *
 *   // Inner page (with back button):
 *   <ContentPageTopBar backTo={-1} />
 *   <ContentPageTopBar backTo="/daily" />
 */
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "./TopBar";
import { UserBadge } from "./UserBadge";
import { SkinToggleIcon } from "./SkinToggleIcon";
import { NotificationButton } from "./NotificationButton";
import { getIconSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";
import { useProfile } from "../stores/profileStore";
import { t } from "../i18n/t";

type ContentPageTopBarProps = {
  /** If provided, renders a ← back arrow. Use -1 for browser back. */
  backTo?: string | -1;
  /** Whether to show the unread notification dot */
  hasUnread?: boolean;
};

export function ContentPageTopBar({ backTo, hasUnread = false }: ContentPageTopBarProps) {
  const navigate = useNavigate();
  const { theme, isPremium } = usePreferences();
  const { profile } = useProfile();

  const displayName = profile.name.trim() || t("home.user.guest");
  const premiumBadgeSrc = getIconSrc(theme, "premium");

  const handleBack = () => {
    if (backTo === -1) navigate(-1);
    else if (backTo) navigate(backTo);
  };

  const leftContent = (
    <div className="revamp-topBarUser">
      {backTo !== undefined && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="revamp-contentPageBackBtn"
        >
          ←
        </button>
      )}
      <div className="revamp-userPill">
        <UserBadge name={displayName} />
        <span className="revamp-userName">{displayName}</span>
        {isPremium ? (
          <img
            className="revamp-premiumBadgeIcon"
            src={premiumBadgeSrc}
            alt={t("home.card.premiumBadge")}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <TopBar
      left={leftContent}
      center={null}
      right={
        <>
          <NotificationButton hasUnread={hasUnread} />
          <SkinToggleIcon />
        </>
      }
    />
  );
}
