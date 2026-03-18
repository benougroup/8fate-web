# ___toRemove API Layer Guide

These ___toRemove docs are kept for developers but automatically stripped from production builds.
The guard runs via `scripts/build-without-toremove.js` and ensures the build output contains zero `*___toRemove*` files.

## ___toRemove Adding a new endpoint

1. Add or update the contract types in `apps/web/src/revamp_20251228b/contracts/v1/types.ts`.
2. Create an endpoint wrapper in `apps/web/src/revamp_20251228b/services/api/endpoints/`.
3. Add the path to `apps/web/src/revamp_20251228b/services/api/routes.ts` (`API_ROUTES`).
4. Use `apiFetch<T>()` from `apps/web/src/revamp_20251228b/services/api/apiClient.ts` inside the wrapper.
5. Keep responses aligned with the v1 contract types.

Endpoint wrappers should be thin: one file per API surface (for example `endpoints/me.ts`) plus a provider when needed.

## ___toRemove Caching + refresh semantics

Cached endpoints must return the metadata needed by the revamp cache layer to enforce refresh rules.

Required fields for cached responses:

- `sourceUpdatedAtISO`: ISO timestamp that represents when the server last updated the payload.
- `generatedFor` (recommended):
  - `timeZone`: IANA time zone used for generation.
  - `locale`: Locale used for localization.
  - `inputsHash`: Server-side equivalent key for the inputs that shaped the response.

Daily guidance endpoints must also provide `effectiveDateISO` or `forLocalDateISO` to indicate which local day the payload targets.
Annual endpoints should provide `annualYearKey` and/or `nextAnnualRefreshAtISO` to support Chinese New Year refresh windows.

Client expectations:

- Refresh only on page visit, not on app boot.
- Refresh when inputs (birth date/place/time block, locality) or locale change.
- Daily refresh uses the user's current time zone to detect a new local day.
- Cache entries are overwritten on every successful fetch.
- Cache entries store up to two locale variants per endpoint; locale is excluded from the base inputs hash.

## ___toRemove Error handling

- Always throw normalized `ApiError` objects via `apiFetch`.
- Map timeouts to `ApiError.code === "TIMEOUT"`.
- DO NOT log PII or sensitive payloads (especially email).
