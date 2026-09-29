// Fails the build when what a visitor downloads to see the home page grows past its budget.
// It reads the prerendered HTML, so it measures what the browser will actually request:
// every modulepreloaded script and every stylesheet, in gzip size.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

// Raised in ADR 21 for the motion system (GSAP, ScrollTrigger, SplitText, Lenis): measured
// 227 kB JS and 12.2 kB CSS when it landed. The margin is small on purpose, so growth is a decision.
const BUDGETS_KB = {
  js: 235,
  css: 14,
};

const clientDir = join(import.meta.dirname, '..', 'build', 'client');
const html = readFileSync(join(clientDir, 'en', 'index.html'), 'utf8');

function referencedAssets(pattern) {
  return [...html.matchAll(pattern)].map(([, href]) => href.replace(/^.*?(\/assets\/)/, 'assets/'));
}

const gzipKb = (asset) => gzipSync(readFileSync(join(clientDir, asset))).length / 1024;
const sum = (assets) => assets.reduce((total, asset) => total + gzipKb(asset), 0);

const measured = {
  js: sum(referencedAssets(/<link rel="modulepreload" href="([^"]+)"/g)),
  css: sum(referencedAssets(/<link rel="stylesheet" href="([^"]+)"/g)),
};

let failed = false;
for (const [name, budget] of Object.entries(BUDGETS_KB)) {
  const size = measured[name];
  const ok = size > 0 && size <= budget;
  failed ||= !ok;
  console.warn(
    `${ok ? 'ok  ' : 'FAIL'} home page ${name}: ${size.toFixed(1)} kB gzip (budget ${budget} kB)`,
  );
}

process.exit(failed ? 1 : 0);
