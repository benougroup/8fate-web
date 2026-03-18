import type { MonthlyService } from "../interfaces";
import type { MonthlyPayload } from "../types";
import mockMonthly from "@assets/data/mock/mock_monthly.json";

const payload = mockMonthly as MonthlyPayload;

export class MockMonthlyService implements MonthlyService {
  async getMonthly(): Promise<MonthlyPayload> {
    return payload;
  }
}
