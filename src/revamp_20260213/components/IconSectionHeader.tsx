import type React from "react";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

type IconSectionHeaderProps = {
  iconKey: IconKey;
  title: React.ReactNode;
};

export function IconSectionHeader({ iconKey, title }: IconSectionHeaderProps) {
  const { theme } = usePreferences();
  const iconSrc = getIconSrc(theme, iconKey);

  return (
    <div className="revamp-sectionHeaderRow">
      <img className="revamp-sectionIcon" src={iconSrc} alt="" aria-hidden="true" />
      <span className="revamp-sectionHeaderLabel">{title}</span>
    </div>
  );
}
