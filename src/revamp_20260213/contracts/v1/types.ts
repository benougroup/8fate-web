// Contract v1 types describe the UI-facing data shape for the revamp.
// The UI should only depend on these types, not backend response schemas.

export type LocaleCode = "en" | "zh-Hant" | "zh-Hans";

export type UserLevel = "beginner" | "intermediate" | "advanced";

export type GeneratedFor = {
  timeZone?: string;
  locale?: LocaleCode;
  inputsHash?: string;
};

export type HomeSlot = "today" | "luck" | "avoid" | "protection" | "upcoming";
export type LuckStatus = "upup" | "up" | "middle" | "down" | "downdown";

// A bilingual term keeps English as the canonical label and optional Chinese.
export type BilingualTerm = {
  en: string;
  zhHant?: string;
  zhHans?: string;
};

// A single guidance card for the day.
export type DailyGuidanceCard = {
  id: string;
  slot: HomeSlot;
  title: BilingualTerm;
  summary: string;
  action: string;
  avoid: string;
  luckStatus?: LuckStatus;
};

// Contract payload returned by the data provider (YYYY-MM-DD date).
export type DailyGuidanceResponse = {
  dateISO: string;
  theme: "yin" | "yang";
  cards: DailyGuidanceCard[];
  sourceUpdatedAtISO: string;
  generatedFor?: GeneratedFor;
  effectiveDateISO?: string;
  forLocalDateISO?: string;
};

export type UserProfile = {
  name: string;
  dateOfBirthISO?: string;
  birthTimeBlockIndex?: number;
  placeOfBirth?: string;
  livingCountry?: string;
  level?: UserLevel;
};

export type MeResponse = {
  id: string;
  locale: LocaleCode;
  profile: UserProfile;
  sourceUpdatedAtISO: string;
  generatedFor?: GeneratedFor;
};

export type UpdateProfileRequest = Partial<
  Pick<
    UserProfile,
    "name" | "dateOfBirthISO" | "birthTimeBlockIndex" | "placeOfBirth" | "livingCountry" | "level"
  >
> & {
  locale?: LocaleCode;
};

export type UpdateProfileResponse = {
  profile: UserProfile;
  updatedAtISO: string;
  sourceUpdatedAtISO: string;
};
