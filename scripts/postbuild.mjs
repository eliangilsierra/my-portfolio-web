// Turns the prerendered output of `react-router build` into something GitHub Pages can serve:
//   1. 404.html      - the static fallback Pages returns (with a 404 status) for unknown addresses.
//                      It hydrates whatever URL was requested, so deep links to routes that were not
//                      prerendered still work.
//   2. CSP           - a Content-Security-Policy <meta> per page, allowing only the inline scripts that
//                      page actually contains (identified by hash), so no 'unsafe-inline' is needed.
//   3. sitemap.xml   - every prerendered page with its language alternates (needs VITE_SITE_URL).
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, sep } from 'node:path';
import { loadEnv } from 'vite';
import { LOCALES } from '../src/domain/locale.ts';

const root = join(import.meta.dirname, '..');
const clientDir = join(root, 'build', 'client');
const siteUrl = loadEnv('production', root, 'VITE_').VITE_SITE_URL?.replace(/\/$/, '');

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

// --- 1. Layout and 404.html --------------------------------------------------------------------
// Behind a base path (/repo/), React Router writes the prerendered pages under build/client/<repo>/
// and names the SPA fallback index.html. GitHub Pages serves the artifact root at the base path,
// so the pages must sit at the root and the fallback must become 404.html.
const basename = (loadEnv('production', root, 'VITE_').VITE_BASE_PATH || '/').replace(
  /^\/|\/$/g,
  '',
);
const nestedDir = basename ? join(clientDir, basename) : undefined;
const hasNestedPages = nestedDir !== undefined && existsSync(nestedDir);

const fallbackPath = existsSync(join(clientDir, '__spa-fallback.html'))
  ? join(clientDir, '__spa-fallback.html')
  : join(clientDir, 'index.html');
const notFoundPath = join(clientDir, '404.html');
if (!existsSync(fallbackPath) || (fallbackPath.endsWith('index.html') && !hasNestedPages)) {
  throw new Error('postbuild: could not find the SPA fallback page in build/client');
}
copyFileSync(fallbackPath, notFoundPath);
rmSync(fallbackPath);

if (hasNestedPages) {
  for (const name of readdirSync(nestedDir)) {
    renameSync(join(nestedDir, name), join(clientDir, name));
  }
  rmSync(nestedDir, { recursive: true });
}
writeFileSync(
  notFoundPath,
  readFileSync(notFoundPath, 'utf8').replace(
    '<head>',
    '<head><meta name="robots" content="noindex"/>',
  ),
);
// Pages runs Jekyll unless told otherwise, and Jekyll ignores paths starting with an underscore.
writeFileSync(join(clientDir, '.nojekyll'), '');

// --- 2. Content-Security-Policy ----------------------------------------------------------------
const INLINE_SCRIPT =
  /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;

function buildPolicy(scriptHashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`,
    "style-src 'self'",
    // React and the reveal animation set custom properties through style attributes.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

const htmlFiles = listFiles(clientDir).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('Content-Security-Policy')) continue;

  const hashes = [...html.matchAll(INLINE_SCRIPT)].map(
    ([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`,
  );
  const meta = `<meta http-equiv="Content-Security-Policy" content="${buildPolicy(hashes)}"/>`;
  const charset = '<meta charSet="utf-8"/>';

  writeFileSync(
    file,
    html.includes(charset)
      ? html.replace(charset, `${charset}${meta}`)
      : html.replace('<head>', `<head>${meta}`),
  );
}

// --- 3. sitemap.xml ----------------------------------------------------------------------------
const pagePaths = htmlFiles
  .map((file) => `/${relative(clientDir, file).split(sep).join('/')}`)
  .filter((path) => path.endsWith('/index.html'))
  .map((path) => path.slice(0, -'index.html'.length))
  .sort();

if (siteUrl) {
  const languageOf = (path) =>
    LOCALES.find((locale) => path === `/${locale}/` || path.startsWith(`/${locale}/`));

  const entries = pagePaths.map((path) => {
    const locale = languageOf(path);
    const alternates = locale
      ? LOCALES.map(
          (other) =>
            `<xhtml:link rel="alternate" hreflang="${other}" href="${siteUrl}${path.replace(`/${locale}/`, `/${other}/`)}"/>`,
        )
      : [];
    return `  <url><loc>${siteUrl}${path}</loc>${alternates.join('')}</url>`;
  });

  writeFileSync(
    join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
  );

  const robotsPath = join(clientDir, 'robots.txt');
  writeFileSync(
    robotsPath,
    `${readFileSync(robotsPath, 'utf8').trimEnd()}\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
}

console.warn(
  `postbuild: 404.html, CSP on ${htmlFiles.length} pages${siteUrl ? `, sitemap with ${pagePaths.length} URLs` : ' (set VITE_SITE_URL to also generate the sitemap)'}`,
);
