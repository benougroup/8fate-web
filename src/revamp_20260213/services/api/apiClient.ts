import { getPreferences } from "../../stores/preferencesStore";
import { fetchWithTimeout } from "../providers/fetchWithTimeout";
import { isApiError } from "../../contracts/v1/api";
import type { ApiError, ApiErrorCode } from "../../contracts/v1/api";

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | null;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 12000;

function createApiError(
  code: ApiErrorCode,
  message: string,
  status?: number,
  details?: unknown,
): ApiError {
  return {
    code,
    message,
    status,
    details,
  };
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "AbortError"
  );
}

function getTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz && tz.length > 0 ? tz : "UTC";
  } catch {
    return "UTC";
  }
}

function getClientVersion(): string {
  const raw = import.meta.env.VITE_CLIENT_VERSION;
  if (raw === undefined || raw === null) {
    return "dev";
  }

  const normalized = String(raw).trim();
  return normalized.length > 0 ? normalized : "dev";
}

function buildHeaders(
  baseHeaders: HeadersInit | undefined,
  hasBody: boolean,
): Headers {
  const headers = new Headers(baseHeaders);
  const { locale } = getPreferences();

  if (!headers.has("Accept-Language")) {
    headers.set("Accept-Language", locale);
  }

  if (!headers.has("X-Timezone")) {
    headers.set("X-Timezone", getTimezone());
  }

  if (!headers.has("X-Client-Version")) {
    headers.set("X-Client-Version", getClientVersion());
  }

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    if (response.status === 204) {
      return undefined as T;
    }

    throw createApiError(
      "BAD_RESPONSE",
      "Empty response body.",
      response.status,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw createApiError(
      "BAD_RESPONSE",
      "Unable to parse response.",
      response.status,
      text,
    );
  }
}

async function parseErrorDetails(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, body, ...init } = options;
  const hasBody = body !== undefined && body !== null;
  // Default to same-origin to include session cookies for authenticated calls.
  const credentials = init.credentials ?? "same-origin";

  try {
    const response = await fetchWithTimeout(path, {
      ...init,
      credentials,
      headers: buildHeaders(headers, hasBody),
      body,
      timeoutMs,
    });

    if (!response.ok) {
      const details = await parseErrorDetails(response);
      throw createApiError(
        "HTTP_ERROR",
        `Request failed with status ${response.status}.`,
        response.status,
        details,
      );
    }

    return await parseJsonResponse<T>(response);
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    if (isAbortError(error)) {
      throw createApiError("TIMEOUT", "Request timed out.");
    }

    if (error instanceof TypeError) {
      throw createApiError("NETWORK_ERROR", "Network error occurred.");
    }

    throw createApiError("UNKNOWN", "Unexpected error occurred.");
  }
}

export type { ApiFetchOptions };
