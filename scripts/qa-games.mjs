import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const read = async (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const failures = [];
const pass = (label) => console.log(`PASS ${label}`);
const fail = (label, detail) => { console.error(`FAIL ${label}${detail ? ` — ${detail}` : ''}`); failures.push(label); };
const assert = (condition, label, detail) => condition ? pass(label) : fail(label, detail);

const games = await read('src/data/gamesData.js');
const app = await read('src/App.jsx');
const packageJson = JSON.parse(await read('package.json'));
const gameHome = await read('src/pages/GameHome.jsx');
const guide = await read('src/pages/GameGuidePage.jsx');
const reward = await read('src/pages/GameRewardPage.jsx');
const coinContext = await read('src/context/GameCoinContext.jsx');
const tokenContext = await read('src/context/TokenContext.jsx');
const carousel = await read('src/components/games/GamesCarousel.jsx');
const card = await read('src/components/games/GameCard.jsx');
const button = await read('src/components/games/PlayNowButton.jsx');
const buttonCss = await read('src/components/games/PlayNowButton.module.css');
const fruit = await read('src/games/GameTwo/Game.jsx');
const space = await read('src/games/GameOne/Game.jsx');
const carouselCss = await read('src/components/games/GamesCarousel.module.css');
const cardCss = await read('src/components/games/GameCard.module.css');

const gameObjects = games.match(/id:\s*\d+,\s*slug:/g) ?? [];
assert(gameObjects.length === 13, '13 game definitions');
assert((games.match(/entryCost:\s*20/g) ?? []).length === 13, '20-token entry cost for all games');
assert(!/\.png['\")]/i.test(games), 'game data has no PNG references');
assert((games.match(/\.avif['\")]/gi) ?? []).length === 13, '13 AVIF game references');

assert(/GamesCarousel/.test(app) && /GameCoinProvider/.test(app) && /TokenProvider/.test(app), 'core providers and carousel wired');
assert(/space-shooter\/play/.test(app) && /fruit-blast\/play/.test(app), 'two playable game routes wired');
assert(/aria-modal="true"/.test(reward), 'reward page uses modal semantics');
assert(/spendTokens\(game\.entryCost\)/.test(gameHome), 'token deduction wired');
assert(/Not enough Tokens/.test(gameHome), 'insufficient-token message present');
assert(/How to Play/.test(guide) && /game\.guide\.map/.test(guide), 'game guide is data-driven');
assert(/earnCoins/.test(space) && /earnCoins/.test(fruit), 'both games award Game Coins');
assert(/SPEND/.test(coinContext) && /localStorage/.test(coinContext), 'central Game Coin state persists');
assert(/localStorage/.test(tokenContext) && /SPEND/.test(tokenContext), 'Token state persists');

assert(/doubled = \[\.\.\.gamesData, \.\.\.gamesData\]/.test(carousel), 'carousel uses duplicated data for seamless loop');
assert(/onMouseEnter=\{pause\}/.test(carousel) && /onMouseLeave=\{resume\}/.test(carousel), 'carousel pauses on hover');
assert(/touch|pointer|drag/i.test(carousel), 'carousel exposes manual interaction hooks');
assert(/CarouselDots/.test(carousel), 'carousel dot indicators wired');
assert(!/Arrow/i.test(carousel), 'carousel component contains no arrow navigation');
assert(/animation:\s*btnShimmer/.test(buttonCss), 'infinite Play Now shimmer exists');
assert(/prefers-reduced-motion/.test(buttonCss), 'Play Now respects reduced motion');
assert(/prefers-reduced-motion/.test(carouselCss) || /prefers-reduced-motion/.test(cardCss) || /reduced-motion/.test(buttonCss), 'motion accessibility is present');
assert(/loading="lazy"/.test(card), 'game art uses lazy loading');
assert(/tabIndex=\{fruit \? 0 : -1\}/.test(fruit), 'Fruit Blast keyboard focus is implemented');
assert(/onKeyDown/.test(fruit), 'Fruit Blast keyboard activation is implemented');
assert(/touch-action:\s*none/.test(await read('src/games/GameOne/Game.module.css')), 'Space Shooter touch input is configured');

assert(Boolean(packageJson.scripts?.build), 'build script exists');
assert(Boolean(packageJson.scripts?.test), 'unit test script exists');
assert(Boolean(packageJson.scripts?.['qa:redemption']), 'redemption QA script exists');
assert(Boolean(packageJson.scripts?.['verify:assets']), 'asset verification script exists');

let pngCount = 0;
let avifCount = 0;
async function walk(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.png$/i.test(entry.name)) pngCount++;
    else if (/\.avif$/i.test(entry.name)) avifCount++;
  }
}
await walk(new URL('../assets/', import.meta.url));
assert(avifCount >= 13, `at least 13 AVIF assets present (found ${avifCount})`);
const gameDir = new URL('../assets/games/', import.meta.url);
let gamePngs = [];
try { gamePngs = (await readdir(gameDir)).filter((name) => /\.png$/i.test(name)); } catch {}
assert(gamePngs.length === 0, 'game artwork directory contains no PNG assets', gamePngs.join(', '));

if (failures.length) {
  console.error(`\\n${failures.length} QA checks failed.`);
  process.exitCode = 1;
} else {
  console.log('\\nAll games ecosystem QA checks passed.');
}