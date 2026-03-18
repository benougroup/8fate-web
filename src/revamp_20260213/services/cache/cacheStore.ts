export type CacheEntry<T> = {
  data: T;
  fetchedAtISO: string;
  sourceUpdatedAtISO?: string;
  inputsHash: string;
  locale?: string;
  locality?: { countryCode?: string; timeZone?: string };
};

const CACHE_PREFIX = "revamp.cache.";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readCache<T>(key: string): CacheEntry<T> | null {
  return readRawCache<CacheEntry<T>>(key);
}

export function writeCache<T>(key: string, entry: CacheEntry<T>) {
  writeRawCache(key, entry);
}

export function clearCache(key: string) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(key);
}

export function clearCacheByPrefix(prefix: string = CACHE_PREFIX) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const keysToRemove: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

export { CACHE_PREFIX };

export function readRawCache<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(key);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.warn("Failed to parse cache entry", error);
    return null;
  }
}

export function writeRawCache<T>(key: string, entry: T) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(entry));
}
