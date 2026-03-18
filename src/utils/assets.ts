/**
 * assets.ts – helpers for resolving asset paths from manifests.
 */


/**
 * resolveAsset – safely build /assets URL from a manifest path.
 * Example: resolveAsset("icons/logo.png") => "/assets/icons/logo.png"
 */

export function resolveAsset(path?: string) {
  if (!path) return "";
  const cleaned = path
    .replace(/^\/?assets\//, "")
    .replace(/^\/?images\//, "");
  return new URL(`../assets/images/${cleaned}`, import.meta.url).href;
}


/**
 * getManifestEntry – read nested keys from a manifest JSON object.
 * Usage: getManifestEntry(imagesManifest, ["categories", "ui", "logo"])
 */
export function getManifestEntry(obj: any, keys: string[]): string | undefined {
  try {
    let cur = obj;
    for (const k of keys) cur = cur?.[k];
    return typeof cur === "string" ? cur : undefined;
  } catch {
    return undefined;
  }
}