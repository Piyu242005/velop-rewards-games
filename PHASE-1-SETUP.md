# Phase 1 — Setup & Assets

## Goal
Prepare the React/Vite foundation and all supplied game assets before implementing the 13-game banner system.

## Setup
- [ ] Initialize React + Vite application
- [ ] Configure Bootstrap
- [ ] Configure CSS Modules (`.module.css`)
- [ ] Configure React Hooks and reusable component architecture
- [ ] Create folders for components, pages, games, data, context, hooks, styles, and assets

## Game Assets
- [ ] Collect/review all 13 supplied game artwork assets
- [ ] Identify the required game artwork in every source image
- [ ] Crop unnecessary portions
- [ ] Preserve important artwork and the intended aspect ratio
- [ ] Ensure artwork is not stretched or distorted
- [ ] Check image quality: no unnecessary blur, pixelation, low resolution, or compression
- [ ] Use only legitimate assets and enhancement methods

## Token Asset
- [ ] Prepare the supplied Token image
- [ ] Remove any unwanted background
- [ ] Ensure transparent background
- [ ] Verify there is no white/black square, border, or unwanted box
- [ ] Keep banner display size around 20px

## Game Coin Asset
- [ ] Prepare the supplied Game Coin image
- [ ] Verify correct artwork
- [ ] Optimize for web usage

## Image Optimization
- [ ] Optimize all source images for web
- [ ] Convert game artwork to AVIF where appropriate
- [ ] Use meaningful asset names
- [ ] Avoid oversized source files
- [ ] Keep mobile performance in mind

## Target Asset Structure
```text
public/
└── assets/
    ├── games/
    │   ├── game-01.avif
    │   ├── game-02.avif
    │   ├── ...
    │   └── game-13.avif
    ├── token.avif
    └── game-coin.avif
```

## Target Source Structure
```text
src/
├── components/
│   └── games/
├── games/
│   ├── GameOne/
│   └── GameTwo/
├── pages/
├── data/
├── context/
├── hooks/
├── styles/
├── App.jsx
└── main.jsx
```

## Phase 1 Definition of Done
- [ ] React/Vite foundation runs successfully
- [ ] Required UI stack configured
- [ ] All 13 game source assets reviewed
- [ ] Required crops prepared
- [ ] Token asset has transparent background
- [ ] Game Coin asset prepared
- [ ] Optimized AVIF assets prepared where appropriate
- [ ] No stretched/distorted artwork
- [ ] Phase 1 ready for GameCard/GamesCarousel implementation
