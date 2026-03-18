import type { CacheEntry } from "./cacheStore";
import type { LocaleVariant } from "./multiLocaleCache";
import { todayLocalISO } from "./todayLocalISO";

export type CacheContext = {
  timeZone: string;
  countryCode?: string;
  locale?: string;
  inputsHash?: string;
};

export function isNewLocalDay(lastISO: string, timeZone: string): boolean {
  const last = new Date(lastISO);
  const now = new Date();

  const fmt = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  return fmt(last) !== fmt(now);
}

export function isNewLocalYear(lastISO: string, timeZone: string): boolean {
  const last = new Date(lastISO);
  const now = new Date();

  const fmt = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
    }).format(date);

  return fmt(last) !== fmt(now);
}

export function shouldRefreshOnInputsChange<T>(
  entry: CacheEntry<T> | null,
  ctx: CacheContext,
): boolean {
  if (!entry || !ctx.inputsHash) {
    return true;
  }

  return entry.inputsHash !== ctx.inputsHash;
}

export function shouldRefreshOnLocaleChange<T>(
  entry: CacheEntry<T> | null,
  ctx: CacheContext,
): boolean {
  if (!entry) {
    return true;
  }

  if (!ctx.locale) {
    return false;
  }

  return entry.locale !== ctx.locale;
}

export function shouldRefreshDaily<T>(
  entry: CacheEntry<T> | null,
  ctx: CacheContext,
): boolean {
  if (!entry || !entry.fetchedAtISO) {
    return true;
  }

  if (shouldRefreshOnInputsChange(entry, ctx)) {
    return true;
  }

  if (shouldRefreshOnLocaleChange(entry, ctx)) {
    return true;
  }

  if (
    entry.locality?.timeZone !== ctx.timeZone ||
    entry.locality?.countryCode !== ctx.countryCode
  ) {
    return true;
  }

  return isNewLocalDay(entry.fetchedAtISO, ctx.timeZone);
}

export function shouldRefreshAnnual<T>(
  entry: CacheEntry<T> | null,
  ctx: CacheContext,
): boolean {
  if (!entry || !entry.fetchedAtISO) {
    return true;
  }

  if (shouldRefreshOnInputsChange(entry, ctx)) {
    return true;
  }

  if (shouldRefreshOnLocaleChange(entry, ctx)) {
    return true;
  }

  // TODO: Replace with Chinese New Year boundary when available from API.
  return isNewLocalYear(entry.fetchedAtISO, ctx.timeZone);
}

export function isNewLocalDayByVariant<T>(
  variant: LocaleVariant<T>,
  timeZone: string,
): boolean {
  if (variant.forLocalDateISO) {
    return variant.forLocalDateISO !== todayLocalISO(timeZone);
  }

  return isNewLocalDay(variant.fetchedAtISO, timeZone);
}

export function isNewLocalYearByVariant<T>(
  variant: LocaleVariant<T>,
  timeZone: string,
): boolean {
  return isNewLocalYear(variant.fetchedAtISO, timeZone);
}
