import type { PurchaseService } from "../interfaces";
import type { PurchaseResult } from "../types";
import mockPurchase from "@assets/data/mock/mock_purchase.json";
import { getActiveScenario } from "./mockScenario";

type MockPurchaseScenario = {
  purchase: PurchaseResult;
  restore: PurchaseResult;
};

type MockPurchasePayload = {
  scenarios: Record<string, MockPurchaseScenario>;
};

const payload = mockPurchase as MockPurchasePayload;

function resolveScenario(): MockPurchaseScenario {
  const activeScenario = getActiveScenario();
  return (
    payload.scenarios[activeScenario] ?? payload.scenarios.default ?? {
      purchase: { success: true },
      restore: { success: true },
    }
  );
}

export class MockPurchaseService implements PurchaseService {
  async purchasePremium(): Promise<PurchaseResult> {
    return resolveScenario().purchase;
  }

  async restorePurchase(): Promise<PurchaseResult> {
    return resolveScenario().restore;
  }
}
