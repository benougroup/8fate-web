import * as React from "react";
import type { UserLevel } from "../contracts/v1/types";

type Profile = {
  name: string;
  dateOfBirthISO: string;
  placeOfBirth: string;
  birthTimeBlockIndex: number | null;
  level: UserLevel | "";
};

const STORAGE_KEY = "revamp.profile.v1";
const DEFAULT_PROFILE: Profile = {
  name: "",
  dateOfBirthISO: "",
  placeOfBirth: "",
  birthTimeBlockIndex: null,
  level: "",
};

const listeners = new Set<() => void>();
let currentProfile: Profile = loadProfile();

function loadProfile(): Profile {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROFILE };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { ...DEFAULT_PROFILE };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<Profile>;
    const name = normalizeString(parsed.name);
    const dateOfBirthISO = normalizeString(parsed.dateOfBirthISO);
    const placeOfBirth = normalizeString(parsed.placeOfBirth);
    const birthTimeBlockIndex = normalizeBirthTimeBlockIndex(
      parsed.birthTimeBlockIndex,
    );
    const level = normalizeLevel(parsed.level);

    return {
      name: name ?? DEFAULT_PROFILE.name,
      dateOfBirthISO: dateOfBirthISO ?? DEFAULT_PROFILE.dateOfBirthISO,
      placeOfBirth: placeOfBirth ?? DEFAULT_PROFILE.placeOfBirth,
      birthTimeBlockIndex:
        birthTimeBlockIndex ?? DEFAULT_PROFILE.birthTimeBlockIndex,
      level: level ?? DEFAULT_PROFILE.level,
    };
  } catch (error) {
    console.warn("Failed to parse profile store", error);
    return { ...DEFAULT_PROFILE };
  }
}

function normalizeString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  return null;
}

function normalizeLevel(value: unknown): UserLevel | "" | null {
  if (value === "") {
    return "";
  }
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value;
  }
  return null;
}

function normalizeBirthTimeBlockIndex(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "number" || !Number.isInteger(value)) {
    return null;
  }

  if (value < 0 || value > 11) {
    return null;
  }

  return value;
}

function persistProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfile));
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function getProfile(): Profile {
  return currentProfile;
}

export function setProfile(profile: Partial<Profile>) {
  const nextProfile: Profile = { ...currentProfile };

  if ("name" in profile) {
    nextProfile.name = normalizeString(profile.name) ?? currentProfile.name;
  }

  if ("dateOfBirthISO" in profile) {
    nextProfile.dateOfBirthISO =
      normalizeString(profile.dateOfBirthISO) ?? currentProfile.dateOfBirthISO;
  }

  if ("placeOfBirth" in profile) {
    nextProfile.placeOfBirth =
      normalizeString(profile.placeOfBirth) ?? currentProfile.placeOfBirth;
  }

  if ("birthTimeBlockIndex" in profile) {
    nextProfile.birthTimeBlockIndex =
      normalizeBirthTimeBlockIndex(profile.birthTimeBlockIndex) ??
      currentProfile.birthTimeBlockIndex;
  }

  if ("level" in profile) {
    nextProfile.level = normalizeLevel(profile.level) ?? currentProfile.level;
  }

  currentProfile = nextProfile;
  persistProfile();
  notify();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProfile() {
  const profile = React.useSyncExternalStore(subscribe, getProfile, getProfile);

  return {
    profile,
    setProfile,
  };
}

export type { Profile };
