import React from "react";
import { t } from "../i18n/t";
import { getIconSrc } from "../assets/assetMap";
import { usePreferences } from "../stores/preferencesStore";

export function SkinToggleIcon() {
  const { theme, toggleTheme } = usePreferences();
  const nextTheme = theme === "yang" ? "yin" : "yang";
  const title =
    nextTheme === "yin" ? t("theme.toggleToYin") : t("theme.toggleToYang");

  return (
    <button
      type="button"
      className="revamp-skinToggle"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
    >
      <img
        src={getIconSrc(theme, "yinyang")}
        alt=""
        className="revamp-skinToggleIcon"
      />
    </button>
  );
}
