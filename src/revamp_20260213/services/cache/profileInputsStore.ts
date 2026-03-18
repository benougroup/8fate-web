export type ProfileInputsSnapshot = {
  birthDateISO?: string;
  birthTimeBlockIndex?: number | null;
  birthPlace?: string;
  locale?: string;
  timeZone?: string;
  countryCode?: string;
  capturedAtISO: string;
};

const STORAGE_KEY = "revamp.user.profileInputs";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readProfileInputsSnapshot(): ProfileInputsSnapshot | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ProfileInputsSnapshot;
  } catch (error) {
    console.warn("Failed to parse profile inputs snapshot", error);
    return null;
  }
}

export function writeProfileInputsSnapshot(snapshot: ProfileInputsSnapshot) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
