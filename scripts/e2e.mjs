// Builds the site under the same base path the e2e tests use, then runs Playwright against it.
// Extra arguments are passed to Playwright: `npm run e2e -- --project=desktop -g "theme"`.
import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  VITE_BASE_PATH: '/my-portfolio-web/',
  VITE_SITE_URL: 'https://example.github.io/my-portfolio-web',
};

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npm', ['run', 'build']);
run('npx', ['playwright', 'test', ...process.argv.slice(2)]);
