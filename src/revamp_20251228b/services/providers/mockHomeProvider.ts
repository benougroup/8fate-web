import type { HomeData } from "./types";
import mockDailyHomeData from "../mock/home.daily.json";

const NETWORK_DELAY_MS = 250;

export async function getDailyHomeDataMock(): Promise<HomeData> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  return mockDailyHomeData as HomeData;
}
