# VELOOP Rewards Games

> **Play. Earn. Redeem.**  
> A premium games ecosystem built on top of the VELOOP Rewards platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | JavaScript / JSX |
| Styling | CSS Modules + Bootstrap 5 |
| Routing | React Router 6 |
| State | Context API + useReducer |
| Animation | Framer Motion (selective) · CSS keyframes |
| Icons | Lucide React |

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Architecture

```
src/
├── components/games/    # Shared game UI components
├── pages/               # Route-level pages
├── games/               # Individual game environments
│   ├── GameOne/         # Space Shooter
│   └── GameTwo/         # Fruit Blast
├── data/                # Static game data
├── context/             # GameCoinContext (shared economy)
├── hooks/               # useCarousel, useGameState, useGameCoins
├── styles/              # CSS design system
└── assets → public/assets/
    ├── games/           # 13 game artworks
    ├── branding/        # Logo and tagline assets
    ├── icons/           # Token, coin, redeem icons
    └── reference/       # Original reference image
```

## Game Economy

- **Tokens** — entry currency (20 per session)
- **Game Coins** — earned through gameplay, shared across all games
- **Redeem** — convert Game Coins to VE, SVE, Gems, Tokens, or Spins

## Implementation Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation, architecture, design system, carousel | ✅ Complete |
| 2 | Game One + Game Two full gameplay, token deduction, game flow | ⏳ Pending |
| 3 | Full redemption system | ⏳ Pending |

## Asset Notes

Game artwork lives in `public/assets/games/`. For production, convert to AVIF/WebP.  
See `ASSET_MANIFEST.json` for the full inventory.
