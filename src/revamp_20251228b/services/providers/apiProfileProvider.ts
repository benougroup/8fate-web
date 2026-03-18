import type {
  MeResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../../contracts/v1/types";
import { getDataMode } from "../../../app/runtimeConfig";
import { getMe, patchProfile } from "../api/endpoints/me";
import { getMockMe, getMockUpdateProfile } from "./fetchers/mockFetchers";

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

export async function getMeApi(): Promise<MeResponse> {
  if (getDataMode() === "mock") {
    return getMockMe() as Promise<MeResponse>;
  }

  return getMe();
}

export async function updateProfileApi(
  payload: UpdateProfileRequest,
  idempotencyKey?: string,
): Promise<UpdateProfileResponse> {
  const key = idempotencyKey ?? createIdempotencyKey();
  if (getDataMode() === "mock") {
    return getMockUpdateProfile(payload) as Promise<UpdateProfileResponse>;
  }

  return patchProfile(payload, key);
}
