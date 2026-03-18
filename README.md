# 8fate Web App

BaZi fortune-telling web application — demo deployment.

## Live Demo
**GitHub Pages:** https://benougroup.github.io/8fate-web/

## Tech Stack
- React + TypeScript + Vite
- React Router v6 (with GitHub Pages SPA routing support)
- Zustand state management
- i18n (English + Traditional Chinese)

## Deployment

### GitHub Pages (current)
The `gh-pages` branch contains the pre-built production build.
URL: `https://benougroup.github.io/8fate-web/`

### Custom Domain (future — dev.8fate.ai)
1. Rebuild with `VITE_BASE_PATH=/`
2. Add a CNAME record in GoDaddy: `dev` → `benougroup.github.io`
3. Add `CNAME` file in dist with content `dev.8fate.ai`

## Build
```bash
# For GitHub Pages subdirectory
VITE_BASE_PATH=/8fate-web npm run build

# For custom domain root
npm run build
```

## Features
- Splash → Login → Register → Daily Fortune flow
- BaZi Chart (Four Pillars, Element Balance, Day Master)
- Daily Fortune with activity/direction/element icons
- Yearly Forecast with zodiac reading, half-year luck split, special stars
- Luck Pillars with Ten Gods icons
- Portfolio page with quick action cards
- Info popups on all section headers
- Dark/Light theme toggle
- English + Traditional Chinese i18n
