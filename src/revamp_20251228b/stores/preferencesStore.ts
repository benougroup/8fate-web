import * as React from "react";
import type { BackgroundKey } from "../assets/assetMap";

type ThemeMode = "yin" | "yang";
type LocaleMode = "en" | "zh-Hant";

type Preferences = {
  theme: ThemeMode;
  locale: LocaleMode;
  backgroundKey: BackgroundKey;
  hasAcceptedTnc: boolean;
  isPremium: boolean;
  lastLoginProvider: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
};

const STORAGE_KEY = "revamp.preferences.v1";
const DEFAULT_PREFERENCES: Preferences = {
  theme: "yang",
  locale: "en",
  backgroundKey: "background001",
  hasAcceptedTnc: false,
  isPremium: false,
  lastLoginProvider: null,
  userId: null,
  userEmail: null,
  userName: null,
};

const listeners = new Set<() => void>();
let isReady = false;
let currentPreferences = loadPreferences();
applyDomPreferences(currentPreferences);
isReady = true;

function applyDomPreferences(next: Preferences) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.dataset.theme = next.theme;
  document.documentElement.lang = next.locale;
}

function loadPreferences(): Preferences {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PREFERENCES };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { ...DEFAULT_PREFERENCES };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<Preferences>;
    const theme = normalizeTheme(parsed.theme);
    const locale = normalizeLocale(parsed.locale);
    const backgroundKey = normalizeBackgroundKey(parsed.backgroundKey);
    const hasAcceptedTnc = normalizeBoolean(parsed.hasAcceptedTnc);
    const isPremium = normalizeBoolean(parsed.isPremium);
    const lastLoginProvider = normalizeString(parsed.lastLoginProvider);
    const userId = normalizeString(parsed.userId);
    const userEmail = normalizeString(parsed.userEmail);
    const userName = normalizeString(parsed.userName);

    return {
      theme: theme ?? DEFAULT_PREFERENCES.theme,
      locale: locale ?? DEFAULT_PREFERENCES.locale,
      backgroundKey: backgroundKey ?? DEFAULT_PREFERENCES.backgroundKey,
      hasAcceptedTnc:
        hasAcceptedTnc ?? DEFAULT_PREFERENCES.hasAcceptedTnc,
      isPremium: isPremium ?? DEFAULT_PREFERENCES.isPremium,
      lastLoginProvider:
        lastLoginProvider ?? DEFAULT_PREFERENCES.lastLoginProvider,
      userId: userId ?? DEFAULT_PREFERENCES.userId,
      userEmail: userEmail ?? DEFAULT_PREFERENCES.userEmail,
      userName: userName ?? DEFAULT_PREFERENCES.userName,
    };
  } catch (error) {
    console.warn("Failed to parse preferences store", error);
    return { ...DEFAULT_PREFERENCES };
  }
}

function normalizeTheme(value: unknown): ThemeMode | null {
  if (value === "yin" || value === "yang") {
    return value;
  }
  if (value === "dark") {
    return "yin";
  }
  if (value === "light") {
    return "yang";
  }
  return null;
}

function normalizeLocale(value: unknown): LocaleMode | null {
  if (value === "en" || value === "zh-Hant") {
    return value;
  }
  return null;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (value === true || value === false) {
    return value;
  }
  return null;
}

function normalizeString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

const backgroundKeys: BackgroundKey[] = ["background001", "grey", "purple"];

function normalizeBackgroundKey(value: unknown): BackgroundKey | null {
  if (typeof value !== "string") {
    return null;
  }
  return backgroundKeys.includes(value as BackgroundKey)
    ? (value as BackgroundKey)
    : null;
}

function persistPreferences() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPreferences));
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function getPreferences(): Preferences {
  return currentPreferences;
}

export function getPreferencesReady() {
  return isReady;
}

export function setTheme(theme: ThemeMode) {
  if (theme === currentPreferences.theme) {
    return;
  }

  currentPreferences = { ...currentPreferences, theme };
  persistPreferences();
  applyDomPreferences(currentPreferences);
  notify();
}

export function toggleTheme() {
  setTheme(currentPreferences.theme === "yang" ? "yin" : "yang");
}

export function setLocale(locale: LocaleMode) {
  if (locale === currentPreferences.locale) {
    return;
  }

  currentPreferences = { ...currentPreferences, locale };
  persistPreferences();
  applyDomPreferences(currentPreferences);
  notify();
}

export function setTncAccepted(hasAcceptedTnc: boolean) {
  if (hasAcceptedTnc === currentPreferences.hasAcceptedTnc) {
    return;
  }

  currentPreferences = { ...currentPreferences, hasAcceptedTnc };
  persistPreferences();
  notify();
}

export function setPremium(isPremium: boolean) {
  if (isPremium === currentPreferences.isPremium) {
    return;
  }

  currentPreferences = { ...currentPreferences, isPremium };
  persistPreferences();
  notify();
}

export function setAuthUser(user: {
  userId: string | null;
  userEmail?: string | null;
  userName?: string | null;
  lastLoginProvider?: string | null;
}) {
  currentPreferences = {
    ...currentPreferences,
    userId: user.userId,
    userEmail: user.userEmail ?? currentPreferences.userEmail,
    userName: user.userName ?? currentPreferences.userName,
    lastLoginProvider:
      user.lastLoginProvider ?? currentPreferences.lastLoginProvider,
  };
  persistPreferences();
  notify();
}

export function clearAuthUser() {
  currentPreferences = {
    ...currentPreferences,
    userId: null,
    userEmail: null,
    userName: null,
    lastLoginProvider: null,
    hasAcceptedTnc: false,
    isPremium: false,
  };
  persistPreferences();
  notify();
}

export function setBackgroundKey(backgroundKey: BackgroundKey) {
  if (backgroundKey === currentPreferences.backgroundKey) {
    return;
  }

  currentPreferences = { ...currentPreferences, backgroundKey };
  persistPreferences();
  notify();
}

export function applyPortfolioPreferences(payload: {
  locale?: string | null;
  theme?: string | null;
  backgroundKey?: string | null;
}) {
  const nextLocale = normalizeLocale(payload.locale);
  const nextTheme = normalizeTheme(payload.theme);
  const nextBackgroundKey = normalizeBackgroundKey(payload.backgroundKey);

  if (nextLocale) {
    setLocale(nextLocale);
  }

  if (nextTheme) {
    setTheme(nextTheme);
  }

  if (nextBackgroundKey) {
    setBackgroundKey(nextBackgroundKey);
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePreferences() {
  const preferences = React.useSyncExternalStore(
    subscribe,
    getPreferences,
    getPreferences,
  );

  React.useEffect(() => {
    applyDomPreferences(preferences);
  }, [preferences]);

  return {
    theme: preferences.theme,
    locale: preferences.locale,
    backgroundKey: preferences.backgroundKey,
    hasAcceptedTnc: preferences.hasAcceptedTnc,
    isPremium: preferences.isPremium,
    lastLoginProvider: preferences.lastLoginProvider,
    userId: preferences.userId,
    userEmail: preferences.userEmail,
    userName: preferences.userName,
    setLocale,
    toggleTheme,
    setBackgroundKey,
    setTncAccepted,
    setPremium,
    setAuthUser,
    clearAuthUser,
    isReady: getPreferencesReady(),
  };
}

export type { Preferences, ThemeMode, LocaleMode, BackgroundKey };
