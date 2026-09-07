import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url);
const scanDirs = ['src', 'public', 'assets'];
const pngRefs = [];
const pngAssets = [];

async function walk(dir) {
  let entries = [];
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(jsx?|css|html|json)$/i.test(entry.name)) {
      const text = await readFile(path, 'utf8');
      if (/\.png([\"')?\s]|$)/i.test(text)) pngRefs.push(path);
    } else if (/\.png$/i.test(entry.name)) pngAssets.push(path);
  }
}

for (const dir of scanDirs) await walk(new URL(`../${dir}/`, import.meta.url));

const gamePngs = pngAssets.filter((p) => /[\\/]assets[\\/]games[\\/]/.test(p));
console.log(`PNG assets found: ${pngAssets.length}`);
console.log(`Game PNG assets found: ${gamePngs.length}`);
console.log(`Source/config files referencing PNG: ${pngRefs.length}`);
if (gamePngs.length > 0) {
  console.error('Game assets are still PNG-based; AVIF migration is not complete.');
  process.exitCode = 1;
}
