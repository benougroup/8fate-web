export type Locality = {
  countryCode?: string;
  timeZone?: string;
  localityCapturedAtISO: string;
};

const STORAGE_KEY = "revamp.user.locality";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readLocality(): Locality | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as Locality;
  } catch (error) {
    console.warn("Failed to parse locality store", error);
    return null;
  }
}

export function writeLocality(locality: Locality) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(locality));
}

export function clearLocality() {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
}
