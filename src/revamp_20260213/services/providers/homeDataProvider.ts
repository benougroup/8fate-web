import { getApiContractVersion, getDataMode } from "../../../app/runtimeConfig";
import { hashInputs } from "../cache/inputsHash";
import { isNewLocalDayByVariant } from "../cache/cachePolicy";
import { writeProfileInputsSnapshot } from "../cache/profileInputsStore";
import {
  createEmptyEntry,
  getLocaleVariant,
  readMultiLocaleCache,
  upsertLocaleVariant,
  writeMultiLocaleCache,
} from "../cache/multiLocaleCache";
import { todayLocalISO } from "../cache/todayLocalISO";
import { getLocality } from "../locality/getLocality";
import { getPreferences } from "../../stores/preferencesStore";
import { getProfile } from "../../stores/profileStore";
import type { HomeData } from "./types";
import { getDailyHomeDataApi } from "./apiHomeProvider";
import { getDailyHomeDataMock } from "./mockHomeProvider";

const HOME_CACHE_KEY = "revamp.cache.home.daily";
const inFlightRequests = new Map<string, Promise<HomeData>>();

function getDailyHomeDataSource() {
  return getDataMode() === "mock" ? getDailyHomeDataMock : getDailyHomeDataApi;
}

export async function getDailyHomeData({
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
} = {}): Promise<HomeData> {
  const locality = getLocality();
  const { locale } = getPreferences();
  const profile = getProfile();
  const dataMode = getDataMode();
  const contractVersion = getApiContractVersion();
  writeProfileInputsSnapshot({
    birthDateISO: profile.dateOfBirthISO,
    birthTimeBlockIndex: profile.birthTimeBlockIndex,
    birthPlace: profile.placeOfBirth,
    locale,
    timeZone: locality.timeZone,
    countryCode: locality.countryCode,
    capturedAtISO: new Date().toISOString(),
  });

  // Base hash excludes locale so multiple locale variants can share one entry.
  const inputsHashBase = hashInputs({
    birthDateISO: profile.dateOfBirthISO,
    birthTimeBlockIndex: profile.birthTimeBlockIndex,
    birthPlace: profile.placeOfBirth,
    contractVersion,
    dataMode,
    timeZone: locality.timeZone,
    countryCode: locality.countryCode,
  });

  const timeZone = locality.timeZone ?? "UTC";
  const requestKey = `${HOME_CACHE_KEY}:${inputsHashBase}:${locale}`;
  let entry = forceRefresh ? null : readMultiLocaleCache<HomeData>(HOME_CACHE_KEY);

  if (!entry || entry.inputsHashBase !== inputsHashBase) {
    entry = createEmptyEntry<HomeData>(inputsHashBase, {
      timeZone: locality.timeZone,
      countryCode: locality.countryCode,
    });
  }

  if (
    entry.locality?.timeZone !== locality.timeZone ||
    entry.locality?.countryCode !== locality.countryCode
  ) {
    entry = createEmptyEntry<HomeData>(inputsHashBase, {
      timeZone: locality.timeZone,
      countryCode: locality.countryCode,
    });
  }

  const cachedVariant = entry ? getLocaleVariant(entry, locale) : null;
  const hasFreshVariant =
    cachedVariant &&
    cachedVariant.forLocalDateISO &&
    !isNewLocalDayByVariant(cachedVariant, timeZone) &&
    !forceRefresh;

  if (hasFreshVariant) {
    const refreshedEntry = upsertLocaleVariant(
      entry,
      locale,
      cachedVariant,
      2,
    );
    writeMultiLocaleCache<HomeData>(HOME_CACHE_KEY, refreshedEntry);
    return cachedVariant.data;
  }

  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const data = await getDailyHomeDataSource()();
    const nowISO = new Date().toISOString();
    const forLocalDateISO =
      data.forLocalDateISO ??
      data.effectiveDateISO ??
      todayLocalISO(timeZone);
    const nextEntry = upsertLocaleVariant(
      entry ?? createEmptyEntry<HomeData>(inputsHashBase, locality),
      locale,
      {
        data,
        fetchedAtISO: nowISO,
        sourceUpdatedAtISO: data.sourceUpdatedAtISO,
        forLocalDateISO,
      },
      2,
    );
    nextEntry.locality = {
      timeZone: locality.timeZone,
      countryCode: locality.countryCode,
    };
    nextEntry.inputsHashBase = inputsHashBase;
    writeMultiLocaleCache<HomeData>(HOME_CACHE_KEY, nextEntry);
    return data;
  })();

  inFlightRequests.set(requestKey, request);

  try {
    return await request;
  } finally {
    inFlightRequests.delete(requestKey);
  }
}
