import type { DailyGuidanceResponse } from "../../../contracts/v1/types";
import { apiFetch } from "../apiClient";
import { API_ROUTES } from "../routes";

export async function getDailyGuidance(
  dateISO?: string,
): Promise<DailyGuidanceResponse> {
  const query = dateISO ? `?dateISO=${encodeURIComponent(dateISO)}` : "";
  return apiFetch<DailyGuidanceResponse>(`${API_ROUTES.dailyGuidance}${query}`);
}
