import * as React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationButton } from "./NotificationButton";
import { SkinToggleIcon } from "./SkinToggleIcon";

type InnerTopBarProps = {
  /** Page title shown in the top bar */
  title: string;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Optional left-side action (e.g. back button) */
  leftAction?: React.ReactNode;
  /** Optional extra right-side actions */
  extraActions?: React.ReactNode;
  /**
   * If provided, renders a ← back arrow that navigates to this path.
   * Use -1 for browser back. Takes precedence over leftAction.
   */
  backTo?: string | -1;
  /** Optional icon key for the page (shown next to title) */
  iconLabel?: string;
};

/**
 * InnerTopBar — sticky top bar for inner pages.
 * Shows the page title (+ optional subtitle) on the left,
 * and skin-toggle + notification button on the right.
 * Always rendered inside a PageCard with className="revamp-innerPage".
 */
export function InnerTopBar({
  title,
  subtitle,
  leftAction,
  extraActions,
  backTo,
  iconLabel,
}: InnerTopBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo === -1) navigate(-1);
    else if (backTo) navigate(backTo);
  };

  const backButton = backTo !== undefined ? (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="revamp-innerTopBarBackBtn"
    >
      ←
    </button>
  ) : null;

  const resolvedLeftAction = backButton ?? leftAction;

  return (
    <div className="revamp-innerTopBar">
      {/* Left: optional back button + title */}
      <div className="revamp-innerTopBarLeft">
        {resolvedLeftAction}
        <div className="revamp-innerTopBarTitleGroup">
          {iconLabel && (
            <span className="revamp-innerTopBarIconLabel">{iconLabel}</span>
          )}
          <span className="revamp-innerTopBarTitle">{title}</span>
          {subtitle ? (
            <span className="revamp-innerTopBarSubtitle">{subtitle}</span>
          ) : null}
        </div>
      </div>

      {/* Right: extra actions + skin toggle + notification */}
      <div className="revamp-innerTopBarActions">
        {extraActions}
        <SkinToggleIcon />
        <NotificationButton />
      </div>
    </div>
  );
}
