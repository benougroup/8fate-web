export function resolvePreferredLanguage(): string {
  const fallback =
    (import.meta as any).env?.VITE_LANG ||
    (typeof navigator !== "undefined" ? navigator.language : null) ||
    "English";
  if (typeof window === "undefined") return fallback;
  const sources = ["profile_data", "localProfile.v1", "dev_profile_data"];
  for (const key of sources) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { language?: string };
      if (parsed?.language) return parsed.language;
    } catch (err) {
      console.warn("Failed to parse stored language", err);
    }
  }
  return fallback;
}
