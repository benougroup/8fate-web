import mockScenario from "@assets/data/mock/mock_scenario.json";

type MockScenarioData = {
  activeScenario?: string;
};

export function getActiveScenario(): string {
  const scenario = mockScenario as MockScenarioData;
  return scenario.activeScenario ?? "new_user_needs_tnc";
}
