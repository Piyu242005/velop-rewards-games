# VELOOP Rewards Games

> **Play. Earn. Redeem.**
> A premium, full-stack games ecosystem built on the VELOOP Rewards platform.

[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)](https://getbootstrap.com)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?logo=github)](https://piyu242005.github.io/velop-rewards-games/)

---

## 👤 Author

**Piyush Ramtele**
GitHub: [@Piyu242005](https://github.com/Piyu242005)
Repository: [Piyu242005/velop-rewards-games](https://github.com/Piyu242005/velop-rewards-games)
Live: [piyu242005.github.io/velop-rewards-games](https://piyu242005.github.io/velop-rewards-games/)

---

## 🎮 What is this?

VELOOP Rewards Games is a browser-based gaming hub where players:

1. **Browse 13 games** in a seamless infinite carousel
2. **Spend 20 Tokens** to enter any game session
3. **Play** a fully interactive game
4. **Earn Game Coins** based on their score
5. **Redeem** Game Coins for real VELOOP rewards (VE, SVE, Gems, Tokens, Spins)

---

## ⚡ Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle → dist/
npm run preview   # preview the production build
```

---

## 🗂 Architecture

```
src/
├── components/
│   ├── common/
│   │   └── ErrorBoundary.jsx       # App-level error recovery
│   └── games/
│       ├── GameCard.jsx            # Single carousel card
│       ├── GamesCarousel.jsx       # Infinite seamless carousel
│       ├── CarouselDots.jsx        # Dot indicators
│       ├── PlayNowButton.jsx       # Shimmer CTA button
│       ├── TokenCost.jsx           # "20 Tokens" badge
│       ├── GameHeader.jsx          # Sticky header (logo + balances)
│       ├── GameCoinBalance.jsx     # Live GC balance badge
│       ├── GameRedeem.jsx          # Full redemption component
│       ├── GameGuide.jsx           # Game rules component
│       ├── GameOver.jsx            # Game over overlay
│       └── ReviveModal.jsx         # Revive confirmation
│
├── pages/
│   ├── Games.jsx                   # Hub: hero + stats strip + carousel
│   ├── GameHome.jsx                # Per-game landing + token gate
│   ├── GameGuidePage.jsx           # How-to-play rules
│   ├── GameRewardPage.jsx          # Post-game reward screen
│   ├── GameRedeem.jsx              # Redemption centre
│   └── NotFound.jsx                # 404 page
│
├── games/
│   ├── GameOne/Game.jsx            # 🚀 Space Shooter (canvas)
│   └── GameTwo/Game.jsx            # 🍎 Fruit Blast (grid match)
│
├── data/
│   └── gamesData.js                # 13 game definitions + guide rules
│
├── context/
│   ├── GameCoinContext.jsx          # Shared GC economy (localStorage)
│   └── TokenContext.jsx             # Token balance (localStorage)
│
├── hooks/
│   ├── useCarousel.js              # Infinite carousel logic
│   ├── useGameState.js             # Game session lifecycle
│   ├── useGameCoins.js             # GC context wrapper
│   ├── useTokens.js                # Token context wrapper
│   └── usePageTitle.js             # Per-page document.title
│
└── styles/
    ├── variables.css               # 30+ CSS custom properties
    ├── global.css                  # Reset, utilities, skip-nav
    └── animations.css              # Keyframes, reduced-motion
```

---

## 🛣 Routes

| Route | Page |
|---|---|
| `/` | → redirects to `/games` |
| `/games` | Games Hub |
| `/games/:slug/home` | Game Landing (token gate) |
| `/games/:slug/guide` | How to Play |
| `/games/space-shooter/play` | Space Shooter gameplay |
| `/games/fruit-blast/play` | Fruit Blast gameplay |
| `/games/:slug/reward` | Post-game reward |
| `/redeem` | Redemption Centre |
| `*` | 404 Not Found |

> Uses `HashRouter` for full compatibility with GitHub Pages static hosting.

---

## 💰 Economy

### Tokens
- Starting balance: **200 Tokens** (persisted in `localStorage`)
- Entry cost: **20 Tokens** per game session
- Earned by: Redeeming Game Coins → Tokens

### Game Coins
- Starting balance: **0** (persisted in `localStorage`)
- Earned by: playing games (score converts to coins)
- Shared across all games — one balance, everywhere

### Redemption Rates

| Reward | Cost |
|---|---|
| VE | 500 GC |
| SVE | 800 GC |
| Gems | 100 GC |
| Tokens | 200 GC |
| Spins | 150 GC |

---

## 🎮 Playable Games

### 🚀 Space Shooter (Game One)
- Canvas 480×640, 60fps `requestAnimationFrame` loop
- Auto-fire, mouse/touch steering
- Wave-based enemy spawning (diamonds + boss hexagons every 5 waves)
- Asteroid hazards from Wave 2, particle burst explosions
- Scrolling star-field parallax background
- **Economy:** 1 Game Coin per 100 score points
- Full loop: IDLE → PLAYING → OVER → REVIVE → REWARD

### 🍎 Fruit Blast (Game Two)
- 8×9 grid, 6 emoji fruits
- BFS flood-fill group detection, hover preview
- Gravity fall after blast, pop animation
- **Economy:** 1 Game Coin per 500 score points
- Full loop: IDLE → PLAYING → OVER → REVIVE → REWARD

---

## 🎨 Design System

```
Background:  #161827   (deep navy)
Surface:     #1d1f33
Accent:      #d63a3a   (crimson/red)
Token:       #9b7dff   (purple)
Game Coin:   #f5c842   (gold)
```

Features: glassmorphism header · ambient radial glows · subtle grid lines · infinite shimmer on Play Now · CSS custom properties throughout · CSS Modules for all components · no inline styles outside game canvases.

---

## ♿ Accessibility

- Skip-to-main-content link
- `prefers-reduced-motion` respected everywhere
- ARIA roles: `role="list"`, `role="listitem"`, `role="grid"`, `role="gridcell"`, `role="dialog"`, `aria-modal`, `aria-live`, `aria-label`
- Full keyboard navigation
- Meaningful `alt` text on all images
- Focus-visible outlines on all interactive elements
- Error boundary recovers from runtime crashes

---

## 📱 Responsive Breakpoints

| Viewport | GameCard width |
|---|---|
| 320–374px | 152px |
| 375–479px | 168px |
| 480–767px | 190px |
| 768–1023px | 210px |
| 1024–1365px | 220px |
| 1366–1439px | 230px |
| 1440–1599px | 240px |
| 1600–1919px | 255px |
| 1920px+ | 272px |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | JavaScript / JSX |
| Styling | CSS Modules + Bootstrap 5 |
| Routing | React Router 6 (HashRouter) |
| State | Context API + useReducer |
| Persistence | localStorage |
| Animation | CSS keyframes + Framer Motion (available) |
| Icons | Lucide React (available) |

---

## 🚀 Deployment

This project is configured to auto-deploy to **GitHub Pages** via GitHub Actions on every push to `main`.

### CI/CD Pipeline (`.github/workflows/deploy.yml`)
1. Checkout code
2. Setup Node 20 + `npm ci`
3. `npm run build` (with `VITE_BASE_PATH=/velop-rewards-games/`)
4. Copy `dist/index.html` → `dist/404.html` (SPA fallback for deep links)
5. Push `dist/` to `gh-pages` branch via `peaceiris/actions-gh-pages@v4`

### Manual deploy
```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, or any static host.
```

**Vercel:** connect repo → auto-deploys on push to `main`.
**Netlify:** drag-and-drop `dist/` or connect repo.

> ⚠️ After the first push: go to **Settings → Pages → Source → `gh-pages` branch** to enable the live site.

---

## 📋 Phase Status

| Phase | Description | Status |
|---|---|---|
| 1 | Foundation — Vite + React + structure | ✅ |
| 2 | 13 Game Hub — carousel, data, context | ✅ |
| 3 | Carousel — seamless loop, dots, drag, auto-scroll | ✅ |
| 4 | Responsive / QA foundation | ✅ |
| 5 | Two fully playable games | ✅ |
| 6 | Central Game Coin economy | ✅ |
| 7 | Redemption centre (5 reward types) | ✅ |
| 8 | Final QA — persistence, error boundary, a11y, titles | ✅ |
| GH Pages | GitHub Pages deployment — CI, HashRouter, base path | ✅ |

---

## Assets

All game artwork, icons, and branding assets are in `public/assets/`.
See [`ASSET_MANIFEST.json`](./ASSET_MANIFEST.json) for the full inventory.

For production: convert `public/assets/games/*.png` to AVIF/WebP for optimal performance.

---

*VELOOP Rewards Games — Built by **Piyush Ramtele** with React + Vite*
