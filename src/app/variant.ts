// Env-based switching enables multiple demo variants from a single entry point.
// This keeps v1 intact while allowing rapid iteration on new UI revamps.
const DEFAULT_VARIANT = "20251228b";

export function getUiVariant(): string {
  const raw = import.meta.env.VITE_UI_VARIANT;
  if (raw === undefined || raw === null) {
    return DEFAULT_VARIANT;
  }

  const normalized = String(raw).trim();
  return normalized.length > 0 ? normalized : DEFAULT_VARIANT;
}

export function isV1(): boolean {
  return getUiVariant() === "v1";
}
