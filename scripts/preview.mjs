// Serves build/client the way GitHub Pages does, so deployment behaviour can be checked locally:
//   - files are served as-is, directories through their index.html (with a redirect to add the slash)
//   - text responses are gzip-compressed, as Pages does
//   - anything else gets 404.html with a 404 status
// Usage: npm run build && npm run preview   (honors VITE_BASE_PATH and PORT)
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
import { loadEnv } from 'vite';

const root = join(import.meta.dirname, '..');
const clientDir = join(root, 'build', 'client');
const port = Number(process.env.PORT ?? 4173);

const rawBase = loadEnv('production', root, 'VITE_').VITE_BASE_PATH || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.data': 'text/x-script',
};

const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function send(req, res, status, body, type = 'text/plain; charset=utf-8') {
  const headers = { 'Content-Type': type, 'Cache-Control': 'max-age=600' };
  const gzip = COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');

  if (gzip) {
    headers['Content-Encoding'] = 'gzip';
    headers['Vary'] = 'Accept-Encoding';
  }
  res.writeHead(status, headers);
  res.end(gzip ? gzipSync(body) : body);
}

function notFound(req, res) {
  const page = join(clientDir, '404.html');
  if (isFile(page)) send(req, res, 404, readFileSync(page), TYPES['.html']);
  else send(req, res, 404, 'Not found');
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  // GitHub Pages serves a project site only under its base path.
  if (!pathname.startsWith(base) && `${pathname}/` !== base) return notFound(req, res);
  if (`${pathname}/` === base) {
    res.writeHead(301, { Location: base });
    return res.end();
  }

  const relativePath = normalize(pathname.slice(base.length)).replace(/^(\.\.[/\\])+/, '');
  const target = join(clientDir, relativePath);
  if (!target.startsWith(clientDir)) return notFound(req, res);

  if (isFile(target)) {
    return send(
      req,
      res,
      200,
      readFileSync(target),
      TYPES[extname(target)] ?? 'application/octet-stream',
    );
  }

  const index = join(target, 'index.html');
  if (isFile(index)) {
    if (!pathname.endsWith('/')) {
      res.writeHead(301, { Location: `${pathname}/${url.search}` });
      return res.end();
    }
    return send(req, res, 200, readFileSync(index), TYPES['.html']);
  }

  return notFound(req, res);
}).listen(port, () => {
  console.warn(`Serving build/client at http://localhost:${port}${base} (GitHub Pages semantics)`);
});
