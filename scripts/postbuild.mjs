// GitHub Pages has no server-side rewrites, so unknown paths are served 404.html.
// Publishing a copy of index.html as 404.html lets the SPA router handle deep links.
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.warn('postbuild: copied index.html to 404.html');
