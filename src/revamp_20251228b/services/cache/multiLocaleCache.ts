import { readRawCache, writeRawCache } from "./cacheStore";

export type LocaleVariant<T> = {
  data: T;
  fetchedAtISO: string;
  sourceUpdatedAtISO?: string;
  forLocalDateISO?: string;
};

export type MultiLocaleCacheEntry<T> = {
  inputsHashBase: string;
  locality?: { countryCode?: string; timeZone?: string };
  localeOrder: string[];
  locales: Record<string, LocaleVariant<T>>;
};

export function readMultiLocaleCache<T>(
  storageKey: string,
): MultiLocaleCacheEntry<T> | null {
  return readRawCache<MultiLocaleCacheEntry<T>>(storageKey);
}

export function writeMultiLocaleCache<T>(
  storageKey: string,
  entry: MultiLocaleCacheEntry<T>,
) {
  writeRawCache(storageKey, entry);
}

export function createEmptyEntry<T>(
  inputsHashBase: string,
  locality?: { countryCode?: string; timeZone?: string },
): MultiLocaleCacheEntry<T> {
  return {
    inputsHashBase,
    locality,
    localeOrder: [],
    locales: {},
  };
}

export function getLocaleVariant<T>(
  entry: MultiLocaleCacheEntry<T>,
  locale: string,
): LocaleVariant<T> | null {
  return entry.locales[locale] ?? null;
}

export function upsertLocaleVariant<T>(
  entry: MultiLocaleCacheEntry<T>,
  locale: string,
  variant: LocaleVariant<T>,
  maxLocales = 2,
): MultiLocaleCacheEntry<T> {
  const localeOrder = [locale, ...entry.localeOrder.filter((item) => item !== locale)];
  const locales = { ...entry.locales, [locale]: variant };

  while (localeOrder.length > maxLocales) {
    const evicted = localeOrder.pop();
    if (evicted) {
      delete locales[evicted];
    }
  }

  return {
    ...entry,
    localeOrder,
    locales,
  };
}
