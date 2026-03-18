import type {
  MeResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../../../contracts/v1/types";
import { apiFetch } from "../apiClient";
import { API_ROUTES } from "../routes";

export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>(API_ROUTES.me);
}

export async function patchProfile(
  payload: UpdateProfileRequest,
  idempotencyKey?: string,
): Promise<UpdateProfileResponse> {
  const headers = idempotencyKey
    ? {
        "Idempotency-Key": idempotencyKey,
      }
    : undefined;

  return apiFetch<UpdateProfileResponse>(API_ROUTES.meProfile, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers,
  });
}
