import type { User } from "../types";
import mockUserData from "@assets/data/mock/mock_user.json";
import { getActiveScenario } from "./mockScenario";

type MockUserProfile = {
  dateOfBirthISO: string;
  timeOfBirthLocal: string;
  placeOfBirth: string;
  timezone: string;
};

type MockUserRecord = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  hasAcceptedTnc: boolean;
  tncAcceptedVersion: string | null;
  locale: string;
  theme: string;
  profile: MockUserProfile;
};

type MockUserPayload = {
  users: MockUserRecord[];
};

function resolveUserByScenario(
  users: MockUserRecord[],
  scenario: string,
): MockUserRecord | undefined {
  if (scenario === "returning_user_premium") {
    return users.find((user) => user.isPremium);
  }
  return users.find((user) => !user.isPremium) ?? users[0];
}

export function selectMockUser(): User {
  const payload = mockUserData as MockUserPayload;
  const scenario = getActiveScenario();
  const selected =
    resolveUserByScenario(payload.users, scenario) ?? payload.users[0];

  return {
    id: selected.id,
    name: selected.name,
    email: selected.email,
    isPremium: selected.isPremium,
  };
}
