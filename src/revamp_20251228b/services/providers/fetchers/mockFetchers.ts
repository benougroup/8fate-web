import annualMock from "../../mock/annual.json";
import announcementsMock from "../../mock/announcements.json";
import lifeTrendMock from "../../mock/lifeTrend.json";
import meMock from "../../mock/me.json";
import notificationsMock from "../../mock/notifications.json";
import portfolioMock from "../../mock/portfolio.json";
import type { UpdateProfileRequest } from "../../../contracts/v1/types";

export async function getMockMe() {
  return meMock;
}

export async function getMockAnnual() {
  return annualMock;
}

export async function getMockLifeTrend() {
  return lifeTrendMock;
}

export async function getMockPortfolio() {
  return portfolioMock;
}

export async function getMockNotifications() {
  return notificationsMock;
}

export async function getMockAnnouncements() {
  return announcementsMock;
}

export async function getMockUpdateProfile(payload: UpdateProfileRequest) {
  const updatedAtISO = new Date().toISOString();
  return {
    profile: {
      name: payload.name ?? meMock.profile.name,
      dateOfBirthISO: payload.dateOfBirthISO ?? meMock.profile.dateOfBirthISO,
      birthTimeBlockIndex:
        payload.birthTimeBlockIndex ?? meMock.profile.birthTimeBlockIndex,
      placeOfBirth: payload.placeOfBirth ?? meMock.profile.placeOfBirth,
      level: payload.level ?? meMock.profile.level,
    },
    updatedAtISO,
    sourceUpdatedAtISO: updatedAtISO,
  };
}
