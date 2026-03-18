import {
  getApiContractVersion,
  getDataMode,
} from "@/app/runtimeConfig";
import { getMockDailyGuidance } from "../contracts/v1/mocks";
import type { DailyGuidanceResponse } from "../contracts/v1/types";

// The revamp UI reads data only through this provider so contract changes
// stay isolated from UI components and backend response formats.
export async function getDailyGuidance(): Promise<DailyGuidanceResponse> {
  const dataMode = getDataMode();
  const contractVersion = getApiContractVersion();

  if (contractVersion !== "v1") {
    // TODO: Support additional contract versions once they are defined.
    return getMockDailyGuidance();
  }

  if (dataMode === "mock") {
    return getMockDailyGuidance();
  }

  // TODO: call packages/services/apiClient.ts or a revamp API layer and
  // adapt backend responses into the v1 contract shape.
  return getMockDailyGuidance();
}
