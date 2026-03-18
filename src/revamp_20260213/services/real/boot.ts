import { bootServices } from "@services/index";
import { ENV } from "../../config/env";

let booted = false;

export function ensureServicesBooted() {
  if (booted || !ENV.apiBaseUrl) {
    return;
  }

  const redirectUri =
    import.meta.env.VITE_AUTH_REDIRECT_URI ?? `${window.location.origin}/auth/callback`;

  bootServices({
    baseUrl: ENV.apiBaseUrl,
    auth: {
      redirectUri,
    },
  });

  booted = true;
}
