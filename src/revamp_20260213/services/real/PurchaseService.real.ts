import type { PurchaseService } from "../interfaces";
import type { PurchaseResult } from "../types";
import { ensureServicesBooted } from "./boot";

export class RealPurchaseService implements PurchaseService {
  async purchasePremium(): Promise<PurchaseResult> {
    ensureServicesBooted();
    return { success: false, message: "Purchase flow not yet wired" };
  }

  async restorePurchase(): Promise<PurchaseResult> {
    ensureServicesBooted();
    return { success: false, message: "Restore flow not yet wired" };
  }
}
