const REQUIRED_ENV_KEYS = [
  "VITE_APP_ENV",
  "VITE_API_BASE_URL",
  "VITE_AUTH_REDIRECT_URI",
  "VITE_CHAT_PATH",
  "VITE_LANG",
  "VITE_USE_MOCKS",
  "VITE_AUTH_BYPASS",
  "VITE_SYNC_DISABLED",
];

export const assertRequiredEnv = (): void => {
  const env = (import.meta as any).env ?? {};
  const missing = REQUIRED_ENV_KEYS.filter(
    (key) => env[key] === undefined || env[key] === ""
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(
        ", "
      )}. Set them in apps/web/.env.* (see docs/environments.md).`
    );
  }

  const isTruthy = (value: unknown): boolean => {
    if (value === undefined || value === null) {
      return false;
    }
    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
  };

  const mode = String(env.VITE_APP_ENV);
  if (mode === "integration" || mode === "production") {
    if (isTruthy(env.VITE_USE_MOCKS)) {
      throw new Error(`VITE_USE_MOCKS must be false in ${mode}.`);
    }

    if (isTruthy(env.VITE_AUTH_BYPASS)) {
      throw new Error(`VITE_AUTH_BYPASS must be 0 in ${mode}.`);
    }
  }
};
