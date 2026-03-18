import { readLocality, writeLocality } from "./localityStore";
import type { Locality } from "./localityStore";

function detectTimeZone(): string | undefined {
  if (typeof Intl === "undefined") {
    return undefined;
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function detectCountryCode(): string | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  const language = navigator.language;
  if (!language) {
    return undefined;
  }

  const parts = language.split(/[-_]/);
  const candidate = parts[1];

  if (!candidate || candidate.length !== 2) {
    return undefined;
  }

  return candidate.toUpperCase();
}

export function getLocality(): Locality {
  const stored = readLocality();
  const timeZone = detectTimeZone() ?? stored?.timeZone;
  const countryCode = detectCountryCode() ?? stored?.countryCode;
  const localityCapturedAtISO = new Date().toISOString();

  const next: Locality = {
    timeZone,
    countryCode,
    localityCapturedAtISO,
  };

  const hasChanged =
    !stored ||
    stored.timeZone !== timeZone ||
    stored.countryCode !== countryCode;

  if (hasChanged) {
    writeLocality(next);
    return next;
  }

  return stored;
}
