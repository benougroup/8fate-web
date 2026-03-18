import en from "./en.json";
import zhHant from "./zh-Hant.json";
import { getPreferences } from "../stores/preferencesStore";

const dictionaries = {
  en,
  "zh-Hant": zhHant,
};

type Dictionary = Record<string, string | Dictionary>;

type Variables = Record<string, string | number>;

function resolveKey(dictionary: Dictionary, key: string): string | undefined {
  const segments = key.split(".");
  let current: string | Dictionary | undefined = dictionary;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(value: string, vars?: Variables): string {
  if (!vars) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return String(vars[name]);
    }

    return match;
  });
}

export function t(key: string, vars?: Variables): string {
  const locale = getPreferences().locale;
  const primary = dictionaries[locale] ?? dictionaries.en;
  const resolvedPrimary = resolveKey(primary, key);
  const resolvedFallback = resolveKey(dictionaries.en, key);
  const resolved = resolvedPrimary ?? resolvedFallback;

  if (!resolved) {
    return key;
  }

  return interpolate(resolved, vars);
}
