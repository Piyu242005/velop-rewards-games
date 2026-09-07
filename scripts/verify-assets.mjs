import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const requiredGameAssets = Array.from({ length: 13 }, (_, i) => `${String(i + 1).padStart(2, '0')}-`);
const root = new URL('..', import.meta.url);
const scanDirs = ['src', 'public', 'assets'];
const pngRefs = [];
const pngAssets = [];
const avifAssets = [];

async function walk(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(jsx?|css|html|json)$/i.test(entry.name)) {
      const text = await readFile(path, 'utf8');
      if (/\.png(?:["')?\s]|$)/i.test(text)) pngRefs.push(path);
    } else if (/\.png$/i.test(entry.name)) pngAssets.push(path);
    else if (/\.avif$/i.test(entry.name)) avifAssets.push(path);
  }
}

for (const dir of scanDirs) await walk(new URL(`../${dir}/`, import.meta.url));

const gamePngs = pngAssets.filter((p) => /[\\/]assets[\\/]games[\\/]/.test(p));
const gameAvifs = avifAssets.filter((p) => /[\\/]assets[\\/]games[\\/]/.test(p));

console.log(`PNG assets found: ${pngAssets.length}`);
console.log(`Game PNG assets found: ${gamePngs.length}`);
console.log(`Game AVIF assets found: ${gameAvifs.length}`);
console.log(`Source/config files referencing PNG: ${pngRefs.length}`);

if (gamePngs.length > 0) {
  console.error('Game artwork is still stored as PNG. Convert the 13 supplied game assets to AVIF before production sign-off.');
  process.exitCode = 1;
}

const missingPrefixes = requiredGameAssets.filter((prefix) => !gameAvifs.some((p) => p.split(/[\\/]/).pop().startsWith(prefix)));
if (missingPrefixes.length) {
  console.error(`Missing AVIF game assets for: ${missingPrefixes.join(', ')}`);
  process.exitCode = 1;
}

const staleGamePngReference = pngRefs.some((p) => /[\\/]src[\\/]/.test(p));
if (staleGamePngReference) {
  console.error('Source/config files still reference PNG assets. Remove stale production PNG references.');
  process.exitCode = 1;
}

if (!process.exitCode) console.log('Asset verification passed.');
