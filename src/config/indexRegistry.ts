import registry from "@assets/data/index1_registry.json";

export type IndexRegistry = typeof registry;
export type IndexResourceKey = keyof IndexRegistry["resources"];
export type IndexTier = "free" | "premium";

const requiredIndexResources: IndexResourceKey[] = [
  "chat",
  "dashboard",
  "portfolio",
  "profile_init",
  "profile_get",
  "profile_update",
  "timefinder_list",
  "timefinder_finalize",
  "legal_terms",
  "legal_accept",
  "insights_overview",
  "insight_detail",
  "detail_zodiac",
  "detail_day_master",
  "detail_yin_yang",
  "system_status",
  "user_auth",
];

const requiredRestResources: IndexResourceKey[] = [
  "auth_google_start",
  "auth_google_callback",
  "auth_session",
  "auth_logout",
  "profile_get",
  "profile_update",
  "legal_terms",
  "legal_accept",
  "payments_plans",
  "payments_apple_validate",
  "system_status",
];

const registryResources = registry.resources;

export function assertIndexRegistry() {
  requiredIndexResources.forEach((key) => {
    const resource = registryResources[key];
    if (!resource) {
      throw new Error(`index1_registry.json missing required resource: ${key}`);
    }
    const hasTier =
      typeof (resource as { free?: unknown }).free === "number" ||
      typeof (resource as { premium?: unknown }).premium === "number";
    const hasFallback = typeof (resource as { fallbackIndex1?: unknown }).fallbackIndex1 === "number";
    if (!hasTier && !hasFallback) {
      throw new Error(`index1_registry.json missing index_1 for resource: ${key}`);
    }
  });

  requiredRestResources.forEach((key) => {
    const resource = registryResources[key];
    if (!resource) {
      throw new Error(`index1_registry.json missing required resource: ${key}`);
    }
    if (typeof (resource as { rest?: unknown }).rest !== "string") {
      throw new Error(`index1_registry.json missing rest path for resource: ${key}`);
    }
  });
}

export function getIndexFor(resourceKey: IndexResourceKey, tier: IndexTier = "free"): number {
  const resource = registryResources[resourceKey];
  if (!resource) {
    throw new Error(`index1_registry.json missing resource: ${resourceKey}`);
  }

  const tierValue = (resource as { free?: unknown; premium?: unknown })[tier];
  if (typeof tierValue === "number") {
    return tierValue;
  }

  const fallback = (resource as { fallbackIndex1?: unknown }).fallbackIndex1;
  if (typeof fallback === "number") {
    return fallback;
  }

  throw new Error(`index1_registry.json missing index_1 for resource: ${resourceKey}`);
}

export function getRestPathFor(resourceKey: IndexResourceKey): string {
  const resource = registryResources[resourceKey];
  if (!resource) {
    throw new Error(`index1_registry.json missing resource: ${resourceKey}`);
  }
  const rest = (resource as { rest?: unknown }).rest;
  if (typeof rest === "string") {
    return rest;
  }
  throw new Error(`index1_registry.json missing rest path for resource: ${resourceKey}`);
}
