import * as React from "react";
import { getUiIconSrc } from "../assets/uiIcons";
import { usePreferences } from "../stores/preferencesStore";

type PageDividerProps = {
  variant?: "line" | "lineWithIcon";
  spacing?: "sm" | "md" | "lg";
  iconSrc?: string;
  className?: string;
};

export function PageDivider({
  variant = "lineWithIcon",
  spacing = "md",
  iconSrc,
  className,
}: PageDividerProps) {
  const { theme } = usePreferences();
  const resolvedIconSrc = iconSrc ?? getUiIconSrc(theme, "divider");
  const showIcon = variant === "lineWithIcon" && Boolean(resolvedIconSrc);
  const classes = [
    "revamp-divider",
    `revamp-divider--${spacing}`,
    showIcon ? "revamp-divider--withIcon" : "revamp-divider--line",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="separator" aria-orientation="horizontal" className={classes}>
      <span className="revamp-dividerLine" aria-hidden="true" />
      {showIcon ? (
        <>
          <img
            className="revamp-dividerIcon"
            src={resolvedIconSrc}
            alt=""
            aria-hidden
          />
          <span className="revamp-dividerLine" aria-hidden="true" />
        </>
      ) : null}
    </div>
  );
}
