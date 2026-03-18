import type React from "react";
import { getUiIconSrc, type UiIconName } from "../assets/uiIcons";
import { usePreferences } from "../stores/preferencesStore";

type UiIconProps = {
  name: UiIconName;
  size?: "sm" | "md" | "lg";
  alt?: string;
  className?: string;
};

export function UiIcon({ name, size = "md", alt, className }: UiIconProps) {
  const { theme } = usePreferences();
  const src = getUiIconSrc(theme, name);
  const classes = [`icon-${size}`, className].filter(Boolean).join(" ");
  const isDecorative = !alt;

  return (
    <img
      src={src}
      className={classes}
      alt={alt ?? ""}
      aria-hidden={isDecorative ? "true" : undefined}
    />
  );
}
