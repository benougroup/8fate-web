import { apiFetch } from "./api/apiClient";

type LocalTerms = {
  html: string;
  version: string;
  source: "local";
};

type SyncedTerms = {
  html: string;
  version: string;
  source: "local" | "api";
};

type LegalTermsPayload = {
  version: string;
  html: string;
};

const LEGAL_CACHE_PREFIX = "revamp:legal:terms:";

function parseVersion(value: string): number[] {
  return value
    .replace(/^v/i, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((num) => (Number.isFinite(num) ? num : 0));
}

function isVersionNewer(candidate: string, current: string): boolean {
  const c = parseVersion(candidate);
  const cur = parseVersion(current);
  const max = Math.max(c.length, cur.length);

  for (let index = 0; index < max; index += 1) {
    const next = c[index] ?? 0;
    const now = cur[index] ?? 0;
    if (next > now) return true;
    if (next < now) return false;
  }

  return false;
}

function getCacheKey(locale: string) {
  return `${LEGAL_CACHE_PREFIX}${locale}`;
}

function readCachedTerms(locale: string): SyncedTerms | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getCacheKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SyncedTerms;

    if (!parsed.html || !parsed.version) {
      return null;
    }

    return { ...parsed, source: "api" };
  } catch {
    return null;
  }
}

function cacheTerms(locale: string, terms: SyncedTerms) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getCacheKey(locale), JSON.stringify(terms));
  } catch {
    // ignore storage limits
  }
}

export async function fetchLatestTerms(
  locale: string,
  localTerms: LocalTerms | null,
): Promise<SyncedTerms | null> {
  const cached = readCachedTerms(locale);
  const baseline = localTerms ?? cached;

  try {
    const latest = await apiFetch<LegalTermsPayload>(`/api/legal/terms?locale=${encodeURIComponent(locale)}`);

    const shouldUseApi =
      !baseline ||
      isVersionNewer(latest.version, baseline.version) ||
      latest.version === baseline.version;

    if (shouldUseApi) {
      const synced: SyncedTerms = {
        html: latest.html,
        version: latest.version,
        source: "api",
      };
      cacheTerms(locale, synced);
      return synced;
    }

    return baseline;
  } catch {
    return baseline;
  }
}
