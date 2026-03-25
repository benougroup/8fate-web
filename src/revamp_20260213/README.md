# 8fate Web App — revamp_20260213

> **Last updated:** 2026-03-26  
> **Live demo:** https://benougroup.github.io/8fate-web/  
> **Source repo:** `benougroup/8fate-web` (public, master = source, gh-pages = built site)  
> **Monorepo:** `benougroup/8fate` (private, branch `20260213`)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Screen Flow](#screen-flow)
4. [Auth Flow (Login)](#auth-flow-login)
5. [Registration Flow](#registration-flow)
6. [Time Finder Flow](#time-finder-flow)
7. [Daily Home Page](#daily-home-page)
8. [Section Header Standard](#section-header-standard)
9. [Dev vs Production Mode](#dev-vs-production-mode)
10. [i18n (Internationalisation)](#i18n-internationalisation)
11. [Premium / Locked Content](#premium--locked-content)
12. [Deployment](#deployment)
13. [Known Placeholders / TODO](#known-placeholders--todo)

---

## Overview

8fate is a BaZi (Chinese astrology) web app. Users register with their birth details, and the app provides:

- **Daily Fortune** — energy score, day pillar, lucky/unlucky guidance, do/don't advice
- **BaZi Chart** — four pillars, element balance, day master analysis
- **Yearly Forecast** — zodiac reading, half-year luck split, life domains, monthly predictions
- **Luck Pillars** — ten-year luck cycle analysis
- **Monthly Fortune** — monthly pillar, domains, protection focus

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite (base path: `/8fate-web` for GitHub Pages) |
| Routing | React Router v6 (`BrowserRouter` with `basename`) |
| Styling | Custom CSS (`base.20260213.css`) — no Tailwind |
| State | Zustand (`preferencesStore`, `profileStore`) |
| i18n | Custom `t()` function, JSON files in `i18n/` |
| Data | Mock data in `services/mock/` (dev), real API in production |

---

## Screen Flow

```
Splash (/)
  └─► Login (/login)
        ├─► [existing account] ──────────────────────► Daily Home (/daily)
        └─► [new account / Google new user]
              └─► T&C (/terms)
                    ├─► [back, not logged in] ──────► Login
                    ├─► [back, already logged in] ──► Daily Home
                    └─► [agree] ──────────────────► Register (/register)
                          └─► [complete] ──────────► Daily Home (/daily)

Register (/register)
  └─► [don't know time] ──► Time Finder (/timefinder)
                                └─► [select slot] ──► back to Register
                                └─► [need premium] ─► Premium (/premium)
                                                         └─► [purchased] ─► Time Finder
```

---

## Auth Flow (Login)

**File:** `screens/Login.tsx`

### Dev mode
- Shows a yellow "DEV MODE" badge
- Mock login buttons for quick testing (existing user → `/daily`, new user → `/terms`)
- No real API calls

### Production mode
- **Google Sign-In button** (uses `@react-oauth/google` or similar)
- After Google auth returns an ID token:
  1. Call `POST /api/auth/google` with the token
  2. If response includes `isNewUser: true` → navigate to `/terms`
  3. If existing user → navigate to `/daily`
- Error messages shown in `.revamp-loginError` styled box
- T&C link navigates to `/terms` (view-only, not agreement flow)

### Key logic
```typescript
// Existing user
navigate("/daily", { replace: true });

// New user (first time)
navigate("/terms", { state: { fromGoogle: true } });
```

---

## Registration Flow

**File:** `screens/Register.tsx`

### Fields (all mandatory except gender)
| Field | Type | Validation |
|---|---|---|
| Full Name | text | required |
| Date of Birth | date | required |
| Place of Birth | text | required |
| Living Country | select | required |
| Gender | select | optional |
| Time of Birth | 4-slot selector | required |

### Time of Birth — 4-slot selector
Replaces the old text input. Users pick one of four time-of-day slots:

| Slot | Emoji | Time Range | Chinese |
|---|---|---|---|
| Midnight | 🌙 | 12:00 AM – 6:00 AM | 子時–丑時 |
| Morning | 🌅 | 6:00 AM – 12:00 PM | 寅時–巳時 |
| Afternoon | ☀️ | 12:00 PM – 6:00 PM | 午時–申時 |
| Night | 🌆 | 6:00 PM – 12:00 AM | 酉時–亥時 |

Each slot shows 3 AI-generated personality traits to help users identify their slot.

### Validation
- All required fields show a red error message below when empty and "Register" is clicked
- The submit button is labelled **"Register"** (not "Continue")
- Fields use `.revamp-formInput--error` CSS class when invalid

### After registration
- Navigates to `/daily` (home page)

---

## Time Finder Flow

**File:** `screens/TimeFinder.tsx`

Used when a user doesn't know their exact birth time. Presents 5 shichen (時辰) slots:

- 1 slot before the suspected time
- 3 slots in the suspected time-of-day range
- 1 slot after the suspected time

### Rules
- **No skip button** — time of birth is required
- **No menu/nav button** — prevents bypassing
- Premium content (personality details beyond the 3 basic traits) is **blurred**
- Free users see a lock overlay with "Upgrade to Premium" CTA
- After premium purchase, the app returns to `/timefinder` (not home)

### 5-slot display
Each slot shows:
- Shichen name (Chinese + English)
- Time range
- 3 personality traits (always visible)
- Extended family history / detailed analysis (blurred for free users)

---

## Daily Home Page

**File:** `screens/Home.tsx`

### Layout order
1. **TopBar** — user pill, notification bell, theme toggle
2. **Date header** — formatted date
3. **Today's Phase row** — Energy Score badge + Day Pillar card (side-by-side)
4. **Section cards** (Today | Luck & Avoid flip | Protection | Upcoming)
5. **Daily Fortune detail**:
   - Summary & Advice
   - Lucky Activity
   - Lucky Colors (shown **once** — no duplicate)
   - Do / Don't panels (side-by-side)
   - Recommendations

### Luck & Avoid flip card
- **Front:** Lucky (吉) — shows `LuckAvoidMeta` with luck data
- **Back:** Unlucky (凶) — shows `LuckAvoidMeta` with avoid data
- A "tap to flip" hint is shown via CSS `::after` pseudo-element
- Title changes between "Lucky" and "Unlucky" when flipped

### Do / Don't panels
- Shown side-by-side in a 2-column grid
- **Do (Lucky):** always visible, green styling
- **Don't (Unlucky):** content blurred for free users with a lock overlay
- Free users see "Upgrade to Premium to see what to avoid" CTA
- Premium users see full Don't list, red styling

### Energy Score + Day Pillar
- Displayed together in a flex row under "Today's Phase" section header
- Energy Score is a badge (e.g. "8.5/10")
- Day Pillar is a compact `BaziPillarCard`

---

## Section Header Standard

**Component:** `components/SectionTitleRow.tsx`

All section headers across all content pages follow this standard:

```
[leading icon?]  [Chinese name (muted)]  English Title  [? button → InfoPopup]
```

### Props
```typescript
<SectionTitleRow
  titleKey="home.sections.today"        // English title i18n key
  zhNameKey="home.sections.todayZh"     // Chinese name i18n key (optional)
  iconKey="today"                        // Leading icon (optional)
  secondaryIconKey="luck"               // Secondary icon (optional, used for Luck & Avoid)
  help={{
    titleKey: "home.help.today.title",  // Popup title
    bodyKey: "home.help.today.body",    // Popup body
  }}
/>
```

### Rules
- Help icon is **always "?"** (`question_mark`) — the old `exclamation` variant is deprecated
- `zhNameKey` renders the Chinese name in muted style before the English title
- Popup shows section-specific information (placeholder text used until real copy is written)

### Chinese name i18n keys
| Section | Key | EN value | ZH value |
|---|---|---|---|
| Today | `home.sections.todayZh` | 今日 | 今日 |
| Luck & Avoid | `home.sections.luckZh` | 吉凶 | 吉凶 |
| Protection | `home.sections.protectionZh` | 護身 | 護身 |
| Upcoming | `home.sections.upcomingZh` | 預覽 | 預覽 |

---

## Dev vs Production Mode

**Detection:** `import.meta.env.MODE === "development"` or `VITE_DATA_MODE=mock`

### Mock data (dev only)
- `preferencesStore.ts` — `persistPreferences()` only saves to `localStorage` in dev mode
- All API calls fall back to mock data in `services/mock/`
- Login screen shows a yellow "DEV MODE" badge with mock login buttons

### Production
- Real API calls via `services/providers/`
- Google OAuth for authentication
- No mock data persisted to localStorage

### Environment variables
| Variable | Dev value | Prod value |
|---|---|---|
| `VITE_DATA_MODE` | `mock` | `live` |
| `VITE_BASE_PATH` | `/` | `/8fate-web` (GitHub Pages) or `/` (custom domain) |
| `VITE_GOOGLE_CLIENT_ID` | (not set) | Google OAuth client ID |

---

## i18n (Internationalisation)

**Files:** `i18n/en.json`, `i18n/zh-Hant.json`

**Usage:**
```typescript
import { t } from "../i18n/t";
t("home.sections.today")           // "Today" or "今日"
t("home.header.dateLabel", { date: "Mon, 26 Mar" })
```

### Adding new keys
1. Add to `en.json` first
2. Add matching key to `zh-Hant.json`
3. Use placeholder text if translation not ready

### Key namespaces
| Namespace | Purpose |
|---|---|
| `home.*` | Daily home page |
| `bazi.daily.*` | Daily fortune detail |
| `bazi.chart.*` | BaZi chart page |
| `yearly.*` | Yearly forecast |
| `auth.*` | Login / register |
| `register.*` | Registration form |
| `timeFinder.*` | Time finder screen |
| `common.*` | Shared labels (loading, error, retry) |

---

## Premium / Locked Content

**User level:** `profile.level === "advanced"` = premium

### Blurred content pattern
```tsx
<div className={`revamp-doDontPanel--dont ${!isPremium ? "revamp-doDontPanel--locked" : ""}`}>
  <ul className="revamp-doDontList">
    {/* content — blurred via CSS filter when locked */}
  </ul>
  {!isPremium && (
    <div className="revamp-doDontLockedOverlay" onClick={() => navigate("/premium")}>
      <span>🔒</span>
      <span className="revamp-doDontLockedLabel">{t("bazi.daily.unlockDont")}</span>
    </div>
  )}
</div>
```

### Premium pages
- `/premium` — PremiumLanding (feature overview)
- `/purchase` — PurchasePage (payment)
- `/purchase/success` — PurchaseSuccess

### After purchase
- Time Finder: returns to `/timefinder` (not home)
- Other premium content: returns to the originating page via `navigate(-1)`

---

## Deployment

### GitHub Pages (current)
- **URL:** https://benougroup.github.io/8fate-web/
- **Branch:** `gh-pages` contains the built `dist/` folder
- **SPA routing:** `404.html` redirects all paths to `index.html` via query string encoding
- **Build command:** `VITE_BASE_PATH=/8fate-web VITE_DATA_MODE=mock vite build`

### Custom domain (planned: `dev.8fate.ai`)
1. Add CNAME record in GoDaddy: `dev` → `benougroup.github.io`
2. Add `CNAME` file to `dist/` with content `dev.8fate.ai`
3. Rebuild with `VITE_BASE_PATH=/` (root path for custom domain)
4. Push to `gh-pages` branch

### Production (`8fate.ai` on AWS)
- Rebuild with `VITE_BASE_PATH=/` and `VITE_DATA_MODE=live`
- Deploy `dist/` to S3/CloudFront or EC2

---

## Version History

- **v20260213** — Current active development version (this directory)
- **v20251228b** — Prior revamp architecture retained as historical reference

## Structure rules

- `screens/` — route-level page components
- `components/` — reusable presentational UI
- `hooks/` — UI logic and state helpers
- `services/` — API/data fetching (mock + real)
- `stores/` — Zustand state stores
- `i18n/` — translation JSON files
- `contracts/` — TypeScript types/interfaces
- `assets/` — icon map, image assets

---

## Known Placeholders / TODO

| Item | Location | Notes |
|---|---|---|
| Google OAuth client ID | `Login.tsx` | Replace `YOUR_GOOGLE_CLIENT_ID` with real value |
| Section info popup body text | `i18n/en.json`, `i18n/zh-Hant.json` | All `home.help.*.body` keys are placeholder text |
| AI personality descriptions for time slots | `Register.tsx` `TIME_SLOTS` | Hardcoded — replace with AI-generated content |
| Time Finder extended family history | `TimeFinder.tsx` | Blurred premium content — needs real AI content |
| Real API integration | `services/providers/` | All providers currently fall back to mock data |
| Push notifications | `NotificationButton.tsx` | `hasUnreadNotifications` always `false` |
| Compatibility page | `screens/Compatibility.tsx` | Stub — not linked from nav |
| Auspicious Dates page | `screens/AuspiciousDates.tsx` | Stub — not linked from nav |
