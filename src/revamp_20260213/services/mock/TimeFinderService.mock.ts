import type { TimeFinderService } from "../interfaces";
import type { TimeFinderQuery, TimeFinderResult } from "../types";
import mockTimeFinder from "@assets/data/mock/mock_timefinder.json";
import { getActiveScenario } from "./mockScenario";

type MockTimeFinderCase = {
  id: string;
  query: {
    timeRange: string;
    timezone: string;
  };
  results?: TimeFinderResult[];
  error?: {
    code: string;
    message: string;
  };
};

type MockTimeFinderPayload = {
  cases: MockTimeFinderCase[];
};

const payload = mockTimeFinder as MockTimeFinderPayload;

function findCase(query: TimeFinderQuery, scenario: string) {
  if (scenario === "timefinder_empty_results") {
    return payload.cases.find((entry) => entry.id === "empty_results");
  }
  if (scenario === "timefinder_multi_results") {
    return payload.cases.find((entry) => entry.id === "multi_results");
  }
  return (
    payload.cases.find(
      (entry) =>
        entry.query.timeRange === query.timeRange &&
        entry.query.timezone === query.timezone,
    ) ?? payload.cases.find((entry) => entry.id === "multi_results")
  );
}

export class MockTimeFinderService implements TimeFinderService {
  async search(query: TimeFinderQuery): Promise<TimeFinderResult[]> {
    const scenario = getActiveScenario();
    const selected = findCase(query, scenario);

    if (selected?.error) {
      throw new Error(selected.error.message);
    }

    return selected?.results ?? [];
  }
}
