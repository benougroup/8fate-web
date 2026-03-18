import * as React from "react";
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
}: InnerTopBarProps) {
  return (
    <div className="revamp-innerTopBar">
      {/* Left: optional back button + title */}
      <div className="revamp-innerTopBarLeft">
        {leftAction}
        <div className="revamp-innerTopBarTitleGroup">
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
