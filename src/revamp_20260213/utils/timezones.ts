type TimezonesManifest = {
  timezones?: Array<string | { id?: string; country?: string; label?: string }>;
  regions?: Array<{ places?: Array<{ tz?: string[] }> }>;
  shiChen?: Array<{ key?: string; char?: string; start?: string; end?: string }>;
};

export type ShiChenEntry = {
  key: string;
  char: string;
  start: string;
  end: string;
};

export type CountryOption = {
  code: string;
  name: string;
  timeZones: string[];
};

export type PlaceOption = {
  id: string;
  timeZoneId: string;
  countryCode: string;
  countryName: string;
  label: string;
  placeName: string;
};

function getDisplayName(code: string): string {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function extractTimeZones(manifest: TimezonesManifest): string[] {
  const zones = new Set<string>();

  const rawList = Array.isArray(manifest?.timezones) ? manifest.timezones : [];
  for (const entry of rawList) {
    if (typeof entry === "string") {
      zones.add(entry);
    } else if (entry && typeof entry === "object" && typeof entry.id === "string") {
      zones.add(entry.id);
    }
  }

  if (!zones.size && Array.isArray(manifest?.regions)) {
    for (const region of manifest.regions ?? []) {
      for (const place of region?.places ?? []) {
        for (const tz of place?.tz ?? []) {
          if (typeof tz === "string") zones.add(tz);
        }
      }
    }
  }

  return Array.from(zones).sort((a, b) => a.localeCompare(b));
}

export function getTimeZonesForCountry(manifest: TimezonesManifest, countryCode: string): string[] {
  const normalized = countryCode.trim().toUpperCase();
  const zones = new Set<string>();
  const rawList = Array.isArray(manifest?.timezones) ? manifest.timezones : [];

  if (normalized) {
    for (const entry of rawList) {
      if (entry && typeof entry === "object") {
        const code = typeof entry.country === "string" ? entry.country.toUpperCase() : "";
        const id = typeof entry.id === "string" ? entry.id : "";
        if (code === normalized && id) zones.add(id);
      }
    }
  }

  if (zones.size) {
    return Array.from(zones).sort((a, b) => a.localeCompare(b));
  }

  return extractTimeZones(manifest);
}

export function extractCountryOptions(manifest: TimezonesManifest): CountryOption[] {
  const map = new Map<string, Set<string>>();
  const rawList = Array.isArray(manifest?.timezones) ? manifest.timezones : [];

  for (const entry of rawList) {
    if (entry && typeof entry === "object") {
      const code = typeof entry.country === "string" ? entry.country : "";
      const id = typeof entry.id === "string" ? entry.id : "";
      if (code) {
        if (!map.has(code)) map.set(code, new Set());
        if (id) map.get(code)!.add(id);
      }
    }
  }

  return Array.from(map.entries())
    .map(([code, timeZones]) => ({
      code,
      name: getDisplayName(code),
      timeZones: Array.from(timeZones).sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function extractPlaceOptions(manifest: TimezonesManifest): PlaceOption[] {
  const rawList = Array.isArray(manifest?.timezones) ? manifest.timezones : [];
  const options: PlaceOption[] = [];
  const seen = new Set<string>();

  for (const entry of rawList) {
    if (!entry || typeof entry !== "object") continue;
    const timeZoneId = typeof entry.id === "string" ? entry.id : "";
    const countryCode = typeof entry.country === "string" ? entry.country.toUpperCase() : "";
    const placeName = typeof entry.label === "string" ? entry.label.trim() : "";
    if (!timeZoneId || !countryCode) continue;
    const key = `${countryCode}:${timeZoneId}:${placeName || "default"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const countryName = getDisplayName(countryCode);
    const effectivePlaceName = placeName || countryName;
    options.push({
      id: key,
      timeZoneId,
      countryCode,
      countryName,
      placeName: effectivePlaceName,
      label: `${effectivePlaceName} · ${timeZoneId}`,
    });
  }

  return options.sort((a, b) => {
    const byCountry = a.countryName.localeCompare(b.countryName);
    if (byCountry !== 0) return byCountry;
    const byPlace = a.placeName.localeCompare(b.placeName);
    if (byPlace !== 0) return byPlace;
    return a.timeZoneId.localeCompare(b.timeZoneId);
  });
}

export function extractShiChen(manifest: TimezonesManifest): ShiChenEntry[] {
  const raw = Array.isArray(manifest?.shiChen) ? manifest.shiChen : [];
  return raw
    .filter((entry) => entry && typeof entry.key === "string")
    .map((entry) => ({
      key: entry.key as string,
      char: typeof entry.char === "string" ? entry.char : (entry.key as string),
      start: typeof entry.start === "string" ? entry.start : "",
      end: typeof entry.end === "string" ? entry.end : "",
    }));
}

export function normalizeCountryValue(value: string, options: CountryOption[]): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const matchByCode = options.find((opt) => opt.code.toLowerCase() === trimmed.toLowerCase());
  if (matchByCode) return matchByCode.code;
  const matchByName = options.find((opt) => opt.name.toLowerCase() === trimmed.toLowerCase());
  if (matchByName) return matchByName.code;
  return trimmed;
}
