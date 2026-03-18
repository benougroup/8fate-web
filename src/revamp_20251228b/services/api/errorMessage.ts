import { isApiError } from "../../contracts/v1/api";
import { t } from "../../i18n/t";

export function toUserErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    switch (error.code) {
      case "TIMEOUT":
        return t("common.errorTimeout");
      case "NETWORK_ERROR":
        return t("common.errorNetwork");
      case "BAD_RESPONSE":
        return t("common.errorBadResponse");
      case "HTTP_ERROR":
        return t("common.errorUnknownDetail");
      default:
        return t("common.errorUnknownDetail");
    }
  }

  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return t("common.errorTimeout");
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return t("common.errorUnknownDetail");
}
