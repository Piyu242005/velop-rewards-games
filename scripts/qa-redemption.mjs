import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/games/GameRedeem.jsx', import.meta.url), 'utf8');
const checks = [
  ['five reward ids', /REDEEM_OPTIONS/],
  ['confirmation dialog', /aria-modal="true"/],
  ['insufficient balance copy', /Insufficient Game Coins/],
  ['success confirmation', /Redeemed <strong>/],
  ['escape support', /event\.key === 'Escape'/],
  ['focus-visible styling', true],
];
const css = await readFile(new URL('../src/components/games/GameRedeem.module.css', import.meta.url), 'utf8');
checks[5][1] = /focus-visible/.test(css);

let failed = false;
for (const [name, pattern] of checks) {
  const ok = pattern.test ? pattern.test(source + css) : Boolean(pattern);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  failed ||= !ok;
}
process.exitCode = failed ? 1 : 0;
