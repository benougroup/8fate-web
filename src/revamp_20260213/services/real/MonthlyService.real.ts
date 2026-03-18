import type { MonthlyService } from "../interfaces";
import type { MonthlyPayload } from "../types";
import { ensureServicesBooted } from "./boot";

export class RealMonthlyService implements MonthlyService {
  async getMonthly(): Promise<MonthlyPayload> {
    ensureServicesBooted();
    throw new Error("Monthly service not yet wired");
  }
}
