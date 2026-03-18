import { hashInputs } from "../cache/inputsHash";
import { isNewLocalYearByVariant } from "../cache/cachePolicy";
import {
  createEmptyEntry,
  getLocaleVariant,
  readMultiLocaleCache,
  upsertLocaleVariant,
  writeMultiLocaleCache,
} from "../cache/multiLocaleCache";
import type { Locality } from "../locality/localityStore";

export type ProfileInputs = {
  birthDateISO?: string;
  birthTimeBlockIndex?: number | null;
  birthPlace?: string;
};

type CachedFetchContext<T> = {
  cacheKey: string;
  locale?: string;
  locality: Locality;
  profileInputs: ProfileInputs;
  fetcher: () => Promise<{ data: T; sourceUpdatedAtISO: string }>;
};

type HashScope = "daily" | "annual" | "profile";

function buildInputsHashBase(
  ctx: { profileInputs: ProfileInputs; locality: Locality },
  scope: HashScope,
) {
  const base: Record<string, unknown> = {
    ...ctx.profileInputs,
  };

  if (scope === "daily") {
    base.timeZone = ctx.locality.timeZone;
    base.countryCode = ctx.locality.countryCode;
  }

  if (scope === "annual") {
    base.timeZone = ctx.locality.timeZone;
  }

  return hashInputs(base);
}

function ensureEntry<T>(ctx: CachedFetchContext<T>, scope: HashScope) {
  // Base hash excludes locale so per-locale variants share one entry.
  const inputsHashBase = buildInputsHashBase(ctx, scope);
  const existing = readMultiLocaleCache<T>(ctx.cacheKey);

  let entry =
    !existing || existing.inputsHashBase !== inputsHashBase
      ? createEmptyEntry<T>(inputsHashBase, ctx.locality)
      : existing;

  if (scope !== "profile") {
    const tzChanged = entry.locality?.timeZone !== ctx.locality.timeZone;
    const ccChanged = entry.locality?.countryCode !== ctx.locality.countryCode;
    if (tzChanged || ccChanged) {
      entry = createEmptyEntry<T>(inputsHashBase, ctx.locality);
    }
  }

  return { entry, inputsHashBase };
}

export async function getAnnualDataCached<T>(
  ctx: CachedFetchContext<T>,
): Promise<T> {
  const { entry } = ensureEntry(ctx, "annual");
  const locale = ctx.locale ?? "en";
  const timeZone = ctx.locality.timeZone ?? "UTC";
  const variant = getLocaleVariant(entry, locale);

  if (variant && !isNewLocalYearByVariant(variant, timeZone)) {
    const refreshedEntry = upsertLocaleVariant(entry, locale, variant, 2);
    writeMultiLocaleCache(ctx.cacheKey, refreshedEntry);
    return variant.data;
  }

  const response = await ctx.fetcher();
  const nextEntry = upsertLocaleVariant(
    entry,
    locale,
    {
      data: response.data,
      fetchedAtISO: new Date().toISOString(),
      sourceUpdatedAtISO: response.sourceUpdatedAtISO,
    },
    2,
  );
  writeMultiLocaleCache(ctx.cacheKey, nextEntry);
  return response.data;
}

export async function getLifeTrendDataCached<T>(
  ctx: CachedFetchContext<T>,
): Promise<T> {
  const { entry } = ensureEntry(ctx, "profile");
  const locale = ctx.locale ?? "en";
  const variant = getLocaleVariant(entry, locale);

  if (variant) {
    const refreshedEntry = upsertLocaleVariant(entry, locale, variant, 2);
    writeMultiLocaleCache(ctx.cacheKey, refreshedEntry);
    return variant.data;
  }

  const response = await ctx.fetcher();
  const nextEntry = upsertLocaleVariant(
    entry,
    locale,
    {
      data: response.data,
      fetchedAtISO: new Date().toISOString(),
      sourceUpdatedAtISO: response.sourceUpdatedAtISO,
    },
    2,
  );
  writeMultiLocaleCache(ctx.cacheKey, nextEntry);
  return response.data;
}

export async function getPortfolioDataCached<T>(
  ctx: CachedFetchContext<T>,
): Promise<T> {
  return getLifeTrendDataCached(ctx);
}
