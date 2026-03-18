import type { TimeFinderService } from "../interfaces";
import type { TimeFinderQuery, TimeFinderResult } from "../types";
import { getTimeCandidates } from "@services/endpoints/timefinder";
import { ensureServicesBooted } from "./boot";
import { getPreferences } from "../../stores/preferencesStore";

function resolveApiLocale(locale: string): "en" | "zh-Hant" {
  return locale === "zh-Hant" ? "zh-Hant" : "en";
}

export class RealTimeFinderService implements TimeFinderService {
  async search(query: TimeFinderQuery): Promise<TimeFinderResult[]> {
    ensureServicesBooted();
    const { locale } = getPreferences();
    const response = await getTimeCandidates({
      dob: query.date,
      timeRange: query.timeRange as "morning" | "afternoon" | "evening" | "night",
      timeZoneId: query.timezone,
      locale: resolveApiLocale(locale),
    });

    if (!response.ok || !response.data) {
      throw new Error("Unable to load time finder data");
    }

    return response.data.windows.map((window) => ({
      id: window.id,
      title: window.title,
      timeRange: `${window.windowStartLocal} - ${window.windowEndLocal}`,
      description: window.description,
    }));
  }
}
