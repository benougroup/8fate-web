import { getBrandSrc, getIconSrc, type ThemeMode } from "./assetMap";

export type UiIconName =
  | "brand"
  | "divider"
  | "previewHome"
  | "previewProfile"
  | "previewComponents"
  | "theme"
  | "time"
  | "profile";

export function getUiIconSrc(theme: ThemeMode, name: UiIconName): string {
  switch (name) {
    case "brand":
      return getBrandSrc(theme, "geon_logo");
    case "divider":
      return getIconSrc(theme, "luck");
    case "previewHome":
      return getIconSrc(theme, "today");
    case "previewProfile":
      return getIconSrc(theme, "protection");
    case "previewComponents":
      return getIconSrc(theme, "energy_boost");
    case "theme":
      return getIconSrc(theme, "yinyang");
    case "time":
      return getIconSrc(theme, "upcoming");
    case "profile":
      return getIconSrc(theme, "protection");
    default:
      return getIconSrc(theme, "today");
  }
}
