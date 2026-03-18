import { getUiVariant as getUiVariantFromVariant } from "./variant";

// Central runtime config accessors for UI/runtime flags.
// Keep this file as the single place to read from import.meta.env.

export function getUiVariant(): string {
  return getUiVariantFromVariant();
}

// API contract version the UI expects from the backend.
export function getApiContractVersion(): string {
  const raw = import.meta.env.VITE_API_CONTRACT;
  const fallback = "v1";

  if (raw === undefined || raw === null) {
    return fallback;
  }

  const normalized = String(raw).trim();
  return normalized.length > 0 ? normalized : fallback;
}

// Data mode defines whether the UI should use mock data or real APIs.
export type DataMode = "mock" | "api";

export function getDataMode(): DataMode {
  const raw = import.meta.env.VITE_DATA_MODE;
  const fallback: DataMode = "mock";

  if (raw === undefined || raw === null) {
    return fallback;
  }

  const normalized = String(raw).trim().toLowerCase();
  if (normalized === "mock" || normalized === "api") {
    return normalized;
  }

  return fallback;
}

export function isMockMode(): boolean {
  return getDataMode() === "mock";
}
