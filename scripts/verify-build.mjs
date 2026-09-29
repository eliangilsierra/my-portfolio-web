// Checks the prerendered site in build/client against the promises the project makes.
// Run after `npm run build`. Exits with 1 and lists every problem it finds.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { loadEnv } from 'vite';
import { LOCALES } from '../src/domain/locale.ts';
import { getPrerenderPaths } from './prerender-paths.ts';

const root = join(import.meta.dirname, '..');
const clientDir = join(root, 'build', 'client');
const env = loadEnv('production', root, 'VITE_');
const base = (env.VITE_BASE_PATH || '/').replace(/\/?$/, '/');
const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, '');

const problems = [];
const fail = (page, message) => problems.push(`${page}: ${message}`);

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

const files = listFiles(clientDir);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const pageOf = (file) => `/${relative(clientDir, file).split(sep).join('/')}`;

// --- deployment files --------------------------------------------------------------------------
for (const required of ['404.html', '.nojekyll', 'robots.txt', 'favicon.ico']) {
  if (!existsSync(join(clientDir, required))) fail('build', `missing ${required}`);
}
if (existsSync(join(clientDir, '__spa-fallback.html'))) {
  fail('build', '__spa-fallback.html should have been turned into 404.html');
}

// --- fonts are files, never data: URIs (the CSP refuses those) ---------------------------------
for (const file of files.filter((path) => /\.(css|js)$/.test(path))) {
  if (readFileSync(file, 'utf8').includes('data:font')) {
    fail(pageOf(file), 'inlines a font as a data: URI');
  }
}

// --- every promised page exists ----------------------------------------------------------------
const pageUrls = new Set();
for (const path of getPrerenderPaths()) {
  const file = join(clientDir, path === '/' ? '' : path, 'index.html');
  if (!existsSync(file)) fail(path, 'was not prerendered');
  pageUrls.add(path === '/' ? '/' : `${path}/`);
}

// --- per-page checks ---------------------------------------------------------------------------
const INLINE_SCRIPT =
  /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g;

for (const file of htmlFiles) {
  const page = pageOf(file);
  const html = readFileSync(file, 'utf8');
  const isContentPage = LOCALES.some((locale) => page.startsWith(`/${locale}/`));

  // Language
  const lang = /<html[^>]*\blang="([^"]+)"/.exec(html)?.[1];
  if (!lang) fail(page, 'missing <html lang>');
  else if (isContentPage && !page.startsWith(`/${lang}/`)) {
    fail(page, `<html lang="${lang}"> does not match the URL`);
  }

  // Content pages need a title, description and one h1
  if (isContentPage) {
    if (!/<title>[^<]+<\/title>/.test(html)) fail(page, 'missing <title>');
    if (!/<meta name="description" content="[^"]+"/.test(html)) fail(page, 'missing description');
    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1Count !== 1) fail(page, `expected exactly one <h1>, found ${h1Count}`);
    if (siteUrl) {
      if (!html.includes('rel="canonical"')) fail(page, 'missing canonical link');
      for (const locale of LOCALES) {
        if (!html.includes(`hrefLang="${locale}"`)) fail(page, `missing hreflang="${locale}"`);
      }
    }
  }

  // Content-Security-Policy must allow exactly the inline scripts the page has, without unsafe-inline
  const csp = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)?.[1];
  if (!csp) {
    fail(page, 'missing Content-Security-Policy');
  } else {
    const scriptSrc = /script-src([^;]*)/.exec(csp)?.[1] ?? '';
    if (scriptSrc.includes("'unsafe-inline'") || scriptSrc.includes("'unsafe-eval'")) {
      fail(page, 'script-src allows unsafe-inline or unsafe-eval');
    }
    for (const [, code] of html.matchAll(INLINE_SCRIPT)) {
      const hash = `'sha256-${createHash('sha256').update(code).digest('base64')}'`;
      if (!scriptSrc.includes(hash)) fail(page, `inline script not covered by the CSP (${hash})`);
    }
  }

  // Nothing is loaded from another origin (fonts, scripts, styles, images are all self-hosted)
  for (const [, url] of html.matchAll(
    /<(?:script|img)[^>]*\bsrc="(https?:\/\/[^"]+)"|<link[^>]*rel="(?:stylesheet|preload|modulepreload|icon)"[^>]*href="(https?:\/\/[^"]+)"/g,
  )) {
    if (url) fail(page, `loads a third-party resource: ${url}`);
  }

  // Internal links point at pages that exist
  for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
    if (!href.startsWith(base) || href.startsWith('//')) continue;
    const path = `/${href.slice(base.length).split(/[?#]/)[0]}`;
    const normalized = path === '/' || path.endsWith('/') ? path : `${path}/`;
    if (!pageUrls.has(normalized) && !/\.[a-z0-9]+$/i.test(path)) {
      fail(page, `broken internal link: ${href}`);
    }
  }
}

// --- sitemap -----------------------------------------------------------------------------------
if (siteUrl) {
  const sitemapPath = join(clientDir, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    fail('build', 'missing sitemap.xml although VITE_SITE_URL is set');
  } else {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    for (const url of pageUrls) {
      if (!sitemap.includes(`<loc>${siteUrl}${url}</loc>`)) fail('sitemap.xml', `missing ${url}`);
    }
  }
}

if (problems.length > 0) {
  console.error(
    `verify-build: ${problems.length} problem(s)\n${problems.map((p) => `  - ${p}`).join('\n')}`,
  );
  process.exit(1);
}

console.warn(
  `verify-build: ok (${htmlFiles.length} pages, base "${base}"${siteUrl ? `, site ${siteUrl}` : ''})`,
);
