export type ApiErrorCode =
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "HTTP_ERROR"
  | "BAD_RESPONSE"
  | "UNKNOWN";

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
  details?: unknown;
};

export const API_ERROR_CODES = new Set<ApiErrorCode>([
  "TIMEOUT",
  "NETWORK_ERROR",
  "HTTP_ERROR",
  "BAD_RESPONSE",
  "UNKNOWN",
]);

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as Record<string, unknown>;
  const message = typeof candidate.message === "string" ? candidate.message : "";

  if (!("code" in candidate)) {
    return false;
  }

  const code = candidate.code;
  if (typeof code !== "string") {
    return false;
  }

  if (!API_ERROR_CODES.has(code as ApiErrorCode)) {
    return false;
  }

  if ("status" in candidate && candidate.status !== undefined) {
    if (typeof candidate.status !== "number") {
      return false;
    }
  }

  return message.trim().length > 0;
}
