import imagesManifest from "@assets/data/images_manifest.json";

import { getManifestEntry, resolveAsset } from "./assets";

/**
 * Resolve a brand asset by checking a list of manifest keys (dot notation)
 * and falling back to a concrete file within our bundled assets.
 */
function resolveBrandAsset(keys: string[], fallback: string): string {
  for (const key of keys) {
    const segments = key.split(".").filter(Boolean);
    const manifestValue = getManifestEntry(imagesManifest as unknown as Record<string, unknown>, segments);
    if (typeof manifestValue === "string" && manifestValue.trim().length > 0) {
      return resolveAsset(manifestValue);
    }
  }
  return resolveAsset(fallback);
}

export function getBrandLogoUrl(): string {
  return resolveBrandAsset([
    "categories.ui.logo",
    "ui.logo",
    "logo",
  ], "ui/logo.png");
}

export function getSplashSymbolUrl(): string {
  return resolveBrandAsset([
    "categories.ui.splash",
    "ui.splash",
    "splash",
  ], "ui/splash.png");
}

export function getBackgroundUrl(variant: "001" | "002" | "003" | "004" | "default" = "001"): string {
  const preferenceMap: Record<string, string[]> = {
    "001": [
      "categories.ui.background001",
      "categories.ui.background_001",
      "ui.background001",
      "ui.background_001",
      "background001",
      "background_001",
    ],
    "002": [
      "categories.ui.background002",
      "categories.ui.background_002",
      "ui.background002",
      "ui.background_002",
      "background002",
      "background_002",
    ],
    "003": [
      "categories.ui.background003",
      "categories.ui.background_003",
      "ui.background003",
      "ui.background_003",
    ],
    "004": [
      "categories.ui.background004",
      "categories.ui.background_004",
      "ui.background004",
      "ui.background_004",
    ],
    "default": [
      "categories.ui.background",
      "ui.background",
      "background",
    ],
  };

  const keys = [...(preferenceMap[variant] ?? []), ...preferenceMap.default];
  return resolveBrandAsset(keys, variant === "002" ? "ui/background_002.png" : "ui/background_001.png");
}
