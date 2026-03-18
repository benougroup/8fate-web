import { getDailyGuidance } from "../api/endpoints/dailyGuidance";
import type { HomeData } from "./types";

export async function getDailyHomeDataApi(): Promise<HomeData> {
  return getDailyGuidance();
}
