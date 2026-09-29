import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { z } from 'zod';
import { rawContentSchema } from '../src/content/schema.ts';

const DATA_DIR = path.resolve(import.meta.dirname, '../src/content/data');

function readJson(name: string): unknown {
  return JSON.parse(readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

/** Returns a readable description of what is wrong with the content, or `null` when it is valid. */
function findContentProblems(): string | null {
  try {
    const result = rawContentSchema.safeParse({
      projects: readJson('projects.json'),
      pills: readJson('pills.json'),
      about: readJson('about.json'),
    });
    return result.success ? null : z.prettifyError(result.error);
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Validates `src/content/data/*.json` against the content schema when the build or dev server
 * starts, and again whenever a data file changes in dev. Because validation happens here, the
 * runtime bundle ships the data without a schema library.
 */
export function validateContent(): Plugin {
  return {
    name: 'validate-content',

    buildStart() {
      const problems = findContentProblems();
      if (problems) this.error(`Invalid content:\n${problems}`);
    },

    configureServer(server) {
      const report = () => {
        const problems = findContentProblems();
        if (!problems) return;
        server.config.logger.error(`Invalid content:\n${problems}`);
        server.ws.send({
          type: 'error',
          err: { message: `Invalid content:\n${problems}`, stack: '' },
        });
      };

      report();
      server.watcher.on('change', (file) => {
        if (path.resolve(file).startsWith(DATA_DIR)) report();
      });
    },
  };
}
