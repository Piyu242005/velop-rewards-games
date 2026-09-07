# VELOOP Rewards Games

> **Play. Earn. Redeem.**  
> A premium browser-based games ecosystem built on the VELOOP Rewards concept.

[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev) [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev) [![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?logo=github)](https://piyu242005.github.io/velop-rewards-games/)

## What is included

Players can browse 13 game entries, enter the currently playable games with Tokens, earn Game Coins, and use the Redemption Centre to review five reward types: **VE, SVE, Gems, Tokens, and Spins**.

The redemption flow now supports:

- reward selection for all five catalogue entries
- quantity controls and live total-cost calculation
- confirmation dialog with balance-after preview
- explicit insufficient-balance feedback
- successful redemption confirmation with remaining balance
- Escape-key and focus handling for the modal
- keyboard-visible focus states and reduced-motion support

## Economy

| Reward | Cost |
|---|---:|
| VE | 500 GC |
| SVE | 800 GC |
| Gems | 100 GC |
| Tokens | 200 GC |
| Spins | 150 GC |

Game Coins are persisted in `localStorage` through the shared `GameCoinContext`.

## QA commands

```bash
npm install
npm run build
npm run qa:redemption
npm test
npm run verify:assets
```

`qa:redemption` checks the implemented redemption accessibility and flow hooks. `npm test` covers the pure redemption rules and balance boundaries.

`verify:assets` is intentionally strict: it fails while game artwork remains PNG-based. The current repository still contains PNG game artwork, so **AVIF migration is not yet complete**; the check provides a production gate rather than falsely marking the repository compliant.

## Accessibility

The application includes skip navigation, keyboard-visible focus, ARIA labelling for major interactive areas, live status/error messaging, modal semantics, Escape-to-close behavior, and `prefers-reduced-motion` handling. The README does not claim full manual accessibility certification; browser/device QA is still required before production sign-off.

## Responsive QA

The redemption centre is designed for mobile and desktop layouts, including compact widths below 480px. Automated source-level QA is included, but visual device-matrix verification must still be run against the deployed build for final production sign-off.

## Assets

Source game artwork is currently stored as PNG files under `assets/games/`. Do not mark production asset compliance complete until those files are converted to AVIF and all runtime references are migrated. See `ASSET_MANIFEST.json` for the inventory.

## Architecture

```text
src/
├── components/games/
│   ├── GameRedeem.jsx
│   └── GameRedeem.module.css
├── context/
│   └── GameCoinContext.jsx
├── hooks/
│   └── useGameCoins.js
├── pages/
│   └── GameRedeem.jsx
└── utils/
    ├── redemption.js
    └── redemption.test.js
```

## Deployment

The repository is configured for GitHub Pages using Vite + `HashRouter`. A Vercel/Netlify deployment can use the same production `dist/` output with the appropriate base-path setting.

## Status

| Item | Status |
|---|---|
| Game Coin redemption centre | ✅ Implemented |
| VE / SVE / Gems / Tokens / Spins | ✅ Implemented |
| Redemption confirmation | ✅ Implemented |
| Insufficient balance handling | ✅ Implemented + boundary-tested |
| Accessibility behavior | ✅ Implemented; manual audit still required |
| Automated redemption QA | ✅ Added |
| Mobile/desktop visual QA | ⚠️ Requires deployed browser/device verification |
| AVIF asset compliance | ❌ Not complete — PNG game assets remain |
| Production asset quality gate | ⚠️ Added; currently fails until AVIF migration |

## Author

**Piyush Ramtele**  
GitHub: [@Piyu242005](https://github.com/Piyu242005)

---

*VELOOP Rewards Games — React + Vite*