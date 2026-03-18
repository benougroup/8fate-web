# Revamp (20260213) workspace

This directory tracks the active v20260213 UI stream, originally scaffolded from v20251228b
and now extended with gameplay systems, BaZi feature modules, and auth/onboarding UX fixes.

## Version History

- **v20260213** - Current active development version.
- **v20251228b** - Prior revamp architecture retained as historical reference.

## Implemented in v20260213

- Floating radial navigation integrated into main routes.
- BaZi feature rollout: Daily Fortune, Luck Pillars, Compatibility, Yearly Forecast,
  Auspicious Dates, and related data/provider enhancements.
- Home page integration for Daily Fortune.
- Registration/login/splash UX fixes, including improved sizing, spacing, and z-index behavior.
- Versioned localStorage SaveSystem with autosave support.
- Data-driven NPCSystem with trust/fear routines.
- Stability hardening for save flow and state safety.

## Structure rules

- `pages/` composes route-level layouts.
- `components/` holds reusable presentational UI.
- `hooks/` stores UI logic and state helpers.
- `services/` contains revamp-only API/data fetching.
- `types/` defines TypeScript types/interfaces.
- `content/` holds JSON copy/config (future i18n).

## Related docs

- `docs/ui-revamp/20260213/00-release-notes.md`
- `docs/ui-revamp/20251228b/00-versioning.md`
