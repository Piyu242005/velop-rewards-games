# VELOOP Rewards Games

> **Play. Earn. Redeem.**  
> A premium browser-based games ecosystem built on the VELOOP Rewards concept.

[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev) [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev) [![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?logo=github)](https://piyu242005.github.io/velop-rewards-games/)

## What is included

Players can browse 13 game entries, enter the currently playable games with Tokens, earn Game Coins, and use the Redemption Centre to review five reward types: **VE, SVE, Gems, Tokens, and Spins**.

The redemption flow supports reward selection, quantity controls, live total-cost calculation, confirmation, balance-after preview, insufficient-balance feedback, successful redemption confirmation, Escape-key handling, focus handling, and reduced-motion support.

## Game ecosystem

- **13 reusable game cards** generated from structured data.
- **2 playable games:** Space Shooter and Fruit Blast.
- **11 coming-soon games** remain visible in the same reusable card system.
- **20 Tokens** is the entry fee for every game.
- A centralized persisted **Game Coin** balance is shared across games and redemption.
- First-time game guides are remembered per game so returning users can skip the full guide.
- Game result flows support Game Over, Revive, reward collection, and redemption.

## Economy

| Reward | Cost |
|---|---:|
| VE | 500 GC |
| SVE | 800 GC |
| Gems | 100 GC |
| Tokens | 200 GC |
| Spins | 150 GC |

Game Coins and Tokens are persisted in `localStorage` for the frontend prototype. A production backend must validate game sessions, scores, completion, reward calculation, and account balances server-side.

## QA commands

```bash
npm install
npm run build
npm test
npm run qa:redemption
npm run qa:games
npm run verify:assets
npm run qa
```

`qa:redemption` checks redemption flow/accessibility hooks. `qa:games` checks the 13-game data contract, 20-token entry cost, playable routes, guide/reward wiring, carousel behavior hooks, accessibility hooks, and AVIF references. `verify:assets` is the production asset gate and requires all 13 game artworks to exist as AVIF files with no game PNG assets remaining.

## Accessibility

The application includes skip navigation, keyboard-visible focus, ARIA labels, live status/error messaging, dialog semantics, Escape-to-close behavior, keyboard activation for Fruit Blast, touch input for Space Shooter, and `prefers-reduced-motion` handling. Final manual certification should still include keyboard-only, screen-reader, contrast, and real-device verification.

## Responsive UX

The Games hub and cards are designed for **320px+**, tablet, laptop, desktop, and large-screen layouts. Card widths are constrained by breakpoint so 1920px+ displays do not stretch the content excessively. Mobile CTAs and game areas are designed for touch interaction.

Final production sign-off still requires a deployed browser/device matrix check covering at least 320px, 375px, 414px, tablet, 1366px, 1440px, 1600px, and 1920px+.

## Assets

Game artwork references use AVIF filenames such as `01-space-shooter.avif` through `13-aqua-escape.avif`. The repository must contain the actual optimized AVIF binaries before the asset gate can pass. Branding/reward icons may remain PNG where the source asset is an icon and AVIF conversion is not necessary.

The supplied task requires optimized AVIF game artwork, a transparent token asset around 20px, and separate image artwork plus coded Play Now UI.

## Architecture

```text
src/
├── components/games/
│   ├── GameCard.jsx
│   ├── GamesCarousel.jsx
│   ├── PlayNowButton.jsx
│   ├── TokenCost.jsx
│   └── GameRedeem.jsx
├── context/
│   ├── GameCoinContext.jsx
│   └── TokenContext.jsx
├── games/
│   ├── GameOne/
│   └── GameTwo/
├── pages/
│   ├── Games.jsx
│   ├── GameHome.jsx
│   ├── GameGuidePage.jsx
│   ├── GameRewardPage.jsx
│   └── GameRedeem.jsx
├── utils/
│   ├── redemption.js
│   └── redemption.test.js
└── data/
    └── gamesData.js
```

## Carousel

The game carousel uses a reusable `GameCard`, duplicated datasets for a seamless loop, automatic horizontal scrolling, pause/resume on pointer interaction, manual touch/drag support, dot indicators, and no left/right navigation arrows. Play Now uses an infinite shimmer animation with reduced-motion handling.

## Deployment

The repository is configured for GitHub Pages using Vite + `HashRouter`. A Vercel/Netlify deployment can use the same production `dist/` output with the appropriate base-path setting.

## Final status

| Item | Status |
|---|---|
| 13 game cards | ✅ Implemented |
| Reusable game-card architecture | ✅ Implemented |
| 20 Token entry requirement | ✅ Implemented |
| Infinite Play Now shimmer | ✅ Implemented |
| Auto-scroll carousel | ✅ Implemented |
| Touch/drag carousel | ✅ Implemented |
| Dot indicators | ✅ Implemented |
| No carousel arrows | ✅ Implemented |
| Space Shooter playable | ✅ Implemented |
| Fruit Blast playable | ✅ Implemented |
| Centralized Game Coin economy | ✅ Implemented |
| Redemption: VE / SVE / Gems / Tokens / Spins | ✅ Implemented |
| Redemption confirmation / insufficient balance | ✅ Implemented + tested |
| First-time guide memory | ✅ Implemented |
| Accessibility implementation | ✅ Implemented; manual certification pending |
| Responsive source-level QA | ✅ Added |
| AVIF references | ✅ Migrated |
| Actual 13 AVIF game binaries | ⚠️ Must be added to repository |
| Deployed browser/device QA | ⚠️ Final manual verification required |
| Submission screen recording | ⚠️ Required before handoff |

## Submission checklist

1. Add/verify the 13 optimized AVIF game binaries.
2. Run `npm run qa` and require a clean pass.
3. Perform the deployed device/browser matrix test.
4. Capture the required two-game + redemption screen recording.
5. Submit the GitHub repository and live deployment links.

## Author

**Piyush Ramteke**  
GitHub: [@Piyu242005](https://github.com/Piyu242005)

---

*VELOOP Rewards Games — React + Vite*